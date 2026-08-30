import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusPanel } from '@/components/StatusPanel';
import { Vehicle } from '@/types/vehicle';

describe('StatusPanel Component', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  const mockVehicle: Vehicle = {
    id: 'veh-001',
    vin: '1HGCR2F83HA100001',
    make: 'Honda',
    model: 'Accord',
    year: 2022,
    trim: 'Sport 2.0T',
    price: 28500,
    mileage: 18000,
    fuelType: 'GASOLINE',
    status: 'AVAILABLE',
    intakeDate: '2024-01-01', // >90 days
    dealershipId: 'dlr-001',
    actionHistory: [
      {
        id: 'act-1',
        actionType: 'PRICE_DROP',
        note: 'Initial markdown of $500 applied.',
        author: 'Marcus Vance',
        timestamp: '2024-03-01T10:00:00Z',
      },
    ],
  };

  it('renders vehicle information and existing action history', () => {
    const handleClose = vi.fn();
    render(<StatusPanel vehicle={mockVehicle} onClose={handleClose} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/2022 Honda Accord/i)).toBeInTheDocument();
    expect(screen.getByText(/VIN: 1HGCR2F83HA100001/i)).toBeInTheDocument();
    expect(screen.getByText('Initial markdown of $500 applied.')).toBeInTheDocument();
  });

  it('allows typing a note and submitting an action', async () => {
    const handleClose = vi.fn();
    
    // Mock global fetch for the POST action
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockVehicle,
        actionHistory: [
          {
            id: 'act-2',
            actionType: 'PRICE_DROP',
            note: 'Additional discount applied',
            author: 'Marcus Vance (Inventory Manager)',
            timestamp: new Date().toISOString(),
          },
          ...mockVehicle.actionHistory,
        ],
      }),
    });

    render(<StatusPanel vehicle={mockVehicle} onClose={handleClose} />, {
      wrapper: createWrapper(),
    });

    const textarea = screen.getByPlaceholderText(/Document rationale/i);
    fireEvent.change(textarea, { target: { value: 'Additional discount applied' } });

    const submitBtn = screen.getByRole('button', { name: /Log Action/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/vehicles/veh-001/actions',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('populates note textarea when clicking a Quick Template Suggestion across different strategies', () => {
    const handleClose = vi.fn();
    render(<StatusPanel vehicle={mockVehicle} onClose={handleClose} />, {
      wrapper: createWrapper(),
    });

    const textarea = screen.getByPlaceholderText(/Document rationale/i) as HTMLTextAreaElement;

    // Default PRICE_DROP templates
    const markdownBtn = screen.getByRole('button', { name: /Markdown \$1,000/i });
    expect(markdownBtn).toBeInTheDocument();
    fireEvent.click(markdownBtn);
    expect(textarea.value).toContain('Reduce retail price by $1,000');

    // Switch to WHOLESALE_TRANSFER
    const wholesaleOpt = screen.getByRole('button', { name: /Wholesale Transfer/i });
    fireEvent.click(wholesaleOpt);

    const sisterLotBtn = screen.getByRole('button', { name: /Transfer to Sister Lot/i });
    expect(sisterLotBtn).toBeInTheDocument();
    fireEvent.click(sisterLotBtn);
    expect(textarea.value).toContain('Initiate wholesale transfer to sister dealership');

    // Switch to RECONDITIONING
    const reconOpt = screen.getByRole('button', { name: /Reconditioning \/ Detail/i });
    fireEvent.click(reconOpt);

    const reconBtn = screen.getByRole('button', { name: /Full Paint & Detail/i });
    expect(reconBtn).toBeInTheDocument();
    fireEvent.click(reconBtn);
    expect(textarea.value).toContain('Send for comprehensive 2-step paint correction');

    // Switch to STATUS_CHANGE
    const statusOpt = screen.getByRole('button', { name: /Update Lot Status/i });
    fireEvent.click(statusOpt);

    const pendingBtn = screen.getByRole('button', { name: /^Sale Pending$/i });
    expect(pendingBtn).toBeInTheDocument();
    fireEvent.click(pendingBtn);
    expect(textarea.value).toContain('Mark status as Sale Pending');
  });
});
