"use client";

import {
  CommandIcon,
  Mouse01Icon,
  MouseScroll01Icon,
  SpaceshipIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Kbd } from "@/components/ui/kbd";
import { useOnboarding } from "../hooks/use-onboarding";

const steps = [
  {
    icon: CommandIcon,
    label: "Add a widget",
    shortcut: "⌘ K",
  },
  {
    icon: Mouse01Icon,
    label: "Pan the canvas",
    shortcut: "Middle click",
  },
  {
    icon: SpaceshipIcon,
    label: "Or hold space and drag",
    shortcut: "Space + Drag",
  },
  {
    icon: MouseScroll01Icon,
    label: "Zoom in and out",
    shortcut: "⌘ Scroll",
  },
];

export function CanvasOnboarding() {
  const { visible } = useOnboarding();

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome to Pennal
          </h2>
          <p className="text-sm text-muted-foreground">
            Your personal workspace. Start by adding widgets.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {steps.map((step) => (
            <div
              key={step.label}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm px-4 py-3 shadow-sm"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <HugeiconsIcon
                  icon={step.icon}
                  size={16}
                  className="text-muted-foreground"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {step.label}
                </span>
                <Kbd className="w-fit">{step.shortcut}</Kbd>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/60">
          Press{" "}
          <Kbd>⌘ K</Kbd>{" "}
          to get started
        </p>
      </div>
    </div>
  );
}
