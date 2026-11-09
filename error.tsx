"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-line bg-surface p-6">
      <h1 className="text-lg text-danger">Could not read your search data</h1>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <p className="mt-2 text-sm text-muted">
        Check that <code className="font-mono">search.db</code> exists next to the app folder, then try again.
      </p>
      <button onClick={reset} className="mt-4 h-10 rounded-md bg-accent px-4 text-sm font-semibold text-on-accent">
        Try again
      </button>
    </div>
  );
}
