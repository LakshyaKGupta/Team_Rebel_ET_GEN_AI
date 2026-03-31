import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserPreferences } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user's saved stories from database
    const savedStories = await prisma.savedStory.findMany({
      where: { userId: payload.userId },
      include: { story: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      savedStories,
      count: savedStories.length,
      userId: payload.userId,
    });
  } catch (error) {
    console.error("Saved items fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { storyId, bookmarked } = body;

    if (!storyId) {
      return NextResponse.json({ error: "Missing storyId" }, { status: 400 });
    }

    if (bookmarked) {
      // Create saved story
      const savedStory = await prisma.savedStory.create({
        data: {
          userId: payload.userId,
          storyId,
        },
      });
      return NextResponse.json({ saved: true, savedStory });
    } else {
      // Remove saved story
      await prisma.savedStory.deleteMany({
        where: {
          userId: payload.userId,
          storyId,
        },
      });
      return NextResponse.json({ saved: false });
    }
  } catch (error) {
    console.error("Save item error:", error);
    return NextResponse.json(
      { error: "Failed to save item" },
      { status: 500 }
    );
  }
}
