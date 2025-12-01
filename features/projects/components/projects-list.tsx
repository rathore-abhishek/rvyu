"use client";

import { useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ListProjectDetailModal,
  ProjectCard,
} from "@/features/lists/components";
import { getListProjects } from "@/features/lists/lib/actions";

import { Error as ErrorIcon, FolderCode, Loader } from "@/components/icons";

import ProjectsTable from "./projects-table";

interface ProjectsListProps {
  listId: string;
  search: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  view: "card" | "table";
  currentUserId: string | null;
}

const ProjectsList = ({
  listId,
  search,
  sortBy,
  sortDirection,
  view,
  currentUserId,
}: ProjectsListProps) => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [selectedListProjectId, setSelectedListProjectId] = useState<
    string | null
  >(null);
  const [selectedProjectSaved, setSelectedProjectSaved] = useState(false);

  // Fetch projects with infinite scroll
  const {
    data: projectsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    error: projectsError,
    refetch: refetchProjects,
  } = useInfiniteQuery({
    queryKey: ["list-projects", listId, search, sortBy, sortDirection],
    queryFn: ({ pageParam }) =>
      getListProjects({
        listId,
        search: search || undefined,
        cursor: pageParam,
        limit: 12,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  const allProjects =
    projectsData?.pages.flatMap((page) => page.projects) ?? [];

  const handleProjectClick = (
    projectId: string,
    listProjectId: string,
    userSaved: boolean,
  ) => {
    setSelectedProjectId(projectId);
    setSelectedListProjectId(listProjectId);
    setSelectedProjectSaved(userSaved);
    setDetailModalOpen(true);
  };

  // Loading state
  if (isProjectsLoading && !projectsData) {
    if (view === "table") {
      return (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card flex flex-col overflow-hidden rounded-xl border"
          >
            <Skeleton className="aspect-2/1 w-full rounded-b-none" />
            <div className="space-y-4 p-5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isProjectsError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ErrorIcon className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Failed to load projects</EmptyTitle>
          <EmptyDescription>
            {projectsError?.message || "Something went wrong"}
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" onClick={() => refetchProjects()}>
          Try Again
        </Button>
      </Empty>
    );
  }

  // Empty state
  if (allProjects.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderCode className="text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>
            {search ? "No projects found" : "No projects yet"}
          </EmptyTitle>
          <EmptyDescription>
            {search
              ? "Try adjusting your search terms"
              : "Be the first to submit a project to this list"}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      {/* Card View */}
      {view === "card" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((lp) => (
              <ProjectCard
                key={lp.id}
                listProjectId={lp.id}
                projectId={lp.project.id}
                name={lp.project.name}
                description={lp.project.description}
                liveLink={lp.project.liveLink}
                codeLink={lp.project.codeLink}
                techStack={lp.project.techStack}
                userSaved={lp.userSaved}
                currentUserId={currentUserId}
                onClick={() =>
                  handleProjectClick(lp.project.id, lp.id, lp.userSaved)
                }
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader className="h-4 w-4" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <ProjectsTable
          projects={allProjects}
          onProjectClick={handleProjectClick}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}

      {/* Detail Modal */}
      <ListProjectDetailModal
        projectId={selectedProjectId}
        listProjectId={selectedListProjectId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        currentUserId={currentUserId}
        initialSaved={selectedProjectSaved}
      />
    </>
  );
};

export default ProjectsList;
