
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine

# Import models so SQLAlchemy registers all tables.
from app import models

# Agent registration
from app.agents import register_agents
from app.messaging import message_bus

# Routers
from app.routers import (
    auth,
    users,
    venues,
    events,
    bookings,
    tickets,
    waitlist,
    venue_hire,
    notifications,
    admin,
    staff,
    agent_logs
)


# --------------------------------------------------
# APPLICATION DIRECTORIES
# --------------------------------------------------

# Create the static directory for QR code images.
BASE_DIR = Path(__file__).resolve().parent.parent

STATIC_DIRECTORY = BASE_DIR / "static"
STATIC_DIRECTORY.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

# FRONTEND_URL is loaded from your .env file.
# Additional origins support local frontend development.

allowed_origins = [
    settings.FRONTEND_URL,
    "https://eventsphere-frontend-smoky.vercel.app",
    "https://eventsphere-frontend-smoky.vercel.app",
]

# Remove duplicate or empty origins.
allowed_origins = list({
    origin.rstrip("/")
    for origin in allowed_origins
    if origin
})


# --------------------------------------------------
# APPLICATION LIFESPAN
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Create database tables for local development.
    Base.metadata.create_all(bind=engine)

    # Register agents with the message bus.
    register_agents(message_bus)

    print("EventSphere database initialized.")
    print("EventSphere agents registered.")
    print("EventSphere API started successfully.")

    yield

    # Application shutdown.
    print("EventSphere API shutting down.")


# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "EventSphere - Multi-Agent Venue Booking "
        "and Digital Ticketing Platform"
    ),
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan
)


# --------------------------------------------------
# CORS MIDDLEWARE
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --------------------------------------------------
# API ROUTERS
# --------------------------------------------------

routers = [
    auth.router,
    users.router,
    venues.router,
    events.router,
    bookings.router,
    tickets.router,
    waitlist.router,
    venue_hire.router,
    notifications.router,
    admin.router,
    staff.router,
    agent_logs.router
]

for router in routers:
    app.include_router(router)


# --------------------------------------------------
# STATIC FILES
# --------------------------------------------------

# QR code images can be accessed through:
# http://127.0.0.1:8000/static/<filename>

app.mount(
    "/static",
    StaticFiles(directory=str(STATIC_DIRECTORY)),
    name="static"
)


# --------------------------------------------------
# ROOT ENDPOINT
# --------------------------------------------------

@app.get("/")
def root():

    return {
        "success": True,
        "message": "Welcome to EventSphere API!",
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


# --------------------------------------------------
# HEALTH CHECK ENDPOINT
# --------------------------------------------------

@app.get("/health")
def health_check():

    return {
        "success": True,
        "status": "healthy",
        "application": settings.APP_NAME
    }


# --------------------------------------------------
# API INFORMATION ENDPOINT
# --------------------------------------------------

@app.get("/api")
def api_information():

    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "documentation": "/docs",
        "status": "running"
    }
