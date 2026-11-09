import { ArrowDown } from "lucide-react";
import { Card, EmptyState, FilterBar, PageHeader } from "@/components/ui";
import { Params, chains, resolve } from "@/lib/data";
import { dt, modeLabel } from "@/lib/format";

export default function Rewording({ searchParams }: { searchParams: Params }) {
  const { cur, q } = resolve(searchParams);
  const list = chains(cur);
  return (
    <>
      <PageHeader title="Rewording" sub="Times you searched again in the same sitting with similar words. It is a rough guess: some are real rewrites, some are just follow-up questions.">
        <FilterBar base="/rewording" q={q} />
      </PageHeader>
      {list.length === 0 ? (
        <EmptyState message="No reworded searches in this range." action={{ href: "/rewording?range=all", label: "Show all time" }} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((c) => (
            <Card key={c.sessionId} title={dt(c.items[0].at)}>
              <ol className="space-y-1">
                {c.items.map((s, i) => (
                  <li key={s.id}>
                    {i > 0 && <ArrowDown size={14} aria-hidden className="mx-2 my-1 text-muted" />}
                    <p className="break-words text-sm">
                      {s.query} <span className="ml-1 rounded-full bg-raised px-2 py-0.5 text-xs text-muted">{modeLabel(s.mode)}</span>
                      {s.refined ? <span className="sr-only"> (reworded from the one above)</span> : null}
                    </p>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
