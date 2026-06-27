"use client";

import { useOptimistic, useTransition, useState } from "react";
import { format, isPast, isToday } from "date-fns";
import type { FollowUp, Contact } from "@prisma/client";
import { toggleFollowUpComplete, deleteFollowUp } from "@/app/actions/follow-up";
import { toast } from "sonner";
import { CheckCircle2, Circle, Trash2, Clock, AlertTriangle } from "lucide-react";

type FollowUpWithContact = FollowUp & {
  contact?: Contact | null;
};

interface FollowUpListProps {
  followUps: FollowUpWithContact[];
  title?: string;
  showContactName?: boolean;
}

function getDueStatus(dueDate: Date, isCompleted: boolean) {
  if (isCompleted) {
    return {
      label: "Completed",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    };
  }

  const due = new Date(dueDate);

  if (isPast(due) && !isToday(due)) {
    return {
      label: "Overdue",
      className:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800 animate-pulse",
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
    };
  }

  if (isToday(due)) {
    return {
      label: "Due Today",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      icon: <Clock className="h-3.5 w-3.5" />,
    };
  }

  return {
    label: "Upcoming",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    icon: <Clock className="h-3.5 w-3.5" />,
  };
}

export function FollowUpList({
  followUps,
  title = "Follow-ups",
  showContactName = false,
}: FollowUpListProps) {
  const [optimisticFollowUps, addOptimistic] = useOptimistic(
    followUps,
    (
      state,
      action: { type: "toggle"; id: string } | { type: "delete"; id: string }
    ) => {
      if (action.type === "delete") {
        return state.filter((f) => f.id !== action.id);
      }
      if (action.type === "toggle") {
        return state.map((f) =>
          f.id === action.id
            ? { ...f, isCompleted: !f.isCompleted, completedAt: f.isCompleted ? null : new Date() }
            : f
        );
      }
      return state;
    }
  );

  const [, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    setLoadingId(id);
    startTransition(() => {
      addOptimistic({ type: "toggle", id });
    });

    try {
      await toggleFollowUpComplete(id);
      toast.success("Follow-up updated");
    } catch (error) {
      toast.error("Failed to update follow-up");
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this follow-up?")) return;

    setLoadingId(id);
    startTransition(() => {
      addOptimistic({ type: "delete", id });
    });

    try {
      await deleteFollowUp(id);
      toast.success("Follow-up deleted");
    } catch (error) {
      toast.error("Failed to delete follow-up");
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  if (optimisticFollowUps.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg border-dashed bg-gray-50/50 dark:bg-gray-900/20">
        <p className="text-sm text-gray-500">No follow-ups set.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {optimisticFollowUps.map((followUp) => {
        const status = getDueStatus(followUp.dueDate, followUp.isCompleted);

        return (
          <div
            key={followUp.id}
            className={`group rounded-lg border p-4 transition-all hover:shadow-md ${
              followUp.isCompleted
                ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-75"
                : isPast(new Date(followUp.dueDate)) && !isToday(new Date(followUp.dueDate))
                ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Toggle checkbox */}
              <button
                type="button"
                onClick={() => handleToggle(followUp.id)}
                disabled={loadingId === followUp.id}
                className={`mt-0.5 shrink-0 transition-colors focus:outline-none ${
                  followUp.isCompleted
                    ? "text-emerald-500 hover:text-emerald-600"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
                aria-label={followUp.isCompleted ? "Mark as incomplete" : "Mark as complete"}
              >
                {followUp.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm font-medium truncate ${
                      followUp.isCompleted
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {followUp.title}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold shrink-0 ${status.className}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <time className="text-xs text-gray-500 dark:text-gray-400">
                    Due {format(new Date(followUp.dueDate), "MMM d, yyyy")}
                  </time>
                  {showContactName && followUp.contact && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      · {followUp.contact.name}
                    </span>
                  )}
                  {followUp.isCompleted && followUp.completedAt && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      · Done {format(new Date(followUp.completedAt), "MMM d")}
                    </span>
                  )}
                </div>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDelete(followUp.id)}
                disabled={loadingId === followUp.id}
                className="shrink-0 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:outline-none"
                aria-label={`Delete follow-up: ${followUp.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
