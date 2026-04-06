"use client";

import { createStore } from "jotai";
import { useMemo } from "react";
import { moneyAtom } from "@/features/money/hooks/use-money";
import { notesStorageAtom } from "@/features/notes/hooks/use-notes";
import { pomodoroAtom } from "@/features/pomodoro/hooks/use-pomodoro";
import { subscriptionsAtom } from "@/features/subscriptions/hooks/use-subscriptions";
import { tasksStorageAtom } from "@/features/tasks/hooks/use-tasks";
import {
  type WidgetInstance,
  canvasOffsetAtom,
  canvasScaleAtom,
  widgetsAtom,
} from "@/stores/canvas";
import {
  DEMO_MONEY,
  DEMO_NOTES,
  DEMO_POMODORO,
  DEMO_SUBSCRIPTIONS,
  DEMO_TASKS,
  DEMO_WIDGET_IDS,
} from "../config";

export function useDemoStore(initialWidgets: WidgetInstance[]) {
  return useMemo(() => {
    const store = createStore();

    store.set(widgetsAtom, initialWidgets);
    store.set(canvasOffsetAtom, { x: 0, y: 0 });
    store.set(canvasScaleAtom, 1);

    store.set(tasksStorageAtom, {
      [DEMO_WIDGET_IDS.tasks]: DEMO_TASKS,
      "arr-tasks": DEMO_TASKS,
      "exe-tasks": DEMO_TASKS,
    });
    store.set(moneyAtom, {
      [DEMO_WIDGET_IDS.money]: DEMO_MONEY,
      "arr-money": DEMO_MONEY,
      "exe-money": DEMO_MONEY,
    });
    store.set(subscriptionsAtom, {
      [DEMO_WIDGET_IDS.subscriptions]: DEMO_SUBSCRIPTIONS,
      "arr-subs": DEMO_SUBSCRIPTIONS,
    });
    store.set(notesStorageAtom, {
      [DEMO_WIDGET_IDS.notes]: DEMO_NOTES,
      "arr-notes": DEMO_NOTES,
      "exe-notes": DEMO_NOTES,
    });
    store.set(pomodoroAtom, DEMO_POMODORO);

    return store;
  }, [initialWidgets]);
}
