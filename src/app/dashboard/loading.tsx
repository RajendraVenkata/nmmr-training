export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-64 rounded bg-muted animate-pulse mb-2" />
        <div className="h-5 w-80 rounded bg-muted animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="h-4 w-24 rounded bg-muted animate-pulse mb-3" />
            <div className="h-8 w-16 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="h-6 w-48 rounded bg-muted animate-pulse" />
        <div className="h-4 w-full rounded bg-muted animate-pulse" />
        <div className="h-2 w-full rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}
