export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-64 animate-pulse rounded-md bg-raised" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-surface" />)}
      </div>
      <div className="h-80 animate-pulse rounded-lg bg-surface" />
    </div>
  );
}
