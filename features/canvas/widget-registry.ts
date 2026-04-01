import type { ComponentType } from "react";

export interface WidgetDefinition {
  type: string;
  name: string;
  icon: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  component: ComponentType<{
    widgetId: string;
    isSelected: boolean;
    isPanning: boolean;
  }>;
}

export const widgetRegistry: Record<string, WidgetDefinition> = {};

export function registerWidget(definition: WidgetDefinition) {
  widgetRegistry[definition.type] = definition;
}

export function getWidgetList(): WidgetDefinition[] {
  return Object.values(widgetRegistry);
}
