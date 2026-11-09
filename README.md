# Fixxedj — Home Services Marketplace

A monorepo containing the full Fixxedj platform: a FastAPI backend, two Expo mobile apps (customer & worker), and a React admin panel.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.12+ |
| Node.js | 18+ |
| npm | 9+ (workspaces support) |
| Docker & Docker Compose | latest |
| Expo CLI | `npm i -g expo-cli` |

---

## Repository Structure

```
fixxedj/
├── backend/          FastAPI + PostgreSQL/PostGIS + Redis
├── apps/
│   ├── customer-app/ Expo app for customers
│   ├── worker-app/   Expo app for service workers
│   └── admin-web/    React + Vite admin dashboard
└── packages/
    └── shared/       Shared TypeScript types
```

---

## Quick Start

### 1. Clone & install Node dependencies

```bash
git clone https://github.com/your-org/fixxedj.git
cd fixxedj
npm install          # installs all workspace packages
```

### 2. Start the backend

```bash
cd backend
cp .env.example .env   # fill in your secrets
docker compose up -d   # starts PostGIS + Redis
pip install -r requirements.txt
uvicorn app.main:app --reload
# API available at http://localhost:8000
# Docs at         http://localhost:8000/docs
```

Run database migrations after the first start:

```bash
alembic upgrade head
```

### 3. Start the customer app

```bash
# From repo root
npm run dev:customer
# or
cd apps/customer-app && npx expo start
```

Scan the QR code with the Expo Go app, or press `i` / `a` for iOS / Android simulator.

### 4. Start the worker app

```bash
npm run dev:worker
# or
cd apps/worker-app && npx expo start
```

### 5. Start the admin web panel

```bash
npm run dev:admin
# or
cd apps/admin-web && npm run dev
# Available at http://localhost:5173
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (async) |
| `REDIS_URL` | Redis connection string |
| `SECRET_KEY` | Long random string for JWT signing |
| `TWILIO_*` | Twilio credentials for SMS OTP |
| `STRIPE_*` | Stripe credentials for payments |

---

## Running Tests

```bash
# Backend
cd backend
pytest

# Type-check all TypeScript
npm run type-check
```

---

## Scripts (root package.json)

| Script | Description |
|--------|-------------|
| `npm run dev:backend` | Start FastAPI with hot-reload |
| `npm run dev:customer` | Start customer Expo app |
| `npm run dev:worker` | Start worker Expo app |
| `npm run dev:admin` | Start admin Vite dev server |
| `npm run lint` | ESLint all TypeScript sources |
| `npm run type-check` | TypeScript type-check (no emit) |

---

## Contributing

1. Create a feature branch off `main`
2. Make your changes with tests
3. Run `npm run lint && npm run type-check` before committing
4. Open a Pull Request

---

## License

MIT © Fixxedj
