"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { useTaskStore } from "@/store/use-task-store";
import { PUSHER_EVENTS, getUserChannel } from "@/lib/pusher-shared";

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY ?? "";
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "us2";

// Detect if Pusher is configured (not a placeholder)
const isPusherConfigured =
  PUSHER_KEY.length > 0 && !PUSHER_KEY.startsWith("your-");

export function usePusher(userId: string | undefined) {
  const { addTask, updateTaskState, removeTask } = useTaskStore();

  useEffect(() => {
    if (!userId || !isPusherConfigured) return;

    let pusher: Pusher;
    try {
      pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        authEndpoint: "/api/pusher/auth",
      });

      const channelName = getUserChannel(userId);
      const channel = pusher.subscribe(channelName);

      channel.bind(PUSHER_EVENTS.TASK_CREATED, (data: { task: any }) => {
        addTask(data.task);
      });

      channel.bind(PUSHER_EVENTS.TASK_UPDATED, (data: { task: any }) => {
        updateTaskState(data.task);
      });

      channel.bind(PUSHER_EVENTS.TASK_DELETED, (data: { taskId: string }) => {
        removeTask(data.taskId);
      });
    } catch (err) {
      console.warn("[Pusher] Failed to connect:", err);
    }

    return () => {
      try {
        pusher?.disconnect();
      } catch {}
    };
  }, [userId, addTask, updateTaskState, removeTask]);
}
