import React from 'react';
import { HelpCircle } from 'lucide-react';

/** Displayed when no vehicles match the active filters. */
export const InventoryEmptyState: React.FC = () => (
  <div className="glass-panel rounded-xl p-12 text-center shadow-2xs bg-white">
    <div className="mx-auto size-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mb-3 shadow-inner">
      <HelpCircle className="size-6 text-indigo-600" />
    </div>
    <h3 className="text-base font-bold text-slate-900 tracking-tight">No matching inventory units</h3>
    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
      No vehicles match the current filter or search criteria. Try clearing search or switching
      powertrain/make filters.
    </p>
  </div>
);
