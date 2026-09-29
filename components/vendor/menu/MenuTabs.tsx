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
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 text-base font-medium whitespace-nowrap border-r border-gray-200 transition-colors last:border-r-0",
                isActive
                  ? "bg-[#FDE7DA] text-primary"
                  : "text-gray-700 hover:bg-gray-50",
                  idx === tabs.length - 1 ? " rounded-r-lg" : "",
                  idx === 0 ? " rounded-l-lg " : "",
              )}
            >
              {tab.name}
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 text-[10px] font-medium items-center justify-center rounded-full px-1.5",
                  isActive
                    ? "bg-[#FBCCB2] text-primary"
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
