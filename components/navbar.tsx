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

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 gap-4">
        <h1 className="text-xl font-semibold">
          Vermont Healthcare Reform Portal
        </h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative w-64 max-md:hidden">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="w-full pl-8"
              aria-label="Search documents"
            />
          </div>

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
