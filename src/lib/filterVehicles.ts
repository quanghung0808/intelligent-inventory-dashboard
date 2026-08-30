import { Vehicle, InventoryFilters } from '../types/vehicle';
import { getDaysInStock, isAgingStock } from './aging';

/**
 * Pure function to filter and sort inventory vehicles based on active filter criteria.
 */
export function filterAndSortVehicles(
  vehicles: Vehicle[],
  filters: InventoryFilters,
  referenceDate: Date = new Date()
): Vehicle[] {
  return vehicles
    .filter((vehicle) => {
      // 1. Search Query filter (matches VIN, Make, Model, Trim)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesVin = vehicle.vin.toLowerCase().includes(query);
        const matchesMake = vehicle.make.toLowerCase().includes(query);
        const matchesModel = vehicle.model.toLowerCase().includes(query);
        const matchesTrim = vehicle.trim.toLowerCase().includes(query);

        if (!matchesVin && !matchesMake && !matchesModel && !matchesTrim) {
          return false;
        }
      }

      // 2. Make filter
      if (filters.make && vehicle.make !== filters.make) {
        return false;
      }

      // 3. Model filter
      if (filters.model && vehicle.model !== filters.model) {
        return false;
      }

      // 4. Fuel type filter
      if (filters.fuelType && vehicle.fuelType !== filters.fuelType) {
        return false;
      }

      // 5. Aging stock only (>90 days)
      if (filters.agingOnly && !isAgingStock(vehicle.intakeDate, referenceDate)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const modifier = filters.sortOrder === 'asc' ? 1 : -1;

      if (filters.sortBy === 'daysInStock') {
        const daysA = getDaysInStock(a.intakeDate, referenceDate);
        const daysB = getDaysInStock(b.intakeDate, referenceDate);
        return (daysA - daysB) * modifier;
      }

      if (filters.sortBy === 'price') {
        return (a.price - b.price) * modifier;
      }

      if (filters.sortBy === 'year') {
        return (a.year - b.year) * modifier;
      }

      if (filters.sortBy === 'mileage') {
        return (a.mileage - b.mileage) * modifier;
      }

      return 0;
    });
}
