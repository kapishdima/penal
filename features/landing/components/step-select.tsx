"use client";

import "@/features/canvas/register-widgets";
import { Provider } from "jotai";
import { DemoCanvas } from "./demo-canvas";
import { InlineCommandPalette } from "./inline-command-palette";
import { useDemoStore } from "../hooks/use-demo-store";

const CONTAINER_WIDTH = 920;
const CONTAINER_HEIGHT = 500;

export function StepSelect() {
  const store = useDemoStore([]);

  return (
    <Provider store={store}>
      <div className="relative w-full h-full">
        <DemoCanvas />
        <InlineCommandPalette
          containerWidth={CONTAINER_WIDTH}
          containerHeight={CONTAINER_HEIGHT}
        />
      </div>
    </Provider>
  );
}
