"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LandPlot, User, LogOut, LayoutDashboard, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";
import Container from "./Container";
import Button from "@/components/ui/Button";
import { buildGenericWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { PROPERTY_CATEGORIES } from "@/lib/constants";
import { usePublicAuth } from "@/components/providers/PublicAuthProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/refer-earn", label: "Refer & Earn" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = usePublicAuth();

  function handleSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (searchCategory) params.set("category", searchCategory);
    router.push(`/properties?${params.toString()}`);
    setSearchOpen(false);
    setOpen(false);
  }

  useEffect(() => {
    let frameId = null;
    let previousValue = null;

    function updateScrollState() {
      frameId = null;
      const nextValue = window.scrollY > 8;
      if (nextValue === previousValue) return;
      previousValue = nextValue;
      setScrolled(nextValue);
    }

    function onScroll() {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateScrollState);
    }

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    let idleId = null;

    function prefetchPublicRoutes() {
      for (const link of NAV_LINKS) {
        if (link.href !== pathname) router.prefetch(link.href);
      }
    }

    const timeoutId = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(prefetchPublicRoutes, { timeout: 3000 });
      } else {
        prefetchPublicRoutes();
      }
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId !== null) window.cancelIdleCallback(idleId);
    };
  }, [pathname, router]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    try {
      await signOut();
      setOpen(false);
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error?.message || "Could not log out. Please try again.");
    }
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-slate-950/80 backdrop-blur-md transition-all duration-300",
          scrolled
            ? "border-white/10 shadow-[0_8px_24px_-16px_rgba(139,92,246,0.3)] bg-slate-950/90"
            : "border-transparent bg-slate-950/40"
        )}
      >
        <Container className="flex h-16 items-center justify-between lg:h-20">
          <Link
            href="/"
            className="group flex items-center gap-2 font-display text-xl font-medium tracking-tight text-white lg:text-2xl"
            onClick={() => setOpen(false)}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 lg:h-9 lg:w-9">
              <LandPlot className="h-4 w-4 lg:h-4.5 lg:w-4.5" />
            </span>
            Apni Property
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={cn(
                    "group relative py-1 text-sm font-semibold text-slate-300 transition-colors hover:text-white",
                    active && "text-white"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-linear-to-r from-brand-500 to-accent-500 transition-transform duration-300 ease-out group-hover:scale-x-100",
                      active && "scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {/* Search Icon / Dropdown Panel */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-sm cursor-pointer"
                title="Search Properties"
                aria-label="Search properties"
              >
                <Search className="h-5 w-5" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-white/10 bg-slate-900/95 p-4 backdrop-blur-2xl shadow-2xl">
                  <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
                    <div className="relative flex items-center">
                      <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search area, location, sector..."
                        className="w-full h-11 rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50"
                      />
                    </div>

                    <div className="relative flex items-center">
                      <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="w-full h-11 appearance-none rounded-xl border border-white/10 bg-slate-950/60 px-3.5 pr-9 text-sm text-white focus:outline-none focus:border-brand-500/50 cursor-pointer"
                      >
                        <option value="" className="bg-slate-950 text-white">All Types</option>
                        {PROPERTY_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value} className="bg-slate-950 text-white">
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
                    </div>

                    <button
                      type="submit"
                      className="h-11 w-full rounded-xl bg-linear-to-r from-brand-500 via-brand-600 to-accent-500 text-sm font-semibold text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-200 cursor-pointer"
                    >
                      Search
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Direct Dashboard + Logout buttons */}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border border-brand-500/40 bg-brand-500/20 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-300 hover:bg-brand-500/30 transition-all shadow-md"
                  title="My Dashboard"
                >
                  <LayoutDashboard className="h-4.5 w-4.5 text-brand-400" />
                  <span>Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/15 text-rose-400 hover:bg-rose-500/30 transition-all shadow-md cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-sm"
                title="Sign In / Login"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>

          {/* Mobile Right Controls: Compact Icon Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/40 bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-all shadow-sm"
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-4.5 w-4.5 text-brand-400" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 hover:bg-rose-500/30 transition-all shadow-sm cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition-colors"
                title="Login"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex"
                >
                  {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Slide-Over Sidebar Drawer outside header element */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Sidebar Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute top-0 right-0 bottom-0 flex h-full w-72 sm:w-80 max-w-[85vw] flex-col justify-between overflow-x-hidden overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-l border-white/10 bg-slate-950 p-5 sm:p-6 shadow-2xl"
            >
              {/* Background ambient lighting for sidebar */}
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent-500/15 blur-3xl" />
              </div>

              <div className="relative z-10 flex flex-col gap-6">
                {/* Drawer Top Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-display text-base sm:text-lg font-bold text-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-md">
                      <LandPlot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    Apni Property
                  </Link>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>

                {/* User Account Info Pill in Drawer */}
                {user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-brand-500/30 bg-brand-500/10 p-3 text-xs transition-colors hover:bg-brand-500/20"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 shrink-0 font-bold">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <span className="truncate font-semibold text-white">{user.email}</span>
                    </div>
                    <LayoutDashboard className="h-4 w-4 shrink-0 text-brand-300" />
                  </Link>
                )}

                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2.5">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search area, location, sector..."
                      className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="w-full h-11 appearance-none rounded-xl border border-white/10 bg-white/5 px-3.5 pr-9 text-sm text-white focus:outline-none focus:border-brand-500/50 cursor-pointer"
                      >
                        <option value="" className="bg-slate-950 text-white">All Types</option>
                        {PROPERTY_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value} className="bg-slate-950 text-white">
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    <button
                      type="submit"
                      className="shrink-0 rounded-xl bg-linear-to-r from-brand-500 via-brand-600 to-accent-500 px-5 text-sm font-semibold text-white cursor-pointer"
                    >
                      Go
                    </button>
                  </div>
                </form>

                {/* Nav Links List */}
                <nav className="flex flex-col gap-1.5">
                  {user && (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all",
                        pathname?.startsWith("/dashboard")
                          ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                          : "text-slate-200 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4 text-brand-400" />
                      My Dashboard
                    </Link>
                  )}
                  {NAV_LINKS.map((link) => {
                    const active =
                      link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        prefetch={true}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center rounded-xl px-3.5 py-3 text-sm font-semibold transition-all",
                          active
                            ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                            : "text-slate-200 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="relative z-10 flex flex-col gap-2.5 border-t border-white/10 pt-4 mt-6">
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/15 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/30 transition-all shadow-md cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout Account
                  </button>
                ) : (
                  <Button
                    href="/login"
                    size="md"
                    className="w-full justify-center text-white border border-brand-500/30 bg-brand-500/20 hover:bg-brand-500/30 font-bold py-3"
                    onClick={() => setOpen(false)}
                  >
                    <User className="h-4 w-4 mr-1.5" />
                    Sign In / Login
                  </Button>
                )}

                <Button
                  href={buildGenericWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="md"
                  className="w-full justify-center text-white font-semibold py-3"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
