"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { widgetsAtom } from "@/stores/canvas";
import { getWidgetList } from "@/features/canvas/widget-registry";

export function useDemoAddWidget(
  containerWidth: number,
  containerHeight: number,
) {
  const [widgets, setWidgets] = useAtom(widgetsAtom);

  return useCallback(
    (type: string) => {
      const definition = getWidgetList().find((w) => w.type === type);
      if (!definition) return;

      const cascade = widgets.length * 30;
      const x = Math.min(
        containerWidth / 2 - definition.defaultSize.width / 2 + cascade,
        containerWidth - definition.defaultSize.width - 20,
      );
      const y = Math.min(
        containerHeight / 2 - definition.defaultSize.height / 2 + cascade,
        containerHeight - definition.defaultSize.height - 20,
      );

      setWidgets((prev) => [
        ...prev,
        {
          id: `${type}-${Date.now()}`,
          type,
          x: Math.max(20, x),
          y: Math.max(20, y),
          width: definition.defaultSize.width,
          height: definition.defaultSize.height,
        },
      ]);
    },
    [widgets.length, containerWidth, containerHeight, setWidgets],
  );
}
