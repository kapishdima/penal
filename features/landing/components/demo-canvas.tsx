"use client";

import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import {
  canvasOffsetAtom,
  canvasScaleAtom,
  widgetsAtom,
} from "@/stores/canvas";
import { WidgetWrapper } from "@/features/canvas/components/widget-wrapper";
import { widgetRegistry } from "@/features/canvas/widget-registry";

interface DemoCanvasProps {
  className?: string;
  animated?: boolean;
}

export function DemoCanvas({ className, animated }: DemoCanvasProps) {
  const offset = useAtomValue(canvasOffsetAtom);
  const scale = useAtomValue(canvasScaleAtom);
  const widgets = useAtomValue(widgetsAtom);

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-background rounded-xl border",
        className,
      )}
    >
      <div
        data-canvas-surface
        className={cn(
          "absolute inset-0",
          animated &&
            "[&>div]:transition-all [&>div]:duration-700 [&>div]:ease-in-out",
        )}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {widgets.map((widget) => {
          const definition = widgetRegistry[widget.type];
          if (!definition) return null;
          const Component = definition.component;

          return (
            <WidgetWrapper
              key={widget.id}
              widgetId={widget.id}
              minWidth={definition.minSize.width}
              minHeight={definition.minSize.height}
            >
              {({ isSelected, isPanning }) => (
                <Component
                  widgetId={widget.id}
                  isSelected={isSelected}
                  isPanning={isPanning}
                />
              )}
            </WidgetWrapper>
          );
        })}
      </div>
    </div>
  );
}
