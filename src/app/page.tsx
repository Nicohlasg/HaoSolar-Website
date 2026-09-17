import { VideoHero } from "@/components/home/VideoHero";
import { StatementSection } from "@/components/home/StatementSection";
import { IslandMap } from "@/components/home/IslandMap";
import { Accreditations } from "@/components/home/Accreditations";
import { ServicesTeaser } from "@/components/home/ServicesTeaser";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { Benefits } from "@/components/home/Benefits";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ScrollVideoStages } from "@/components/home/ScrollVideoStages";
import { ProductStory } from "@/components/home/ProductStory";
import { TestimonialColumns } from "@/components/home/TestimonialColumns";
import { About } from "@/components/home/About";
import { FaqChat } from "@/components/services/FaqChat";
import { Insights } from "@/components/home/Insights";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <VideoHero />
      <StatementSection />
      <Accreditations />
      <IslandMap />
      <ServicesTeaser />
      <ProjectShowcase category="landed" title="Landed homes." lede="Terraces, semi-Ds and bungalows. Hover or tap for capacity, roof and yearly saving." />
      <ProjectShowcase category="commercial" title="Commercial and industrial." lede="Factories, warehouses and offices." tone="plain" />
      <Benefits />
      <ProcessTimeline />
      <ScrollVideoStages />
      <ProductStory />
      <TestimonialColumns />
      <About />
      <FaqChat compact />
      <Insights />
      <ContactSection />
    </>
  );
}
