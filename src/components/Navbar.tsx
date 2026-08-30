import React, { useState, useEffect } from 'react';
import {
  Car,
  RotateCcw,
  Bug,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getSimulateErrorMode,
  setSimulateErrorMode,
  resetMockStorage,
} from '../api/storage';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const queryClient = useQueryClient();
  const [errorMode, setErrorMode] = useState(getSimulateErrorMode());
  const [resetToast, setResetToast] = useState(false);

  useEffect(() => {
    setErrorMode(getSimulateErrorMode());
  }, []);

  const handleToggleErrorMode = () => {
    const next = !errorMode;
    setErrorMode(next);
    setSimulateErrorMode(next);
  };

  const handleResetData = () => {
    resetMockStorage();
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
        {/* Brand & Dealership Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-7 sm:size-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-xs shrink-0">
            <Car className="size-3.5 sm:size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 truncate">
                Keyloop Apex
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden xs:inline">Live</span> Sync
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 font-medium truncate">
              <Building2 className="size-2.5 text-slate-400 shrink-0" />
              <span className="truncate">Apex Motors #001</span>
            </p>
          </div>
        </div>

        {/* Demo Controls - Visually Separated & Mobile Adaptive */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-slate-200 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono hidden md:inline">
            Sandbox:
          </span>
          {/* Error Simulation Toggle */}
          <Button
            onClick={handleToggleErrorMode}
            type="button"
            size="sm"
            variant={errorMode ? 'destructive' : 'outline'}
            className={cn(
              'text-[10px] sm:text-[11px] font-semibold h-7 px-2 sm:px-2.5 rounded-md transition-all cursor-pointer',
              errorMode ? 'ring-1 ring-rose-300' : ''
            )}
            title="Toggle 500 error simulation to demonstrate optimistic update rollback"
          >
            <Bug
              data-icon="inline-start"
              className={cn('size-3 shrink-0', errorMode ? 'text-rose-600 animate-pulse' : 'text-slate-400')}
            />
            <span className="hidden sm:inline">{errorMode ? 'Simulating 500' : 'Simulate 500'}</span>
            <span className="sm:hidden">{errorMode ? '500 ON' : '500'}</span>
          </Button>

          {/* Reset Mock Data */}
          <Button
            onClick={handleResetData}
            type="button"
            size="sm"
            variant="outline"
            className="text-[10px] sm:text-[11px] font-semibold h-7 px-2 sm:px-2.5 rounded-md transition-all cursor-pointer"
            title="Reset dataset and local storage history to default seed data"
          >
            <RotateCcw data-icon="inline-start" className="size-3 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">Reset Data</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>
      </div>

      {resetToast && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-1 text-center text-xs text-emerald-800 font-medium flex items-center justify-center gap-1.5 shadow-2xs">
          <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
          <span>Demo dataset and action logs reset successfully</span>
        </div>
      )}
    </header>
  );
};





