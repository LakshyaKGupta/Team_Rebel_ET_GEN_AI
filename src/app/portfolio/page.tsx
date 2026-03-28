"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, Plus, Search, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { assessPortfolioImpact, getTopicsForUser, starterPortfolioAssets } from "@/lib/data";
import { readPortfolioAssets, writePortfolioAssets } from "@/lib/demo-state";
import { apiSearchListedSecurities } from "@/lib/api";
import { AssetType, MarketSearchResult, PortfolioAsset } from "@/lib/types";

const assetTypeOptions: { value: AssetType; label: string }[] = [
  { value: "stock", label: "Stock" },
  { value: "mutual_fund", label: "Mutual fund" },
  { value: "etf", label: "ETF" },
  { value: "commodity", label: "Commodity" },
  { value: "other", label: "Other" },
];

export default function PortfolioPage() {
  const router = useRouter();
  const { preferences } = useUser();
  const userType = preferences.userType || "exploring";
  const topics = useMemo(() => getTopicsForUser(userType), [userType]);

  const [assets, setAssets] = useState<PortfolioAsset[]>(starterPortfolioAssets);
  const [draftType, setDraftType] = useState<AssetType>("stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MarketSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSecurity, setSelectedSecurity] = useState<MarketSearchResult | null>(null);
  const [manualName, setManualName] = useState("");
  const [manualSymbol, setManualSymbol] = useState("");

  useEffect(() => {
    setAssets(readPortfolioAssets(starterPortfolioAssets));
  }, []);

  useEffect(() => {
    assets.forEach((asset) => {
      const impact = assessPortfolioImpact(asset, topics);
      router.prefetch(`/briefing/${impact.topic.id}`);
    });
  }, [assets, router, topics]);

  useEffect(() => {
    const catalogBackedType = draftType === "stock" || draftType === "mutual_fund" || draftType === "etf";
    if (!catalogBackedType) {
      setSearchResults([]);
      setSelectedSecurity(null);
      return;
    }

    if (searchQuery.trim().length < 2 || selectedSecurity) {
      setSearchResults([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await apiSearchListedSecurities(searchQuery, draftType);
        setSearchResults(response.results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery, draftType, selectedSecurity]);

  const resetDraft = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedSecurity(null);
    setManualName("");
    setManualSymbol("");
    setDraftType("stock");
  };

  const addAsset = () => {
    const catalogBackedType = draftType === "stock" || draftType === "mutual_fund" || draftType === "etf";
    const name = catalogBackedType ? selectedSecurity?.name?.trim() || "" : manualName.trim();
    const symbol = catalogBackedType ? selectedSecurity?.symbol?.trim().toUpperCase() || "" : manualSymbol.trim().toUpperCase();

    if (!name || !symbol) return;

    const nextAssets = [
      {
        id: `${symbol}-${Date.now()}`,
        name,
        symbol,
        type: catalogBackedType ? selectedSecurity?.type || draftType : draftType,
        exchange: selectedSecurity?.exchange,
        source: selectedSecurity?.source || (catalogBackedType ? "Catalog" : "Manual"),
      },
      ...assets,
    ];

    setAssets(nextAssets);
    writePortfolioAssets(nextAssets);
    resetDraft();
  };

  const removeAsset = (assetId: string) => {
    const nextAssets = assets.filter((asset) => asset.id !== assetId);
    setAssets(nextAssets);
    writePortfolioAssets(nextAssets);
  };

  const catalogBackedType = draftType === "stock" || draftType === "mutual_fund" || draftType === "etf";

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#1A1A1A]">
      <nav className="sticky top-0 z-40 border-b border-[#D4CFC4] bg-[#F5F0E6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#5C5C5C]">
            <ArrowLeft size={18} />
            Back to dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 lg:px-6 lg:py-8">
        <section className="grid gap-4 rounded-[28px] border border-[#D4CFC4] bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#8B4513]">Portfolio watch</p>
            <h1 className="text-3xl font-semibold leading-tight">Search listed securities, select them, and tie news to your actual watchlist.</h1>
            <p className="text-sm leading-6 text-[#5C5C5C]">
              Stocks, ETFs, and mutual funds now use a catalog-backed search so only listed instruments appear before the user selects one.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#F8F3EB] p-4">
            <p className="text-sm font-semibold">Add an asset</p>
            <div className="mt-3 grid gap-3">
              <select
                value={draftType}
                onChange={(event) => {
                  setDraftType(event.target.value as AssetType);
                  setSearchQuery("");
                  setSearchResults([]);
                  setSelectedSecurity(null);
                }}
                className="rounded-2xl border border-[#D4CFC4] px-4 py-3 outline-none focus:border-[#8B4513]"
              >
                {assetTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {catalogBackedType ? (
                <>
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C5C]" />
                    <input
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setSelectedSecurity(null);
                      }}
                      placeholder={`Search listed ${draftType.replace("_", " ")}`}
                      className="w-full rounded-2xl border border-[#D4CFC4] py-3 pl-11 pr-10 outline-none focus:border-[#8B4513]"
                    />
                    {isSearching && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#8B4513]" />}
                  </div>

                  {selectedSecurity ? (
                    <div className="rounded-2xl border border-[#8B4513] bg-white p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">{selectedSecurity.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5C5C5C]">
                            {selectedSecurity.symbol}
                            {selectedSecurity.exchange ? ` • ${selectedSecurity.exchange}` : ""}
                          </p>
                          <p className="mt-1 text-xs text-[#8B4513]">{selectedSecurity.source}</p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#F8F3EB] px-3 py-1 text-xs font-medium text-[#8B4513]">
                          <Check size={14} />
                          Selected
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {!selectedSecurity && searchResults.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto rounded-2xl border border-[#E8E1D3] bg-white p-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            setSelectedSecurity(result);
                            setSearchQuery(`${result.name} (${result.symbol})`);
                            setSearchResults([]);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-[#F8F3EB]"
                        >
                          <div>
                            <p className="text-sm font-semibold">{result.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5C5C5C]">
                              {result.symbol}
                              {result.exchange ? ` • ${result.exchange}` : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-[#8B4513]">{result.type.replace("_", " ")}</p>
                            <p className="text-[11px] text-[#5C5C5C]">{result.source}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <input
                    value={manualName}
                    onChange={(event) => setManualName(event.target.value)}
                    placeholder="Asset name"
                    className="rounded-2xl border border-[#D4CFC4] px-4 py-3 outline-none focus:border-[#8B4513]"
                  />
                  <input
                    value={manualSymbol}
                    onChange={(event) => setManualSymbol(event.target.value)}
                    placeholder="Ticker or code"
                    className="rounded-2xl border border-[#D4CFC4] px-4 py-3 outline-none focus:border-[#8B4513]"
                  />
                </>
              )}

              <div className="rounded-2xl border border-[#E8E1D3] bg-white px-4 py-3 text-sm text-[#5C5C5C]">
                {catalogBackedType
                  ? "Catalog-backed results come from listed-security search. Choose one result before adding."
                  : "Manual entry stays available for assets that are outside the listed-security catalog."}
              </div>

              <button
                onClick={addAsset}
                disabled={catalogBackedType ? !selectedSecurity : !manualName.trim() || !manualSymbol.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
              >
                <Plus size={16} />
                Add to portfolio
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-[#D4CFC4] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your tracked assets</h2>
                <p className="text-sm text-[#5C5C5C]">Use this as the basis for portfolio-specific news ranking.</p>
              </div>
              <span className="rounded-full bg-[#F5F0E6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                {assets.length} assets
              </span>
            </div>

            <div className="space-y-3">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-4">
                  <div>
                    <p className="text-sm font-semibold">{asset.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5C5C5C]">
                      {asset.symbol} • {asset.type.replace("_", " ")}
                      {asset.exchange ? ` • ${asset.exchange}` : ""}
                    </p>
                    {asset.source ? <p className="mt-1 text-[11px] text-[#8B4513]">{asset.source}</p> : null}
                  </div>
                  <button onClick={() => removeAsset(asset.id)} className="rounded-full bg-white p-2 text-[#5C5C5C]">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#D4CFC4] bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Portfolio-specific news impact</h2>
              <p className="text-sm text-[#5C5C5C]">
                Each asset now maps to the strongest matching story through related entities, ticker overlap, and topic keywords, then scores the impact with confidence.
              </p>
            </div>

            <div className="space-y-3">
              {assets.map((asset, index) => {
                const { topic, impact, confidence, matchedEntities, rationale } = assessPortfolioImpact(asset, topics);
                const impactStyles =
                  impact === "positive"
                    ? "bg-green-100 text-green-700"
                    : impact === "negative"
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-700";

                return (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-[#ECE5D8] bg-[#FCFAF6] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{asset.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5C5C5C]">{asset.symbol}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${impactStyles}`}>
                          {impact}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B4513]">
                          {confidence} confidence
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-white p-3">
                      <div className="flex items-center gap-2 text-xs text-[#5C5C5C]">
                        {impact === "positive" ? <TrendingUp size={13} /> : impact === "negative" ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
                        <span>{topic.category}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold">{topic.title}</p>
                      {matchedEntities.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {matchedEntities.slice(0, 3).map((entity) => (
                            <span
                              key={`${asset.id}-${entity}`}
                              className="rounded-full bg-[#F8F3EB] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8B4513]"
                            >
                              {entity}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <p className="mt-3 text-sm leading-6 text-[#5C5C5C]">{rationale}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5C5C5C]">
                        {topic.impactByUserType[userType] || topic.impactByUserType.exploring}
                      </p>
                      <button
                        onClick={() => router.push(`/briefing/${topic.id}`)}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#8B4513]"
                      >
                        Open mapped story
                        <TrendingUp size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
