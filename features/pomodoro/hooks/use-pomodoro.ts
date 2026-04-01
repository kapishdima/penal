"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback, useEffect, useRef } from "react";

export type PomodoroPhase = "focus" | "short-break" | "long-break";

const PHASE_DURATIONS: Record<PomodoroPhase, number> = {
  focus: 25 * 60,
  "short-break": 1 * 60,
  "long-break": 15 * 60,
};

const PHASE_LABELS: Record<PomodoroPhase, string> = {
  focus: "Focus",
  "short-break": "Short Break",
  "long-break": "Long Break",
};

interface PomodoroState {
  phase: PomodoroPhase;
  timeLeft: number;
  isRunning: boolean;
  lastTickAt: number | null;
}

const pomodoroAtom = atomWithStorage<PomodoroState>("penal:pomodoro", {
  phase: "focus",
  timeLeft: PHASE_DURATIONS.focus,
  isRunning: false,
  lastTickAt: null,
});

export function usePomodoro() {
  const [state, setState] = useAtom(pomodoroAtom);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restoredRef = useRef(false);

  // On mount: if timer was running, subtract elapsed time
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    if (state.isRunning && state.lastTickAt) {
      const elapsed = Math.floor((Date.now() - state.lastTickAt) / 1000);
      const newTimeLeft = Math.max(0, state.timeLeft - elapsed);
      setState((prev) => ({
        ...prev,
        timeLeft: newTimeLeft,
        isRunning: newTimeLeft > 0,
        lastTickAt: newTimeLeft > 0 ? Date.now() : null,
      }));
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      lastTickAt: Date.now(),
    }));
  }, [setState]);

  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      isRunning: false,
      lastTickAt: null,
    }));
  }, [clearTimer, setState]);

  const switchPhase = useCallback(
    (newPhase: PomodoroPhase) => {
      clearTimer();
      setState({
        phase: newPhase,
        timeLeft: PHASE_DURATIONS[newPhase],
        isRunning: false,
        lastTickAt: null,
      });
    },
    [clearTimer, setState],
  );

  const reset = useCallback(() => {
    clearTimer();
    setState((prev) => ({
      ...prev,
      timeLeft: PHASE_DURATIONS[prev.phase],
      isRunning: false,
      lastTickAt: null,
    }));
  }, [clearTimer, setState]);

  // Tick interval
  useEffect(() => {
    if (!state.isRunning) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          return { ...prev, timeLeft: 0, isRunning: false, lastTickAt: null };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1, lastTickAt: Date.now() };
      });
    }, 1000);

    return clearTimer;
  }, [state.isRunning, clearTimer, setState]);

  const totalTime = PHASE_DURATIONS[state.phase];
  const progress = 1 - state.timeLeft / totalTime;
  const label = PHASE_LABELS[state.phase];
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    phase: state.phase,
    display,
    progress,
    label,
    isRunning: state.isRunning,
    isComplete: state.timeLeft === 0,
    start,
    pause,
    reset,
    switchPhase,
  };
}
