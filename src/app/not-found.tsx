import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EFE7] p-4">
      <div className="max-w-md w-full bg-white rounded-[24px] border border-[#DDD4C4] p-8 shadow-sm text-center">
        <div className="w-20 h-20 bg-[#F8F3EB] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
          Page not found
        </h2>
        <p className="text-sm text-[#5C5C5C] mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-3 text-sm font-medium text-white hover:bg-[#333] transition-colors"
          >
            <Home size={16} />
            Go to Dashboard
          </Link>
          <Link
            href="/topics"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-6 py-3 text-sm font-medium text-[#1A1A1A] hover:bg-[#F8F3EB] transition-colors"
          >
            Browse Topics
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
