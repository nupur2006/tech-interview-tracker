"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ActivityType = "EVENT" | "INTERVIEW" | "REMINDER";

export interface GlobalActivity {
  id: string;
  type: ActivityType;
  date: Date;
  title: string;
  description?: string;
  application: {
    id: string;
    role: string;
    company: {
      name: string;
      logo: string | null;
    };
  };
  extraData?: any;
}

export async function getGlobalTimeline(): Promise<GlobalActivity[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const [events, interviews, reminders] = await Promise.all([
    prisma.timelineEvent.findMany({
      where: { application: { userId } },
      include: {
        application: {
          include: { company: true },
        },
      },
    }),
    prisma.interview.findMany({
      where: { application: { userId } },
      include: {
        application: {
          include: { company: true },
        },
      },
    }),
    prisma.reminder.findMany({
      where: { application: { userId } },
      include: {
        application: {
          include: { company: true },
        },
      },
    }),
  ]);

  const activities: GlobalActivity[] = [];

  events.forEach((e) => {
    activities.push({
      id: `event-${e.id}`,
      type: "EVENT",
      date: e.date,
      title: e.title,
      description: e.description || undefined,
      application: e.application,
      extraData: { eventType: e.type },
    });
  });

  interviews.forEach((i) => {
    activities.push({
      id: `interview-${i.id}`,
      type: "INTERVIEW",
      date: i.scheduledAt,
      title: `Round ${i.round} ${i.type} Interview`,
      description: i.notes || undefined,
      application: i.application,
      extraData: { outcome: i.outcome },
    });
  });

  reminders.forEach((r) => {
    if (r.application) {
      activities.push({
        id: `reminder-${r.id}`,
        type: "REMINDER",
        date: r.dueDate,
        title: r.title,
        description: `Status: ${r.isCompleted ? 'Completed' : 'Pending'}`,
        application: r.application,
        extraData: { isCompleted: r.isCompleted },
      });
    }
  });

  // Sort descending (newest first)
  return activities.sort((a, b) => b.date.getTime() - a.date.getTime());
}
