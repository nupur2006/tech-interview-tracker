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
