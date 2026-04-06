"use client";

import { Edit02Icon, MusicNote03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  WidgetCard,
  WidgetEmptyState,
} from "@/features/canvas/components/widget-card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { getSpotifyEmbedUrl, useSpotify } from "../hooks/use-spotify";

function SpotifyWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { url, setUrl } = useSpotify(widgetId);
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(false);
  const embedUrl = url ? getSpotifyEmbedUrl(url) : null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const embed = getSpotifyEmbedUrl(trimmed);
    if (embed) {
      setUrl(trimmed);
      setInput("");
      setEditing(false);
    }
  };

  return (
    <WidgetCard
      icon={MusicNote03Icon}
      title="Spotify"
      isSelected={isSelected}
      isPanning={isPanning}
      headerRight={
        embedUrl && !editing ? (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Change Spotify link"
            onClick={() => { setEditing(true); setInput(url); }}
            data-no-drag
          >
            <HugeiconsIcon icon={Edit02Icon} size={14} className="text-muted-foreground" />
          </Button>
        ) : undefined
      }
    >
      {embedUrl && !editing ? (
        <div className="flex-1 min-h-0 px-2" data-no-drag>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
            title="Spotify player"
          />
        </div>
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center" data-no-drag>
            <WidgetEmptyState
              message={editing ? "Change Spotify link" : "Paste a Spotify link to embed a track or playlist"}
            />
          </div>
          <form onSubmit={onSubmit} className="pt-2" data-no-drag>
            <InputGroup className="bg-input/25 pr-0">
              <InputGroupInput
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://open.spotify.com/..."
              />
              <InputGroupAddon align="inline-end" className="pr-0">
                <InputGroupButton type="submit" variant="default" size="sm">
                  {editing ? "Save" : "Embed"}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </>
      )}
    </WidgetCard>
  );
}

registerWidget({
  type: "spotify",
  name: "Spotify",
  icon: MusicNote03Icon,
  defaultSize: { width: 300, height: 380 },
  minSize: { width: 260, height: 100 },
  component: SpotifyWidget,
});
