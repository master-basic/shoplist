export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

export function SkeletonText({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-4 w-full ${className}`} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 space-y-3 ${className}`}>
      <SkeletonText className="w-1/3" />
      <SkeletonText />
      <SkeletonText className="w-2/3" />
    </div>
  );
}
