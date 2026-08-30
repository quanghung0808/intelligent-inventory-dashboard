# Intelligent Inventory Dashboard

A high-performance automotive inventory dashboard for dealership managers to monitor vehicle stock in real-time, identify aging inventory (>90 days), and execute actionable decision workflows with optimistic UI updates and an append-only audit trail.

---

## 📋 Prerequisites

Ensure your machine has the following installed:
- **Node.js**: `v18.0.0+` (Tested on `v20.x` / `v22.x`)
- **npm**: `v9.0.0+`
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
cd intelligent-inventory-dashboard
npm install
```

---

## 🚀 How to Run

### Development Mode (with MSW Mock API)
Starts the local development server with Mock Service Worker (MSW) active:

```bash
npm run dev
```

- **URL**: [http://localhost:5173](http://localhost:5173)
- **Mock API**: MSW automatically intercepts network requests (`/api/vehicles`) directly in the browser.
- **Persistence**: Logged actions persist in browser `localStorage`.

### Production Preview Mode
Serves the compiled production bundle locally:

```bash
npm run preview
```

- **URL**: [http://localhost:4173](http://localhost:4173)

---

## 🏗️ How to Build

Compiles TypeScript and bundles the application for production:

```bash
npm run build
```

- Runs `tsc -b` (strict type-checking with 0 errors).
- Generates optimized static assets in the `dist/` directory.

---

## 🧪 How to Test

Runs the automated test suite powered by **Vitest** and **React Testing Library**:

```bash
# Run all tests once
npm test

# Run tests in interactive watch mode
npm run test:watch
```

---

## ⚡ Interactive Demo: Testing Failure & Rollback

1. Run `npm run dev` and open [http://localhost:5173](http://localhost:5173).
2. Toggle the **"Simulate 500 Error"** switch in the top-right corner of the **Navbar**.
3. Click **"Log Decision"** on any vehicle and submit an action (e.g., `Price Drop`).
4. **Result**: The action optimistically updates the timeline immediately, encounters the simulated 500 error, automatically rolls back to the previous state, and displays an error toast notification.

---

## 🤖 AI Collaboration Narrative

### Strategy

AI (Google DeepMind Antigravity) was used as a pair programmer under strict engineering guardrails. Each session was guided by a specific **skill** — a focused ruleset that constrained the AI's output to a single concern:

| Skill | Applied to | What it enforced |
|---|---|---|
| `ponytail` | `lib/aging.ts`, formatters, API handlers | YAGNI and minimalism — pure functions, native `Intl` APIs, no unnecessary abstractions |
| `clean-code-principles` | `InventoryTable`, `StatusPanel`, `FilterBar` | SOLID SRP — each 400+ line file split into focused feature folders; DRY — `formatCurrency` extracted to `lib/formatters.ts` |
| `vercel-react-best-practices` | `Dashboard.tsx`, `useVehicles.ts` | Zero waterfalls, `useMemo` derived state, atomic Zustand selectors, optimistic updates with `onError` rollback |
| `vercel-composition-patterns` | `InventoryTable`, `StatusPanel` | Compose sub-panels instead of boolean props — `VehicleCard`/`VehicleTableRow` per breakpoint, `ActionForm`/`ActionTimeline` as independent panels |
| `software-ui-ux-design` | All components | Consistent risk color system, WCAG keyboard accessibility, responsive layouts, skeleton loading states |

### Verification

AI output was never accepted without verification. Every file went through:

1. `npx tsc --noEmit` — zero TypeScript errors
2. `npx vitest run` — 22 tests, 100% pass rate
3. `npm run build` — clean production bundle
4. Manual review against `docs/api-contract.yaml`

Boundary tests at `89`, `90`, and `91` days prove the strict `> 90` aging threshold. Optimistic rollback is verified by a simulated 500 error in `tests/components/Rollback.test.tsx`.

---

## 📖 Documentation

- [System Design Document](docs/system-design.md)
- [OpenAPI 3.0 API Specification](docs/api-contract.yaml)
- [Agent & Developer Guidelines](AGENTS.md)
