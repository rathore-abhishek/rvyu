"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, ChevronsUpDown, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TechStack {
  label: string;
  image?: string;
}

interface TechStackInputProps {
  techStack: TechStack[];
  onAdd: (tech: TechStack) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

interface DevIcon {
  name: string;
  versions: {
    svg: string[];
    font: string[];
  };
}

export function TechStackInput({
  techStack,
  onAdd,
  onRemove,
  disabled,
}: TechStackInputProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [allIcons, setAllIcons] = useState<DevIcon[]>([]);

  // Fetch devicons list on mount
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/devicons/devicon/master/devicon.json",
    )
      .then((res) => res.json())
      .then((data) => {
        setAllIcons(data);
      })
      .catch((err) => {
        console.error("Failed to fetch devicons:", err);
      });
  }, []);

  // Filter suggestions based on search term using useMemo
  const filteredIcons = useMemo(() => {
    if (!searchValue || allIcons.length === 0) {
      return allIcons.slice(0, 50); // Show first 50 by default
    }
    return allIcons
      .filter((icon) =>
        icon.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
      .slice(0, 50);
  }, [searchValue, allIcons]);

  const getIconUrl = (icon: DevIcon): string => {
    // Prioritize colored variants: original, original-wordmark, then others
    let variant = icon.versions.svg[0]; // Default to first available
    
    if (icon.versions.svg.includes("original")) {
      variant = "original";
    } else if (icon.versions.svg.includes("original-wordmark")) {
      variant = "original-wordmark";
    } else if (icon.versions.svg.includes("plain-wordmark")) {
      variant = "plain-wordmark";
    } else if (icon.versions.svg.includes("line")) {
      variant = "line";
    }
    
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon.name}/${icon.name}-${variant}.svg`;
  };

  const handleSelect = (icon: DevIcon) => {
    if (techStack.length >= 10) {
      toast.error("Maximum 10 technologies allowed");
      return;
    }

    // Check if already added
    if (
      techStack.some((t) => t.label.toLowerCase() === icon.name.toLowerCase())
    ) {
      toast.error("Technology already added");
      return;
    }

    const tech: TechStack = {
      label: icon.name.charAt(0).toUpperCase() + icon.name.slice(1),
      image: getIconUrl(icon),
    };

    onAdd(tech);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <div className="space-y-2">
      <Label>Tech Stack</Label>

      {/* Combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled || techStack.length >= 10}
          >
            {techStack.length >= 10
              ? "Maximum limit reached"
              : "Search technologies..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search technologies..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No technology found.</CommandEmpty>
              <CommandGroup>
                {filteredIcons.map((icon) => (
                  <CommandItem
                    key={icon.name}
                    value={icon.name}
                    onSelect={() => handleSelect(icon)}
                    className="flex items-center gap-2"
                  >
                    <div className="bg-muted flex h-6 w-6 shrink-0 items-center justify-center rounded">
                      <Image
                        src={getIconUrl(icon)}
                        alt={icon.name}
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                    </div>
                    <span className="capitalize">{icon.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        techStack.some(
                          (t) => t.label.toLowerCase() === icon.name,
                        )
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Tech Stack */}
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
            >
              {tech.image && (
                <Image
                  src={tech.image}
                  alt={tech.label}
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              )}
              <span>{tech.label}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="hover:text-destructive ml-0.5"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {techStack.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Add at least one technology
        </p>
      )}

      {techStack.length > 0 && (
        <p className="text-muted-foreground text-xs">
          {techStack.length}/10 technologies
        </p>
      )}
    </div>
  );
}
