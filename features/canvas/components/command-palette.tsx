"use client";

import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEventListener } from "@/hooks/use-event-listener";
import { useAddWidget } from "../hooks/use-add-widget";
import { getWidgetList } from "../widget-registry";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const addWidget = useAddWidget();

  useEventListener("keydown", (e) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  });

  const onSelect = (type: string) => {
    addWidget(type);
    setOpen(false);
  };

  const widgetList = getWidgetList();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Add a widget..." />
      <CommandList>
        <CommandEmpty>No widgets found.</CommandEmpty>
        <CommandGroup heading="Widgets">
          {widgetList.map((w) => (
            <CommandItem key={w.type} onSelect={() => onSelect(w.type)}>
              <span className="text-lg mr-2">{w.icon}</span>
              <span>{w.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
