"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
}

export function Tabs({ tabs }: TabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div>
      <div role="tablist" className="flex w-full border-b border-hairline">
        {tabs.map((tab) => {
          const isActive = tab.id === active?.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveId(tab.id)}
              className={`label-nav flex-1 border-b-2 py-5 text-center transition-colors duration-200 ${
                isActive
                  ? "border-accent text-text"
                  : "border-transparent text-text-40 hover:text-text-60"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {active && (
        <div
          role="tabpanel"
          id={`tabpanel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="py-10"
        >
          {active.content}
        </div>
      )}
    </div>
  );
}
