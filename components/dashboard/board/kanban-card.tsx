"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ApplicationFull } from "@/types";
import { format } from "date-fns";
import { Building2, Calendar, GripHorizontal } from "lucide-react";
import Link from "next/link";

interface KanbanCardProps {
  application: ApplicationFull;
  isOverlay?: boolean;
}

export function KanbanCard({ application, isOverlay }: KanbanCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: {
      type: "Task",
      application,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const nextInterview = application.interviews?.[0];

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-dashed border-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl h-[120px] w-full"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800 cursor-default ${
        isOverlay ? "rotate-2 scale-105 shadow-xl cursor-grabbing" : ""
      }`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripHorizontal className="h-4 w-4" />
      </div>

      <div className="flex items-start gap-3 mb-3 pr-6">
        {application.company.logo ? (
          <img src={application.company.logo} alt={application.company.name} className="h-8 w-8 rounded-md object-cover border shrink-0 pointer-events-none" />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 pointer-events-none">
            <Building2 className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <Link href={`/dashboard/applications/${application.id}`} className="font-semibold text-gray-900 dark:text-white leading-none hover:underline truncate block">
            {application.role}
          </Link>
          <p className="text-xs text-gray-500 mt-1 truncate">{application.company.name}</p>
        </div>
      </div>

      <div className="space-y-2 mt-auto">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            Applied {application.appliedDate ? format(new Date(application.appliedDate), "MMM d") : "Unknown"}
          </span>
        </div>
        
        {nextInterview && (
          <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 font-medium">
            <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Interview: {format(new Date(nextInterview.scheduledAt), "MMM d")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
