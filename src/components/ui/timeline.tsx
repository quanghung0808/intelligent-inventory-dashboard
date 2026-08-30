import * as React from 'react';
import { cn } from '@/lib/utils';

const Timeline = React.forwardRef<HTMLOListElement, React.ComponentProps<'ol'>>(
  ({ className, ...props }, ref) => (
    <ol ref={ref} className={cn('flex flex-col', className)} {...props} />
  )
);
Timeline.displayName = 'Timeline';

const TimelineItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('relative flex gap-4 pb-4 last:pb-0', className)} {...props} />
  )
);
TimelineItem.displayName = 'TimelineItem';

const TimelineConnector = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col items-center', className)} {...props}>
      <div className="size-3 shrink-0 rounded-full border-2 border-primary bg-background mt-0.5" />
      <div className="w-px flex-1 bg-border mt-1" />
    </div>
  )
);
TimelineConnector.displayName = 'TimelineConnector';

const TimelineContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 pb-1', className)} {...props} />
  )
);
TimelineContent.displayName = 'TimelineContent';

const TimelineHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between gap-2 mb-1', className)} {...props} />
  )
);
TimelineHeader.displayName = 'TimelineHeader';

const TimelineTitle = React.forwardRef<HTMLParagraphElement, React.ComponentProps<'p'>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs font-bold text-primary font-mono', className)} {...props} />
  )
);
TimelineTitle.displayName = 'TimelineTitle';

const TimelineTime = React.forwardRef<HTMLSpanElement, React.ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('text-[11px] text-muted-foreground font-mono font-medium', className)} {...props} />
  )
);
TimelineTime.displayName = 'TimelineTime';

const TimelineDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<'p'>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-foreground leading-relaxed font-medium', className)} {...props} />
  )
);
TimelineDescription.displayName = 'TimelineDescription';

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
};
