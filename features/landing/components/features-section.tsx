"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import confetti from "canvas-confetti";
import { AnimatePresence, motion, useAnimate } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import CopyShare from "@/components/icons/copy-share";
import Play from "@/components/icons/play";

import { ProjectCardPreview } from "@/features/lists/components";

import { cn } from "@/lib/utils";

import { CodeLink, Link, Loader, Save, Tick } from "@/components/icons";

import Cursor from "../icons/cursor";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Create Lists",
      description:
        "Create organized lists for different projects, playlists, or categories. Simple and intuitive.",
      skeleton: <SkeletonCreateList />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-r",
    },
    {
      title: "Share with Others",
      description:
        "Share your list's submission link. Others can easily submit their work.",
      skeleton: <SkeletonShareList />,
      className: "border-b col-span-1 lg:col-span-2",
    },
    {
      title: "Save Projects",
      description: "Bookmark interesting projects with one click.",
      skeleton: <SkeletonSaveProject />,
      className: "col-span-1 lg:col-span-3 lg:border-r",
    },
    {
      title: "Reviews & Ratings",
      description:
        "Add detailed reviews with ratings for design, UX, creativity, and more. Help creators grow.",
      skeleton: <SkeletonReviews />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];

  return (
    <div className="relative z-20 mx-auto max-w-5xl">
      {/* Features Heading */}
      <div className="mb-8 space-y-3">
        <h2 className="text-foreground font-serif text-4xl font-bold tracking-wider">
          Why rvyu?
        </h2>
        <p className="text-muted-foreground max-w-md text-base">
          No more hunting through DMs or tweets. Just create a list, share the
          link, and let people submit their stuff.
        </p>
      </div>

      <div className="border-border grid grid-cols-1 rounded-xl border lg:grid-cols-6">
        {features.map((feature) => (
          <FeatureCard key={feature.title} className={feature.className}>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
            <div className="h-full w-full">{feature.skeleton}</div>
          </FeatureCard>
        ))}
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`relative overflow-hidden p-4 sm:p-8`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="text-foreground mx-auto max-w-5xl text-left font-serif text-xl font-semibold tracking-wider md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="text-muted-foreground mx-0 my-2 max-w-sm text-left text-sm">
      {children}
    </p>
  );
};

