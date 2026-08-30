import React from 'react';
import {
  Car,
  DollarSign,
  AlertTriangle,
  Clock,
  TrendingDown,
} from 'lucide-react';

import { motion, type Variants } from 'motion/react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Vehicle } from '../types/vehicle';
import { isAgingStock, calculateHoldingCost } from '../lib/aging';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  vehicles: Vehicle[];
  agingOnly: boolean;
  onToggleAgingOnly: () => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  vehicles,
  agingOnly,
  onToggleAgingOnly,
}) => {
  const totalUnits = vehicles.length;
  const totalValue = vehicles.reduce((sum, v) => sum + v.price, 0);

  const agingVehicles = vehicles.filter((v) => isAgingStock(v.intakeDate));
  const agingCount = agingVehicles.length;
  const agingValue = agingVehicles.reduce((sum, v) => sum + v.price, 0);
  const agingPercentage = totalUnits > 0 ? Math.round((agingCount / totalUnits) * 100) : 0;

  const totalHoldingCost = agingVehicles.reduce((sum, v) => {
    const intake = new Date(v.intakeDate);
    const days = Math.max(0, Math.floor((Date.now() - intake.getTime()) / 86400000));
    return sum + calculateHoldingCost(v.price, days);
  }, 0);

  const avgDaysOnLot = totalUnits > 0
    ? Math.round(
        vehicles.reduce((sum, v) => {
          const diff = Math.max(0, Math.floor((Date.now() - new Date(v.intakeDate).getTime()) / 86400000));
          return sum + diff;
        }, 0) / totalUnits
      )
    : 0;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4 items-stretch"
    >
      {/* 1. Total Inventory */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="glass-panel-interactive rounded-xl relative overflow-hidden group flex flex-col justify-between h-full p-4 shadow-2xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Inventory
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              <Car className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col justify-between mt-1">
            <div className="flex items-baseline min-h-[36px]">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{totalUnits}</span>
              <span className="text-xs text-slate-500 ml-1.5 font-medium">vehicles on lot</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Active floor plan</span>
              <span className="font-mono text-[11px] text-indigo-700 font-semibold bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100">
                100% Tracked
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 2. Total Valuation */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="glass-panel-interactive rounded-xl relative overflow-hidden group flex flex-col justify-between h-full p-4 shadow-2xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Valuation
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <DollarSign className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col justify-between mt-1">
            <div className="flex items-baseline min-h-[36px]">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(totalValue)}
              </span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Retail asking capital</span>
              <span className="font-mono text-[11px] text-emerald-700 font-semibold bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-100">
                Live Capital
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3. Aging Inventory (>90 Days) - Business-First Hierarchy */}
      <motion.div variants={itemVariants} className="h-full">
        <Card
          className={cn(
            'rounded-xl relative overflow-hidden transition-all duration-150 cursor-pointer flex flex-col justify-between h-full p-4',
            agingOnly
              ? 'bg-amber-50/95 border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
              : 'bg-amber-50/40 border-amber-300 hover:border-amber-400 hover:bg-amber-50/70 shadow-2xs'
          )}
          onClick={onToggleAgingOnly}
        >
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Aging Inventory
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                Aging Stock (&gt;90d)
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
              <AlertTriangle className="size-3.5" />
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-1 flex flex-col justify-between mt-1">
            <div className="flex items-baseline justify-between min-h-[36px]">
              <div>
                <span className="text-2xl font-extrabold text-amber-950 tracking-tight">
                  {agingCount}
                </span>
                <span className="text-xs text-amber-900 font-semibold ml-1">vehicles</span>
                <span className="text-xs text-amber-700 ml-1.5 font-medium">
                  ({agingPercentage}% of lot)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-950 font-mono">
                  {formatCurrency(agingValue)}
                </span>
                <span className="block text-[10px] text-amber-700 uppercase font-semibold">At risk</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-amber-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1">
                <TrendingDown className="size-3 text-rose-600" />
                Hold: <strong className="text-rose-700 font-mono font-bold">{formatCurrency(totalHoldingCost)}</strong>
              </span>
              <span className="text-amber-900 hover:text-amber-950 font-bold text-[11px] flex items-center gap-0.5">
                {agingOnly ? 'Show all' : `Review ${agingCount} →`}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 4. Average Age (Semantically Corrected) */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="glass-panel-interactive rounded-xl relative overflow-hidden group flex flex-col justify-between h-full p-4 shadow-2xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Average Age
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80">
              <Clock className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col justify-between mt-1">
            <div className="flex items-baseline min-h-[36px]">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {avgDaysOnLot}
              </span>
              <span className="text-xs text-slate-500 ml-1.5 font-medium">days on lot</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Benchmark target: &lt;45d</span>
              <span className="font-mono text-[11px] text-blue-700 font-semibold bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-100">
                Target: 45d
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};





