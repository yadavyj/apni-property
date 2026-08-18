"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export default function Tabs({ tabs, defaultTab }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.key);
  const activeTab = tabs.find((t) => t.key === active) || tabs[0];

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="flex items-center gap-1 border-b border-white/10 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap min-w-0 max-w-full pb-0.5">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-t-xl border-b-2 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer",
                isActive
                  ? "border-brand-500 bg-white/5 text-white"
                  : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {tab.icon}
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    isActive ? "bg-brand-500/20 text-brand-300" : "bg-white/5 text-slate-500"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-5">
        {activeTab?.description && (
          <p className="max-w-2xl text-xs leading-relaxed text-slate-400">{activeTab.description}</p>
        )}
        {activeTab?.content}
      </div>
    </div>
  );
}
