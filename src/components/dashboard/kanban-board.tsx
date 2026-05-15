"use client";

import { TaskDTO } from "@/types";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import TaskColumn from "./task-column";
import { useTaskStore } from "@/store/use-task-store";
import { useState, useEffect } from "react";
import TaskModal from "./task-modal";
import { toast } from "sonner";

export default function KanbanBoard() {
  const { tasks, moveTaskOptimistic, fetchTasks, deleteTaskOptimistic } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDTO | null>(null);
  const [initialStatus, setInitialStatus] = useState<TaskDTO["status"]>("TODO");

  // Fetch tasks on mount
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

  const handleAddTask = (status: TaskDTO["status"]) => {
    setInitialStatus(status);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: TaskDTO) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    toast.promise(deleteTaskOptimistic(taskId), {
      loading: "Deleting task...",
      success: "Task deleted",
      error: "Failed to delete task",
    });
  };

  // Group tasks by status
  const columns: { id: TaskDTO["status"]; title: string }[] = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Completed" },
  ];

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
          {columns.map((col) => (
            <TaskColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks
                .filter((t) => t.status === col.id)
                .sort((a, b) => a.position - b.position)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
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
    </div>
  );
}
