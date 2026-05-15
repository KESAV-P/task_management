"use client";

import { signOutAction } from "@/actions/auth";
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
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0f172a]/80 backdrop-blur-xl border-r border-slate-800/50 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CheckSquare className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              TaskFlow
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active
              href="/dashboard"
            />
            <SidebarItem
              icon={<CheckSquare size={20} />}
              label="My Tasks"
              href="/dashboard/tasks"
            />
            <SidebarItem
              icon={<Settings size={20} />}
              label="Settings"
              href="/dashboard/settings"
            />
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-6 border-t border-slate-800/50 px-2">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-10 w-10 ring-2 ring-indigo-500/20">
                <AvatarImage src={user.image ?? ""} />
                <AvatarFallback className="bg-indigo-500/10 text-indigo-400">
                  {user.name?.[0] ?? user.email?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  {user.name ?? "User"}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/5 px-3"
              onClick={() => signOutAction()}
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-slate-800/50 bg-[#020617]/50 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2 w-72 group focus-within:border-indigo-500/50 transition-colors">
              <Search size={18} className="text-slate-500 mr-3" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-slate-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617]" />
            </button>
            <Separator orientation="vertical" className="h-6 bg-slate-800" />
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 rounded-full px-4 sm:px-6 h-10">
              <Plus size={18} className="sm:mr-2" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 lg:p-10">
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
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-indigo-500/10 text-indigo-400 shadow-sm"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      }`}
    >
      <div className={`${active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
      )}
    </Link>
  );
}
