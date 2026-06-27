"use client";

import { useOptimistic, useTransition, useState } from "react";
import { format } from "date-fns";
import type { Interaction } from "@prisma/client";
import { deleteInteraction } from "@/app/actions/interaction";
import { toast } from "sonner";
import { Mail, Phone, Users, Trash2 } from "lucide-react";

interface InteractionTimelineProps {
  interactions: Interaction[];
}

function getInteractionIcon(type: string) {
  switch (type) {
    case "EMAIL":
      return <Mail className="h-4 w-4" />;
    case "PHONE_CALL":
      return <Phone className="h-4 w-4" />;
    case "MEETING":
      return <Users className="h-4 w-4" />;
    default:
      return <Mail className="h-4 w-4" />;
  }
}

function getInteractionColor(type: string) {
  switch (type) {
    case "EMAIL":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "PHONE_CALL":
      return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
    case "MEETING":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  }
}

function getInteractionLabel(type: string) {
  switch (type) {
    case "EMAIL":
      return "Email";
    case "PHONE_CALL":
      return "Phone Call";
    case "MEETING":
      return "Meeting";
    default:
      return type;
  }
}

export function InteractionTimeline({ interactions }: InteractionTimelineProps) {
  const [optimisticInteractions, addOptimistic] = useOptimistic(
    interactions,
    (state, { id, action }: { id: string; action: "delete" }) => {
      if (action === "delete") {
        return state.filter((i) => i.id !== id);
      }
      return state;
    }
  );

  const [, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this interaction?")) return;

    setDeletingId(id);
    startTransition(() => {
      addOptimistic({ id, action: "delete" });
    });

    try {
      await deleteInteraction(id);
      toast.success("Interaction deleted");
    } catch (error) {
      toast.error("Failed to delete interaction");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (optimisticInteractions.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg border-dashed bg-gray-50/50 dark:bg-gray-900/20">
        <p className="text-sm text-gray-500">
          No interactions logged yet. Log your first email, call, or meeting.
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {/* Vertical connector line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-transparent dark:from-gray-800 dark:via-gray-800" />

      {optimisticInteractions.map((interaction) => (
        <div key={interaction.id} className="relative flex gap-4 group">
          {/* Icon marker */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white dark:bg-gray-950 shrink-0 shadow-sm z-10 ${getInteractionColor(interaction.type)}`}
          >
            {getInteractionIcon(interaction.type)}
          </div>

          {/* Card */}
          <div className="flex-1 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getInteractionColor(interaction.type)}`}
              >
                {getInteractionLabel(interaction.type)}
              </span>
              <time className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                {format(new Date(interaction.date), "MMM d, yyyy · h:mm a")}
              </time>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {interaction.summary}
            </p>

            {/* Delete action */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleDelete(interaction.id)}
                disabled={deletingId === interaction.id}
                className="text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
                aria-label="Delete interaction"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
