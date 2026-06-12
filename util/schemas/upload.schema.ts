import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const DESCRIPTION_MAX_LENGTH = 8000;

export const uploadSchema = z.object({
  file: z
    .any()
    .refine((f): f is File => f instanceof File, "File is required")
    .refine((f: File) => f.size <= MAX_FILE_SIZE, "File size must be under 5MB")
    .refine(
      (f: File) => f.type === "application/pdf",
      "Only PDF files are accepted",
    ),
  description: z
    .string()
    .min(1, "Job description is required")
    .max(
      DESCRIPTION_MAX_LENGTH,
      "Job description cannot be more than 8000 characters",
    )
    .trim(),
});

export type UploadType = z.infer<typeof uploadSchema>;
