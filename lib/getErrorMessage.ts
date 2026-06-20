import axios from "axios";

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === "string") {
      try {
        return JSON.parse(data)?.error ?? fallback;
      } catch {
        return fallback;
      }
    }
    return data?.error ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
