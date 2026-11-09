import { CompareBar } from "@/components/CompareBar";
import { CompareLine, Point } from "@/components/CompareLine";
import { EmptyState, FilterBar, GradientCard, KpiTile, PageHeader } from "@/components/ui";
import { Params, daily, kpis, resolve, suggestTerms } from "@/lib/data";
import { pct } from "@/lib/format";

export default function Overview({ searchParams }: { searchParams: Params }) {
  const { cur, prev, range, mode, q: base } = resolve(searchParams);
  const a = (searchParams.a ?? "").trim();
  const b = (searchParams.b ?? "").trim();
  const k = kpis(cur);
  const pk = prev ? kpis(prev) : null;

  let data: Point[];
  let aLabel: string, bLabel: string | null, aTotal: number, bTotal: number | null;
  if (a) {
    const sa = daily(cur, a);
    const sb = b ? daily(cur, b) : null;
    data = sa.map((p, i) => ({ x: p.day.slice(5), a: p.n, b: sb ? sb[i].n : null, aDate: p.day, bDate: sb ? p.day : null }));
    aLabel = `“${a}”`; bLabel = b ? `“${b}”` : null;
    aTotal = sa.reduce((s, p) => s + p.n, 0); bTotal = sb ? sb.reduce((s, p) => s + p.n, 0) : null;
  } else {
    const sa = daily(cur);
    const sb = prev ? daily(prev) : null;
    data = sa.map((p, i) => ({ x: p.day.slice(5), a: p.n, b: sb ? sb[i].n : null, aDate: p.day, bDate: sb ? sb[i].day : null }));
    aLabel = `${cur.from} to ${cur.to}`; bLabel = prev ? `${prev.from} to ${prev.to}` : null;
    aTotal = k.searches; bTotal = pk ? pk.searches : null;
  }

  const q = { ...base, a: a || undefined, b: b || undefined };
  return (
    <>
      <PageHeader title="Overview" sub={`Your searches from ${cur.from} to ${cur.to}.`}>
        <FilterBar base="/" q={q} />
      </PageHeader>

      {k.searches === 0 ? (
        <EmptyState message="Nothing searched in this range. Try a wider range or another mode." action={{ href: "/?range=all", label: "Show all time" }} />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <KpiTile label="Searches" value={String(k.searches)} cur={k.searches} prev={pk?.searches ?? null} />
            <KpiTile label="Different queries" value={String(k.uniqueQueries)} cur={k.uniqueQueries} prev={pk?.uniqueQueries ?? null} />
            <KpiTile label="Days you searched" value={String(k.activeDays)} cur={k.activeDays} prev={pk?.activeDays ?? null} />
            <KpiTile label="AI Mode share" value={pct(k.aiMode, k.searches)} cur={Math.round((k.aiMode / k.searches) * 100)} prev={pk && pk.searches ? Math.round((pk.aiMode / pk.searches) * 100) : null} suffix="%" />
            <KpiTile label="Reworded searches" value={pct(k.refinements, k.searches)} cur={Math.round((k.refinements / k.searches) * 100)} prev={pk && pk.searches ? Math.round((pk.refinements / pk.searches) * 100) : null} suffix="%" />
          </div>

          <CompareBar base={base} a={a} b={b} suggestions={suggestTerms()} />

          <GradientCard title={a ? "Searches per day, term by term" : "Searches per day"}>
            {a && aTotal === 0 && (!bLabel || bTotal === 0) ? (
              <EmptyState message="No searches contain that term in this range." />
            ) : (
              <CompareLine data={data} aLabel={aLabel} bLabel={bLabel} aTotal={aTotal} bTotal={bTotal} />
            )}
          </GradientCard>
        </>
      )}
    </>
  );
}
