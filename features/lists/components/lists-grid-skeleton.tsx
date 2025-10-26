import { Skeleton } from "@/components/ui/skeleton";

export function ListsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <article
          key={i}
          className="bg-card relative overflow-hidden rounded-xl border"
        >
          <div className="relative space-y-4 p-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* Title skeleton */}
                  <Skeleton className="mb-2 h-7 w-3/4" />
                  {/* Description skeleton */}
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                </div>

                {/* Action buttons skeleton */}
                <div className="flex gap-1.5">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-3.5 w-3.5 rounded" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
