"use client";

import { useState, useMemo } from "react";
import { ContactCard } from "./contact-card";
import { Search } from "lucide-react";
import type { Contact, Application, Company } from "@prisma/client";

type ContactWithRelations = Contact & {
  application?: (Application & { company?: Company }) | null;
};

interface ContactsPageClientProps {
  contacts: ContactWithRelations[];
}

export function ContactsPageClient({ contacts }: ContactsPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const companies = useMemo(() => {
    const uniqueCompanies = new Set<string>();
    contacts.forEach((contact) => {
      if (contact.application?.company?.name) {
        uniqueCompanies.add(contact.application.company.name);
      }
    });
    return Array.from(uniqueCompanies).sort();
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        search.trim() === "" ||
        contact.name.trim().toLowerCase().includes(search.trim().toLowerCase());
      const matchesCompany =
        selectedCompany === "" || contact.application?.company?.name === selectedCompany;
      return matchesSearch && matchesCompany;
    });
  }, [contacts, search, selectedCompany]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-10 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="sm:w-64">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center p-12 border rounded-xl border-dashed bg-gray-50/50 dark:bg-gray-900/20">
          <p className="text-gray-500">No contacts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              showApplication={true}
              href={`/dashboard/contacts/${contact.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
