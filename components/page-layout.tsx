"use client";

import type React from "react";
import { Sidebar } from "@/components/sidebar";
import { useSidebar } from "@/contexts/sidebar-context";
import { Navbar } from "@/components/navbar";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

export function PageLayout({
  children,
  title,
  showBackButton = true,
}: PageLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar showBackButton={showBackButton} title={title} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}