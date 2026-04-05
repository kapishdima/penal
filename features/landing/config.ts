import type { Task } from "@/features/tasks/hooks/use-tasks";
import type { Subscription } from "@/features/subscriptions/hooks/use-subscriptions";

export const GITHUB_USERNAME = "kapishdima";

export const DEMO_WIDGET_IDS = {
  pomodoro: "demo-pomodoro",
  tasks: "demo-tasks",
  notes: "demo-notes",
  money: "demo-money",
  subscriptions: "demo-subscriptions",
} as const;

export const DEMO_TASKS: Task[] = [
  { id: "t1", title: "Design landing page", done: true, priority: "high" },
  { id: "t2", title: "Set up CI/CD pipeline", done: true, priority: "medium" },
  { id: "t3", title: "Write API documentation", done: false, priority: "medium" },
  { id: "t4", title: "Refactor auth module", done: false, priority: "low" },
];

export const DEMO_MONEY = {
  balance: 2450,
  transactions: [
    { id: "tx1", title: "Freelance project", amount: 3200, date: "2025-04-01" },
    { id: "tx2", title: "Rent", amount: -1200, date: "2025-04-01" },
    { id: "tx3", title: "Groceries", amount: -85, date: "2025-03-30" },
    { id: "tx4", title: "Side project sale", amount: 535, date: "2025-03-28" },
  ],
};

export const DEMO_SUBSCRIPTIONS: Subscription[] = [
  { id: "s1", name: "Netflix", amount: 15.99 },
  { id: "s2", name: "Spotify", amount: 9.99 },
  { id: "s3", name: "GitHub", amount: 4.0 },
  { id: "s4", name: "Figma", amount: 15.0 },
];

export const DEMO_NOTES = `## Sprint Goals
- Ship landing page
- Fix auth bug
- Review PRs

### Notes
Remember to update the docs before release.`;

export const DEMO_POMODORO = {
  phase: "focus" as const,
  timeLeft: 1118,
  isRunning: false,
  lastTickAt: null,
};
