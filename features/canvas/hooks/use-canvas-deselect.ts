"use client";

import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { selectedWidgetIdAtom } from "@/stores/canvas";

export function useCanvasDeselect() {
  const setSelectedId = useSetAtom(selectedWidgetIdAtom);

  const onCanvasPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (
        e.target === e.currentTarget ||
        (e.target as HTMLElement).closest("[data-canvas-surface]")
      ) {
        setSelectedId(null);
      }
    },
    [setSelectedId],
  );

  return onCanvasPointerDown;
}
