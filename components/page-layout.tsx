"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ChevronLeft,
  Menu,
  HelpCircle,
  FileText,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  showHelpButton?: boolean;
}

export function PageLayout({
  children,
  title,
  showBackButton = true,
  showHelpButton = true,
}: PageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [helpOpen, setHelpOpen] = useState(false);

  // Determine contextual help content based on current path
  const getHelpContent = () => {
    if (pathname?.includes("/blog")) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Blog Page Help</h3>
          <p>This page displays blog posts about Vermont healthcare reform.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Click on a blog post title to read the full article</li>
            <li>Use the search box to find specific topics</li>
            <li>Click &quot;New Post&quot; to create your own blog post</li>
            <li>You can filter posts by category using the dropdown menu</li>
          </ul>
        </div>
      );
    } else if (pathname?.includes("/comments")) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Comments Page Help</h3>
          <p>This page allows you to view and add comments on documents.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Comments are organized by document and page number</li>
            <li>Click &quot;Add Comment&quot; to contribute your thoughts</li>
            <li>You can edit or delete your own comments</li>
            <li>Use the filter options to find specific comments</li>
          </ul>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">General Help</h3>
        <p>Welcome to the Vermont Healthcare Reform Portal.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use the navigation menu to move between sections</li>
          <li>The home button will take you back to the main dashboard</li>
          <li>Click the back button to return to the previous page</li>
          <li>
            Access this help menu anytime by clicking the question mark icon
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with navigation */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => router.back()}
                      className="hover:bg-accent"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go back to previous page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-accent"
                  >
                    <Link href="/">
                      <Home className="h-5 w-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <h1 className="text-xl font-semibold">{title}</h1>
          </div>

          <div className="flex items-center space-x-2">
            {showHelpButton && (
              <Sheet open={helpOpen} onOpenChange={setHelpOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Help & Information</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">{getHelpContent()}</div>
                  <div className="flex justify-end">
                    <SheetClose asChild>
                      <Button>Close</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="w-full cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blog" className="w-full cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Blog</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/comments" className="w-full cursor-pointer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Comments</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t py-4 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Vermont Healthcare Reform Portal</p>
        </div>
      </footer>
    </div>
  );
}
