"use client";

import { useState, useMemo } from "react";
import { ApplicationStatus } from "@prisma/client";
import type { ApplicationFull } from "@/types";
import { ListView } from "@/components/dashboard/board/list-view";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddApplicationModal } from "@/components/dashboard/add-application-modal";

interface ApplicationsPageClientProps {
  initialApplications: ApplicationFull[];
}

export function ApplicationsPageClient({ initialApplications }: ApplicationsPageClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");

  const sources = useMemo(() => {
    const unique = new Set<string>();
    initialApplications.forEach((app) => {
      if (app.source) unique.add(app.source);
    });
    return Array.from(unique).sort();
  }, [initialApplications]);

  const filteredApplications = useMemo(() => {
    return initialApplications.filter((app) => {
      const matchesSearch =
        search.trim() === "" ||
        app.role.toLowerCase().includes(search.toLowerCase()) ||
        app.company.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
      const matchesSource = sourceFilter === "ALL" || app.source === sourceFilter;
      
      let matchesDate = true;
      if (dateFilter !== "ALL" && app.appliedDate) {
        const date = new Date(app.appliedDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (dateFilter === "30") matchesDate = diffDays <= 30;
        if (dateFilter === "90") matchesDate = diffDays <= 90;
        if (dateFilter === "365") matchesDate = diffDays <= 365;
      } else if (dateFilter !== "ALL" && !app.appliedDate) {
        matchesDate = false;
      }

      return matchesSearch && matchesStatus && matchesSource && matchesDate;
    });
  }, [initialApplications, search, statusFilter, sourceFilter, dateFilter]);

  const exportToCSV = () => {
    if (filteredApplications.length === 0) return;

    const headers = ["Company", "Role", "Status", "Applied Date", "Source", "Location", "Job URL", "Notes"];
    
    const rows = filteredApplications.map(app => [
      `"${app.company.name.replace(/"/g, '""')}"`,
      `"${app.role.replace(/"/g, '""')}"`,
      `"${app.status}"`,
      app.appliedDate ? `"${new Date(app.appliedDate).toISOString().split('T')[0]}"` : '""',
      `"${(app.source || "").replace(/"/g, '""')}"`,
      `"${(app.location || "").replace(/"/g, '""')}"`,
      `"${(app.jobUrl || "").replace(/"/g, '""')}"`,
      `"${(app.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `applications_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Applications</h1>
          <p className="text-gray-500 mt-1">Manage and export your complete application history.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportToCSV} variant="outline" className="hidden sm:flex" disabled={filteredApplications.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <AddApplicationModal />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1 sm:min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by role or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-950 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "ALL")}
            className="h-9 px-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-950 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="ALL">All Statuses</option>
            {Object.values(ApplicationStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-950 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="ALL">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Past Year</option>
          </select>
          
          {sources.length > 0 && (
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-950 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="ALL">All Sources</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <Button onClick={exportToCSV} variant="outline" className="w-full sm:hidden" disabled={filteredApplications.length === 0}>
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>

      <ListView applications={filteredApplications} />
    </div>
  );
}
