"use client";

import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import { canvasOffsetAtom, widgetsAtom } from "@/stores/canvas";
import { getWidgetList } from "../widget-registry";

export function useAddWidget() {
  const [, setWidgets] = useAtom(widgetsAtom);
  const offset = useAtomValue(canvasOffsetAtom);

  const addWidget = useCallback(
    (type: string) => {
      const definition = getWidgetList().find((w) => w.type === type);
      if (!definition) return;

      const viewportCenterX = window.innerWidth / 2 - offset.x;
      const viewportCenterY = window.innerHeight / 2 - offset.y;

      const newWidget = {
        id: `${type}-${Date.now()}`,
        type,
        x: viewportCenterX - definition.defaultSize.width / 2,
        y: viewportCenterY - definition.defaultSize.height / 2,
        width: definition.defaultSize.width,
        height: definition.defaultSize.height,
      };

      setWidgets((prev) => [...prev, newWidget]);
    },
    [offset, setWidgets],
  );

  return addWidget;
}
