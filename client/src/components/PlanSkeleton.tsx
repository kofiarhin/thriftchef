function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-line ${className}`} />;
}

/**
 * Announced politely rather than assertively: generation can take 30 seconds,
 * and a screen reader user needs to know work is underway without the whole
 * skeleton being read out.
 */
export function PlanSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-8">
      <span className="sr-only">Generating your meal plan. This may take up to 30 seconds.</span>

      <div aria-hidden="true" className="grid gap-4 rounded-lg border border-line bg-surface-raised p-5 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-2">
            <Block className="h-3 w-24" />
            <Block className="h-7 w-28" />
          </div>
        ))}
      </div>

      <div aria-hidden="true">
        <Block className="h-5 w-40" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 7 }, (_, index) => (
            <div
              key={index}
              className="space-y-2 rounded-lg border border-line bg-surface-raised p-4"
            >
              <Block className="h-3 w-16" />
              <Block className="h-4 w-full" />
              <Block className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden="true">
        <Block className="h-5 w-28" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-line bg-surface-raised p-5"
            >
              <Block className="h-4 w-48" />
              <Block className="h-3 w-full" />
              <Block className="h-3 w-5/6" />
              <Block className="h-3 w-4/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
