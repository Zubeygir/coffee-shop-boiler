import { Fragment } from "react";
import { CupSlot } from "@/components/cup/CupSlot";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const gridRows = ["md:row-start-1", "md:row-start-2", "md:row-start-3"];

export function HeroSection() {
  const { rows, scrollCue } = site.hero;

  return (
    <section id="top" className="relative flex min-h-svh flex-col items-center justify-center px-4 pt-20 pb-24 md:px-10">
      {/*
        DOM order is row by row, left → right, so the h1 reads as one sentence.
        Mobile: rows stack, the slot is moved below row 1 with `order`.
        Desktop: rows become `contents`, so the words land in a [left | slot | right] grid around the slot.
      */}
      {/* Desktop: the cup is taller than the 3 rows; vertical padding keeps the header and meta line clear of it. */}
      <h1 className="type-display flex flex-col items-center text-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-stretch md:py-(--hero-cup-overflow)">
        {rows.map((row, index) => (
          <Fragment key={row.left}>
            <span
              className={cn(
                "flex flex-wrap justify-center gap-x-[0.25em] md:contents",
                index === 0 ? "order-1" : "order-3",
              )}
            >
              <span className={cn("md:col-start-1 md:justify-self-end", gridRows[index])}>{row.left}</span>{" "}
              <span className={cn("md:col-start-3 md:justify-self-start", gridRows[index])}>{row.right}</span>
            </span>{" "}
          </Fragment>
        ))}
        <CupSlot
          name="hero"
          // Width sets the cup's scale (choreography.ts → S1). Desktop height is the 3 rows; the cup overflows it.
          // Negative side margins let the inner words tuck a few px under the cup's edges (the canvas is on top),
          // so the headline breaks around the cup instead of standing beside it.
          className="order-2 my-4 h-[calc(var(--cup-size)*1.12)] w-[calc(var(--cup-size)*0.9)] md:col-start-2 md:row-span-3 md:row-start-1 md:-mx-7 md:my-0 md:h-auto"
        />
      </h1>

      <p className="type-label mt-10 text-char">
        {site.location} · {site.hours}
      </p>

      <p aria-hidden="true" className="scroll-cue type-label absolute inset-x-0 bottom-6 text-center">
        {scrollCue} ↓
      </p>
    </section>
  );
}
