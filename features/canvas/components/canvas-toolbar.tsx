"use client";

import {
  SquareLock02Icon,
  SquareUnlock02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { snapEnabledAtom } from "@/stores/canvas";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function CanvasToolbar() {
  const [snapEnabled, setSnapEnabled] = useAtom(snapEnabledAtom);

  return (
    <Card className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 py-2 px-2">
      <CardContent className="flex flex-row items-center gap-x-3 p-0">
        <UserMenu />
        <div className="w-px h-4 bg-border" />
        <Button
          onClick={() => setSnapEnabled((v) => !v)}
          variant={snapEnabled ? "default" : "secondary"}
        >
          Snap to grid
          <HugeiconsIcon
            icon={snapEnabled ? SquareLock02Icon : SquareUnlock02Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
        </Button>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs text-muted-foreground font-medium">
          <Kbd>⌘ K</Kbd> to add widgets
        </span>
        <div className="w-px h-4 bg-border" />
        <ThemeToggle />
      </CardContent>
    </Card>
  );
}
