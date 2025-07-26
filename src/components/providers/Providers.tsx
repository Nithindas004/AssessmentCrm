// src/components/providers/Providers.tsx
'use client';

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Create a client
const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;