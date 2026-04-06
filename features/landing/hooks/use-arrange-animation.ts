"use client";

import type { createStore } from "jotai";
import { useEffect, useRef, useState } from "react";
import { type WidgetInstance, widgetsAtom } from "@/stores/canvas";

export function useArrangeAnimation(
  store: ReturnType<typeof createStore>,
  layouts: WidgetInstance[][],
  intervalMs = 3000,
) {
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (paused || layouts.length < 2) return;

    const id = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % layouts.length;
      store.set(widgetsAtom, layouts[indexRef.current]);
    }, intervalMs);

    return () => clearInterval(id);
  }, [paused, layouts, intervalMs, store]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return { pause, resume };
}
