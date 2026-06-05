"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LoginType, SignUpType } from "@/util/schemas/auth.schema";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type AuthState = { error: string } | undefined;

const handleAuthError = (
  error: unknown,
  fallbackMessage?: string,
): AuthState => {
  if (isRedirectError(error)) throw error;
  if (error instanceof AuthError) return { error: "Invalid email or password" };
  return {
    error: fallbackMessage ?? "Something went wrong. Please try again.",
  };
};

const signInWithCredentials = async (email: string, password: string) => {
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
};

export async function loginAction(formData: LoginType): Promise<AuthState> {
  try {
    await signInWithCredentials(formData.email, formData.password);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function registerAction(formData: SignUpType): Promise<AuthState> {
  const { name, email, password } = formData;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) return { error: "An account with that email already exists" };

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, password: hashed } });

  try {
    await signInWithCredentials(email, password);
  } catch (error) {
    return handleAuthError(
      error,
      "Account created but sign in failed. Please sign in manually.",
    );
  }
}
