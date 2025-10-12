"use client";

import {
  FileText,
  Home,
  BookOpen,
  BarChart,
  Settings,
  Menu,
  MessageSquare,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Documents", href: "/" },
    { icon: BookOpen, label: "Glossary", href: "/glossary" },
    { icon: BarChart, label: "Analytics", href: "/analytics" },
    { icon: MessageSquare, label: "Comments", href: "/comments" },
    { icon: Newspaper, label: "Blog", href: "/blog" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div
      className={cn(
        "h-screen border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <h2 className="text-lg font-semibold">VT Health Reform</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <nav className="space-y-1 p-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            collapsed={collapsed}
            active={pathname === item.href}
          />
        ))}
      </nav>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  collapsed,
  active,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
      asChild
    >
      <Link href={href}>
        <Icon className="h-5 w-5" />
        {!collapsed && <span className="ml-2">{label}</span>}
      </Link>
    </Button>
  );
}
