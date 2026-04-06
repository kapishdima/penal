"use client";

export function MobileGuard() {
  return (
    <div className="flex md:hidden fixed inset-0 z-50 items-center justify-center bg-background p-8 text-center">
      <div className="max-w-sm">
        <span className="text-4xl mb-4 block">🖥️</span>
        <h2 className="text-xl font-semibold mb-2">Desktop Only</h2>
        <p className="text-muted-foreground">
          Pennal is designed for desktop screens. Please open it on a larger
          device for the best experience.
        </p>
      </div>
    </div>
  );
}
