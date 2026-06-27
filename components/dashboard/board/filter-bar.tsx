"use client";

import { Search } from "lucide-react";
import { ApplicationStatus } from "@prisma/client";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ApplicationStatus | "ALL";
  onStatusFilterChange: (value: ApplicationStatus | "ALL") => void;
  companyFilter: string;
  onCompanyFilterChange: (value: string) => void;
  sourceFilter: string;
  onSourceFilterChange: (value: string) => void;
  companies: string[];
  sources: string[];
}

export function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  companyFilter,
  onCompanyFilterChange,
  sourceFilter,
  onSourceFilterChange,
  companies,
  sources,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      <div className="relative flex-1 sm:min-w-[250px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search roles or companies..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 h-9 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as ApplicationStatus | "ALL")}
        className="h-9 px-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <option value="ALL">All Statuses</option>
        {Object.values(ApplicationStatus).map((status) => (
          <option key={status} value={status}>
            {status.replace(/_/g, " ")}
          </option>
        ))}
      </select>

      <select
        value={companyFilter}
        onChange={(e) => onCompanyFilterChange(e.target.value)}
        className="h-9 px-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <option value="ALL">All Companies</option>
        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>
      
      {sources.length > 0 && (
        <select
          value={sourceFilter}
          onChange={(e) => onSourceFilterChange(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
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
  );
}
