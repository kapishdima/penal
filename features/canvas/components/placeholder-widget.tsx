"use client";

import clsx from "clsx";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "../widget-registry";

function PlaceholderWidget({ widgetId, isPanning, isSelected }: ChildrenProps) {
  return (
    <Card
      className={clsx(
        "border shadow-none ring-0 h-full",
        isSelected && "border-2 border-primary",
        isPanning && "pointer-events-none opacity-50",
      )}
    >
      <CardHeader>
        <span className="text-2xl mb-2">📦</span>
        <CardTitle>Placeholder</CardTitle>
        <CardDescription>Drag to move, resize from edges</CardDescription>
      </CardHeader>
    </Card>
  );
}

registerWidget({
  type: "placeholder",
  name: "Placeholder",
  icon: "📦",
  defaultSize: { width: 280, height: 200 },
  minSize: { width: 200, height: 120 },
  component: PlaceholderWidget,
});
