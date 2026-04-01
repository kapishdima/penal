"use client";

import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { canvasOffsetAtom, isPanningAtom, widgetsAtom } from "@/stores/canvas";
import { useCanvasDeselect } from "../hooks/use-canvas-deselect";
import { useCanvasPanning } from "../hooks/use-canvas-panning";
import { useSpacePanning } from "../hooks/use-space-panning";
import { widgetRegistry } from "../widget-registry";
import { CanvasGrid } from "./canvas-grid";
import { WidgetWrapper } from "./widget-wrapper";

export function Canvas() {
  const offset = useAtomValue(canvasOffsetAtom);
  const widgets = useAtomValue(widgetsAtom);
  const isPanning = useAtomValue(isPanningAtom);

  const { handlers } = useCanvasPanning();
  const onCanvasPointerDown = useCanvasDeselect();
  useSpacePanning();

  return (
    /* biome-ignore lint/a11y/noStaticElementInteractions: canvas surface requires pointer events for panning */
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-background",
        isPanning && "cursor-grabbing",
      )}
      onPointerDown={(e) => {
        handlers.onPointerDown(e);
        onCanvasPointerDown(e);
      }}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <CanvasGrid />

      <div
        data-canvas-surface
        className="absolute inset-0"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
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
