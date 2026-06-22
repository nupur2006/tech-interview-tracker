import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const stats = [
    { label: "Active Applications", value: "0", icon: "📋", color: "from-blue-500/20 to-blue-600/5" },
    { label: "Interviews Scheduled", value: "0", icon: "📅", color: "from-purple-500/20 to-purple-600/5" },
    { label: "Offers Received", value: "0", icon: "🎉", color: "from-green-500/20 to-green-600/5" },
    { label: "Response Rate", value: "—", icon: "📊", color: "from-amber-500/20 to-amber-600/5" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {session.user.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-brand-400 mt-1">Here&apos;s your interview pipeline at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass p-5 group hover:border-white/20 transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-brand-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div className="glass p-12 text-center">
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-xl font-semibold text-white mb-2">No applications yet</h2>
        <p className="text-brand-400 text-sm max-w-md mx-auto mb-6">
          Start tracking your interview journey by adding your first application.
        </p>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-xl transition-all duration-200 shadow-lg shadow-accent/25">
          Add Your First Application
        </button>
      </div>
    </div>
  );
}
