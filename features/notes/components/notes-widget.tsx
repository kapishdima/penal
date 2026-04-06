"use client";

import { NoteIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  WidgetCard,
  WidgetEmptyState,
} from "@/features/canvas/components/widget-card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { useNotes } from "../hooks/use-notes";

function NotesWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { content, setContent } = useNotes(widgetId);
  const [isPreview, setIsPreview] = useState(false);

  return (
    <WidgetCard
      icon={NoteIcon}
      title="Notes"
      isSelected={isSelected}
      isPanning={isPanning}
      borderBottom
      headerRight={
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          data-no-drag
          onClick={() => setIsPreview((v) => !v)}
        >
          {isPreview ? "Edit" : "Preview"}
        </Button>
      }
    >
      <div className="flex-1 min-h-0 overflow-hidden">
        {isPreview ? (
          <div className="p-3 prose prose-sm dark:prose-invert max-w-none text-sm">
            {content ? (
              <Markdown>{content}</Markdown>
            ) : (
              <WidgetEmptyState message="Nothing here yet..." />
            )}
          </div>
        ) : (
          <textarea
            data-no-drag
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write in markdown..."
            className="w-full h-full resize-none bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground/50 font-mono overflow-hidden"
          />
        )}
      </div>
    </WidgetCard>
  );
}

registerWidget({
  type: "notes",
  name: "Notes",
  icon: NoteIcon,
  defaultSize: { width: 320, height: 280 },
  minSize: { width: 240, height: 180 },
  component: NotesWidget,
});
