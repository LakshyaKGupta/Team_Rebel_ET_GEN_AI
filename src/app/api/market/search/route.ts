import { NextRequest, NextResponse } from "next/server";
import { fallbackMarketSearchResults } from "@/lib/data";
import { MarketSearchResult, AssetType } from "@/lib/types";

const SEC_HEADERS = {
  "User-Agent": "ET AI Demo newsroom@example.com",
  Accept: "application/json",
};
const SEC_FETCH_OPTIONS = {
  headers: SEC_HEADERS,
  next: { revalidate: 60 * 60 * 24 },
  signal: AbortSignal.timeout(2500),
};

function normalizeType(input: string | null): AssetType | "all" {
  if (!input) return "all";
  if (input === "stock" || input === "mutual_fund" || input === "etf" || input === "commodity" || input === "other") {
    return input;
  }
  return "all";
}

function filterResults(results: MarketSearchResult[], query: string, type: AssetType | "all") {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredByType = type === "all" ? results : results.filter((result) => result.type === type);

  return filteredByType
    .filter((result) => {
      const haystack = `${result.name} ${result.symbol} ${result.exchange || ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .slice(0, 10);
}

function looksLikeTicker(value: unknown) {
  return typeof value === "string" && /^[A-Z0-9.-]{1,10}$/.test(value.trim());
}

function parseSecArrayRow(row: unknown[], index: number, fields?: string[]) {
  const fieldMap = fields?.reduce<Record<string, unknown>>((acc, field, fieldIndex) => {
    acc[field] = row[fieldIndex];
    return acc;
  }, {});

  const fieldTicker = String(fieldMap?.ticker || fieldMap?.symbol || "").trim();
  const fieldName = String(fieldMap?.title || fieldMap?.name || "").trim();
  const fieldExchange = String(fieldMap?.exchange || fieldMap?.market || "").trim();

  if (fieldTicker && fieldName) {
    return {
      id: `sec-stock-${index}-${fieldTicker}`,
      name: fieldName,
      symbol: fieldTicker,
      type: "stock" as const,
      exchange: fieldExchange || undefined,
      source: "SEC listed companies",
    };
  }

  if (row.length >= 4 && looksLikeTicker(row[2])) {
    const name = String(row[1] || "").trim();
    const symbol = String(row[2] || "").trim();
    const exchange = String(row[3] || "").trim();
    if (!name || !symbol) return null;
    return {
      id: `sec-stock-${index}-${symbol}`,
      name,
      symbol,
      type: "stock" as const,
      exchange: exchange || undefined,
      source: "SEC listed companies",
    };
  }

  if (row.length >= 3 && looksLikeTicker(row[0])) {
    const symbol = String(row[0] || "").trim();
    const name = String(row[1] || "").trim();
    const exchange = String(row[2] || "").trim();
    if (!name || !symbol) return null;
    return {
      id: `sec-stock-${index}-${symbol}`,
      name,
      symbol,
      type: "stock" as const,
      exchange: exchange || undefined,
      source: "SEC listed companies",
    };
  }

  return null;
}

function parseSecCompanyTickerPayload(payload: unknown): MarketSearchResult[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const payloadObject = payload as Record<string, unknown>;
  const fields = Array.isArray(payloadObject.fields)
    ? payloadObject.fields.filter((value): value is string => typeof value === "string")
    : undefined;

  if (Array.isArray(payloadObject.data)) {
    return payloadObject.data
      .map((row, index) => {
        if (Array.isArray(row)) {
          return parseSecArrayRow(row, index, fields);
        }

        if (!row || typeof row !== "object") return null;
        const record = row as Record<string, unknown>;
        const ticker = String(record.ticker || record.symbol || "").trim();
        const name = String(record.title || record.name || "").trim();
        if (!ticker || !name) return null;
        return {
          id: `sec-stock-${index}-${ticker}`,
          name,
          symbol: ticker,
          type: "stock" as const,
          exchange: record.exchange ? String(record.exchange) : undefined,
          source: "SEC listed companies",
        };
      })
      .filter(Boolean) as MarketSearchResult[];
  }

  return Object.values(payloadObject as Record<string, { ticker?: string; title?: string; exchange?: string }>)
    .map((row, index) => {
      if (!row?.ticker || !row?.title) return null;
      return {
        id: `sec-stock-${index}-${row.ticker}`,
        name: row.title,
        symbol: row.ticker,
        type: "stock" as const,
        exchange: row.exchange,
        source: "SEC listed companies",
      };
    })
    .filter(Boolean) as MarketSearchResult[];
}

function parseSecFundPayload(payload: unknown): MarketSearchResult[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload
      .map((row, index) => {
        if (!row || typeof row !== "object") return null;
        const record = row as Record<string, unknown>;
        const ticker = String(record.ticker || "").trim();
        const name = String(record.name || record.title || record.series_name || "").trim();
        if (!ticker || !name) return null;
        return {
          id: `sec-fund-${index}-${ticker}`,
          name,
          symbol: ticker,
          type: "mutual_fund" as const,
          source: "SEC fund tickers",
        };
      })
      .filter(Boolean) as MarketSearchResult[];
  }

  const payloadObject = payload as Record<string, unknown>;
  if (Array.isArray(payloadObject.data)) {
    return payloadObject.data
      .map((row, index) => {
        if (!row || typeof row !== "object") return null;
        const record = row as Record<string, unknown>;
        const ticker = String(record.ticker || record.class_ticker || record.symbol || "").trim();
        const name = String(record.name || record.series_name || record.title || record.class_name || "").trim();
        if (!ticker || !name) return null;
        const lowerName = name.toLowerCase();
        return {
          id: `sec-fund-${index}-${ticker}`,
          name,
          symbol: ticker,
          type: lowerName.includes("etf") || lowerName.includes("trust") ? ("etf" as const) : ("mutual_fund" as const),
          source: "SEC fund tickers",
        };
      })
      .filter(Boolean) as MarketSearchResult[];
  }

  return Object.values(payloadObject)
    .map((row, index) => {
      if (!row || typeof row !== "object") return null;
      const record = row as Record<string, unknown>;
      const ticker = String(record.ticker || record.class_ticker || "").trim();
      const name = String(record.series_name || record.name || record.title || "").trim();
      if (!ticker || !name) return null;
      const lowerName = name.toLowerCase();
      return {
        id: `sec-fund-${index}-${ticker}`,
        name,
        symbol: ticker,
        type: lowerName.includes("etf") ? ("etf" as const) : ("mutual_fund" as const),
        source: "SEC fund tickers",
      };
    })
    .filter(Boolean) as MarketSearchResult[];
}

async function fetchOfficialResults(query: string, type: AssetType | "all") {
  const requests: Promise<Response>[] = [];

  if (type === "all" || type === "stock" || type === "etf") {
    requests.push(fetch("https://www.sec.gov/files/company_tickers_exchange.json", SEC_FETCH_OPTIONS));
  }

  if (type === "all" || type === "mutual_fund" || type === "etf") {
    requests.push(fetch("https://www.sec.gov/files/company_tickers_mf.json", SEC_FETCH_OPTIONS));
  }

  const settled = await Promise.allSettled(requests);
  const results: MarketSearchResult[] = [];

  for (const item of settled) {
    if (item.status !== "fulfilled" || !item.value.ok) {
      continue;
    }

    const payload = await item.value.json();
    if (item.value.url.includes("company_tickers_mf")) {
      results.push(...parseSecFundPayload(payload));
    } else {
      results.push(...parseSecCompanyTickerPayload(payload));
    }
  }

  return filterResults(results, query, type);
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  const type = normalizeType(request.nextUrl.searchParams.get("type"));

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const officialResults = await fetchOfficialResults(query, type);
    if (officialResults.length > 0) {
      return NextResponse.json({ results: officialResults, source: "SEC" });
    }
  } catch (error) {
    console.error("Market search fallback triggered:", error);
  }

  return NextResponse.json({
    results: filterResults(fallbackMarketSearchResults, query, type),
    source: "fallback",
  });
}
