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

### 1. High-Level Strategy & Direction
Generative AI (Google DeepMind Antigravity) was engaged as an active pair programmer and architectural co-designer under strict engineering guardrails:
- **Contract-First Modeling**: Used AI to synthesize the OpenAPI 3.0 specification ([docs/api-contract.yaml](docs/api-contract.yaml)) before writing frontend components, ensuring strict type safety.
- **The Ponytail Principle (Pragmatic & Minimal)**: Enforced simplicity over premature abstractions (e.g., pure date utilities in `aging.ts` with injectable reference dates, standard library before dependencies).
- **Vercel React Performance Rules**: Enforced zero waterfalls (`async-parallel`), in-render derived states without redundant `useEffect` chains, and optimistic mutation patterns with automatic rollback.

### 2. Verification & Quality Assurance Process
- **Deterministic Boundary Testing**: Directed AI to construct explicit boundary test cases for `89`, `90`, and `91` days (`tests/lib/aging.test.ts`) to rigorously prove the $>90$ days aging threshold.
- **Fault-Tolerance Verification**: Built an interactive simulated 500 error toggle in the UI and automated test harness (`tests/components/Rollback.test.tsx`) asserting that TanStack Query snapshots rollback state upon failure.
- **Strict Static Typing**: Configured strict TypeScript compiler options (`npx tsc -b`) ensuring zero type warnings and complete contract alignment.

---

## 📖 Architecture & Design Documentation

For in-depth architecture diagrams, data flow models, and API specifications:
- [System Design Document](docs/system-design.md)
- [OpenAPI 3.0 API Specification](docs/api-contract.yaml)
- [Agent & Developer Guidelines](AGENTS.md)
