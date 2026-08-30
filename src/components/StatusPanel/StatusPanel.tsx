import React from 'react';
import { X, AlertTriangle, Car } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '../../types/vehicle';
import { getVehicleAgingMetrics, calculateHoldingCost } from '../../lib/aging';
import { formatCurrency } from '../../lib/formatters';
import { cn } from '@/lib/utils';
import { VehicleMetricsBar } from './VehicleMetricsBar';
import { ActionForm } from './ActionForm';
import { ActionTimeline } from './ActionTimeline';

interface StatusPanelProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  const metrics = getVehicleAgingMetrics(vehicle.intakeDate, vehicle.price);

  // Close the modal on Escape key for keyboard accessibility (WCAG).
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-vehicle-title"
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-4 sm:my-8 relative"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                'size-10 sm:size-12 rounded-xl flex items-center justify-center shadow-xs shrink-0',
                metrics.isAging
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              )}
            >
              <Car className="size-5 sm:size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2
                  id="modal-vehicle-title"
                  className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight truncate"
                >
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <Badge
                  variant="outline"
                  className="bg-white text-slate-700 border-slate-200 text-[10px] sm:text-xs font-mono font-bold"
                >
                  {vehicle.fuelType}
                </Badge>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono mt-0.5 font-medium truncate">
                VIN: {vehicle.vin} &bull; {vehicle.trim}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl shrink-0"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[75vh] overflow-y-auto">
          <VehicleMetricsBar vehicle={vehicle} />

          {/* Aging Alert Banner (if >90 days) */}
          {metrics.isAging && (
            <Alert className="bg-amber-50 border-amber-300 text-amber-900 rounded-xl">
              <AlertTriangle className="size-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-900 leading-relaxed font-medium">
                <strong className="font-bold block text-amber-950 mb-0.5">
                  Aging Stock Escalation ({metrics.tier} Risk Tier)
                </strong>
                Vehicle has been on lot for {metrics.daysInStock} days, accumulating floor-plan
                carrying cost at ~{formatCurrency(calculateHoldingCost(vehicle.price, 30))}/mo.
                Immediate markdown, auction booking, or campaign push is advised.
              </AlertDescription>
            </Alert>
          )}

          <ActionForm vehicleId={vehicle.id} onClose={onClose} />
          <ActionTimeline actionHistory={vehicle.actionHistory} />
        </div>
      </motion.div>
    </div>
  );
};
