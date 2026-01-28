import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) {
      return NextResponse.json(
        { error: "not found" },
        { status: 404 }
      );
    }

    if (paste.expiresAt && paste.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "expired" },
        { status: 410 }
      );
    }

    if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
      return NextResponse.json(
        { error: "view limit reached" },
        { status: 410 }
      );
    }

    await prisma.paste.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      id: paste.id,
      content: paste.content,
      viewCount: paste.viewCount + 1,
    });
  } catch (err) {
    console.error("GET /api/pastes/[id] error:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
