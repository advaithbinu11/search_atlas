const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ramp = ["bg-raised border border-line", "bg-ramp-1", "bg-ramp-2", "bg-ramp-3", "bg-ramp-4", "bg-ramp-5"];
const hourLabel = (h: number) => (h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`);
const hourLong = (h: number) => (h === 0 ? "12 am" : h < 12 ? `${h} am` : h === 12 ? "12 pm" : `${h - 12} pm`);

export function Heatmap({ grid }: { grid: number[][] }) {
  const max = Math.max(1, ...grid.flat());
  const level = (n: number) => (n === 0 ? 0 : Math.min(5, Math.ceil((n / max) * 5)));
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-0.5" aria-label="Searches by weekday and hour">
          <thead>
            <tr>
              <th className="w-10" />
              {Array.from({ length: 24 }, (_, h) => (
                <th key={h} scope="col" className="pb-1 text-center text-xs font-normal text-muted">
                  {h % 3 === 0 ? hourLabel(h) : <span className="sr-only">{hourLong(h)}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, d) => (
              <tr key={d}>
                <th scope="row" className="pr-2 text-right text-xs font-normal text-muted">{days[d]}</th>
                {row.map((n, h) => (
                  <td
                    key={h}
                    title={`${days[d]} ${hourLong(h)}: ${n} ${n === 1 ? "search" : "searches"}`}
                    className={`h-7 rounded-[4px] ${ramp[level(n)]}`}
                  >
                    <span className="sr-only">{`${days[d]} ${hourLong(h)}: ${n}`}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted" aria-hidden>
        <span>Less</span>
        {ramp.map((c, i) => <span key={i} className={`h-3 w-5 rounded-[3px] ${c}`} />)}
        <span>More (up to {max})</span>
      </div>
    </div>
  );
}
