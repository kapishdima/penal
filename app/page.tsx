"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "@/features/canvas/register-widgets";
import { Canvas } from "@/features/canvas/components/canvas";
import { CanvasToolbar } from "@/features/canvas/components/canvas-toolbar";
import { CommandPalette } from "@/features/canvas/components/command-palette";
import { MobileGuard } from "@/features/canvas/components/mobile-guard";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MobileGuard />
      <Canvas />
      <CommandPalette />
      <CanvasToolbar />
    </div>
  );
}
