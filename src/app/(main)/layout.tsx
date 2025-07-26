// src/app/(main)/layout.tsx
import Header from "@/components/shared/Header";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
}