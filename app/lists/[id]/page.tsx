"use client";

import React, { useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Calendar,
  Edit,
  Error as ErrorIcon,
  FolderCode,
  Loader,
  Plus,
  Search as SearchIcon,
  User as UserIcon,
} from "@/components/icons";

import {
  EditListDialog,
  ListProjectDetailModal,
  ProjectCard,
  SubmitProjectDialog,
} from "@/features/lists/components";
import { getListDetails } from "@/features/lists/lib/actionts";
import { getListProjects } from "@/features/lists/lib/project-actions";
import { formatDate } from "@/features/lists/lib/utis";

import { getUser } from "@/actions/user";

const ListDetails = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  
  // Initialize from URL params
  const urlSearch = searchParams.get("search") || "";
  const urlSort = (searchParams.get("sort") as "recent" | "likes") || "recent";
  
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedListProjectId, setSelectedListProjectId] = useState<string | null>(null);
  const [selectedProjectLiked, setSelectedProjectLiked] = useState(false);
  const [selectedProjectLikeCount, setSelectedProjectLikeCount] = useState(0);
  const [selectedProjectSaved, setSelectedProjectSaved] = useState(false);
  const [isManualRetrying, setIsManualRetrying] = useState(false);
  const [search, setSearch] = useState(urlSearch);
  const [sortBy, setSortBy] = useState<"recent" | "likes">(urlSort);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user
  const { data: userData } = useQuery({
    queryKey: ["current-user"],
    queryFn: getUser,
  });

  // Update currentUserId when userData changes
  React.useEffect(() => {
    setCurrentUserId(userData?.id || null);
  }, [userData]);

  // Update URL params helper
  const updateUrlParams = React.useCallback(
    (newSearch?: string, newSort?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (newSearch !== undefined) {
        if (newSearch) {
          params.set("search", newSearch);
        } else {
          params.delete("search");
        }
      }
      
      if (newSort !== undefined) {
        if (newSort !== "recent") {
          params.set("sort", newSort);
        } else {
          params.delete("sort");
        }
      }
      
      const newUrl = params.toString() 
        ? `/lists/${id}?${params.toString()}`
        : `/lists/${id}`;
      
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, id, router]
  );

  // Debounce search and update URL
  React.useEffect(() => {
    const timer = setTimeout(() => {
      updateUrlParams(search, undefined);
    }, 300);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  
  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };
  
  // Handle sort change (immediate URL update)
  const handleSortChange = (value: "recent" | "likes") => {
    setSortBy(value);
    updateUrlParams(search, value);
  };

  // Fetch list details
  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
    refetch: refetchList,
  } = useQuery({
    queryKey: ["list-details", id],
    queryFn: () => getListDetails(id),
  });

  // Fetch projects with infinite scroll (use URL params as source of truth)
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
    queryKey: ["list-projects", id, urlSearch, urlSort],
    queryFn: ({ pageParam }) =>
      getListProjects({
        listId: id,
        search: urlSearch || undefined,
        cursor: pageParam,
        limit: 12,
        sortBy: urlSort,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  const allProjects = projectsData?.pages.flatMap((page) => page.projects) ?? [];
  const isOwner = currentUserId === listData?.userId;

  const handleProjectClick = (
    projectId: string,
    listProjectId: string,
    userVoted: boolean,
    voteCount: number,
    userSaved: boolean
  ) => {
    setSelectedProjectId(projectId);
    setSelectedListProjectId(listProjectId);
    setSelectedProjectLiked(userVoted);
    setSelectedProjectLikeCount(voteCount);
    setSelectedProjectSaved(userSaved);
    setDetailModalOpen(true);
  };

  // Loading state
  if ((isListLoading && !listData) || isManualRetrying) {
    return (
      <div className="container mx-auto mt-6 mb-32 max-w-6xl space-y-8 px-6">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="bg-muted h-10 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-4 w-full max-w-2xl animate-pulse rounded" />
            <div className="bg-muted h-4 w-1/2 max-w-2xl animate-pulse rounded" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-card flex h-64 animate-pulse flex-col gap-4 rounded-xl border p-6"
              >
                <div className="bg-muted h-6 w-3/4 rounded" />
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-2/3 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isListError) {
    return (
      <div className="container mx-auto mt-6 mb-32 max-w-6xl space-y-8 px-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ErrorIcon className="text-destructive" />
            </EmptyMedia>
            <EmptyTitle>Failed to load list</EmptyTitle>
            <EmptyDescription>
              {listError?.message || "Something went wrong"}
            </EmptyDescription>
          </EmptyHeader>
          <Button
            variant="outline"
            onClick={async () => {
              setIsManualRetrying(true);
              await refetchList();
              setIsManualRetrying(false);
            }}
          >
            Try Again
          </Button>
        </Empty>
      </div>
    );
  }

  if (!listData) {
    return null;
  }

  const submittedProjectIds = listData.listProjects.map((lp) => lp.project.id);

  return (
    <div className="container mx-auto mt-6 mb-32 max-w-6xl space-y-8 px-6">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Title and Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <h1 className="font-serif text-3xl font-semibold tracking-wider sm:text-4xl">
              {listData.name}
            </h1>
            {listData.description && (
              <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
                {listData.description}
              </p>
            )}

            {/* Creator Info */}
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={listData.user.image || ""}
                  alt={listData.user.name || "User"}
                />
                <AvatarFallback className="text-xs">
                  {listData.user.name ? (
                    listData.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  ) : (
                    <UserIcon className="h-3.5 w-3.5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-sm">
                by {listData.user.name || "Anonymous"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 gap-2">
            {isOwner && (
              <Button
                variant="outline"
                size="default"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
                Edit List
              </Button>
            )}
            <Button
              size="default"
              onClick={() => setSubmitDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Submit Project
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-card flex flex-wrap items-center gap-4 rounded-xl border p-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              Created {formatDate(listData.createdAt)}
            </span>
          </div>
          {listData.createdAt.getTime() !== listData.updatedAt.getTime() && (
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">
                Updated {formatDate(listData.updatedAt)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FolderCode className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">
                {listData._count.listProjects}
              </span>{" "}
              {listData._count.listProjects === 1 ? "project" : "projects"}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="w-full max-w-md">
          <InputGroupAddon>
            <SearchIcon className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </InputGroup>

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        {isProjectsLoading && !projectsData ? (
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
        ) : isProjectsError ? (
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
            <Button
              variant="outline"
              onClick={() => refetchProjects()}
            >
              Try Again
            </Button>
          </Empty>
        ) : allProjects.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderCode className="text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>
                {urlSearch ? "No projects found" : "No projects yet"}
              </EmptyTitle>
              <EmptyDescription>
                {urlSearch
                  ? "Try adjusting your search terms"
                  : "Be the first to submit a project to this list"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
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
                  user={lp.project.user}
                  voteCount={lp.voteCount}
                  userVoted={lp.userVoted}
                  userSaved={lp.userSaved}
                  currentUserId={currentUserId}
                  onClick={() => handleProjectClick(lp.project.id, lp.id, lp.userVoted, lp.voteCount, lp.userSaved)}
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
          </>
        )}
      </div>

      {/* Dialogs */}
      <SubmitProjectDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        listId={id}
        listName={listData.name}
        submittedProjectIds={submittedProjectIds}
      />

      {isOwner && (
        <EditListDialog
          listId={id}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}

      <ListProjectDetailModal
        projectId={selectedProjectId}
        listProjectId={selectedListProjectId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        currentUserId={currentUserId}
        initialLiked={selectedProjectLiked}
        initialLikeCount={selectedProjectLikeCount}
        initialSaved={selectedProjectSaved}
      />
    </div>
  );
};

export default ListDetails;
