"use client";

import { useAtomValue } from "jotai";
import { useWidgetDrag } from "@/features/canvas/hooks/use-widget-drag";
import { cn } from "@/lib/utils";
import { widgetsAtom } from "@/stores/canvas";
import { HANDLE_CURSORS, HANDLE_POSITIONS, RESIZE_HANDLES } from "../config";
import { useWidgetResize } from "../hooks/use-widget-resize";

export type ChildrenProps = {
  widgetId: string;
  isSelected: boolean;
  isPanning: boolean;
};

type ChildrenFunction = (props: ChildrenProps) => React.ReactNode;

interface WidgetWrapperProps {
  widgetId: string;
  children: ChildrenFunction;
  minWidth?: number;
  minHeight?: number;
}

export function WidgetWrapper({
  widgetId,
  children,
  minWidth = 200,
  minHeight = 120,
}: WidgetWrapperProps) {
  const widgets = useAtomValue(widgetsAtom);
  const widget = widgets.find((w) => w.id === widgetId);

  const { onResizeStart, onResizeMove, onResizeEnd } = useWidgetResize(
    widgetId,
    minWidth,
    minHeight,
  );

  const { onDragStart, onDragMove, onDragEnd, isSelected, isPanning } =
    useWidgetDrag(widget);

  if (!widget) return null;

  return (
    <div
      className={cn("absolute select-none")}
      style={{
        left: widget.x,
        top: widget.y,
        width: widget.width,
        height: widget.height,
      }}
      onPointerDown={onDragStart}
      onPointerMove={(e) => {
        onDragMove(e);
        onResizeMove(e);
      }}
      onPointerUp={() => {
        onDragEnd();
        onResizeEnd();
      }}
    >
      <div className="w-full h-full overflow-hidden rounded-xl no-scrollbar">
        {children({ widgetId, isSelected, isPanning })}
      </div>

      {isSelected &&
        RESIZE_HANDLES.map((handle) => (
          <div
            key={handle}
            data-resize-handle
            className={cn(
              "absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity",
              HANDLE_POSITIONS[handle],
              HANDLE_CURSORS[handle],
            )}
            onPointerDown={(e) => onResizeStart(handle, e)}
          />
        ))}
    </div>
  );
}
