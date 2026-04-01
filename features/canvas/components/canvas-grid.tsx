"use client";

import { useAtomValue } from "jotai";
import {
  canvasOffsetAtom,
  canvasScaleAtom,
  gridSizeAtom,
  snapEnabledAtom,
} from "@/stores/canvas";

export function CanvasGrid() {
  const offset = useAtomValue(canvasOffsetAtom);
  const scale = useAtomValue(canvasScaleAtom);
  const gridSize = useAtomValue(gridSizeAtom);
  const snapEnabled = useAtomValue(snapEnabledAtom);

  if (!snapEnabled) return null;

  const scaledGrid = gridSize * scale;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <pattern
          id="canvas-grid"
          width={scaledGrid}
          height={scaledGrid}
          patternUnits="userSpaceOnUse"
          x={offset.x % scaledGrid}
          y={offset.y % scaledGrid}
        >
          <circle
            cx={scale}
            cy={scale}
            r={Math.max(0.4, 0.5 * scale)}
            className="fill-muted-foreground/15"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#canvas-grid)" />
    </svg>
  );
}
