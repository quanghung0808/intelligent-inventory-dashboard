# System Design Document: Intelligent Inventory Dashboard

## 1. Executive Summary & Context
The **Intelligent Inventory Dashboard** is a supply-domain solution designed for automotive dealership general managers and inventory directors. It provides real-time visibility into vehicle stock, highlights capital depreciation risks caused by aging inventory (>90 days), and enables actionable decision logging with an append-only audit trail.

This document outlines the architecture, component boundaries, data flow, API contract, observability strategy, and future-readiness considerations for the solution.

---

## 2. Core Assumptions & Boundary Conditions

| Ambiguity | Stated Assumption | Engineering Rationale |
|---|---|---|
| **Dealership Scope** | Single dealership view for demo, with tenant scoping (`dealershipId`) built into domain models. | Supports multi-tenancy in future database schemas without breaking API contracts. |
| **Inventory "Age" Definition** | Measured as `days = floor((referenceDate - intakeDate) / 86,400,000)`. | Intake date represents when capital was committed; listing/publication date is prone to marketing resets. |
| **Aging Threshold** | Exactly $> 90$ days on lot. | Industry benchmark where floor-plan interest, depreciation, and holding costs escalate significantly. |
| **Status Logging** | Append-only history record (`status`, `note`, `managerId`, `timestamp`). | Managers need full audit trails of historical pricing decisions and wholesale reviews, not just current state. |
| **"Real-Time" Updates** | Optimistic UI updates with cache invalidation and background polling via TanStack Query. | True WebSockets are over-engineered for inventory updates that change on minute/hour scales. |
| **Authentication / RBAC** | Mocked session with role `INVENTORY_MANAGER`. | Documented for future OAuth2/OIDC integration with JWT role verification. |

---

## 3. High-Level Architecture

The frontend is built with **React 19 + TypeScript + Vite**, communicating with an isolated API layer abstracted via **Mock Service Worker (MSW)**. This establishes a clean architectural seam where replacing mock data with a production backend requires zero changes to business or presentation components.

```mermaid
flowchart TB
    subgraph Client ["Frontend Client (React 19 + Vite + TypeScript)"]
        subgraph UI ["Presentation Layer (Tailwind CSS + Lucide)"]
            Dashboard["Dashboard Page"]
            KPICards["Aging Stock & Value KPI Cards"]
            FilterBar["Multi-Dimension Filter Bar"]
            InvTable["Inventory Grid / Table (Aging Highlighting)"]
            ActionModal["Action Logging & History Modal"]
            Toast["Optimistic Status & Error Notifications"]
        end

        subgraph StateLayer ["State & Data Fetching Layer"]
            TQ["TanStack Query (Cache, Invalidation, Optimistic Updates)"]
            Zustand["Zustand Store — lib/store.ts (Filters, Sort, Selected Vehicle)"]
        end

        subgraph DomainLayer ["Pure Domain Logic"]
            AgingCalc["aging.ts (Aging Rules, Holding Cost & Tiering)"]
            FilterLogic["filterVehicles.ts (Compound Predicates)"]
            Logger["logger.ts (Structured Telemetry Logger)"]
        end
    end

    subgraph NetworkSeam ["Network Abstraction Boundary"]
        FetchAPI["Standard fetch / axios client"]
        MSW["Mock Service Worker (Service Worker / Fetch Interceptor)"]
    end

    subgraph DataStorage ["Mock Persistence & Future Backend"]
        LocalStorage["Browser LocalStorage (Persisted Action Logs)"]
        SeedData["Deterministic Seed Dataset (100+ Vehicles)"]
        FutureBackend[("Future REST / GraphQL Backend + PostgreSQL")]
    end

    Dashboard --> KPICards & FilterBar & InvTable & ActionModal
    InvTable --> AgingCalc
    FilterBar --> FilterLogic
    ActionModal --> TQ
    InvTable --> TQ
    KPICards --> TQ

    TQ --> FetchAPI
    FetchAPI --> MSW
    MSW -.->|Intercepts Requests| LocalStorage
    MSW -.->|Reads Fallback| SeedData
    FetchAPI -.->|Production Target| FutureBackend
    Logger -.->|Emits Telemetry| Dashboard
```

