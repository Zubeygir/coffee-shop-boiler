import { CupSlot } from "@/components/cup/CupSlot";
import { site } from "@/content/site";

// Right edge of the S2 silhouette, in % of the 16:25 slot, projected from the pose in choreography.ts → S2
// (cup tilted 20°, spun 180°, lid floating up-left at −18°; idle bob included). The text flows on the right:
// beside the floating lid it reaches into the slot, steps out at the cup's mouth, then follows the tapering body.
const cupSilhouette =
  "polygon(0% 0%, 39.1% 0%, 55.9% 5%, 64.8% 10%, 67.8% 15%, 67.8% 20%, 66.3% 25%, 78.2% 30%, 94.3% 35%, " +
  "94.8% 40%, 94.7% 45%, 93.3% 50%, 92.5% 55%, 91.7% 60%, 90.8% 65%, 90% 70%, 89.2% 75%, 88.3% 80%, " +
  "87.5% 85%, 86.7% 90%, 85.8% 95%, 83.1% 100%, 0% 100%)";

export function RevealSection() {
  const { title, paragraph } = site.reveal;

  return (
    // Extra 25svh above the content lengthens the S1 → S2 scroll window (~880 → ~1100px on a 900px-tall
    // desktop viewport), so the same choreography spreads over more scroll and reads calmer.
    // The negative scroll margin lands the nav link on the content (4rem below the viewport top), past that extra
    // space: landing on the section's top edge would stop the cup mid-transition over the text. Lenis honors it.
    <section
      id="hikaye"
      className="scroll-mt-[calc(4rem_-_var(--spacing-section)_-_25svh)] px-4 pt-[calc(var(--spacing-section)_+_25svh)] pb-section md:px-10"
    >
      {/* Width = slot + a 28rem text column (~40ch of lead): narrow enough that the paragraph runs long beside the
          cup and actually traces its silhouette. No max-width on the text itself, so its lines meet the float. */}
      <div className="mx-auto flow-root max-w-[calc(var(--cup-size)*1.12_+_28rem)]">
        <CupSlot
          name="reveal"
          // 1.12 × 1.75 cup heights: the cup plus its floating lid (choreography.ts → S2).
          className="mx-auto mb-10 aspect-[16/25] w-[calc(var(--cup-size)*1.12)] md:float-left md:mb-0"
          style={{ shapeOutside: cupSilhouette, shapeMargin: "0.75rem" }}
        />
        {/* The headline sits beside the floating lid, the paragraph wraps down the cup. */}
        <h2 className="type-headline">{title}</h2>
        <p className="type-lead mt-6">{paragraph}</p>
      </div>
    </section>
  );
}
