import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content, expiresInSeconds, maxViews } = body;

  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "content is required" },
      { status: 400 }
    );
  }

  const expiresAt =
    typeof expiresInSeconds === "number"
      ? new Date(Date.now() + expiresInSeconds * 1000)
      : null;

  const paste = await prisma.paste.create({
    data: {
      content,
      expiresAt,
      maxViews: typeof maxViews === "number" ? maxViews : null,
    },
  });

  return NextResponse.json({
    id: paste.id,
    url: `http://localhost:3000/api/pastes/${paste.id}`,
  });
}
