import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CupLab } from "./CupLab";

// Temporary dev-only route (deleted in Step 11.4): the cup on its own, for model review.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CupLabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <CupLab />;
}
