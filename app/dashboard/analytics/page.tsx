import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAnalyticsData } from "@/app/actions/analytics";
import { AnalyticsClient } from "@/components/dashboard/analytics/analytics-client";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const data = await getAnalyticsData();

  return (
    <div className="max-w-7xl mx-auto">
      <AnalyticsClient data={data} />
    </div>
  );
}