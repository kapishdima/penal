"use client";

import { Clock01Icon } from "@hugeicons/core-free-icons";
import { WidgetCard } from "@/features/canvas/components/widget-card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { useClock } from "../hooks/use-clock";

function ClockWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { time, seconds, date } = useClock();

  return (
    <WidgetCard
      icon={Clock01Icon}
      title="Clock"
      isSelected={isSelected}
      isPanning={isPanning}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-1 px-4">
        <div className="flex items-baseline">
          <span className="text-5xl font-extrabold font-heading tracking-tight tabular-nums">
            {time}
          </span>
          <span className="text-lg font-mono text-muted-foreground tabular-nums ml-1">
            {String(seconds).padStart(2, "0")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
    </WidgetCard>
  );
}

registerWidget({
  type: "clock",
  name: "Clock",
  icon: "🕐",
  defaultSize: { width: 280, height: 160 },
  minSize: { width: 220, height: 130 },
  component: ClockWidget,
});
