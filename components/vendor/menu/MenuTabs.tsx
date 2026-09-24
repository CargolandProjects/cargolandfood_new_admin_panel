"use client";

import { cn } from "@/lib/utils";

export interface MenuTab {
  id: string; // "all" or categoryId
  name: string;
  count: number;
}

interface MenuTabsProps {
  tabs: MenuTab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function MenuTabs({ tabs, activeTab, onChange }: MenuTabsProps) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="w-fit flex rounded-lg border border-gray-200 bg-white">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-r rounded-lg border-gray-200 px-5 py-3 text-sm font-medium transition-colors last:border-r-0",
                isActive
                  ? "bg-[#F16622] text-white"
                  : "text-gray-700 hover:bg-gray-50",
              )}
            >
              {tab.name}
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-gray-100 text-gray-600",
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
