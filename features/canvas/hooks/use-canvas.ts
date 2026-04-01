import { useRef } from "react";

export const useCanvas = () => {
  const position = useRef({ x: 0, y: 0 });

  const move = (x: number, y: number) => {
    position.current = { x, y };
  };

  return {
    move,
    position,
  };
};
