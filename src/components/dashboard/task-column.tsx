"use client";

import { TaskDTO } from "@/types";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./task-card";
import { Plus, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskColumnProps {
  id: TaskDTO["status"];
  title: string;
  tasks: TaskDTO[];
  onAddTask: (status: TaskDTO["status"]) => void;
  onEditTask: (task: TaskDTO) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskColumn({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TaskColumnProps) {
  const columnColor = {
    TODO: "bg-slate-500/20 text-slate-400",
    IN_PROGRESS: "bg-indigo-500/20 text-indigo-400",
    DONE: "bg-emerald-500/20 text-emerald-400",
  };

  return (
    <div className="flex flex-col w-full min-w-[320px] max-w-[400px] h-full bg-[#0f172a]/30 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
      {/* Column Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-slate-100 tracking-tight">{title}</h2>
          <Badge className={`rounded-full px-2 py-0 h-5 min-w-[20px] flex items-center justify-center font-bold text-[10px] border-none ${columnColor[id]}`}>
            {tasks.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onAddTask(id)}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <Plus size={18} />
          </button>
          <button className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 px-4 pb-4 overflow-y-auto custom-scrollbar transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-indigo-500/5" : ""
            }`}
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
            
            {/* Empty State / Add Task Button */}
            {tasks.length === 0 && (
              <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl group hover:border-slate-700 transition-colors cursor-pointer" onClick={() => onAddTask(id)}>
                <Plus size={24} className="text-slate-700 group-hover:text-slate-500 mb-2" />
                <span className="text-xs text-slate-600 group-hover:text-slate-400 font-medium">Add first task</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
