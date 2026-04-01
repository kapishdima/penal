"use client";

import {
  CheckListIcon,
  NoteIcon,
  Target02Icon,
  Timer02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

function MockWidget({
  icon,
  title,
  children,
  className,
}: {
  icon: typeof NoteIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      size="sm"
      className={`border shadow-none ring-0 pointer-events-none select-none ${className ?? ""}`}
    >
      <CardHeader className="border-b flex flex-row items-center gap-2">
        <HugeiconsIcon
          icon={icon}
          size={14}
          className="text-muted-foreground"
        />
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs">{children}</CardContent>
    </Card>
  );
}

function MockCheckItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Checkbox checked={done} disabled />
      <span
        className={`text-xs ${done ? "line-through text-muted-foreground" : ""}`}
      >
        {label}
      </span>
    </div>
  );
}

export function AuthIllustration() {
  return (
    <div className="relative w-full max-w-md">
      {/* Canvas-like dot grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
        <defs>
          <pattern
            id="auth-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.8" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid)" />
      </svg>

      {/* Scattered mock widgets */}
      <div className="relative grid grid-cols-2 gap-3">
        <MockWidget icon={CheckListIcon} title="Tasks" className="col-span-1">
          <MockCheckItem done label="Set up Neon DB" />
          <MockCheckItem done label="Configure auth" />
          <MockCheckItem done={false} label="Deploy to Vercel" />
          <MockCheckItem done={false} label="Add GitHub OAuth" />
        </MockWidget>

        <MockWidget icon={Timer02Icon} title="Pomodoro" className="col-span-1">
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="relative size-16">
              <svg className="-rotate-90 size-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-muted/50"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * 0.35}
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-mono font-semibold tabular-nums">
                  16:20
                </span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              Focus
            </span>
          </div>
        </MockWidget>

        <MockWidget icon={NoteIcon} title="Notes" className="col-span-1">
          <div className="space-y-1 text-muted-foreground font-mono text-[10px] leading-relaxed">
            <p>## Sprint goals</p>
            <p>- Canvas panning ✓</p>
            <p>- Widget resize ✓</p>
            <p>- Auth flow</p>
          </div>
        </MockWidget>

        <MockWidget icon={Target02Icon} title="Habits" className="col-span-1">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Meditate</span>
              <span className="text-primary font-medium tabular-nums">12d</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Read</span>
              <span className="text-primary font-medium tabular-nums">7d</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Exercise</span>
              <span className="text-primary font-medium tabular-nums">3d</span>
            </div>
          </div>
        </MockWidget>
      </div>
    </div>
  );
}
