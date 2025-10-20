"use client";

import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function Navbar() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { results, isLoading } = useGlobalSearch(query);

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1 flex justify-end items-center">
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
                            <span className="font-medium">{result.title}</span>
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

          {session && (
            <Button asChild variant="outline">
              <Link href="/blog/admin">Blog Admin</Link>
            </Button>
          )}

          {status === "loading" ? (
            <Button variant="outline" disabled>
              Loading...
            </Button>
          ) : session ? (
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sign In
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signIn("google")}>
                  Google Sign In
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/signin">Email Sign In</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button asChild variant="outline">
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
