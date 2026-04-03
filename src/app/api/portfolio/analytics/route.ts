import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

type PortfolioAssetType = "stock" | "mutual_fund" | "etf" | "commodity" | "other";

interface PortfolioAssetMeta {
  type?: PortfolioAssetType;
  exchange?: string;
  source?: string;
}

function parseHoldingMeta(notes?: string | null): PortfolioAssetMeta {
  if (!notes) {
    return {};
  }

  try {
    const parsed = JSON.parse(notes);
    return parsed && typeof parsed === "object" ? parsed as PortfolioAssetMeta : {};
  } catch {
    return {};
  }
}

function serializeHoldingMeta(meta: PortfolioAssetMeta) {
  return JSON.stringify(meta);
}

async function getAuthenticatedUserId(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    return null;
  }

  return verifyToken(token)?.userId || null;
}

async function getOrCreatePortfolio(userId: string) {
  const { prisma } = await import("@/lib/prisma");

  const existing = await prisma.portfolio.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  if (existing) {
    return existing;
  }

  return prisma.portfolio.create({
    data: {
      userId,
      name: "My Portfolio",
      description: "Default portfolio for tracked securities.",
    },
  });
}

function mapHoldingToAsset(
  holding: {
    id: string;
    symbol: string;
    name: string;
    notes?: string | null;
    sector?: string | null;
  }
) {
  const meta = parseHoldingMeta(holding.notes);

  return {
    id: holding.id,
    symbol: holding.symbol,
    name: holding.name,
    type: meta.type || "stock",
    exchange: meta.exchange,
    source: meta.source || holding.sector || "Portfolio",
  };
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/prisma");
    const portfolio = await getOrCreatePortfolio(userId);

    const holdings = await prisma.holding.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        symbol: true,
        name: true,
        quantity: true,
        purchasePrice: true,
        currentPrice: true,
        purchaseDate: true,
        sector: true,
        notes: true,
      },
    });

    return NextResponse.json({
      success: true,
      portfolioId: portfolio.id,
      assets: holdings.map(mapHoldingToAsset),
      portfolio: {
        holdings,
      },
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();
    const {
      symbol,
      name,
      type,
      exchange,
      source,
    }: {
      symbol?: string;
      name?: string;
      type?: PortfolioAssetType;
      exchange?: string;
      source?: string;
    } = body;

    const normalizedSymbol = symbol?.trim().toUpperCase();
    const normalizedName = name?.trim();

    if (!normalizedSymbol || !normalizedName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const portfolio = await getOrCreatePortfolio(userId);

    const existing = await prisma.holding.findFirst({
      where: {
        portfolioId: portfolio.id,
        symbol: normalizedSymbol,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        symbol: true,
        name: true,
        notes: true,
        sector: true,
      },
    });

    const meta = serializeHoldingMeta({
      type: type || "stock",
      exchange,
      source,
    });

    if (existing) {
      const updated = await prisma.holding.update({
        where: { id: existing.id },
        data: {
          name: normalizedName,
          notes: meta,
          sector: source || null,
        },
        select: {
          id: true,
          symbol: true,
          name: true,
          notes: true,
          sector: true,
        },
      });

      return NextResponse.json({
        success: true,
        asset: mapHoldingToAsset(updated),
      });
    }

    const holding = await prisma.holding.create({
      data: {
        portfolioId: portfolio.id,
        symbol: normalizedSymbol,
        name: normalizedName,
        quantity: 1,
        purchasePrice: 1,
        currentPrice: 1,
        purchaseDate: new Date(),
        sector: source || null,
        notes: meta,
      },
      select: {
        id: true,
        symbol: true,
        name: true,
        notes: true,
        sector: true,
      },
    });

    return NextResponse.json({
      success: true,
      asset: mapHoldingToAsset(holding),
    });
  } catch (error) {
    console.error("Error creating holding:", error);
    return NextResponse.json(
      { error: "Failed to create holding" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();
    const holdingId = body?.holdingId;

    if (!holdingId || typeof holdingId !== "string") {
      return NextResponse.json(
        { error: "Missing holdingId" },
        { status: 400 }
      );
    }

    const holding = await prisma.holding.findUnique({
      where: { id: holdingId },
      select: {
        id: true,
        portfolio: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!holding || holding.portfolio.userId !== userId) {
      return NextResponse.json(
        { error: "Holding not found" },
        { status: 404 }
      );
    }

    await prisma.holding.delete({
      where: { id: holdingId },
    });

    return NextResponse.json({
      success: true,
      deleted: true,
    });
  } catch (error) {
    console.error("Error deleting holding:", error);
    return NextResponse.json(
      { error: "Failed to delete holding" },
      { status: 500 }
    );
  }
}
