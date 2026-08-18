"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ExternalLink } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SignOutButton from "@/components/admin/SignOutButton";

export default function AdminShell({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 no-scrollbar">
      {/* Stationary Desktop Sidebar & Mobile Drawer */}
      <AdminSidebar open={open} onClose={() => setOpen(false)} />

      {/* Main Panel */}
      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        {/* Stationary Fixed Mobile Top Navbar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-slate-900/95 backdrop-blur-xl px-3 sm:px-4 py-2.5 lg:hidden shrink-0 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <span className="font-display text-sm font-bold text-white tracking-tight truncate max-w-[110px] sm:max-w-none">
              Apni Property
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Website Icon + Text Button */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all shadow-sm"
              title="View Public Website"
            >
              <ExternalLink className="h-3.5 w-3.5 text-brand-400" />
              Website
            </Link>

            {/* Logout Reddish Icon + Text Button */}
            <SignOutButton
              collapsedLabel={false}
              className="w-auto px-2.5 py-1.5 text-xs font-bold border-rose-500/30 bg-rose-500/15 text-rose-400 hover:bg-rose-500/30 shadow-sm"
            />
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-10 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
