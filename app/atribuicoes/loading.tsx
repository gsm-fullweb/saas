export default function AtribuicoesLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>

        {/* Conversations List Skeleton */}
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  )
}
