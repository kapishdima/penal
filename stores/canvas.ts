"use client";

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface WidgetInstance {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  locked?: boolean;
}

export const canvasOffsetAtom = atomWithStorage("penal:canvas-offset", {
  x: 0,
  y: 0,
});

export const widgetsAtom = atomWithStorage<WidgetInstance[]>(
  "penal:widgets",
  [],
);

export const snapEnabledAtom = atomWithStorage("penal:snap-enabled", true);

export const gridSizeAtom = atomWithStorage("penal:grid-size", 20);

export const canvasScaleAtom = atomWithStorage("penal:canvas-scale", 1);

export const isPanningAtom = atom(false);

export const selectedWidgetIdAtom = atom<string | null>(null);
