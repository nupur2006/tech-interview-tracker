import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllInterviews } from "@/app/actions/interview";
import { CalendarView } from "@/components/dashboard/calendar/calendar-view";

export default async function CalendarPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const interviews = await getAllInterviews();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Interview Calendar
          </h1>
          <p className="text-gray-500 mt-1">Manage and view all your upcoming interviews.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-4 shadow-sm">
        <CalendarView interviews={interviews} />
      </div>
    </div>
  );
}
