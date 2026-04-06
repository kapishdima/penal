import type { Task } from "@/features/tasks/hooks/use-tasks";
import type { Subscription } from "@/features/subscriptions/hooks/use-subscriptions";
import type { WidgetInstance } from "@/stores/canvas";

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

// --- How It Works: Arrange step layouts ---
// Widgets rotate clockwise through 6 grid slots.
// Each layout is the same grid but with widgets shifted by 1 position,
// so every transition is a smooth neighbor-to-neighbor move.

const P = 20;
const G = 20;

const ARRANGE_WIDGETS = [
  { id: "arr-pomodoro", type: "pomodoro" },
  { id: "arr-tasks", type: "tasks" },
  { id: "arr-notes", type: "notes" },
  { id: "arr-subs", type: "subscriptions" },
  { id: "arr-money", type: "money" },
  { id: "arr-clock", type: "clock" },
] as const;

// 6 slots in clockwise order:
// [0] top-left → [1] top-center → [2] top-right
//                                        ↓
// [5] bot-left ← [4] bot-center ← [3] bot-right
function getSlots(w: number, h: number) {
  const colW = (w - P * 2 - G * 2) / 3;
  const rowH = (h - P * 2 - G) / 2;
  return [
    { x: P, y: P, width: colW, height: rowH },
    { x: P + colW + G, y: P, width: colW, height: rowH },
    { x: P + (colW + G) * 2, y: P, width: colW, height: rowH },
    { x: P + (colW + G) * 2, y: P + rowH + G, width: colW, height: rowH },
    { x: P + colW + G, y: P + rowH + G, width: colW, height: rowH },
    { x: P, y: P + rowH + G, width: colW, height: rowH },
  ];
}

function buildRotatedLayout(
  w: number,
  h: number,
  shift: number,
): WidgetInstance[] {
  const slots = getSlots(w, h);
  return ARRANGE_WIDGETS.map((widget, i) => ({
    id: widget.id,
    type: widget.type,
    ...slots[(i + shift) % slots.length],
  }));
}

export function getArrangeLayouts(w: number, h: number): WidgetInstance[][] {
  return Array.from({ length: 6 }, (_, i) => buildRotatedLayout(w, h, i));
}

// --- How It Works: Execute step layout ---

export function getExecuteWidgets(w: number, h: number): WidgetInstance[] {
  const usable = w - P * 2;
  const topH = (h - P * 2 - G) / 2;
  const botH = topH;
  const col3 = (usable - G * 2) / 3;
  return [
    { id: "exe-pomodoro", type: "pomodoro", x: P, y: P, width: col3, height: topH, locked: true },
    { id: "exe-tasks", type: "tasks", x: P + col3 + G, y: P, width: col3, height: topH, locked: true },
    { id: "exe-clock", type: "clock", x: P + (col3 + G) * 2, y: P, width: col3, height: topH, locked: true },
    { id: "exe-money", type: "money", x: P, y: P + topH + G, width: (usable - G) * 0.55, height: botH, locked: true },
    { id: "exe-notes", type: "notes", x: P + (usable - G) * 0.55 + G, y: P + topH + G, width: (usable - G) * 0.45, height: botH, locked: true },
  ];
}
