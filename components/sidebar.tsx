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
  Headphones,
  Film,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/sidebar-context";
import { Brand } from "@/components/brand";

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Documents", href: "/" },
    { icon: BookOpen, label: "Glossary", href: "/glossary" },
    { icon: BarChart, label: "Analytics", href: "/analytics" },
    { icon: MessageSquare, label: "Comments", href: "/comments" },
    { icon: Newspaper, label: "Blog", href: "/blog" },
    { icon: Headphones, label: "Podcasts", href: "/podcasts" },
    { icon: Film, label: "Videos", href: "/videos" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div
      className={cn(
        "h-screen border-r bg-background transition-all duration-300 relative flex flex-col",
        collapsed ? "w-12" : "w-48 lg:w-56" // Made sidebar even narrower
      )}
    >
      <div className="relative border-b">
        {!collapsed && (
          <>
            <Brand />
          </>
        )}
        {collapsed && (
          <div className="flex items-center justify-center p-3">
            {/* p-3 matches the main header padding for alignment */}
            <Logo />
          </div>
        )}
      </div>
      <div className="flex justify-end p-1">
        <Button variant="ghost" size="icon" onClick={toggleCollapsed}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-1">
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
