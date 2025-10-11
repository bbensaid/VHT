"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function Navbar() {
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

          <Button asChild variant="outline">
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
