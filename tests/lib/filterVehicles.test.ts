import { describe, it, expect } from 'vitest';
import { filterAndSortVehicles } from '@/lib/filterVehicles';
import { Vehicle, InventoryFilters } from '@/types/vehicle';

describe('filterAndSortVehicles', () => {
  const FIXED_REF_DATE = new Date('2026-08-27T00:00:00Z');

  const SAMPLE_VEHICLES: Vehicle[] = [
    {
      id: 'v1',
      vin: '1HGCR2F83HA100001',
      make: 'Honda',
      model: 'Accord',
      year: 2022,
      trim: 'Sport',
      price: 26000,
      mileage: 30000,
      fuelType: 'GASOLINE',
      status: 'AVAILABLE',
      intakeDate: '2026-05-15', // 104 days (>90)
      dealershipId: 'dlr-001',
      actionHistory: [],
    },
    {
      id: 'v2',
      vin: '5UXCR6C05M9100002',
      make: 'BMW',
      model: 'X5',
      year: 2023,
      trim: 'xDrive40i',
      price: 65000,
      mileage: 15000,
      fuelType: 'HYBRID',
      status: 'AVAILABLE',
      intakeDate: '2026-08-01', // 26 days (<=90)
      dealershipId: 'dlr-001',
      actionHistory: [],
    },
    {
      id: 'v3',
      vin: 'WA1VAAF14ND100003',
      make: 'Honda',
      model: 'CR-V',
      year: 2024,
      trim: 'Touring',
      price: 38000,
      mileage: 5000,
      fuelType: 'HYBRID',
      status: 'AVAILABLE',
      intakeDate: '2026-05-20', // 99 days (>90)
      dealershipId: 'dlr-001',
      actionHistory: [],
    },
  ];

  const defaultFilters: InventoryFilters = {
    search: '',
    make: '',
    model: '',
    fuelType: '',
    agingOnly: false,
    sortBy: 'daysInStock',
    sortOrder: 'desc',
  };

  it('returns all vehicles when no filters are applied', () => {
    const result = filterAndSortVehicles(SAMPLE_VEHICLES, defaultFilters, FIXED_REF_DATE);
    expect(result.length).toBe(3);
  });

  it('filters by search term matching model or VIN', () => {
    const filters = { ...defaultFilters, search: 'Accord' };
    const result = filterAndSortVehicles(SAMPLE_VEHICLES, filters, FIXED_REF_DATE);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('v1');
  });

  it('filters by make', () => {
    const filters = { ...defaultFilters, make: 'Honda' };
    const result = filterAndSortVehicles(SAMPLE_VEHICLES, filters, FIXED_REF_DATE);
    expect(result.length).toBe(2);
  });

  it('filters by fuel type', () => {
    const filters = { ...defaultFilters, fuelType: 'HYBRID' };
    const result = filterAndSortVehicles(SAMPLE_VEHICLES, filters, FIXED_REF_DATE);
    expect(result.length).toBe(2);
  });

  it('isolates aging stock (>90 days) when agingOnly is true', () => {
    const filters = { ...defaultFilters, agingOnly: true };
    const result = filterAndSortVehicles(SAMPLE_VEHICLES, filters, FIXED_REF_DATE);
    expect(result.length).toBe(2); // v1 (104d) and v3 (99d)
    expect(result.find((v) => v.id === 'v2')).toBeUndefined();
  });

  it('sorts by price ascending and descending', () => {
    const ascFilters = { ...defaultFilters, sortBy: 'price' as const, sortOrder: 'asc' as const };
    const asc = filterAndSortVehicles(SAMPLE_VEHICLES, ascFilters, FIXED_REF_DATE);
    expect(asc[0].price).toBe(26000);
    expect(asc[2].price).toBe(65000);

    const descFilters = { ...defaultFilters, sortBy: 'price' as const, sortOrder: 'desc' as const };
    const desc = filterAndSortVehicles(SAMPLE_VEHICLES, descFilters, FIXED_REF_DATE);
    expect(desc[0].price).toBe(65000);
    expect(desc[2].price).toBe(26000);
  });
});
