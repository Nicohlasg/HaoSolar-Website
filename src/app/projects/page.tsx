import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { PROJECTS, PROJECT_CATEGORIES, type ProjectCategory } from "@/content/projects";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = {
  title: "Projects",
  description: "Solar PV and EV charger installations by Hao Solar on landed homes and commercial roofs in Singapore.",
};

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = typeof params.type === "string" ? params.type : "all";
  const initial = PROJECT_CATEGORIES.some((c) => c.value === raw) ? (raw as ProjectCategory | "all") : "all";
  return (
    <>
      <section className="border-b border-rule bg-paper-2/60">
        <Container className="pb-14 pt-28 sm:pb-20 sm:pt-36">
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">Roofs we have worked on.</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-2">
            Area, size and year for each job. No customer names. Entries marked sample are placeholders until real
            projects and photos are supplied.
          </p>
        </Container>
      </section>
      <Container className="py-14 sm:py-20">
        <ProjectsGrid projects={PROJECTS} initialFilter={initial} />
      </Container>
    </>
  );
}
