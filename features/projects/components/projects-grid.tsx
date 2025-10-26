"use client";

import { useState } from "react";
import { useRouter } from "@bprogress/next/app";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getProjects, deleteProject } from "../lib/actions";
import { formatDate } from "../lib/utils";
import { CreateProjectCard } from "./create-project-card";
import { ProjectsGridSkeleton } from "./projects-grid-skeleton";
import {
  Globe,
  Lock,
  Loader2,
  AlertCircle,
  ExternalLink,
  Code,
} from "lucide-react";
import Edit from "@/components/icons/edit";
import Delete from "@/components/icons/delete";
import Calendar from "@/components/icons/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProjectsGrid() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const {
    data: projects,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { mutate: deleteProjectMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/dashboard/projects/${id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setProjectToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProjectMutation(projectToDelete.id);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/dashboard/projects/${id}`);
  };

  if (isLoading) {
    return <ProjectsGridSkeleton />;
  }

  if (isError) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Failed to load projects</EmptyTitle>
          <EmptyDescription>
            {error?.message || "Something went wrong"}
          </EmptyDescription>
        </EmptyHeader>
        <Button onClick={() => refetch()}>Try Again</Button>
      </Empty>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CreateProjectCard />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CreateProjectCard />

        {projects.map((project) => (
          <article
            key={project.id}
            onClick={() => handleCardClick(project.id)}
            className="group bg-card hover:shadow-primary/5 relative flex cursor-pointer flex-col overflow-hidden rounded-xl border"
          >
            {/* Gradient overlay on hover */}
            <div className="from-primary/5 absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex h-full flex-col gap-4 p-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-lg leading-tight font-semibold tracking-tight transition-colors">
                        {project.name}
                      </h3>
                      {project.visibility === "PUBLIC" ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex">
                              <Globe className="text-primary h-4 w-4 shrink-0" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Public</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex">
                              <Lock className="text-muted-foreground h-4 w-4 shrink-0" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Private</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex scale-95 gap-1.5 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 lg:opacity-0">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={(e) => handleEdit(e, project.id)}
                      className="text-muted-foreground shrink-0 rounded-lg"
                    >
                      <Edit />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={(e) =>
                        handleDeleteClick(e, project.id, project.name)
                      }
                      className="text-destructive lg:text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 rounded-lg"
                    >
                      <Delete />
                    </Button>
                  </div>
                </div>
              </div>

              {project.techStack && project.techStack.length > 0 && (
                <div className="flex items-center">
                  {project.techStack.slice(0, 5).map((tech) => {
                    const isHovered =
                      hoveredTech === `${project.id}-${tech.id}`;
                    return (
                      <motion.div
                        key={tech.id}
                        className="bg-muted flex h-8 cursor-pointer items-center rounded-full border shadow-sm"
                        style={{
                          marginLeft: "-8px",
                          zIndex: isHovered ? 10 : 1,
                        }}
                        animate={{
                          width: isHovered ? "auto" : "32px",
                        }}
                        onMouseEnter={() =>
                          setHoveredTech(`${project.id}-${tech.id}`)
                        }
                        onMouseLeave={() => setHoveredTech(null)}
                        layout
                        transition={{
                          duration: 0.25,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                          {tech.image ? (
                            <Image
                              src={tech.image}
                              alt={tech.label}
                              width={20}
                              height={20}
                              className="h-5 w-5 rounded-full object-contain"
                            />
                          ) : (
                            <span className="text-xs font-semibold">
                              {tech.label.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Text - only renders when hovered */}
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
                              exit={{ width: 0, opacity: 0, marginLeft: 0 }}
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
                      className="bg-muted text-muted-foreground hover:bg-accent flex h-8 cursor-pointer items-center rounded-full border text-xs font-medium shadow-sm"
                      style={{
                        marginLeft: "-8px",
                        zIndex: hoveredTech === `${project.id}-more` ? 10 : 1,
                      }}
                      animate={{
                        width:
                          hoveredTech === `${project.id}-more`
                            ? "auto"
                            : "32px",
                      }}
                      onMouseEnter={() => setHoveredTech(`${project.id}-more`)}
                      onMouseLeave={() => setHoveredTech(null)}
                      layout
                      transition={{
                        duration: 0.25,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
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
                            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                          >
                            <span className="whitespace-nowrap">more</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto border-t pt-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {project.codeLink && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={`/dashboard/projects/${project.codeLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-muted-foreground hover:text-primary shrink-0 rounded-lg"
                            >
                              <Code className="h-3.5 w-3.5" />
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
                            href={`/dashboard/projects/${project.liveLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-muted-foreground hover:text-primary shrink-0 rounded-lg"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
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
          </article>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{projectToDelete?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setProjectToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Delete />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ProjectsGrid;
