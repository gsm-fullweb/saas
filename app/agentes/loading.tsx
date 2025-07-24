import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AgentesLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-6 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Agents List Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto mb-1" />
                    <Skeleton className="h-4 w-6 mx-auto mb-1" />
                    <Skeleton className="h-3 w-8 mx-auto" />
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="flex space-x-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
