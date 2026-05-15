/**
 * Pusher client-side configuration constants.
 * Kept separate so this can be imported in 'use client' components
 * without accidentally importing server-only Pusher SDK.
 */
export const PUSHER_CLIENT_CONFIG = {
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
} as const;

export * from "./pusher-shared";
