"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timelineEventSchema, type TimelineEventInput } from "@/lib/validations/timeline";
import { TimelineEventType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface EventFormProps {
  applicationId: string;
  initialData?: Partial<TimelineEventInput>;
  onSubmit: (data: TimelineEventInput) => Promise<void>;
  onCancel: () => void;
}

export function EventForm({ applicationId, initialData, onSubmit, onCancel }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format initial date for datetime-local input
  const defaultDate = initialData?.date
    ? format(new Date(initialData.date), "yyyy-MM-dd'T'HH:mm")
    : format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TimelineEventInput>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: {
      applicationId,
      type: initialData?.type || TimelineEventType.NOTE,
      title: initialData?.title || "",
      description: initialData?.description || "",
      // We pass the string to the input, but zod needs a Date object. 
      // We handle the conversion in a custom submit wrapper.
    },
  });

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Convert the string date back to a Date object before passing to onSubmit
      const submissionData: TimelineEventInput = {
        ...data,
        date: new Date(data.date),
      };
      await onSubmit(submissionData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Hidden field for applicationId */}
      <input type="hidden" {...register("applicationId")} value={applicationId} />

      <div className="space-y-2">
        <label className="text-sm font-medium">Event Type *</label>
        <select
          {...register("type")}
          className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
        >
          {Object.values(TimelineEventType).map((type) => (
            <option key={type} value={type}>
              {type}
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
          {...register("date", {
            valueAsDate: true,
          })}
          className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
        />
        {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Title *</label>
        <input
          {...register("title")}
          className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          placeholder="e.g. Phone Screen with Recruiter"
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          className="w-full flex min-h-[120px] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          placeholder="Add details, notes, links, or markdown here..."
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Event
        </Button>
      </div>
    </form>
  );
}
