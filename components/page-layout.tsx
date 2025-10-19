"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { useSidebar } from "@/contexts/sidebar-context";

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
  const router = useRouter();
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-background flex items-center">
          <div className={`${collapsed ? "w-[350px]" : "w-0"} overflow-hidden`}>
            {/* 
            <div className="flex flex-col h-full">
              <h2 className="text-lg font-extrabold bg-black text-white leading-tight whitespace-nowrap px-2 py-1.5">
                Health Transformation Review
              </h2>
              <p className="text-sm bg-gray-200 text-black text-center flex-1 flex items-center justify-center px-2 py-1.">
                Where Policy Meets Innovation
              </p>
            </div>
 */}

            <div className="py-2">
              <div className="flex flex-col flex-1">
                <h2 className="text-lg font-extrabold bg-black text-white leading-tight whitespace-nowrap px-2 py-1">
                  Health Transformation Review
                </h2>
                <p className="text-sm bg-gray-200 text-black text-center flex-1 flex items-center justify-center px-2 py-1">
                  Where Policy Meets Innovation
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button variant="outline" onClick={() => router.back()}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6">{children}</main>
        <footer className="border-t py-4 bg-muted/30">
          <div className="px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Health Transformation Review</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
