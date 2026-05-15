"use client";

import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  Menu,
  Zap,
} from "lucide-react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onNewTask?: () => void;
}

export default function DashboardLayout({ children, user, onNewTask }: DashboardLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSigningOut, startSignOut] = useTransition();
  const pathname = usePathname();

  const handleSignOut = () => {
    startSignOut(async () => {
      await signOut({ callbackUrl: "/login" });
    });
  };

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0d1424]/95 backdrop-blur-xl border-r border-slate-800/60 z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-7 h-20 border-b border-slate-800/60 shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            TaskFlow
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3">
            Navigation
          </p>
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            href="/dashboard"
            currentPath={pathname}
          />
          <SidebarItem
            icon={<CheckSquare size={18} />}
            label="My Tasks"
            href="/dashboard/tasks"
            currentPath={pathname}
          />
          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            href="/dashboard/settings"
            currentPath={pathname}
          />
        </nav>

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-slate-800/60 shrink-0">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/30 mb-2">
            <Avatar className="h-9 w-9 ring-2 ring-indigo-500/30 shrink-0">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
              <AvatarFallback className="bg-indigo-500/20 text-indigo-400 font-bold text-sm">
                {(user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {user.name ?? "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 px-3 h-9"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut size={16} className="mr-3" />
            {isSigningOut ? "Signing out…" : "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-8 border-b border-slate-800/60 bg-[#020617]/70 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            {/* Search */}
            <div className="hidden sm:flex items-center bg-slate-900/60 border border-slate-800/80 rounded-full px-4 py-2.5 w-64 xl:w-80 focus-within:border-indigo-500/50 focus-within:bg-slate-900 transition-all duration-200">
              <Search size={15} className="text-slate-600 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search tasks…"
                className="bg-transparent border-none outline-none text-sm text-slate-300 w-full placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/50 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </button>
            <Separator orientation="vertical" className="h-5 bg-slate-800" />
            <Button
              id="new-task-btn"
              onClick={onNewTask}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 rounded-xl px-4 sm:px-5 h-9 font-semibold text-sm transition-all"
            >
              <Plus size={16} className="sm:mr-1.5" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  currentPath,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  currentPath: string;
}) {
  const isActive = currentPath === href || (href !== "/dashboard" && currentPath.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group text-sm font-medium ${
        isActive
          ? "bg-indigo-500/15 text-indigo-400 shadow-sm"
          : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/40"
      }`}
    >
      <span className={isActive ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400"}>
        {icon}
      </span>
      {label}
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
      )}
    </Link>
  );
}
