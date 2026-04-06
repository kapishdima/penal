"use client";

import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

export const notesStorageAtom = atomWithStorage<Record<string, string>>(
  "pennal:notes",
  {},
);

export function useNotes(widgetId: string) {
  const [allNotes, setAllNotes] = useAtom(notesStorageAtom);
  const content = allNotes[widgetId] ?? "";

  const setContent = (value: string) => {
    setAllNotes((prev) => ({ ...prev, [widgetId]: value }));
  };

  return { content, setContent };
}
