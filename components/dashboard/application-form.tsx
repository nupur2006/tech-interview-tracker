"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationInput } from "@/lib/validations/application";
import { ApplicationStatus } from "@prisma/client";
import { Button } from "@/components/ui/button"; // Assuming it exists
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
  initialData?: Partial<ApplicationInput>;
  onSubmit: (data: ApplicationInput) => Promise<void>;
  onCancel: () => void;
}

export function ApplicationForm({ initialData, onSubmit, onCancel }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues: {
      companyName: initialData?.companyName || "",
      role: initialData?.role || "",
      location: initialData?.location || "",
      status: initialData?.status || ApplicationStatus.BOOKMARKED,
      appliedDate: initialData?.appliedDate || null,
      jobUrl: initialData?.jobUrl || "",
      notes: initialData?.notes || "",
      salaryMin: initialData?.salaryMin || null,
      salaryMax: initialData?.salaryMax || null,
      salaryCurrency: initialData?.salaryCurrency || "USD",
      source: initialData?.source || "",
    },
  });

  const handleFormSubmit = async (data: ApplicationInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Company Name *</label>
          <input
            {...register("companyName")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. Google"
          />
          {errors.companyName && (
            <p className="text-xs text-red-500">{errors.companyName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Role *</label>
          <input
            {...register("role")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. Senior Frontend Engineer"
          />
          {errors.role && (
            <p className="text-xs text-red-500">{errors.role.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <input
            {...register("location")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. Remote"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          >
            {Object.values(ApplicationStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job URL</label>
          <input
            {...register("jobUrl")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="https://..."
          />
          {errors.jobUrl && (
            <p className="text-xs text-red-500">{errors.jobUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Source</label>
          <input
            {...register("source")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. LinkedIn"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Min Salary</label>
          <input
            type="number"
            {...register("salaryMin", { valueAsNumber: true })}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. 100000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Max Salary</label>
          <input
            type="number"
            {...register("salaryMax", { valueAsNumber: true })}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. 150000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          {...register("notes")}
          className="w-full flex min-h-[100px] rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          placeholder="Any details about the application..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Application
        </Button>
      </div>
    </form>
  );
}
