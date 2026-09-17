"use client";

import { useState } from "react";
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/content/projects";
import { HoverRevealCard } from "./HoverRevealCard";
import { cn } from "@/lib/cn";

export function ProjectsGrid({ projects, initialFilter = "all" }: { projects: readonly Project[]; initialFilter?: ProjectCategory | "all" }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">(initialFilter);
  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {PROJECT_CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            aria-pressed={filter === c.value}
            onClick={() => setFilter(c.value)}
            className={cn(
              "h-10 cursor-pointer rounded-sm border px-3.5 text-sm font-medium transition-colors duration-200",
              filter === c.value ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-2 tnum" aria-live="polite">
        {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2">
        {shown.map((p) => (
          <li key={p.id}>
            <HoverRevealCard project={p} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
