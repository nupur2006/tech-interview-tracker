import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getApplications } from "@/app/actions/application";
import { AddApplicationModal } from "@/components/dashboard/add-application-modal";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { UpcomingInterviewsWidget } from "@/components/dashboard/upcoming-interviews";
import { ApplicationStatus } from "@prisma/client";
import type { ApplicationFull } from "@/types";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const applications = await getApplications() as ApplicationFull[];

  // Calculate stats
  const total = applications.length;
  const activeCount = applications.filter(
    (app) => !([ApplicationStatus.OFFER, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN] as ApplicationStatus[]).includes(app.status)
  ).length;
  const offersCount = applications.filter((app) => app.status === ApplicationStatus.OFFER).length;
  
  const interviewsCount = applications.reduce((acc, app) => acc + (app.interviews?.length || 0), 0);

  const stats = [
    { label: "Active Applications", value: activeCount.toString(), icon: "📋", color: "from-blue-500/20 to-blue-600/5" },
    { label: "Interviews Logged", value: interviewsCount.toString(), icon: "📅", color: "from-purple-500/20 to-purple-600/5" },
    { label: "Offers Received", value: offersCount.toString(), icon: "🎉", color: "from-green-500/20 to-green-600/5" },
    { label: "Total Applications", value: total.toString(), icon: "📊", color: "from-amber-500/20 to-amber-600/5" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in relative pb-20">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session.user.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here&apos;s your interview pipeline at a glance.</p>
        </div>
        <div className="hidden sm:block">
          <AddApplicationModal />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 group hover:shadow-md transition-all duration-300 rounded-xl bg-white border border-gray-200 dark:bg-gray-900/50 dark:border-gray-800">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Board */}
        <div className="lg:col-span-3">
          <DashboardClient initialApplications={applications} />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <UpcomingInterviewsWidget />
        </div>
      </div>

      {/* Quick Add Floating Button (Mobile or Global) */}
      <div className="fixed bottom-6 right-6 z-50">
        <AddApplicationModal />
      </div>
    </div>
  );
}
