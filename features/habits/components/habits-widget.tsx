"use client";

import { Delete02Icon, Target02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type SubmitEvent, useState } from "react";
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
import { useHabits } from "../hooks/use-habits";

function HabitsWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { habits, addHabit, toggleToday, removeHabit } = useHabits(widgetId);
  const [input, setInput] = useState("");

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addHabit(trimmed);
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
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Target02Icon}
            size={16}
            className="text-muted-foreground"
          />
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Habits
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto py-1 px-2" data-no-drag>
          {habits.length === 0 && (
            <p className="text-xs text-muted-foreground/50 text-center py-4 italic">
              Track your habits
            </p>
          )}
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="group flex items-center gap-2 rounded-full px-2 hover:bg-muted/50 transition-colors"
            >
              <Field orientation="horizontal" className="flex-1 min-w-0 gap-2">
                <Checkbox
                  id={habit.id}
                  checked={habit.isDoneToday}
                  onCheckedChange={() => toggleToday(habit.id)}
                />
                <Label
                  htmlFor={habit.id}
                  className={cn(
                    "flex-1 text-sm truncate cursor-pointer",
                    habit.isDoneToday && "text-muted-foreground",
                  )}
                >
                  {habit.title}
                </Label>
              </Field>

              {habit.streak > 0 && (
                <span className="text-xs font-medium text-primary tabular-nums">
                  {habit.streak}d
                </span>
              )}

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => removeHabit(habit.id)}
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
              placeholder="Add habit..."
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

registerWidget({
  type: "habits",
  name: "Habits Tracker",
  icon: "🎯",
  defaultSize: { width: 280, height: 300 },
  minSize: { width: 220, height: 200 },
  component: HabitsWidget,
});
