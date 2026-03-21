## UNIPREP Admin – Architecture Diagrams

> These diagrams are intentionally high‑level and front‑end–focused. They describe how the Angular admin app is structured and how it talks to the backend APIs.

---

### 1. Logical Component Architecture

```mermaid
flowchart TB
    subgraph Shell["Application Shell & Layout"]
        Header["HeaderComponent\n(src/app/theme/components/header)"]
        Sidenav["SidenavComponent\n(src/app/theme/components/sidenav)"]
        RouterOutlet["RouterOutlet\n(pages-routing)"]
    end

    subgraph Pages["Feature Pages (src/app/pages)"]
        Companies["CompaniesComponent\n(companies/companies.component)"]
        Requirement["Requirement / Orders Components\n(requirement/*)"]
        Partner["Partner / Org Users Components\n(partneruser/*)"]
        Subscription["Subscription & Reports\n(subscription, report, etc.)"]
        Others["Other Admin Features\n(users, events, faq, ... )"]
    end

    Shell --> RouterOutlet
    RouterOutlet --> Companies
    RouterOutlet --> Requirement
    RouterOutlet --> Partner
    RouterOutlet --> Subscription
    RouterOutlet --> Others
```

**Explanation**

- The app uses a **single layout** (header + sidenav + router outlet).
- The router loads **feature components** under `src/app/pages` lazily.

---

### 2. Companies Feature – Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as CompaniesComponent
    participant S as CompaniesService
    participant API as Backend API (environment.ApiUrl)

    U->>C: Load / Filter / Paginate companies
    C->>S: getCompanyList(params)
    S->>API: POST /companies-list-for-admin
    API-->>S: { data: { companies, totals... } }
    S-->>C: Observable<CompanyListResponse>
    C->>C: update companies, filteredCompanies,\nsummaryCards, pagination

    U->>C: Select rows + click "Delete Selected"
    C->>C: validate selection
    C->>C: show ConfirmDialog
    U->>C: Confirm disable
    C->>S: disableCompanies({ employer_id: number[] })
    S->>API: POST /companies-disable
    API-->>S: { status, message }
    S-->>C: Observable<ApiResponse>
    C->>C: show toast, clear selection,\nrefresh list via getCompanyList(...)
```

---

### 3. Requirement / Order – Simplified Flow

```mermaid
sequenceDiagram
    participant U as User
    participant V as ViewOrderComponent
    participant R as RecruitmentService
    participant API as Backend API

    U->>V: Open order (view/edit)
    V->>R: fetchOrderDetails(order_id)
    R->>API: GET/POST /order-details
    API-->>R: order + requirement + transaction
    R-->>V: mapped view model
    V->>V: populate reactive form + table

    U->>V: Edit order fields & status
    U->>V: Click "Update"
    V->>R: updateRequirement(updateData)
    R->>API: POST /update-requirement

    alt Order status changed
        V->>R: updateOrderStatus({ order_id, status })
        R->>API: POST /update-order-status
    end

    API-->>R: success
    R-->>V: success
    V->>V: show toast, refresh list
```

---

### 4. Deployment / Runtime View (Front‑End Focused)

```mermaid
flowchart LR
    Dev["Developer Machine\nng serve / ng build"]
    Dist["Built Angular App\n(dist/)"]
    Web["Web Server / CDN\n(Nginx, cloud hosting, etc.)"]
    Browser["Admin User Browser"]
    Backend["Backend API Server\n(REST, environment.ApiUrl)"]

    Dev --> Dist
    Dist --> Web
    Browser --> Web
    Web --> Browser
    Browser --> Backend
    Backend --> Browser
```

**Notes**

- The Angular app is compiled into static assets (`dist/`).
- A web server (or CDN + origin) serves the SPA.
- The SPA talks to the backend via `environment.ApiUrl` over HTTPS.

---

### 5. Extending the Architecture

When adding a new feature:

```mermaid
flowchart TB
    NewPage["Create new feature folder\nsrc/app/pages/<feature>"]
    Comp["Add <feature>.component\n+ HTML / SCSS"]
    Service["Add <feature>.service\n(HttpClient APIs)"]
    Route["Register route in\npages-routing.module.ts"]
    UI["Use PrimeNG components\n(p-table, p-dialog, etc.)"]

    NewPage --> Comp
    NewPage --> Service
    Comp --> Route
    Comp --> UI
    Service --> API["New/Existing Backend APIs"]
```

This keeps the architecture **feature‑oriented**, consistent with existing pages like `companies`, `requirement`, `partneruser`, etc.

