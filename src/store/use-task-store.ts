import { create } from "zustand";
import { TaskDTO } from "@/types";
import { createTask, updateTask, deleteTask, getTasks } from "@/actions/tasks";
import { toast } from "sonner";

type CreateTaskInput = {
  title: string;
  description?: string;
  status: TaskDTO["status"];
  priority: TaskDTO["priority"];
  dueDate?: string;
};

interface TaskState {
  tasks: TaskDTO[];
  isLoading: boolean;
  error: string | null;

  // Raw state setters (used by Pusher hook)
  addTask: (task: TaskDTO) => void;
  updateTaskState: (task: TaskDTO) => void;
  removeTask: (taskId: string) => void;

  // Data fetching
  fetchTasks: () => Promise<void>;

  // Optimistic CRUD
  createTaskOptimistic: (input: CreateTaskInput) => Promise<void>;
  updateTaskOptimistic: (taskId: string, updates: Partial<TaskDTO>) => Promise<void>;
  deleteTaskOptimistic: (taskId: string) => Promise<void>;
  moveTaskOptimistic: (taskId: string, newStatus: TaskDTO["status"], newPosition: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  // ─── Raw setters ───────────────────────────────────────────────────────────

  addTask: (task) => {
    set((state) => {
      if (state.tasks.some((t) => t.id === task.id)) return state;
      return { tasks: [...state.tasks, task] };
    });
  },

  updateTaskState: (task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  },

  removeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));
  },

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    const result = await getTasks();
    if (result.success) {
      set({ tasks: result.data, isLoading: false });
    } else {
      set({ error: result.error, isLoading: false });
      toast.error(result.error);
    }
  },

  // ─── Create ────────────────────────────────────────────────────────────────

  createTaskOptimistic: async ({ title, description, status, priority, dueDate }) => {
    const tempId = `temp-${Date.now()}`;
    const newTask: TaskDTO = {
      id: tempId,
      title,
      description: description ?? null,
      status,
      priority,
      dueDate: dueDate ?? null,
      position: get().tasks.filter((t) => t.status === status).length,
      userId: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic add
    set((state) => ({ tasks: [...state.tasks, newTask] }));

    const result = await createTask({ title, description, status, priority, dueDate });

    if (result.success && result.data) {
      // Replace temp with real task from server
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === tempId ? result.data! : t)),
      }));
    } else {
      // Roll back
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== tempId),
      }));
      toast.error(!result.success ? result.error : "Failed to create task");
    }
  },

  // ─── Update ────────────────────────────────────────────────────────────────

  updateTaskOptimistic: async (taskId, updates) => {
    const previousTasks = get().tasks;
    const taskToUpdate = previousTasks.find((t) => t.id === taskId);
    if (!taskToUpdate) return;

    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));

    const result = await updateTask({
      id: taskId,
      title: updates.title,
      description: updates.description ?? undefined,
      status: updates.status,
      priority: updates.priority,
      dueDate: updates.dueDate ?? undefined,
      position: updates.position,
    });

    if (!result.success) {
      set({ tasks: previousTasks });
      toast.error(result.error);
    }
  },

  // ─── Delete ────────────────────────────────────────────────────────────────

  deleteTaskOptimistic: async (taskId) => {
    const previousTasks = get().tasks;

    // Optimistic delete
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));

    const result = await deleteTask(taskId);

    if (!result.success) {
      set({ tasks: previousTasks });
      toast.error(result.error);
      throw new Error(result.error); // So toast.promise catches it
    }
  },

  // ─── Move (drag & drop) ────────────────────────────────────────────────────

  moveTaskOptimistic: async (taskId, newStatus, newPosition) => {
    const previousTasks = get().tasks;
    const taskToMove = previousTasks.find((t) => t.id === taskId);
    if (!taskToMove) return;

    const updatedTasks = previousTasks.map((t) => {
      if (t.id === taskId) return { ...t, status: newStatus, position: newPosition };

      if (t.status === taskToMove.status && t.status === newStatus) {
        // Moving within same column
        if (taskToMove.position < newPosition) {
          if (t.position > taskToMove.position && t.position <= newPosition)
            return { ...t, position: t.position - 1 };
        } else {
          if (t.position >= newPosition && t.position < taskToMove.position)
            return { ...t, position: t.position + 1 };
        }
      } else if (t.status === taskToMove.status) {
        // Moving out of source column
        if (t.position > taskToMove.position)
          return { ...t, position: t.position - 1 };
      } else if (t.status === newStatus) {
        // Moving into destination column
        if (t.position >= newPosition)
          return { ...t, position: t.position + 1 };
      }

      return t;
    });

    set({ tasks: updatedTasks });

    const result = await updateTask({
      id: taskId,
      status: newStatus,
      position: newPosition,
    });

    if (!result.success) {
      set({ tasks: previousTasks });
      toast.error(result.error);
    }
  },
}));
