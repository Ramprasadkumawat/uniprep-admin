## UNIPREP Admin – Architecture

### 1. Overview

The UNIPREP Admin application is a **single-page web application** built with **Angular** and **PrimeNG**. It is primarily a front‑end for internal admin workflows such as company management, requirements, talent delivery, partners, subscriptions, reports, and configuration.

- **Framework**: Angular (standalone/feature‑module hybrid style)
- **UI Library**: PrimeNG (tables, dialogs, selects, multiselects, toasts, confirm dialogs, etc.)
- **Language**: TypeScript / SCSS / HTML templates
- **Build Tooling**: Angular CLI (`ng build`, `ng serve`)
- **Backend Integration**: REST APIs exposed via `environment.ApiUrl` using Angular `HttpClient`

The project follows a **feature‑first folder structure**, with each major feature located under `src/app/pages/<feature>` and sharing UI components under `src/app/theme`.

### 2. High‑Level Front‑End Architecture

#### 2.1 Application Shell

- **Routing**: Centralized in `src/app/pages/pages-routing.module.ts`, which defines lazy‑loaded routes for each admin feature (e.g. `companies/view-companies`, `jobs/view-jobs`, `requirement/...`, `partneruser/...`).
- **Layout**: Common header, sidebar, and content area are implemented in shared theme components under `src/app/theme/components` (e.g. `header`, `sidenav`).
- **Authentication/Context**: User details and permissions are fetched via an auth service (e.g. `authservice.getUserDetails$`) and used by layout components to show the current user, country context, etc.

#### 2.2 Feature Modules / Pages

Each **page folder** under `src/app/pages` encapsulates:

- One or more **Angular components** (`*.component.ts` / `.html` / `.scss`)
- A **service** for API integration (`*.service.ts`)
- Optional **routing** (when the feature has sub‑pages)

Examples:

- `src/app/pages/companies/`
  - `companies.component.ts/html/scss` – Companies list, filters, summary cards
  - `companies.service.ts` – API calls such as `companies-list-for-admin`, `companies-disable`, exports, dropdown data
- `src/app/pages/requirement/`
  - `view-order`, `add-requirement`, `delivered-talents`, etc. – order and talent management UIs
  - `recruitment.service.ts` – requirement and order‑status APIs
- `src/app/pages/partneruser/`
  - `addpartner`, `add-organization-users`, etc. – partner onboarding and organization users

Each feature component is responsible for:

- Owning its **Reactive Forms** for filters and detail dialogs
- Calling its feature service for **CRUD** and **list** operations
- Managing feature‑local state such as selected rows, pagination, sorting, and dialog visibility

#### 2.3 Shared UI & Utilities

- **Theme components**: `header`, `sidenav`, and other shared layout pieces live under `src/app/theme/components`.
- **PrimeNG** is heavily used for:
  - `p-table` for data grids with lazy loading and server‑side pagination
  - `p-dialog` for modal forms and detail views
  - `p-select`, `p-multiSelect` for dropdowns and multi‑selects
  - `p-toast` for feedback messages
  - `p-confirmDialog` (and previously `p-confirmPopup`) for destructive‑action confirmations
- **Styling**: Feature‑specific SCSS lives beside each component (`*.component.scss`), while global styles are defined in the global stylesheets configured in `angular.json`.

### 3. Data Flow & API Integration

#### 3.1 Typical Request Flow

1. A component reacts to a user action (e.g. filter form submit, clicking “Delete Selected”, “Generate Payment Link”, etc.).
2. The component builds a **request payload** (query params or body) based on current form or selection state.
3. The feature service uses `HttpClient` to call `environment.ApiUrl + <endpoint>`.
4. The component subscribes to the observable and:
   - Updates local state (`companies`, `filteredCompanies`, summary counters, etc.)
   - Shows success/error **toast messages** via `MessageService`
   - Updates UI elements such as tables, dialogs, and badges.

#### 3.2 Examples

- **Companies list** (`companies.component.ts` / `.service.ts`)
  - `getCompanyList` – paginated and filtered list for admins
  - `export` – server‑side CSV/Excel export
  - `disableCompanies` – POST to `/companies-disable` with `employer_id: number[]`
- **Requirements / Orders** (`view-order.component.ts` / `recruitment.service.ts`)
  - `updateRequirement` – update requirement and order data
  - `updateOrderStatus` – POST `/update-order-status` with `{ order_id, status }`
  - `generatePaymentLink` – create payment links for orders

### 4. State Management

The app relies mostly on **component‑local state** and **service‑scoped observables**:

- `BehaviorSubject` for cross‑component state (e.g. currently edited company, mode `view|edit`)
- Local arrays and pagination fields in components (e.g. `companies`, `filteredCompanies`, `currentPage`, `pageSize`)
- Reactive Forms (`FormGroup`) for filters and edit forms

There is **no global store** like NgRx; each feature manages its own state and fetches from the backend as needed.

### 5. Error Handling & UX

- **Error Handling**:
  - `try/catch` where needed
  - HTTP errors routed to `MessageService` (`p-toast`) with user‑friendly messages
  - Defensive checks for `null`/`undefined` fields in API responses
- **UX Patterns**:
  - Lazy‑loaded tables with large data sets (server‑side pagination, PrimeNG `onLazyLoad`)
  - Debounced search inputs for API efficiency
  - Confirm dialogs before destructive operations (disable/delete)
  - Status badges with color coding for key statuses (order status, payment status, etc.)

### 6. Deployment & Build

- The Angular app is built with `ng build` producing optimized JS/CSS bundles under `dist/`.
- Built assets are assumed to be served behind a **reverse proxy** or **static file server** (e.g. Nginx, cloud hosting) that also proxies API calls to the backend defined by `environment.ApiUrl`.

For visual representations of this architecture and key data flows, see `ARCHITECTURE_DIAGRAMS.md`. For a concise, non‑technical overview, see `ARCHITECTURE_SUMMARY.md`.

