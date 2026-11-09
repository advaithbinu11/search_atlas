import { Heatmap } from "@/components/Heatmap";
import { EmptyState, FilterBar, GradientCard, PageHeader } from "@/components/ui";
import { Params, heatmap, resolve } from "@/lib/data";

export default function Rhythm({ searchParams }: { searchParams: Params }) {
  const { cur, q } = resolve(searchParams);
  const grid = heatmap(cur);
  const total = grid.flat().reduce((s, n) => s + n, 0);
  return (
    <>
      <PageHeader title="Rhythm" sub="When you search, by weekday and hour (Central time).">
        <FilterBar base="/rhythm" q={q} />
      </PageHeader>
      {total === 0 ? (
        <EmptyState message="No searches in this range." action={{ href: "/rhythm?range=all", label: "Show all time" }} />
      ) : (
        <GradientCard title={`${total} searches`}>
          <Heatmap grid={grid} />
        </GradientCard>
      )}
    </>
  );
}
