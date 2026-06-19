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
- Sensor registration, assignment, and telemetry recording.
- Alert filtering, acknowledgement, and resolution.
- Completed shipment history and PDF report generation.
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

The application follows a modular organization inspired by bounded contexts:

- `src/iam`: authentication and account workflows.
- `src/shipments`: shipment domain, application state, infrastructure, and views.
- `src/sensors`: sensor assignment and telemetry workflows.
- `src/alerts`: alert lifecycle management.
- `src/analytics`: dashboard metrics, history, and reports.
- `src/shared`: reusable layout, HTTP, session, and presentation elements.
- `src/locales`: English and Spanish translation dictionaries.

Physical files use kebab-case. Domain and application files include descriptive suffixes such as `.entity.js`, `.store.js`, and `.service.js`.

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

## Author

Developed by Aaron Avila Palacios for the HackRats team.
