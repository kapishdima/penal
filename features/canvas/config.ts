export const RESIZE_HANDLES = [
  "n",
  "s",
  "e",
  "w",
  "ne",
  "nw",
  "se",
  "sw",
] as const;

export type ResizeHandle = (typeof RESIZE_HANDLES)[number];

export const HANDLE_CURSORS: Record<ResizeHandle, string> = {
  n: "cursor-n-resize",
  s: "cursor-s-resize",
  e: "cursor-e-resize",
  w: "cursor-w-resize",
  ne: "cursor-ne-resize",
  nw: "cursor-nw-resize",
  se: "cursor-se-resize",
  sw: "cursor-sw-resize",
};

export const HANDLE_POSITIONS: Record<ResizeHandle, string> = {
  n: "top-0 left-2 right-2 h-1.5 -translate-y-1/2",
  s: "bottom-0 left-2 right-2 h-1.5 translate-y-1/2",
  e: "right-0 top-2 bottom-2 w-1.5 translate-x-1/2",
  w: "left-0 top-2 bottom-2 w-1.5 -translate-x-1/2",
  ne: "top-0 right-0 w-3 h-3 -translate-y-1/2 translate-x-1/2",
  nw: "top-0 left-0 w-3 h-3 -translate-y-1/2 -translate-x-1/2",
  se: "bottom-0 right-0 w-3 h-3 translate-y-1/2 translate-x-1/2",
  sw: "bottom-0 left-0 w-3 h-3 translate-y-1/2 -translate-x-1/2",
};
