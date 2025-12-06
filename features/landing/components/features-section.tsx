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

import { ProjectCardPreview } from "@/features/lists/components";

import { cn } from "@/lib/utils";

import { CodeLink, Link, Loader, Save } from "@/components/icons";

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
              <Input id="name" value={"Frontend Projects"} />
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
              <Input value={"https://youtube.com/playlist?list=..."} />
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

// Skeleton 2: Share List
const SkeletonShareList = () => {
  return (
    <div className="relative flex h-full flex-col items-center justify-center py-8">
      <motion.div
        className="bg-card w-full max-w-xs rounded-xl border p-5 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <svg
              className="text-primary h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <span className="text-foreground font-medium">
            Share submission link
          </span>
        </div>

        {/* Link Input */}
        <div className="bg-muted/50 border-input mb-3 flex items-center gap-2 rounded-lg border p-2.5">
          <span className="text-muted-foreground flex-1 truncate text-sm">
            rvyu.com/submit/abc123
          </span>
          <div className="bg-primary/10 text-primary rounded-md p-1.5">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <motion.div
          className="text-primary flex items-center justify-center gap-1.5 text-sm font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          viewport={{ once: true }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Link copied!</span>
        </motion.div>
      </motion.div>
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
                className={`h-8 w-8 transition-colors ${
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

// Skeleton 4: Reviews & Ratings - matches ReviewItem structure
const SkeletonReviews = () => {
  const reviewItems = [
    { label: "Design", score: 9, delay: 0.3 },
    { label: "UX", score: 8, delay: 0.4 },
    { label: "Creativity", score: 9, delay: 0.5 },
    { label: "Functionality", score: 7, delay: 0.6 },
    { label: "Hireability", score: 8, delay: 0.7 },
  ];

  const overallRating = (9 + 8 + 9 + 7 + 8) / 5;

  return (
    <div className="relative flex h-full items-center justify-center py-8">
      <motion.div
        className="bg-card w-full max-w-sm rounded-xl border p-5 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Overall Rating - matches project-card structure */}
        <motion.div
          className="bg-muted/30 mb-4 flex justify-between rounded-lg border p-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm font-medium uppercase">
            Overall
          </p>
          <div className="bg-primary/10 text-primary flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-sm font-semibold">
            <span>{overallRating.toFixed(1)}</span>
            <span className="text-[12px] opacity-70">/10</span>
          </div>
        </motion.div>

        {/* Review Items - matches ReviewItem component */}
        <div className="bg-muted/30 rounded-lg border p-2.5">
          <div className="grid gap-x-3 gap-y-1.5">
            {reviewItems.map((item) => (
              <div key={item.label} className="flex items-center gap-6">
                <span className="text-muted-foreground w-16 shrink-0 text-xs font-medium">
                  {item.label}
                </span>
                <div className="bg-primary/10 h-1.5 flex-1 overflow-hidden rounded-full">
                  <motion.div
                    className="bg-primary h-full rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(item.score / 10) * 100}%` }}
                    transition={{
                      delay: item.delay,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true }}
                  />
                </div>
                <motion.span
                  className="text-foreground w-4 text-right text-xs font-semibold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: item.delay + 0.2, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  {item.score}
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturesSectionDemo;
