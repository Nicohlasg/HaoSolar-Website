"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Phone, Mail, MapPin, Clock } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TiktokIcon } from "@/components/ui/SocialIcons";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { MessageIcon } from "@/components/icons/AnimatedIcons";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { NAV, SITE, whatsappLink } from "@/config/site";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";
import { TariffAlertForm } from "./TariffAlertForm";
import { cn } from "@/lib/cn";

/**
 * Footer: four columns (tariff alerts, quick links, contact, socials with
 * tooltips) that stagger in, a centred row of animated links with the logo,
 * and the giant wordmark rising from below. Neumorphic controls on the
 * page's grey.
 */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const rise = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } } };

const QUICK_LINKS = [...NAV, { href: "/insights", label: "Solar guides" }, { href: "/#about", label: "About" }] as const;

export function MotionFooter() {
  const reduced = usePrefersReducedMotion();
  const socials = [
    { label: "Google reviews", href: SITE.google.placeUrl as string | null, Icon: Star },
    { label: "WhatsApp", href: whatsappLink("Hi Hao Solar, I'd like to ask about solar for my home.") as string | null, Icon: WhatsAppIcon },
    { label: "Facebook", href: SITE.socials.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: SITE.socials.instagram, Icon: InstagramIcon },
    { label: "TikTok", href: SITE.socials.tiktok, Icon: TiktokIcon },
    { label: "LinkedIn", href: SITE.socials.linkedin, Icon: LinkedinIcon },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-rule bg-paper-2">
      <motion.div variants={reduced ? undefined : stagger} initial={reduced ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr]">
          <motion.div variants={rise}>
            <h2 className="text-base font-semibold">Tariff alerts</h2>
            <p className="mt-2 max-w-xs text-sm text-ink-2">SP Group revises the electricity tariff every quarter. Get a one-line email when it moves, with what it means for a solar roof.</p>
            <div className="mt-4 max-w-sm">
              <TariffAlertForm />
            </div>
          </motion.div>

          <motion.div variants={rise}>
            <h2 className="text-base font-semibold">Quick links</h2>
            <nav aria-label="Footer" className="mt-3 grid gap-2 text-sm">
              {QUICK_LINKS.map((n) => (
                <FooterLink key={n.href} href={n.href}>
                  {n.label}
                </FooterLink>
              ))}
            </nav>
          </motion.div>

          <motion.div variants={rise}>
            <h2 className="text-base font-semibold">Contact</h2>
            <address className="mt-3 grid gap-2.5 text-sm not-italic text-ink-2">
              <span className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                <span>
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                </span>
              </span>
              <a href={`tel:${SITE.phoneE164}`} className="flex items-center gap-2.5 text-ink-2 no-underline hover:text-ink">
                <Phone className="h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                {SITE.phoneDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 text-ink-2 no-underline hover:text-ink">
                <Mail className="h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                {SITE.email}
              </a>
              <span className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                {SITE.hours}
              </span>
            </address>
          </motion.div>

          <motion.div variants={rise}>
            <h2 className="text-base font-semibold">Follow the work</h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label} className="group relative">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="neu-sm neu-press flex h-11 w-11 items-center justify-center rounded-full bg-paper-2 text-ink no-underline transition-colors hover:text-forest"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ) : (
                    <span aria-label={`${label}, link to confirm`} className="neu-inset flex h-11 w-11 items-center justify-center rounded-full text-ink-2/50">
                      <Icon className="h-5 w-5" />
                    </span>
                  )}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-2 py-1 text-xs text-paper opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    {href ? label : `${label}: to confirm`}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink("Hi Hao Solar, I'd like to ask about solar for my home.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 text-[0.95rem] font-medium text-paper no-underline transition-colors hover:bg-ink-2"
            >
              <MessageIcon className="h-5 w-5" />
              WhatsApp us
            </a>
          </motion.div>
        </Container>

        <motion.div variants={rise} className="border-t border-rule">
          <Container className="flex flex-col items-center gap-5 py-8">
            <Logo />
            <ul className="flex flex-wrap items-center justify-center gap-4" aria-label="Certifications">
              {[...SITE.accreditations.map((a) => ({ src: a.image, alt: a.title, h: "h-12" })), ...SITE.certifications.map((c) => ({ src: c.image, alt: `${c.label}, ${c.subject}, certificate ${c.cert}`, h: "h-10" }))].map((b) => (
                <li key={b.src}>
                  <Image src={b.src} alt={b.alt} width={300} height={120} className={cn(b.h, "w-auto rounded-sm bg-paper p-1")} />
                </li>
              ))}
            </ul>
            <nav aria-label="Footer, centre" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {[...NAV, { href: "/privacy-policy", label: "Privacy policy" }, { href: "/terms-conditions", label: "Terms" }].map((n) => (
                <FooterLink key={n.href} href={n.href}>
                  {n.label}
                </FooterLink>
              ))}
            </nav>
            <p className="text-center text-xs text-ink-2">
              © {new Date().getFullYear()} {SITE.legalName} · UEN {SITE.uen} · Draft for review; figures marked “to confirm” are pending sign-off.
            </p>
          </Container>
        </motion.div>

        <motion.p
          aria-hidden="true"
          variants={reduced ? undefined : { hidden: { y: "40%", opacity: 0 }, show: { y: "18%", opacity: 1, transition: { duration: 0.9, ease: EASE_OUT } } }}
          className="pointer-events-none select-none overflow-hidden text-center font-display text-[18vw] font-semibold leading-none tracking-[-0.05em] text-ink/[0.05]"
        >
          HAOSOLAR
        </motion.p>
      </motion.div>
    </footer>
  );
}

/** Link with a lime underline that slides in from the left on hover. */
function FooterLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group/link relative inline-block text-ink-2 no-underline transition-colors hover:text-ink", className)}>
      {children}
      <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-lime transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
    </Link>
  );
}
