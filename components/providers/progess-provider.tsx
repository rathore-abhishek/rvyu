"use client";
import { AppProgressProvider } from "@bprogress/next";

import React from "react";

const ProgessProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProgressProvider
      height="2px"
      color="var(--primary)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </AppProgressProvider>
  );
};

export default ProgessProvider;
