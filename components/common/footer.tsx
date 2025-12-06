import React from "react";

import Image from "next/image";

import { Heart } from "@/components/icons";

import { FlickeringGrid } from "../ui/flickering-grid";
import { Meteors } from "../ui/meteors";
import RvyuFuzzy from "./rvyu-fuzzy";

const Footer = () => {
  return (
    <footer className="px-6 py-16">
      <div className="relative container mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-12 overflow-hidden text-center">
        <Meteors number={10} angle={75} />
        <div className="via-muted absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent to-transparent"></div>
        <div className="text-muted-foreground pointer-events-none z-10 flex w-full items-center justify-center pt-20 font-serif text-[10rem] leading-tight font-bold tracking-wide">
          <RvyuFuzzy />
        </div>

        <a
          href="https://rathore-abhishek.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group z-10 flex w-full cursor-pointer items-center justify-center gap-2"
        >
          <Image
            src={"/abhishek.jpg"}
            alt="Abhishek's Pic"
            width={100}
            height={100}
            className="corner-squircles h-10 w-10 rounded-lg"
          />
          <p className="text-muted-foreground group-hover:text-foreground inline-flex gap-1 font-medium transition-colors">
            Shipped with{" "}
            <Heart className="text-destructive" width={24} height={24} /> by
            <span className="group-hover: underline decoration-wavy">
              Abhishek
            </span>
          </p>
        </a>
        <FlickeringGrid
          className="absolute mask-[radial-gradient(180px_circle_at_center,white,transparent)]"
          squareSize={4}
          gridGap={6}
          color="#00a6f4"
          maxOpacity={0.4}
          flickerChance={0.08}
        />
      </div>
    </footer>
  );
};

export default Footer;
