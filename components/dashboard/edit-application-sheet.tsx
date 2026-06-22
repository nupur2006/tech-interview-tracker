"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationForm } from "./application-form";
import { updateApplication } from "@/app/actions/application";
import { toast } from "sonner";
import type { ApplicationInput } from "@/lib/validations/application";
import type { ApplicationFull } from "@/types";

interface EditApplicationSheetProps {
  application: ApplicationFull;
  trigger?: React.ReactNode;
}

export function EditApplicationSheet({ application, trigger }: EditApplicationSheetProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: ApplicationInput) => {
    try {
      await updateApplication(application.id, data);
      toast.success("Application updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update application");
      console.error(error);
    }
  };

  const initialData: Partial<ApplicationInput> = {
    companyName: application.company.name,
    role: application.role,
    location: application.location || "",
    status: application.status,
    appliedDate: application.appliedDate,
    jobUrl: application.jobUrl || "",
    notes: application.notes || "",
    salaryMin: application.salaryMin,
    salaryMax: application.salaryMax,
    salaryCurrency: application.salaryCurrency,
    source: application.source || "",
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md gap-4 border-l bg-white p-6 shadow-lg sm:rounded-l-lg dark:bg-gray-900 dark:border-gray-800 overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right transition-transform duration-300 ease-in-out">
          <div className="flex flex-col space-y-1.5 text-left mb-6 mt-4">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
              Edit Application
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">
              Make changes to your job application below.
            </Dialog.Description>
          </div>
          
          <ApplicationForm initialData={initialData} onSubmit={handleSubmit} onCancel={() => setOpen(false)} />

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500 dark:ring-offset-gray-950 dark:focus:ring-gray-800 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-400">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