---

## 4. Component Responsibilities & Boundaries

```mermaid
classDiagram
    class Vehicle {
        +string id
        +string vin
        +string make
        +string model
        +number year
        +string trim
        +number price
        +number mileage
        +string fuelType
        +string status
        +string intakeDate
        +ActionLog[] actionHistory
    }

    class ActionLog {
        +string id
        +string actionType
        +string note
        +string author
        +string timestamp
    }

    class AgingMetrics {
        +number daysInStock
        +boolean isAging
        +string agingTier
        +number estimatedHoldingCost
    }

    Vehicle "1" *-- "many" ActionLog
    Vehicle ..> AgingMetrics : evaluated by pure domain functions
```

### Component Catalog

1. **`AgingStockBanner / KPICards`**:
   - Computes real-time summaries: Total Units, Total Capital at Risk, Aging Stock Count ($>90$ days), and Average Days on Lot.
   - Provides a quick 1-click trigger to isolate critical aging inventory.

2. **`FilterBar`**:
   - Compound filtering across Make, Model, Fuel Type, Price Range, Age Range, and Aging Status.
   - Debounced search input on VIN/Make/Model for responsive filtering without render thrashing.

3. **`InventoryTable`**:
   - Sortable columns with visual priority badges (`Healthy: <60d`, `Warning: 61-90d`, `Aging: 91-120d`, `Critical: >120d`).
   - Accessible keyboard navigation and row click-to-inspect actions.

4. **`StatusPanel / ActionModal`**:
   - Displays complete vehicle details alongside chronological audit history.
   - Allows logging actions (`PRICE_DROP`, `SEND_TO_AUCTION`, `WHOLESALE_TRANSFER`, `RECONDITIONING`, `MARKETING_BOOST`).
   - Executes optimistic updates with automatic rollback on network failure.

5. **`aging.ts` (Domain Core)**:
   - Pure, deterministic calculation functions (`getDaysInStock`, `isAgingStock`, `getAgingTier`, `calculateHoldingCost`).
   - Decoupled from `Date.now()` by accepting an optional reference date for testability.

---

## 5. End-to-End Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Manager as Dealership Manager
    participant UI as ActionModal (React)
    participant Hook as useLogVehicleAction (TanStack Query)
    participant Cache as Query Cache
    participant MSW as Mock Service Worker
    participant Storage as LocalStorage Store

    Manager->>UI: Selects "PRICE_DROP" & submits note "$1,000 markdown"
    UI->>Hook: mutateAsync({ vehicleId, actionType, note })
    Hook->>Cache: 1. Snapshot previous state (for rollback)
    Hook->>Cache: 2. Optimistically append new ActionLog to cache
    Cache-->>UI: Instantly renders new log & updated badge
    Hook->>MSW: POST /api/vehicles/:id/actions
    MSW->>Storage: Persist action log to local store
    alt Success (200 OK)
        MSW-->>Hook: 200 OK with updated Vehicle entity
        Hook->>Cache: Invalidate & sync authoritative record
        UI-->>Manager: Success toast notification
    else Error (500 / Network Fail)
        MSW-->>Hook: 500 Internal Server Error
        Hook->>Cache: Rollback to previous state snapshot
        Cache-->>UI: Revert visual change
        UI-->>Manager: Error alert with retry option
    end
