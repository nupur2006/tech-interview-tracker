import { format, isToday, isTomorrow } from "date-fns";
import { Video, Phone, Users, FileCode2, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllInterviews } from "@/app/actions/interview";

export async function UpcomingInterviewsWidget() {
  const allInterviews = await getAllInterviews();
  
  // Filter interviews that are in the future or today
  const upcoming = allInterviews
    .filter((inv) => new Date(inv.scheduledAt).getTime() >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5); // Take next 5

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <Video className="h-4 w-4" />;
      case "PHONE": return <Phone className="h-4 w-4" />;
      case "ONSITE": return <Users className="h-4 w-4" />;
      case "TECHNICAL": return <FileCode2 className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const getDayLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          Upcoming Interviews
        </h3>
        <div className="text-center py-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 mb-3 text-gray-400">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <p className="text-sm text-gray-500">No upcoming interviews scheduled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-500" />
          Upcoming Interviews
        </h3>
        <Link href="/dashboard/calendar" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
          Calendar <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {upcoming.map((interview) => (
          <Link 
            href={`/dashboard/applications/${interview.applicationId}`} 
            key={interview.id}
            className="flex items-start gap-4 p-3 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-800 dark:hover:bg-gray-800/50 transition-colors group"
          >
            <div className="flex flex-col items-center justify-center min-w-[50px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-md border border-blue-100 dark:border-blue-800/30">
              <span className="text-xs font-semibold uppercase">{format(new Date(interview.scheduledAt), "MMM")}</span>
              <span className="text-lg font-bold leading-none">{format(new Date(interview.scheduledAt), "dd")}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {interview.application.company.name}
                </p>
                <span className="text-xs font-semibold text-gray-500">
                  {getDayLabel(new Date(interview.scheduledAt))}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                {getInterviewIcon(interview.type)}
                {interview.type} Round {interview.round}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {format(new Date(interview.scheduledAt), "h:mm a")} ({interview.durationMinutes}m)
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
