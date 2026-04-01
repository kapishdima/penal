"use client";

import { useEffect, useEffectEvent } from "react";

export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
) {
  const stableHandler = useEffectEvent(handler);

  useEffect(() => {
    window.addEventListener(event, stableHandler, options);
    return () => window.removeEventListener(event, stableHandler, options);
  }, [event, stableHandler, options]);
}
