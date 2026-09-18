import Image from "next/image";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { Project } from "@/content/projects";
import { PHOTO_BLUR } from "@/content/photo-blur";
import { cn } from "@/lib/cn";

/** Roof photos are the point of the page, so they are encoded above Next's default 75. */
const PHOTO_QUALITY = 90;

const CATEGORY_LABEL: Record<Project["category"], string> = { landed: "Landed home", commercial: "Commercial", ev: "EV charger" };

/**
 * A project's photo where there is one, the labelled placeholder where there
 * is not yet. `fill` covers the parent (hero, showcase panels); otherwise a
 * framed image at `ratio`.
 */
export function ProjectPhoto({
  project,
  index = 0,
  ratio = "4/3",
  fill,
  sizes = "100vw",
  priority,
  className,
  dark,
  onLoad,
  quality = PHOTO_QUALITY,
}: {
  project: Project;
  index?: number;
  ratio?: "4/3" | "3/2" | "16/9";
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  dark?: boolean;
  /** Fires once the full frame has decoded, so a slideshow can wait for it. */
  onLoad?: () => void;
  /** Lower it for full-bleed backgrounds, where the file size matters more than the detail. */
  quality?: number;
}) {
  const photo = project.photos?.[index] ?? project.photos?.[0];
  /* A 20 px preview stands in while the full frame arrives, so nothing pops. */
  const blur = photo ? PHOTO_BLUR[photo.src] : undefined;
  const blurProps = blur ? ({ placeholder: "blur", blurDataURL: blur } as const) : {};
  if (!photo) {
    return (
      <PhotoPlaceholder
        label={`${CATEGORY_LABEL[project.category]}, ${project.area}`}
        ratio={ratio}
        hideCaption
        dark={dark}
        className={cn(fill && "absolute inset-0 h-full w-full rounded-none border-0", className)}
      />
    );
  }
  if (fill) {
    return <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} quality={quality} onLoad={onLoad} {...blurProps} className={cn("object-cover", className)} />;
  }
  return (
    <div className={cn("relative w-full overflow-hidden rounded-md bg-paper-2", className)} style={{ aspectRatio: ratio }}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} quality={quality} onLoad={onLoad} {...blurProps} className="object-cover" />
    </div>
  );
}
