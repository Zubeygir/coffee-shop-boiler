import Image from "next/image";
import { site } from "@/content/site";
import { formatPrice, menuImageSrc } from "@/lib/utils";
import type { MenuItem } from "@/types";

function MenuThumb({ slug, alt }: { slug: string; alt: string }) {
  return (
    <div className="relative size-24 bg-flame">
      <Image src={menuImageSrc(slug)} alt={alt} fill sizes="96px" className="object-cover" />
    </div>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="menu-row grid grid-cols-[6rem_1fr] items-start gap-x-4 py-6 first:pt-0 last:pb-0 md:gap-x-6">
      <MenuThumb slug={item.slug} alt={item.imageAlt} />
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="type-title">{item.name}</h4>
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
              <h3 className="type-title md:sticky md:top-10 md:self-start">{category.name}</h3>
              {/* Capped so the price stays within reach of the name on wide screens. */}
              <ul className="mt-4 max-w-[44rem] divide-y divide-graphite md:mt-0">
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
