"use client";

import {
  CheckmarkCircle02Icon,
  GithubIcon,
  GitPullRequestIcon,
  Notification03Icon,
  TextIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  WidgetCard,
  WidgetEmptyState,
} from "@/features/canvas/components/widget-card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  type GitHubNotification,
  useGitHubNotifications,
} from "../hooks/use-github-notifications";

const TYPE_ICONS: Record<string, typeof GitPullRequestIcon> = {
  PullRequest: GitPullRequestIcon,
  Issue: TextIcon,
  CheckSuite: CheckmarkCircle02Icon,
};

const REASON_LABELS: Record<string, string> = {
  assign: "Assigned",
  author: "Author",
  comment: "Comment",
  mention: "Mentioned",
  review_requested: "Review",
  state_change: "Changed",
  subscribed: "Watching",
  ci_activity: "CI",
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000,
  );
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: GitHubNotification;
  onMarkRead: (id: string) => void;
}) {
  const TypeIcon = TYPE_ICONS[notification.type] ?? Notification03Icon;
  const reasonLabel = REASON_LABELS[notification.reason] ?? notification.reason;

  const webUrl = notification.subjectUrl
    ? notification.subjectUrl
        .replace("api.github.com/repos", "github.com")
        .replace("/pulls/", "/pull/")
    : notification.repoUrl;

  return (
    <a
      href={webUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-start gap-2.5 px-3 py-2.5 transition-colors duration-100 hover:bg-muted/50",
        notification.unread && "border-l-2 border-l-primary",
      )}
      onClick={() => {
        if (notification.unread) onMarkRead(notification.id);
      }}
    >
      <HugeiconsIcon
        icon={TypeIcon}
        size={15}
        className={cn(
          "mt-0.5 shrink-0",
          notification.unread ? "text-foreground" : "text-muted-foreground/60",
        )}
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm leading-snug line-clamp-2",
            notification.unread ? "font-medium" : "text-muted-foreground",
          )}
        >
          {notification.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs text-muted-foreground/60">
            {reasonLabel}
          </span>
          <span className="text-xs text-muted-foreground/40">&middot;</span>
          <span className="text-xs text-muted-foreground/60 tabular-nums">
            {timeAgo(notification.updatedAt)}
          </span>
        </div>
      </div>
    </a>
  );
}

function NotificationSkeleton() {
  return (
    <div className="px-3 py-3 flex items-start gap-2.5 animate-pulse">
      <div className="size-4 rounded bg-muted mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-muted rounded w-4/5" />
        <div className="h-3 bg-muted rounded w-2/5" />
      </div>
    </div>
  );
}

function ConnectGitHub() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <p className="text-xs text-muted-foreground text-center">
        Connect GitHub to see notifications
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

function GitHubNotificationsWidget({
  widgetId,
  isSelected,
  isPanning,
}: ChildrenProps) {
  const [participating, setParticipating] = useState(false);
  const { data, loading, error, refetch, markAsRead } =
    useGitHubNotifications(participating);

  const unreadCount =
    data?.notifications?.filter((n) => n.unread).length ?? 0;

  // Group notifications by repo
  const grouped = data?.notifications?.reduce(
    (acc, n) => {
      if (!acc[n.repo]) acc[n.repo] = [];
      acc[n.repo].push(n);
      return acc;
    },
    {} as Record<string, GitHubNotification[]>,
  );

  return (
    <WidgetCard
      icon={Notification03Icon}
      title="Notifications"
      isSelected={isSelected}
      isPanning={isPanning}
      borderBottom
      headerRight={
        data?.connected ? (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-primary tabular-nums">
                {unreadCount}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Refresh notifications"
              onClick={() => refetch()}
              data-no-drag
            >
              <HugeiconsIcon
                icon={Notification03Icon}
                size={14}
                className="text-muted-foreground"
              />
            </Button>
          </div>
        ) : undefined
      }
    >
      {data?.connected && (
        <div className="flex gap-1 px-3 py-1.5" data-no-drag>
          <Button
            size="xs"
            variant={!participating ? "default" : "secondary"}
            onClick={() => setParticipating(false)}
          >
            All
          </Button>
          <Button
            size="xs"
            variant={participating ? "default" : "secondary"}
            onClick={() => setParticipating(true)}
          >
            Participating
          </Button>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto" data-no-drag>
        {loading && (
          <div className="space-y-0">
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        )}

        {!loading && data?.connected === false && <ConnectGitHub />}

        {!loading && error && data?.connected !== false && (
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {!loading &&
          data?.connected &&
          data.notifications.length === 0 && (
            <WidgetEmptyState message="All caught up!" />
          )}

        {!loading && grouped && Object.keys(grouped).length > 0 && (
          <div className="space-y-1 px-2 pb-1">
            {Object.entries(grouped).map(([repo, notifications]) => (
              <div key={repo}>
                <p className="text-[11px] font-medium text-muted-foreground/60 px-1 pt-2 pb-1 truncate">
                  {repo}
                </p>
                <div className="rounded-lg border bg-muted/20 overflow-hidden">
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onMarkRead={markAsRead}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetCard>
  );
}

registerWidget({
  type: "github-notifications",
  name: "GitHub Notifications",
  icon: "🔔",
  defaultSize: { width: 340, height: 400 },
  minSize: { width: 280, height: 240 },
  component: GitHubNotificationsWidget,
});
