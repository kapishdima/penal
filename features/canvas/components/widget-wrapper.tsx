"use client";

import {
  Delete02Icon,
  PinIcon,
  PinOffIcon,
  SquareLock02Icon,
  SquareUnlock02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useWidgetDrag } from "@/features/canvas/hooks/use-widget-drag";
import { cn } from "@/lib/utils";
import { widgetsAtom } from "@/stores/canvas";
import { HANDLE_CURSORS, HANDLE_POSITIONS, RESIZE_HANDLES } from "../config";
import { useRemoveWidget } from "../hooks/use-remove-widget";
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
  const setWidgets = useSetAtom(widgetsAtom);
  const widget = widgets.find((w) => w.id === widgetId);

  const { onResizeStart, onResizeMove, onResizeEnd } = useWidgetResize(
    widgetId,
    minWidth,
    minHeight,
  );

  const { onDragStart, onDragMove, onDragEnd, isSelected, isPanning } =
    useWidgetDrag(widget);
  const removeWidget = useRemoveWidget();

  const toggleLock = useCallback(() => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, locked: !w.locked } : w)),
    );
  }, [widgetId, setWidgets]);

  if (!widget) return null;

  const isLocked = widget.locked ?? false;

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={cn("absolute select-none", isLocked && "opacity-90")}
        style={{
          left: widget.x,
          top: widget.y,
          width: widget.width,
          height: widget.height,
        }}
        onPointerDown={onDragStart}
        onPointerMove={
          isLocked
            ? undefined
            : (e) => {
                onDragMove(e);
                onResizeMove(e);
              }
        }
        onPointerUp={
          isLocked
            ? undefined
            : () => {
                onDragEnd();
                onResizeEnd();
              }
        }
      >
        <div className="w-full h-full overflow-hidden rounded-xl no-scrollbar">
          {children({ widgetId, isSelected, isPanning })}
        </div>

        {isSelected && (
          <>
            <Button
              data-no-drag
              variant="destructive"
              size="icon"
              className="absolute -top-3 -right-3 z-20 bg-red-100"
              aria-label="Remove widget"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => removeWidget(widgetId)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={24} />
            </Button>

            <Button
              data-no-drag
              variant="secondary"
              size="icon"
              className="absolute -top-2.5 -left-2.5 z-20 "
              aria-label={isLocked ? "Unlock widget" : "Lock widget"}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={toggleLock}
            >
              <HugeiconsIcon
                icon={isLocked ? SquareLock02Icon : SquareUnlock02Icon}
                size={14}
              />
            </Button>
          </>
        )}

        {isSelected &&
          !isLocked &&
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
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={toggleLock}>
          <HugeiconsIcon icon={isLocked ? PinOffIcon : PinIcon} size={16} />
          {isLocked ? "Unpin" : "Pin"}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onClick={() => removeWidget(widgetId)}
        >
          <HugeiconsIcon icon={Delete02Icon} size={16} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
