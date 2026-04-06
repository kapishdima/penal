"use client";

import "@/features/canvas/register-widgets";
import { Canvas } from "@/features/canvas/components/canvas";
import { CanvasToolbar } from "@/features/canvas/components/canvas-toolbar";
import { CommandPalette } from "@/features/canvas/components/command-palette";
import { MobileGuard } from "@/features/canvas/components/mobile-guard";

export default function CanvasPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <MobileGuard />
      <Canvas />
      <CommandPalette />
      <CanvasToolbar />
    </div>
  );
}
