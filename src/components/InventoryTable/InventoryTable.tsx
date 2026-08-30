import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { Vehicle } from '../../types/vehicle';
import { InventoryEmptyState } from './InventoryEmptyState';
import { VehicleCard } from './VehicleCard';
import { VehicleTableRow } from './VehicleTableRow';

interface InventoryTableProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ vehicles, onSelectVehicle }) => {
  if (vehicles.length === 0) {
    return <InventoryEmptyState />;
  }

  return (
    <div className="relative z-10">
      {/* Mobile Card List View (< md) */}
      <div className="block md:hidden space-y-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onSelect={onSelectVehicle} />
        ))}
      </div>

      {/* Desktop & Tablet Tabular View (>= md) */}
      <div className="hidden md:block glass-panel rounded-xl overflow-hidden shadow-2xs relative bg-white border border-slate-200">
        <div className="overflow-x-auto touch-pan-x w-full">
          <Table
            aria-label="Dealership Vehicle Inventory Table"
            className="w-full text-left border-collapse table-fixed min-w-[860px]"
          >
            <TableHeader>
              <TableRow className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider hover:bg-slate-50">
                <TableHead scope="col" className="py-3 px-3.5 border-l-4 border-l-transparent text-slate-700 w-[24%]">
                  Vehicle Specification
                </TableHead>
                <TableHead scope="col" className="py-3 px-3 text-slate-700 w-[15%]">
                  VIN &amp; Mileage
                </TableHead>
                <TableHead scope="col" className="py-3 px-3 text-slate-700 w-[11%]">
                  Powertrain
                </TableHead>
                <TableHead scope="col" className="py-3 px-3 text-slate-700 w-[13%]">
                  Retail Price
                </TableHead>
                <TableHead scope="col" className="py-3 px-3 text-slate-700 w-[15%]">
                  Lot Age &amp; Risk Tier
                </TableHead>
                <TableHead scope="col" className="py-3 px-3 text-slate-700 w-[12%]">
                  Action History
                </TableHead>
                <TableHead scope="col" className="py-3 px-3 text-center text-slate-700 w-[10%]">
                  Strategy
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100 text-sm">
              {vehicles.map((vehicle) => (
                <VehicleTableRow key={vehicle.id} vehicle={vehicle} onSelect={onSelectVehicle} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
