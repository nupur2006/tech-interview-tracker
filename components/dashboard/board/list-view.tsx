"use client";

import { ApplicationStatus } from "@prisma/client";
import { format } from "date-fns";
import { Building2, Calendar, MoreVertical, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { updateApplicationStatus, deleteApplication } from "@/app/actions/application";
import { EditApplicationSheet } from "@/components/dashboard/edit-application-sheet";
import { toast } from "sonner";
import type { ApplicationFull } from "@/types";
import { useState, useTransition, useOptimistic } from "react";

interface ListViewProps {
  applications: ApplicationFull[];
}

export function ListView({ applications }: ListViewProps) {
  const [optimisticApps, addOptimisticApp] = useOptimistic(
    applications,
    (state, { id, status }: { id: string; status: ApplicationStatus }) => {
      return state.map((app) => (app.id === id ? { ...app, status } : app));
    }
  );

  const [, startTransition] = useTransition();
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

  if (optimisticApps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed bg-white dark:bg-gray-900/50">
        <Building2 className="h-10 w-10 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No applications match</h3>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 border-b dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium">Role & Company</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Applied Date</th>
              <th className="px-6 py-4 font-medium">Next Interview</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {optimisticApps.map((app) => {
              const nextInterview = app.interviews?.[0];
              return (
                <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {app.company.logo ? (
                        <img src={app.company.logo} alt={app.company.name} className="h-8 w-8 rounded-md object-cover border shrink-0" />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                          <Building2 className="h-4 w-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link href={`/dashboard/applications/${app.id}`} className="font-semibold text-gray-900 dark:text-white hover:underline truncate block">
                          {app.role}
                        </Link>
                        <span className="text-gray-500 text-xs truncate block">{app.company.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 whitespace-nowrap">
                      {app.status.replace(/_/g, " ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {app.appliedDate ? format(new Date(app.appliedDate), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {nextInterview ? (
                      <div className="flex items-center text-purple-600 dark:text-purple-400">
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        {format(new Date(nextInterview.scheduledAt), "MMM d, h:mm a")}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none inline-flex items-center justify-center">
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
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
