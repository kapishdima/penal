"use client";

import { Delete02Icon, Link04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { cn } from "@/lib/utils";
import { useBookmarks } from "../hooks/use-bookmarks";

function getFaviconUrl(url: string) {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return null;
  }
}

function BookmarksWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks(widgetId);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    if (!trimmedTitle || !trimmedUrl) return;
    addBookmark(trimmedTitle, trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`);
    setTitle("");
    setUrl("");
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
            icon={Link04Icon}
            size={16}
            className="text-muted-foreground"
          />
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Bookmarks
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto py-1 px-2" data-no-drag>
          {bookmarks.length === 0 && (
            <p className="text-xs text-muted-foreground/50 text-center py-4 italic">
              No bookmarks yet
            </p>
          )}
          {bookmarks.map((bm) => {
            const favicon = getFaviconUrl(bm.url);
            return (
              <div
                key={bm.id}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-colors"
              >
                {favicon ? (
                  <img src={favicon} alt="" className="size-4 shrink-0 rounded-sm" />
                ) : (
                  <HugeiconsIcon icon={Link04Icon} size={14} className="shrink-0 text-muted-foreground" />
                )}
                <a
                  href={bm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm truncate hover:underline"
                >
                  {bm.title}
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeBookmark(bm.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} />
                </Button>
              </div>
            );
          })}
        </div>

        <form onSubmit={onSubmit} className="border-t px-3 py-2 flex flex-col gap-1.5" data-no-drag>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="h-7 text-sm"
          />
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            className="h-7 text-sm"
          />
          <button type="submit" hidden />
        </form>
      </CardContent>
    </Card>
  );
}

registerWidget({
  type: "bookmarks",
  name: "Bookmarks",
  icon: "🔗",
  defaultSize: { width: 280, height: 300 },
  minSize: { width: 220, height: 200 },
  component: BookmarksWidget,
});
