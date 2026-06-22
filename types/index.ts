import type { DefaultSession } from "next-auth";

/**
 * Extend the built-in session types to include the user ID.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Re-export all Prisma-generated types for convenient imports.
 *
 * Usage:
 *   import type { Application, ApplicationStatus } from "@/types";
 */
export type {
  User,
  Account,
  Session as PrismaSession,
  Company,
  Application,
  Contact,
  TimelineEvent,
  Interview,
  Reminder,
  VerificationToken,
} from "@prisma/client";

export {
  ApplicationStatus,
  TimelineEventType,
  InterviewType,
  InterviewOutcome,
  ReminderType,
} from "@prisma/client";

/**
 * Application-level types
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

/**
 * Composite types for API responses with eager-loaded relations.
 */
export type ApplicationWithCompany = import("@prisma/client").Application & {
  company: import("@prisma/client").Company;
};

export type ApplicationFull = import("@prisma/client").Application & {
  company: import("@prisma/client").Company;
  contacts: import("@prisma/client").Contact[];
  timelineEvents: import("@prisma/client").TimelineEvent[];
  interviews: import("@prisma/client").Interview[];
  reminders: import("@prisma/client").Reminder[];
};

export type DashboardStats = {
  totalApplications: number;
  activeApplications: number;
  offersReceived: number;
  upcomingInterviews: number;
  pendingReminders: number;
  statusBreakdown: Record<string, number>;
};
