"use client";

import Link from "next/link";
import { GridPattern } from "@/components/grid-pattern";
import { Button } from "@/components/ui/button";
import { CanvasLanding } from "./canvas-landing";

export default function Hero() {
  return (
    <main className="overflow-hidden h-screen">
      <section className="bg-background">
        <div className="relative py-24">
          <GridPattern
            variant="large"
            className="opacity-30 mask-[radial-gradient(1000px_circle_at_center,white,transparent)]"
            squares={[
              [2, 1],
              [5, 3],
              [8, 2],
              [3, 5],
              [7, 4],
              [1, 3],
              [6, 1],
              [4, 4],
              [9, 3],
              [2, 6],
              [10, 1],
              [0, 4],
              [7, 6],
              [4, 2],
              [11, 4],
              [3, 0],
              [8, 5],
              [1, 6],
              [6, 3],
              [10, 5],
            ]}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,hsl(var(--primary)/0.08),transparent_70%)]" />
          <div className="mask-radial-from-45% mask-radial-to-75% mask-radial-at-top mask-radial-[75%_100%] mask-t-from-50% lg:aspect-9/4 absolute inset-0 aspect-square lg:top-24 dark:opacity-5"></div>
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
            <div className="mx-auto max-w-md text-center">
              <h1 className="text-balance text-4xl font-medium sm:text-6xl">
                Your productivity <br />
                <span className="font-medium">one canvas</span>
              </h1>
              <p className="text-muted-foreground mt-4 text-balance">
                Build your ideal dashboard. Habits, Pomodoro, GitHub, and
                finances - perfectly arranged exactly where you want them
              </p>

              <Button
                className="mt-5 pr-1.5"
                render={<Link href="/canvas" />}
                nativeButton={false}
              >
                <span className="text-nowrap">Start building - It's free</span>
              </Button>
            </div>
            <div className="mx-auto mt-24 max-w-[971px] pl-[12px]">
              <CanvasLanding />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
