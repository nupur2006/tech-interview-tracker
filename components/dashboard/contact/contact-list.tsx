"use client";

import { useOptimistic, useTransition, useState } from "react";
import type { Contact } from "@prisma/client";
import { User } from "lucide-react";
import { ContactCard } from "./contact-card";
import { AddContactModal } from "./add-contact-modal";
import { deleteContact } from "@/app/actions/contact";
import { toast } from "sonner";

interface ContactListProps {
  contacts: Contact[];
  applicationId: string;
  showAddButton?: boolean;
  title?: string;
}

export function ContactList({
  contacts,
  applicationId,
  showAddButton = true,
  title = "Contacts",
}: ContactListProps) {
  const [optimisticContacts, addOptimisticContact] = useOptimistic(
    contacts,
    (state, { id, action }: { id: string; action: "delete" }) => {
      if (action === "delete") {
        return state.filter((contact) => contact.id !== id);
      }
      return state;
    }
  );

  const [, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    setDeletingId(id);
    startTransition(() => {
      addOptimisticContact({ id, action: "delete" });
    });

    try {
      await deleteContact(id);
      toast.success("Contact deleted");
    } catch (error) {
      toast.error("Failed to delete contact");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5 text-gray-400" />
          {title}
        </h2>
        {showAddButton && <AddContactModal applicationId={applicationId} />}
      </div>

      {optimisticContacts.length === 0 ? (
        <div className="text-center p-6 border rounded-lg border-dashed bg-gray-50/50 dark:bg-gray-900/20">
          <p className="text-sm text-gray-500">
            No contacts yet. Add your recruiter or referral.
          </p>
          {showAddButton && (
            <div className="mt-4">
              <AddContactModal
                applicationId={applicationId}
                trigger={
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline"
                  >
                    Add your first contact
                  </button>
                }
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {optimisticContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onDelete={handleDelete}
              isDeleting={deletingId === contact.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
