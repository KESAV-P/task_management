import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { CheckSquare } from "lucide-react";

export default async function TasksPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout 
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      }} 
    >
      <div className="flex flex-col h-full animate-fade-in">
        <div className="mb-6 shrink-0">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            My Tasks
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View and manage all your tasks in a list format.
          </p>
        </div>
        
        <div className="flex-1 bg-[#0d1424]/60 border border-slate-800/60 rounded-2xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
                <CheckSquare className="text-indigo-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">List View Coming Soon</h3>
            <p className="text-slate-500 mt-2 text-center max-w-sm">
                We're working on a detailed list view for your tasks. For now, please use the Kanban board on the dashboard.
            </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
