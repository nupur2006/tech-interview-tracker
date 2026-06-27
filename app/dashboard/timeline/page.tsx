import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGlobalTimeline } from "@/app/actions/global-timeline";
import { TimelinePageClient } from "@/components/dashboard/timeline/timeline-page-client";

export default async function TimelinePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const activities = await getGlobalTimeline();

  return (
    <div className="max-w-4xl mx-auto">
      <TimelinePageClient initialActivities={activities} />
    </div>
  );
}