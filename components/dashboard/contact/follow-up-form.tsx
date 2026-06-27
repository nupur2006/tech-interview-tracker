"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { followUpSchema, type FollowUpInput } from "@/lib/validations/follow-up";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface FollowUpFormProps {
  contactId?: string;
  applicationId?: string;
  onSubmit: (data: FollowUpInput) => Promise<void>;
  onCancel: () => void;
}

export function FollowUpForm({
  contactId,
  applicationId,
  onSubmit,
  onCancel,
}: FollowUpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default due date: tomorrow at 9 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  const defaultDueDate = format(tomorrow, "yyyy-MM-dd'T'HH:mm");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FollowUpInput>({
    resolver: zodResolver(followUpSchema) as any,
    defaultValues: {
      title: "",
      contactId: contactId || undefined,
      applicationId: applicationId || undefined,
    },
  });

  const handleFormSubmit = async (data: FollowUpInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        dueDate: new Date(data.dueDate),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {contactId && (
        <input type="hidden" {...register("contactId")} value={contactId} />
      )}
      {applicationId && (
        <input type="hidden" {...register("applicationId")} value={applicationId} />
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Title *</label>
        <input
          {...register("title")}
          className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          placeholder="e.g. Follow up on interview feedback"
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Due Date *</label>
        <input
          type="datetime-local"
          defaultValue={defaultDueDate}
          {...register("dueDate", { valueAsDate: true })}
          className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
        />
        {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Set Follow-up
        </Button>
      </div>
    </form>
  );
}
