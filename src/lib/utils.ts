import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Both digit limits are set: TRY defaults to 2 minimum fraction digits, and max < min throws in older engines.
const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export function menuImageSrc(slug: string): string {
  return `/menu/${slug}.webp`;
}

export function getSiteUrl(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url.replace(/\/$/, "");
}
