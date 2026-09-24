import Link from "next/link";
import { site } from "@/content/site";

export default function NotFound() {
  const copy = site.notFoundPage;

  return (
    <main className="flex min-h-svh flex-col justify-center px-4 md:px-10">
      <div className="mx-auto w-full max-w-[80rem]">
        <h1 className="type-headline">{copy.title}</h1>
        <p className="type-body mt-6 max-w-[65ch]">{copy.text}</p>
        <Link href="/" className="type-body text-link mt-10 inline-block">
          {copy.home}
        </Link>
      </div>
    </main>
  );
}
