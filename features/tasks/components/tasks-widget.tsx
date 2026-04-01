"use client";

import { CheckListIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  WidgetCard,
  WidgetEmptyState,
} from "@/features/canvas/components/widget-card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { cn } from "@/lib/utils";
import { type Priority, useTasks } from "../hooks/use-tasks";

const PRIORITY_CYCLE: Record<Priority, Priority> = {
  low: "medium",
  medium: "high",
  high: "low",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low priority",
  medium: "Medium priority",
  high: "High priority",
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
    <WidgetCard
      icon={CheckListIcon}
      title="Tasks"
      isSelected={isSelected}
      isPanning={isPanning}
      borderBottom
      headerRight={
        tasks.length > 0 ? (
          <span className="text-xs text-muted-foreground tabular-nums">
            {doneCount}/{tasks.length}
          </span>
        ) : undefined
      }
    >
      <div className="flex-1 min-h-0 overflow-y-auto py-1" data-no-drag>
        {tasks.length === 0 && (
          <WidgetEmptyState message="No tasks yet" />
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
              aria-label={PRIORITY_LABELS[task.priority]}
              onClick={() =>
                setPriority(task.id, PRIORITY_CYCLE[task.priority])
              }
              className="uppercase tracking-wide text-xs"
            >
              {task.priority[0]}
            </Button>

            <Button
              size="icon-xs"
              type="button"
              variant="destructive"
              aria-label="Remove task"
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
          />
          <InputGroupAddon align="inline-end" className="pr-0">
            <InputGroupButton
              variant="default"
              type="submit"
              size="sm"
              disabled={!input.trim()}
            >
              Create
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </WidgetCard>
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
