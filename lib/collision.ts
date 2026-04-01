import type { WidgetInstance } from "@/stores/canvas";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Push overlapping widgets away from a resized widget.
 * Only pushes in the direction of the resize handle.
 * Locked widgets are never moved.
 */
export function pushOverlappingWidgets(
  widgets: WidgetInstance[],
  resizedId: string,
  handle: string,
): WidgetInstance[] {
  const resized = widgets.find((w) => w.id === resizedId);
  if (!resized) return widgets;

  const gap = 8;

  return widgets.map((w) => {
    if (w.id === resizedId || w.locked) return w;
    if (!rectsOverlap(resized, w)) return w;

    let newX = w.x;
    let newY = w.y;

    // Push in the direction of the resize handle
    if (handle.includes("e")) {
      // Resizing right — push widgets that are to the right
      if (w.x + w.width > resized.x && w.x < resized.x + resized.width) {
        newX = resized.x + resized.width + gap;
      }
    }
    if (handle.includes("w")) {
      // Resizing left — push widgets that are to the left
      if (w.x < resized.x + resized.width && w.x + w.width > resized.x) {
        newX = resized.x - w.width - gap;
      }
    }
    if (handle.includes("s")) {
      // Resizing down — push widgets that are below
      if (w.y + w.height > resized.y && w.y < resized.y + resized.height) {
        newY = resized.y + resized.height + gap;
      }
    }
    if (handle.includes("n")) {
      // Resizing up — push widgets that are above
      if (w.y < resized.y + resized.height && w.y + w.height > resized.y) {
        newY = resized.y - w.height - gap;
      }
    }

    if (newX === w.x && newY === w.y) return w;
    return { ...w, x: newX, y: newY };
  });
}
