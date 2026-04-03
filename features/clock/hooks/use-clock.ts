"use client";

import { useEffect, useState } from "react";

export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const timeWithSeconds = `${time}:${String(seconds).padStart(2, "0")}`;

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return { now, time, timeWithSeconds, date, hours, minutes, seconds };
}
