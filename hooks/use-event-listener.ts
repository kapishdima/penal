"use client";

import { useEffect, useEffectEvent } from "react";

export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
) {
  const stableHandler = useEffectEvent(handler);

  useEffect(() => {
    window.addEventListener(event, stableHandler);
    return () => window.removeEventListener(event, stableHandler);
  }, [event, stableHandler]);
}
