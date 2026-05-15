"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "@/lib/validations";
import { ActionResult, TaskDTO } from "@/types";
import { revalidatePath } from "next/cache";
import {
  pusherServer,
  getUserChannel,
  PUSHER_EVENTS,
} from "@/lib/pusher-server";

/**
 * Helper to convert Prisma Task to TaskDTO (handling Date serialization)
 */
function toTaskDTO(task: any): TaskDTO {
  return {
    ...task,
    dueDate: task.dueDate?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

// ─────────────────────────────────────────────
//  Create Task
// ─────────────────────────────────────────────

export async function createTask(
  input: CreateTaskInput
): Promise<ActionResult<TaskDTO>> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const validated = createTaskSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
    };
  }

  try {
    // Get the highest position in the current status column
    const lastTask = await prisma.task.findFirst({
      where: {
        userId: session.user.id,
        status: validated.data.status,
      },
      orderBy: { position: "desc" },
    });

    const newPosition = lastTask ? lastTask.position + 1 : 0;

    const task = await prisma.task.create({
      data: {
        ...validated.data,
        dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
        userId: session.user.id,
        position: newPosition,
      },
    });

    const taskDto = toTaskDTO(task);

    // Trigger Pusher event for real-time updates
    await pusherServer.trigger(
      getUserChannel(session.user.id),
      PUSHER_EVENTS.TASK_CREATED,
      { task: taskDto }
    );

    revalidatePath("/dashboard");
    return { success: true, data: taskDto };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task." };
  }
}

// ─────────────────────────────────────────────
//  Get Tasks
// ─────────────────────────────────────────────

export async function getTasks(): Promise<ActionResult<TaskDTO[]>> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: [{ status: "asc" }, { position: "asc" }],
    });

    return {
      success: true,
      data: tasks.map(toTaskDTO),
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: "Failed to fetch tasks." };
  }
}

// ─────────────────────────────────────────────
//  Update Task
// ─────────────────────────────────────────────

export async function updateTask(
  input: UpdateTaskInput
): Promise<ActionResult<TaskDTO>> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const validated = updateTaskSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: (validated.error.issues[0]?.message) ?? "Invalid input",
    };
  }

  const { id, ...data } = validated.data;

  try {
    // Verify ownership
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingTask) {
      return { success: false, error: "Task not found." };
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : (data.dueDate === null ? null : undefined),
      },
    });

    const taskDto = toTaskDTO(updatedTask);

    // Trigger Pusher event for real-time updates
    await pusherServer.trigger(
      getUserChannel(session.user.id),
      PUSHER_EVENTS.TASK_UPDATED,
      { task: taskDto }
    );

    revalidatePath("/dashboard");
    return { success: true, data: taskDto };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task." };
  }
}

// ─────────────────────────────────────────────
//  Delete Task
// ─────────────────────────────────────────────

export async function deleteTask(id: string): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  try {
    // Verify ownership
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingTask) {
      return { success: false, error: "Task not found." };
    }

    await prisma.task.delete({
      where: { id },
    });

    // Trigger Pusher event for real-time updates
    await pusherServer.trigger(
      getUserChannel(session.user.id),
      PUSHER_EVENTS.TASK_DELETED,
      { taskId: id }
    );

    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task." };
  }
}
