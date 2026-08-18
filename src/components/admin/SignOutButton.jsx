"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { adminLogout } from "@/lib/actions/adminAuth.actions";
import { cn } from "@/lib/cn";

export default function SignOutButton({
  className,
  collapsedLabel = false,
  redirectTo = "/admin/login",
  authType = "admin",
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    if (authType === "admin") {
      await adminLogout();
    } else {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2.5 text-sm font-semibold text-rose-400 transition-all duration-200 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 shadow-sm cursor-pointer disabled:opacity-50",
        className
      )}
    >
      <LogOut className="h-3.5 w-3.5 shrink-0 text-rose-400" />
      {!collapsedLabel && <span>{loading ? "Logging out…" : "Logout"}</span>}
    </button>
  );
}
