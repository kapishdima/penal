"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface RoutineItem {
  id: string;
  title: string;
  done: boolean;
}

interface RoutineState {
  items: RoutineItem[];
  lastResetDate: string;
}

const routinesAtom = atomWithStorage<Record<string, RoutineState>>(
  "penal:routines",
  {},
);

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function useRoutine(widgetId: string) {
  const [all, setAll] = useAtom(routinesAtom);
  const state = all[widgetId] ?? { items: [], lastResetDate: getTodayDate() };

  // Auto-reset if day changed
  const today = getTodayDate();
  if (state.lastResetDate !== today && state.items.some((i) => i.done)) {
    const resetState = {
      items: state.items.map((i) => ({ ...i, done: false })),
      lastResetDate: today,
    };
    setAll((prev) => ({ ...prev, [widgetId]: resetState }));
    return buildReturn(resetState);
  }

  function buildReturn(s: RoutineState) {
    const items = s.items;
    const doneCount = items.filter((i) => i.done).length;
    const progress = items.length > 0 ? doneCount / items.length : 0;

    const update = (updater: (prev: RoutineItem[]) => RoutineItem[]) => {
      setAll((prev) => {
        const current = prev[widgetId] ?? { items: [], lastResetDate: today };
        return {
          ...prev,
          [widgetId]: { ...current, items: updater(current.items) },
        };
      });
    };

    const addItem = (title: string) => {
      update((prev) => [
        ...prev,
        { id: `ri-${Date.now()}`, title, done: false },
      ]);
    };

    const toggleItem = (id: string) => {
      update((prev) =>
        prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
      );
    };

    const removeItem = (id: string) => {
      update((prev) => prev.filter((i) => i.id !== id));
    };

    return { items, doneCount, progress, addItem, toggleItem, removeItem };
  }

  return buildReturn(state);
}
