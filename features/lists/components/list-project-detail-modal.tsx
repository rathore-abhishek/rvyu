"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Content } from "@tiptap/core";
import { FontFamily } from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "motion/react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Save from "@/components/icons/save";

import { PlatformPreview } from "@/features/projects/components/platform-preview";

import {
  Calendar,
  CodeLink,
  Error as ErrorIcon,
  Github,
  Heart,
  Link as LinkIcon,
  LinkedIn,
  User as UserIcon,
  X,
} from "@/components/icons";

import {
  getProjectDetails,
  toggleProjectLike,
  toggleProjectSave,
} from "../lib/project-actions";
import { formatDate } from "../lib/utis";

interface ListProjectDetailModalProps {
  projectId: string | null;
  listProjectId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string | null;
  initialLiked?: boolean;
  initialLikeCount?: number;
  initialSaved?: boolean;
}

export function ListProjectDetailModal({
  projectId,
  listProjectId,
  open,
  onOpenChange,
  currentUserId,
  initialLiked = false,
  initialLikeCount = 0,
  initialSaved = false,
}: ListProjectDetailModalProps) {
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => getProjectDetails(projectId!),
    enabled: !!projectId && open,
  });

  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const bodyContent = project?.body
    ? typeof project.body === "string"
      ? (JSON.parse(project.body) as Content)
      : (project.body as Content)
    : undefined;

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-2 hover:text-primary cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    immediatelyRender: false,
  });

  // Update editor content when bodyContent changes
  useEffect(() => {
    if (editor && bodyContent) {
      editor.commands.setContent(bodyContent);
    }
  }, [editor, bodyContent]);

  const { mutate: toggleLike, isPending: isLiking } = useMutation({
    mutationFn: toggleProjectLike,
    onMutate: async () => {
      if (!currentUserId) {
        toast.error("Please log in to like projects");
        throw new Error("Not logged in");
      }

      const previousLiked = liked;
      const previousCount = likeCount;
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      return { previousLiked, previousCount };
    },
    onError: (error, variables, context) => {
      if (context) {
        setLiked(context.previousLiked);
        setLikeCount(context.previousCount);
      }
      if (error.message !== "Not logged in") {
        toast.error("Failed to update like");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-details"] });
      queryClient.invalidateQueries({ queryKey: ["list-projects"] });
    },
  });

  const { mutate: toggleSave, isPending: isSaving } = useMutation({
    mutationFn: toggleProjectSave,
    onMutate: async () => {
      if (!currentUserId) {
        toast.error("Please log in to save projects");
        throw new Error("Not logged in");
      }

      const previousSaved = saved;
      setSaved(!saved);
      return { previousSaved };
    },
    onError: (error, variables, context) => {
      if (context) {
        setSaved(context.previousSaved);
      }
      if (error.message !== "Not logged in") {
        toast.error("Failed to update save");
      }
    },
    onSuccess: (data) => {
      toast.success(data.saved ? "Project saved!" : "Project unsaved");
      queryClient.invalidateQueries({ queryKey: ["project-details"] });
      queryClient.invalidateQueries({ queryKey: ["list-projects"] });
    },
  });

  const handleLike = () => {
    if (listProjectId) {
      toggleLike({ listProjectId });
    }
  };

  const handleSave = () => {
    if (projectId) {
      toggleSave({ projectId });
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Loading project...</DialogTitle>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </DialogHeader>
          <div className="space-y-5">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle className="sr-only">Error loading project</DialogTitle>
          <div className="flex flex-col items-center justify-center py-12">
            <ErrorIcon className="text-destructive mb-4 h-8 w-8" />
            <p className="text-muted-foreground mb-4 text-sm">
              {error?.message || "Failed to load project"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={listProjectId}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl leading-tight tracking-wider">
            {project.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-start text-sm leading-relaxed">
            {project.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Action Buttons with Like & Save */}
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                Live Demo
              </a>
            </Button>
            {project.codeLink && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={project.codeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CodeLink className="h-3.5 w-3.5" />
                  Code
                </a>
              </Button>
            )}
            <div className="bg-border mx-2 h-6 w-px" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`gap-1.5 rounded-full px-2.5 ${liked ? "text-destructive hover:text-destructive" : "text-muted-foreground"}`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`}
                  />
                  {likeCount > 0 && (
                    <span className="text-xs font-medium tabular-nums">
                      {likeCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{liked ? "Unlike" : "Like"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`h-8 w-8 ${saved ? "text-primary" : "text-muted-foreground"}`}
                >
                  <motion.div
                    animate={{ scale: saved ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Save
                      className={`h-3.5 w-3.5 ${saved && "fill-current"}`}
                    />
                  </motion.div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{saved ? "Unsave" : "Save"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-muted/30 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5"
                >
                  {tech.image && (
                    <Image
                      src={tech.image}
                      alt={tech.label}
                      width={16}
                      height={16}
                      className="rounded-sm"
                    />
                  )}
                  <span className="text-xs font-medium">{tech.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Rich Content */}
          {bodyContent && editor && (
            <div className="prose dark:prose-invert prose-sm max-w-none text-sm">
              <EditorContent editor={editor} />
            </div>
          )}

          {/* Creator & Date */}
          <div className="flex items-center justify-between gap-4 border-t pt-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={project.user.image || ""}
                  alt={project.user.name || "User"}
                />
                <AvatarFallback>
                  {project.user.name ? (
                    project.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {project.user.name || "Anonymous"}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  {project.user.github && (
                    <a
                      href={project.user.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.user.twitter && (
                    <a
                      href={project.user.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.user.linkedin && (
                    <a
                      href={project.user.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <LinkedIn className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs">{formatDate(project.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Platform Previews */}
        {project && <PlatformPreview liveLink={project.liveLink} />}
      </DialogContent>
    </Dialog>
  );
}
