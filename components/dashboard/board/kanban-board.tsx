"use client";

import { useMemo, useState, useTransition } from "react";
import { ApplicationStatus } from "@prisma/client";
import type { ApplicationFull } from "@/types";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { updateApplicationStatus } from "@/app/actions/application";
import { toast } from "sonner";

interface KanbanBoardProps {
  applications: ApplicationFull[];
}

const COLUMNS = [
  { id: ApplicationStatus.BOOKMARKED, title: "Bookmarked" },
  { id: ApplicationStatus.APPLIED, title: "Applied" },
  { id: ApplicationStatus.OA, title: "Online Assessment" },
  { id: ApplicationStatus.TECHNICAL, title: "Technical" },
  { id: ApplicationStatus.ONSITE, title: "Onsite" },
  { id: ApplicationStatus.OFFER, title: "Offer" },
  { id: ApplicationStatus.REJECTED, title: "Rejected" },
  { id: ApplicationStatus.WITHDRAWN, title: "Withdrawn" },
];

export function KanbanBoard({ applications: initialApplications }: KanbanBoardProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [, startTransition] = useTransition();

  // Keep internal state in sync with external props if they change
  useMemo(() => setApplications(initialApplications), [initialApplications]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeApplication = useMemo(
    () => applications.find((app) => app.id === activeId),
    [activeId, applications]
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setApplications((apps) => {
        const activeIndex = apps.findIndex((t) => t.id === activeId);
        const overIndex = apps.findIndex((t) => t.id === overId);

        const activeApp = apps[activeIndex];
        const overApp = apps[overIndex];

        if (activeApp && overApp && activeApp.status !== overApp.status) {
          const newApps = [...apps];
          newApps[activeIndex] = { ...activeApp, status: overApp.status };
          return newApps;
        }
        return apps;
      });
    }

    // Dropping a Task over a Column
    if (isActiveTask && isOverColumn) {
      setApplications((apps) => {
        const activeIndex = apps.findIndex((t) => t.id === activeId);
        const newStatus = overId as ApplicationStatus;

        const activeApp = apps[activeIndex];

        if (activeApp && activeApp.status !== newStatus) {
          const newApps = [...apps];
          newApps[activeIndex] = { ...activeApp, status: newStatus };
          return newApps;
        }
        return apps;
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeAppId = active.id as string;
    const finalStatus = applications.find(app => app.id === activeAppId)?.status;

    // Compare with initial prop to see if it actually changed
    const originalApp = initialApplications.find(app => app.id === activeAppId);

    if (originalApp && finalStatus && originalApp.status !== finalStatus) {
      startTransition(() => {
        updateApplicationStatus(activeAppId, finalStatus)
          .then(() => toast.success("Status updated"))
          .catch(() => {
            toast.error("Failed to update status");
            // Revert on error
            setApplications(initialApplications);
          });
      });
    }
  }

  return (
    <div className="flex h-full w-full overflow-x-auto pb-4 custom-scrollbar">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 min-h-[600px]">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              applications={applications.filter((app) => app.status === col.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeApplication ? <KanbanCard application={activeApplication} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
