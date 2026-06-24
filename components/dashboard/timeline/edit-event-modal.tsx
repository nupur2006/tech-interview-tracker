"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Edit2, X } from "lucide-react";
import { EventForm } from "./event-form";
import { updateTimelineEvent } from "@/app/actions/timeline";
import { toast } from "sonner";
import type { TimelineEventInput } from "@/lib/validations/timeline";
import type { TimelineEvent } from "@prisma/client";

interface EditEventModalProps {
  event: TimelineEvent;
}

export function EditEventModal({ event }: EditEventModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: TimelineEventInput) => {
    try {
      await updateTimelineEvent(event.id, data);
      toast.success("Event updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update event");
      console.error(error);
    }
  };

  const initialData: Partial<TimelineEventInput> = {
    type: event.type,
    date: event.date,
    title: event.title,
    description: event.description || "",
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg dark:bg-gray-900 dark:border-gray-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex flex-col space-y-1.5 text-left mb-6">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
              Edit Timeline Event
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">
              Update the details of this event.
            </Dialog.Description>
          </div>
          
          <EventForm 
            applicationId={event.applicationId} 
            initialData={initialData}
            onSubmit={handleSubmit} 
            onCancel={() => setOpen(false)} 
          />

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500 dark:ring-offset-gray-950 dark:focus:ring-gray-800 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-400">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
