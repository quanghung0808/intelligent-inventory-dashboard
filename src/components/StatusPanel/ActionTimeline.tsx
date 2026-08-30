import React from 'react';
import { History, Clock } from 'lucide-react';
import { ActionLog } from '../../types/vehicle';

interface ActionTimelineProps {
  actionHistory: ActionLog[];
}

/** Chronological audit trail of logged manager actions for a vehicle. */
export const ActionTimeline: React.FC<ActionTimelineProps> = ({ actionHistory }) => (
  <div className="pt-5 border-t border-slate-200">
    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-3.5">
      <History className="size-4 text-indigo-600" />
      Action History Audit Trail ({actionHistory.length})
    </div>

    {actionHistory.length === 0 ? (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 italic font-medium">
        No past actions or manager notes logged for this vehicle yet.
      </div>
    ) : (
      <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {actionHistory.map((item) => (
          <div key={item.id} className="relative pl-8">
            <div className="absolute left-2 top-2 size-3.5 -translate-x-1/2 rounded-full bg-white border-2 border-indigo-600 shadow-xs" />
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-indigo-700 font-mono">
                  {item.actionType.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono font-medium">
                  <Clock className="size-3" />
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.note}</p>
              <div className="text-[10px] text-slate-400 mt-2 font-semibold">
                Logged by: <span className="text-slate-600">{item.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
