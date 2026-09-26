"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/content/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const copy = site.errorPage;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col justify-center px-4 md:px-10">
      <div className="mx-auto w-full max-w-[80rem]">
        <h1 className="type-headline">{copy.title}</h1>
        <p className="type-body mt-6 max-w-[65ch]">{copy.text}</p>
        <div className="type-body mt-10 flex flex-wrap gap-x-10 gap-y-4">
          <button type="button" onClick={() => reset()} className="text-link cursor-pointer">
            {copy.retry}
          </button>
          <Link href="/" className="text-link">
            {copy.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
