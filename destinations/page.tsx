import { Bar, Card, EmptyState, FilterBar, PageHeader } from "@/components/ui";
import { Params, destinations, noFollowThroughRate, resolve } from "@/lib/data";
import { pct } from "@/lib/format";

export default function Destinations({ searchParams }: { searchParams: Params }) {
  const { cur, q } = resolve(searchParams);
  const rows = destinations(cur, 20);
  const nf = noFollowThroughRate(cur);
  return (
    <>
      <PageHeader title="Destinations" sub="The first site you opened after a search. Login and sign-in pages are skipped.">
        <FilterBar base="/destinations" q={q} />
      </PageHeader>
      {nf.total === 0 ? (
        <EmptyState message="No searches in this range." action={{ href: "/destinations?range=all", label: "Show all time" }} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card title="Where searches led">
            {rows.length === 0 ? <EmptyState message="No pages were opened after these searches." /> : (
              <ul>{rows.map((r) => <Bar key={r.domain} label={r.domain} value={r.visits} max={rows[0].visits} right={`${r.visits} ${r.visits === 1 ? "search" : "searches"}`} />)}</ul>
            )}
          </Card>
          <Card title="Searches with no follow-up">
            <p className="tabular text-xl">{pct(nf.none, nf.total)}</p>
            <p className="mt-1 text-sm text-muted">{nf.none} of {nf.total} searches had no page opened within 10 minutes. The answer may have been on the results page itself, such as an AI answer.</p>
          </Card>
        </div>
      )}
    </>
  );
}
