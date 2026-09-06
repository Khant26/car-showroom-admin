# Car Showroom Admin Dashboard

An administration interface for managing showroom inventory and operational content, including cars, rentals, sold vehicles, brands, and promotional banners.

## Features

- Protected administrator login and authenticated routes
- Dashboard navigation and management workflows
- Car, rental, sold-car, brand, and banner management
- Image upload support
- Responsive dashboard layout
- API service layer for backend communication

## Stack

- React 18 and React Router
- Vite
- Tailwind CSS
- Axios
- Recharts
- React Hot Toast, Font Awesome, Heroicons, and React Icons

## Local setup

```bash
npm install
copy .env.example .env
npm run dev
```

Environment configuration:

```env
VITE_API_URL=http://localhost:5000/api
```

## Quality checks

```bash
npm run lint
npm run build
```

Both checks pass in the local audit copy after adding the missing ESLint configuration and removing unused imports.

## Security note

Only public frontend configuration belongs in `VITE_*` variables. Never place server credentials or private keys in this repository because Vite exposes these values to the browser bundle.
