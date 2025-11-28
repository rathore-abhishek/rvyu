"use client";

import { useState } from "react";

import Image from "next/image";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Save from "@/components/icons/save";

import {
  toggleProjectLike,
  toggleProjectSave,
} from "@/features/lists/lib/project-actions";

import {
  CodeLink,
  Heart,
  Link as LinkIcon,
  User as UserIcon,
} from "@/components/icons";

import { ProjectCardPreview } from "./project-card-preview";

interface ProjectCardProps {
  listProjectId: string;
  projectId: string;
  name: string;
  description: string;
  liveLink: string;
  codeLink: string | null;
  techStack: Array<{
    id: string;
    label: string;
    image: string | null;
  }>;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  voteCount: number;
  userVoted: boolean;
  userSaved: boolean;
  currentUserId: string | null;
  onClick: () => void;
}

export function ProjectCard({
  listProjectId,
  projectId,
  name,
  description,
  liveLink,
  codeLink,
  techStack,
  user,
  voteCount,
  userVoted,
  userSaved,
  currentUserId,
  onClick,
}: ProjectCardProps) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(userVoted);
  const [saved, setSaved] = useState(userSaved);
  const [likeCount, setLikeCount] = useState(voteCount);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const { mutate: toggleLike, isPending: isLiking } = useMutation({
    mutationFn: toggleProjectLike,
    onMutate: async () => {
      if (!currentUserId) {
        toast.error("Please log in to like projects");
        throw new Error("Not logged in");
      }

      // Optimistic update
      const previousLiked = liked;
      const previousCount = likeCount;

      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);

      return { previousLiked, previousCount };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context) {
        setLiked(context.previousLiked);
        setLikeCount(context.previousCount);
      }
      if (error.message !== "Not logged in") {
        toast.error("Failed to update like");
      }
    },
    onSuccess: () => {
      // Invalidate to refetch with latest data
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

      // Optimistic update
      const previousSaved = saved;
      setSaved(!saved);

      return { previousSaved };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context) {
        setSaved(context.previousSaved);
      }
      if (error.message !== "Not logged in") {
        toast.error("Failed to update save");
      }
    },
    onSuccess: (data) => {
      toast.success(data.saved ? "Project saved!" : "Project unsaved");
      queryClient.invalidateQueries({ queryKey: ["list-projects"] });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike({ listProjectId });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave({ projectId });
  };

  return (
    <article
      onClick={onClick}
      className="group bg-card hover:border-primary/50 relative flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-colors"
    >
      {/* Project Preview */}
      <ProjectCardPreview liveLink={liveLink} />

      <div className="relative flex flex-col gap-3 p-4">
        {/* Header with Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="line-clamp-1 text-base leading-tight font-semibold tracking-tight">
              {name}
            </h3>
            {description && (
              <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                {description}
              </p>
            )}
          </div>

          {/* Compact Action Buttons */}
          <div className="flex shrink-0 items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`h-8 gap-1.5 px-2.5 ${liked ? "text-destructive hover:text-destructive" : "text-muted-foreground"}`}
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
        </div>

        {/* Tech Stack - Expandable Icons */}
        {techStack && techStack.length > 0 && (
          <div className="flex items-center">
            {techStack.slice(0, 5).map((tech) => {
              const isHovered = hoveredTech === tech.id;
              return (
                <motion.div
                  key={tech.id}
                  className="bg-muted flex h-7 cursor-pointer items-center rounded-full border shadow-sm"
                  style={{
                    marginLeft: "-8px",
                    zIndex: isHovered ? 10 : 1,
                  }}
                  animate={{
                    width: isHovered ? "auto" : "28px",
                  }}
                  onMouseEnter={() => setHoveredTech(tech.id)}
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
                      <span className="text-[10px] font-semibold">
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
                        <span className="whitespace-nowrap">{tech.label}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
            {techStack.length > 5 && (
              <motion.div
                className="bg-muted text-muted-foreground hover:bg-accent flex h-7 cursor-pointer items-center rounded-full border text-[10px] font-medium shadow-sm"
                style={{
                  marginLeft: "-8px",
                  zIndex: hoveredTech === "more" ? 10 : 1,
                }}
                animate={{
                  width: hoveredTech === "more" ? "auto" : "28px",
                }}
                onMouseEnter={() => setHoveredTech("more")}
                onMouseLeave={() => setHoveredTech(null)}
                layout
                transition={{
                  duration: 0.25,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                  <span className="text-[10px] font-semibold">
                    +{techStack.length - 5}
                  </span>
                </div>

                <AnimatePresence>
                  {hoveredTech === "more" && (
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

        {/* Footer - Creator & Links */}
        <div className="flex items-center justify-between gap-3 border-t pt-3">
          {/* Creator */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="text-xs">
                {user.name ? (
                  user.name
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
            <span className="text-muted-foreground truncate text-sm">
              {user.name || "Anonymous"}
            </span>
          </div>

          {/* External Links */}
          <div className="flex shrink-0 items-center gap-1">
            {codeLink && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="icon-lg"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <CodeLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>View Code</p>
                </TooltipContent>
              </Tooltip>
            )}
            {liveLink && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="icon-lg"
                      variant="ghost"
                      className="hover:text-foreground fill-accent"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>View Live</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
