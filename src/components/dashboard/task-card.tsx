"use client";

import { TaskDTO } from "@/types";
import { Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreVertical, GripVertical, Clock, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: TaskDTO;
  index: number;
  onEdit: (task: TaskDTO) => void;
  onDelete: (taskId: string) => void;
}

const priorityConfig: Record<
  TaskDTO["priority"],
  { badge: string; bar: string; dot: string }
> = {
  LOW: {
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    bar: "bg-sky-500/40",
    dot: "bg-sky-500",
  },
  MEDIUM: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    bar: "bg-amber-500/40",
    dot: "bg-amber-500",
  },
  HIGH: {
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    bar: "bg-rose-500/40",
    dot: "bg-rose-500",
  },
};

export default function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  const pConfig = priorityConfig[task.priority];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`rounded-xl border bg-[#111827]/80 transition-all duration-150 overflow-hidden group ${
            snapshot.isDragging
              ? "shadow-2xl shadow-black/60 ring-2 ring-indigo-500/50 border-indigo-500/40 rotate-[1deg]"
              : "border-slate-800/70 hover:border-slate-700/80 hover:shadow-lg hover:shadow-black/30"
          }`}
        >
          {/* Priority accent bar */}
          <div className={`h-0.5 w-full ${pConfig.bar}`} />

          <div className="p-3.5">
            {/* Top row: drag handle + priority badge + menu */}
            <div className="flex items-center gap-2 mb-2.5">
              {/* Drag handle — a span, not a button, to avoid nested button */}
              <span
                {...provided.dragHandleProps}
                className="text-slate-700 hover:text-slate-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                aria-label="Drag task"
              >
                <GripVertical size={14} />
              </span>

              <Badge
                variant="outline"
                className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0 rounded border ${pConfig.badge} flex-1`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot} mr-1 inline-block`} />
                {task.priority}
              </Badge>

              {/* ⚠️ DropdownMenuTrigger renders its own button, so we pass render props instead of nesting */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="text-slate-700 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100 p-0.5 rounded"
                  aria-label="Task options"
                >
                  <MoreVertical size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#0d1424] border-slate-800 text-slate-200 min-w-[140px]"
                >
                  <DropdownMenuItem
                    onClick={() => onEdit(task)}
                    className="gap-2 focus:bg-slate-800 cursor-pointer"
                  >
                    <Pencil size={13} className="text-indigo-400" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(task.id)}
                    className="gap-2 text-rose-400 focus:bg-rose-400/10 focus:text-rose-400 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-slate-100 mb-1.5 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
                {task.description}
              </p>
            )}

            {/* Footer: due date + created time */}
            <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-2">
              {task.dueDate && (
                <div className="flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded-md text-slate-400">
                  <Calendar size={11} />
                  <span>{format(new Date(task.dueDate), "MMM d")}</span>
                </div>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <Clock size={11} />
                <span>{format(new Date(task.createdAt), "HH:mm")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
