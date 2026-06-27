"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema, updateStatusSchema } from "@/lib/validations/application";
import { TimelineEventType, ApplicationStatus } from "@prisma/client";
import { z } from "zod";

export async function createApplication(formData: z.infer<typeof applicationSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = applicationSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { companyName, role, location, status, appliedDate, jobUrl, notes, salaryMin, salaryMax, salaryCurrency, source } = result.data;

  // Find or create company
  const company = await prisma.company.upsert({
    where: {
      userId_name: {
        userId: session.user.id,
        name: companyName,
      },
    },
    update: {},
    create: {
      name: companyName,
      userId: session.user.id,
    },
  });

  const application = await prisma.application.create({
    data: {
      role,
      location,
      status,
      appliedDate,
      jobUrl,
      notes,
      salaryMin,
      salaryMax,
      salaryCurrency,
      source,
      companyId: company.id,
      userId: session.user.id,
      timelineEvents: {
        create: {
          type: TimelineEventType.NOTE,
          date: new Date(),
          title: "Application Created",
          description: `Application added with status: ${status}`,
        },
      },
    },
    include: {
      company: true,
    },
  });

  revalidatePath("/dashboard");
  return application;
}

export async function updateApplication(id: string, formData: z.infer<typeof applicationSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = applicationSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const { companyName, role, location, status, appliedDate, jobUrl, notes, salaryMin, salaryMax, salaryCurrency, source } = result.data;

  // Check if application exists and belongs to user
  const existingApp = await prisma.application.findUnique({
    where: { id },
  });

  if (!existingApp || existingApp.userId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  // Find or create company
  const company = await prisma.company.upsert({
    where: {
      userId_name: {
        userId: session.user.id,
        name: companyName,
      },
    },
    update: {},
    create: {
      name: companyName,
      userId: session.user.id,
    },
  });

  const updatedApplication = await prisma.application.update({
    where: { id },
    data: {
      role,
      location,
      status,
      appliedDate,
      jobUrl,
      notes,
      salaryMin,
      salaryMax,
      salaryCurrency,
      source,
      companyId: company.id,
    },
    include: {
      company: true,
    },
  });

  revalidatePath("/dashboard");
  return updatedApplication;
}

export async function deleteApplication(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existingApp = await prisma.application.findUnique({
    where: { id },
  });

  if (!existingApp || existingApp.userId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  await prisma.application.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = updateStatusSchema.safeParse({ id, status });
  if (!result.success) {
    throw new Error("Invalid input");
  }

  const existingApp = await prisma.application.findUnique({
    where: { id },
  });

  if (!existingApp || existingApp.userId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  if (existingApp.status === status) {
    return existingApp;
  }

  const updatedApp = await prisma.application.update({
    where: { id },
    data: {
      status,
      timelineEvents: {
        create: {
          type: TimelineEventType.NOTE,
          date: new Date(),
          title: `Status updated to ${status}`,
          description: `Automatically recorded status change from ${existingApp.status} to ${status}.`,
        },
      },
    },
  });

  revalidatePath("/dashboard");
  return updatedApp;
}

export async function getApplications() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const applications = await prisma.application.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      company: true,
      interviews: {
        where: { scheduledAt: { gte: new Date() } },
        orderBy: { scheduledAt: "asc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return applications;
}
