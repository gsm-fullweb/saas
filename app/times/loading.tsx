export default function TimesLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-full md:w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>

              <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded"></div>

              <div className="flex space-x-2">
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
