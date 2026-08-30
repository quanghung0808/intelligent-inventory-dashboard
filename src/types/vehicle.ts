/**
 * Domain entity types for vehicle inventory and action tracking.
 * Strictly mirrors docs/api-contract.yaml
 */

export type FuelType = 'GASOLINE' | 'HYBRID' | 'ELECTRIC' | 'DIESEL';

export type VehicleStatus = 
  | 'AVAILABLE' 
  | 'SALE_PENDING' 
  | 'IN_RECONDITIONING' 
  | 'WHOLESALE_SCHEDULED' 
  | 'AUCTION_SCHEDULED';

export type ActionType = 
  | 'PRICE_DROP' 
  | 'SEND_TO_AUCTION' 
  | 'WHOLESALE_TRANSFER' 
  | 'RECONDITIONING' 
  | 'MARKETING_BOOST' 
  | 'STATUS_CHANGE';

export interface ActionLog {
  id: string;
  actionType: ActionType;
  note: string;
  author: string;
  timestamp: string; // ISO 8601 string
}

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  mileage: number;
  fuelType: FuelType;
  status: VehicleStatus;
  intakeDate: string; // YYYY-MM-DD
  dealershipId: string;
  actionHistory: ActionLog[];
  imageUrl?: string;
}

export type AgingTier = 'HEALTHY' | 'WARNING' | 'AGING' | 'CRITICAL';

export interface VehicleAgingMetrics {
  daysInStock: number;
  isAging: boolean;
  tier: AgingTier;
  estimatedHoldingCost: number;
}

export interface InventorySummary {
  items: Vehicle[];
  totalCount: number;
  agingCount: number;
  totalValue: number;
  averageDaysInStock: number;
}

export interface CreateActionPayload {
  actionType: ActionType;
  note: string;
  author?: string;
}

export interface InventoryFilters {
  search: string;
  make: string;
  model: string;
  fuelType: string;
  agingOnly: boolean;
  sortBy: 'daysInStock' | 'price' | 'year' | 'mileage';
  sortOrder: 'asc' | 'desc';
}
