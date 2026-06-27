"use client";

import { useState, useEffect } from "react";
import { User } from "next-auth";
import { Bell, AlertTriangle, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { deleteAccount } from "@/app/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SettingsPageClientProps {
  user: User;
}

export function SettingsPageClient({ user }: SettingsPageClientProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const notifs = localStorage.getItem("tracker_notifications");
    if (notifs !== null) {
      setNotificationsEnabled(notifs === "true");
    }
  }, []);

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("tracker_notifications", String(newValue));
    toast.success(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully.");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete account");
      setIsDeleting(false);
    }
  };
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid gap-6">

        {/* Notifications */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            <p className="text-sm text-gray-500">Manage how you receive alerts and reminders.</p>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Overdue Reminder Badges</div>
                <div className="text-sm text-gray-500 max-w-sm">Show a visual badge on the dashboard for any overdue follow-ups or reminders.</div>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${notificationsEnabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>
        </section>

        {/* Account Info */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h2>
            <p className="text-sm text-gray-500">Your personal details linked to this account.</p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img src={user.image} alt={user.name || "User"} className="h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-800" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-lg">{user.name}</div>
                <div className="text-gray-500">{user.email}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border border-red-200 dark:border-red-900/50 rounded-xl overflow-hidden shadow-sm bg-red-50/50 dark:bg-red-950/20">
          <div className="p-6 border-b border-red-200 dark:border-red-900/50">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </h2>
            <p className="text-sm text-red-500/80 mt-1">Irreversible and destructive actions.</p>
          </div>
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Delete Account</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Permanently remove your account and all associated data. This action cannot be undone.</div>
            </div>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button variant="danger" className="shrink-0 bg-red-600 hover:bg-red-700 text-white">
                  Delete Account
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 animate-in fade-in-90 zoom-in-95">
                  <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                    Are you absolutely sure?
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 mb-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers, including your applications, contacts, and timeline events.
                  </Dialog.Description>
                  <div className="flex justify-end gap-3">
                    <Dialog.Close asChild>
                      <Button variant="outline" disabled={isDeleting}>Cancel</Button>
                    </Dialog.Close>
                    <Button variant="danger" onClick={handleDeleteAccount} disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Yes, delete account"}
                    </Button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </section>
      </div>
    </div>
  );
}
