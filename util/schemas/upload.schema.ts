import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const DESCRIPTION_MAX_LENGTH = 8000;

export const uploadSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length > 0, "File is required")
    .refine(
      (files) => !files?.[0] || files[0].size <= MAX_FILE_SIZE,
      "File size must be under 5MB",
    )
    .refine(
      (files) => !files?.[0] || files[0].type === "application/pdf",
      "Only PDF files are accepted",
    ),
  description: z
    .string()
    .min(1, "Job description is required")
    .max(
      DESCRIPTION_MAX_LENGTH,
      "Job description cannot be more than 8000 characters",
    ),
});

export type UploadType = z.infer<typeof uploadSchema>;
