"use client";

import "@/features/canvas/register-widgets";
import { widgetRegistry } from "@/features/canvas/widget-registry";
import { DemoGitHubGraph } from "@/features/landing/components/demo-github-graph";
import { LandingProvider } from "@/features/landing/components/landing-provider";
import { DEMO_WIDGET_IDS } from "@/features/landing/config";

export function CanvasLanding() {
  const Pomodoro = widgetRegistry["pomodoro"]?.component;
  const Tasks = widgetRegistry["tasks"]?.component;
  const Notes = widgetRegistry["notes"]?.component;
  const Money = widgetRegistry["money"]?.component;
  const Subscriptions = widgetRegistry["subscriptions"]?.component;

  return (
    <LandingProvider>
      <div className="grid grid-cols-3 grid-rows-[auto_auto_auto] gap-4">
        {/* Row 1-2, Col 1 — tall */}
        <div className="row-span-2">
          {Pomodoro && (
            <Pomodoro
              widgetId={DEMO_WIDGET_IDS.pomodoro}
              isSelected={false}
              isPanning={false}
            />
          )}
        </div>

        {/* Row 1-2, Col 2 — tall */}
        <div className="row-span-2">
          {Tasks && (
            <Tasks
              widgetId={DEMO_WIDGET_IDS.tasks}
              isSelected={false}
              isPanning={false}
            />
          )}
        </div>

        {/* Row 1, Col 3 */}
        {Notes && (
          <Notes
            widgetId={DEMO_WIDGET_IDS.notes}
            isSelected={false}
            isPanning={false}
          />
        )}

        {/* Row 2, Col 3 */}
        <DemoGitHubGraph />

        {/* Row 3, Col 1-2 — wide */}
        <div className="col-span-2">
          {Money && (
            <Money
              widgetId={DEMO_WIDGET_IDS.money}
              isSelected={false}
              isPanning={false}
            />
          )}
        </div>

        {/* Row 3, Col 3 */}
        {Subscriptions && (
          <Subscriptions
            widgetId={DEMO_WIDGET_IDS.subscriptions}
            isSelected={false}
            isPanning={false}
          />
        )}
      </div>
    </LandingProvider>
  );
}
