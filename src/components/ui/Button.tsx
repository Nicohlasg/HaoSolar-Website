import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-lime text-ink border border-lime hover:bg-lime-deep hover:border-lime-deep",
  secondary: "bg-ink text-paper border border-ink hover:bg-ink-2 hover:border-ink-2",
  outline: "bg-transparent text-ink border border-ink hover:bg-paper-2",
  ghost: "bg-transparent text-ink border border-transparent hover:bg-paper-2",
};

const SIZE: Record<Size, string> = {
  md: "h-11 px-4 text-[0.95rem]",
  lg: "h-13 px-6 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-[-0.01em] whitespace-nowrap cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & { href: string; external?: boolean } & Omit<
    ComponentPropsWithoutRef<"a">,
    "href" | "className" | "children"
  >;

type ButtonProps = CommonProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

function omitCommon<T extends CommonProps>(props: T): Omit<T, keyof CommonProps> {
  const copy: Record<string, unknown> = { ...props };
  delete copy.variant;
  delete copy.size;
  delete copy.className;
  delete copy.children;
  return copy as Omit<T, keyof CommonProps>;
}

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(BASE, VARIANT[variant], SIZE[size], className);

  if (props.href !== undefined) {
    const { href, external, ...rest } = omitCommon(props);
    if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a href={href} className={classes} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { type, ...rest } = omitCommon(props);
  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
