import React from 'react';
import { History, Clock } from 'lucide-react';
import { ActionLog } from '../../types/vehicle';
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
} from '@/components/ui/timeline';

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
      <Timeline>
        {actionHistory.map((item) => (
          <TimelineItem key={item.id}>
            <TimelineConnector />
            <TimelineContent>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                <TimelineHeader>
                  <TimelineTitle>{item.actionType.replace('_', ' ')}</TimelineTitle>
                  <TimelineTime className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {new Date(item.timestamp).toLocaleString()}
                  </TimelineTime>
                </TimelineHeader>
                <TimelineDescription>{item.note}</TimelineDescription>
                <div className="text-[10px] text-slate-400 mt-2 font-semibold">
                  Logged by: <span className="text-slate-600">{item.author}</span>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    )}
  </div>
);
