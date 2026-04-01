"use client";

import { Delete02Icon, RepeatIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  WidgetCard,
  WidgetEmptyState,
} from "@/features/canvas/components/widget-card";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { getFaviconUrl, getServiceInfo } from "../config";
import { useSubscriptions } from "../hooks/use-subscriptions";

function ServiceIcon({ name }: { name: string }) {
  const info = getServiceInfo(name);

  if (info) {
    return (
      // biome-ignore lint/performance/noImgElement: favicon from external service
      <img
        src={getFaviconUrl(info.domain)}
        alt={name}
        className="size-5 shrink-0 rounded"
      />
    );
  }

  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="size-5 shrink-0 rounded-full bg-muted flex items-center justify-center">
      <span className="text-sm font-bold text-muted-foreground">{initial}</span>
    </div>
  );
}

function SubscriptionsWidget({
  widgetId,
  isSelected,
  isPanning,
}: ChildrenProps) {
  const { subscriptions, monthlyTotal, addSubscription, removeSubscription } =
    useSubscriptions(widgetId);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedAmount = Number.parseFloat(amount);
    if (!trimmedName || Number.isNaN(parsedAmount) || parsedAmount <= 0) return;
    addSubscription(trimmedName, parsedAmount);
    setName("");
    setAmount("");
  };

  const yearlyTotal = monthlyTotal * 12;

  return (
    <WidgetCard
      icon={RepeatIcon}
      title="Subscriptions"
      isSelected={isSelected}
      isPanning={isPanning}
      headerBottom={
        <>
          <span className="text-3xl font-extrabold font-heading tracking-tight">
            ${monthlyTotal.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              /mo
            </span>
          </span>
          {subscriptions.length > 0 && (
            <span className="text-xs font-medium text-muted-foreground">
              ${yearlyTotal.toFixed(2)}/yr
            </span>
          )}
        </>
      }
    >
      <div className="flex-1 min-h-0 overflow-y-auto" data-no-drag>
        {subscriptions.length === 0 && (
          <WidgetEmptyState message="No subscriptions yet" />
        )}
        {subscriptions.length > 0 && (
          <div className="rounded-lg border bg-muted/30">
            {subscriptions.map((sub, i) => (
              <div key={sub.id}>
                {i > 0 && <Separator />}
                <div className="group flex items-center gap-2.5 px-3 py-2">
                  <ServiceIcon name={sub.name} />
                  <span className="flex-1 text-sm truncate">{sub.name}</span>
                  <span className="text-sm font-medium tabular-nums">
                    ${sub.amount.toFixed(2)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Remove subscription"
                    onClick={() => removeSubscription(sub.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 pt-2" data-no-drag>
        <Input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="9.99"
          className="w-16 text-sm text-center bg-input/25"
        />
        <InputGroup className="flex-1 bg-input/25 pr-0">
          <InputGroupInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <InputGroupAddon align="inline-end" className="pr-0">
            <InputGroupButton type="submit" variant="default" size="sm">
              Add
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </WidgetCard>
  );
}

registerWidget({
  type: "subscriptions",
  name: "Subscriptions",
  icon: "💳",
  defaultSize: { width: 300, height: 360 },
  minSize: { width: 240, height: 240 },
  component: SubscriptionsWidget,
});
