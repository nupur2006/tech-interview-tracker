

import { Briefcase, User, UserCheck, UserCog, Users } from "lucide-react";

export function getRelationshipIcon(relationship: string | null) {
  switch (relationship) {
    case "Recruiter":
      return <Briefcase className="h-4 w-4" />;
    case "Hiring Manager":
      return <UserCog className="h-4 w-4" />;
    case "Referral":
      return <UserCheck className="h-4 w-4" />;
    case "Interviewer":
      return <Users className="h-4 w-4" />;
    case "Other":
    default:
      return <User className="h-4 w-4" />;
  }
}

export function getRelationshipColor(relationship: string | null) {
  switch (relationship) {
    case "Recruiter":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "Hiring Manager":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    case "Referral":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "Interviewer":
      return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
    case "Other":
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  }
}

export function getRelationshipLabel(relationship: string | null) {
  return relationship || "Contact";
}
