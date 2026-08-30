import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusPanel } from '@/components/StatusPanel';
import { Vehicle } from '@/types/vehicle';

describe('Optimistic Rollback Handling', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  const mockVehicle: Vehicle = {
    id: 'veh-500',
    vin: '1HGCR2F83HA999999',
    make: 'Audi',
    model: 'e-tron GT',
    year: 2023,
    trim: 'Prestige',
    price: 85000,
    mileage: 5000,
    fuelType: 'ELECTRIC',
    status: 'AVAILABLE',
    intakeDate: '2024-01-01',
    dealershipId: 'dlr-001',
    actionHistory: [],
  };

  it('displays error and rolls back when server returns 500 error', async () => {
    // Mock global fetch to simulate a 500 server failure
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        statusCode: 500,
        message: 'Simulated 500 Internal Server Error (Test Mode)',
      }),
    });

    render(<StatusPanel vehicle={mockVehicle} onClose={() => {}} />, {
      wrapper: createWrapper(),
    });

    const textarea = screen.getByPlaceholderText(/Document rationale/i);
    fireEvent.change(textarea, { target: { value: 'Failed markdown attempt' } });

    const submitBtn = screen.getByRole('button', { name: /Log Action/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Simulated 500 Internal Server Error/i)
      ).toBeInTheDocument();
    });
  });
});
