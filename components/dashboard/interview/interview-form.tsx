"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { interviewSchema, type InterviewInput } from "@/lib/validations/interview";
import { InterviewType, InterviewOutcome } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface InterviewFormProps {
  applicationId: string;
  initialData?: Partial<InterviewInput>;
  onSubmit: (data: InterviewInput) => Promise<void>;
  onCancel: () => void;
}

export function InterviewForm({ applicationId, initialData, onSubmit, onCancel }: InterviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultDate = initialData?.scheduledAt
    ? format(new Date(initialData.scheduledAt), "yyyy-MM-dd'T'HH:mm")
    : format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewInput>({
    resolver: zodResolver(interviewSchema) as any,
    defaultValues: {
      applicationId,
      round: initialData?.round || 1,
      type: initialData?.type || InterviewType.VIDEO,
      durationMinutes: initialData?.durationMinutes || 60,
      location: initialData?.location || "",
      interviewerName: initialData?.interviewerName || "",
      interviewerRole: initialData?.interviewerRole || "",
      outcome: initialData?.outcome || InterviewOutcome.PENDING,
      notes: initialData?.notes || "",
    },
  });

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const submissionData: InterviewInput = {
        ...data,
        scheduledAt: new Date(data.scheduledAt),
      };
      await onSubmit(submissionData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <input type="hidden" {...register("applicationId")} value={applicationId} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Round *</label>
          <input
            type="number"
            {...register("round")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          />
          {errors.round && <p className="text-xs text-red-500">{errors.round.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Type *</label>
          <select
            {...register("type")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          >
            {Object.values(InterviewType).map((type) => (
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
            {...register("scheduledAt", { valueAsDate: true })}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          />
          {errors.scheduledAt && <p className="text-xs text-red-500">{errors.scheduledAt.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration (mins) *</label>
          <input
            type="number"
            {...register("durationMinutes")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          />
          {errors.durationMinutes && <p className="text-xs text-red-500">{errors.durationMinutes.message}</p>}
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">Location / Link</label>
          <input
            {...register("location")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. Zoom link or Office address"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Interviewer Name</label>
          <input
            {...register("interviewerName")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Interviewer Role</label>
          <input
            {...register("interviewerRole")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. Senior Engineer"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">Outcome</label>
          <select
            {...register("outcome")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          >
            {Object.values(InterviewOutcome).map((outcome) => (
              <option key={outcome} value={outcome}>
                {outcome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Prep Notes</label>
        <textarea
          {...register("notes")}
          className="w-full flex min-h-[100px] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          placeholder="Questions to ask, topics to review..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Interview
        </Button>
      </div>
    </form>
  );
}
