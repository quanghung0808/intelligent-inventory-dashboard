import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/** Placeholder skeleton shown while the inventory data is loading. */
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-28 rounded-xl bg-white border border-slate-200 shadow-2xs" />
      ))}
    </div>
    <Skeleton className="h-14 rounded-xl bg-white border border-slate-200 shadow-2xs" />
    <Skeleton className="h-100 rounded-xl bg-white border border-slate-200 shadow-2xs" />
  </div>
);
