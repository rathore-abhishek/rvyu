import React from "react";

import Image from "next/image";

import { Github, Heart, Mail } from "@/components/icons";

import { FlickeringGrid } from "../ui/flickering-grid";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Lists", href: "/lists" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "License", href: "/license" },
    ],
  };

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com",
      icon: <Github className="h-5 w-5" />,
    },
    {
      label: "Email",
      href: "mailto:hello@rvyu.com",
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  return (
    <footer className="px-6 py-16">
      <div className="relative container mx-auto flex w-full max-w-6xl flex-col items-center gap-12 text-center">
        <div className="via-muted absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent to-transparent"></div>
        <p className="text-muted-foreground pointer-events-none z-10 font-serif text-[10rem] leading-tight font-bold tracking-wide">
          rvyu
          <span className="from-primary via-muted-foreground bg-linear-to-br to-white bg-clip-text text-transparent">
            .
          </span>
        </p>

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
            Build with{" "}
            <Heart className="text-destructive" width={24} height={24} /> by
            <span className="group-hover: underline decoration-wavy">
              Abhishek
            </span>
          </p>
        </a>
        <div className="absolute top-10 left-1/2 z-0 h-[200px] w-[400px] -translate-x-1/2 [mask-image:radial-gradient(200px_circle_at_center,white,transparent)]">
          <FlickeringGrid
            className="h-full w-full"
            squareSize={4}
            gridGap={6}
            color="#00a6f4"
            maxOpacity={0.4}
            flickerChance={0.08}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
