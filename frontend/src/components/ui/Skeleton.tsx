import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded bg-bg-tertiary', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="p-3 rounded-lg border border-border bg-bg-primary">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function ColumnSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 bg-bg-secondary rounded-lg p-3">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-2">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 p-6 overflow-x-auto">
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
    </div>
  );
}

