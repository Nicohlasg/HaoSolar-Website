import { cn } from "@/lib/cn";

export function Perforation({ className }: { className?: string }) {
  return <div role="separator" className={cn("perforation", className)} />;
}
