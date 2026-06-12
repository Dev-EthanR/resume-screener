import { PDFParse } from "pdf-parse";
import { openai } from "./openai";
import { prisma } from "./prisma";
import { AnalyzeResult } from "@/entities/AnalyzeResult";

export async function runAnalysis(
  processId: string,
  fileBuffer: Buffer,
  description: string,
) {
  try {
    // Phase 1: Parse PDF
    await prisma.analyseProcess.update({
      where: { id: processId },
      data: { parsingStatus: "generating" },
    });
    const parser = new PDFParse({ data: fileBuffer });
    const pdfData = await parser.getText();
    const resumeText = pdfData.text;
    await prisma.analyseProcess.update({
      where: { id: processId },
      data: { parsingStatus: "done" },
    });

    // Phase 2: Extract job requirements
    await prisma.analyseProcess.update({
      where: { id: processId },
      data: { readingStatus: "generating" },
    });
    const requirements = await extractRequirements(description);
    await prisma.analyseProcess.update({
      where: { id: processId },
      data: { readingStatus: "done" },
    });

    // Phase 3: Compare resume to requirements
    await prisma.analyseProcess.update({
      where: { id: processId },
      data: { comparingStatus: "generating" },
    });
    const {
      score,
      summary,
      skills: { matched, missing },
    } = await compareResumeToJob(resumeText, requirements);
    await prisma.analyseProcess.update({
      where: { id: processId },
      data: { comparingStatus: "done" },
    });

    // Phase 4: Generate improvement suggestions
    await prisma.analyseProcess.update({
      where: { id: processId },
      data: { generatingStatus: "generating" },
    });
    const { improvementBullets } = await generateImprovements(
      resumeText,
      description,
      matched,
      missing,
    );
    await prisma.analyseProcess.update({
      where: { id: processId },
      data: {
        generatingStatus: "done",
        result: {
          score,
          summary,
          skills: { matched, missing },
          improvementBullets,
        },
      },
    });
  } catch (error) {
    console.error(`Analysis failed for process ${processId}:`, error);
  }
}

async function extractRequirements(description: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.4-nano-2026-03-17",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'Extract the key required skills, technologies, tools, and qualifications from the job description. Each item must be a short label of 1–3 words (e.g. "React", "CI/CD", "PostgreSQL", "Team Leadership"). Return JSON: { "requirements": string[] }',
      },
      { role: "user", content: description },
    ],
  });
  const data = JSON.parse(response.choices[0].message.content!);
  return data.requirements as string[];
}

async function compareResumeToJob(
  resumeText: string,
  requirements: string[],
): Promise<Omit<AnalyzeResult, "improvementBullets">> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.4-mini-2026-03-17",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'You are a senior recruiter screening resumes. Given the resume and job requirements, decide how much of a good fit is the user for the proposed job — be realistic and critical, not generous. Score 0–100 where: 0–30 = bad job match (clear gaps, wrong level, missing must-haves), 31–60 = needs work (some fit but notable gaps), 61–80 = Good match (solid match with minor gaps), 81–100 = Strong match (closely matches the role). Also identify matched and missing skills as short labels (1–3 words, e.g. "React", "CI/CD", "PostgreSQL"),  Give a short summary (max 15 words) of how well the user fits the role, starting with one of: "You\'re a strong fit", "You\'re a good fit", "You\'re a weak fit", or "You\'re a bad fit", followed by a brief reason or suggestion, written as a complete sentence without using an ellipsis. Return JSON: { "score": number, "matched": string[], "missing": string[], "summary": string }',
      },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob Requirements:\n${requirements.join("\n")}`,
      },
    ],
  });
  const data = JSON.parse(response.choices[0].message.content!);
  return {
    score: data.score,
    skills: {
      matched: data.matched,
      missing: data.missing,
    },
    summary: data.summary,
  };
}

async function generateImprovements(
  resumeText: string,
  description: string,
  matched: string[],
  missing: string[],
): Promise<Pick<AnalyzeResult, "improvementBullets">> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.4-mini-2026-03-17",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'You are an expert resume writer. Write 4-6 resume bullet points the candidate can paste directly into their resume. Each bullet point must have the user stand out more to the job description. Be tailored to close the gap on missing skills; read exactly as it would appear on a professional resume — no advice, no prefixes like "Add:" or "Consider:". Return JSON: { "improvementBullets": string[] }',
      },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\nJob Description:\n${description}\n\nAlready matched: ${matched.join(", ")}\nMissing: ${missing.join(", ")}`,
      },
    ],
  });
  const data = JSON.parse(response.choices[0].message.content!);
  return { improvementBullets: data.improvementBullets as string[] };
}
