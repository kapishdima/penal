"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const spotifyAtom = atomWithStorage<Record<string, string>>(
  "penal:spotify",
  {},
);

export function useSpotify(widgetId: string) {
  const [all, setAll] = useAtom(spotifyAtom);
  const url = all[widgetId] ?? "";

  const setUrl = (value: string) => {
    setAll((prev) => ({ ...prev, [widgetId]: value }));
  };

  return { url, setUrl };
}

export function getSpotifyEmbedUrl(url: string): string | null {
  // Convert open.spotify.com URLs to embed URLs
  // https://open.spotify.com/track/xxx -> https://open.spotify.com/embed/track/xxx
  // https://open.spotify.com/playlist/xxx -> https://open.spotify.com/embed/playlist/xxx
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("spotify.com")) return null;
    const path = parsed.pathname;
    if (path.startsWith("/embed/")) return url;
    return `https://open.spotify.com/embed${path}?utm_source=generator&theme=0`;
  } catch {
    return null;
  }
}
