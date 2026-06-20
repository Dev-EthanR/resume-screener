import { AnalyzeResult } from "@/entities/AnalyzeResult";
import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import {
  CoverLetterLength,
  CoverLetterTone,
  coverLetterSchema,
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

export const MAX_COVER_LETTERS = 3;

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

  const existingCount = await prisma.coverLetter.count({
    where: { processId: id },
  });
  if (existingCount >= MAX_COVER_LETTERS) {
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
  let fullText = "";
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            fullText += text;
            controller.enqueue(encoder.encode(text));
          }
        }
        if (fullText.trim()) {
          await prisma.coverLetter.create({
            data: { processId: id, tone, length, content: fullText },
          });
        }
      } catch (error) {
        console.error(`Cover letter generation failed for ${id}:`, error);
      } finally {
        controller.close();
      }
    },
    cancel() {
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
