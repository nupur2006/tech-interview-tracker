import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllContacts } from "@/app/actions/contact";
import { ContactsPageClient } from "@/components/dashboard/contact/contacts-page-client";

export const metadata = {
  title: "Contacts | Tech Interview Timeline Tracker",
};

export default async function ContactsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const contacts = await getAllContacts();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
        <p className="text-gray-500 mt-1">Manage all your recruiters, hiring managers, and referrals.</p>
      </div>

      <ContactsPageClient contacts={contacts} />
    </div>
  );
}
