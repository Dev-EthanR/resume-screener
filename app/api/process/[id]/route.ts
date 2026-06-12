import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const process = await prisma.analyseProcess.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!process)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(process);
}
