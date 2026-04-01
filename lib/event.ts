export const isMiddleMouseButton = (e: React.PointerEvent) => e.button === 1;
export const isSpacebar = (e: KeyboardEvent) => e.code === "Space";
export const isInputFocused = () => {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    (el as HTMLElement).isContentEditable
  );
};
