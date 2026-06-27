"use client";

import { useState, useMemo } from "react";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import type { GlobalActivity } from "@/app/actions/global-timeline";
import { Building2, Calendar, FileText, Bell, MessageSquare, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TimelinePageClientProps {
  initialActivities: GlobalActivity[];
}

type FilterType = "ALL" | "INTERVIEW" | "EVENT" | "REMINDER";

export function TimelinePageClient({ initialActivities }: TimelinePageClientProps) {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const filteredActivities = useMemo(() => {
    if (filter === "ALL") return initialActivities;
    return initialActivities.filter((a) => a.type === filter);
  }, [initialActivities, filter]);

  const grouped = useMemo(() => {
    const groups: Record<string, GlobalActivity[]> = {
      "Today": [],
      "Yesterday": [],
      "This Week": [],
      "Earlier": [],
    };

    filteredActivities.forEach((activity) => {
      const d = new Date(activity.date);
      if (isToday(d)) {
        groups["Today"]!.push(activity);
      } else if (isYesterday(d)) {
        groups["Yesterday"]!.push(activity);
      } else if (isThisWeek(d)) {
        groups["This Week"]!.push(activity);
      } else {
        groups["Earlier"]!.push(activity);
      }
    });

    return groups;
  }, [filteredActivities]);

  const getIcon = (activity: GlobalActivity) => {
    if (activity.type === "INTERVIEW") return <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    if (activity.type === "REMINDER") return <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    
    // EVENT
    const t = activity.extraData?.eventType;
    if (t === "OFFER") return <Briefcase className="h-4 w-4 text-green-600 dark:text-green-400" />;
    if (t === "REJECTION") return <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />;
    return <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
  };

  const getBg = (activity: GlobalActivity) => {
    if (activity.type === "INTERVIEW") return "bg-purple-100 dark:bg-purple-900/30";
    if (activity.type === "REMINDER") return "bg-amber-100 dark:bg-amber-900/30";
    
    const t = activity.extraData?.eventType;
    if (t === "OFFER") return "bg-green-100 dark:bg-green-900/30";
    if (t === "REJECTION") return "bg-red-100 dark:bg-red-900/30";
    return "bg-blue-100 dark:bg-blue-900/30";
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Timeline</h1>
          <p className="text-gray-500 mt-1">A unified feed of all your interactions and updates.</p>
        </div>
        <div className="flex bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-800">
          {(["ALL", "INTERVIEW", "EVENT", "REMINDER"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === f
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase() + "s"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {Object.entries(grouped).map(([groupName, items]) => {
          if (items.length === 0) return null;
          
          return (
            <div key={groupName} className="border-b border-gray-200 dark:border-gray-800 last:border-0">
              <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-2 border-y border-gray-200 dark:border-gray-800 first:border-t-0 font-medium text-sm text-gray-500 dark:text-gray-400">
                {groupName}
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((activity) => (
                  <div key={activity.id} className="p-6 flex flex-col sm:flex-row gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-4 sm:w-32">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {format(new Date(activity.date), "MMM d")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(activity.date), "h:mm a")}
                      </div>
                    </div>
                    
                    <div className="shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getBg(activity)}`}>
                        {getIcon(activity)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {activity.application.company.logo ? (
                          <img src={activity.application.company.logo} alt="Logo" className="w-5 h-5 rounded object-cover" />
                        ) : (
                          <Building2 className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {activity.application.company.name}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      {activity.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center">
                      <Link href={`/dashboard/applications/${activity.application.id}`}>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                          View
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {filteredActivities.length === 0 && (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No activity found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
