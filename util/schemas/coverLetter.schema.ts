import z from "zod";

export const coverLetterTones = [
  "professional",
  "warm",
  "confident",
  "concise",
] as const;

export const coverLetterLengths = ["short", "standard", "detailed"] as const;

export const MAX_COVER_LETTERS = 3;

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

const STREAM_ERROR_MARKER = "\n\n[[STREAM_ERROR]]";
const LETTER_ID_MARKER_PATTERN = /\n\n\[\[LETTER_ID:([^\]]+)\]\]$/;

export function encodeStreamErrorMarker(): string {
  return STREAM_ERROR_MARKER;
}

export function encodeLetterIdMarker(letterId: string): string {
  return `\n\n[[LETTER_ID:${letterId}]]`;
}

export interface StreamResult {
  text: string;
  letterId: string | null;
  streamError: boolean;
}

export function parseStreamResult(rawText: string): StreamResult {
  if (rawText.endsWith(STREAM_ERROR_MARKER)) {
    return {
      text: rawText.slice(0, -STREAM_ERROR_MARKER.length),
      letterId: null,
      streamError: true,
    };
  }
  const match = rawText.match(LETTER_ID_MARKER_PATTERN);
  if (match) {
    return {
      text: rawText.slice(0, match.index),
      letterId: match[1],
      streamError: false,
    };
  }
  return { text: rawText, letterId: null, streamError: false };
}
