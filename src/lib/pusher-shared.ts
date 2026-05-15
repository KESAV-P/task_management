// ─────────────────────────────────────────────
//  Channel & event naming constants
//  (Shared between client and server)
// ─────────────────────────────────────────────

/** Returns the private Pusher channel name for a given user */
export const getUserChannel = (userId: string) => `private-user-${userId}`;

export const PUSHER_EVENTS = {
  TASK_CREATED: "task:created",
  TASK_UPDATED: "task:updated",
  TASK_DELETED: "task:deleted",
} as const;

export type PusherEventName =
  (typeof PUSHER_EVENTS)[keyof typeof PUSHER_EVENTS];
