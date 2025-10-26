"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe, Lock, ExternalLink, Code } from "lucide-react";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlatformPreview } from "./platform-preview";

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
  metadata: {
    openGraph: {
      title: string | null;
      description: string | null;
      image: string | null;
    };
    twitter: {
      card: string | null;
      title: string | null;
      description: string | null;
      image: string | null;
    };
    html: {
      title: string | null;
      description: string | null;
    };
  } | null;
}

export function ProjectDetailModal({
  project,
  open,
  onClose,
  metadata,
}: ProjectDetailModalProps) {
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
    content: bodyContent,
    immediatelyRender: false,
  });

  if (!project) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
      key={open ? project.id : "closed"}
    >
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="font-serif text-2xl leading-tight tracking-wider">
              {project.name}
            </DialogTitle>
            {project.visibility === "PUBLIC" ? (
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
                    <Lock className="text-muted-foreground h-5 w-5 shrink-0" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Private</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <DialogDescription className="text-muted-foreground text-start text-sm leading-relaxed">
            {project.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button asChild size="sm">
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
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
                  <Code className="h-3.5 w-3.5" />
                  Code
                </a>
              </Button>
            )}
          </div>

          {/* Tech Stack */}
          {project.techStack.length > 0 && (
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
        <PlatformPreview
          liveLink={project.liveLink}
          projectName={project.name}
          projectDescription={project.description}
          metadata={metadata}
        />
      </DialogContent>
    </Dialog>
  );
}
