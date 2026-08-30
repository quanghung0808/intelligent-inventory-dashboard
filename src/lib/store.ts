import { create } from 'zustand';
import { InventoryFilters } from '../types/vehicle';

const DEFAULT_FILTERS: InventoryFilters = {
  search: '',
  make: '',
  model: '',
  fuelType: '',
  agingOnly: false,
  sortBy: 'daysInStock',
  sortOrder: 'desc',
};

interface InventoryStore {
  /** Active filter & sort state for the inventory table */
  filters: InventoryFilters;
  setFilters: (filters: InventoryFilters) => void;
  toggleAgingOnly: () => void;

  /** ID of the vehicle whose detail panel is open (null = closed) */
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
}

/**
 * Global client UI state for the inventory dashboard.
 * Decouples filter/selection logic from Dashboard component
 * so child components can read/write state without prop drilling.
 */
export const useInventoryStore = create<InventoryStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (filters) => set({ filters }),
  toggleAgingOnly: () =>
    set((state) => ({
      filters: { ...state.filters, agingOnly: !state.filters.agingOnly },
    })),

  selectedVehicleId: null,
  setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
}));
