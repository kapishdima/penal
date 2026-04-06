"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getWidgetList } from "@/features/canvas/widget-registry";
import { useDemoAddWidget } from "../hooks/use-demo-add-widget";

interface InlineCommandPaletteProps {
  containerWidth: number;
  containerHeight: number;
}

export function InlineCommandPalette({
  containerWidth,
  containerHeight,
}: InlineCommandPaletteProps) {
  const addWidget = useDemoAddWidget(containerWidth, containerHeight);
  const widgetList = getWidgetList();

  return (
    <div className="absolute inset-0 z-10">
      <div className="absolute inset-0 bg-black/30 supports-backdrop-filter:backdrop-blur-sm rounded-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
        <Command className="rounded-4xl border bg-popover p-0 shadow-xl ring-1 ring-foreground/5 dark:ring-foreground/10 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground">
          <CommandInput placeholder="Add a widget..." />
          <CommandList>
            <CommandEmpty>No widgets found.</CommandEmpty>
            <CommandGroup heading="Widgets">
              {widgetList.map((w) => (
                <CommandItem key={w.type} onSelect={() => addWidget(w.type)}>
                  <HugeiconsIcon icon={w.icon} size={18} strokeWidth={1.5} />
                  <span>{w.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
