## UNIPREP Admin – Architecture Summary

### What this app is

UNIPREP Admin is an **internal admin console** built with **Angular** and **PrimeNG**. It is used by operations, QA, and support teams to manage:

- Companies and employers
- Requirements / orders and delivered talents
- Partners and organization users
- Subscriptions, reports, QA tools, and other admin workflows

### High‑level design

- **Frontend only repo**: This project is the **Angular SPA** that talks to a separate backend over HTTP.
- **Feature‑first structure**:
  - Each feature lives under `src/app/pages/<feature>` (e.g. `companies`, `requirement`, `partneruser`, `subscription`, etc.).
  - Each feature folder contains its own components, HTML templates, SCSS, and a service to call its APIs.
- **Shared layout & theming**:
  - Common header, sidebar, and layout components in `src/app/theme/components`.
  - PrimeNG components used for tables, dialogs, forms, toasts, and confirm dialogs.

### Data & API

- All data is loaded and saved through REST APIs exposed at `environment.ApiUrl`, via Angular `HttpClient`.
- Each feature has a dedicated service (e.g. `companies.service.ts`, `recruitment.service.ts`) responsible for:
  - Building request payloads
  - Calling the correct API endpoints
  - Returning observables to the components
- Components subscribe to service methods, update their local state, and drive the UI (tables, dialogs, badges, etc.).

### State management

- **Local state** inside components for:
  - Filters (Reactive Forms)
  - Pagination/sorting
  - Dialog visibility
  - Current selections (e.g. selected companies for bulk actions)
- **Shared state** across components via:
  - `BehaviorSubject` in services (e.g. “company to edit” and “mode: view/edit” in `CompaniesService`).
- There is **no global NgRx store**; the pattern is “smart components + thin services”.

### Key patterns

- **Tables with server‑side pagination** (PrimeNG `p-table` + `onLazyLoad`).
- **Dialogs for CRUD**:
  - `p-dialog` used for view/edit forms, remarks, and detail views.
- **Confirmations & toasts**:
  - `p-confirmDialog` before destructive actions (disable/delete).
  - `p-toast` for success/error/warning feedback.
- **Performance optimizations**:
  - Lazy loading of dropdown data and virtual scrolling on large selects.
  - Debounced search inputs to avoid flooding the backend with requests.

### How to extend

To add a new feature:

1. Create a new folder under `src/app/pages/<new-feature>/`.
2. Add the component(s) and HTML/SCSS.
3. Add a `<new-feature>.service.ts` with `HttpClient` calls.
4. Register a lazy‑loaded route in `pages-routing.module.ts`.
5. Use existing patterns for:
   - Tables (filters, pagination)
   - Dialogs
   - Toasts and confirm dialogs

For more detailed diagrams and data‑flow views, see `ARCHITECTURE_DIAGRAMS.md`. For lower‑level technical details, see `ARCHITECTURE.md`.

