import { Vehicle, ActionLog, CreateActionPayload } from '../types/vehicle';
import { INITIAL_VEHICLES } from './mockData';

const STORAGE_KEY = 'keyloop_inventory_vehicles_v1';
const SIMULATE_ERROR_KEY = 'keyloop_simulate_api_error';

/**
 * Initializes and retrieves vehicles from localStorage or fallback seed data.
 */
export function getStoredVehicles(): Vehicle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    return JSON.parse(raw) as Vehicle[];
  } catch {
    return INITIAL_VEHICLES;
  }
}

/**
 * Saves vehicles to localStorage.
 */
export function saveStoredVehicles(vehicles: Vehicle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

/**
 * Adds an action log entry to a vehicle in storage and returns the updated vehicle.
 */
export function appendVehicleAction(
  vehicleId: string,
  payload: CreateActionPayload
): Vehicle | null {
  const vehicles = getStoredVehicles();
  const index = vehicles.findIndex((v) => v.id === vehicleId);

  if (index === -1) return null;

  const newLog: ActionLog = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actionType: payload.actionType,
    note: payload.note,
    author: payload.author || 'Marcus Vance (Inventory Manager)',
    timestamp: new Date().toISOString(),
  };

  const updatedVehicle: Vehicle = {
    ...vehicles[index],
    actionHistory: [newLog, ...vehicles[index].actionHistory],
  };

  vehicles[index] = updatedVehicle;
  saveStoredVehicles(vehicles);

  return updatedVehicle;
}

/**
 * Resets local storage to initial mock state.
 */
export function resetMockStorage(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VEHICLES));
}

/**
 * Gets or sets the simulated 500 error mode for testing optimistic rollbacks.
 */
export function getSimulateErrorMode(): boolean {
  try {
    return localStorage.getItem(SIMULATE_ERROR_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSimulateErrorMode(enabled: boolean): void {
  try {
    localStorage.setItem(SIMULATE_ERROR_KEY, enabled ? 'true' : 'false');
  } catch {
    // no-op
  }
}
