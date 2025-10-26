"use client";

import { useState } from "react";
import Image from "next/image";
import { Twitter, MessageSquare, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlatformPreviewProps {
  liveLink: string;
  projectName: string;
  projectDescription: string;
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

export function PlatformPreview({
  liveLink,
  projectName,
  projectDescription,
  metadata,
}: PlatformPreviewProps) {
  const [twitterImageError, setTwitterImageError] = useState(false);
  const [discordImageError, setDiscordImageError] = useState(false);
  const [peerlistImageError, setPeerlistImageError] = useState(false);

  // Twitter uses twitter-specific metadata with fallbacks
  const twitterTitle =
    metadata?.twitter.title ||
    metadata?.openGraph.title ||
    metadata?.html.title ||
    projectName;
  const twitterDescription =
    metadata?.twitter.description ||
    metadata?.openGraph.description ||
    metadata?.html.description ||
    projectDescription;
  const twitterImage = metadata?.twitter.image || metadata?.openGraph.image;

  // Discord uses Open Graph metadata
  const discordTitle =
    metadata?.openGraph.title || metadata?.html.title || projectName;
  const discordDescription =
    metadata?.openGraph.description ||
    metadata?.html.description ||
    projectDescription;
  const discordImage = metadata?.openGraph.image;

  // Peerlist uses similar metadata to Twitter
  const peerlistTitle =
    metadata?.twitter.title ||
    metadata?.openGraph.title ||
    metadata?.html.title ||
    projectName;
  const peerlistDescription =
    metadata?.twitter.description ||
    metadata?.openGraph.description ||
    metadata?.html.description ||
    projectDescription;
  const peerlistImage = metadata?.twitter.image || metadata?.openGraph.image;

  const hostname = new URL(liveLink).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  return (
    <Tabs defaultValue="twitter" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="twitter" className="gap-1.5">
          <Twitter className="h-3.5 w-3.5" />
          Twitter
        </TabsTrigger>
        <TabsTrigger value="discord" className="gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" />
          Discord
        </TabsTrigger>
        <TabsTrigger value="peerlist" className="gap-1.5">
          <Users className="h-3.5 w-3.5" />
          Peerlist
        </TabsTrigger>
      </TabsList>

      {/* Twitter Card */}
      <TabsContent value="twitter" className="mt-3">
        {metadata?.twitter.card === "summary_large_image" ? (
          // Large Image Card (summary_large_image) - Twitter Style
          <div className="flex flex-col gap-1">
            <div className="relative aspect-2/1 w-full overflow-hidden rounded-xl">
              {twitterImage && !twitterImageError ? (
                <Image
                  src={twitterImage}
                  alt={twitterTitle}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  onError={() => setTwitterImageError(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg
                    className="h-12 w-12 text-[rgb(113,118,123)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <p className="text-muted-foreground bg-muted absolute bottom-3 left-2 line-clamp-1 rounded-lg px-2.5 py-1 text-[13px] leading-4">
                {twitterTitle}
              </p>
            </div>
            <p className="text-muted-foreground line-clamp-1 text-[13px] leading-4">
              From {hostname}
            </p>
          </div>
        ) : (
          // Summary Card (default/summary) - Twitter Style
          <div className="group border-border overflow-hidden rounded-2xl border">
            <div className="bg-muted/10 flex">
              <div className="bg-muted relative h-[125px] w-[125px] shrink-0">
                {twitterImage && !twitterImageError ? (
                  <Image
                    src={twitterImage}
                    alt={twitterTitle}
                    fill
                    className="object-cover"
                    onError={() => setTwitterImageError(true)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg
                      className="text-muted-foreground h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1 p-3">
                <p className="text-muted-foreground line-clamp-1 text-[14px] leading-4">
                  {hostname}
                </p>
                <p className="text-accent-foreground line-clamp-1 text-[15px] leading-5 font-normal">
                  {twitterTitle}
                </p>
                <p className="text-muted-foreground line-clamp-2 text-[14px] leading-4">
                  {twitterDescription}
                </p>
              </div>
            </div>
          </div>
        )}
      </TabsContent>

      {/* Discord Embed */}
      <TabsContent value="discord" className="mt-3">
        <div className="bg-muted/10 border-l-primary rounded-md border border-l-4 p-3">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <p className="text-primary text-sm font-semibold">
                {discordTitle}
              </p>
              <p className="text-muted-foreground line-clamp-3 text-xs">
                {discordDescription}
              </p>
            </div>
            <div className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
              {discordImage && !discordImageError ? (
                <Image
                  src={discordImage}
                  alt={discordTitle}
                  fill
                  className="object-cover"
                  onError={() => setDiscordImageError(true)}
                />
              ) : (
                <div className="bg-muted flex h-full items-center justify-center">
                  <svg
                    className="text-muted-foreground h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Peerlist Card */}
      <TabsContent value="peerlist" className="mt-3">
        <div className="group border-border overflow-hidden rounded-2xl border">
          <div className="bg-muted/10 flex items-center px-3">
            <div className="flex flex-1 flex-col justify-center gap-1 py-5 pr-3">
              <p className="text-accent-foreground line-clamp-1 text-[15px] leading-5 font-normal">
                {peerlistTitle}
              </p>
              <p className="text-muted-foreground line-clamp-2 text-[14px] leading-4">
                {peerlistDescription}
              </p>
              <div className="flex flex-1 items-end gap-1.5">
                <Image
                  src={faviconUrl}
                  alt={`${hostname} favicon`}
                  width={12}
                  height={12}
                  className="rounded-sm"
                  unoptimized
                />
                <p className="text-muted-foreground line-clamp-1 text-[12px] leading-4">
                  {hostname}
                </p>
              </div>
            </div>
            <div className="bg-muted relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md">
              {discordImage && !discordImageError ? (
                <Image
                  src={discordImage}
                  alt={discordTitle}
                  fill
                  className="object-cover"
                  onError={() => setDiscordImageError(true)}
                />
              ) : (
                <div className="bg-muted flex h-full items-center justify-center">
                  <svg
                    className="text-muted-foreground h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
