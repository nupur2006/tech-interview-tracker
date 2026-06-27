"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Video, Phone, Users, FileCode2 } from "lucide-react";
import { EditInterviewModal } from "../interview/edit-interview-modal";
import { deleteInterview } from "@/app/actions/interview";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";

interface CalendarViewProps {
  interviews: any[]; // Extended interview with application and company
}

export function CalendarView({ interviews }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedInterview, setSelectedInterview] = useState<any | null>(null);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <Video className="h-3 w-3" />;
      case "PHONE": return <Phone className="h-3 w-3" />;
      case "ONSITE": return <Users className="h-3 w-3" />;
      case "TECHNICAL": return <FileCode2 className="h-3 w-3" />;
      default: return <Video className="h-3 w-3" />;
    }
  };

  // Color coding by company
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  // Build the calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;

      const dayInterviews = interviews.filter((interview) =>
        isSameDay(new Date(interview.scheduledAt), cloneDay)
      );

      days.push(
        <div
          key={day.toString()}
          className={`min-h-[120px] p-2 border-b border-r dark:border-gray-800 ${
            !isSameMonth(day, monthStart)
              ? "bg-gray-50 text-gray-400 dark:bg-gray-900/50 dark:text-gray-600"
              : isSameDay(day, new Date())
              ? "bg-blue-50 dark:bg-blue-950/20"
              : "bg-white dark:bg-gray-900"
          }`}
        >
          <div className="flex justify-end">
            <span
              className={`text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full ${
                isSameDay(day, new Date()) ? "bg-blue-600 text-white" : ""
              }`}
            >
              {formattedDate}
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {dayInterviews.map((interview) => {
              const bgColor = stringToColor(interview.application.company.name) + '20'; // add transparency
              const borderColor = stringToColor(interview.application.company.name);
              
              return (
                <div
                  key={interview.id}
                  onClick={() => setSelectedInterview(interview)}
                  className="px-2 py-1 text-xs rounded-md border flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity truncate"
                  style={{ backgroundColor: bgColor, borderColor: borderColor, color: borderColor }}
                  title={`${interview.application.company.name} - ${interview.type}`}
                >
                  {getInterviewIcon(interview.type)}
                  <span className="truncate font-medium font-mono">{format(new Date(interview.scheduledAt), "h:mm a")}</span>
                  <span className="truncate">{interview.application.company.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this interview?")) return;
    try {
      await deleteInterview(id);
      toast.success("Interview deleted");
      setSelectedInterview(null);
    } catch (error) {
      toast.error("Failed to delete interview");
    }
  };

  const handleDownloadIcs = (interview: any) => {
    const startDate = new Date(interview.scheduledAt);
    const endDate = new Date(startDate.getTime() + (interview.durationMinutes * 60000));
    
    // Format: YYYYMMDDTHHMMSSZ
    const formatDateIcs = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Tech Interview Tracker//EN',
      'BEGIN:VEVENT',
      `UID:${interview.id}@techtracker.dev`,
      `DTSTAMP:${formatDateIcs(new Date())}`,
      `DTSTART:${formatDateIcs(startDate)}`,
      `DTEND:${formatDateIcs(endDate)}`,
      `SUMMARY:Interview with ${interview.application.company.name} - ${interview.type}`,
      `DESCRIPTION:Round ${interview.round} interview for ${interview.application.role}\\n${interview.notes || ''}`,
      `LOCATION:${interview.location || ''}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `interview-${interview.application.company.name}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 border rounded-md hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 border rounded-md hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-b-0 border-r-0 dark:border-gray-800 rounded-lg overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
            <div key={dayName} className="p-3 text-center text-sm font-semibold text-gray-500 border-r dark:border-gray-800">
              {dayName}
            </div>
          ))}
        </div>
        {/* Days Grid */}
        <div className="bg-white dark:bg-gray-950">
          {rows}
        </div>
      </div>

      {/* Interview Detail Panel */}
      <Dialog.Root open={!!selectedInterview} onOpenChange={(open) => !open && setSelectedInterview(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg dark:bg-gray-900 dark:border-gray-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            {selectedInterview && (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Dialog.Title className="text-xl font-bold">
                      {selectedInterview.application.company.name}
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-500">
                      {selectedInterview.application.role}
                    </Dialog.Description>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDownloadIcs(selectedInterview)} className="text-xs border px-2 py-1 rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                      .ics
                    </button>
                    <EditInterviewModal interview={selectedInterview} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Type</p>
                      <p className="font-medium flex items-center gap-1.5">
                        {getInterviewIcon(selectedInterview.type)}
                        {selectedInterview.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Round</p>
                      <p className="font-medium">{selectedInterview.round}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Date</p>
                      <p className="font-medium">{format(new Date(selectedInterview.scheduledAt), "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Time</p>
                      <p className="font-medium">{format(new Date(selectedInterview.scheduledAt), "h:mm a")} ({selectedInterview.durationMinutes}m)</p>
                    </div>
                  </div>

                  {selectedInterview.location && (
                    <div className="text-sm border-t pt-4 dark:border-gray-800">
                      <p className="text-gray-500 mb-1">Location / Link</p>
                      {selectedInterview.location.startsWith('http') ? (
                        <a href={selectedInterview.location} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all">
                          {selectedInterview.location}
                        </a>
                      ) : (
                        <p className="font-medium">{selectedInterview.location}</p>
                      )}
                    </div>
                  )}

                  {(selectedInterview.interviewerName || selectedInterview.interviewerRole) && (
                    <div className="text-sm border-t pt-4 dark:border-gray-800">
                      <p className="text-gray-500 mb-1">Interviewer</p>
                      <p className="font-medium">
                        {selectedInterview.interviewerName}
                        {selectedInterview.interviewerRole ? ` - ${selectedInterview.interviewerRole}` : ""}
                      </p>
                    </div>
                  )}

                  {selectedInterview.notes && (
                    <div className="text-sm border-t pt-4 dark:border-gray-800">
                      <p className="text-gray-500 mb-1">Prep Notes</p>
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border dark:border-gray-700/50">
                        {selectedInterview.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleDelete(selectedInterview.id)}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete Interview
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
