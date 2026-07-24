# SACCO Management System

A multi-tenant SaaS platform for SACCOs (Savings and Credit Cooperative Organizations). Any SACCO can register on the platform and independently manage its own members, savings, loans, share capital, and dividends — fully isolated from every other SACCO on the platform.

Built as part of the 2026 Summer Internship program.

## User Roles

- **Member** — saves, borrows, and views their own savings, loan, and dividend history
- **SACCO Administrator** — manages members, savings, loans, share capital, and dividends for their own SACCO
- **Platform Superadmin** — approves new SACCOs onto the platform and manages platform-wide access

## Project Structure

```
sacco-management/
├── backend/         Laravel REST API
├── frontend/        React + Vite client
├── documentation/   Requirements, diagrams, wireframes, API docs
└── README.md        This file
```

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Laravel REST API
- **Database:** MySQL
- **Auth:** Laravel Sanctum (token-based)
- **Version control:** Git / GitHub

## Getting Started

Each part of the project has its own setup guide:

- Backend setup → [`backend/README.md`](./backend/README.md)
- Frontend setup → [`frontend/README.md`](./frontend/README.md)

## Branching Model

- `main` — stable, production-ready code only
- `develop` — active development branch, all feature branches merge here first
- `feature/<name>` — new features (e.g. `feature/loan-application`)
- `fix/<name>` — bug fixes
- `docs/<name>` — documentation changes

See `backend/README.md` for full commit message and pull request conventions — the same conventions apply across both `backend/` and `frontend/`.

## Documentation

Requirements documents, database diagrams, wireframes, and the API reference for this project live in the [`documentation/`](./documentation) folder.
