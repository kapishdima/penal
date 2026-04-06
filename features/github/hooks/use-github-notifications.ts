"use client";

import { useCallback, useEffect, useState } from "react";

export interface GitHubNotification {
  id: string;
  unread: boolean;
  reason: string;
  updatedAt: string;
  title: string;
  type: string;
  subjectUrl: string | null;
  repo: string;
  repoUrl: string;
}

interface NotificationsData {
  notifications: GitHubNotification[];
  connected: boolean;
}

export function useGitHubNotifications(participating = false) {
  const [data, setData] = useState<NotificationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/github/notifications?participating=${participating}`,
      );
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to fetch");
        if (json.connected === false || res.status === 401) {
          setData({ notifications: [], connected: false });
        }
        return;
      }

      setData(json);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [participating]);

  const markAsRead = useCallback(
    async (threadId: string) => {
      try {
        await fetch("/api/github/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ threadId }),
        });
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            notifications: prev.notifications.map((n) =>
              n.id === threadId ? { ...n, unread: false } : n,
            ),
          };
        });
      } catch {}
    },
    [],
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { data, loading, error, refetch: fetchNotifications, markAsRead };
}
