import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Create Project Card Skeleton */}
      <div className="bg-card flex h-full min-h-[240px] items-center justify-center rounded-xl border-2 border-dashed p-8">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* Project Card Skeletons */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-card flex min-h-[240px] flex-col gap-4 rounded-xl border p-6"
        >
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-4/5" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-1.5">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Tech stack */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Footer */}
          <div className="mt-auto border-t pt-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <div className="flex gap-1.5">
                <Skeleton className="h-7 w-7 rounded-lg" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
