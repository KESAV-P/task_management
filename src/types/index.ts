import type { Task, TaskStatus, TaskPriority } from "@prisma/client";

// ─────────────────────────────────────────────
//  Re-exports from Prisma for convenience
// ─────────────────────────────────────────────
export type { Task, TaskStatus, TaskPriority };

// ─────────────────────────────────────────────
//  Task DTOs
// ─────────────────────────────────────────────

/** Task with only the fields safe to send to the client */
export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // ISO string (Date is not serialisable across the network)
  position: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// ─────────────────────────────────────────────
//  Form payloads
// ─────────────────────────────────────────────

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string; // ISO string
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  position?: number;
}

// ─────────────────────────────────────────────
//  Server Action return shape
// ─────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─────────────────────────────────────────────
//  Pusher event payloads
// ─────────────────────────────────────────────

export interface PusherTaskCreated {
  task: TaskDTO;
}

export interface PusherTaskUpdated {
  task: TaskDTO;
}

export interface PusherTaskDeleted {
  taskId: string;
}

// ─────────────────────────────────────────────
//  Kanban board helpers
// ─────────────────────────────────────────────

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: TaskDTO[];
}

// ─────────────────────────────────────────────
//  Auth session user shape
// ─────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}
