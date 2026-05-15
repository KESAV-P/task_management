"use client";

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import KanbanBoard from "@/components/dashboard/kanban-board";
import { usePusher } from "@/hooks/use-pusher";

interface DashboardClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  // Initialize real-time sync
  usePusher(user.id);

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Workspace
          </h1>
          <p className="text-slate-500 text-sm">
            Manage your projects and keep track of your team's progress in real-time.
          </p>
        </div>

        <KanbanBoard />
      </div>
    </DashboardLayout>
  );
}
