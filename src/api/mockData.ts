import { Vehicle } from '../types/vehicle';

// Base reference date for deterministic mock dataset generation (e.g. 2026-08-27)
const BASE_DATE = new Date('2026-08-27T00:00:00Z');

function daysAgo(days: number): string {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

export const INITIAL_VEHICLES: Vehicle[] = [
  // CRITICAL AGING (>120 Days)
  {
    id: 'veh-001',
    vin: '1HGCR2F83HA100001',
    make: 'BMW',
    model: 'X5 xDrive40i',
    year: 2023,
    trim: 'M Sport Executive',
    price: 68500,
    mileage: 18400,
    fuelType: 'GASOLINE',
    status: 'AVAILABLE',
    intakeDate: daysAgo(142), // 142 days -> CRITICAL
    dealershipId: 'dlr-001',
    actionHistory: [
      {
        id: 'act-101',
        actionType: 'PRICE_DROP',
        note: 'Reduced price from $71,000 to $68,500 after 60-day review.',
        author: 'Marcus Vance (Inventory Manager)',
        timestamp: '2026-05-15T10:30:00Z',
      },
      {
        id: 'act-102',
        actionType: 'MARKETING_BOOST',
        note: 'Added to Facebook Auto Carousel campaign.',
        author: 'Elena Rostova (Digital Marketing)',
        timestamp: '2026-06-20T14:15:00Z',
      },
    ],
  },
  {
    id: 'veh-002',
    vin: '5UXCR6C05M9100002',
    make: 'Audi',
    model: 'e-tron GT',
    year: 2022,
    trim: 'Prestige AWD',
    price: 79900,
    mileage: 12100,
    fuelType: 'ELECTRIC',
    status: 'AVAILABLE',
    intakeDate: daysAgo(130), // 130 days -> CRITICAL
    dealershipId: 'dlr-001',
    actionHistory: [
      {
        id: 'act-103',
        actionType: 'PRICE_DROP',
        note: 'High floor-plan carrying cost. Initial markdown of $3,000 applied.',
        author: 'Marcus Vance (Inventory Manager)',
        timestamp: '2026-06-01T09:00:00Z',
      },
    ],
  },
  {
    id: 'veh-003',
    vin: 'WA1VAAF14ND100003',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2021,
    trim: 'C 300 4MATIC',
    price: 34500,
    mileage: 42300,
    fuelType: 'GASOLINE',
    status: 'WHOLESALE_SCHEDULED',
    intakeDate: daysAgo(125), // 125 days -> CRITICAL
    dealershipId: 'dlr-001',
    actionHistory: [
      {
        id: 'act-104',
        actionType: 'WHOLESALE_TRANSFER',
        note: 'Target auction scheduled for regional wholesale dealer block.',
        author: 'Marcus Vance (Inventory Manager)',
        timestamp: '2026-07-28T16:45:00Z',
      },
    ],
  },

  // AGING STOCK (91 - 120 Days)
  {
    id: 'veh-004',
    vin: '2C3CDXHG5NH100004',
    make: 'Ford',
    model: 'F-150 Lightning',
    year: 2023,
    trim: 'Lariat Extended Range',
    price: 64900,
    mileage: 9800,
    fuelType: 'ELECTRIC',
    status: 'AVAILABLE',
    intakeDate: daysAgo(105), // 105 days -> AGING
    dealershipId: 'dlr-001',
    actionHistory: [
      {
        id: 'act-105',
        actionType: 'PRICE_DROP',
        note: 'Adjusted down to align with regional market average.',
        author: 'Sarah Chen (Senior Buyer)',
        timestamp: '2026-07-10T11:20:00Z',
      },
    ],
  },
  {
    id: 'veh-005',
    vin: 'JN8AT2MV4NW100005',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    trim: 'Long Range AWD',
    price: 38900,
    mileage: 27500,
    fuelType: 'ELECTRIC',
    status: 'AVAILABLE',
    intakeDate: daysAgo(98), // 98 days -> AGING
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
  {
    id: 'veh-006',
    vin: '1FTEW1EP5PF100006',
    make: 'Porsche',
    model: 'Macan',
    year: 2022,
    trim: 'GTS',
    price: 74200,
    mileage: 21300,
    fuelType: 'GASOLINE',
    status: 'AVAILABLE',
    intakeDate: daysAgo(93), // 93 days -> AGING (Boundary test case)
    dealershipId: 'dlr-001',
    actionHistory: [
      {
        id: 'act-106',
        actionType: 'RECONDITIONING',
        note: 'Re-detailed wheels and ceramic refresh performed.',
        author: 'Marcus Vance (Inventory Manager)',
        timestamp: '2026-08-01T13:00:00Z',
      },
    ],
  },
  {
    id: 'veh-007',
    vin: '4S4WAAFD7P3100007',
    make: 'Toyota',
    model: 'RAV4 Prime',
    year: 2023,
    trim: 'XSE PHEV',
    price: 41500,
    mileage: 16200,
    fuelType: 'HYBRID',
    status: 'AVAILABLE',
    intakeDate: daysAgo(91), // 91 days -> AGING (Exact boundary + 1)
    dealershipId: 'dlr-001',
    actionHistory: [],
  },

  // WARNING TIER (61 - 90 Days)
  {
    id: 'veh-008',
    vin: '3KPA24AD7PE100008',
    make: 'Honda',
    model: 'CR-V Hybrid',
    year: 2024,
    trim: 'Sport Touring AWD',
    price: 37900,
    mileage: 8400,
    fuelType: 'HYBRID',
    status: 'AVAILABLE',
    intakeDate: daysAgo(90), // 90 days -> WARNING (Boundary upper limit)
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
  {
    id: 'veh-009',
    vin: 'KMHD84LF2PU100009',
    make: 'Hyundai',
    model: 'Ioniq 5',
    year: 2023,
    trim: 'Limited AWD',
    price: 43200,
    mileage: 14500,
    fuelType: 'ELECTRIC',
    status: 'AVAILABLE',
    intakeDate: daysAgo(89), // 89 days -> WARNING (Boundary - 1)
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
  {
    id: 'veh-010',
    vin: 'WP0AA2A94NS100010',
    make: 'Volvo',
    model: 'XC90 Recharge',
    year: 2023,
    trim: 'Ultimate T8',
    price: 62400,
    mileage: 22000,
    fuelType: 'HYBRID',
    status: 'AVAILABLE',
    intakeDate: daysAgo(75), // 75 days -> WARNING
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
  {
    id: 'veh-011',
    vin: 'SALWR2V42NA100011',
    make: 'BMW',
    model: '330i xDrive',
    year: 2022,
    trim: 'Premium Package',
    price: 36800,
    mileage: 31200,
    fuelType: 'GASOLINE',
    status: 'AVAILABLE',
    intakeDate: daysAgo(68), // 68 days -> WARNING
    dealershipId: 'dlr-001',
    actionHistory: [],
  },

  // HEALTHY INVENTORY (<60 Days)
  {
    id: 'veh-012',
    vin: 'YV4BR0CU7P1100012',
    make: 'Toyota',
    model: 'Tacoma',
    year: 2024,
    trim: 'TRD Off-Road 4x4',
    price: 46200,
    mileage: 4100,
    fuelType: 'GASOLINE',
    status: 'AVAILABLE',
    intakeDate: daysAgo(42), // 42 days -> HEALTHY
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
  {
    id: 'veh-013',
    vin: 'JTJBARBZ9P2100013',
    make: 'Lexus',
    model: 'RX 350',
    year: 2023,
    trim: 'Premium Plus',
    price: 52900,
    mileage: 18900,
    fuelType: 'GASOLINE',
    status: 'AVAILABLE',
    intakeDate: daysAgo(35), // 35 days -> HEALTHY
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
  {
    id: 'veh-014',
    vin: '5YJ3E1EB6PF100014',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    trim: 'Performance AWD',
    price: 49990,
    mileage: 1200,
    fuelType: 'ELECTRIC',
    status: 'SALE_PENDING',
    intakeDate: daysAgo(18), // 18 days -> HEALTHY
    dealershipId: 'dlr-001',
    actionHistory: [
      {
        id: 'act-107',
        actionType: 'STATUS_CHANGE',
        note: 'Deposit taken. Financing approval in progress.',
        author: 'Elena Rostova (Sales Consultant)',
        timestamp: '2026-08-25T15:30:00Z',
      },
    ],
  },
  {
    id: 'veh-015',
    vin: '1G1YB2D47P5100015',
    make: 'Chevrolet',
    model: 'Corvette Stingray',
    year: 2023,
    trim: '2LT Convertible',
    price: 78500,
    mileage: 6300,
    fuelType: 'GASOLINE',
    status: 'AVAILABLE',
    intakeDate: daysAgo(12), // 12 days -> HEALTHY
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
  {
    id: 'veh-016',
    vin: 'WBA53AY07PFP00016',
    make: 'BMW',
    model: 'i4 M50',
    year: 2024,
    trim: 'Gran Coupe AWD',
    price: 66900,
    mileage: 3800,
    fuelType: 'ELECTRIC',
    status: 'AVAILABLE',
    intakeDate: daysAgo(7), // 7 days -> HEALTHY
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
  {
    id: 'veh-017',
    vin: '3FA6P0HD8LR100017',
    make: 'Ford',
    model: 'Mustang Mach-E',
    year: 2023,
    trim: 'Premium Extended AWD',
    price: 44800,
    mileage: 15400,
    fuelType: 'ELECTRIC',
    status: 'AVAILABLE',
    intakeDate: daysAgo(4), // 4 days -> HEALTHY
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
  {
    id: 'veh-018',
    vin: '5N1AT2MV9PC100018',
    make: 'Nissan',
    model: 'Rogue',
    year: 2023,
    trim: 'SL AWD',
    price: 29500,
    mileage: 26100,
    fuelType: 'GASOLINE',
    status: 'AVAILABLE',
    intakeDate: daysAgo(2), // 2 days -> HEALTHY
    dealershipId: 'dlr-001',
    actionHistory: [],
  },
];
