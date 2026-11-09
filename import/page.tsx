import { Card, EmptyState, PageHeader } from "@/components/ui";
import { importStatus } from "@/lib/data";
import { dbExists, dbPath } from "@/lib/db";
import { dt } from "@/lib/format";

export default function Import() {
  if (!dbExists()) {
    return (
      <>
        <PageHeader title="Import" />
        <EmptyState message="No export loaded yet. Run the import command below with your Takeout folder." />
        <Command />
      </>
    );
  }
  const s = importStatus();
  const stale = s.visits.last ? Math.floor((Date.now() - Date.parse(s.visits.last)) / 86_400_000) : null;
  return (
    <>
      <PageHeader title="Import" sub="What is loaded, how far it reaches, and how to add a newer export." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Coverage">
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-muted">Page visits</dt><dd className="tabular">{s.visits.n}</dd>
            <dt className="text-muted">Searches</dt><dd className="tabular">{s.searches.n}</dd>
            <dt className="text-muted">First search</dt><dd className="tabular">{s.searches.first ?? "none"}</dd>
            <dt className="text-muted">Last search</dt><dd className="tabular">{s.searches.last ?? "none"}</dd>
            <dt className="text-muted">Last page visit</dt><dd className="tabular">{s.visits.last ? dt(s.visits.last) : "none"}</dd>
          </dl>
          {stale !== null && stale > 14 && (
            <p role="status" className="mt-4 rounded-md border border-line bg-raised p-3 text-sm text-warning">
              This export ends {stale} days ago. Download a fresh one from Google Takeout to see recent searches.
            </p>
          )}
        </Card>
        <Card title="Files imported">
          <ul className="space-y-2 text-sm">
            {s.sources.map((f, i) => <li key={i} className="flex justify-between gap-3"><span>{f.browser === "safari" ? "Safari" : "Chrome"} · {f.file}</span><span className="tabular text-muted">{f.visits} visits · {f.importedAt.slice(0, 10)}</span></li>)}
          </ul>
        </Card>
        <Card title="What the exports do not contain" className="lg:col-span-2">
          <p className="text-sm text-muted">Neither export records the number of results, response time, which result you clicked, or country. Pages here say “led to” instead of “clicked” for that reason.</p>
          <p className="mt-3 text-sm text-muted">Chrome lists every visit. Safari lists each page once, with the time of its latest visit, so a search you repeated many times shows up once in Safari. Safari totals are therefore lower bounds, and “where it led” is least reliable for Safari.</p>
        </Card>
        <div className="lg:col-span-2"><Command /></div>
      </div>
      <p className="mt-4 text-xs text-muted">Database: <code className="font-mono">{dbPath}</code></p>
    </>
  );
}

function Command() {
  return (
    <Card title="Add or refresh data">
      <p className="mb-2 text-sm text-muted">From the project folder, point the importer at the Takeout folder that holds History.json. Importing the same file twice does nothing; a newer export adds only the new visits.</p>
      <pre className="overflow-x-auto rounded-md bg-bg p-3 font-mono text-xs">python3 replica/import_takeout.py data search.db</pre>
    </Card>
  );
}
