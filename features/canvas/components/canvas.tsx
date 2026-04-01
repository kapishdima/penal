"use client";

import { useAtomValue } from "jotai";
import { useEventListener } from "@/hooks/use-event-listener";
import { isInputFocused } from "@/lib/event";
import { cn } from "@/lib/utils";
import {
  canvasOffsetAtom,
  canvasScaleAtom,
  isPanningAtom,
  selectedWidgetIdAtom,
  widgetsAtom,
} from "@/stores/canvas";
import { useCanvasDeselect } from "../hooks/use-canvas-deselect";
import { useCanvasPanning } from "../hooks/use-canvas-panning";
import { useRemoveWidget } from "../hooks/use-remove-widget";
import { useSpacePanning } from "../hooks/use-space-panning";
import { useWheelNavigation } from "../hooks/use-wheel-navigation";
import { widgetRegistry } from "../widget-registry";
import { CanvasGrid } from "./canvas-grid";
import { WidgetWrapper } from "./widget-wrapper";

export function Canvas() {
  const offset = useAtomValue(canvasOffsetAtom);
  const scale = useAtomValue(canvasScaleAtom);
  const widgets = useAtomValue(widgetsAtom);
  const isPanning = useAtomValue(isPanningAtom);

  const selectedId = useAtomValue(selectedWidgetIdAtom);
  const removeWidget = useRemoveWidget();

  const { handlers } = useCanvasPanning();
  const onCanvasPointerDown = useCanvasDeselect();
  useSpacePanning();
  useWheelNavigation();

  useEventListener("keydown", (e) => {
    if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !isInputFocused()) {
      e.preventDefault();
      removeWidget(selectedId);
    }
  });

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
