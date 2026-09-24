import { CupLayer } from "@/components/cup/CupLayer";
import { IntroProvider } from "@/components/cup/IntroProvider";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MenuSection } from "@/components/sections/MenuSection";
import { RevealSection } from "@/components/sections/RevealSection";
import { site } from "@/content/site";

export default function Home() {
  return (
    <IntroProvider>
      <a
        href="#top"
        className="type-label sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-(--z-skip-link) focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        {site.skipLink}
      </a>
      <Header />
      <main>
        <HeroSection />
        <RevealSection />
        <MenuSection />
      </main>
      <ContactSection />
      <SmoothScroll />
      <CupLayer />
    </IntroProvider>
  );
}
