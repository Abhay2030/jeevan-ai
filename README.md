# JEEVAN AI

**Public Health Intelligence & Emergency Decision-Support Platform**

Real-time public-health intelligence and emergency decision-support web platform for large-scale gatherings. Reference deployment: Simhastha Kumbh 2027.

## Architecture

```
jeevan-ai/
├── apps/
│   └── web/                    # Next.js 15 (App Router) — public, responder, command, admin
├── services/
│   └── api/                    # FastAPI backend — auth, incidents, resources, AI
├── packages/
│   ├── ui/                     # Shared accessible component library
│   ├── types/                  # Shared TypeScript types & API contracts
│   └── config/                 # Shared Tailwind / ESLint / TypeScript config
├── infrastructure/             # Docker Compose, deployment configs
├── tests/                      # Integration & E2E tests
└── docs/                       # Documentation
```

## Quick Start

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 10
- Python ≥ 3.12
- Docker & Docker Compose

### Setup

```bash
# Install frontend dependencies
pnpm install

# Start infrastructure (PostgreSQL + PostGIS, Redis)
docker compose -f infrastructure/docker-compose.yml up -d

# Set up Python backend
cd services/api
python -m venv .venv
.venv/Scripts/activate  # Windows
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start backend
uvicorn app.main:app --reload --port 8000

# Start frontend (from project root)
pnpm dev
```

### Development

```bash
pnpm build       # Build all packages
pnpm lint        # Lint all packages
pnpm typecheck   # Type-check all packages
pnpm test        # Run all tests
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript (strict), Tailwind CSS v4 |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy |
| Database | PostgreSQL 16 + PostGIS 3.4 |
| Cache | Redis 7 |
| Maps | Mapbox GL JS / MapLibre GL JS |
| CI/CD | GitHub Actions |

## Safety Boundary

No AI module autonomously dispatches resources or makes clinical claims. Every AI output carries confidence, model version, timestamp, and data quality metadata. Every resource recommendation requires explicit human Approve / Modify / Reject before becoming an action.

## License

Proprietary — Kumbhathon Innovation S.P.R.I.N.T. 2026
