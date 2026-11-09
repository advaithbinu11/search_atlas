import Link from "next/link";
import { Card, EmptyState, FilterBar, PageHeader } from "@/components/ui";
import { Params, resolve, sessionDetail, sessionList } from "@/lib/data";
import { dt, modeLabel, tm } from "@/lib/format";

export default function Sessions({ searchParams }: { searchParams: Params }) {
  const { cur, q } = resolve(searchParams);
  const list = sessionList(cur);
  const sel = Number(searchParams.id) || list[0]?.id;
  const detail = sel ? sessionDetail(sel) : null;
  const qs = (id: number) => `/sessions?${new URLSearchParams(q)}&id=${id}`;
  return (
    <>
      <PageHeader title="Sessions" sub="A session is a stretch of browsing with no gap longer than 30 minutes. Pick one to see its searches in order.">
        <FilterBar base="/sessions" q={q} />
      </PageHeader>
      {list.length === 0 ? (
        <EmptyState message="No sessions with searches in this range." action={{ href: "/sessions?range=all", label: "Show all time" }} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card title={`${list.length} sessions`} className="max-h-[70vh] overflow-y-auto">
            <ul className="space-y-1">
              {list.map((s) => (
                <li key={s.id}>
                  <Link href={qs(s.id)} aria-current={s.id === sel ? "true" : undefined}
                    className={`block rounded-md px-3 py-2 text-sm ${s.id === sel ? "bg-raised text-accent" : "hover:bg-raised"}`}>
                    <span className="block">{dt(s.startedAt)}</span>
                    <span className="text-xs text-muted">{s.browser === "safari" ? "Safari" : "Chrome"} · {s.searches} {s.searches === 1 ? "search" : "searches"} · {s.visits} pages</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card title={detail ? `Session on ${dt(list.find((s) => s.id === sel)?.startedAt ?? "")}` : "Session"}>
            <ol className="space-y-5">
              {detail?.searches.map((s) => (
                <li key={s.id}>
                  <p className="break-words text-sm">
                    <span className="tabular mr-2 text-xs text-muted">{tm(s.at)}</span>{s.query}
                    <span className="ml-2 rounded-full bg-raised px-2 py-0.5 text-xs text-muted">{modeLabel(s.mode)}</span>
                  </p>
                  <ul className="ml-6 mt-1 space-y-0.5 border-l border-line pl-3">
                    {detail.follow.filter((f) => f.searchId === s.id).slice(0, 6).map((f) => (
                      <li key={f.seq} className="truncate text-xs text-muted" title={f.title}>
                        {f.domain}{f.title ? ` · ${f.title}` : ""} <span className="tabular">(+{f.sec}s)</span>
                      </li>
                    ))}
                    {detail.follow.filter((f) => f.searchId === s.id).length > 6 && (
                      <li className="text-xs text-muted">and {detail.follow.filter((f) => f.searchId === s.id).length - 6} more pages</li>
                    )}
                    {detail.follow.every((f) => f.searchId !== s.id) && <li className="text-xs text-muted">No page opened afterwards.</li>}
                  </ul>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}
    </>
  );
}
