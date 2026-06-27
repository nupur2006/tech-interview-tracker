"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </SessionProvider>
  );
}
