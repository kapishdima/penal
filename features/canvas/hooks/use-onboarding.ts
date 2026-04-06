"use client";

import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { widgetsAtom } from "@/stores/canvas";

const onboardingDismissedAtom = atomWithStorage(
  "penal:onboarding-dismissed",
  false,
);

export function useOnboarding() {
  const widgets = useAtomValue(widgetsAtom);
  const dismissed = useAtomValue(onboardingDismissedAtom);

  const visible = widgets.length === 0 && !dismissed;

  return { visible };
}
