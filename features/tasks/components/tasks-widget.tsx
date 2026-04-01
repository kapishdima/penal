"use client";

import { CheckListIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { type Priority, useTasks } from "../hooks/use-tasks";

const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-muted",
  medium: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  high: "bg-red-500/20 text-red-600 dark:text-red-400",
};

const PRIORITY_CYCLE: Record<Priority, Priority> = {
  low: "medium",
  medium: "high",
  high: "low",
};

function TasksWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { tasks, addTask, toggleTask, removeTask, setPriority } =
    useTasks(widgetId);
  const [input, setInput] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addTask(trimmed);
    setInput("");
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <Card
      size="sm"
      className={cn(
        "h-full border ring-0 shadow-none transition ",
        isSelected && "border-2 border-primary shadow-md",
        isPanning && "pointer-events-none opacity-50 ",
      )}
    >
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={CheckListIcon}
            size={16}
            className="text-muted-foreground"
          />
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Tasks
          </CardTitle>
        </div>
        {tasks.length > 0 && (
          <CardDescription className="text-xs text-muted-foreground">
            {doneCount}/{tasks.length}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col min-h-0 group-data-[size=sm]/card:px-2.5">
        <div className="flex-1 min-h-0 overflow-y-auto py-1" data-no-drag>
          {tasks.length === 0 && (
            <p className="text-xs text-muted-foreground/50 text-center py-4 italic">
              No tasks yet
            </p>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-muted/50 transition-colors",
                task.done && "opacity-50",
              )}
            >
              <Field orientation="horizontal" className="flex-1 min-w-0 gap-2">
                <Checkbox
                  id={task.id}
                  checked={task.done}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <Label
                  htmlFor={task.id}
                  className={cn(
                    "flex-1 text-sm truncate cursor-pointer",
                    task.done && "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </Label>
              </Field>

              <Button
                size="icon-xs"
                type="button"
                onClick={() =>
                  setPriority(task.id, PRIORITY_CYCLE[task.priority])
                }
                className={cn("uppercase tracking-wide text-xs")}
              >
                {task.priority[0]}
              </Button>

              <Button
                size="icon-xs"
                type="button"
                variant="destructive"
                onClick={() => removeTask(task.id)}
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
              </Button>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} data-no-drag>
          <InputGroup className="w-full text-sm bg-input/25">
            <InputGroupInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a task..."
              className="placeholder:text-muted-foreground/50"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="default"
                className="text-xs"
                type="submit"
                disabled={!input.trim()}
              >
                Create
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardContent>
    </Card>
  );
}

registerWidget({
  type: "tasks",
  name: "Tasks",
  icon: "✅",
  defaultSize: { width: 300, height: 340 },
  minSize: { width: 240, height: 200 },
  component: TasksWidget,
});
