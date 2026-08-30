import React from 'react';
import { AlertTriangle, Flame, History, FileEdit, Clock, Car, Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Vehicle } from '../../types/vehicle';
import { getVehicleAgingMetrics } from '../../lib/aging';
import { formatCurrency, formatNumber, formatTimeAgo } from '../../lib/formatters';
import { formatActionName } from './actionFormatters';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

/** Mobile card view for a single vehicle inventory row (< md breakpoint). */
export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  const metrics = getVehicleAgingMetrics(vehicle.intakeDate, vehicle.price);
  const latestAction = vehicle.actionHistory[0];

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className={cn(
        'glass-panel rounded-xl p-3.5 shadow-2xs border transition-all cursor-pointer bg-white relative overflow-hidden',
        metrics.tier === 'CRITICAL'
          ? 'border-slate-200 border-l-4 border-l-rose-500 bg-rose-50/10'
          : metrics.tier === 'AGING'
          ? 'border-slate-200 border-l-4 border-l-amber-500 bg-amber-50/10'
          : 'border-slate-200 border-l-4 border-l-transparent'
      )}
    >
      {/* Header: Title, Powertrain, and Aging Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              'size-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs',
              metrics.tier === 'CRITICAL'
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : metrics.tier === 'AGING'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            )}
          >
            <Car className="size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight truncate">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate">{vehicle.trim}</p>
          </div>
        </div>

        {/* Aging Days Badge */}
        <Badge
          variant="outline"
          className={cn(
            'gap-1 text-xs font-bold py-0.5 px-2 rounded-md shrink-0 font-mono shadow-2xs',
            metrics.tier === 'CRITICAL'
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : metrics.tier === 'AGING'
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : metrics.tier === 'WARNING'
              ? 'bg-yellow-50 text-yellow-800 border-yellow-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          )}
        >
          {metrics.tier === 'CRITICAL' && <Flame className="size-3 text-rose-600" />}
          {metrics.tier === 'AGING' && <AlertTriangle className="size-3 text-amber-600" />}
          {metrics.tier === 'WARNING' && <Clock className="size-3 text-yellow-600" />}
          {metrics.daysInStock}d
        </Badge>
      </div>

      {/* Middle Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs">
        {/* Price & Holding */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Retail Price</span>
          <span className="text-base font-extrabold text-slate-900 font-mono">
            {formatCurrency(vehicle.price)}
          </span>
          {metrics.estimatedHoldingCost > 0 && (
            <span className="block text-[11px] text-rose-600 font-bold font-mono">
              Hold: {formatCurrency(metrics.estimatedHoldingCost)}
            </span>
          )}
        </div>

        {/* Mileage, VIN, Powertrain */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Lot Specs</span>
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span className="font-bold text-slate-800 flex items-center gap-1 font-mono text-xs">
              <Gauge className="size-3 text-slate-400" />
              {formatNumber(vehicle.mileage)} mi
            </span>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold py-0 px-1.5 bg-slate-50 text-slate-700 border-slate-200"
            >
              {vehicle.fuelType}
            </Badge>
          </div>
          <span className="text-[10px] font-mono text-slate-500 block truncate mt-0.5">
            VIN: {vehicle.vin}
          </span>
        </div>
      </div>

      {/* Action History Snippet */}
      {vehicle.actionHistory.length > 0 && latestAction && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 font-bold text-indigo-700 text-[11px]">
            <History className="size-3" />
            {vehicle.actionHistory.length}{' '}
            {vehicle.actionHistory.length === 1 ? 'Action' : 'Actions'}
            <span className="text-slate-400 font-normal font-mono">
              ({formatTimeAgo(latestAction.timestamp)})
            </span>
          </span>
          <span className="text-[11px] text-slate-600 font-medium truncate max-w-[150px]">
            {formatActionName(latestAction.actionType)}
          </span>
        </div>
      )}

      {/* Bottom Action Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(vehicle);
        }}
        type="button"
        size="sm"
        variant="outline"
        className="w-full h-8 mt-3 rounded-lg border-slate-200 bg-slate-50 text-slate-800 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
      >
        <FileEdit className="size-3.5 shrink-0" />
        <span>Manage Strategy</span>
      </Button>
    </div>
  );
};
