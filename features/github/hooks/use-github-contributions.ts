"use client";

import { useCallback, useEffect, useState } from "react";

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionsData {
  totalContributions: number;
  weeks: ContributionWeek[];
  connected: boolean;
}

export function useGitHubContributions() {
  const [data, setData] = useState<ContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/github/contributions");
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to fetch");
        if (json.connected === false) {
          setData({ totalContributions: 0, weeks: [], connected: false });
        }
        return;
      }

      setData(json);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}
