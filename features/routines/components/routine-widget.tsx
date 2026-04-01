"use client";

import {
  Delete02Icon,
  Moon02Icon,
  NoteAddIcon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { cn } from "@/lib/utils";
import { useRoutine } from "../hooks/use-routine";

function RoutineWidget({
  widgetId,
  isSelected,
  isPanning,
  title,
  icon,
}: ChildrenProps & { title: string; icon: typeof Sun03Icon }) {
  const { items, doneCount, progress, addItem, toggleItem, removeItem } =
    useRoutine(widgetId);
  const [input, setInput] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addItem(trimmed);
    setInput("");
  };

  return (
    <Card
      size="sm"
      className={cn(
        "h-full border ring-0 shadow-none transition",
        isSelected && "border-2 border-primary shadow-md",
        isPanning && "pointer-events-none opacity-50",
      )}
    >
      <CardHeader className="border-b flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={icon}
              size={16}
              className="text-muted-foreground"
            />
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </div>
          {items.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {doneCount}/{items.length}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto py-1" data-no-drag>
          {items.length === 0 && (
            <div className="flex flex-col flex-1 h-full justify-center items-center text-muted-foreground/50 ">
              <HugeiconsIcon
                icon={NoteAddIcon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
              <p className="text-md text-center py-2 font-medium">
                Add routine items
              </p>
            </div>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-muted/50 transition-colors",
                item.done && "opacity-50",
              )}
            >
              <Field orientation="horizontal" className="flex-1 min-w-0 gap-2">
                <Checkbox
                  id={item.id}
                  checked={item.done}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <Label
                  htmlFor={item.id}
                  className={cn(
                    "flex-1 text-sm truncate cursor-pointer",
                    item.done && "line-through text-muted-foreground",
                  )}
                >
                  {item.title}
                </Label>
              </Field>

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
              </Button>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="pt-2" data-no-drag>
          <InputGroup className="bg-input/25 pr-0">
            <InputGroupInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add item..."
            />
            <InputGroupAddon align="inline-end" className="pr-0">
              <InputGroupButton type="submit" variant="default" size="sm">
                Add
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardContent>
    </Card>
  );
}

function MorningRoutineWidget(props: ChildrenProps) {
  return <RoutineWidget {...props} title="Morning Routine" icon={Sun03Icon} />;
}

function RestRoutineWidget(props: ChildrenProps) {
  return <RoutineWidget {...props} title="Rest Routine" icon={Moon02Icon} />;
}

registerWidget({
  type: "morning-routine",
  name: "Morning Routine",
  icon: "🌅",
  defaultSize: { width: 280, height: 320 },
  minSize: { width: 220, height: 200 },
  component: MorningRoutineWidget,
});

registerWidget({
  type: "rest-routine",
  name: "Rest Routine",
  icon: "🌙",
  defaultSize: { width: 280, height: 320 },
  minSize: { width: 220, height: 200 },
  component: RestRoutineWidget,
});
