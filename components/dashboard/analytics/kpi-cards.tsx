import { Briefcase, Calendar, Target } from "lucide-react";

interface KPICardsProps {
  totalApplications: number;
  interviewRate: number;
  offerRate: number;
}

export function KPICards({ totalApplications, interviewRate, offerRate }: KPICardsProps) {
  const kpis = [
    {
      title: "Total Applications",
      value: totalApplications.toString(),
      icon: Briefcase,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Interview Rate",
      value: `${interviewRate}%`,
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Offer Rate",
      value: `${offerRate}%`,
      icon: Target,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className="flex items-center p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-full ${kpi.bg} ${kpi.color} mr-4`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
