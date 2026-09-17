"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ChevronIcon } from "@/components/icons/AnimatedIcons";
import { Reveal } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { FAQ } from "@/content/faq";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

const TYPING_MS = 550;

/**
 * FAQ as a chat thread (ruixen "faq-chat-accordion" pattern): the customer's
 * question on the right, Hao Solar's reply on the left after a brief typing
 * indicator. Height animates with CSS grid rows so siblings reflow, and the
 * answer is laid out from the start so the height never jumps after typing.
 */
export function FaqChat({ compact }: { compact?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const [typing, setTyping] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (open === null || reduced) return;
    const t = window.setTimeout(() => setTyping(null), TYPING_MS);
    return () => window.clearTimeout(t);
  }, [open, reduced]);

  function toggle(i: number) {
    const next = open === i ? null : i;
    setOpen(next);
    setTyping(next !== null && !reduced ? next : null);
  }

  return (
    <section className={cn(compact ? "py-16" : "py-20 sm:py-24")}>
      <Container className="max-w-3xl">
        <Reveal direction="left">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            <DiaText>Questions we get at the survey.</DiaText>
          </h2>
          <p className="mt-3 text-ink-2">Tap a question. Short answers here, long ones on your roof.</p>
        </Reveal>
        <div className="mt-10 sheet p-4 sm:p-6">
          <p className="mb-4 text-center text-xs text-ink-2">Today</p>
          <ul className="grid gap-3">
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              const isTyping = typing === i;
              const id = `faq-${i}`;
              return (
                <li key={item.q} className="grid gap-2">
                  <div className="flex justify-end">
                    <motion.button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => toggle(i)}
                      whileTap={reduced ? undefined : { scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={cn(
                        "flex max-w-[85%] cursor-pointer items-center gap-3 rounded-2xl rounded-br-[6px] px-4 py-3 text-left transition-colors duration-200",
                        isOpen ? "bg-ink text-paper" : "bg-paper-2 text-ink hover:bg-rule/60",
                      )}
                    >
                      <span className="font-medium">{item.q}</span>
                      <ChevronIcon open={isOpen} className="h-4 w-4 shrink-0" />
                    </motion.button>
                  </div>
                  <div id={id} className="chat-answer" data-open={isOpen} aria-hidden={!isOpen}>
                    <div>
                      <div className="flex items-end gap-3 pb-1">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule bg-paper" aria-hidden="true">
                          <Image src="/images/logo-mark.svg" alt="" width={979} height={1316} className="h-5 w-auto" />
                        </span>
                        <div className="relative max-w-[85%] rounded-2xl rounded-bl-[6px] bg-paper-2 px-4 py-3 text-ink-2">
                          <span className={cn("block transition-opacity duration-200", isTyping ? "invisible opacity-0" : "opacity-100")}>{item.a}</span>
                          {isTyping ? (
                            <span className="absolute left-4 top-3 flex h-6 items-center gap-1" aria-label="Typing">
                              <span className="typing-dot block h-2 w-2 rounded-full bg-ink-2" />
                              <span className="typing-dot block h-2 w-2 rounded-full bg-ink-2" />
                              <span className="typing-dot block h-2 w-2 rounded-full bg-ink-2" />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
