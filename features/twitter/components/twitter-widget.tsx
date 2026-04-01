"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Comment01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { cn } from "@/lib/utils";
import { useTwitter } from "../hooks/use-twitter";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTimeline: (
          config: { sourceType: string; screenName: string },
          target: HTMLElement,
          options?: Record<string, unknown>,
        ) => Promise<HTMLElement>;
      };
    };
  }
}

function useTwitterEmbed(username: string, containerRef: React.RefObject<HTMLElement | null>) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!username || !containerRef.current) return;

    // Load Twitter widget script if not loaded
    if (!document.getElementById("twitter-wjs")) {
      const script = document.createElement("script");
      script.id = "twitter-wjs";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.head.appendChild(script);
    }

    const container = containerRef.current;
    container.innerHTML = "";

    const tryRender = () => {
      if (window.twttr?.widgets) {
        window.twttr.widgets
          .createTimeline(
            { sourceType: "profile", screenName: username },
            container,
            {
              chrome: "noheader nofooter noborders transparent",
              height: container.clientHeight || 300,
              dnt: true,
            },
          )
          .then(() => setLoaded(true))
          .catch(() => setLoaded(false));
      } else {
        setTimeout(tryRender, 500);
      }
    };

    tryRender();

    return () => {
      container.innerHTML = "";
    };
  }, [username, containerRef]);

  return loaded;
}

function TwitterWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { username, setUsername } = useTwitter(widgetId);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useTwitterEmbed(username, containerRef);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().replace("@", "");
    if (!trimmed) return;
    setUsername(trimmed);
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Comment01Icon}
            size={16}
            className="text-muted-foreground"
          />
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Twitter
          </CardTitle>
        </div>
        {username && (
          <span className="text-xs text-muted-foreground">@{username}</span>
        )}
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col min-h-0">
        {username ? (
          <div
            ref={containerRef}
            className="flex-1 min-h-0 overflow-hidden px-2"
            data-no-drag
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4" data-no-drag>
            <p className="text-xs text-muted-foreground/50 text-center italic">
              Enter a Twitter username to show their timeline
            </p>
          </div>
        )}

        {!username && (
          <form onSubmit={onSubmit} className="pt-2" data-no-drag>
            <InputGroup className="bg-input/25 pr-0">
              <InputGroupInput
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="@username"
              />
              <InputGroupAddon align="inline-end" className="pr-0">
                <InputGroupButton type="submit" variant="default" size="sm">
                  Load
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

registerWidget({
  type: "twitter",
  name: "Twitter Feed",
  icon: "🐦",
  defaultSize: { width: 320, height: 400 },
  minSize: { width: 260, height: 280 },
  component: TwitterWidget,
});
