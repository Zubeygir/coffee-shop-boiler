import { CupSlot } from "@/components/cup/CupSlot";
import { site } from "@/content/site";

// Left edge of the S2 silhouette (choreography.ts → S2), in % of the 7:10 slot: floating lid top right,
// the gap under it, the tilted cup mouth near the left edge, the body tapering to the base.
// Only the left edge matters: the text flows on the left. Fine-tuned by eye in Step 7.9.
const cupSilhouette = "polygon(26% 0, 100% 0, 100% 100%, 11% 100%, 1% 30%, 18% 16%, 26% 9%)";

export function RevealSection() {
  const { title, paragraph } = site.reveal;

  return (
    // Extra 25svh above the content lengthens the S1 → S2 scroll window (~880 → ~1100px on a 900px-tall
    // desktop viewport), so the same choreography spreads over more scroll and reads calmer.
    <section id="hikaye" className="px-4 pt-[calc(var(--spacing-section)_+_25svh)] pb-section md:px-10">
      {/* No max-width on the paragraph: its measure (~60ch) comes from this width minus the float,
          so the lines actually meet the cup's silhouette. */}
      <div className="mx-auto flow-root max-w-[70rem]">
        <CupSlot
          name="reveal"
          // 1.12 × 1.6 cup heights: the cup plus its floating lid (choreography.ts → S2).
          className="mx-auto mb-10 aspect-[7/10] w-[calc(var(--cup-size)*1.12)] md:float-right md:mb-0 md:ml-10"
          style={{ shapeOutside: cupSilhouette, shapeMargin: "0.75rem" }}
        />
        <h2 className="type-headline">{title}</h2>
        <p className="type-lead mt-6">{paragraph}</p>
      </div>
    </section>
  );
}
