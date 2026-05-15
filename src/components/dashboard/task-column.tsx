"use client";

import { TaskDTO } from "@/types";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./task-card";
import { Plus, MoreHorizontal } from "lucide-react";

interface TaskColumnProps {
  id: TaskDTO["status"];
  title: string;
  color: string;
  tasks: TaskDTO[];
  onAddTask: (status: TaskDTO["status"]) => void;
  onEditTask: (task: TaskDTO) => void;
  onDeleteTask: (taskId: string) => void;
}

const columnStyles: Record<string, { badge: string; accent: string; glow: string }> = {
  slate: {
    badge: "bg-slate-700/50 text-slate-300",
    accent: "from-slate-500/10 to-transparent",
    glow: "border-slate-700/50",
  },
  indigo: {
    badge: "bg-indigo-500/20 text-indigo-400",
    accent: "from-indigo-500/10 to-transparent",
    glow: "border-indigo-500/20",
  },
  emerald: {
    badge: "bg-emerald-500/20 text-emerald-400",
    accent: "from-emerald-500/10 to-transparent",
    glow: "border-emerald-500/20",
  },
};

export default function TaskColumn({
  id,
  title,
  color,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TaskColumnProps) {
  const styles = columnStyles[color] ?? columnStyles.slate;

  return (
    <div className={`flex flex-col rounded-2xl border bg-[#0c1628]/40 backdrop-blur-sm overflow-hidden ${styles.glow}`}>
      {/* Header */}
      <div className={`px-5 py-4 border-b border-slate-800/60 bg-gradient-to-b ${styles.accent} shrink-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-bold text-slate-100 text-sm tracking-tight">{title}</h2>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
              {tasks.length}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onAddTask(id)}
              className="p-1.5 text-slate-600 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-label={`Add task to ${title}`}
            >
              <Plus size={15} />
            </button>
            <button className="p-1.5 text-slate-600 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Droppable */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto space-y-2 transition-colors duration-150 min-h-[120px] ${
              snapshot.isDraggingOver
                ? "bg-indigo-500/5"
                : ""
            }`}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#334155 transparent",
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}

            {/* Empty state */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <button
                onClick={() => onAddTask(id)}
                className="w-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-700 hover:border-slate-600 hover:text-slate-500 transition-colors group"
              >
                <Plus size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Add task</span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
