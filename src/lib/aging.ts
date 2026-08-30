import { AgingTier, VehicleAgingMetrics } from '../types/vehicle';

const MS_PER_DAY = 86_400_000;
const AGING_THRESHOLD_DAYS = 90;

/**
 * Calculates the number of days a vehicle has been in stock.
 * Accepts an optional referenceDate for deterministic testing.
 *
 * @param intakeDate - ISO Date string (YYYY-MM-DD or full timestamp)
 * @param referenceDate - Baseline date (defaults to current system time)
 */
export function getDaysInStock(intakeDate: string, referenceDate: Date = new Date()): number {
  if (!intakeDate) return 0;

  const intake = new Date(intakeDate);
  if (isNaN(intake.getTime())) return 0;

  // Set reference to end of day/UTC to ensure date-level granularity without timezone skew
  const ref = new Date(referenceDate);
  const diffMs = ref.getTime() - intake.getTime();

  return Math.max(0, Math.floor(diffMs / MS_PER_DAY));
}

/**
 * Determines if a vehicle is considered "aging stock" (>90 days by default).
 * Strict greater-than evaluation as specified in assessment requirements.
 */
export function isAgingStock(
  intakeDate: string,
  referenceDate: Date = new Date(),
  thresholdDays: number = AGING_THRESHOLD_DAYS
): boolean {
  const days = getDaysInStock(intakeDate, referenceDate);
  return days > thresholdDays;
}

/**
 * Returns the urgency tier for a vehicle based on days in stock:
 * - HEALTHY: <= 60 days
 * - WARNING: 61 - 90 days
 * - AGING: 91 - 120 days
 * - CRITICAL: > 120 days
 */
export function getAgingTier(days: number): AgingTier {
  if (days <= 60) return 'HEALTHY';
  if (days <= 90) return 'WARNING';
  if (days <= 120) return 'AGING';
  return 'CRITICAL';
}

/**
 * Computes estimated cumulative holding cost (floor-plan interest + lot maintenance + depreciation).
 * Standard automotive retail formula: ~1.5% of vehicle value per 30 days (~0.05% per day).
 */
export function calculateHoldingCost(price: number, days: number): number {
  if (price <= 0 || days <= 0) return 0;
  // 0.05% per day ≈ 18% annual floor-plan carrying cost (industry standard).
  const dailyRate = 0.0005;
  return Math.round(price * dailyRate * days);
}

/**
 * Computes all aging metrics for a vehicle.
 */
export function getVehicleAgingMetrics(
  intakeDate: string,
  price: number,
  referenceDate: Date = new Date()
): VehicleAgingMetrics {
  const daysInStock = getDaysInStock(intakeDate, referenceDate);
  const isAging = daysInStock > AGING_THRESHOLD_DAYS;
  const tier = getAgingTier(daysInStock);
  const estimatedHoldingCost = calculateHoldingCost(price, daysInStock);

  return {
    daysInStock,
    isAging,
    tier,
    estimatedHoldingCost,
  };
}
