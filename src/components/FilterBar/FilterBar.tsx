import React from 'react';
import { Search, X, Filter, Flame, ArrowUpDown, Car, Fuel } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InventoryFilters, FuelType } from '../../types/vehicle';
import { CustomSelect, SelectOption } from './CustomSelect';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: InventoryFilters;
  onFilterChange: (filters: InventoryFilters) => void;
  availableMakes: string[];
  totalFiltered: number;
  totalUnfiltered: number;
}

const FUEL_OPTIONS: SelectOption[] = [
  { value: '', label: 'All Powertrains' },
  { value: 'GASOLINE', label: 'Gasoline' },
  { value: 'HYBRID', label: 'Hybrid / PHEV' },
  { value: 'ELECTRIC', label: 'Electric (EV)' },
  { value: 'DIESEL', label: 'Diesel' },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: 'daysInStock-desc', label: 'Days on lot (High to Low) ↓' },
  { value: 'daysInStock-asc', label: 'Days on lot (Low to High) ↑' },
  { value: 'price-desc', label: 'Price (High to Low) ↓' },
  { value: 'price-asc', label: 'Price (Low to High) ↑' },
  { value: 'year-desc', label: 'Model Year (Newest first) ↓' },
  { value: 'year-asc', label: 'Model Year (Oldest first) ↑' },
  { value: 'mileage-asc', label: 'Mileage (Lowest first) ↑' },
  { value: 'mileage-desc', label: 'Mileage (Highest first) ↓' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableMakes,
  totalFiltered,
  totalUnfiltered,
}) => {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.make) ||
    Boolean(filters.fuelType) ||
    filters.agingOnly;

  const handleClearFilters = () => {
    onFilterChange({ ...filters, search: '', make: '', model: '', fuelType: '', agingOnly: false });
  };

  const currentSortKey = `${filters.sortBy}-${filters.sortOrder}`;

  const handleSortChange = (val: string) => {
    const [sortBy, sortOrder] = val.split('-') as [InventoryFilters['sortBy'], InventoryFilters['sortOrder']];
    onFilterChange({ ...filters, sortBy, sortOrder });
  };

  const makeOptions: SelectOption[] = [
    { value: '', label: 'All Makes' },
    ...availableMakes.map((m) => ({ value: m, label: m })),
  ];

  return (
    <div className="glass-panel rounded-xl p-3 sm:p-3.5 mb-4 shadow-2xs relative z-20 bg-white/95 border border-slate-200">
      <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center justify-between">

        {/* Search Bar */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search VIN, make, model..."
            aria-label="Search inventory by VIN, make, or model"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full bg-white border-slate-200 pl-9 pr-8 py-1.5 h-9 text-xs text-slate-900 placeholder:text-slate-400 rounded-lg focus-visible:ring-indigo-500 focus-visible:border-indigo-500 shadow-2xs"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns & Toggles */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <CustomSelect
            label="Make"
            icon={<Car className="size-3.5" />}
            value={filters.make}
            onChange={(val) => onFilterChange({ ...filters, make: val })}
            options={makeOptions}
            ariaLabel="Filter vehicles by make"
            className="col-span-1 sm:w-auto"
          />

          <CustomSelect
            label="Powertrain"
            icon={<Fuel className="size-3.5" />}
            value={filters.fuelType}
            onChange={(val) => onFilterChange({ ...filters, fuelType: val as FuelType | '' })}
            options={FUEL_OPTIONS}
            ariaLabel="Filter vehicles by powertrain"
            className="col-span-1 sm:w-auto"
          />

          <CustomSelect
            label="Sort Order"
            icon={<ArrowUpDown className="size-3.5" />}
            value={currentSortKey}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
            ariaLabel="Sort inventory table"
            className="col-span-2 sm:w-auto min-w-[210px]"
          />

          {/* Aging Only Toggle */}
          <Button
            type="button"
            variant={filters.agingOnly ? 'warning' : 'outline'}
            size="sm"
            onClick={() => onFilterChange({ ...filters, agingOnly: !filters.agingOnly })}
            className={cn(
              'col-span-1 sm:col-auto h-9 px-3 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all',
              filters.agingOnly ? 'ring-2 ring-amber-400/30' : ''
            )}
          >
            <Flame
              data-icon="inline-start"
              className={cn('size-3.5 shrink-0', filters.agingOnly ? 'text-white' : 'text-amber-500')}
            />
            <span>&gt;90d Aging Only</span>
          </Button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="col-span-1 sm:col-auto h-9 px-2.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
            >
              <X data-icon="inline-start" className="size-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Metrics Indicator */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-2 font-medium">
          <Filter className="size-3.5 text-indigo-600" />
          <span>
            Showing <strong className="text-slate-900 font-mono font-bold">{totalFiltered}</strong> of{' '}
            <strong className="text-slate-900 font-mono font-bold">{totalUnfiltered}</strong> inventory units
          </span>
          {filters.agingOnly && (
            <Badge
              variant="outline"
              className="ml-1 border-amber-300 text-amber-800 bg-amber-50 text-[10px] font-bold"
            >
              Filtered for &gt;90d aging
            </Badge>
          )}
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline-block font-medium">
          Click any row to open the vehicle strategy workflow
        </span>
      </div>
    </div>
  );
};
