"use client";

import { useOptimistic, useTransition, useState } from "react";
import { ApplicationStatus } from "@prisma/client";
import { format } from "date-fns";
import { Building2, Calendar, MapPin, DollarSign, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { updateApplicationStatus, deleteApplication } from "@/app/actions/application";
import { EditApplicationSheet } from "./edit-application-sheet";
import { toast } from "sonner";
import type { ApplicationFull } from "@/types";

interface ApplicationListProps {
  applications: ApplicationFull[];
}

export function ApplicationList({ applications }: ApplicationListProps) {
  // We use optimistic state to update status instantly
  const [optimisticApps, addOptimisticApp] = useOptimistic(
    applications,
    (state, { id, status }: { id: string; status: ApplicationStatus }) => {
      return state.map((app) =>
        app.id === id ? { ...app, status } : app
      );
    }
  );

  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    startTransition(() => {
      addOptimisticApp({ id, status });
    });

    try {
      await updateApplicationStatus(id, status);
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    setDeletingId(id);
    try {
      await deleteApplication(id);
      toast.success("Application deleted");
    } catch (error) {
      toast.error("Failed to delete application");
    } finally {
      setDeletingId(null);
    }
  };

  // Group applications by status for kanban or list view, or just show a nice list.
  // For this, we will build a rich list view first.

  if (optimisticApps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed mt-8">
        <Building2 className="h-10 w-10 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No applications found</h3>
        <p className="text-sm text-gray-500 mt-1">Add your first job application to get started tracking.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {optimisticApps.map((app) => (
        <div key={app.id} className="group relative flex flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {app.company.logo ? (
                  <img src={app.company.logo} alt={app.company.name} className="h-10 w-10 rounded-md object-cover border" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                    <Building2 className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold leading-none">{app.role}</h3>
                  <p className="text-sm text-gray-500 mt-1">{app.company.name}</p>
                </div>
              </div>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="z-50 min-w-[160px] overflow-hidden rounded-md border bg-white p-1 text-sm shadow-md animate-in fade-in-80 dark:bg-gray-900 dark:border-gray-800">
                    <DropdownMenu.Group>
                      <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-gray-500">Update Status</DropdownMenu.Label>
                      {Object.values(ApplicationStatus).map((status) => (
                        <DropdownMenu.Item
                          key={status}
                          onClick={() => handleStatusChange(app.id, status)}
                          className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50"
                        >
                          <span className="flex-1">{status.replace(/_/g, " ")}</span>
                          {app.status === status && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Group>
                    <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
                    <EditApplicationSheet
                      application={app}
                      trigger={
                        <button
                          type="button"
                          className="w-full text-left rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Edit
                        </button>
                      }
                    />
                    <DropdownMenu.Item
                      onClick={() => handleDelete(app.id)}
                      disabled={deletingId === app.id}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950 dark:focus:text-red-600"
                    >
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>

            <div className="space-y-2 mb-4">
              {app.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="mr-2 h-4 w-4" />
                  {app.location}
                </div>
              )}
              {app.salaryMin && (
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="mr-2 h-4 w-4" />
                  {app.salaryMin.toLocaleString()} {app.salaryMax ? `- ${app.salaryMax.toLocaleString()}` : ""} {app.salaryCurrency}
                </div>
              )}
              {app.appliedDate && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Applied {format(new Date(app.appliedDate), "MMM d, yyyy")}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4 mt-2 border-gray-100 dark:border-gray-800">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
              {app.status.replace(/_/g, " ")}
            </div>
            {app.jobUrl && (
              <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
