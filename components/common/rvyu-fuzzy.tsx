"use client";

import React from "react";

import { useTheme } from "next-themes";

import FuzzyText from "../ui/fuzzy-text";

const RvyuFuzzy = () => {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "dark" ? "#9f9fa9" : "#71717b";
  return (
    <FuzzyText className="mx-auto" color={color}>
      rvyu.
    </FuzzyText>
  );
};

export default RvyuFuzzy;
