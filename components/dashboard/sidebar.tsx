"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ClipboardList, Clock, Users, BarChart2, Settings } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Applications", href: "/dashboard/applications", icon: ClipboardList },
  { label: "Timeline", href: "/dashboard/timeline", icon: Clock },
  { label: "Contacts", href: "/dashboard/contacts", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const content = (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-900/50"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  if (isMobile) {
    return content;
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 min-h-[calc(100vh-57px)]">
      {content}
    </aside>
  );
}
