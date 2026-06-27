import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getContactById } from "@/app/actions/contact";
import Link from "next/link";
import { ChevronLeft, Building2, Briefcase, Mail, Phone, ExternalLink } from "lucide-react";
import { LogInteractionModal } from "@/components/dashboard/contact/log-interaction-modal";
import { InteractionTimeline } from "@/components/dashboard/contact/interaction-timeline";
import { FollowUpList } from "@/components/dashboard/contact/follow-up-list";
import { AddFollowUpModal } from "@/components/dashboard/contact/add-follow-up-modal";
import {
  getRelationshipColor,
  getRelationshipIcon,
  getRelationshipLabel,
} from "@/components/dashboard/contact/contact-helpers";
import { EditContactModal } from "@/components/dashboard/contact/edit-contact-modal";

export default async function ContactProfilePage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  let contact;
  try {
    contact = await getContactById(params.id);
  } catch (error) {
    notFound();
  }

  if (!contact) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <Link
          href="/dashboard/contacts"
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${getRelationshipColor(contact.relationship)}`}>
            {getRelationshipIcon(contact.relationship)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {contact.name}
              </h1>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getRelationshipColor(contact.relationship)}`}>
                {getRelationshipLabel(contact.relationship)}
              </span>
            </div>
            {contact.role && (
              <p className="text-gray-500 mt-1 truncate">{contact.role}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EditContactModal contact={contact} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interaction History */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Interaction History</h2>
              <LogInteractionModal contactId={contact.id} />
            </div>
            <InteractionTimeline interactions={contact.interactions} />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Contact Details Card */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Contact Info
            </h3>
            <div className="space-y-4">
              {contact.email && (
                <div>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{contact.email}</span>
                  </a>
                </div>
              )}
              {contact.phone && (
                <div>
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.linkedIn && (
                <div>
                  <a href={contact.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {!contact.email && !contact.phone && !contact.linkedIn && (
                <p className="text-sm text-gray-500">No contact details provided.</p>
              )}
            </div>
          </div>

          {/* Linked Application Card */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Linked Application
            </h3>
            <Link 
              href={`/dashboard/applications/${contact.applicationId}`}
              className="group block p-3 -mx-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                {contact.application.company.logo ? (
                  <img src={contact.application.company.logo} alt={contact.application.company.name} className="h-8 w-8 rounded bg-white object-cover border" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                    <Building2 className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {contact.application.company.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="truncate">{contact.application.role}</span>
              </div>
            </Link>
          </div>

          {/* Follow-ups Card */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Follow-ups
              </h3>
              <AddFollowUpModal contactId={contact.id} />
            </div>
            <FollowUpList followUps={contact.followUps} title="" />
          </div>
        </div>
      </div>
    </div>
  );
}
