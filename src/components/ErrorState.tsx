import React from 'react';
import {
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ServerCrash,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resetMockStorage, setSimulateErrorMode } from '@/api/storage';

interface ErrorStateProps {
  error?: Error | null;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(false);
  const [isRetrying, setIsRetrying] = React.useState(false);

  const rawErrorMessage = error instanceof Error
    ? error.message
    : 'Unknown network connection failure';

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  const handleResetSandbox = () => {
    setSimulateErrorMode(false);
    resetMockStorage();
    window.location.reload();
  };


  return (
    <div className="max-w-xl mx-auto my-10 px-4">
      <div className="glass-panel rounded-2xl bg-white border border-rose-200/90 shadow-xl overflow-hidden relative text-center p-6 sm:p-8">
        {/* Accent Top Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600" />

        {/* Icon & Status Badge */}
        <div className="size-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4 text-rose-600 shadow-inner">
          <ServerCrash className="size-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100/70 border border-rose-200 text-rose-800 text-[11px] font-bold uppercase tracking-wider font-mono mb-3">
          <ShieldAlert className="size-3" />
          <span>DMS Feed Synchronization Failure</span>
        </div>

        {/* Heading & Executive Description */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Unable to Load Inventory Records
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The dashboard was unable to fetch the real-time vehicle valuation feed. This may be caused by simulated server downtime, network timeout, or service maintenance.
        </p>

        {/* Recovery Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-6">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className={`size-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Reconnecting...' : 'Retry Connection'}</span>
          </Button>

          <Button
            onClick={handleResetSandbox}
            variant="outline"
            className="w-full sm:w-auto h-9 px-4 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="size-3.5 text-slate-500" />
            <span>Reset Demo Sandbox</span>
          </Button>
        </div>

        {/* Technical Diagnostics Toggle */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails((prev) => !prev)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{showTechnicalDetails ? 'Hide' : 'Show'} Technical Diagnostics</span>
            {showTechnicalDetails ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>

          {showTechnicalDetails && (
            <div className="mt-3 p-3 rounded-xl bg-slate-900 text-slate-200 text-left text-xs font-mono overflow-x-auto shadow-inner border border-slate-800">
              <div className="text-[10px] uppercase text-rose-400 font-bold mb-1 tracking-wider">
                Error Trace Payload:
              </div>
              <p className="text-rose-200/90 whitespace-pre-wrap break-all leading-snug">
                {rawErrorMessage}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Timestamp: {new Date().toISOString()}</span>
                <span>Endpoint: /api/vehicles</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
