"use client";

import { useAtom, useAtomValue } from "jotai";
import { useCallback, useRef } from "react";
import { snapValue } from "@/lib/snap";
import { gridSizeAtom, snapEnabledAtom, widgetsAtom } from "@/stores/canvas";

interface ResizeState {
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startWidgetX: number;
  startWidgetY: number;
  handle: string;
}

export function useWidgetResize(
  widgetId: string,
  minWidth = 200,
  minHeight = 120,
) {
  const [widgets, setWidgets] = useAtom(widgetsAtom);
  const snapEnabled = useAtomValue(snapEnabledAtom);
  const gridSize = useAtomValue(gridSizeAtom);
  const resizeState = useRef<ResizeState | null>(null);

  const onResizeStart = useCallback(
    (handle: string, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const widget = widgets.find((w) => w.id === widgetId);
      if (!widget) return;

      resizeState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: widget.width,
        startHeight: widget.height,
        startWidgetX: widget.x,
        startWidgetY: widget.y,
        handle,
      };
      const target = e.target as HTMLElement;
      target.setPointerCapture(e.pointerId);
    },
    [widgets, widgetId],
  );

  const onResizeMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeState.current) return;
      const {
        startX,
        startY,
        startWidth,
        startHeight,
        startWidgetX,
        startWidgetY,
        handle,
      } = resizeState.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      setWidgets((prev) =>
        prev.map((w) => {
          if (w.id !== widgetId) return w;

          let newWidth = startWidth;
          let newHeight = startHeight;
          let newX = startWidgetX;
          let newY = startWidgetY;

          if (handle.includes("e")) newWidth = startWidth + dx;
          if (handle.includes("w")) {
            newWidth = startWidth - dx;
            newX = startWidgetX + dx;
          }
          if (handle.includes("s")) newHeight = startHeight + dy;
          if (handle.includes("n")) {
            newHeight = startHeight - dy;
            newY = startWidgetY + dy;
          }

          newWidth = Math.max(minWidth, newWidth);
          newHeight = Math.max(minHeight, newHeight);

          // Snap size
          newWidth = snapValue(newWidth, gridSize, snapEnabled);
          newHeight = snapValue(newHeight, gridSize, snapEnabled);

          // Recalculate position for n/w handles after snapping
          if (handle.includes("w")) {
            newX = startWidgetX + startWidth - newWidth;
          }
          if (handle.includes("n")) {
            newY = startWidgetY + startHeight - newHeight;
          }

          newX = snapValue(newX, gridSize, snapEnabled);
          newY = snapValue(newY, gridSize, snapEnabled);

          return { ...w, width: newWidth, height: newHeight, x: newX, y: newY };
        }),
      );
    },
    [widgetId, setWidgets, gridSize, snapEnabled, minWidth, minHeight],
  );

  const onResizeEnd = useCallback(() => {
    resizeState.current = null;
  }, []);

  return { onResizeStart, onResizeMove, onResizeEnd };
}
