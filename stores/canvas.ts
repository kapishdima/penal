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

export const canvasOffsetAtom = atomWithStorage("pennal:canvas-offset", {
  x: 0,
  y: 0,
});

export const widgetsAtom = atomWithStorage<WidgetInstance[]>(
  "pennal:widgets",
  [],
);

export const snapEnabledAtom = atomWithStorage("pennal:snap-enabled", true);

export const gridSizeAtom = atomWithStorage("pennal:grid-size", 20);

export const canvasScaleAtom = atomWithStorage("pennal:canvas-scale", 1);

export const isPanningAtom = atom(false);

export const selectedWidgetIdAtom = atom<string | null>(null);
