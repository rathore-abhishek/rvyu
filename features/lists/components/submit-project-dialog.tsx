"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getProjects } from "@/features/projects/lib/actions";
import { formatDate } from "@/features/projects/lib/utils";

import { cn } from "@/lib/utils";

import {
  Calendar,
  CodeLink,
  Error as ErrorIcon,
  FolderCode,
  Link as LinkIcon,
  Loader,
  Search as SearchIcon,
  Tick,
} from "@/components/icons";

import { submitProjectsToList } from "../lib/actionts";

interface SubmitProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
  listName: string;
  submittedProjectIds?: string[];
}

export function SubmitProjectDialog({
  open,
  onOpenChange,
  listId,
  listName,
  submittedProjectIds = [],
}: SubmitProjectDialogProps) {
  const [search, setSearch] = useState("");
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Initialize with submitted projects
  const [selectedProjectIds, setSelectedProjectIds] =
    useState<string[]>(submittedProjectIds);

  // Reset all state when dialog closes for fresh start on next open
  useEffect(() => {
    if (!open) {
      // Dialog is closed - reset everything
      setSearch("");
      setSelectedProjectIds([]);
      setHoveredTech(null);
    } else {
      // Dialog is opening - initialize with submitted projects
      setSelectedProjectIds(submittedProjectIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: open,
  });

  const submitMutation = useMutation({
    mutationFn: (projectIds: string[]) =>
      submitProjectsToList({ listId, projectIds }),
    onSuccess: (result) => {
      let message = "";

      if (result.added > 0 && result.removed > 0) {
        message = `${result.added} ${result.added === 1 ? "project" : "projects"} added, ${result.removed} removed`;
      } else if (result.added > 0) {
        message = `${result.added} ${result.added === 1 ? "project" : "projects"} added successfully!`;
      } else if (result.removed > 0) {
        message = `${result.removed} ${result.removed === 1 ? "project" : "projects"} removed successfully!`;
      } else {
        message = "No changes made";
      }

      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["list-details", listId] });
      onOpenChange(false);
      setSelectedProjectIds([]);
      setSearch("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update projects");
    },
  });

  const filteredProjects = projects?.filter(
    (project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = () => {
    submitMutation.mutate(selectedProjectIds);
  };

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Projects</DialogTitle>
          <DialogDescription>
            Select projects to add or remove from &quot;{listName}&quot;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search your projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          {/* Projects List */}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border p-4"
                >
                  {/* Checkbox skeleton */}
                  <Skeleton className="mt-0.5 h-5 w-5 shrink-0" />

                  {/* Content skeleton */}
                  <div className="min-w-0 flex-1 space-y-3">
                    {/* Title and description */}
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>

                    {/* Tech stack */}
                    <div className="flex gap-1">
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <Skeleton className="h-7 w-7 rounded-full" />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t pt-2">
                      <Skeleton className="h-3 w-20" />
                      <div className="flex gap-1">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ErrorIcon className="text-destructive" />
                </EmptyMedia>
                <EmptyTitle>Failed to load projects</EmptyTitle>
                <EmptyDescription>
                  {error?.message || "Something went wrong"}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : !filteredProjects || filteredProjects.length === 0 ? (
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
                    ? "Try adjusting your search"
                    : "Create a project in your dashboard first"}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ScrollArea className="h-[400px]">
              <ul className="space-y-2">
                {filteredProjects.map((project) => {
                  const isSelected = selectedProjectIds.includes(project.id);

                  return (
                    <li
                      key={project.id}
                      onClick={() => toggleProjectSelection(project.id)}
                      className={`group relative w-full cursor-pointer rounded-lg border p-4 text-left transition-all hover:shadow-md ${
                        isSelected
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox/Check indicator */}
                        <div
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-border",
                          )}
                        >
                          <Tick
                            className={cn(
                              "text-primary-foreground h-3 w-3 opacity-0 transition-opacity",
                              isSelected && "opacity-100",
                            )}
                          />
                        </div>

                        {/* Project Info */}
                        <div className="min-w-0 flex-1 space-y-3">
                          <div>
                            <h4 className="leading-tight font-semibold">
                              {project.name}
                            </h4>
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                              {project.description}
                            </p>
                          </div>

                          {/* Tech Stack */}
                          {project.techStack &&
                            project.techStack.length > 0 && (
                              <div className="flex items-center">
                                {project.techStack.slice(0, 5).map((tech) => {
                                  const isHovered =
                                    hoveredTech === `${project.id}-${tech.id}`;
                                  return (
                                    <motion.div
                                      key={tech.id}
                                      className="bg-muted flex h-7 cursor-pointer items-center rounded-full border shadow-sm"
                                      style={{
                                        marginLeft: "-6px",
                                        zIndex: isHovered ? 10 : 1,
                                      }}
                                      animate={{
                                        width: isHovered ? "auto" : "28px",
                                      }}
                                      onMouseEnter={() =>
                                        setHoveredTech(
                                          `${project.id}-${tech.id}`,
                                        )
                                      }
                                      onMouseLeave={() => setHoveredTech(null)}
                                      layout
                                      transition={{
                                        duration: 0.25,
                                        ease: [0.4, 0, 0.2, 1],
                                      }}
                                    >
                                      <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                                        {tech.image ? (
                                          <Image
                                            src={tech.image}
                                            alt={tech.label}
                                            width={16}
                                            height={16}
                                            className="h-4 w-4 rounded-full object-contain"
                                          />
                                        ) : (
                                          <span className="text-xs font-semibold">
                                            {tech.label.charAt(0).toUpperCase()}
                                          </span>
                                        )}
                                      </div>

                                      <AnimatePresence>
                                        {isHovered && (
                                          <motion.span
                                            className="overflow-hidden pr-2 text-xs font-medium"
                                            initial={{
                                              width: 0,
                                              opacity: 0,
                                              marginLeft: 0,
                                            }}
                                            animate={{
                                              width: "auto",
                                              opacity: 1,
                                              marginLeft: "4px",
                                            }}
                                            exit={{
                                              width: 0,
                                              opacity: 0,
                                              marginLeft: 0,
                                            }}
                                            transition={{
                                              duration: 0.2,
                                              ease: [0.4, 0, 0.2, 1],
                                            }}
                                          >
                                            <span className="whitespace-nowrap">
                                              {tech.label}
                                            </span>
                                          </motion.span>
                                        )}
                                      </AnimatePresence>
                                    </motion.div>
                                  );
                                })}
                                {project.techStack.length > 5 && (
                                  <motion.div
                                    className="bg-muted text-muted-foreground hover:bg-accent flex h-7 cursor-pointer items-center rounded-full border text-xs font-medium shadow-sm"
                                    style={{
                                      marginLeft: "-6px",
                                      zIndex:
                                        hoveredTech === `${project.id}-more`
                                          ? 10
                                          : 1,
                                    }}
                                    animate={{
                                      width:
                                        hoveredTech === `${project.id}-more`
                                          ? "auto"
                                          : "28px",
                                    }}
                                    onMouseEnter={() =>
                                      setHoveredTech(`${project.id}-more`)
                                    }
                                    onMouseLeave={() => setHoveredTech(null)}
                                    layout
                                    transition={{
                                      duration: 0.25,
                                      ease: [0.4, 0, 0.2, 1],
                                    }}
                                  >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                                      <span className="text-xs font-semibold">
                                        +{project.techStack.length - 5}
                                      </span>
                                    </div>

                                    <AnimatePresence>
                                      {hoveredTech === `${project.id}-more` && (
                                        <motion.span
                                          className="overflow-hidden pr-2 text-xs font-medium"
                                          initial={{
                                            width: 0,
                                            opacity: 0,
                                            marginLeft: 0,
                                          }}
                                          animate={{
                                            width: "auto",
                                            opacity: 1,
                                            marginLeft: "4px",
                                          }}
                                          exit={{
                                            width: 0,
                                            opacity: 0,
                                            marginLeft: 0,
                                          }}
                                          transition={{
                                            duration: 0.2,
                                            ease: [0.4, 0, 0.2, 1],
                                          }}
                                        >
                                          <span className="whitespace-nowrap">
                                            more
                                          </span>
                                        </motion.span>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                )}
                              </div>
                            )}

                          {/* Footer - Date and Links */}
                          <div className="flex items-center justify-between border-t pt-2">
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(project.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {project.codeLink && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <a
                                      href={project.codeLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button
                                        size="icon-sm"
                                        variant="ghost"
                                        className="text-muted-foreground hover:text-primary h-6 w-6 shrink-0 rounded-lg"
                                      >
                                        <CodeLink className="h-3 w-3" />
                                      </Button>
                                    </a>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Code</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {project.liveLink && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <a
                                      href={project.liveLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Button
                                        size="icon-sm"
                                        variant="ghost"
                                        className="text-muted-foreground hover:text-primary h-6 w-6 shrink-0 rounded-lg"
                                      >
                                        <LinkIcon className="h-3 w-3" />
                                      </Button>
                                    </a>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Live</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || !projects}
            >
              {submitMutation.isPending ? (
                <>
                  <Loader className="h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Tick className="h-4 w-4" />
                  Save{" "}
                  {selectedProjectIds.length > 0 &&
                    `(${selectedProjectIds.length})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
