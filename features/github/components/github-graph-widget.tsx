"use client";

import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/features/canvas/components/widget-card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { authClient } from "@/lib/auth-client";
import { useGitHubContributions } from "../hooks/use-github-contributions";
import { ContributionGraph } from "./contribution-graph";

function ConnectGitHub() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <p className="text-xs text-muted-foreground text-center">
        Connect GitHub to see your contribution graph
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
          })
        }
      >
        <HugeiconsIcon icon={GithubIcon} size={16} />
        Connect GitHub
      </Button>
    </div>
  );
}

function GitHubGraphWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { data, loading, error } = useGitHubContributions();

  return (
    <WidgetCard
      icon={GithubIcon}
      title="GitHub"
      isSelected={isSelected}
      isPanning={isPanning}
      headerRight={
        data?.connected && data.totalContributions > 0 ? (
          <span className="text-xs font-medium tabular-nums">
            {data.totalContributions.toLocaleString()} contributions
          </span>
        ) : undefined
      }
    >
      <div className="flex-1 flex items-center justify-center" data-no-drag>
        {loading && (
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading...
          </p>
        )}

        {!loading && data?.connected === false && <ConnectGitHub />}

        {!loading && error && data?.connected !== false && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        {!loading && data?.connected && data.weeks.length > 0 && (
          <div className="overflow-hidden px-3">
            <ContributionGraph weeks={data.weeks} />
          </div>
        )}
      </div>
    </WidgetCard>
  );
}

registerWidget({
  type: "github-graph",
  name: "GitHub Contributions",
  icon: GithubIcon,
  defaultSize: { width: 340, height: 180 },
  minSize: { width: 280, height: 140 },
  component: GitHubGraphWidget,
});
