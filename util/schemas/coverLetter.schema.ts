import z from "zod";

export const coverLetterTones = [
  "professional",
  "warm",
  "confident",
  "concise",
] as const;

export const coverLetterLengths = ["short", "standard", "detailed"] as const;

export const coverLetterSchema = z.object({
  tone: z.enum(coverLetterTones).default("professional"),
  length: z.enum(coverLetterLengths).default("standard"),
});

export const coverLetterUpdateSchema = z.object({
  content: z.string().trim().min(1, "Cover letter can't be empty").max(10000),
});

export type CoverLetterTone = (typeof coverLetterTones)[number];
export type CoverLetterLength = (typeof coverLetterLengths)[number];
export type CoverLetterRequest = z.infer<typeof coverLetterSchema>;
export type CoverLetterUpdateRequest = z.infer<typeof coverLetterUpdateSchema>;
