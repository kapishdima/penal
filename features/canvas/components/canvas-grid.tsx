"use client";

import { useAtomValue } from "jotai";
import {
  canvasOffsetAtom,
  gridSizeAtom,
  snapEnabledAtom,
} from "@/stores/canvas";

export function CanvasGrid() {
  const offset = useAtomValue(canvasOffsetAtom);
  const gridSize = useAtomValue(gridSizeAtom);
  const snapEnabled = useAtomValue(snapEnabledAtom);

  if (!snapEnabled) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <pattern
          id="canvas-grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
          x={offset.x % gridSize}
          y={offset.y % gridSize}
        >
          <circle cx={1} cy={1} r={0.5} className="fill-muted-foreground/15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#canvas-grid)" />
    </svg>
  );
}
