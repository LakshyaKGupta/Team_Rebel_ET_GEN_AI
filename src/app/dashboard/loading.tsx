export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F3EFE7] px-4 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="animate-pulse rounded-[30px] border border-[#DDD4C4] bg-[#FCFAF5] p-6">
          <div className="h-4 w-24 rounded-full bg-[#E8E1D3]" />
          <div className="mt-4 h-10 w-2/3 rounded-2xl bg-[#E8E1D3]" />
          <div className="mt-3 h-4 w-1/2 rounded-full bg-[#E8E1D3]" />
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="h-[420px] rounded-[28px] bg-[#E8E1D3]" />
            <div className="grid gap-4">
              <div className="h-28 rounded-[24px] bg-[#E8E1D3]" />
              <div className="h-44 rounded-[24px] bg-[#E8E1D3]" />
              <div className="h-44 rounded-[24px] bg-[#E8E1D3]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
