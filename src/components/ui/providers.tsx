"use client";

// External Dependencies
import { useState } from "react";
// import { type ThemeProviderProps } from 'next-themes/dist/types';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ClerkProvider } from '@clerk/nextjs';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
