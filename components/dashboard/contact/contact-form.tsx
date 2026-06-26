"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  CONTACT_RELATIONSHIPS,
  type ContactInput,
} from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ContactFormProps {
  applicationId: string;
  initialData?: Partial<ContactInput>;
  onSubmit: (data: ContactInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ContactForm({
  applicationId,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Contact",
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      applicationId,
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      linkedIn: initialData?.linkedIn || "",
      role: initialData?.role || "",
      relationship: initialData?.relationship || "",
    },
  });

  const handleFormSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <input type="hidden" {...register("applicationId")} value={applicationId} />

      <div className="space-y-2">
        <label className="text-sm font-medium">Name *</label>
        <input
          {...register("name")}
          className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          placeholder="e.g. David Chen"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Relationship</label>
          <select
            {...register("relationship")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          >
            <option value="">Select type</option>
            {CONTACT_RELATIONSHIPS.map((relationship) => (
              <option key={relationship} value={relationship}>
                {relationship}
              </option>
            ))}
          </select>
          {errors.relationship && (
            <p className="text-xs text-red-500">{errors.relationship.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Title</label>
          <input
            {...register("role")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. Technical Recruiter"
          />
          {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
          placeholder="e.g. david.chen@company.com"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="e.g. +1 555 0100"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">LinkedIn</label>
          <input
            {...register("linkedIn")}
            className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-700 dark:focus:ring-gray-600"
            placeholder="https://linkedin.com/in/..."
          />
          {errors.linkedIn && (
            <p className="text-xs text-red-500">{errors.linkedIn.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
