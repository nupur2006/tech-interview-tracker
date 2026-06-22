"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: "🏠" },
  { label: "Applications", href: "/dashboard/applications", icon: "📋" },
  { label: "Timeline", href: "/dashboard/timeline", icon: "📅" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "📊" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-brand-950/50 min-h-[calc(100vh-57px)]">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent/10 text-accent-light border border-accent/20"
                  : "text-brand-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
