"use client";

import {
  PauseIcon,
  PlayIcon,
  RepeatIcon,
  Timer02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { cn } from "@/lib/utils";
import { type PomodoroPhase, usePomodoro } from "../hooks/use-pomodoro";

const PHASES: { value: PomodoroPhase; label: string }[] = [
  { value: "focus", label: "Focus" },
  { value: "short-break", label: "Short" },
  { value: "long-break", label: "Long" },
];

function PomodoroControls({
  isComplete,
  isRunning,
  hasProgress,
  onStart,
  onPause,
  onReset,
}: {
  isComplete: boolean;
  isRunning: boolean;
  hasProgress: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}) {
  if (isComplete) {
    return (
      <div className="flex items-center gap-2" data-no-drag>
        <Button variant="outline" size="sm" onClick={onReset}>
          <HugeiconsIcon icon={RepeatIcon} size={16} />
          Reset
        </Button>
      </div>
    );
  }

  if (isRunning) {
    return (
      <div className="flex items-center gap-2" data-no-drag>
        <Button variant="outline" size="sm" onClick={onPause}>
          <HugeiconsIcon icon={PauseIcon} size={16} />
          Pause
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2" data-no-drag>
      <Button size="sm" onClick={onStart}>
        <HugeiconsIcon icon={PlayIcon} size={16} />
        Start
      </Button>
      {hasProgress && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <HugeiconsIcon icon={RepeatIcon} size={16} />
        </Button>
      )}
    </div>
  );
}

function PomodoroWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const {
    phase,
    display,
    progress,
    label,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
    switchPhase,
  } = usePomodoro();

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Card
      size="sm"
      className={cn(
        "h-full border ring-0 shadow-none transition",
        isSelected && "border-2 border-primary shadow-md",
        isPanning && "pointer-events-none opacity-50",
      )}
    >
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Timer02Icon}
            size={16}
            className="text-muted-foreground"
          />
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Pomodoro
          </CardTitle>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col items-center justify-center gap-4 p-4">
        <div className="relative size-28" data-no-drag>
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-muted/50"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={cn(
                "transition-all duration-1000",
                phase === "focus"
                  ? "text-primary"
                  : "text-green-500 dark:text-green-400",
              )}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-semibold tabular-nums">
              {display}
            </span>
          </div>
        </div>

        <PomodoroControls
          isComplete={isComplete}
          isRunning={isRunning}
          hasProgress={progress > 0}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />

        <div className="flex gap-1" data-no-drag>
          {PHASES.map((p) => (
            <Button
              key={p.value}
              type="button"
              size="xs"
              onClick={() => switchPhase(p.value)}
              variant={p.value === phase ? "default" : "secondary"}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

registerWidget({
  type: "pomodoro",
  name: "Pomodoro Timer",
  icon: "⏱️",
  defaultSize: { width: 260, height: 300 },
  minSize: { width: 220, height: 260 },
  component: PomodoroWidget,
});
