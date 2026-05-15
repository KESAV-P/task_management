"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { useTaskStore } from "@/store/use-task-store";
import { PUSHER_CLIENT_CONFIG, PUSHER_EVENTS, getUserChannel } from "@/lib/pusher-client";
import { toast } from "sonner";

export function usePusher(userId: string | undefined) {
  const { addTask, updateTaskState, removeTask } = useTaskStore();

  useEffect(() => {
    if (!userId) return;

    // Initialize Pusher client
    const pusher = new Pusher(PUSHER_CLIENT_CONFIG.key, {
      cluster: PUSHER_CLIENT_CONFIG.cluster,
      authEndpoint: "/api/pusher/auth", // We'll need to create this route
    });

    const channelName = getUserChannel(userId);
    const channel = pusher.subscribe(channelName);

    // Bind events
    channel.bind(PUSHER_EVENTS.TASK_CREATED, (data: { task: any }) => {
      addTask(data.task);
      toast.info("New task added by another device", { id: "pusher-create" });
    });

    channel.bind(PUSHER_EVENTS.TASK_UPDATED, (data: { task: any }) => {
      updateTaskState(data.task);
      toast.info("Task updated by another device", { id: "pusher-update" });
    });

    channel.bind(PUSHER_EVENTS.TASK_DELETED, (data: { taskId: string }) => {
      removeTask(data.taskId);
      toast.info("Task deleted by another device", { id: "pusher-delete" });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [userId, addTask, updateTaskState, removeTask]);
}
