import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { TimelineList } from "@/components/dashboard/timeline/timeline-list";
import { AddEventModal } from "@/components/dashboard/timeline/add-event-modal";
import { AddInterviewModal } from "@/components/dashboard/interview/add-interview-modal";
import { ContactList } from "@/components/dashboard/contact/contact-list";
import { FollowUpList } from "@/components/dashboard/contact/follow-up-list";
import { AddFollowUpModal } from "@/components/dashboard/contact/add-follow-up-modal";
import { format } from "date-fns";
import { Building2, Calendar, MapPin, DollarSign, ExternalLink, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const application = await prisma.application.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      company: true,
      timelineEvents: {
        orderBy: { date: "desc" },
      },
      interviews: {
        orderBy: { scheduledAt: "asc" },
        where: { scheduledAt: { gte: new Date() } },
        take: 1,
      },
      contacts: true,
      followUps: {
        orderBy: { dueDate: "asc" },
        include: { contact: true },
      },
    },
  });

  if (!application) {
    notFound();
  }

  const nextInterview = application.interviews[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              {application.role}
            </h1>
            <p className="text-gray-500 mt-1">at {application.company.name}</p>
          </div>
        </div>
        <div>
          <AddInterviewModal applicationId={application.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b pb-4 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Timeline Log</h2>
            <AddEventModal applicationId={application.id} />
          </div>
          
          <TimelineList events={application.timelineEvents} />
        </div>

        {/* Sidebar Summary Card */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800 sticky top-6">
            <div className="flex items-center gap-4 mb-6">
              {application.company.logo ? (
                <img src={application.company.logo} alt={application.company.name} className="h-12 w-12 rounded-lg object-cover border" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                  <Building2 className="h-6 w-6" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg leading-none">{application.company.name}</h3>
                {application.company.website && (
                  <a href={application.company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                    {application.company.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                  {application.status.replace(/_/g, " ")}
                </div>
              </div>

              {application.appliedDate && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Applied On</p>
                  <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {format(new Date(application.appliedDate), "MMMM d, yyyy")}
                  </div>
                </div>
              )}

              {application.location && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                  <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    {application.location}
                  </div>
                </div>
              )}

              {application.salaryMin && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Target Compensation</p>
                  <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
                    {application.salaryMin.toLocaleString()} 
                    {application.salaryMax ? ` - ${application.salaryMax.toLocaleString()}` : ""} 
                    <span className="ml-1 text-gray-500">{application.salaryCurrency}</span>
                  </div>
                </div>
              )}

              {application.jobUrl && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Job Listing</p>
                  <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Original Posting
                  </a>
                </div>
              )}

              {nextInterview && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Next Interview</p>
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
                      Round {nextInterview.round}: {nextInterview.type}
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-400 mt-1 flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(new Date(nextInterview.scheduledAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Follow-ups */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Follow-ups</h2>
               <AddFollowUpModal applicationId={application.id} />
            </div>
            <FollowUpList followUps={application.followUps} title="" />
          </div>

          {/* Contacts */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <ContactList contacts={application.contacts} applicationId={application.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
