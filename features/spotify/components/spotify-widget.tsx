"use client";

import { Edit02Icon, MusicNote03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { cn } from "@/lib/utils";
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
            icon={MusicNote03Icon}
            size={16}
            className="text-muted-foreground"
          />
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Spotify
          </CardTitle>
        </div>
        {embedUrl && !editing && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => { setEditing(true); setInput(url); }}
            data-no-drag
          >
            <HugeiconsIcon icon={Edit02Icon} size={14} className="text-muted-foreground" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col min-h-0">
        {embedUrl && !editing ? (
          <div className="flex-1 min-h-0 px-2" data-no-drag>
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
              title="Spotify"
            />
          </div>
        ) : (
          <>
            <div
              className="flex-1 flex flex-col items-center justify-center gap-3 px-4"
              data-no-drag
            >
              <p className="text-xs text-muted-foreground/50 text-center italic">
                {editing ? "Change Spotify link" : "Paste a Spotify link to embed a track or playlist"}
              </p>
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
      </CardContent>
    </Card>
  );
}

registerWidget({
  type: "spotify",
  name: "Spotify",
  icon: "🎵",
  defaultSize: { width: 300, height: 380 },
  minSize: { width: 260, height: 100 },
  component: SpotifyWidget,
});
