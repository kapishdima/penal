"use client";

import { Delete02Icon, Link04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
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

function BookmarkIcon({ url }: { url: string }) {
  const favicon = getFaviconUrl(url);

  if (favicon) {
    return (
      // biome-ignore lint/performance/noImgElement: favicon from external service
      <img src={favicon} alt="" className="size-5 shrink-0 rounded" />
    );
  }

  return (
    <div className="size-5 shrink-0 rounded bg-muted flex items-center justify-center">
      <HugeiconsIcon icon={Link04Icon} size={12} className="text-muted-foreground" />
    </div>
  );
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
    addBookmark(
      trimmedTitle,
      trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`,
    );
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
      <CardHeader className="flex flex-row items-center justify-between">
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
        {bookmarks.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {bookmarks.length}
          </span>
        )}
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto" data-no-drag>
          {bookmarks.length === 0 && (
            <p className="text-xs text-muted-foreground/50 text-center py-6 italic">
              No bookmarks yet
            </p>
          )}
          {bookmarks.length > 0 && (
            <div className="rounded-lg border bg-muted/30">
              {bookmarks.map((bm, i) => (
                <div key={bm.id}>
                  {i > 0 && <Separator />}
                  <div className="group flex items-center gap-2.5 px-3 py-2">
                    <BookmarkIcon url={bm.url} />
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
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-1.5 pt-2" data-no-drag>
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="text-sm bg-input/25"
          />
          <InputGroup className="bg-input/25 pr-0">
            <InputGroupInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
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
  type: "bookmarks",
  name: "Bookmarks",
  icon: "🔗",
  defaultSize: { width: 300, height: 320 },
  minSize: { width: 240, height: 220 },
  component: BookmarksWidget,
});