// Skeleton 1: Create List Form
const SkeletonCreateList = () => {
  return (
    <div className="relative flex h-full justify-center px-2 py-8 perspective-distant transform-3d">
      <Card className="w-full max-w-md rotate-x-20 rotate-y-20 -rotate-z-10">
        <CardHeader>
          <CardTitle className="font-serif text-xl tracking-wider">
            Create new list
          </CardTitle>
          <CardDescription>Add a new projects list.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2 duration-300">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={"Frontend Projects"} readOnly />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of this review list..."
                rows={3}
                className="resize-none"
                value={""}
                readOnly
              />
            </div>

            {/* Playlist Link Field */}
            <div className="space-y-2">
              <Label htmlFor="playlistLink">
                Playlist link{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input value={"https://youtube.com/playlist?list=..."} readOnly />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">Create list</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="from-background via-background pointer-events-none absolute inset-x-0 bottom-0 z-40 h-32 w-full bg-gradient-to-t to-transparent" />
      <div className="from-background via-background pointer-events-none absolute right-0 z-40 h-full w-30 bg-gradient-to-l to-transparent" />
    </div>
  );
};

// Skeleton 2: Share List - List cards with cursor animation and toast
const SkeletonShareList = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [scope, animate] = useAnimate();

  const mockLists = [
    {
      name: "Backend APIs",
      description: "REST and GraphQL projects",
      date: "Nov 28",
    },
    {
      name: "Frontend Projects",
      description: "React, Vue, and Angular showcases",
      date: "Dec 2",
    },
    {
      name: "Mobile Apps",
      description: "iOS and Android applications",
      date: "Dec 5",
    },
  ];

  useEffect(() => {
    const easeOut = [0.0, 0.0, 0.2, 1] as const;
    const easeInOut = [0.4, 0, 0.2, 1] as const;

    async function runAnimation() {
      // Reset states
      setIsCopied(false);

      // Reset cursor to start position (below the copy button)
      await animate(
        "#share-cursor",
        { opacity: 0, translateX: 0, translateY: 20, scale: 1 },
        { duration: 0 },
      );

      // Reset toast
      await animate(
        "#share-toast",
        { opacity: 0, translateY: 20, scale: 0.95 },
        { duration: 0 },
      );

      // Small delay before starting
      await new Promise((r) => setTimeout(r, 600));

      // 1. Cursor fades in smoothly
      await animate(
        "#share-cursor",
        { opacity: 1 },
        { duration: 0.4, ease: easeOut },
      );

      // 2. Cursor moves to copy button (upward and slightly left to center on button)
      await animate(
        "#share-cursor",
        { translateX: -4, translateY: -10 },
        { duration: 0.7, ease: easeInOut },
      );

      // 3. Hover effect on button
      await animate(
        "#copy-btn",
        {
          backgroundColor: "var(--color-primary-10, rgba(59, 130, 246, 0.15))",
        },
        { duration: 0.15, ease: easeOut },
      );

      // Natural pause before click
      await new Promise((r) => setTimeout(r, 180));

      // 4. Click - cursor presses down
      await animate(
        "#share-cursor",
        { scale: 0.85 },
        { duration: 0.06, ease: easeOut },
      );
      animate("#copy-btn", { scale: 0.92 }, { duration: 0.06, ease: easeOut });
      await new Promise((r) => setTimeout(r, 60));

      // 5. Release click
      animate("#share-cursor", { scale: 1 }, { duration: 0.1, ease: easeOut });
      await animate(
        "#copy-btn",
        { scale: 1 },
        { duration: 0.1, ease: easeOut },
      );

      // 6. Show copied state
      setIsCopied(true);

      // Cursor drifts away
      animate(
        "#share-cursor",
        { translateX: 10, translateY: 5, opacity: 0.4 },
        { duration: 0.35, ease: easeOut },
      );

      // 7. Show toast notification with slide + scale
      await new Promise((r) => setTimeout(r, 150));
      await animate(
        "#share-toast",
        { opacity: 1, translateY: 0, scale: 1 },
        { duration: 0.25, ease: easeOut },
      );

      // Hold success state
      await new Promise((r) => setTimeout(r, 2200));

      // 8. Hide toast
      await animate(
        "#share-toast",
        { opacity: 0, translateY: 8, scale: 0.98 },
        { duration: 0.25, ease: easeInOut },
      );

      // 9. Cursor returns to start
      await animate(
        "#share-cursor",
        { translateX: 0, translateY: 20, opacity: 0 },
        { duration: 0.4, ease: easeInOut },
      );

      // Reset button
      animate(
        "#copy-btn",
        { backgroundColor: "transparent" },
        { duration: 0.15 },
      );

      // Pause before loop
      await new Promise((r) => setTimeout(r, 500));

      runAnimation();
    }

    const timeout = setTimeout(runAnimation, 500);
    return () => clearTimeout(timeout);
  }, [animate]);

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center py-6"
      ref={scope}
    >
      {/* Stacked List Cards */}
      <div className="relative w-full max-w-xs space-y-3">
        {/* Card Above (faded) */}
        <div className="bg-card rounded-xl border p-4 opacity-40">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{mockLists[0].name}</h3>
            <p className="text-muted-foreground text-xs">
              {mockLists[0].description}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-2">
            <span className="text-muted-foreground text-[10px]">
              Created {mockLists[0].date}
            </span>
            <div className="flex gap-1">
              <div className="bg-muted h-5 w-5 rounded" />
              <div className="bg-muted h-5 w-5 rounded" />
            </div>
          </div>
        </div>

        {/* Main Card (active) */}
        <div className="bg-card relative rounded-xl border p-4 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold">{mockLists[1].name}</h3>
            </div>
            <p className="text-muted-foreground text-xs">
              {mockLists[1].description}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-2">
            <span className="text-muted-foreground text-[10px]">
              Created {mockLists[1].date}
            </span>
            <div className="relative flex gap-1">
              {/* Play Button */}
              <div
                className={`text-muted-foreground flex h-6 w-6 cursor-default items-center justify-center rounded-md transition-colors`}
              >
                <Play className="h-3.5 w-3.5" />
              </div>

              {/* Copy Button */}
              <div
                id="copy-btn"
                className={`flex h-6 w-6 cursor-default items-center justify-center rounded-md transition-colors ${
                  isCopied
                    ? "bg-green-500/10 text-green-500"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {isCopied ? (
                  <Tick className="h-3.5 w-3.5" />
                ) : (
                  <CopyShare className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Cursor - positioned at bottom-right of copy button */}
              <Cursor
                id="share-cursor"
                className="absolute -right-2 -bottom-2 size-5 opacity-0"
              />
            </div>
          </div>
        </div>

        {/* Card Below (faded) */}
        <div className="bg-card rounded-xl border p-4 opacity-40">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{mockLists[2].name}</h3>
            <p className="text-muted-foreground text-xs">
              {mockLists[2].description}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between border-t pt-2">
            <span className="text-muted-foreground text-[10px]">
              Created {mockLists[2].date}
            </span>
            <div className="flex gap-1">
              <div className="bg-muted h-5 w-5 rounded" />
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <div
          id="share-toast"
          className="bg-card absolute right-0 bottom-4 left-0 mx-auto flex w-fit items-center gap-2 rounded-lg border px-3 py-2 opacity-0 shadow-xl"
          style={{ transform: "translateY(20px) scale(0.95)" }}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15">
            <Tick className="h-3 w-3 text-green-500" />
          </div>
          <span className="text-xs font-medium whitespace-nowrap">
            Link copied!
          </span>
        </div>
      </div>
      <div className="from-background via-background/80 pointer-events-none absolute inset-x-0 top-0 z-40 h-16 w-full bg-gradient-to-b to-transparent" />
      <div className="from-background via-background/80 pointer-events-none absolute inset-x-0 bottom-0 z-40 h-16 w-full bg-gradient-to-t to-transparent" />
    </div>
  );
};

// Skeleton 3: Save Project - matches project-card structure
const SkeletonSaveProject = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [scope, animate] = useAnimate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const techStack = [
    {
      id: "a2d56511-3b3f-4deb-9d30-9044c7ed1e57",
      label: "Nextjs",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    },
    {
      id: "373a9190-11bb-4d91-9c0a-54b8302b2dc8",
      label: "React",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      id: "d39832cb-008f-407a-b1d1-c0adb0307ec6",
      label: "Framermotion",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg",
    },
    {
      id: "f5ee96e1-0f51-4c4d-90d6-173c748efdab",
      label: "Tailwindcss",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    },
    {
      id: "e0cf9e31-53a8-44b1-b909-d248f3dd3e25",
      label: "Supabase",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    },
    {
      id: "9367672d-b82d-44f8-858b-da5648bb508f",
      label: "Postgresql",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    },
  ];

  useEffect(() => {
    const easeOut = [0.0, 0.0, 0.2, 1] as const;
    const easeInOut = [0.4, 0, 0.2, 1] as const;

    async function runAnimation() {
      // Reset states
      setSaved(false);
      setIsPending(false);

      // Reset cursor to start position (bottom-left, invisible)
      await animate(
        "#cursor",
        { opacity: 0, translateX: 0, translateY: 40, scale: 1 },
        { duration: 0 },
      );

      // Small delay before starting
      await new Promise((r) => setTimeout(r, 300));

      // 1. Cursor fades in smoothly
      await animate(
        "#cursor",
        { opacity: 1 },
        { duration: 0.4, ease: easeOut },
      );

      // 2. Cursor moves to button with natural curve
      await animate(
        "#cursor",
        { translateX: 12, translateY: -8 },
        { duration: 0.9, ease: easeInOut },
      );

      // 3. Hover effect on button
      await animate(
        "#button",
        { backgroundColor: "var(--color-primary-10, rgba(59, 130, 246, 0.1))" },
        { duration: 0.2, ease: easeOut },
      );

      // Natural pause before click
      await new Promise((r) => setTimeout(r, 250));

      // 4. Click - cursor presses down
      await animate(
        "#cursor",
        { scale: 0.85 },
        { duration: 0.08, ease: easeOut },
      );

      // Button reacts
      animate("#button", { scale: 0.94 }, { duration: 0.08, ease: easeOut });
      await new Promise((r) => setTimeout(r, 80));

      // 5. Release click
      animate("#cursor", { scale: 1 }, { duration: 0.12, ease: easeOut });
      await animate("#button", { scale: 1 }, { duration: 0.12, ease: easeOut });

      // 6. Start loading state - just show subtle opacity change
      setIsPending(true);

      // Cursor drifts away naturally
      animate(
        "#cursor",
        { translateX: 25, translateY: 10, opacity: 0.5 },
        { duration: 0.5, ease: easeOut },
      );

      // 7. Wait for "loading" (shorter, no spinner)
      await new Promise((r) => setTimeout(r, 1200));

      // 8. Complete - show saved state
      setIsPending(false);
      setSaved(true);

      // 9. Fire confetti! Get button position for accurate origin
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 15,
          spread: 25,
          origin: { x, y },
          colors: ["#3b82f6", "#22c55e", "#eab308", "#ec4899", "#8b5cf6"],
          startVelocity: 12,
          gravity: 0.5,
          scalar: 0.5,
          ticks: 60,
          drift: 0,
        });
      }

      // Hold the saved state
      await new Promise((r) => setTimeout(r, 2000));

      // 10. Cursor smoothly returns to start position
      await animate(
        "#cursor",
        { translateX: 0, translateY: 40, opacity: 0 },
        { duration: 0.6, ease: easeInOut },
      );

      // Reset button background
      animate("#button", { backgroundColor: "transparent" }, { duration: 0.3 });

      // Small pause before looping
      await new Promise((r) => setTimeout(r, 500));

      // Loop the animation
      runAnimation();
    }

    // Start animation after initial delay
    const timeout = setTimeout(runAnimation, 800);
    return () => clearTimeout(timeout);
  }, [animate]);

  return (
    <div className="relative flex h-full items-center justify-center py-8 transform-flat">
      <article className="group bg-card relative flex max-w-sm translate-z-10 flex-col overflow-hidden rounded-xl border perspective-distant">
        {/* Project Preview */}
        <ProjectCardPreview liveLink={"https://tailwindcss.com"} />

        <div className="relative flex flex-1 flex-col gap-3 p-4">
          {/* Header with Actions */}
          <div className="flex flex-1 items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-foreground line-clamp-1 text-base leading-tight font-semibold tracking-tight">
                Tailwind CSS Docs
              </h3>
              <p className="text-muted-foreground line-clamp-2 flex-1 text-sm leading-snug">
                I like tailwind, I love tailwind, I adore tailwind, and also
                framer motion.
              </p>
            </div>

            {/* Save Button */}
            <div className="relative" ref={scope}>
              <Button
                ref={buttonRef}
                variant="ghost"
                size="icon-sm"
                id="button"
                className={`h-8 w-8 cursor-default transition-colors ${
                  saved
                    ? "text-primary hover:text-primary hover:bg-primary/10"
                    : isPending
                      ? "text-muted-foreground"
                      : "text-muted-foreground hover:text-muted-foreground"
                }`}
              >
                {isPending ? (
                  <Loader className="h-3.5 w-3.5" />
                ) : (
                  <motion.div
                    animate={{ scale: saved ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Save
                      className={`h-3.5 w-3.5 ${saved && "fill-current"}`}
                    />
                  </motion.div>
                )}
              </Button>

              {/* Cursor */}
              <Cursor
                id="cursor"
                className="absolute bottom-0 left-0 size-5 opacity-0"
              />
            </div>
          </div>

          {/* Tech Stack */}
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

          {/* Footer */}
          <div className="mt-auto flex items-center justify-end gap-3 border-t pt-3">
            {/* External Links */}
            <div className="flex shrink-0 items-center gap-1">
              <a
                href={"#"}
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

              <a
                href={"#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="icon-lg"
                  variant="ghost"
                  className="hover:text-foreground fill-accent"
                >
                  <Link className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </article>
      <div className="from-background via-background pointer-events-none absolute inset-x-0 bottom-0 z-40 h-32 w-full bg-gradient-to-t to-transparent" />
    </div>
  );
};

// Skeleton 4: Reviews & Ratings - Static mockup like Create List
const SkeletonReviews = () => {
  const ratingCategories = [
    { label: "Design and Aesthetics", value: 8 },
    { label: "User Experience", value: 7 },
    { label: "Creativity", value: 9 },
    { label: "Functionality", value: 8 },
    { label: "Hireability", value: 7 },
  ];

  const overallRating =
    ratingCategories.reduce((acc, cat) => acc + cat.value, 0) /
    ratingCategories.length;

  return (
    <div className="relative flex h-full justify-center px-2 py-8">
      <div className="max-h-[20rem] w-full">
        <Card className="w-full max-w-md">
          <CardHeader className="pb-4">
            <CardTitle className="font-serif text-xl tracking-wider">
              Submit Review
            </CardTitle>
            <CardDescription>
              Rate this project across different criteria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* Overall Rating Display */}
              <div className="bg-muted/30 flex flex-col items-center justify-center gap-1 rounded-xl border p-4 text-center">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Overall Rating
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold">
                    {overallRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-lg">/ 10</span>
                </div>
              </div>

              {/* Rating Sliders */}
              <div className="space-y-4">
                {ratingCategories.map((category) => (
                  <div key={category.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {category.label}
                      </Label>
                      <span className="text-muted-foreground font-mono text-sm">
                        {category.value} / 10
                      </span>
                    </div>
                    {/* Static Slider Mockup */}
                    <div className="bg-muted relative h-2 w-full rounded-full">
                      <div
                        className="bg-primary absolute top-0 left-0 h-full rounded-full"
                        style={{ width: `${(category.value / 10) * 100}%` }}
                      />
                      <div
                        className="bg-primary absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                        style={{
                          left: `calc(${(category.value / 10) * 100}% - 8px)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Remarks Field */}
              <div className="space-y-2">
                <Label>
                  Remarks{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Textarea
                  placeholder="Add your detailed review here..."
                  rows={2}
                  className="resize-none"
                  value={"Great project! The design is clean and modern."}
                  readOnly
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">
                  Pick Another
                </Button>
                <Button className="flex-1">Submit Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="from-background via-background pointer-events-none absolute inset-x-0 bottom-0 z-40 h-32 w-full bg-gradient-to-t to-transparent" />
      <div className="from-background via-background pointer-events-none absolute right-0 z-40 h-full w-30 bg-gradient-to-l to-transparent" />
    </div>
  );
};

export default FeaturesSectionDemo;
