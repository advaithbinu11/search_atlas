import Link from "next/link";
import { Inbox } from "lucide-react";

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="gradient-text text-xl font-bold md:text-display">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-line bg-surface p-5 shadow-card ${className}`}>
      {title && <h2 className="mb-4 text-sm font-medium text-muted">{title}</h2>}
      {children}
    </section>
  );
}

/** One per screen: the main chart. 1px gradient ring around a bg-coloured body. */
export function GradientCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-lg bg-accent-border p-px">
      <div className="rounded-lg bg-bg p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg">{title}</h2>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

export function KpiTile({ label, value, cur, prev, suffix = "" }: { label: string; value: string; cur: number; prev: number | null; suffix?: string }) {
  let delta: React.ReactNode = <span className="text-muted">no earlier range</span>;
  if (prev !== null) {
    const diff = cur - prev;
    const pct = prev === 0 ? null : Math.round((diff / prev) * 100);
    const tone = diff === 0 ? "text-muted" : diff > 0 ? "text-success" : "text-danger";
    delta = (
      <span className={tone}>
        {diff > 0 ? "+" : diff < 0 ? "−" : ""}
        {pct === null ? Math.abs(diff) : `${Math.abs(pct)}%`} <span className="text-muted">({cur}{suffix} vs {prev}{suffix})</span>
      </span>
    );
  }
  return (
    <div className="rounded-lg border border-line bg-surface p-4" aria-label={`${label}: ${value}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className="tabular mt-1 text-xl">{/^\d+$/.test(value) ? Number(value).toLocaleString("en-US") : value}</p>
      <p className="mt-1 text-xs">{delta}</p>
    </div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: { href: string; label: string } }) {
  return (
    <div className="grid place-items-center gap-3 rounded-lg border border-dashed border-line px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-raised text-muted"><Inbox size={22} aria-hidden /></span>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {action && (
        <Link href={action.href} className="inline-flex h-10 items-center rounded-md bg-raised px-4 text-sm font-medium hover:text-accent">
          {action.label}
        </Link>
      )}
    </div>
  );
}

type QP = Record<string, string | undefined>;
const href = (base: string, q: QP) => {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v) u.set(k, v);
  const s = u.toString();
  return s ? `${base}?${s}` : base;
};

function Chip({ to, on, children }: { to: string; on: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={to}
      aria-current={on ? "true" : undefined}
      className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors ${
        on ? "border-accent bg-raised text-accent" : "border-transparent bg-raised text-muted hover:text-fg"
      }`}
    >
      {children}
    </Link>
  );
}

export function FilterBar({ base, q, ranges = true }: { base: string; q: QP; ranges?: boolean }) {
  const range = q.range ?? "30";
  const mode = q.mode ?? "all";
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2" role="group" aria-label="Filters">
      {ranges && (
        <div className="flex items-center gap-2" role="group" aria-label="Date range">
          {[["7", "7 days"], ["30", "30 days"], ["90", "90 days"], ["all", "All"]].map(([v, l]) => (
            <Chip key={v} to={href(base, { ...q, range: v })} on={range === v}>{l}</Chip>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2" role="group" aria-label="Browser">
        {[["all", "Both browsers"], ["chrome", "Chrome"], ["safari", "Safari"]].map(([v, l]) => (
          <Chip key={v} to={href(base, { ...q, browser: v })} on={(q.browser ?? "all") === v}>{l}</Chip>
        ))}
      </div>
      <div className="flex items-center gap-2" role="group" aria-label="Search engine">
        {[["all", "Any engine"], ["google", "Google"], ["youtube", "YouTube"], ["ecosia", "Ecosia"]].map(([v, l]) => (
          <Chip key={v} to={href(base, { ...q, engine: v })} on={(q.engine ?? "all") === v}>{l}</Chip>
        ))}
      </div>
      <div className="flex items-center gap-2" role="group" aria-label="Search mode">
        {[["all", "All"], ["web", "Web"], ["ai_mode", "AI Mode"], ["images", "Images"]].map(([v, l]) => (
          <Chip key={v} to={href(base, { ...q, mode: v })} on={mode === v}>{l}</Chip>
        ))}
      </div>
    </div>
  );
}

export function Bar({ value, max, label, right }: { value: number; max: number; label: string; right: string }) {
  const w = max === 0 ? 0 : Math.max(3, Math.round((value / max) * 100));
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-1.5">
      <span className="truncate text-sm" title={label}>{label}</span>
      <span className="tabular text-xs text-muted">{right}</span>
      <div className="col-span-2 h-1.5 rounded-full bg-raised" aria-hidden>
        <div className="h-1.5 rounded-full bg-series-a" style={{ width: `${w}%` }} />
      </div>
    </li>
  );
}
