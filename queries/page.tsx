import Link from "next/link";
import { Card, EmptyState, FilterBar, PageHeader } from "@/components/ui";
import { Params, resolve, topQueries } from "@/lib/data";
import { pct } from "@/lib/format";

export default function Queries({ searchParams }: { searchParams: Params }) {
  const { cur, q } = resolve(searchParams);
  const rows = topQueries(cur, 50);
  const repeated = rows.filter((r) => r.searches >= 2);
  const max = rows[0]?.searches ?? 0;
  return (
    <>
      <PageHeader title="Queries" sub="What you typed most, and what you keep coming back to.">
        <FilterBar base="/queries" q={q} />
      </PageHeader>
      {rows.length === 0 ? (
        <EmptyState message="No searches in this range." action={{ href: "/queries?range=all", label: "Show all time" }} />
      ) : (
        <div className="space-y-6">
          {repeated.length > 0 && (
            <Card title={`Searched more than once (${repeated.length})`}>
              <ul className="flex flex-wrap gap-2">
                {repeated.map((r) => (
                  <li key={r.query}>
                    <Link href={`/?${new URLSearchParams(q)}&a=${encodeURIComponent(r.query)}`}
                      className="inline-flex max-w-full items-center gap-2 rounded-full bg-raised px-3 py-1.5 text-sm hover:text-accent">
                      <span className="truncate">{r.query}</span><span className="tabular text-xs text-muted">×{r.searches}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <Card title="All queries">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-xs text-muted">
                  <tr><th className="pb-2 font-medium">Query</th><th className="pb-2 font-medium">Searches</th><th className="pb-2 font-medium">Last seen</th><th className="pb-2 text-right font-medium">AI Mode</th><th className="pb-2 text-right font-medium">Led to a site</th><th /></tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.query} className="h-11 border-t border-line hover:bg-raised">
                      <td className="max-w-[22rem] truncate pr-3" title={r.query}>{r.query}</td>
                      <td className="w-40 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="tabular w-5 text-right">{r.searches}</span>
                          <span aria-hidden className="h-1.5 rounded-full bg-series-a" style={{ width: `${(r.searches / max) * 100}%`, minWidth: 4 }} />
                        </div>
                      </td>
                      <td className="tabular pr-3 text-muted">{r.lastSeen}</td>
                      <td className="tabular text-right text-muted">{pct(r.aiMode, r.searches)}</td>
                      <td className="tabular text-right text-muted">{pct(r.ledSomewhere, r.searches)}</td>
                      <td className="pl-4 text-right"><Link className="text-xs text-accent hover:underline" href={`/?${new URLSearchParams(q)}&a=${encodeURIComponent(r.query)}`}>Compare</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">“Led to a site” means you opened a page within 10 minutes of searching. It is a guess, since the export does not record clicks.</p>
          </Card>
        </div>
      )}
    </>
  );
}
