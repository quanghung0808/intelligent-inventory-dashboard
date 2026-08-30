import React from 'react';
import { AlertTriangle, Flame, History, FileEdit, Clock, Car, Fuel, Gauge } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Vehicle } from '../../types/vehicle';
import { getVehicleAgingMetrics } from '../../lib/aging';
import { formatCurrency, formatNumber, formatTimeAgo } from '../../lib/formatters';
import { formatActionName } from './actionFormatters';
import { cn } from '@/lib/utils';

interface VehicleTableRowProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

/** Desktop table row for a single vehicle entry (>= md breakpoint). */
export const VehicleTableRow: React.FC<VehicleTableRowProps> = ({ vehicle, onSelect }) => {
  const metrics = getVehicleAgingMetrics(vehicle.intakeDate, vehicle.price);
  const latestAction = vehicle.actionHistory[0];

  return (
    <TableRow
      onClick={() => onSelect(vehicle)}
      className={cn(
        'transition-colors duration-150 group border-b border-slate-100 cursor-pointer',
        metrics.tier === 'CRITICAL'
          ? 'bg-rose-50/20 hover:bg-rose-50/60'
          : metrics.tier === 'AGING'
          ? 'bg-amber-50/20 hover:bg-amber-50/60'
          : 'hover:bg-slate-50/90'
      )}
    >
      {/* 1. Vehicle Make & Model */}
      <TableCell
        className={cn(
          'py-3 px-3.5 transition-colors',
          metrics.tier === 'CRITICAL'
            ? 'border-l-4 border-l-rose-500'
            : metrics.tier === 'AGING'
            ? 'border-l-4 border-l-amber-500'
            : 'border-l-4 border-l-transparent'
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'size-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs shrink-0',
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
            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm tracking-tight truncate">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </div>
            <div className="text-xs text-slate-500 font-medium truncate">{vehicle.trim}</div>
          </div>
        </div>
      </TableCell>

      {/* 2. VIN & Mileage */}
      <TableCell className="py-3 px-3">
        <div className="font-mono text-[11px] text-slate-800 font-medium tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block">
          {vehicle.vin}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
          <Gauge className="size-3 text-slate-400" />
          <span>{formatNumber(vehicle.mileage)} mi</span>
        </div>
      </TableCell>

      {/* 3. Powertrain */}
      <TableCell className="py-3 px-3">
        <div className="flex items-center">
          <Badge
            variant="outline"
            className="gap-1 font-semibold bg-slate-50 text-slate-700 border-slate-200 py-0.5 px-2 rounded-md text-xs"
          >
            <Fuel className="size-3 text-indigo-600" />
            {vehicle.fuelType}
          </Badge>
        </div>
      </TableCell>

      {/* 4. Price & Holding Cost */}
      <TableCell className="py-3 px-3">
        <div className="font-extrabold text-slate-900 text-sm font-mono tracking-tight">
          {formatCurrency(vehicle.price)}
        </div>
        {metrics.estimatedHoldingCost > 0 ? (
          <div className="text-[11px] text-rose-600 font-bold flex items-center gap-0.5 mt-0.5 font-mono">
            <span>Hold: {formatCurrency(metrics.estimatedHoldingCost)}</span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">No hold debt</span>
        )}
      </TableCell>

      {/* 5. Aging Metric Badge */}
      <TableCell className="py-3 px-3">
        <div className="flex items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn(
              'gap-1 text-xs font-bold py-0.5 px-2 rounded-md shadow-2xs font-mono',
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
            {metrics.daysInStock} Days
          </Badge>
        </div>
        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
          Intake: {vehicle.intakeDate}
        </span>
      </TableCell>

      {/* 6. Action History */}
      <TableCell className="py-3 px-3">
        {vehicle.actionHistory.length > 0 && latestAction ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <span className="inline-flex items-center gap-1 text-indigo-700">
                <History className="size-3" />
                {vehicle.actionHistory.length}{' '}
                {vehicle.actionHistory.length === 1 ? 'Action' : 'Actions'}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-[10px] text-slate-500 font-normal font-mono">
                {formatTimeAgo(latestAction.timestamp)}
              </span>
            </div>
            <span
              className="text-[11px] text-slate-600 font-medium truncate max-w-[140px] mt-0.5"
              title={latestAction.note}
            >
              {formatActionName(latestAction.actionType)}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">No action logged</span>
        )}
      </TableCell>

      {/* 7. Strategy Button */}
      <TableCell className="py-3 px-3 text-center">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(vehicle);
          }}
          type="button"
          size="sm"
          variant="outline"
          className="text-xs font-bold h-7 px-2.5 rounded-lg border-slate-200 bg-white text-slate-700 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-2xs inline-flex items-center justify-center gap-1 mx-auto"
        >
          <FileEdit className="size-3 shrink-0" />
          <span>Manage</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};
