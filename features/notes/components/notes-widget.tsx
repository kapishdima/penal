"use client";

import { NoteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { cn } from "@/lib/utils";
import { useNotes } from "../hooks/use-notes";

function NotesWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { content, setContent } = useNotes(widgetId);
  const [isPreview, setIsPreview] = useState(false);

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
            icon={NoteIcon}
            size={16}
            className="text-muted-foreground"
          />
          <span className="text-xs font-medium text-muted-foreground">
            Notes
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          data-no-drag
          onClick={() => setIsPreview((v) => !v)}
        >
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </CardHeader>

      <CardContent className="px-0">
        <div className="flex-1 min-h-0 overflow-auto">
          {isPreview ? (
            <div className="p-3 prose prose-sm dark:prose-invert max-w-none text-sm">
              {content ? (
                <Markdown>{content}</Markdown>
              ) : (
                <p className="text-muted-foreground italic">
                  Nothing here yet...
                </p>
              )}
            </div>
          ) : (
            <textarea
              data-no-drag
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write in markdown..."
              className="w-full h-full resize-none bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground/50 font-mono"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

registerWidget({
  type: "notes",
  name: "Notes",
  icon: "📝",
  defaultSize: { width: 320, height: 280 },
  minSize: { width: 240, height: 180 },
  component: NotesWidget,
});
