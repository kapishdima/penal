"use client";

import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { selectedWidgetIdAtom, widgetsAtom } from "@/stores/canvas";

export function useRemoveWidget() {
  const setWidgets = useSetAtom(widgetsAtom);
  const setSelectedId = useSetAtom(selectedWidgetIdAtom);

  const removeWidget = useCallback(
    (widgetId: string) => {
      setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
      setSelectedId(null);
    },
    [setWidgets, setSelectedId],
  );

  return removeWidget;
}
