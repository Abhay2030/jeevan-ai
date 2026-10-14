# JEEVAN AI

> See the Risk. Predict the Need. Move the Help.

AI-powered National Public Health & Emergency Intelligence Platform for India.

## About

JEEVAN AI is a configurable, AI-powered platform designed to help communities and authorized response teams detect emerging risks, anticipate resource requirements, coordinate emergency response, and learn from operational outcomes across India.

Every life matters.

## Core Capabilities

- Emergency SOS & incident reporting
- AI-assisted emergency intelligence
- Predictive health-risk analysis
- Medical demand forecasting
- Emergency resource discovery and allocation
- Geographic intelligence and routing
- Scenario simulation and digital twin
- Human-supervised decision support
- Operational analytics and outcome measurement
- Multilingual support (English, Hindi, Marathi)

## Operational Lifecycle

OBSERVE → DETECT → VERIFY → PREDICT → RECOMMEND → AUTHORIZE → RESPOND → EVALUATE → LEARN

## User Roles

| Role | Access |
|------|--------|
| Public/Citizen | Emergency SOS, incident reporting, hospital finder, first aid |
| Responder | Assigned incidents, route guidance, status updates |
| Command | Situation overview, risk maps, resource allocation, simulation |
| Admin | User management, configuration, audit, data governance |

## Technology Stack

### Frontend
- Next.js 15, React 19, TypeScript
- Tailwind CSS v4, Custom Design System
- Framer Motion, Leaflet/MapLibre

### Backend
- FastAPI (Python)
- PostgreSQL + PostGIS
- Redis (caching, pub/sub)
- WebSocket real-time updates

### AI/ML
- Risk assessment engine
- Demand forecasting
- Anomaly detection
- Voice AI (STT/TTS/NLU)

### Deployment
- Vercel (frontend)
- Railway/Render (API)
- Docker Compose (local dev)

## Project Structure

```
jeevan-ai/
├── apps/web/              → Next.js frontend
├── packages/types/        → Shared TypeScript types
├── packages/ui/           → Shared UI components
├── services/api/          → FastAPI backend
├── services/voice-agent/  → Voice AI service
├── services/edge-voice/   → Edge voice proxy
├── infrastructure/        → Docker, deployment
├── tests/                 → Test suite
└── docs/                  → Documentation
```

## Getting Started

### Prerequisites
- Node.js >= 20
- pnpm >= 10
- Python >= 3.11
- PostgreSQL with PostGIS
- Redis

### Development
```bash
# Install dependencies
pnpm install

# Start frontend dev server
pnpm dev

# Start API (in services/api/)
pip install -r requirements.txt
uvicorn app.main:app --reload

# Start with Docker
docker-compose up
```

### Environment Variables
Copy `.env.example` to `.env` and configure. See the file for all required variables.

## Data Transparency

| Type | Status |
|------|--------|
| Live Data | Verified from connected sources |
| Demo Data | Clearly labeled simulation |
| AI Forecast | Displayed with confidence score |
| Integration | Shows connection health status |

When official data is unavailable, the system clearly labels it.

## Security

- JWT Authentication with RBAC
- Encrypted data in transit and at rest
- Audit logging
- Rate limiting
- Input validation
- Secure session management

## Geographic Scope

JEEVAN AI is designed for India-wide deployment with configurable geographic hierarchy:

Country → State/UT → District → City/Locality → Operational Zone

## Contributing

Contributions welcome. Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

## License

JEEVAN AI Proprietary License

Copyright © 2026 Abhay Sachin Donde. All Rights Reserved.

Permission is granted to view this repository for educational, evaluation, and demonstration purposes only. No part of this project may be copied, modified, distributed, sublicensed, or used commercially without prior written permission from the copyright holder.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

---

**Built with ❤️ in India by Abhay Sachin Donde**
