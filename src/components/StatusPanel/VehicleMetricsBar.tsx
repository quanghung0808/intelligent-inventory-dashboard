import React from 'react';
import { Vehicle } from '../../types/vehicle';
import { getVehicleAgingMetrics } from '../../lib/aging';
import { formatCurrency } from '../../lib/formatters';
import { cn } from '@/lib/utils';

interface VehicleMetricsBarProps {
  vehicle: Vehicle;
}

/** Three-column summary bar: asking price, lot age, holding debt. */
export const VehicleMetricsBar: React.FC<VehicleMetricsBarProps> = ({ vehicle }) => {
  const metrics = getVehicleAgingMetrics(vehicle.intakeDate, vehicle.price);

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3.5 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-center shadow-2xs">
      <div>
        <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold tracking-wider block truncate">
          Asking Price
        </span>
        <p className="text-sm sm:text-lg font-extrabold text-slate-900 mt-0.5 font-mono truncate">
          {formatCurrency(vehicle.price)}
        </p>
      </div>
      <div>
        <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold tracking-wider block truncate">
          Lot Age
        </span>
        <p
          className={cn(
            'text-sm sm:text-lg font-extrabold mt-0.5 font-mono truncate',
            metrics.isAging ? 'text-amber-800' : 'text-emerald-800'
          )}
        >
          {metrics.daysInStock} Days
        </p>
      </div>
      <div>
        <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-bold tracking-wider block truncate">
          Holding Debt
        </span>
        <p className="text-sm sm:text-lg font-extrabold text-rose-600 mt-0.5 font-mono truncate">
          {formatCurrency(metrics.estimatedHoldingCost)}
        </p>
      </div>
    </div>
  );
};
