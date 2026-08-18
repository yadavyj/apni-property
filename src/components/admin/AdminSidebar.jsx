"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Gift,
  Image,
  Settings,
  ExternalLink,
  X,
  LandPlot,
} from "lucide-react";
import { cn } from "@/lib/cn";
import SignOutButton from "@/components/admin/SignOutButton";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/home", label: "Home Customization", icon: Image },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/referrals", label: "Refer & Earn", icon: Gift },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-2 py-4">
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                : "text-slate-400 border border-transparent hover:bg-slate-800/40 hover:text-slate-200 hover:border-slate-700/50"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isActive ? "text-purple-400" : "text-slate-500"
              )}
            />
            <span className="font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-white/10 bg-slate-950/95 backdrop-blur-2xl transition-transform duration-200 lg:relative lg:inset-auto lg:h-full lg:z-30 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Background glow lighting */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 px-6 py-6 relative z-10">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group w-full">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-md shadow-purple-600/40 group-hover:scale-110 transition-transform shrink-0">
              <LandPlot className="h-5 w-5" />
            </span>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-display text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                Apni Property
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3.5 relative z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <NavLinks pathname={pathname} onNavigate={onClose} />
        </div>

        {/* Bottom Actions Section */}
        <div className="flex flex-col gap-2.5 border-t border-purple-500/20 px-4 py-4 relative z-10 bg-slate-950/40">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/40 px-3.5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800/60 hover:border-slate-600/50 hover:text-white"
          >
            <ExternalLink className="h-4.5 w-4.5 shrink-0 text-slate-500" />
            <span>View Live Site</span>
          </Link>
          <SignOutButton className="w-full rounded-xl font-semibold py-2.5 px-3.5 text-sm border-rose-500/30 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25" />
        </div>
      </aside>
    </>
  );
}
