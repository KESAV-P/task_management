"use client";

import { useState, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import KanbanBoard from "@/components/dashboard/kanban-board";
import { usePusher } from "@/hooks/use-pusher";
import { TaskDTO } from "@/types";

interface DashboardClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  // Shared modal state — lifted here so both the header button and column buttons can open it
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDTO | null>(null);
  const [initialStatus, setInitialStatus] = useState<TaskDTO["status"]>("TODO");

  const handleNewTask = useCallback(() => {
    setEditingTask(null);
    setInitialStatus("TODO");
    setIsModalOpen(true);
  }, []);

  const handleAddTaskInColumn = useCallback((status: TaskDTO["status"]) => {
    setEditingTask(null);
    setInitialStatus(status);
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: TaskDTO) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  // Initialize real-time sync (graceful no-op if Pusher not configured)
  usePusher(user.id);

  return (
    <DashboardLayout user={user} onNewTask={handleNewTask}>
      <div className="flex flex-col h-full animate-fade-in">
        <div className="mb-6 shrink-0">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            My Workspace
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Drag tasks between columns to update their status.
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <KanbanBoard
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            editingTask={editingTask}
            initialStatus={initialStatus}
            onAddTaskInColumn={handleAddTaskInColumn}
            onEditTask={handleEditTask}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
