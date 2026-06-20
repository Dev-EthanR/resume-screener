import { AnalyzeResult } from "@/entities/AnalyzeResult";
import { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import {
  CoverLetterLength,
  CoverLetterTone,
  MAX_COVER_LETTERS,
  coverLetterSchema,
  encodeLetterIdMarker,
  encodeStreamErrorMarker,
} from "@/util/schemas/coverLetter.schema";
import { NextRequest, NextResponse } from "next/server";

const toneInstructions: Record<CoverLetterTone, string> = {
  professional: "a clear, polished, professional tone",
  warm: "a warm, personable, and friendly tone while remaining professional",
  confident:
    "a confident, assertive tone that highlights achievements boldly",
  concise: "a concise, no-frills tone with short sentences and no filler",
};

const lengthInstructions: Record<CoverLetterLength, string> = {
  short: "about 150-200 words across 2 short paragraphs",
  standard: "about 250-350 words across 3-4 paragraphs",
  detailed: "about 400-500 words across 4-5 paragraphs",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const letters = await prisma.coverLetter.findMany({
    where: { processId: id, process: { userId: session.user.id } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(letters);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = coverLetterSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { tone, length } = parsed.data;

  const process = await prisma.analyseProcess.findUnique({
    where: { id, userId: session.user.id },
  });

  if (
    !process ||
    process.generatingStatus !== "done" ||
    !process.resumeText ||
    !process.jobDescription
  ) {
    return NextResponse.json(
      { error: "Cover letter isn't available for this analysis" },
      { status: 404 },
    );
  }

  // Reserve a slot atomically: count + create happen in one Serializable
  // transaction so two concurrent requests can't both read a count under the
  // limit before either insert commits. The reservation uses empty content —
  // it's filled in (or deleted, on failure) once generation finishes below.
  let reserved;
  try {
    reserved = await prisma.$transaction(
      async (tx) => {
        const existingCount = await tx.coverLetter.count({
          where: { processId: id },
        });
        if (existingCount >= MAX_COVER_LETTERS) return null;
        return tx.coverLetter.create({
          data: { processId: id, tone, length, content: "" },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    console.error(`Cover letter reservation failed for ${id}:`, error);
    return NextResponse.json(
      {
        error:
          "Someone just generated a cover letter for this analysis — please try again.",
      },
      { status: 409 },
    );
  }

  if (!reserved) {
    return NextResponse.json(
      {
        error: `You've reached the limit of ${MAX_COVER_LETTERS} cover letters for this analysis.`,
      },
      { status: 403 },
    );
  }

  const { summary, skills } = process.result as unknown as AnalyzeResult;

  const stream = await openai.chat.completions.create({
    model: "gpt-5.4-mini-2026-03-17",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are an expert cover letter writer. Write a complete, ready-to-send cover letter tailored to the specific job and candidate. Write in ${toneInstructions[tone]}. Keep the letter ${lengthInstructions[length]}. Use concrete details from the candidate's resume and the job description — do not write generic filler. Do not use placeholder brackets like "[Company Name]"; use the real company and role names given. Open with "Dear Hiring Manager," and close with "Sincerely," followed by ${session.user.name ? `the candidate's name, ${session.user.name}` : "a blank line for the candidate's name"}. Return only the letter body, no subject line, no commentary.`,
      },
      {
        role: "user",
        content: `Job title: ${process.jobTitle ?? "the role"}\nCompany: ${process.companyName ?? "the company"}\n\nJob description:\n${process.jobDescription}\n\nCandidate resume:\n${process.resumeText}\n\nFit summary: ${summary}\nMatched skills: ${skills.matched.join(", ")}\nSkills to address carefully (not strong matches): ${skills.missing.join(", ")}`,
      },
    ],
  });

  const encoder = new TextEncoder();
  let cancelled = false;
  const readable = new ReadableStream({
    async start(controller) {
      let fullText = "";
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            fullText += text;
            controller.enqueue(encoder.encode(text));
          }
        }
        if (!fullText.trim()) {
          throw new Error("Cover letter generation produced no content");
        }
        await prisma.coverLetter.update({
          where: { id: reserved.id },
          data: { content: fullText },
        });
        if (!cancelled) {
          try {
            controller.enqueue(
              encoder.encode(encodeLetterIdMarker(reserved.id)),
            );
          } catch {
            // consumer already disconnected
          }
        }
      } catch (error) {
        console.error(`Cover letter generation failed for ${id}:`, error);
        // Release the reserved slot — a failed generation shouldn't cost
        // the user one of their 3 attempts.
        await prisma.coverLetter
          .delete({ where: { id: reserved.id } })
          .catch(() => {});
        if (!cancelled) {
          try {
            controller.enqueue(encoder.encode(encodeStreamErrorMarker()));
          } catch {
            // consumer already disconnected
          }
        }
      } finally {
        try {
          controller.close();
        } catch {
          // already closed/cancelled
        }
      }
    },
    cancel() {
      cancelled = true;
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
