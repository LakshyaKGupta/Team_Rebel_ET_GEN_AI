export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-[#F5F0E6] px-4 py-6 lg:px-6 lg:py-8">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-64 rounded-[28px] bg-white" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[420px] rounded-[28px] bg-white" />
          <div className="h-[420px] rounded-[28px] bg-white" />
        </div>
      </div>
    </div>
  );
}
