"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import { useSidebar } from "@/contexts/sidebar-context";
import { useState } from "react";
import { useGlobalSearch } from "@/hooks/use-global-search";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Brand } from "@/components/brand";

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
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { results, isLoading } = useGlobalSearch(query);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-background flex items-center">
          <div
            className={`${
              !collapsed ? "hidden" : "block"
            } transition-all duration-300`}
          >
            <Brand />
          </div>
          <div className="px-4 flex items-center justify-between flex-1">
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
            <div className="ml-auto">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <div className="relative w-64 max-md:hidden">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search documents, blog, comments..."
                      className="w-full pl-8"
                      aria-label="Global search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setOpen(true)}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <Command>
                    <CommandList>
                      {isLoading && (
                        <div className="p-2 text-sm text-muted-foreground">
                          Searching...
                        </div>
                      )}
                      {!isLoading && results.length === 0 && query && (
                        <CommandEmpty>No results found.</CommandEmpty>
                      )}
                      {results.length > 0 && (
                        <CommandGroup heading="Search Results">
                          {results.map((result) => (
                            <CommandItem
                              key={result.id}
                              onSelect={() => {
                                window.location.href = result.url;
                                setOpen(false);
                              }}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {result.title}
                                </span>
                                <span className="text-xs text-muted-foreground capitalize">
                                  {result.type}
                                </span>
                                {result.excerpt && (
                                  <span className="text-xs text-muted-foreground truncate">
                                    {result.excerpt}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
