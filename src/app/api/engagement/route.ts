import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// ─── GET: return all engagement state for the current user ───────────────────
export async function GET(request: NextRequest) {
  const { prisma } = await import("@/lib/prisma");

  const token = request.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const userId = payload.userId;

  try {
    const rows = await prisma.engagement.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    // Build aggregated state from raw events
    const savedIds: string[] = [];
    const likedIds: string[] = [];
    const dislikedIds: string[] = [];
    const recentIds: string[] = [];
    const articleMeta: Record<string, { title: string; summary?: string; source?: string; date?: string; image?: string; category?: string }> = {};

    // Track toggles (each row is an individual action event)
    const saveSet = new Set<string>();
    const likeSet = new Set<string>();
    const dislikeSet = new Set<string>();

    // Process newest-first so latest state wins
    for (const row of rows) {
      // Parse optional metaJson stored in context field
      let meta: Record<string, string> | null = null;
      if (row.context) {
        try { meta = JSON.parse(row.context); } catch { /* ignore */ }
      }

      if (meta && row.articleId) {
        if (!articleMeta[row.articleId]) {
          articleMeta[row.articleId] = {
            title: meta.title || "",
            summary: meta.summary,
            source: meta.source,
            date: meta.date,
            image: meta.image,
            category: meta.category,
          };
        }
      }

      if (row.actionType === "save" && !saveSet.has(row.articleId)) {
        saveSet.add(row.articleId);
        savedIds.push(row.articleId);
      }
      if (row.actionType === "like" && !likeSet.has(row.articleId)) {
        likeSet.add(row.articleId);
        likedIds.push(row.articleId);
      }
      if (row.actionType === "dislike" && !dislikeSet.has(row.articleId)) {
        dislikeSet.add(row.articleId);
        dislikedIds.push(row.articleId);
      }
      if (row.actionType === "read" && !recentIds.includes(row.articleId)) {
        recentIds.push(row.articleId);
      }
    }

    return NextResponse.json({
      savedIds,
      likedIds,
      dislikedIds,
      recentIds: recentIds.slice(0, 10),
      articleMeta,
    });
  } catch (error) {
    console.error("Engagement GET error:", error);
    return NextResponse.json({ error: "Failed to load engagement" }, { status: 500 });
  }
}

// ─── POST: record a single engagement action ─────────────────────────────────
export async function POST(request: NextRequest) {
  const { prisma } = await import("@/lib/prisma");

  const token = request.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const userId = payload.userId;

  try {
    const body = await request.json();
    const { articleId, actionType, meta } = body as {
      articleId: string;
      actionType: "save" | "unsave" | "like" | "unlike" | "dislike" | "undislike" | "read";
      meta?: { title: string; summary?: string; source?: string; date?: string; image?: string; category?: string };
    };

    if (!articleId || !actionType) {
      return NextResponse.json({ error: "Missing articleId or actionType" }, { status: 400 });
    }

    // For toggle-off actions (unsave / unlike / undislike) we delete the matching positive row
    if (actionType === "unsave") {
      await prisma.engagement.deleteMany({ where: { userId, articleId, actionType: "save" } });
      return NextResponse.json({ ok: true });
    }
    if (actionType === "unlike") {
      await prisma.engagement.deleteMany({ where: { userId, articleId, actionType: "like" } });
      return NextResponse.json({ ok: true });
    }
    if (actionType === "undislike") {
      await prisma.engagement.deleteMany({ where: { userId, articleId, actionType: "dislike" } });
      return NextResponse.json({ ok: true });
    }

    // Upsert to avoid duplicates for save/like/dislike
    if (actionType === "save" || actionType === "like" || actionType === "dislike") {
      // Remove opposite state first
      if (actionType === "like") {
        await prisma.engagement.deleteMany({ where: { userId, articleId, actionType: "dislike" } });
      }
      if (actionType === "dislike") {
        await prisma.engagement.deleteMany({ where: { userId, articleId, actionType: "like" } });
      }

      await prisma.engagement.create({
        data: {
          userId,
          articleId,
          actionType,
          context: meta ? JSON.stringify(meta) : null,
        },
      });
      return NextResponse.json({ ok: true });
    }

    // For "read" — always insert (track history)
    await prisma.engagement.create({
      data: {
        userId,
        articleId,
        actionType: "read",
        context: meta ? JSON.stringify(meta) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Engagement POST error:", error);
    return NextResponse.json({ error: "Failed to record engagement" }, { status: 500 });
  }
}
