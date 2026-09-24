import { site } from "@/content/site";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-(--z-header) px-4 md:px-10">
      <div className="mx-auto flex max-w-[80rem] items-center justify-between py-4">
        <a href="#top" className="type-headline text-[1.75rem]!">
          {site.wordmark}
        </a>
        <nav aria-label={site.navLabel}>
          <ul className="flex gap-5 md:gap-8">
            {site.nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="type-label relative block py-2 after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-200 after:ease-out-quart hover:after:scale-x-100 motion-reduce:after:transition-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
