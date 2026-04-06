"use client";

import "@/features/canvas/register-widgets";
import { Provider } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { widgetsAtom } from "@/stores/canvas";
import { getArrangeLayouts } from "../config";
import { useArrangeAnimation } from "../hooks/use-arrange-animation";
import { useDemoStore } from "../hooks/use-demo-store";
import { DemoCanvas } from "./demo-canvas";

export function StepArrange() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layouts = useMemo(
    () => (size.w > 0 ? getArrangeLayouts(size.w, size.h) : null),
    [size.w, size.h],
  );

  const store = useDemoStore(layouts?.[0] ?? []);

  // Update widgets when container resizes
  useEffect(() => {
    if (layouts) store.set(widgetsAtom, layouts[0]);
  }, [layouts, store]);

  useArrangeAnimation(store, layouts ?? []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {size.w > 0 && (
        <Provider store={store}>
          <DemoCanvas animated />
        </Provider>
      )}
    </div>
  );
}
