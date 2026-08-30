import React, { useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '../Navbar';
import { KPICards } from '../KPICards';
import { FilterBar } from '../FilterBar';
import { InventoryTable } from '../InventoryTable';
import { useVehicles } from '../../hooks/useVehicles';
import { filterAndSortVehicles } from '../../lib/filterVehicles';
import { useInventoryStore } from '../../lib/store';
import { ErrorState } from '../ErrorState';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSkeleton } from './DashboardSkeleton';

// Lazy-loaded so the modal bundle is only fetched when a user first opens a vehicle detail.
const StatusPanel = lazy(() =>
  import('../StatusPanel').then((m) => ({ default: m.StatusPanel }))
);

export const Dashboard: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useVehicles();

  // Select individual slices to avoid unnecessary re-renders on unrelated state changes.
  const filters = useInventoryStore((s) => s.filters);
  const setFilters = useInventoryStore((s) => s.setFilters);
  const toggleAgingOnly = useInventoryStore((s) => s.toggleAgingOnly);
  const selectedVehicleId = useInventoryStore((s) => s.selectedVehicleId);
  const setSelectedVehicleId = useInventoryStore((s) => s.setSelectedVehicleId);

  const vehicles = useMemo(() => data?.items || [], [data?.items]);

  // Unique makes derived from the current dataset for the make filter dropdown.
  const availableMakes = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => set.add(v.make));
    return Array.from(set).sort();
  }, [vehicles]);

  // Filtered and sorted list — recomputed only when vehicles or filters change.
  const filteredVehicles = useMemo(
    () => filterAndSortVehicles(vehicles, filters),
    [vehicles, filters]
  );

  // Resolve the full vehicle object so the modal always reflects the latest cache state.
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return null;
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        <DashboardHeader />

        {isLoading && <DashboardSkeleton />}

        {isError && <ErrorState error={error} onRetry={refetch} />}

        {!isLoading && !isError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <KPICards
              vehicles={vehicles}
              agingOnly={filters.agingOnly}
              onToggleAgingOnly={toggleAgingOnly}
            />

            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              availableMakes={availableMakes}
              totalFiltered={filteredVehicles.length}
              totalUnfiltered={vehicles.length}
            />

            <InventoryTable
              vehicles={filteredVehicles}
              onSelectVehicle={(v) => setSelectedVehicleId(v.id)}
            />
          </motion.div>
        )}
      </main>

      {/* Vehicle detail modal — rendered only when a row is selected */}
      <AnimatePresence>
        {selectedVehicle && (
          <Suspense fallback={null}>
            <StatusPanel vehicle={selectedVehicle} onClose={() => setSelectedVehicleId(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};
