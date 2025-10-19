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
import { cn } from "@/lib/ui/utils";
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
        collapsed ? "w-12" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-3 border-b">
        {!collapsed && (
          <div className="flex flex-col">
            <h2 className="text-sm font-bold leading-tight whitespace-nowrap">Health Transformation Review</h2>
            <p className="text-xs text-muted-foreground mt-1">Where Policy Meets Innovation</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="h-6 w-6"
        >
          <Menu className="h-4 w-4" />
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
