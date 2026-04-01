"use client";

import { useAtom } from "jotai";
import { useEventListener } from "@/hooks/use-event-listener";
import { canvasOffsetAtom, canvasScaleAtom } from "@/stores/canvas";

const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
const WHEEL_OPTIONS: AddEventListenerOptions = { passive: false };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useWheelNavigation() {
  const [offset, setOffset] = useAtom(canvasOffsetAtom);
  const [scale, setScale] = useAtom(canvasScaleAtom);

  useEventListener(
    "wheel",
    (e) => {
      // Don't intercept scroll inside overlays (command palette, dropdowns, etc.)
      const target = e.target as HTMLElement;
      if (target.closest("[data-slot=dialog-content], [data-slot=dropdown-menu-content], [data-slot=command-list]")) {
        return;
      }

      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Zoom: pinch gesture or Ctrl+scroll
        const delta = -e.deltaY * 0.01;
        const newScale = clamp(scale + delta, MIN_SCALE, MAX_SCALE);

        // Zoom toward cursor: keep point under cursor fixed
        const cursorX = e.clientX - offset.x;
        const cursorY = e.clientY - offset.y;
        const scaleFactor = newScale / scale;

        setOffset({
          x: e.clientX - cursorX * scaleFactor,
          y: e.clientY - cursorY * scaleFactor,
        });
        setScale(newScale);
      } else {
        // Pan: two-finger trackpad scroll or mouse wheel
        setOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    },
    WHEEL_OPTIONS,
  );
}
