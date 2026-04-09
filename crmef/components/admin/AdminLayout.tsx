"use client";

import { LayoutDashboard, LogOut, User, Calendar, FileText, Settings } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  onSignOut: () => void;
  userEmail?: string;
  activeTab: "bookings" | "resources";
  onTabChange: (tab: "bookings" | "resources") => void;
}

export function AdminLayout({ children, onSignOut, userEmail, activeTab, onTabChange }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sapphire-600">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-100">Admin</h1>
                <p className="text-xs text-slate-400">Ayoub Essaghyry</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => onTabChange("bookings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "bookings"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Réservations
            </button>
            <button
              onClick={() => onTabChange("resources")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "resources"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <FileText className="h-4 w-4" />
              Ressources
            </button>
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{userEmail}</p>
                <p className="text-xs text-slate-500">Administrateur</p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="mt-2 w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-6 bg-slate-900/50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
