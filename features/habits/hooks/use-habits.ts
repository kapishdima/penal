"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface Habit {
  id: string;
  title: string;
  completedDates: string[];
}

const habitsAtom = atomWithStorage<Record<string, Habit[]>>(
  "pennal:habits",
  {},
);

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  const today = getTodayDate();
  let streak = 0;
  let checkDate = today;

  for (const date of sorted) {
    if (date === checkDate) {
      streak++;
      const prev = new Date(checkDate);
      prev.setDate(prev.getDate() - 1);
      checkDate = prev.toISOString().slice(0, 10);
    } else if (date < checkDate) {
      break;
    }
  }

  return streak;
}

export function useHabits(widgetId: string) {
  const [all, setAll] = useAtom(habitsAtom);
  const habits = all[widgetId] ?? [];
  const today = getTodayDate();

  const update = (updater: (prev: Habit[]) => Habit[]) => {
    setAll((prev) => ({
      ...prev,
      [widgetId]: updater(prev[widgetId] ?? []),
    }));
  };

  const addHabit = (title: string) => {
    update((prev) => [
      ...prev,
      { id: `hab-${Date.now()}`, title, completedDates: [] },
    ]);
  };

  const toggleToday = (habitId: string) => {
    update((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const done = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: done
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        };
      }),
    );
  };

  const removeHabit = (habitId: string) => {
    update((prev) => prev.filter((h) => h.id !== habitId));
  };

  const habitsWithStreaks = habits.map((h) => ({
    ...h,
    streak: getStreak(h.completedDates),
    isDoneToday: h.completedDates.includes(today),
  }));

  return { habits: habitsWithStreaks, addHabit, toggleToday, removeHabit };
}
