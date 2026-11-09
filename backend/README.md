# Fixxedj Backend

FastAPI REST API for the Fixxedj home-services marketplace.

## Stack

- **FastAPI** – async web framework
- **PostgreSQL + PostGIS** – relational DB with geospatial support
- **Redis + Celery** – async task queue (OTP expiry, notifications)
- **Alembic** – database migrations
- **Stripe** – payment processing
- **Twilio** – SMS OTP

## Setup

```bash
cp .env.example .env        # fill in secrets
docker compose up -d        # start DB + Redis
pip install -r requirements.txt
alembic upgrade head        # run migrations
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

## Project Layout

```
app/
├── main.py          FastAPI entry point
├── core/            Config, DB, Security, Constants
├── api/
│   ├── deps.py      Auth dependencies
│   └── v1/          Route handlers
├── models/          SQLAlchemy ORM models
├── schemas/         Pydantic request/response schemas
├── services/        Business logic
├── workers/         Celery tasks
└── utils/           Helpers (geo, etc.)
```

## Running Tests

```bash
pytest tests/ -v
```
