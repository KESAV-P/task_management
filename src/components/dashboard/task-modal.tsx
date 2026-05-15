"use client";

import { useState, useEffect } from "react";
import { TaskDTO } from "@/types";
import { useTaskStore } from "@/store/use-task-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Calendar, AlignLeft, Flag, LayoutList } from "lucide-react";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TaskDTO | null;
  initialStatus?: TaskDTO["status"];
}

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "TODO" as TaskDTO["status"],
  priority: "MEDIUM" as TaskDTO["priority"],
  dueDate: "",
};

export default function TaskModal({
  open,
  onOpenChange,
  initialData,
  initialStatus = "TODO",
}: TaskModalProps) {
  const { createTaskOptimistic, updateTaskOptimistic } = useTaskStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_FORM, status: initialStatus });

  // Reset form whenever modal opens/changes target
  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description ?? "",
        status: initialData.status,
        priority: initialData.priority,
        dueDate: initialData.dueDate ? initialData.dueDate.split("T")[0] : "",
      });
    } else {
      setFormData({ ...EMPTY_FORM, status: initialStatus });
    }
  }, [open, initialData, initialStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateTaskOptimistic(initialData.id, {
          title: formData.title,
          description: formData.description || null,
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate || null,
        });
        toast.success("Task updated");
      } else {
        await createTaskOptimistic({
          title: formData.title,
          description: formData.description || undefined,
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
        });
        toast.success("Task created");
      }
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (key: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0d1424] border border-slate-800/80 text-slate-100 shadow-2xl shadow-black/60 p-0 gap-0 overflow-hidden">
        {/* Colour accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-lg font-bold text-slate-100">
              {initialData ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="modal-title" className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <AlignLeft size={12} /> Title <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="modal-title"
                value={formData.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="What needs to be done?"
                className="bg-slate-900/60 border-slate-800 focus:border-indigo-500/60 focus:ring-0 focus:ring-offset-0 text-slate-100 placeholder:text-slate-600"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="modal-description" className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <AlignLeft size={12} /> Description
              </Label>
              <Textarea
                id="modal-description"
                value={formData.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Add more context…"
                className="bg-slate-900/60 border-slate-800 focus:border-indigo-500/60 focus:ring-0 text-slate-100 placeholder:text-slate-600 min-h-[90px] resize-none"
              />
            </div>

            {/* Status + Priority row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <LayoutList size={12} /> Status
                </Label>
                <Select value={formData.status} onValueChange={(v) => v && update("status", v)}>
                  <SelectTrigger className="bg-slate-900/60 border-slate-800 text-slate-200 focus:ring-0 focus:border-indigo-500/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Flag size={12} /> Priority
                </Label>
                <Select value={formData.priority} onValueChange={(v) => v && update("priority", v)}>
                  <SelectTrigger className="bg-slate-900/60 border-slate-800 text-slate-200 focus:ring-0 focus:border-indigo-500/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="LOW">🔵 Low</SelectItem>
                    <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                    <SelectItem value="HIGH">🔴 High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <Label htmlFor="modal-due-date" className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={12} /> Due Date
              </Label>
              <Input
                id="modal-due-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
                className="bg-slate-900/60 border-slate-800 focus:border-indigo-500/60 focus:ring-0 text-slate-200 [color-scheme:dark]"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[130px] font-semibold"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : initialData ? (
                  "Save Changes"
                ) : (
                  "Create Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
