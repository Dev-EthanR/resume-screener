import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadSchema } from "@/util/schemas/upload.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = req.body;
  const session = await auth();

  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const uploadParse = uploadSchema.safeParse(body);
    if (!uploadParse.success)
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const { description, file } = uploadParse.data;

    const process = await prisma.analyseProcess.create({
      data: {
        userId: session.user.id,
        result: {},
      },
    });

    if (process.parsingStatus === "pending") {
      parseFile(file);
    }

    return NextResponse.json(process, { status: 202 });
  } catch (error) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

function parseFile(file: File) {
  console.log(file.name);
}
