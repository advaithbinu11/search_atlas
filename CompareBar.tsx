import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";

export function CompareBar({ base, a, b, suggestions }: { base: Record<string, string>; a: string; b: string; suggestions: string[] }) {
  const termMode = Boolean(a);
  const tab = (on: boolean) =>
    `inline-flex h-8 items-center rounded-full px-3 text-xs font-medium ${on ? "bg-raised text-accent border border-accent" : "text-muted border border-transparent hover:text-fg"}`;
  const keep = new URLSearchParams(base).toString();
  return (
    <div className="mb-6 rounded-lg border border-line bg-surface p-4">
      <div className="mb-3 flex items-center gap-2" role="group" aria-label="Comparison type">
        <Link href={`/?${keep}`} aria-current={!termMode ? "true" : undefined} className={tab(!termMode)}>This range vs the one before</Link>
        <Link href={`/?${keep}&a=${encodeURIComponent(a || suggestions[0] || "")}`} aria-current={termMode ? "true" : undefined} className={tab(termMode)}>Term vs term</Link>
      </div>
      {termMode ? (
        <form method="get" action="/" className="flex flex-wrap items-end gap-3">
          {Object.entries(base).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          <label className="grid gap-1 text-xs text-muted">
            Term A
            <input name="a" defaultValue={a} list="terms" required autoComplete="off"
              className="h-10 w-56 rounded-md border border-field bg-surface px-3 text-sm text-fg" />
          </label>
          <ArrowLeftRight size={16} aria-hidden className="mb-3 text-muted" />
          <label className="grid gap-1 text-xs text-muted">
            Term B
            <input name="b" defaultValue={b} list="terms" autoComplete="off" placeholder="Pick a second term"
              className="h-10 w-56 rounded-md border border-field bg-surface px-3 text-sm text-fg placeholder:text-muted" />
          </label>
          <datalist id="terms">{suggestions.map((s) => <option key={s} value={s} />)}</datalist>
          <p className="basis-full text-xs text-muted">A term matches whole words anywhere in a query, so “clep” also finds “ut clep credit”.</p>
          <button className="h-10 rounded-md bg-accent px-4 text-sm font-semibold text-on-accent">Compare</button>
          <Link href={`/?${keep}`} className="h-10 content-center px-2 text-sm text-muted hover:text-fg">Clear</Link>
        </form>
      ) : (
        <p className="text-sm text-muted">Dashed amber line is the range just before this one, lined up day by day.</p>
      )}
    </div>
  );
}
