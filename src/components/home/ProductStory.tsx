"use client";

import { useCallback } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { PRODUCTS, type Product } from "@/content/products";
import { ProductStage } from "./ProductStage";

/**
 * The kit, product by product. Each product owns a scroll stage; the
 * switcher under the details jumps to another product's stage, which
 * starts its own sequence from the top. Replaces the old Features section.
 */
export function ProductStory() {
  const onSwitch = useCallback((id: Product["id"]) => {
    document.getElementById(`product-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // overflow-x-clip, not hidden: hidden would make this a scroll container and break the sticky stages.
  return (
    <section className="overflow-x-clip border-t border-rule bg-paper" aria-labelledby="product-story">
      <Container className="pt-20 sm:pt-24">
        <Reveal direction="left" className="max-w-2xl">
          <h2 id="product-story" className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
            <DiaText>The kit, up close.</DiaText>
          </h2>
          <p className="mt-4 text-lg text-ink-2">Scroll to turn each piece over. Hover the dots for the details that matter on a Singapore roof.</p>
        </Reveal>
      </Container>
      {PRODUCTS.map((p, i) => (
        <ProductStage key={p.id} product={p} index={i} onSwitch={onSwitch} />
      ))}
    </section>
  );
}
