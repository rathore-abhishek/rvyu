"use client";

import Link from "next/link";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

import { ArrowRight } from "@/components/icons";

const Dashboard = () => {
  return (
    <div className="relative overflow-hidden">
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full mask-[radial-gradient(450px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={1200}
      />

      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <h1 className="text-muted-foreground text-5xl font-medium tracking-tight sm:text-7xl">
            The best way to review <br className="hidden sm:block" />
            your{" "}
            <span className="text-foreground font-serif font-medium tracking-wide">
              community&apos; <span className="italic">projects</span>
            </span>
          </h1>

          <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
            Stop digging through tweets and DMs. Create a list, share the link,
            and let your community submit their work for your next review.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row sm:gap-6"
        >
          <Button asChild size="lg">
            <Link href="/auth/login">
              Create Your First List
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="bg-background/50 mt-12 w-full max-w-5xl rounded-xl border p-2 shadow-2xl backdrop-blur-sm lg:mt-20"
        >
          <div className="from-muted to-muted/50 aspect-video w-full rounded-lg bg-linear-to-br object-cover" />
          {/* Placeholder for a product screenshot or demo video */}
        </motion.div>
      </section>
    </div>
  );
};

export default Dashboard;
