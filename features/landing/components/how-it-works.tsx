"use client";

import { StepArrange } from "@/features/landing/components/step-arrange";
import { StepExecute } from "@/features/landing/components/step-execute";
import { StepSelect } from "@/features/landing/components/step-select";

export function HowItWorks() {
  return (
    <div className="bg-background mx-auto w-[71vw] px-6">
      <h1 className="text-balance text-4xl font-medium ">
        Everything you need.
        <br />
        Nothing you don't
      </h1>
      <p className="text-muted-foreground mt-4 text-balance">
        Mix and match widgets to build a workflow that actually fits your brain
      </p>

      <div className="flex flex-col gap-y-10 mt-10 w-full">
        <Item
          index={1}
          title="Select"
          description="Choose the trackers and integrations that fit your day. Leave the rest behind"
        >
          <StepSelect />
        </Item>
        <Item
          index={2}
          title="Arrange"
          description="Drag, drop, and resize. Build a layout that feels natural to you"
        >
          <StepArrange />
        </Item>
        <Item
          index={3}
          title="Execute"
          description="Everything you need is on one screen. Hit start on your timer and dive in"
        >
          <StepExecute />
        </Item>
      </div>
    </div>
  );
}

function Item({
  title,
  description,
  index,
  children,
}: {
  title: string;
  description: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-x-4 w-full">
      <div className="size-8 border-border border rounded-full flex items-center justify-center font-body">
        {index}
      </div>
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-medium">{title}</h2>
        <p className="text-muted-foreground text-balance">{description}</p>
        <div className="w-full h-[500px] mt-4">{children}</div>
      </div>
    </div>
  );
}
