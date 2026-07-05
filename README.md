# ColdTrack Front

ColdTrack Front is a Vue 3.5 web application for monitoring refrigerated shipments. It connects logistics teams with the ColdTrack REST API to manage shipments, IoT sensors, telemetry readings, alerts, historical analytics, and PDF reports.

## Live Services

- Frontend: https://coldtrack-front-web.web.app
- Backend API: https://freshguard-coldtrack-platform.onrender.com
- API documentation: https://freshguard-coldtrack-platform.onrender.com/swagger/index.html

The production frontend communicates directly with the deployed backend. API credentials and database secrets are never stored in this repository.

## Features

- JWT sign-in and user registration.
- Shipment dashboard backed by real analytics data.
- Shipment registration and lifecycle monitoring.
- Shipment detail dialog with assigned sensor, latest telemetry, and related alerts.
- Controlled shipment status transitions from the dashboard.
- Sensor registration, assignment, and telemetry recording.
- Alert filtering, acknowledgement, and resolution.
- Completed shipment history and PDF report downloads from dashboard, alerts, and history.
- English and Spanish internationalization with English as the default language.
- Responsive Material-themed PrimeVue interface.
- ARIA landmarks, labels, and document-language synchronization.

## Technologies

- JavaScript
- Vue 3.5 with Composition API
- Vite
- PrimeVue, PrimeIcons, and PrimeFlex
- Vue Router
- Vue I18n
- Axios
- Firebase Hosting

## Project Structure

The application follows a modular organization inspired by Domain-Driven Design and the bounded-context structure used in the course reference projects. Each feature keeps business language, state coordination, API communication, and views separated so the user interface can evolve without mixing HTTP concerns with presentation code.

- `src/iam`: authentication and account workflows.
- `src/shipments`: shipment domain, application state, infrastructure, and views.
- `src/sensors`: sensor assignment and telemetry workflows.
- `src/alerts`: alert lifecycle management.
- `src/analytics`: dashboard metrics, history, and reports.
- `src/shared`: reusable layout, HTTP, session, and presentation elements.
- `src/locales`: English and Spanish translation dictionaries.

Physical files use kebab-case. Domain and application files include descriptive suffixes such as `.entity.js`, `.store.js`, and `.service.js`.

## Bounded Contexts

### IAM

The IAM context owns sign-in, sign-up, active session state, JWT persistence, request authorization, and route protection.

- Domain: `user.entity.js` models the authenticated ColdTrack user.
- Application: `authentication.store.js` coordinates sign-in, sign-up, sign-out, and session restoration.
- Infrastructure: `users-api.service.js`, `iam.interceptor.js`, and `authentication.guard.js` connect the UI with the backend authentication endpoints and protected navigation.
- Presentation: `sign-in-view.vue` and `sign-up-view.vue` render the public access workflows.

### Shipments

The Shipments context owns the operational shipment lifecycle shown in the dashboard, new-shipment form, detail dialog, status transitions, and completed-shipment history.

- Domain: `shipment.entity.js` represents shipment state used by the interface.
- Application: `shipments.store.js` orchestrates fetching, creating, selecting, and updating shipments.
- Infrastructure: `shipments-api.service.js` communicates with the REST API.
- Presentation: dashboard, new-shipment, and history views expose the workflows to users.

### Sensors

The Sensors context owns sensor listing, sensor registration, assignment to shipments, and telemetry recording from the frontend.

- Domain: `sensor.entity.js` represents a monitoring sensor.
- Application: `sensors.store.js` coordinates sensor and telemetry use cases.
- Infrastructure: `sensors-api.service.js` consumes the backend sensor and telemetry endpoints.
- Presentation: `sensors-view.vue` provides the sensor management workspace.

### Alerts

The Alerts context owns alert listing, filtering, acknowledgment, and resolution.

- Domain: `alert.entity.js` models alert status, severity, and related shipment information.
- Application: `alerts.store.js` coordinates alert state and actions.
- Infrastructure: `alerts-api.service.js` communicates with alert lifecycle endpoints.
- Presentation: `alerts-view.vue` exposes incident monitoring to users.

### Analytics

The Analytics context owns dashboard metrics, completed shipment history, and PDF report generation/downloads.

- Domain: `dashboard-metrics.entity.js` and `historical-shipment.entity.js` represent analytical projections used by the UI.
- Application: `analytics.store.js` coordinates metrics, history, and report actions.
- Infrastructure: `analytics-api.service.js` consumes analytics and reporting endpoints.

### Shared

The Shared context contains cross-cutting functionality used by multiple contexts.

- `http-client.js` centralizes Axios configuration and IAM interceptors.
- `api-endpoints.js` centralizes endpoint paths from Vite environment variables.
- `session-storage.js` manages local JWT session persistence.
- `blob-download.js` handles PDF downloads.
- `app-layout.vue` and `language-switcher.vue` provide reusable presentation elements.

## Layer Responsibilities

- Domain layer: framework-light models that express business concepts used by the frontend.
- Application layer: Pinia stores that coordinate use cases and expose reactive state to views.
- Infrastructure layer: API services, interceptors, guards, endpoint configuration, and file helpers.
- Presentation layer: Vue views and components that render workflows and call application stores.

Presentation components do not call raw Axios clients directly. They delegate behavior to stores, while infrastructure services handle backend communication and payload adaptation.

## Routing And Session Protection

Vue Router defines public routes for `sign-in` and `sign-up`, and protected routes for dashboard, shipments, sensors, alerts, and history. The global navigation guard delegates access control to `authentication.guard.js`.

The HTTP client attaches the JWT through the IAM request interceptor and handles unauthorized responses through the IAM response interceptor. This keeps backend authentication concerns centralized and avoids duplicating token logic across feature modules.

## Backend Contract

The production frontend consumes the FreshGuard ColdTrack Platform REST API. The main integration points are:

- Authentication: `/api/v1/authentication/sign-in`, `/api/v1/authentication/sign-up`, `/api/v1/users/me`.
- Shipments: `/api/v1/shipments`, `/api/v1/shipments/{shipmentId}`, `/api/v1/shipments/{shipmentId}/status`.
- Sensors and telemetry: `/api/v1/sensors`, `/api/v1/sensors/{sensorId}/assignment`, `/api/v1/telemetry`.
- Alerts: `/api/v1/alerts`, `/api/v1/alerts/{alertId}/acknowledgment`, `/api/v1/alerts/{alertId}/resolution`.
- Analytics and reports: `/api/v1/analytics/dashboard`, `/api/v1/analytics/shipment-history`, `/api/v1/reports`.

The API base URL and endpoint paths are configured through Vite environment variables, keeping deployment settings out of source code.

## Environment Configuration

Vite reads the API settings from `.env.development` and `.env.production`. Public frontend variables use the `VITE_` prefix and contain only the backend URL and endpoint paths.

```env
VITE_API_BASE_URL=https://freshguard-coldtrack-platform.onrender.com
```

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Deploy the generated `dist` directory to the configured Firebase project:

```bash
firebase deploy --only hosting
```

## Verification Checklist

- Run `npm run build` before merging changes.
- Verify sign-in and sign-up with the deployed backend.
- Confirm protected routes redirect unauthenticated users to Sign In.
- Confirm `EN | ES` updates fixed UI text and document language.
- Confirm dashboard, shipments, sensors, alerts, history, and PDF downloads consume the configured API URL.

## Author

Developed by Aaron Avila Palacios for the HackRats team.
