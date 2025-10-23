export function ChartPlaceholder() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
      <div className="mb-2 font-sans text-sm font-medium text-slate-700">Emotional Progress Over Time</div>
      <div aria-hidden="true" className="h-40 w-full rounded-md bg-slate-100" title="Graph placeholder" />
      <p className="mt-2 text-sm text-slate-500">Chart preview will appear here</p>
    </div>
  )
}
