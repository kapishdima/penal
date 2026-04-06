"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
}

const bookmarksAtom = atomWithStorage<Record<string, Bookmark[]>>(
  "pennal:bookmarks",
  {},
);

export function useBookmarks(widgetId: string) {
  const [all, setAll] = useAtom(bookmarksAtom);
  const bookmarks = all[widgetId] ?? [];

  const update = (updater: (prev: Bookmark[]) => Bookmark[]) => {
    setAll((prev) => ({
      ...prev,
      [widgetId]: updater(prev[widgetId] ?? []),
    }));
  };

  const addBookmark = (title: string, url: string) => {
    update((prev) => [
      ...prev,
      { id: `bm-${Date.now()}`, title, url },
    ]);
  };

  const removeBookmark = (id: string) => {
    update((prev) => prev.filter((b) => b.id !== id));
  };

  return { bookmarks, addBookmark, removeBookmark };
}
