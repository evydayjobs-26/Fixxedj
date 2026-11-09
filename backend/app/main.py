from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import (
    auth,
    users,
    services,
    bookings,
    providers,
    payments,
    reviews,
    admin,
)

app = FastAPI(
    title="Fixxedj API",
    description="Home services marketplace REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
API_V1 = "/api/v1"

app.include_router(auth.router,      prefix=f"{API_V1}/auth",      tags=["auth"])
app.include_router(users.router,     prefix=f"{API_V1}/users",     tags=["users"])
app.include_router(services.router,  prefix=f"{API_V1}/services",  tags=["services"])
app.include_router(bookings.router,  prefix=f"{API_V1}/bookings",  tags=["bookings"])
app.include_router(providers.router, prefix=f"{API_V1}/providers", tags=["providers"])
app.include_router(payments.router,  prefix=f"{API_V1}/payments",  tags=["payments"])
app.include_router(reviews.router,   prefix=f"{API_V1}/reviews",   tags=["reviews"])
app.include_router(admin.router,     prefix=f"{API_V1}/admin",     tags=["admin"])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["health"])
async def health() -> dict:
    return {"status": "ok", "version": app.version}
