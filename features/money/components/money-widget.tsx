"use client";

import { CreditCardIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import type { ChildrenProps } from "@/features/canvas/components/widget-wrapper";
import { registerWidget } from "@/features/canvas/widget-registry";
import { cn } from "@/lib/utils";
import { useMoney } from "../hooks/use-money";

function formatCurrency(amount: number) {
  return `$${Math.abs(amount).toFixed(2)}`;
}

function MoneyWidget({ widgetId, isSelected, isPanning }: ChildrenProps) {
  const { balance, transactions, addTransaction, removeTransaction } =
    useMoney(widgetId);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const parsedAmount = Number.parseFloat(amount);
    if (!trimmedTitle || Number.isNaN(parsedAmount)) return;
    addTransaction(trimmedTitle, parsedAmount);
    setTitle("");
    setAmount("");
  };

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + t.amount, 0);

  return (
    <Card
      size="sm"
      className={cn(
        "h-full border ring-0 shadow-none transition",
        isSelected && "border-2 border-primary shadow-md",
        isPanning && "pointer-events-none opacity-50",
      )}
    >
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={CreditCardIcon}
            size={16}
            className="text-muted-foreground"
          />
          <CardTitle className="text-xs font-medium text-muted-foreground ">
            Balance
          </CardTitle>
        </div>
        <span
          className={cn("text-3xl font-extrabold font-heading tracking-tight")}
        >
          {balance < 0 && "-"}${Math.abs(balance).toFixed(2)}
        </span>
        {transactions.length > 0 && (
          <div className="flex gap-3 mt-1">
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              +{formatCurrency(income)}
            </span>
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              -{formatCurrency(Math.abs(expenses))}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col min-h-0 ">
        <div className="flex-1 min-h-0 overflow-y-auto" data-no-drag>
          {transactions.length === 0 && (
            <p className="text-xs text-muted-foreground/50 text-center py-6 italic">
              No transactions yet
            </p>
          )}
          {transactions.length > 0 && (
            <div className="rounded-lg border bg-muted/30">
              {transactions.slice(0, 20).map((tx, i) => (
                <div key={tx.id}>
                  {i > 0 && <Separator />}
                  <div className="group flex items-center justify-between px-3 py-2">
                    <span className="text-sm text-muted-foreground truncate flex-1">
                      {tx.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium  tabular-nums",
                          tx.amount >= 0
                            ? "text-foreground"
                            : "text-foreground",
                        )}
                      >
                        {tx.amount < 0 && "-"}${Math.abs(tx.amount).toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                      </Button>
                    </div>
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
            placeholder="-50"
            className="w-16 text-sm text-center bg-input/25"
          />
          <InputGroup className="flex-1 bg-input/25 pr-0">
            <InputGroupInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <InputGroupAddon align="inline-end" className="pr-0">
              <InputGroupButton type="submit" variant="default" size="sm">
                Add record
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardContent>
    </Card>
  );
}

registerWidget({
  type: "money",
  name: "Money Balance",
  icon: "💰",
  defaultSize: { width: 300, height: 360 },
  minSize: { width: 240, height: 240 },
  component: MoneyWidget,
});
