"use client";

import { Card, CardContent } from "@/components/ui/card";

interface MediaGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function MediaGrid<T>({ items, renderItem }: MediaGridProps<T>) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
