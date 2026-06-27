import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsPageClient } from "@/components/dashboard/settings/settings-page-client";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SettingsPageClient user={session.user} />
    </div>
  );
}