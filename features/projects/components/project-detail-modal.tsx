"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { Content } from "@tiptap/core";
import { FontFamily } from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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

import {
  CodeLink,
  Error as ErrorIcon,
  Globe,
  Link as LinkIcon,
  ProjectLock,
} from "@/components/icons";

import { getProjectById } from "../lib/actions";
import { PlatformPreview } from "./platform-preview";

interface ProjectDetailModalProps {
  projectId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailModal({
  projectId,
  open,
  onOpenChange,
}: ProjectDetailModalProps) {
  const [isManualRetrying, setIsManualRetrying] = useState(false);

  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId!),
    enabled: !!projectId && open,
  });

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

  // Loading state
  if ((isLoading && !project) || isManualRetrying) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Loading project...</DialogTitle>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </DialogHeader>

          <div className="space-y-5">
            {/* Action Buttons Skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>

            {/* Tech Stack Skeleton */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>

            {/* Rich Content Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
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
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="font-serif text-2xl leading-tight tracking-wider">
              {project?.name}
            </DialogTitle>
            {project?.visibility === "PUBLIC" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Globe className="text-primary h-5 w-5 shrink-0" />
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
                    <ProjectLock className="text-muted-foreground h-5 w-5 shrink-0" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Private</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <DialogDescription className="text-muted-foreground text-start text-sm leading-relaxed">
            {project?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button asChild size="sm">
              <a
                href={project?.liveLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                Live Demo
              </a>
            </Button>
            {project?.codeLink && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={project?.codeLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CodeLink className="h-3.5 w-3.5" />
                  Code
                </a>
              </Button>
            )}
          </div>

          {/* Tech Stack */}
          {project?.techStack && project.techStack.length > 0 && (
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
        </div>

        {/* Platform Previews */}
        {project && <PlatformPreview liveLink={project.liveLink} />}
      </DialogContent>
    </Dialog>
  );
}
