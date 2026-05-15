import { create } from "zustand";
import { TaskDTO } from "@/types";
import { createTask, updateTask, deleteTask, getTasks } from "@/actions/tasks";
import { toast } from "sonner";

interface TaskState {
  tasks: TaskDTO[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (task: TaskDTO) => void;
  updateTaskState: (task: TaskDTO) => void;
  removeTask: (taskId: string) => void;

  // Optimistic CRUD
  createTaskOptimistic: (title: string, status: TaskDTO["status"], priority: TaskDTO["priority"]) => Promise<void>;
  updateTaskOptimistic: (taskId: string, updates: Partial<TaskDTO>) => Promise<void>;
  deleteTaskOptimistic: (taskId: string) => Promise<void>;
  moveTaskOptimistic: (taskId: string, newStatus: TaskDTO["status"], newPosition: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    const result = await getTasks();
    if (result.success && result.data) {
      set({ tasks: result.data, isLoading: false });
    } else {
      const errorMessage = !result.success ? result.error : "Failed to fetch tasks";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

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

  createTaskOptimistic: async (title, status, priority) => {
    const tempId = `temp-${Date.now()}`;
    const newTask: TaskDTO = {
      id: tempId,
      title,
      status,
      priority,
      description: null,
      dueDate: null,
      position: get().tasks.filter(t => t.status === status).length,
      userId: "", // Will be set by server
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({ tasks: [...state.tasks, newTask] }));

    const result = await createTask({ title, status, priority });

    if (result.success && result.data) {
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === tempId ? result.data! : t)),
      }));
    } else {
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== tempId),
      }));
      const errorMessage = !result.success ? result.error : "Failed to create task";
      toast.error(errorMessage);
    }
  },

  updateTaskOptimistic: async (taskId, updates) => {
    const previousTasks = get().tasks;
    const taskToUpdate = previousTasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));

    const result = await updateTask({ 
      id: taskId, 
      ...updates,
      description: updates.description === null ? undefined : updates.description,
      dueDate: updates.dueDate === null ? undefined : updates.dueDate
    } as any);

    if (!result.success) {
      set({ tasks: previousTasks });
      toast.error(result.error ?? "Failed to update task");
    }
  },

  deleteTaskOptimistic: async (taskId) => {
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));

    const result = await deleteTask(taskId);

    if (!result.success) {
      set({ tasks: previousTasks });
      toast.error(result.error ?? "Failed to delete task");
    }
  },

  moveTaskOptimistic: async (taskId, newStatus, newPosition) => {
    const previousTasks = get().tasks;
    
    // Local move logic
    const taskToMove = previousTasks.find(t => t.id === taskId);
    if (!taskToMove) return;

    const updatedTasks = previousTasks.map(t => {
        if (t.id === taskId) return { ...t, status: newStatus, position: newPosition };
        
        // Adjust positions of other tasks in same column
        if (t.status === taskToMove.status && t.status === newStatus) {
            // Moving within same column
            if (taskToMove.position < newPosition) {
                if (t.position > taskToMove.position && t.position <= newPosition) return { ...t, position: t.position - 1 };
            } else {
                if (t.position >= newPosition && t.position < taskToMove.position) return { ...t, position: t.position + 1 };
            }
        } else if (t.status === taskToMove.status) {
            // Moving out of column
            if (t.position > taskToMove.position) return { ...t, position: t.position - 1 };
        } else if (t.status === newStatus) {
            // Moving into new column
            if (t.position >= newPosition) return { ...t, position: t.position + 1 };
        }

        return t;
    });

    set({ tasks: updatedTasks });

    const result = await updateTask({ id: taskId, status: newStatus, position: newPosition });

    if (!result.success) {
      set({ tasks: previousTasks });
      toast.error(result.error ?? "Failed to move task");
    }
  }
}));
