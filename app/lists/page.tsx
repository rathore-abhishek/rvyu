"use client";

import { useState } from "react";

import Link from "next/link";

import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getLists } from "@/features/lists/lib/actionts";
import { formatDate } from "@/features/lists/lib/utis";

import {
  Calendar,
  Error as ErrorIcon,
  FolderCode,
  Loader,
  NoImage,
  Search as SearchIcon,
  User as UserIcon,
} from "@/components/icons";

const Lists = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isManualRetrying, setIsManualRetrying] = useState(false);

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["public-lists", debouncedSearch],
    queryFn: ({ pageParam }) =>
      getLists({
        search: debouncedSearch || undefined,
        cursor: pageParam,
        limit: 12,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  const allLists = data?.pages.flatMap((page) => page.lists) ?? [];

  // Loading state
  if ((isLoading && !data) || isManualRetrying) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="bg-muted h-10 w-48 animate-pulse rounded-lg" />
            <div className="bg-muted h-12 w-full max-w-md animate-pulse rounded-lg" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card flex h-64 animate-pulse flex-col gap-4 rounded-xl border p-6"
              >
                <div className="bg-muted h-6 w-3/4 rounded" />
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-2/3 rounded" />
                <div className="mt-auto flex items-center gap-2">
                  <div className="bg-muted h-8 w-8 rounded-full" />
                  <div className="bg-muted h-4 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ErrorIcon className="text-destructive" />
            </EmptyMedia>
            <EmptyTitle>Failed to load lists</EmptyTitle>
            <EmptyDescription>
              {error?.message || "Something went wrong"}
            </EmptyDescription>
          </EmptyHeader>
          <Button
            variant="outline"
            onClick={async () => {
              setIsManualRetrying(true);
              await refetch();
              setIsManualRetrying(false);
            }}
          >
            Try Again
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight">
              Explore Lists
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Discover curated project collections from the community
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search lists..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lists Grid */}
        {allLists.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderCode className="text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>
                {debouncedSearch ? "No lists found" : "No lists yet"}
              </EmptyTitle>
              <EmptyDescription>
                {debouncedSearch
                  ? "Try adjusting your search terms"
                  : "Be the first to create a public list!"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allLists.map((list) => {
                const uniqueUsers = Array.from(
                  new Map(
                    list.listProjects.map((lp) => [
                      lp.project.user.id,
                      lp.project.user,
                    ]),
                  ).values(),
                ).slice(0, 3);

                return (
                  <Link key={list.id} href={`/lists/${list.id}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-card hover:shadow-primary/5 relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border transition-all hover:shadow-lg"
                    >
                      {/* Gradient overlay on hover */}
                      <div className="from-primary/5 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="relative flex h-full flex-col gap-4 p-6">
                        {/* Header */}
                        <div className="space-y-2">
                          <h3 className="text-lg leading-tight font-semibold tracking-tight">
                            {list.name}
                          </h3>
                          {list.description && (
                            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                              {list.description}
                            </p>
                          )}
                        </div>

                        {/* Creator */}
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={list.user.image || ""}
                              alt={list.user.name || "User"}
                            />
                            <AvatarFallback className="text-xs">
                              {list.user.name ? (
                                list.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                              ) : (
                                <UserIcon className="h-3 w-3" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground text-sm">
                            by {list.user.name || "Anonymous"}
                          </span>
                        </div>

                        {/* Contributors */}
                        {uniqueUsers.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-muted-foreground text-xs font-medium">
                              Contributors
                            </p>
                            <div className="flex items-center">
                              {uniqueUsers.map((user, idx) => (
                                <Tooltip key={user.id}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className="relative"
                                      style={{
                                        marginLeft: idx > 0 ? "-8px" : "0",
                                        zIndex: uniqueUsers.length - idx,
                                      }}
                                    >
                                      <Avatar className="border-card h-8 w-8 border-2">
                                        <AvatarImage
                                          src={user.image || ""}
                                          alt={user.name || "User"}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {user.name ? (
                                            user.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .toUpperCase()
                                              .slice(0, 2)
                                          ) : (
                                            <NoImage className="h-4 w-4" />
                                          )}
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{user.name || "Anonymous"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto space-y-3 border-t pt-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                              <FolderCode className="h-3.5 w-3.5 shrink-0" />
                              <span>
                                {list._count.listProjects}{" "}
                                {list._count.listProjects === 1
                                  ? "project"
                                  : "projects"}
                              </span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                              <Calendar className="h-3.5 w-3.5 shrink-0" />
                              <span>{formatDate(list.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>

            {/* Load More */}
            {hasNextPage && (
              <div className="flex justify-center">
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
    </div>
  );
};

export default Lists;
