"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { MessageSquarePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createInteraction } from "@/app/actions/interaction";
import { toast } from "sonner";
import {
  interactionSchema,
  INTERACTION_TYPES,
  INTERACTION_TYPE_LABELS,
  type InteractionInput,
} from "@/lib/validations/interaction";
import { format } from "date-fns";

interface LogInteractionModalProps {
  contactId: string;
  trigger?: React.ReactNode;
}

export function LogInteractionModal({ contactId, trigger }: LogInteractionModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InteractionInput>({
    resolver: zodResolver(interactionSchema) as any,
    defaultValues: {
      contactId,
      type: "EMAIL",
      summary: "",
    },
  });

  const handleFormSubmit = async (data: InteractionInput) => {
    setIsSubmitting(true);
    try {
      await createInteraction({
        ...data,
        date: new Date(data.date),
      });
      toast.success("Interaction logged successfully");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to log interaction");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultDate = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger || (
          <Button size="sm" className="flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4" />
            Log Interaction
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg dark:bg-gray-900 dark:border-gray-800 max-h-[90vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex flex-col space-y-1.5 text-left mb-6">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
              Log Interaction
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">
              Record an email, phone call, or meeting with this contact.
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <input type="hidden" {...register("contactId")} value={contactId} />

            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <select
                {...register("type")}
                className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
              >
                {INTERACTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {INTERACTION_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date & Time *</label>
              <input
                type="datetime-local"
                defaultValue={defaultDate}
                {...register("date", { valueAsDate: true })}
                className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Summary *</label>
              <textarea
                {...register("summary")}
                className="w-full flex min-h-[120px] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
                placeholder="Describe what was discussed, key takeaways, next steps..."
              />
              {errors.summary && <p className="text-xs text-red-500">{errors.summary.message}</p>}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log Interaction
              </Button>
            </div>
          </form>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500 dark:ring-offset-gray-950 dark:focus:ring-gray-800 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-400">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
