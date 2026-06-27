"use client";

import { KPICards } from "./kpi-cards";
import { ApplicationFunnelChart } from "./charts/funnel-chart";
import { StatusDonut } from "./charts/status-donut";
import { ApplicationsLineChart } from "./charts/applications-line-chart";
import type { AnalyticsData } from "@/app/actions/analytics";

interface AnalyticsClientProps {
  data: AnalyticsData;
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
        <p className="text-gray-500 mt-1">Track your job search progress and conversion rates.</p>
      </div>

      <KPICards 
        totalApplications={data.totalApplications}
        interviewRate={data.interviewRate}
        offerRate={data.offerRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Application Funnel</h2>
          <ApplicationFunnelChart data={data.funnelData} />
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Status Breakdown</h2>
          <StatusDonut data={data.statusBreakdown} />
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Applications Over Time (Last 6 Months)</h2>
          <ApplicationsLineChart data={data.applicationsOverTime} />
        </div>
      </div>
    </div>
  );
}
