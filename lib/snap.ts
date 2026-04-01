export function snapValue(value: number, gridSize: number, snap: boolean) {
  if (!snap) return value;
  return Math.round(value / gridSize) * gridSize;
}
