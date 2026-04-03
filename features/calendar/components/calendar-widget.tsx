"use client";

import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { WidgetCard } from "@/features/canvas/components/widget-card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";

function CalendarWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  return (
    <WidgetCard
      icon={Calendar01Icon}
      title="Calendar"
      isSelected={isSelected}
      isPanning={isPanning}
    >
      <div className="flex-1 flex items-center justify-center p-2" data-no-drag>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="rounded-lg"
        />
      </div>
    </WidgetCard>
  );
}

registerWidget({
  type: "calendar",
  name: "Calendar",
  icon: "📅",
  defaultSize: { width: 300, height: 340 },
  minSize: { width: 280, height: 300 },
  component: CalendarWidget,
});
