"use client";

import { TimelineEventType } from "@prisma/client";
import { Mail, Phone, Code, Users, Award, XCircle, FileText } from "lucide-react";

export function getEventIcon(type: TimelineEventType) {
  switch (type) {
    case TimelineEventType.EMAIL:
      return <Mail className="h-4 w-4" />;
    case TimelineEventType.CALL:
      return <Phone className="h-4 w-4" />;
    case TimelineEventType.OA:
      return <Code className="h-4 w-4" />;
    case TimelineEventType.INTERVIEW:
      return <Users className="h-4 w-4" />;
    case TimelineEventType.OFFER:
      return <Award className="h-4 w-4" />;
    case TimelineEventType.REJECTION:
      return <XCircle className="h-4 w-4" />;
    case TimelineEventType.NOTE:
    default:
      return <FileText className="h-4 w-4" />;
  }
}

export function getEventColor(type: TimelineEventType) {
  switch (type) {
    case TimelineEventType.EMAIL:
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case TimelineEventType.CALL:
      return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
    case TimelineEventType.OA:
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
    case TimelineEventType.INTERVIEW:
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    case TimelineEventType.OFFER:
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case TimelineEventType.REJECTION:
      return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    case TimelineEventType.NOTE:
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  }
}
