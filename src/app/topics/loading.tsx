export default function TopicsLoading() {
  return (
    <div className="min-h-screen bg-[#F5F0E6] px-4 py-6 lg:px-6 lg:py-8">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-24 rounded-[28px] bg-white" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-10 w-24 rounded-full bg-white" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-72 rounded-[24px] bg-white" />
          ))}
        </div>
      </div>
    </div>
  );
}
