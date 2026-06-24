"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { interviewSchema } from "@/lib/validations/interview";
import { z } from "zod";
import { TimelineEventType } from "@prisma/client";

export async function createInterview(formData: z.infer<typeof interviewSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = interviewSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { applicationId, round, type, scheduledAt, durationMinutes, location, interviewerName, interviewerRole, outcome, notes } = result.data;

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!app || app.userId !== session.user.id) {
    throw new Error("Application not found or unauthorized");
  }

  const interview = await prisma.interview.create({
    data: {
      applicationId,
      round,
      type,
      scheduledAt,
      durationMinutes,
      location,
      interviewerName,
      interviewerRole,
      outcome,
      notes,
    },
  });

  // Automatically create a timeline event for the newly scheduled interview
  await prisma.timelineEvent.create({
    data: {
      applicationId,
      type: TimelineEventType.INTERVIEW,
      date: new Date(),
      title: `Scheduled Round ${round} ${type} Interview`,
      description: `Interview scheduled for ${scheduledAt.toLocaleString()}${location ? ` at ${location}` : ""}.`,
    },
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");
  return interview;
}

export async function updateInterview(id: string, formData: z.infer<typeof interviewSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = interviewSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { applicationId, round, type, scheduledAt, durationMinutes, location, interviewerName, interviewerRole, outcome, notes } = result.data;

  const existingInterview = await prisma.interview.findUnique({
    where: { id },
    include: { application: true },
  });

  if (!existingInterview || existingInterview.application.userId !== session.user.id) {
    throw new Error("Interview not found or unauthorized");
  }

  const updatedInterview = await prisma.interview.update({
    where: { id },
    data: {
      round,
      type,
      scheduledAt,
      durationMinutes,
      location,
      interviewerName,
      interviewerRole,
      outcome,
      notes,
    },
  });

  // If outcome changed, log it in timeline
  if (existingInterview.outcome !== outcome) {
      await prisma.timelineEvent.create({
          data: {
              applicationId,
              type: TimelineEventType.NOTE,
              date: new Date(),
              title: `Interview Round ${round} Outcome: ${outcome}`,
              description: `The outcome of the ${type} interview was updated to ${outcome}.`,
          }
      });
  }

  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");
  return updatedInterview;
}

export async function deleteInterview(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingInterview = await prisma.interview.findUnique({
    where: { id },
    include: { application: true },
  });

  if (!existingInterview || existingInterview.application.userId !== session.user.id) {
    throw new Error("Interview not found or unauthorized");
  }

  await prisma.interview.delete({
    where: { id },
  });

  revalidatePath(`/dashboard/applications/${existingInterview.applicationId}`);
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");
}

export async function getAllInterviews() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const interviews = await prisma.interview.findMany({
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
    orderBy: {
      scheduledAt: "asc",
    },
  });

  return interviews;
}
