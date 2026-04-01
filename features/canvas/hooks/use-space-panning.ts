"use client";

import { useAtom } from "jotai";
import { useRef } from "react";
import { useCanvas } from "@/features/canvas/hooks/use-canvas";
import { useEventListener } from "@/hooks/use-event-listener";
import { isInputFocused, isSpacebar } from "@/lib/event";
import { canvasOffsetAtom, isPanningAtom } from "@/stores/canvas";

export function useSpacePanning() {
  const [, setIsPanning] = useAtom(isPanningAtom);
  const [, setOffset] = useAtom(canvasOffsetAtom);
  const spaceDown = useRef(false);
  const { position, move } = useCanvas();
  const activePointerId = useRef<number | null>(null);

  useEventListener("keydown", (e) => {
    if (isSpacebar(e) && !e.repeat && !isInputFocused()) {
      e.preventDefault();
      spaceDown.current = true;
      document.body.style.cursor = "grab";
    }
  });

  useEventListener("keyup", (e) => {
    if (isSpacebar(e)) {
      spaceDown.current = false;
      setIsPanning(false);
      document.body.style.cursor = "";
    }
  });

  useEventListener("pointerdown", (e) => {
    if (spaceDown.current && e.button === 0) {
      e.preventDefault();
      setIsPanning(true);
      activePointerId.current = e.pointerId;
      move(e.clientX, e.clientY);
      document.body.style.cursor = "grabbing";
    }
  });

  useEventListener("pointermove", (e) => {
    if (!spaceDown.current || activePointerId.current !== e.pointerId) return;
    const dx = e.clientX - position.current.x;
    const dy = e.clientY - position.current.y;
    move(e.clientX, e.clientY);
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  });

  useEventListener("pointerup", (e) => {
    if (activePointerId.current === e.pointerId) {
      activePointerId.current = null;
      setIsPanning(false);
      document.body.style.cursor = spaceDown.current ? "grab" : "";
    }
  });
}
