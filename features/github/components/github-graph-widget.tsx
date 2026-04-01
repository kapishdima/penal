"use client";

import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/features/canvas/components/widget-card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useGitHubContributions } from "../hooks/use-github-contributions";

function getContributionLevel(count: number): string {
  if (count === 0) return "bg-muted";
  if (count <= 3) return "bg-green-300/60 dark:bg-green-900/60";
  if (count <= 6) return "bg-green-400/70 dark:bg-green-700/70";
  if (count <= 9) return "bg-green-500 dark:bg-green-500";
  return "bg-green-600 dark:bg-green-400";
}

function ContributionGraph({
  weeks,
}: {
  weeks: { contributionDays: { contributionCount: number; date: string; color: string }[] }[];
}) {
  const visibleWeeks = weeks.slice(-20);

  return (
    <div className="flex gap-[3px]" role="img" aria-label="GitHub contribution graph">
      {visibleWeeks.map((week, wi) => (
        <div key={week.contributionDays[0]?.date ?? wi} className="flex flex-col gap-[3px]">
          {week.contributionDays.map((day) => (
            <div
              key={day.date}
              className={cn("size-[10px] rounded-[2px]", getContributionLevel(day.contributionCount))}
              title={`${day.date}: ${day.contributionCount} contributions`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

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
  icon: "🐙",
  defaultSize: { width: 340, height: 180 },
  minSize: { width: 280, height: 140 },
  component: GitHubGraphWidget,
});
