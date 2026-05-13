# ColdTrack Front Web

Clean Vue/Vite project prepared to integrate the five ColdTrack split packages.

## Integration Order

Copy each package's `files-to-copy` contents into this project root in this order:

1. `01-db-dashboard`
2. `02-sign-in-new-shipment`
3. `03-sign-up-sensors`
4. `04-alerts`
5. `05-history-i18n-app-shell`

The files are located at:

```text
C:\Users\Aaron Avila\OneDrive\Escritorio\ColdTrack-Front-split
```

## Commands

Install dependencies:

```bash
npm install
```

Run fake API after package 01 is copied:

```bash
npm run api
```

Run app:

```bash
npm run dev
```

Build:

```bash
npm run build
```
