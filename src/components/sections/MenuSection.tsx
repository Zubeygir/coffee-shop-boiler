import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { site } from "@/content/site";
import { formatPrice, menuImageSrc } from "@/lib/utils";
import type { MenuItem } from "@/types";

function MenuThumb({ slug, alt }: { slug: string; alt: string }) {
  const src = menuImageSrc(slug);
  // Temporary (removed in 11.4): until the images exist, the flame backdrop shows on its own.
  const hasImage = existsSync(join(process.cwd(), "public", src));

  return (
    <div className="relative size-24 bg-flame">
      {hasImage && <Image src={src} alt={alt} fill sizes="96px" className="object-cover" />}
    </div>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="menu-row grid grid-cols-[6rem_1fr] items-start gap-x-4 py-6 md:gap-x-6">
      <MenuThumb slug={item.slug} alt={item.imageAlt} />
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="type-title">{item.name}</p>
          <p className="type-label text-ice">{formatPrice(item.price)}</p>
        </div>
        <p className="type-body mt-2 text-smoke">{item.description}</p>
      </div>
    </li>
  );
}

export function MenuSection() {
  const { title, categories } = site.menu;

  return (
    <section
      id="menu"
      className="bg-ink px-4 py-section text-white [--focus-ring:var(--color-ice)] selection:bg-ice selection:text-ink md:px-10"
    >
      <div className="mx-auto max-w-[80rem]">
        <h2 className="type-headline">{title}</h2>
        <div className="mt-16 flex flex-col gap-16 md:gap-26">
          {categories.map((category) => (
            <div key={category.name} className="md:grid md:grid-cols-[minmax(12rem,1fr)_3fr] md:gap-10">
              <h3 className="type-title md:sticky md:top-8 md:self-start">{category.name}</h3>
              <ul className="mt-4 divide-y divide-graphite md:mt-0">
                {category.items.map((item) => (
                  <MenuRow key={item.slug} item={item} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
