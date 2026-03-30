"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EFE7] p-4">
      <div className="max-w-md w-full bg-white rounded-[24px] border border-[#DDD4C4] p-8 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#F8F3EB] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[#5C5C5C] mb-6">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-3 text-sm font-medium text-white hover:bg-[#333] transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DDD4C4] bg-white px-6 py-3 text-sm font-medium text-[#1A1A1A] hover:bg-[#F8F3EB] transition-colors"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
