import React from 'react';
import { ShieldCheck } from 'lucide-react';

/** Page title row with dealership cockpit label and 90-day policy badge. */
export const DashboardHeader: React.FC = () => (
  <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
    <div>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 font-mono">
          Dealership Intelligence Cockpit
        </span>
        <span className="text-slate-300">&bull;</span>
        <span className="text-[11px] font-medium text-slate-500">Floor Plan & Aging Analytics</span>
      </div>
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
        Inventory & Valuation Management
      </h1>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs font-semibold">
        <ShieldCheck className="size-3.5 text-emerald-600" />
        <span>90d Policy Enforced</span>
      </div>
    </div>
  </div>
);
