"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WidgetCardProps {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  title: string;
  isSelected: boolean;
  isPanning: boolean;
  headerRight?: React.ReactNode;
  headerBottom?: React.ReactNode;
  borderBottom?: boolean;
  children: React.ReactNode;
}

export function WidgetCard({
  icon,
  title,
  isSelected,
  isPanning,
  headerRight,
  headerBottom,
  borderBottom = false,
  children,
}: WidgetCardProps) {
  return (
    <Card
      size="sm"
      className={cn(
        "h-full border ring-0 shadow-none transition",
        isSelected && "border-2 border-primary shadow-md",
        isPanning && "pointer-events-none opacity-50",
      )}
    >
      <CardHeader
        className={cn("flex flex-col gap-1", borderBottom && "border-b")}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={icon}
              size={16}
              className="text-muted-foreground"
            />
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </div>
          {headerRight}
        </div>
        {headerBottom}
      </CardHeader>

      <CardContent className="px-0 flex-1 flex flex-col min-h-0">
        {children}
      </CardContent>
    </Card>
  );
}

export function WidgetEmptyState({ message }: { message: string }) {
  return (
    <p className="text-xs text-muted-foreground/50 text-center py-6 italic">
      {message}
    </p>
  );
}
