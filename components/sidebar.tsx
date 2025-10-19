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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/sidebar-context";

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
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div
      className={cn(
        "h-screen border-r bg-background transition-all duration-300 relative",
        collapsed ? "w-12" : "w-72"
      )}
    >
      <div className="relative h-16 border-b bg-background">
        {!collapsed && (
          <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-lg font-extrabold bg-black text-white leading-tight whitespace-nowrap px-2 py-1 w-full text-center">
              Health Transformation Review
            </h2>
            <p className="text-sm bg-gray-200 text-black text-center py-1 px-2 w-full">
              Where Policy Meets Innovation
            </p>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center items-center h-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleCollapsed()}
              aria-label="Expand sidebar"
              className="h-6 w-6"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {!collapsed && (
        <div className="absolute top-16 right-0 p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleCollapsed()}
            aria-label="Collapse sidebar"
            className="h-6 w-6"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}
      <nav className="space-y-1 p-1">
        <div className="h-4"></div>
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
