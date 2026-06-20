import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { coverLetterUpdateSchema } from "@/util/schemas/coverLetter.schema";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; letterId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, letterId } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = coverLetterUpdateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const letter = await prisma.coverLetter.findFirst({
    where: {
      id: letterId,
      processId: id,
      process: { userId: session.user.id },
    },
  });
  if (!letter)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.coverLetter.update({
    where: { id: letterId },
    data: { content: parsed.data.content },
  });

  return NextResponse.json(updated);
}
