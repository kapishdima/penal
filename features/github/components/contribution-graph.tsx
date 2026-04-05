import { cn } from "@/lib/utils";

export function getContributionLevel(count: number): string {
  if (count === 0) return "bg-muted";
  if (count <= 3) return "bg-green-300/60 dark:bg-green-900/60";
  if (count <= 6) return "bg-green-400/70 dark:bg-green-700/70";
  if (count <= 9) return "bg-green-500 dark:bg-green-500";
  return "bg-green-600 dark:bg-green-400";
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export function ContributionGraph({
  weeks,
}: {
  weeks: ContributionWeek[];
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
