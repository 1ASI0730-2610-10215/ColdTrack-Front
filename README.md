# ColdTrack Front

ColdTrack Front is a Vue 3.5 web application for refrigerated shipment monitoring. It helps logistics teams register shipments, manage IoT sensors, review active alerts, and inspect completed shipment history for cold-chain food transportation.

## Features

- Shipment dashboard with active alerts, metrics, search, and active shipment table.
- New shipment registration form connected to a fake API through axios.
- Sensor management view with sensor registration and availability indicators.
- Alert system view with severity and status filters.
- Shipment history view with completed shipment metrics.
- Sign in and account creation screens.
- English and Spanish internationalization with English as the default language.
- Material-themed PrimeVue UI components registered with the `pv-` prefix.
- ARIA labels in the main views and navigation landmarks.

## Dependencies

- Vue 3.5
- Vite
- PrimeVue
- PrimeIcons
- PrimeFlex
- Vue Router
- Vue I18n
- Axios
- JSON Server

## Project Structure

The application follows a modular organization inspired by bounded contexts:

- `src/shared`: layout, common infrastructure, and reusable presentation elements.
- `src/shipments`: shipment domain, application store, API service, and views.
- `src/sensors`: sensor domain, application store, API service, and views.
- `src/alerts`: alert domain, application store, API service, and views.
- `src/iam`: user domain, account API service, and authentication views.
- `server/db.js`: fake API data source for JSON Server.

Physical files use kebab-case and domain files include suffixes such as `.entity.js`, `.store.js`, and `.service.js`.

## Recommended Setup

Install dependencies:

```bash
npm install
```

Run the fake API:

```bash
npm run api
```

Run the web application in another terminal:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Fake API

The app sends `POST` requests to JSON Server when users create shipments, sensors, and accounts. The fake API starts at `http://localhost:3000` and serves data from `server/db.js`.

## Author

Developed by Codex Assistant for the HackRats team.
