"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { useCanvas } from "@/features/canvas/hooks/use-canvas";
import { isMiddleMouseButton } from "@/lib/event";
import { canvasOffsetAtom, isPanningAtom } from "@/stores/canvas";

export function useCanvasPanning() {
  const [offset, setOffset] = useAtom(canvasOffsetAtom);
  const [isPanning, setIsPanning] = useAtom(isPanningAtom);
  const { position, move } = useCanvas();

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isMiddleMouseButton(e)) return;

      e.preventDefault();
      setIsPanning(true);
      move(e.clientX, e.clientY);
      const target = e.target as HTMLElement;
      target.setPointerCapture(e.pointerId);
    },
    [setIsPanning, move],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - position.current.x;
      const dy = e.clientY - position.current.y;
      move(e.clientX, e.clientY);
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    },
    [isPanning, setOffset, move, position],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isMiddleMouseButton(e) || isPanning) {
        setIsPanning(false);
      }
    },
    [isPanning, setIsPanning],
  );

  return {
    offset,
    isPanning,
    setIsPanning,
    position,
    move,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
  };
}
