import { runAnalysis } from "@/lib/analyse";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadSchema } from "@/util/schemas/upload.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description");
    const companyName = formData.get("company");
    const jobTitle = formData.get("position");

    const parsed = uploadSchema.safeParse({
      file,
      description,
      companyName,
      jobTitle,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid" }, { status: 400 });
    }

    const {
      file: validatedFile,
      description: validatedDescription,
      company,
      position,
    } = parsed.data;

    const process = await prisma.analyseProcess.create({
      data: {
        userId: session.user.id,
        result: {},
        fileName: file.name,
        company,
        position,
      },
    });

    const buffer = Buffer.from(await validatedFile.arrayBuffer());
    runAnalysis(process.id, buffer, validatedDescription);

    return NextResponse.json({ id: process.id }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
