import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KPICards } from '@/components/KPICards';
import { Vehicle } from '@/types/vehicle';

describe('KPICards Component', () => {
  const mockVehicles: Vehicle[] = [
    {
      id: 'v1',
      vin: '1HGCR2F83HA100001',
      make: 'Honda',
      model: 'Accord',
      year: 2022,
      trim: 'Sport',
      price: 30000,
      mileage: 20000,
      fuelType: 'GASOLINE',
      status: 'AVAILABLE',
      intakeDate: '2024-01-01', // >90 days
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
      price: 70000,
      mileage: 10000,
      fuelType: 'HYBRID',
      status: 'AVAILABLE',
      intakeDate: new Date().toISOString().split('T')[0], // 0 days
      dealershipId: 'dlr-001',
      actionHistory: [],
    },
  ];

  it('renders total inventory count and formatted valuation', () => {
    const handleToggle = vi.fn();
    render(
      <KPICards
        vehicles={mockVehicles}
        agingOnly={false}
        onToggleAgingOnly={handleToggle}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  it('triggers onToggleAgingOnly when aging card is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <KPICards
        vehicles={mockVehicles}
        agingOnly={false}
        onToggleAgingOnly={handleToggle}
      />
    );

    const agingCard = screen.getByText(/Aging Stock/i).closest('div');
    if (agingCard) {
      fireEvent.click(agingCard);
      expect(handleToggle).toHaveBeenCalled();
    }
  });
});
