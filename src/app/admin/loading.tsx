export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 rounded bg-muted animate-pulse mb-2" />
          <div className="h-5 w-64 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded bg-muted animate-pulse" />
          <div className="h-9 w-32 rounded bg-muted animate-pulse" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="h-4 w-24 rounded bg-muted animate-pulse mb-3" />
            <div className="h-8 w-20 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}
