"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timelineEventSchema } from "@/lib/validations/timeline";
import { z } from "zod";

export async function createTimelineEvent(formData: z.infer<typeof timelineEventSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = timelineEventSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { applicationId, type, date, title, description } = result.data;

  // Verify the application belongs to the user
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!app || app.userId !== session.user.id) {
    throw new Error("Application not found or unauthorized");
  }

  const event = await prisma.timelineEvent.create({
    data: {
      applicationId,
      type,
      date,
      title,
      description,
    },
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
  return event;
}

export async function updateTimelineEvent(id: string, formData: z.infer<typeof timelineEventSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = timelineEventSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { applicationId, type, date, title, description } = result.data;

  // Verify the event and application belong to the user
  const existingEvent = await prisma.timelineEvent.findUnique({
    where: { id },
    include: { application: true },
  });

  if (!existingEvent || existingEvent.application.userId !== session.user.id) {
    throw new Error("Event not found or unauthorized");
  }

  if (existingEvent.applicationId !== applicationId) {
      throw new Error("Cannot change the application of an event");
  }

  const updatedEvent = await prisma.timelineEvent.update({
    where: { id },
    data: {
      type,
      date,
      title,
      description,
    },
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
  return updatedEvent;
}

export async function deleteTimelineEvent(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingEvent = await prisma.timelineEvent.findUnique({
    where: { id },
    include: { application: true },
  });

  if (!existingEvent || existingEvent.application.userId !== session.user.id) {
    throw new Error("Event not found or unauthorized");
  }

  await prisma.timelineEvent.delete({
    where: { id },
  });

  revalidatePath(`/dashboard/applications/${existingEvent.applicationId}`);
}
