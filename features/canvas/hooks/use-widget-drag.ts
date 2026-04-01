"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useRef } from "react";
import { snapValue } from "@/lib/snap";
import {
  canvasScaleAtom,
  gridSizeAtom,
  isPanningAtom,
  selectedWidgetIdAtom,
  snapEnabledAtom,
  widgetsAtom,
} from "@/stores/canvas";

type DragState = {
  startX: number;
  startY: number;
  startWidgetX: number;
  startWidgetY: number;
};

type WidgetState = { id: string; x: number; y: number; locked?: boolean };

export const useWidgetDrag = (widget: WidgetState | undefined) => {
  const [selectedId, setSelectedId] = useAtom(selectedWidgetIdAtom);
  const setWidgets = useSetAtom(widgetsAtom);
  const snapEnabled = useAtomValue(snapEnabledAtom);
  const gridSize = useAtomValue(gridSizeAtom);
  const scale = useAtomValue(canvasScaleAtom);

  const isPanning = useAtomValue(isPanningAtom);
  const isSelected = selectedId === widget?.id;
  const dragState = useRef<DragState | null>(null);

  const onDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (isPanning) return;
      if ((e.target as HTMLElement).closest("[data-resize-handle]")) return;
      if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
      if (e.button !== 0) return;

      if (!widget) return;

      e.stopPropagation();
      setSelectedId(widget.id);

      if (widget.locked) return;

      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidgetX: widget.x,
        startWidgetY: widget.y,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isPanning, widget, setSelectedId],
  );

  const onDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.current) return;
      const dx = (e.clientX - dragState.current.startX) / scale;
      const dy = (e.clientY - dragState.current.startY) / scale;

      let newX = dragState.current.startWidgetX + dx;
      let newY = dragState.current.startWidgetY + dy;

      newX = snapValue(newX, gridSize, snapEnabled);
      newY = snapValue(newY, gridSize, snapEnabled);

      setWidgets((prev) =>
        prev.map((w) => (w.id === widget?.id ? { ...w, x: newX, y: newY } : w)),
      );
    },
    [widget, snapEnabled, gridSize],
  );

  const onDragEnd = useCallback(() => {
    dragState.current = null;
  }, []);

  return {
    onDragStart,
    onDragMove,
    onDragEnd,
    isSelected,
    isPanning,
  };
};
