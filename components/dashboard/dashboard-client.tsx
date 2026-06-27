"use client";

import { useState, useMemo } from "react";
import { ApplicationStatus } from "@prisma/client";
import type { ApplicationFull } from "@/types";
import { KanbanBoard } from "./board/kanban-board";
import { ListView } from "./board/list-view";
import { FilterBar } from "./board/filter-bar";
import { LayoutGrid, List } from "lucide-react";

interface DashboardClientProps {
  initialApplications: ApplicationFull[];
}

export function DashboardClient({ initialApplications }: DashboardClientProps) {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [companyFilter, setCompanyFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");

  const companies = useMemo(() => {
    const unique = new Set<string>();
    initialApplications.forEach((app) => unique.add(app.company.name));
    return Array.from(unique).sort();
  }, [initialApplications]);

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
      const matchesCompany = companyFilter === "ALL" || app.company.name === companyFilter;
      const matchesSource = sourceFilter === "ALL" || app.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesCompany && matchesSource;
    });
  }, [initialApplications, search, statusFilter, companyFilter, sourceFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          companyFilter={companyFilter}
          onCompanyFilterChange={setCompanyFilter}
          sourceFilter={sourceFilter}
          onSourceFilterChange={setSourceFilter}
          companies={companies}
          sources={sources}
        />
        <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setViewMode("kanban")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "kanban"
                ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
            aria-label="Kanban View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
            aria-label="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <KanbanBoard applications={filteredApplications} />
      ) : (
        <ListView applications={filteredApplications} />
      )}
    </div>
  );
}
