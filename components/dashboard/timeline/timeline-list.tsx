"use client";

import { useOptimistic, useTransition, useState } from "react";
import { format } from "date-fns";
import { TimelineEvent } from "@prisma/client";
import { getEventIcon, getEventColor } from "./event-helpers";
import { EditEventModal } from "./edit-event-modal";
import { deleteTimelineEvent } from "@/app/actions/timeline";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface TimelineListProps {
  events: TimelineEvent[];
}

export function TimelineList({ events }: TimelineListProps) {
  const [optimisticEvents, addOptimisticEvent] = useOptimistic(
    events,
    (state, { id, action }: { id: string; action: "delete" }) => {
      if (action === "delete") {
        return state.filter((event) => event.id !== id);
      }
      return state;
    }
  );

  const [, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setDeletingId(id);
    startTransition(() => {
      addOptimisticEvent({ id, action: "delete" });
    });

    try {
      await deleteTimelineEvent(id);
      toast.success("Event deleted");
    } catch (error) {
      toast.error("Failed to delete event");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (optimisticEvents.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg border-dashed mt-4 bg-gray-50/50 dark:bg-gray-900/20">
        <p className="text-sm text-gray-500">No timeline events yet. Add your first interaction.</p>
      </div>
    );
  }

  return (
    <div className="relative mt-8 space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent dark:before:via-gray-800">
      {optimisticEvents.map((event) => (
        <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon Marker */}
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white dark:bg-gray-950 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${getEventColor(event.type)} z-10`}>
            {getEventIcon(event.type)}
          </div>
          
          {/* Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {event.type.replace(/_/g, " ")}
              </span>
              <time className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                {format(new Date(event.date), "MMM d, h:mm a")}
              </time>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <EditEventModal event={event} />
              <button
                type="button"
                onClick={() => handleDelete(event.id)}
                disabled={deletingId === event.id}
                className="text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
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
