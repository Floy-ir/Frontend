export default function LoadingFlightResults() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-gray-200"></div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
            <span className="mx-3">→</span>
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
          </div>

          <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="flex gap-4">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Flight results placeholders */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-4 animate-pulse rounded-lg bg-white p-4 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 h-5 w-32 rounded bg-gray-200"></div>
              <div className="h-4 w-20 rounded bg-gray-200"></div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="mx-auto mb-1 h-5 w-12 rounded bg-gray-200"></div>
                <div className="mx-auto h-4 w-16 rounded bg-gray-200"></div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-1 h-4 w-24 rounded bg-gray-200"></div>
                <div className="mx-auto mt-1 w-20 border-t border-dashed"></div>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-1 h-5 w-12 rounded bg-gray-200"></div>
                <div className="mx-auto h-4 w-16 rounded bg-gray-200"></div>
              </div>
            </div>

            <div>
              <div className="mb-2 h-6 w-24 rounded bg-gray-200"></div>
              <div className="h-8 w-20 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
