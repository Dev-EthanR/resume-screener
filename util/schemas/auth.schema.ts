import z from "zod";

export const loginInSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = loginInSchema.extend({
  password: z.string().min(8, "Password must be atleast 8 characters"),
  fullName: z.string().min(1, "Name is required"),
});

export type LoginType = z.infer<typeof loginInSchema>;
export type SignUpType = z.infer<typeof signUpSchema>;
