import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { User, Mail, Shield } from "lucide-react";

export default async function SettingsPage() {
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
        <div className="mb-8 shrink-0">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your account preferences and profile information.
          </p>
        </div>
        
        <div className="flex-1 max-w-2xl">
            <div className="bg-[#0d1424]/80 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-8 shadow-xl shadow-black/20">
                <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                    <Shield className="text-indigo-400" size={20} />
                    Profile Information
                </h2>
                
                <div className="space-y-6">
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            <User size={14} /> Full Name
                        </label>
                        <p className="text-slate-200 text-lg font-medium">{session.user.name}</p>
                    </div>
                    
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            <Mail size={14} /> Email Address
                        </label>
                        <p className="text-slate-200 text-lg font-medium">{session.user.email}</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/60">
                    <p className="text-xs text-slate-500 text-center">
                        TaskFlow uses OAuth for authentication. Profile details are managed by your provider.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
