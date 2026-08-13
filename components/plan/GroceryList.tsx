"use client";

import { useState } from "react";
import type { WeeklyGroceryItem } from "@/lib/meal-plan";
import { CARD_SURFACE, FOCUS_RING } from "@/lib/styles";

export function GroceryList({ items }: { items: WeeklyGroceryItem[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const grouped = items.reduce<Record<string, WeeklyGroceryItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={`flex flex-col gap-6 p-6 ${CARD_SURFACE}`}>
      {Object.entries(grouped).map(([category, categoryItems]) => (
        <div key={category} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">{category}</span>
          <ul className="flex flex-col gap-0.5">
            {categoryItems.map((item) => (
              <li key={item.id}>
                <label className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-background">
                  <input
                    type="checkbox"
                    checked={checked.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className={`h-4 w-4 rounded accent-tomato ${FOCUS_RING}`}
                  />
                  <span
                    className={`flex-1 text-sm ${checked.has(item.id) ? "text-muted line-through" : "text-ink"}`}
                  >
                    {item.name}
                  </span>
                  <span className="font-mono text-xs text-muted">{item.quantity}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
