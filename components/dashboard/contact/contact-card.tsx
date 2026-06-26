"use client";

import type { Contact } from "@prisma/client";
import { Mail, Phone, ExternalLink, Trash2 } from "lucide-react";
import {
  getRelationshipColor,
  getRelationshipIcon,
  getRelationshipLabel,
} from "./contact-helpers";
import { EditContactModal } from "./edit-contact-modal";

interface ContactCardProps {
  contact: Contact;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  deleteTrigger?: React.ReactNode;
}

export function ContactCard({
  contact,
  onDelete,
  isDeleting,
  deleteTrigger,
}: ContactCardProps) {
  return (
    <div className="group rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${getRelationshipColor(contact.relationship)}`}
          >
            {getRelationshipIcon(contact.relationship)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {contact.name}
              </h3>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getRelationshipColor(contact.relationship)}`}
              >
                {getRelationshipLabel(contact.relationship)}
              </span>
            </div>
            {contact.role && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {contact.role}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <EditContactModal contact={contact} />
          {onDelete &&
            (deleteTrigger || (
              <button
                type="button"
                onClick={() => onDelete(contact.id)}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
                aria-label={`Delete ${contact.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ))}
        </div>
      </div>

      {(contact.email || contact.phone || contact.linkedIn) && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              {contact.email}
            </a>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              {contact.phone}
            </a>
          )}
          {contact.linkedIn && (
            <a
              href={contact.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              LinkedIn
            </a>
          )}
        </div>
      )}
    </div>
  );
}
