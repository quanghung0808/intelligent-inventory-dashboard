# Agent & Developer Guidelines: Intelligent Inventory Dashboard

This repository follows strict engineering, design, and AI collaboration principles. All contributing agents and engineers must adhere to the rules outlined in this document.

---

## 1. Core Engineering Principles

### 1.1 The Ponytail Principle (Pragmatic & Minimal)
- **The Ladder of Restraint**:
  1. YAGNI: If not required by the core prompt or design doc, skip it.
  2. Prefer native Web platform features and standard library before adding third-party libraries.
  3. Shortest working, readable diff wins.
  4. Explicit code comments (`// ponytail: reason`) on deliberate simplifications.
- **No Unrequested Abstractions**: Avoid premature multi-layer interfaces where a pure function or direct hook suffices.

### 1.2 Vercel React Best Practices
- **Zero Waterfalls (`async-parallel`)**: Parallelize independent data fetches.
- **Clean Component Boundaries (`rerender-memo`, `rerender-derived-state`)**:
  - Derive filter counts and aging metrics in render or memoized hooks without unnecessary `useEffect` churn.
  - Keep client state close to where it is consumed.
- **Predictable Optimistic Updates**:
  - Use TanStack Query `onMutate` to snapshot cache and optimistically apply action logs.
  - Implement mandatory `onError` rollback to ensure state consistency.

### 1.3 Clean Code & SOLID Standards
- **Single Responsibility (`solid-srp`)**:
  - `src/lib/aging.ts` is responsible *only* for deterministic date calculations and tier logic.
  - `src/api/handlers.ts` is responsible *only* for network interception and contract mapping.
  - Presentation components render UI and dispatch events.
- **Deterministic Domain Functions**:
  - Never call `new Date()` inside pure utility functions without allowing an optional `referenceDate` parameter for test injection.

---

## 2. Directory Structure & Naming Conventions

```
intelligent-inventory-dashboard/
├── docs/
│   ├── system-design.md     # Architecture, data flow, telemetry & future roadmap
│   └── api-contract.yaml    # OpenAPI 3.0 specification contract
├── src/
│   ├── api/                 # MSW mock server, handlers, and localStorage state
│   ├── components/          # React presentation components
│   ├── hooks/               # TanStack Query custom hooks
│   ├── lib/                 # Pure domain logic (aging, filtering, telemetry)
│   ├── types/               # TypeScript models mirrored from OpenAPI
│   ├── pages/               # Top-level page views (Dashboard)
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── lib/                 # Pure domain logic unit tests (boundary checks)
│   └── components/          # Component integration & interaction tests
├── PLAN.md                  # Phase tracking checklist
├── AGENTS.md                # This guideline document
└── README.md                # Setup, run, AI collaboration narrative
```

---

## 3. Verification Protocol

Before declaring any phase complete or submitting code:
1. **Type Check**: Run `npx tsc --noEmit` to ensure zero TypeScript errors.
2. **Automated Unit & Integration Tests**: Run `npm test` or `npx vitest run` — 100% tests must pass.
3. **Boundary Validation**:
   - `getDaysInStock` and `isAgingStock` must have explicit test cases for `89`, `90`, and `91` days.
   - Optimistic rollback must be tested with simulated 500 error responses.
4. **Lint & Build**: Run `npm run build` to ensure the production bundle builds without errors or missing asset references.

---

## 4. AI Collaboration & Verification Rules
When generating or refactoring code:
- Check generated code against `docs/api-contract.yaml` schemas.
- Ensure all mutation handlers include error rollback logic.
- Document any non-obvious engineering decisions and trade-offs in `README.md`.
