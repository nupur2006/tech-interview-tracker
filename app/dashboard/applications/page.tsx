import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getApplications } from "@/app/actions/application";
import { ApplicationsPageClient } from "@/components/dashboard/applications/applications-page-client";
import type { ApplicationFull } from "@/types";

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const applications = await getApplications() as ApplicationFull[];

  return (
    <div className="max-w-7xl mx-auto">
      <ApplicationsPageClient initialApplications={applications} />
    </div>
  );
}