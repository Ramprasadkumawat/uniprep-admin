# UNIABROAD-ADMIN

**Admin dashboard for UniAbroad** — an Angular-based administrative panel built with Angular v20 and a collection of UI, editor, and state-management libraries (PrimeNG, NgRx, CKEditor, Font Awesome, Highcharts, etc.).

---

## Table of contents

* [Prerequisites](#prerequisites)
* [Quick start](#quick-start)
* [Available scripts](#available-scripts)
* [Key dependencies & features](#key-dependencies--features)
* [Development workflow](#development-workflow)
* [Building for production](#building-for-production)
* [Testing](#testing)
* [Editor (CKEditor & Quill) notes](#editor-ckeditor--quill-notes)
* [Common troubleshooting](#common-troubleshooting)
* [Contributing](#contributing)
* [License](#license)

---

## Prerequisites

* Node.js (recommended **v18–v20**).
* npm (recommended **v9+**) or an equivalent package manager that supports the `package.json` format.
* Angular CLI matching the project's major version (Angular CLI `^20.1.x` recommended).

> Confirm your Node and npm versions before installing:

```bash
node -v
npm -v
```

---

## Quick start

1. Clone the repository:

```bash
git clone <repo-url>
cd UNIABROAD-ADMIN
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm start
# or
ng serve
```

Open your browser at `http://localhost:4200` (default Angular dev server URL).

---

## Available scripts

The `package.json` exposes these npm scripts:

* `npm run ng`
  Shortcut to run the Angular CLI (`ng`).

* `npm start`
  `ng serve` — starts the development server with live reload.

* `npm run build`
  `ng build` — builds the project (by default for production unless configuration provided).

* `npm run watch`
  `ng build --watch --configuration development` — continuously builds in development mode while watching for file changes.

* `npm test`
  `ng test` — runs the unit test runner (Karma/Jasmine configured).

Use `npm run <script>` to execute any of the above scripts.

---

## Key dependencies & features

This project includes a number of libraries and integrations. Below are the highlights and what they are used for:

* **Angular v20** (`@angular/*`) — core framework.
* **NgRx** (`@ngrx/store`, `@ngrx/effects`) — reactive state management.
* **PrimeNG / PrimeUI** (`primeng`, `@primeng/themes`, `primeicons`, `@primeuix/*`) — UI component library and themes.
* **CKEditor 5** (`@ckeditor/*`, `@ckeditor/ckeditor5-build-classic`, `@ckeditor/ckeditor5-angular`) — rich text editor with many plugins (table, image, heading, upload, etc.).
* **Quill** & **angular-editor** — alternate WYSIWYG editor options.
* **Highcharts / angular-highcharts** & **chart.js** — charts and visualizations.
* **Bootstrap 5** & **bootstrap-icons** — layout and iconography.
* **Font Awesome** (`@fortawesome/*`) — icons integration.
* **ngx-intl-tel-input**, **google-libphonenumber**, **intl-tel-input** — telephone input with validation/formatting.
* **ngx-markdown** — render Markdown content.
* **ngx-localstorage** — client-side storage utilities.
* **ngx-ui-loader** — configurable loading indicators.
* **file-saver / ngx-filesaver** — export/download utilities.
* **subsink** — subscription management helper.
* **rxjs** — reactive programming.
* **tslib**, **zone.js** — Angular runtime helpers.

---

## Development workflow

* Use feature branches for work, follow your team's branching convention (e.g. `feat/`, `fix/`, `chore/`).
* Linting/formatting: If your repo uses ESLint / Prettier, run them before committing.
* State management: Use NgRx `store` + `effects` for global application state; keep feature modules encapsulated.
* UI: Use PrimeNG components and theme system; add custom styles in component SCSS when necessary.
* Assets & environment: Place static assets in `src/assets`. Use `src/environments/environment.ts` and `environment.prod.ts` (or other config files) for environment-specific configuration (API base URLs, keys, feature flags).

---

## Building for production

Build production bundle:

```bash
npm run build
# or explicitly
ng build --configuration production
```

Consider enabling:

* Optimization and AOT (Angular handles this in production config).
* Build analysis tools to check bundle size (e.g., `ng build --stats-json` and analyze with `source-map-explorer`).

---

## Testing

Unit tests are configured with Karma + Jasmine by default:

```bash
npm test
```

Add/change tests under `src/app` near the components/services you add. Consider adding:

* Test beds for components.
* Mock stores/providers for NgRx-related unit tests.
* Coverage checks (karma-coverage is listed in `devDependencies`).

---

## Editor (CKEditor & Quill) notes

* CKEditor has many individual plugin packages included (alignment, image, upload, paste-from-office, table, etc.). If you customize CKEditor builds or add image upload handlers, ensure:

    * Proper configuration of the CKFinder/upload adapter or any backend endpoint.
    * Allowed content/toolbar settings are included in the editor configuration.
* Quill and `angular-editor` are available as alternatives — pick one editor per use-case to avoid conflicts.

---

## Common troubleshooting

* **Build errors about TypeScript versions**: Ensure local `typescript` matches the Angular supported version (project uses `~5.8.3`).
* **Zone related runtime warnings**: Ensure `zone.js` is loaded (package included: `~0.15.1`).
* **CKEditor runtime issues**: Confirm you imported the right Angular wrapper module (`CKEditorModule`) and that any custom builds have been properly bundled.
* **Phone input/intl lib errors**: `intl-tel-input` often expects certain CSS or assets; confirm those files are referenced in `angular.json` assets/styles.
* **Missing icons/styles**: Make sure `primeicons`, `bootstrap-icons`, Font Awesome CSS are included in `angular.json` or imported globally.
* **Large bundle size**: Analyze bundles and consider lazy-loading feature modules; tree-shake unused charting/editor plugins.

---

## DevDependencies

Development tooling includes:

* `@angular/cli`, `@angular/compiler-cli`, `@angular/build` — Angular tooling.
* `typescript` `~5.8.3` — compile-time type checking.
* Test tooling: `jasmine-core`, `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`.
* Type definitions for Node, Jasmine, Jest, Mocha are included for testing and tooling needs.

---

## Security & Environment

* **Do not** commit secrets (API keys, credentials) to the repository. Use environment variables or secret management.
* When deploying, confirm proper CORS and secure headers on backend APIs.
* If using JWT (`@auth0/angular-jwt` is included), ensure tokens are stored securely (prefer non-persistent storage if appropriate) and refresh/expiration flows are handled safely.

---