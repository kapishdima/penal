"use client";

import { Comment01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
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
  useTwitterEmbed(username, containerRef);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().replace("@", "");
    if (!trimmed) return;
    setUsername(trimmed);
    setInput("");
  };

  return (
    <WidgetCard
      icon={Comment01Icon}
      title="Twitter"
      isSelected={isSelected}
      isPanning={isPanning}
      headerRight={
        username ? (
          <span className="text-xs text-muted-foreground">@{username}</span>
        ) : undefined
      }
    >
      {username ? (
        <div
          ref={containerRef}
          className="flex-1 min-h-0 overflow-hidden px-2"
          data-no-drag
        />
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center" data-no-drag>
            <WidgetEmptyState message="Enter a Twitter username to show their timeline" />
          </div>
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
        </>
      )}
    </WidgetCard>
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
