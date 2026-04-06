"use client";

import "@/features/canvas/register-widgets";
import { Provider } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { widgetsAtom } from "@/stores/canvas";
import { getExecuteWidgets } from "../config";
import { useDemoStore } from "../hooks/use-demo-store";
import { DemoCanvas } from "./demo-canvas";

export function StepExecute() {
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

  const widgets = useMemo(
    () => (size.w > 0 ? getExecuteWidgets(size.w, size.h) : []),
    [size.w, size.h],
  );

  const store = useDemoStore(widgets);

  useEffect(() => {
    if (widgets.length > 0) store.set(widgetsAtom, widgets);
  }, [widgets, store]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {size.w > 0 && (
        <Provider store={store}>
          <DemoCanvas />
        </Provider>
      )}
    </div>
  );
}
