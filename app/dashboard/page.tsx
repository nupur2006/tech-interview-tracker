import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getApplications } from "@/app/actions/application";
import { AddApplicationModal } from "@/components/dashboard/add-application-modal";
import { ApplicationList } from "@/components/dashboard/application-list";
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
    (app) => ![ApplicationStatus.OFFER, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN].includes(app.status)
  ).length;
  const offersCount = applications.filter((app) => app.status === ApplicationStatus.OFFER).length;
  
  // Note: For now, we mock Interviews Scheduled since we'd need to fetch actual interviews
  // To keep it clean, we just count applications in TECHNICAL or ONSITE as "Interviews Scheduled" roughly,
  // or just count them based on relations.
  const interviewsCount = applications.reduce((acc, app) => acc + (app.interviews?.length || 0), 0);

  const stats = [
    { label: "Active Applications", value: activeCount.toString(), icon: "📋", color: "from-blue-500/20 to-blue-600/5" },
    { label: "Interviews Logged", value: interviewsCount.toString(), icon: "📅", color: "from-purple-500/20 to-purple-600/5" },
    { label: "Offers Received", value: offersCount.toString(), icon: "🎉", color: "from-green-500/20 to-green-600/5" },
    { label: "Total Applications", value: total.toString(), icon: "📊", color: "from-amber-500/20 to-amber-600/5" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {session.user.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-brand-400 mt-1">Here&apos;s your interview pipeline at a glance.</p>
        </div>
        <div>
          <AddApplicationModal />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass p-5 group hover:border-white/20 transition-all duration-300 rounded-xl bg-white/5 border border-white/10 dark:bg-gray-900/50 dark:border-gray-800">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-brand-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Application List */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Your Applications</h2>
        <ApplicationList applications={applications} />
      </div>
    </div>
  );
}
