"use client";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type Point = { x: string; a: number; b: number | null; aDate: string; bDate: string | null };

export function CompareLine({
  data, aLabel, bLabel, aTotal, bTotal,
}: { data: Point[]; aLabel: string; bLabel: string | null; aTotal: number; bTotal: number | null }) {
  const [show, setShow] = useState({ a: true, b: true });
  const hasB = bLabel !== null;

  const legend = (k: "a" | "b", label: string, total: number | null, dashed: boolean) => (
    <button
      type="button"
      aria-pressed={show[k]}
      onClick={() => setShow({ ...show, [k]: !show[k] })}
      className={`inline-flex h-8 items-center gap-2 rounded-full bg-raised px-3 text-xs ${show[k] ? "text-fg" : "text-muted line-through"}`}
    >
      <svg width="22" height="6" aria-hidden>
        <line x1="0" y1="3" x2="22" y2="3" strokeWidth="2" strokeDasharray={dashed ? "4 3" : undefined}
          stroke={k === "a" ? "var(--color-series-a)" : "var(--color-series-b)"} />
      </svg>
      <span className="max-w-[16rem] truncate">{label}</span>
      <span className="tabular text-muted">{total}</span>
    </button>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {legend("a", aLabel, aTotal, false)}
        {hasB && legend("b", bLabel!, bTotal, true)}
      </div>
      <div className="h-72 w-full" role="img" aria-label={`Line chart of ${aLabel}${hasB ? ` compared with ${bLabel}` : ""}. A data table follows.`}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="var(--color-border)" strokeOpacity={0.4} vertical={false} />
            <XAxis dataKey="x" tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} tickLine={false} axisLine={false}
              interval="preserveStartEnd" minTickGap={28} />
            <YAxis allowDecimals={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ stroke: "var(--color-border-input)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as Point;
                return (
                  <div className="rounded-md border border-line bg-raised p-3 text-xs shadow-pop">
                    {show.a && <p><span className="text-series-a">●</span> {p.aDate}: <b className="tabular">{p.a}</b></p>}
                    {hasB && show.b && p.b !== null && <p className="mt-1"><span className="text-series-b">●</span> {p.bDate}: <b className="tabular">{p.b}</b></p>}
                    {hasB && show.a && show.b && p.b !== null && (
                      <p className="mt-1 text-muted">Difference: <span className="tabular">{p.a - p.b > 0 ? "+" : ""}{p.a - p.b}</span></p>
                    )}
                  </div>
                );
              }}
            />
            {show.a && <Line type="linear" dataKey="a" stroke="var(--color-series-a)" strokeWidth={2} dot={data.length < 8} isAnimationActive={false} />}
            {hasB && show.b && <Line type="linear" dataKey="b" stroke="var(--color-series-b)" strokeWidth={2} strokeDasharray="5 4" dot={data.length < 8} isAnimationActive={false} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <details className="mt-3 text-xs text-muted">
        <summary className="cursor-pointer">View data table</summary>
        <table className="mt-2 w-full">
          <thead><tr><th className="text-left">Date</th><th className="text-right">{aLabel}</th>{hasB && <th className="text-right">{bLabel}</th>}</tr></thead>
          <tbody>{data.map((p) => (
            <tr key={p.aDate}><td>{p.aDate}</td><td className="tabular text-right">{p.a}</td>{hasB && <td className="tabular text-right">{p.b ?? "-"}</td>}</tr>
          ))}</tbody>
        </table>
      </details>
    </div>
  );
}
