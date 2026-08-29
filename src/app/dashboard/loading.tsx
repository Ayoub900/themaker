/**
 * Every dashboard route is `force-dynamic`, so without this the browser sat on
 * the old page — nothing moving — until the query came back, which read as a
 * dead nav item. With it, the sidebar stays interactive and the click lands
 * immediately on a skeleton of roughly the right shape.
 */
export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Loading…</span>

      <div className="mb-8 flex flex-col gap-3">
        <div className="h-9 w-56 max-w-full bg-ink/10" />
        <div className="h-4 w-36 max-w-full bg-ink/6" />
      </div>

      <div className="mb-8 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-3 bg-paper p-5 sm:p-6">
            <div className="h-2.5 w-24 bg-ink/8" />
            <div className="h-9 w-20 bg-ink/10" />
            <div className="h-2.5 w-28 bg-ink/6" />
          </div>
        ))}
      </div>

      <div className="bg-paper">
        <div className="h-14 border-b border-ink/10" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-ink/8 px-4 py-5 sm:px-6">
            <div className="h-3 flex-1 bg-ink/8" />
            <div className="hidden h-3 w-24 bg-ink/6 sm:block" />
            <div className="h-3 w-16 bg-ink/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
