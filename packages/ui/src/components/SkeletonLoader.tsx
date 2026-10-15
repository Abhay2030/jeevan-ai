import * as React from "react";

export interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`skeleton animate-pulse rounded bg-ink-200/50 dark:bg-ink-800/60 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`card-elevated p-5 rounded-xl border border-surface-border bg-surface-card space-y-3 ${className}`}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
      <div className="pt-2 border-t border-surface-border flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full rounded-xl border border-surface-border bg-surface-card overflow-hidden p-4 space-y-3">
      <div className="flex gap-4 border-b border-surface-border pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2 border-b border-surface-border/50 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
