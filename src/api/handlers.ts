import { http, HttpResponse, delay } from 'msw';
import {
  getStoredVehicles,
  appendVehicleAction,
  getSimulateErrorMode,
} from './storage';
import { getDaysInStock, isAgingStock } from '../lib/aging';
import { logger } from '../lib/logger';
import { CreateActionPayload } from '../types/vehicle';

export const handlers = [
  // GET /api/vehicles
  http.get('/api/vehicles', async ({ request }) => {
    // Small delay to simulate realistic network latency in the mock environment.
    await delay(120);

    const url = new URL(request.url);
    const make = url.searchParams.get('make');
    const model = url.searchParams.get('model');
    const agingOnly = url.searchParams.get('agingOnly') === 'true';
    const search = url.searchParams.get('search')?.toLowerCase();

    let items = getStoredVehicles();

    if (search) {
      items = items.filter(
        (v) =>
          v.vin.toLowerCase().includes(search) ||
          v.make.toLowerCase().includes(search) ||
          v.model.toLowerCase().includes(search) ||
          v.trim.toLowerCase().includes(search)
      );
    }

    if (make) {
      items = items.filter((v) => v.make.toLowerCase() === make.toLowerCase());
    }

    if (model) {
      items = items.filter((v) => v.model.toLowerCase() === model.toLowerCase());
    }

    if (agingOnly) {
      items = items.filter((v) => isAgingStock(v.intakeDate));
    }

    const allVehicles = getStoredVehicles();
    const agingCount = allVehicles.filter((v) => isAgingStock(v.intakeDate)).length;
    const totalValue = allVehicles.reduce((sum, v) => sum + v.price, 0);
    const totalDays = allVehicles.reduce((sum, v) => sum + getDaysInStock(v.intakeDate), 0);
    const averageDaysInStock = allVehicles.length > 0 ? Math.round(totalDays / allVehicles.length) : 0;

    logger.info('api.get_vehicles_success', {
      count: items.length,
      totalCount: allVehicles.length,
      agingCount,
    });

    return HttpResponse.json({
      items,
      totalCount: allVehicles.length,
      agingCount,
      totalValue,
      averageDaysInStock,
    });
  }),

  // GET /api/vehicles/:id
  http.get('/api/vehicles/:id', async ({ params }) => {
    await delay(80);
    const { id } = params;
    const vehicle = getStoredVehicles().find((v) => v.id === id);

    if (!vehicle) {
      logger.warn('api.get_vehicle_not_found', { id });
      return HttpResponse.json(
        { statusCode: 404, message: `Vehicle with ID ${id} not found` },
        { status: 404 }
      );
    }

    return HttpResponse.json(vehicle);
  }),

  // POST /api/vehicles/:id/actions
  http.post('/api/vehicles/:id/actions', async ({ params, request }) => {
    await delay(200);
    const { id } = params;

    // Check if error simulation is active (for testing rollback)
    if (getSimulateErrorMode()) {
      logger.error('api.simulated_500_error', { id });
      return HttpResponse.json(
        { statusCode: 500, message: 'Simulated 500 Internal Server Error (Test Mode)' },
        { status: 500 }
      );
    }

    const payload = (await request.json()) as CreateActionPayload;

    if (!payload.actionType || !payload.note) {
      return HttpResponse.json(
        { statusCode: 400, message: 'actionType and note are required' },
        { status: 400 }
      );
    }

    const updated = appendVehicleAction(id as string, payload);

    if (!updated) {
      return HttpResponse.json(
        { statusCode: 404, message: `Vehicle ${id} not found` },
        { status: 404 }
      );
    }

    logger.info('api.action_logged_success', {
      vehicleId: id,
      actionType: payload.actionType,
    });

    return HttpResponse.json(updated, { status: 200 });
  }),
];
