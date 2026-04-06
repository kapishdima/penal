"use client";

import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
}

export const tasksStorageAtom = atomWithStorage<Record<string, Task[]>>(
  "pennal:tasks",
  {},
);

export function useTasks(widgetId: string) {
  const [allTasks, setAllTasks] = useAtom(tasksStorageAtom);
  const tasks = allTasks[widgetId] ?? [];

  const updateTasks = (updater: (prev: Task[]) => Task[]) => {
    setAllTasks((prev) => ({
      ...prev,
      [widgetId]: updater(prev[widgetId] ?? []),
    }));
  };

  const addTask = (title: string) => {
    updateTasks((prev) => [
      ...prev,
      { id: `task-${Date.now()}`, title, done: false, priority: "medium" },
    ]);
  };

  const toggleTask = (taskId: string) => {
    updateTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
    );
  };

  const removeTask = (taskId: string) => {
    updateTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const setPriority = (taskId: string, priority: Priority) => {
    updateTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, priority } : t)),
    );
  };

  return { tasks, addTask, toggleTask, removeTask, setPriority };
}
