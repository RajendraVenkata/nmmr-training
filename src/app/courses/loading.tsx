export default function CoursesLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="mx-auto h-8 w-48 rounded bg-muted animate-pulse mb-3" />
        <div className="mx-auto h-5 w-80 rounded bg-muted animate-pulse" />
      </div>

      <div className="mb-8 space-y-4">
        <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-32 rounded-md bg-muted animate-pulse" />
          <div className="h-9 w-32 rounded-md bg-muted animate-pulse" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded bg-muted animate-pulse" />
              <div className="h-5 w-20 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-6 w-3/4 rounded bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
            </div>
            <div className="flex justify-between pt-2">
              <div className="h-5 w-20 rounded bg-muted animate-pulse" />
              <div className="h-5 w-16 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
