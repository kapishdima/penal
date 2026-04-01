"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const twitterAtom = atomWithStorage<Record<string, string>>(
  "penal:twitter",
  {},
);

export function useTwitter(widgetId: string) {
  const [all, setAll] = useAtom(twitterAtom);
  const username = all[widgetId] ?? "";

  const setUsername = (value: string) => {
    setAll((prev) => ({ ...prev, [widgetId]: value }));
  };

  return { username, setUsername };
}
