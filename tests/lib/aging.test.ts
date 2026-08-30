import { describe, it, expect } from 'vitest';
import {
  getDaysInStock,
  isAgingStock,
  getAgingTier,
  calculateHoldingCost,
  getVehicleAgingMetrics,
} from '@/lib/aging';

describe('aging domain logic', () => {
  const FIXED_REF_DATE = new Date('2026-08-27T00:00:00Z');

  describe('getDaysInStock', () => {
    it('returns 0 for empty or invalid date string', () => {
      expect(getDaysInStock('', FIXED_REF_DATE)).toBe(0);
      expect(getDaysInStock('invalid-date', FIXED_REF_DATE)).toBe(0);
    });

    it('calculates exact difference in days', () => {
      // 10 days before
      const intakeDate = '2026-08-17';
      expect(getDaysInStock(intakeDate, FIXED_REF_DATE)).toBe(10);
    });

    it('handles same day intake as 0 days', () => {
      expect(getDaysInStock('2026-08-27', FIXED_REF_DATE)).toBe(0);
    });
  });

  describe('isAgingStock boundary conditions (>90 days)', () => {
    it('evaluates exactly 89 days as NOT aging', () => {
      // 89 days before 2026-08-27 -> 2026-05-30
      const intake = new Date(FIXED_REF_DATE);
      intake.setDate(intake.getDate() - 89);
      const intakeStr = intake.toISOString().split('T')[0];

      expect(getDaysInStock(intakeStr, FIXED_REF_DATE)).toBe(89);
      expect(isAgingStock(intakeStr, FIXED_REF_DATE)).toBe(false);
    });

    it('evaluates exactly 90 days as NOT aging (strict > 90 benchmark)', () => {
      // 90 days before 2026-08-27 -> 2026-05-29
      const intake = new Date(FIXED_REF_DATE);
      intake.setDate(intake.getDate() - 90);
      const intakeStr = intake.toISOString().split('T')[0];

      expect(getDaysInStock(intakeStr, FIXED_REF_DATE)).toBe(90);
      expect(isAgingStock(intakeStr, FIXED_REF_DATE)).toBe(false);
    });

    it('evaluates exactly 91 days as AGING stock', () => {
      // 91 days before 2026-08-27 -> 2026-05-28
      const intake = new Date(FIXED_REF_DATE);
      intake.setDate(intake.getDate() - 91);
      const intakeStr = intake.toISOString().split('T')[0];

      expect(getDaysInStock(intakeStr, FIXED_REF_DATE)).toBe(91);
      expect(isAgingStock(intakeStr, FIXED_REF_DATE)).toBe(true);
    });
  });

  describe('getAgingTier', () => {
    it('correctly maps days to business tiers', () => {
      expect(getAgingTier(30)).toBe('HEALTHY');
      expect(getAgingTier(60)).toBe('HEALTHY');
      expect(getAgingTier(61)).toBe('WARNING');
      expect(getAgingTier(90)).toBe('WARNING');
      expect(getAgingTier(91)).toBe('AGING');
      expect(getAgingTier(120)).toBe('AGING');
      expect(getAgingTier(121)).toBe('CRITICAL');
      expect(getAgingTier(200)).toBe('CRITICAL');
    });
  });

  describe('calculateHoldingCost', () => {
    it('returns 0 for negative or zero price / days', () => {
      expect(calculateHoldingCost(0, 50)).toBe(0);
      expect(calculateHoldingCost(30000, 0)).toBe(0);
      expect(calculateHoldingCost(-5000, 30)).toBe(0);
    });

    it('calculates 0.05% daily carrying cost accurately', () => {
      // $50,000 vehicle for 100 days = $50,000 * 0.0005 * 100 = $2,500
      expect(calculateHoldingCost(50000, 100)).toBe(2500);
    });
  });

  describe('getVehicleAgingMetrics', () => {
    it('returns cohesive metrics object', () => {
      const intakeDate = '2026-05-15'; // 104 days before 2026-08-27
      const price = 40000;
      const metrics = getVehicleAgingMetrics(intakeDate, price, FIXED_REF_DATE);

      expect(metrics.daysInStock).toBe(104);
      expect(metrics.isAging).toBe(true);
      expect(metrics.tier).toBe('AGING');
      expect(metrics.estimatedHoldingCost).toBe(2080); // 40000 * 0.0005 * 104 = 2080
    });
  });
});
