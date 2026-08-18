export default function PublicPageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
    >
      <span className="sr-only">Loading page</span>
      <div className="h-7 w-32 animate-pulse rounded-full bg-brand-500/15" />
      <div className="flex max-w-3xl flex-col gap-4">
        <div className="h-12 w-4/5 animate-pulse rounded-2xl bg-white/10 sm:h-16" />
        <div className="h-4 w-full animate-pulse rounded-full bg-white/5" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900/60"
          >
            <div className="aspect-4/3 animate-pulse bg-white/5" />
            <div className="flex flex-col gap-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
