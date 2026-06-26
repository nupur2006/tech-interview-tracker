"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { followUpSchema } from "@/lib/validations/follow-up";
import { z } from "zod";

/**
 * Verify the current user owns a contact (via its application).
 * Returns the contact with its application, or throws.
 */
async function verifyContactOwnership(contactId: string, userId: string) {
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: { application: true },
  });

  if (!contact || contact.application.userId !== userId) {
    throw new Error("Contact not found or unauthorized");
  }

  return contact;
}

/**
 * Verify the current user owns an application. Returns the app or throws.
 */
async function verifyApplicationOwnership(applicationId: string, userId: string) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!app || app.userId !== userId) {
    throw new Error("Application not found or unauthorized");
  }

  return app;
}

export async function createFollowUp(formData: z.infer<typeof followUpSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = followUpSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { title, dueDate, contactId, applicationId } = result.data;

  if (!contactId && !applicationId) {
    throw new Error("A follow-up must be associated with either a contact or an application.");
  }

  if (contactId && applicationId) {
    throw new Error("A follow-up cannot be associated with both a contact and an application.");
  }

  // Ownership checks...
  if (contactId) {
    await verifyContactOwnership(contactId, session.user.id);
  }
  if (applicationId) {
    await verifyApplicationOwnership(applicationId, session.user.id);
  }

  const followUp = await prisma.followUp.create({
    data: {
      title,
      dueDate,
      contactId: contactId || null,
      applicationId: applicationId || null,
    },
  });

  if (applicationId) {
    revalidatePath(`/dashboard/applications/${applicationId}`);
  }
  if (contactId) {
    revalidatePath(`/dashboard/contacts/${contactId}`);
  }
  revalidatePath("/dashboard/contacts");
  revalidatePath("/dashboard");
  return followUp;
}

export async function toggleFollowUpComplete(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingFollowUp = await prisma.followUp.findUnique({
    where: { id },
    include: {
      contact: { include: { application: true } },
      application: true,
    },
  });

  if (!existingFollowUp) {
    throw new Error("Follow-up not found");
  }

  // Verify ownership via contact or application
  const ownerId =
    existingFollowUp.contact?.application.userId ??
    existingFollowUp.application?.userId;

  if (ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updatedFollowUp = await prisma.followUp.update({
    where: { id },
    data: {
      isCompleted: !existingFollowUp.isCompleted,
      completedAt: existingFollowUp.isCompleted ? null : new Date(),
    },
  });

  if (existingFollowUp.applicationId) {
    revalidatePath(`/dashboard/applications/${existingFollowUp.applicationId}`);
  }
  if (existingFollowUp.contactId) {
    revalidatePath(`/dashboard/contacts/${existingFollowUp.contactId}`);
  }
  revalidatePath("/dashboard/contacts");
  revalidatePath("/dashboard");
  return updatedFollowUp;
}

export async function deleteFollowUp(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingFollowUp = await prisma.followUp.findUnique({
    where: { id },
    include: {
      contact: { include: { application: true } },
      application: true,
    },
  });

  if (!existingFollowUp) {
    throw new Error("Follow-up not found");
  }

  const ownerId =
    existingFollowUp.contact?.application.userId ??
    existingFollowUp.application?.userId;

  if (ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.followUp.delete({
    where: { id },
  });

  if (existingFollowUp.applicationId) {
    revalidatePath(`/dashboard/applications/${existingFollowUp.applicationId}`);
  }
  if (existingFollowUp.contactId) {
    revalidatePath(`/dashboard/contacts/${existingFollowUp.contactId}`);
  }
  revalidatePath("/dashboard/contacts");
  revalidatePath("/dashboard");
}

export async function getFollowUpsByApplication(applicationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await verifyApplicationOwnership(applicationId, session.user.id);

  const followUps = await prisma.followUp.findMany({
    where: { applicationId },
    include: { contact: true },
    orderBy: { dueDate: "asc" },
  });

  return followUps;
}

export async function getAllFollowUps() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const followUps = await prisma.followUp.findMany({
    where: {
      OR: [
        { contact: { application: { userId: session.user.id } } },
        { application: { userId: session.user.id } },
      ],
    },
    include: {
      contact: true,
      application: {
        include: { company: true },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  return followUps;
}