```

---

## 6. Technology Justifications

| Technology | Role | Justification |
|---|---|---|
| **React 19 + TypeScript** | UI & Type Safety | Strict contract validation, native transitions, compile-time type safety across API schemas. |
| **Vite** | Build Tooling | Sub-second HMR, instant cold start, optimized Rollup bundle configuration. |
| **Tailwind CSS + Radix/Lucide** | Styling & UI Primitives | Zero-runtime CSS overhead, accessible WAI-ARIA primitives, dark/light theme support. |
| **TanStack Query v5** | Server State Management | Out-of-the-box caching, deduplication, background polling, and declarative optimistic mutation rollbacks. |
| **Zustand** | Client UI State | Minimal, atomic store for filter/selection state; zero-boilerplate slice selectors prevent unnecessary re-renders from prop drilling. |
| **Mock Service Worker (MSW)** | API Mocking Seam | Intercepts requests at network level (Service Worker); allows 100% realistic `fetch` calls without coupling UI to mocks. |
| **Vitest + RTL** | Automated Testing | High-speed ESM-native test runner with JSDOM; identical matchers to Jest. |

---

## 7. Observability & Telemetry Strategy

Even in a frontend-focused service, production-grade observability is required:

```mermaid
flowchart LR
    subgraph TelemetrySources ["Telemetry Sources"]
        UserActions["User Interactions (Filter, Action Log)"]
        APIEvents["API Latency & Errors"]
        WebVitals["Core Web Vitals (LCP, FID, CLS)"]
    end

    subgraph LoggerModule ["logger.ts (Client Structured Logger)"]
        LevelFilter["Log Level (DEBUG, INFO, WARN, ERROR)"]
        ContextEnricher["Enrich with Timestamp, SessionID, DealershipID"]
    end

    subgraph Sinks ["Telemetry Sinks"]
        DevConsole["Browser Console (Dev Mode)"]
        RemoteSink["Remote Logging Pipeline (e.g., Datadog / Sentry)"]
    end

    UserActions --> LevelFilter
    APIEvents --> LevelFilter
    WebVitals --> LevelFilter
    LevelFilter --> ContextEnricher
    ContextEnricher --> DevConsole
    ContextEnricher -.->|Future Production| RemoteSink
```

1. **Structured Logging**: `lib/logger.ts` outputs JSON-structured events with event names (`vehicle.filter_applied`, `vehicle.action_logged`, `api.mutation_failed`), duration, and user context.
2. **Performance Monitoring**: Integration hook for Core Web Vitals (`onCLS`, `onFID`, `onLCP`) to identify render bottlenecks.
3. **Error Boundaries**: Root and component-level React error boundaries that capture unhandled runtime exceptions with breadcrumbs.

---

## 8. "Build for the Future" Scope Matrix

| Architectural Dimension | Implemented in Code (MVP) | Production Architecture (Documented Roadmap) |
|---|---|---|
| **Performance** | TanStack Query caching, client-side memoized filter indexes (`useMemo`). | TanStack Virtual for rendering 20,000+ items without DOM bloat; Edge CDN caching. |
| **Reliability** | Optimistic UI updates with snapshot rollback on 500 errors; Error Boundary. | Exponential backoff retry policies, offline IndexedDB sync queue via Workbox. |
| **Scalability** | Clean API seam via MSW with pagination query support (`?page=1&limit=25`). | Backend microservice with cursor-based pagination on indexed `(dealership_id, intake_date)` PostgreSQL tables. |
| **Maintainability** | Strict TypeScript interfaces derived from OpenAPI; pure domain helper functions. | Automated contract testing via Pact; shared npm/monorepo domain models package. |
| **Security & Auth** | Mock session context with manager roles. | OIDC / OAuth2 PKCE flow; backend RBAC validating JWT claims on mutation endpoints. |

---

## 9. GenAI Collaboration in System Design

During the design phase, Generative AI (Antigravity) was utilized strategically:
1. **Domain Modeling & Edge Case Discovery**: Prompted the AI to evaluate automotive inventory edge cases (e.g., inventory aging across leap years, vehicle transfers resetting intake dates vs. status logs).
2. **Contract-First Synthesis**: Co-designed the OpenAPI 3.0 specification (`docs/api-contract.yaml`) to ensure seamless synchronization between MSW mock handlers and frontend TypeScript types.
3. **Pragmatic Architecture Review**: Applied the **Ponytail (pragmatic/YAGNI)** and **Clean Code** principles to avoid over-engineering (e.g., electing TanStack Query polling over raw WebSocket infrastructure for this scale).
