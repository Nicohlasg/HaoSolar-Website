import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { SITE } from "@/config/site";

/** bizSAFE and the management-system certificates, as a quiet strip. */
export function Accreditations() {
  const items = [
    ...SITE.accreditations.map((a) => ({ key: a.label, src: a.image, alt: a.title, caption: a.label, note: "Workplace safety and health" })),
    ...SITE.certifications.map((c) => ({ key: c.label, src: c.image, alt: `${c.label}, ${c.subject}`, caption: c.label, note: c.subject })),
  ];
  return (
    <section aria-labelledby="accreditations" className="border-b border-rule py-12 sm:py-14">
      <Container>
        <Reveal direction="left">
          <h2 id="accreditations" className="text-sm font-semibold uppercase tracking-wide text-ink-2">Recognised and certified</h2>
        </Reveal>
        <Reveal as="ul" className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4" stagger={0.08}>
          {items.map((b) => (
            <RevealItem key={b.key} as="li" className="flex flex-col items-center text-center">
              <div className="flex h-24 items-center justify-center">
                <Image src={b.src} alt={b.alt} width={400} height={200} className="max-h-24 w-auto max-w-[11rem] object-contain" />
              </div>
              <p className="mt-3 text-sm font-medium">{b.caption}</p>
              <p className="text-xs text-ink-2">{b.note}</p>
            </RevealItem>
          ))}
        </Reveal>
        <p className="mt-6 text-xs text-ink-2">
          ISO certificates issued by EQA IMS, SAC-accredited. Certificate holder to confirm: <span className="rounded-sm bg-alert px-1.5 py-px text-[0.65rem] font-medium uppercase tracking-wide text-paper">to confirm</span>
        </p>
      </Container>
    </section>
  );
}
