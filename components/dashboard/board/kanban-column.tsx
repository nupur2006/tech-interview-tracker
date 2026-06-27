"use client";

import { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./kanban-card";
import type { ApplicationFull } from "@/types";

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
  };
  applications: ApplicationFull[];
}

export function KanbanColumn({ column, applications }: KanbanColumnProps) {
  const applicationIds = useMemo(() => applications.map((app) => app.id), [applications]);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div className="flex flex-col bg-gray-50/50 dark:bg-gray-900/20 w-80 shrink-0 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 rounded-t-xl">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{column.title}</h3>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
          {applications.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-3 flex flex-col gap-3 min-h-[150px] transition-colors ${
          isOver ? "bg-gray-100/50 dark:bg-gray-800/50" : ""
        }`}
      >
        <SortableContext items={applicationIds} strategy={verticalListSortingStrategy}>
          {applications.map((app) => (
            <KanbanCard key={app.id} application={app} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
