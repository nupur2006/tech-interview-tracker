"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { interactionSchema } from "@/lib/validations/interaction";
import { z } from "zod";

export async function createInteraction(formData: z.infer<typeof interactionSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = interactionSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { contactId, type, date, summary } = result.data;

  // Verify the contact belongs to the user via its application
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: { application: true },
  });

  if (!contact || contact.application.userId !== session.user.id) {
    throw new Error("Contact not found or unauthorized");
  }

  const interaction = await prisma.interaction.create({
    data: {
      contactId,
      type,
      date,
      summary,
    },
  });

  revalidatePath(`/dashboard/applications/${contact.applicationId}`);
  revalidatePath(`/dashboard/contacts/${contactId}`);
  revalidatePath("/dashboard/contacts");
  return interaction;
}

export async function getInteractionsByContact(contactId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: { application: true },
  });

  if (!contact || contact.application.userId !== session.user.id) {
    throw new Error("Contact not found or unauthorized");
  }

  const interactions = await prisma.interaction.findMany({
    where: { contactId },
    orderBy: { date: "desc" },
  });

  return interactions;
}

export async function deleteInteraction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingInteraction = await prisma.interaction.findUnique({
    where: { id },
    include: {
      contact: {
        include: { application: true },
      },
    },
  });

  if (!existingInteraction || existingInteraction.contact.application.userId !== session.user.id) {
    throw new Error("Interaction not found or unauthorized");
  }

  await prisma.interaction.delete({
    where: { id },
  });

  revalidatePath(`/dashboard/applications/${existingInteraction.contact.applicationId}`);
  revalidatePath(`/dashboard/contacts/${existingInteraction.contactId}`);
  revalidatePath("/dashboard/contacts");
}
