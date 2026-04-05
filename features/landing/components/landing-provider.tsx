"use client";

import { Provider, createStore } from "jotai";
import { useMemo } from "react";
import { moneyAtom } from "@/features/money/hooks/use-money";
import { notesStorageAtom } from "@/features/notes/hooks/use-notes";
import { pomodoroAtom } from "@/features/pomodoro/hooks/use-pomodoro";
import { subscriptionsAtom } from "@/features/subscriptions/hooks/use-subscriptions";
import { tasksStorageAtom } from "@/features/tasks/hooks/use-tasks";
import {
  DEMO_MONEY,
  DEMO_NOTES,
  DEMO_POMODORO,
  DEMO_SUBSCRIPTIONS,
  DEMO_TASKS,
  DEMO_WIDGET_IDS,
} from "../config";

export function LandingProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => {
    const s = createStore();

    s.set(tasksStorageAtom, {
      [DEMO_WIDGET_IDS.tasks]: DEMO_TASKS,
    });

    s.set(moneyAtom, {
      [DEMO_WIDGET_IDS.money]: DEMO_MONEY,
    });

    s.set(subscriptionsAtom, {
      [DEMO_WIDGET_IDS.subscriptions]: DEMO_SUBSCRIPTIONS,
    });

    s.set(notesStorageAtom, {
      [DEMO_WIDGET_IDS.notes]: DEMO_NOTES,
    });

    s.set(pomodoroAtom, DEMO_POMODORO);

    return s;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
