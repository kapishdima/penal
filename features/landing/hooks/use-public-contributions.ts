"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContributionWeek } from "@/features/github/components/contribution-graph";

interface PublicContributionsData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export function usePublicContributions(username: string) {
  const [data, setData] = useState<PublicContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/public-contributions/${username}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to fetch");
        return;
      }

      setData(json);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, loading, error };
}
