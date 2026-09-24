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
    console.error(error);
  }, [error]);

  return (
    <main>
      <h1>Bir şeyler yanlış gitti</h1>
      <p>Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyebilir veya ana sayfaya dönebilirsiniz.</p>
      <button type="button" onClick={() => reset()}>
        Tekrar dene
      </button>
      <Link href="/">Ana sayfaya dön</Link>
    </main>
  );
}
