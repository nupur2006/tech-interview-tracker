"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/contact";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

function normalizeContactFields(
  data: z.infer<typeof contactSchema>
): Pick<
  Prisma.ContactCreateWithoutApplicationInput,
  "name" | "email" | "phone" | "linkedIn" | "role" | "relationship"
> {
  return {
    name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    linkedIn: data.linkedIn || null,
    role: data.role || null,
    relationship: data.relationship || null,
  };
}

export async function createContact(formData: z.infer<typeof contactSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = contactSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { applicationId } = result.data;

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!app || app.userId !== session.user.id) {
    throw new Error("Application not found or unauthorized");
  }

  const contact = await prisma.contact.create({
    data: {
      applicationId,
      ...normalizeContactFields(result.data),
    },
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath("/dashboard/contacts");
  return contact;
}

export async function updateContact(id: string, formData: z.infer<typeof contactSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = contactSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { applicationId } = result.data;

  const existingContact = await prisma.contact.findUnique({
    where: { id },
    include: { application: true },
  });

  if (!existingContact || existingContact.application.userId !== session.user.id) {
    throw new Error("Contact not found or unauthorized");
  }

  if (existingContact.applicationId !== applicationId) {
    throw new Error("Cannot change the application of a contact");
  }

  const updatedContact = await prisma.contact.update({
    where: { id },
    data: normalizeContactFields(result.data),
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath("/dashboard/contacts");
  return updatedContact;
}

export async function deleteContact(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingContact = await prisma.contact.findUnique({
    where: { id },
    include: { application: true },
  });

  if (!existingContact || existingContact.application.userId !== session.user.id) {
    throw new Error("Contact not found or unauthorized");
  }

  await prisma.contact.delete({
    where: { id },
  });

  revalidatePath(`/dashboard/applications/${existingContact.applicationId}`);
  revalidatePath("/dashboard/contacts");
}

export async function getContactsByApplication(applicationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!app || app.userId !== session.user.id) {
    throw new Error("Application not found or unauthorized");
  }

  const contacts = await prisma.contact.findMany({
    where: { applicationId },
    orderBy: { createdAt: "asc" },
  });

  return contacts;
}

export async function getAllContacts() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const contacts = await prisma.contact.findMany({
    where: {
      application: {
        userId: session.user.id,
      },
    },
    include: {
      application: {
        include: {
          company: true,
        },
      },
    },
    orderBy: [{ application: { company: { name: "asc" } } }, { name: "asc" }],
  });

  return contacts;
}

export async function getContactById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      application: {
        include: {
          company: true,
        },
      },
      interactions: {
        orderBy: { date: "desc" },
      },
      followUps: {
        orderBy: { dueDate: "asc" },
      },
    },
  });

  if (!contact || contact.application.userId !== session.user.id) {
    throw new Error("Contact not found or unauthorized");
  }

  return contact;
}
