# SACCO Management System — Frontend

This is the React (Vite) client for the SACCO Management System. It provides the interfaces for Members, SACCO Administrators, and the Platform Superadmin.

## Prerequisites

- **Node.js** (LTS version recommended)
- **npm**

## Getting Started

1.  **Clone the repository** (this project lives inside the `frontend/` folder of the monorepo):
    ```bash
    git clone https://github.com/Bini-A10/sacco-management.git
    cd sacco-management/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your environment file:**
    Create a `.env` file in the `frontend/` folder with the backend API URL:
    ```
    VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
    ```
    Adjust the URL if your backend is running somewhere else (e.g. `http://localhost` if using Docker).

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

Make sure the backend (see `../backend/README.md`) is running at the same time — the frontend depends on it for all data.

## Available Scripts

- `npm run dev` — start the local development server with hot reload
- `npm run build` — build the app for production
- `npm run lint` — run ESLint to check code quality

## Project Structure

```
frontend/
├── public/           Static assets
├── src/
│   ├── assets/        Images, icons, etc.
│   ├── App.jsx         Root component
│   └── main.jsx        Application entry point
├── index.html
├── vite.config.js
└── package.json
```

As the project grows, organize `src/` by feature, for example:

```
src/
├── components/       Shared/reusable UI components
├── pages/            Page-level components (per route)
├── services/         API call functions (e.g. api/loans.js, api/members.js)
├── hooks/            Custom React hooks
├── context/          Auth/session context
└── routes/           React Router setup
```

## Coding Conventions

- **Components**: `PascalCase` — e.g. `LoanApplicationForm.jsx`
- **Functions/variables**: `camelCase` — e.g. `fetchMemberSavings()`
- **Files**: match the component name they export
- Keep API calls out of components — put them in a `services/` folder and import them, so the same request logic can be reused and tested.

## Branching and Commits

Follow the same conventions used across the whole project (see the root [`README.md`](../README.md) and [`backend/README.md`](../backend/README.md)):

- Branch from `develop`: `feature/your-feature-name`
- Commit messages: `feat: add loan application form`, `fix: correct savings balance display`
- Open pull requests into `develop`, not `main`
