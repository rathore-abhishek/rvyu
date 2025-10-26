"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, Lock, ExternalLink, Code, Calendar } from "lucide-react";
import Image from "next/image";
import { formatDate } from "../lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

interface ProjectDetailModalProps {
  project: {
    id: string;
    name: string;
    description: string;
    body?: string | null;
    liveLink: string;
    codeLink?: string | null;
    visibility: "PUBLIC" | "PRIVATE";
    techStack: { id: string; label: string; image?: string | null }[];
    createdAt: Date;
    updatedAt: Date;
  } | null;
  open: boolean;
  onClose: () => void;
  ogImage?: string | null;
}

export function ProjectDetailModal({
  project,
  open,
  onClose,
  ogImage,
}: ProjectDetailModalProps) {
  const [imageError, setImageError] = useState(false);
  // Parse body content for display
  const bodyContent = project?.body
    ? (() => {
        try {
          return JSON.parse(project.body);
        } catch {
          return null;
        }
      })()
    : null;

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: bodyContent,
    immediatelyRender: false,
  });

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
        {/* Hero Image Section */}
        {ogImage && !imageError && (
          <div className="relative h-48 w-full overflow-hidden border-b">
            <Image
              src={ogImage}
              alt={project.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              priority
            />
          </div>
        )}

        {/* Content Section */}
        <div className="space-y-4 p-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight">
                {project.name}
              </h2>
              {project.visibility === "PUBLIC" ? (
                <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
                  <Globe className="h-3 w-3" />
                  Public
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs">
                  <Lock className="h-3 w-3" />
                  Private
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {project.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
            </Button>
            {project.codeLink && (
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                  <Code className="h-3.5 w-3.5" />
                  Code
                </a>
              </Button>
            )}
          </div>

          <Separator />

          {/* Tech Stack */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center gap-2 rounded-md border bg-muted/30 px-2.5 py-1.5 text-xs"
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
                  <span>{tech.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rich Content Body */}
          {bodyContent && editor && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground">Details</h3>
                <div className="prose dark:prose-invert prose-sm max-w-none rounded-md border bg-muted/20 p-4 text-sm break-all overflow-x-hidden">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-3 border-t pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
            {project.updatedAt.getTime() !== project.createdAt.getTime() && (
              <>
                <span>•</span>
                <span>Updated {formatDate(project.updatedAt)}</span>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
