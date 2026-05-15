"use client";

import { TaskDTO } from "@/types";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreVertical, GripVertical, Clock } from "lucide-react";
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

export default function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  const priorityColors = {
    LOW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    HIGH: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-4 transition-transform ${snapshot.isDragging ? "z-50" : ""}`}
        >
          <Card className={`group relative bg-[#0f172a] border-slate-800 hover:border-indigo-500/50 transition-all duration-200 overflow-hidden ${snapshot.isDragging ? "shadow-2xl shadow-indigo-500/20 ring-2 ring-indigo-500/50" : "hover:shadow-lg hover:shadow-indigo-500/5"}`}>
            {/* Drag Handle Overlay */}
            <div 
              {...provided.dragHandleProps}
              className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity text-slate-600 hover:text-slate-400"
            >
              <GripVertical size={16} />
            </div>

            <div className="p-4 pl-8">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${priorityColors[task.priority]}`}>
                  {task.priority}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="p-1 text-slate-500 hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                    <DropdownMenuItem onClick={() => onEdit(task)} className="focus:bg-slate-800">Edit Task</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-rose-400 focus:bg-rose-400/10 focus:text-rose-400">Delete Task</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="text-sm font-semibold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                {task.title}
              </h3>

              {task.description && (
                <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                {task.dueDate && (
                  <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                    <Calendar size={12} className="text-slate-400" />
                    <span>{format(new Date(task.dueDate), "MMM d")}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-600" />
                  <span>{format(new Date(task.createdAt), "HH:mm")}</span>
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className={`h-1 w-full mt-auto ${
              task.priority === 'HIGH' ? 'bg-rose-500/30' : 
              task.priority === 'MEDIUM' ? 'bg-amber-500/30' : 'bg-blue-500/30'
            }`} />
          </Card>
        </div>
      )}
    </Draggable>
  );
}
