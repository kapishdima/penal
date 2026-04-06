"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface Subscription {
  id: string;
  name: string;
  amount: number;
}

export const subscriptionsAtom = atomWithStorage<Record<string, Subscription[]>>(
  "pennal:subscriptions",
  {},
);

export function useSubscriptions(widgetId: string) {
  const [all, setAll] = useAtom(subscriptionsAtom);
  const subscriptions = all[widgetId] ?? [];

  const update = (updater: (prev: Subscription[]) => Subscription[]) => {
    setAll((prev) => ({
      ...prev,
      [widgetId]: updater(prev[widgetId] ?? []),
    }));
  };

  const addSubscription = (name: string, amount: number) => {
    update((prev) => [
      ...prev,
      { id: `sub-${Date.now()}`, name, amount },
    ]);
  };

  const removeSubscription = (id: string) => {
    update((prev) => prev.filter((s) => s.id !== id));
  };

  const monthlyTotal = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  return { subscriptions, monthlyTotal, addSubscription, removeSubscription };
}
