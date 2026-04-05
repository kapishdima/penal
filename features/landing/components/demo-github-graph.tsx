"use client";

import { GithubIcon } from "@hugeicons/core-free-icons";
import { WidgetCard } from "@/features/canvas/components/widget-card";
import { ContributionGraph } from "@/features/github/components/contribution-graph";
import { usePublicContributions } from "../hooks/use-public-contributions";
import { GITHUB_USERNAME } from "../config";

export function DemoGitHubGraph() {
  const { data, loading, error } = usePublicContributions(GITHUB_USERNAME);

  return (
    <WidgetCard
      icon={GithubIcon}
      title="GitHub"
      isSelected={false}
      isPanning={false}
      headerRight={
        data && data.totalContributions > 0 ? (
          <span className="text-xs font-medium tabular-nums">
            {data.totalContributions.toLocaleString()} contributions
          </span>
        ) : undefined
      }
    >
      <div className="flex-1 flex items-center justify-center">
        {loading && (
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading...
          </p>
        )}

        {!loading && error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        {!loading && data && data.weeks.length > 0 && (
          <div className="overflow-hidden px-3">
            <ContributionGraph weeks={data.weeks} />
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
