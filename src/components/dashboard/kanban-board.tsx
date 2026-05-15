"use client";

import { TaskDTO } from "@/types";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import TaskColumn from "./task-column";
import TaskModal from "./task-modal";
import { useTaskStore } from "@/store/use-task-store";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface KanbanBoardProps {
  // Controlled modal state — lifted to DashboardClient so header button works
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editingTask: TaskDTO | null;
  initialStatus: TaskDTO["status"];
  onAddTaskInColumn: (status: TaskDTO["status"]) => void;
  onEditTask: (task: TaskDTO) => void;
}

const COLUMNS: { id: TaskDTO["status"]; title: string; color: string }[] = [
  { id: "TODO", title: "To Do", color: "slate" },
  { id: "IN_PROGRESS", title: "In Progress", color: "indigo" },
  { id: "DONE", title: "Completed", color: "emerald" },
];

export default function KanbanBoard({
  isModalOpen,
  setIsModalOpen,
  editingTask,
  initialStatus,
  onAddTaskInColumn,
  onEditTask,
}: KanbanBoardProps) {
  const { tasks, isLoading, moveTaskOptimistic, fetchTasks, deleteTaskOptimistic } =
    useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveTaskOptimistic(
      draggableId,
      destination.droppableId as TaskDTO["status"],
      destination.index
    );
  };

  const handleDeleteTask = (taskId: string) => {
    toast.promise(deleteTaskOptimistic(taskId), {
      loading: "Deleting…",
      success: "Task deleted",
      error: "Failed to delete task",
    });
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <Loader2 size={28} className="animate-spin mr-3" />
        <span>Loading tasks…</span>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-16rem)] min-h-[460px]">
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              tasks={tasks
                .filter((t) => t.status === col.id)
                .sort((a, b) => a.position - b.position)}
              onAddTask={onAddTaskInColumn}
              onEditTask={onEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingTask}
        initialStatus={initialStatus}
      />
    </>
  );
}
