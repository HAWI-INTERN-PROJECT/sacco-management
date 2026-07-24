# SACCO Management System — Backend

This is the Laravel REST API for the SACCO Management System, a multi-tenant platform where SACCOs (Savings and Credit Cooperative Organizations) manage their own members, savings, loans, share capital, and dividends.

This backend is built on a Laravel starter kit that already provides authentication (register, login, logout, email verification, password reset) via Laravel Sanctum, and a versioned API structure (`/api/v1/...`). SACCO-specific features (members, savings, loans, share capital, dividends, and platform/tenant management) are built on top of this foundation.

## Table of Contents

- [Development with Docker](#development-with-docker)
  - [Prerequisites for Docker](#prerequisites-for-docker)
  - [Installation and Running with Docker](#installation-and-running-with-docker)
  - [Available Services](#available-services)
- [Local Development (Without Docker)](#local-development-without-docker)
  - [Prerequisites for Local Development](#prerequisites-for-local-development)
  - [Installation](#local-installation)
  - [Running the Application](#running-the-application-locally)
- [Coding Conventions](#coding-conventions)
- [Branch Naming Guidelines](#branch-naming-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Contributing](#contributing)
- [FAQ](#faq)

## Development with Docker

This is the recommended way to run the project for development.

### Prerequisites for Docker

- **Docker**
- **Docker Compose**

### Installation and Running with Docker

1.  **Clone the repository** (this project lives inside the `backend/` folder of the monorepo):
    ```bash
    git clone https://github.com/Bini-A10/sacco-management.git
    cd sacco-management/backend
    ```

2.  **Create Environment File And Create compose override:**
    Copy the example environment file. The default values are configured for Docker.
    Copy the example compose override file, and modify it according to your needs.
    ```bash
    cp .env.example .env
    cp compose.override.yaml.example compose.override.yaml
    ```

3.  **Build and Run the Application:**
    ```bash
    docker compose up -d --build
    ```
    The application will be available at `http://localhost`.

4.  **Install PHP Dependencies:**
    ```bash
    docker compose run --rm composer install
    ```

5.  **Install Frontend Build Dependencies (Laravel asset tooling only, not the React app):**
    ```bash
    docker compose run --rm npm install
    ```

6.  **Generate Application Key:**
    ```bash
    docker compose run --rm artisan key:generate
    ```

7.  **Run Database Migrations:**
    ```bash
    docker compose run --rm artisan migrate
    ```

8.  **(Optional) Seed the Database:**
    ```bash
    docker compose run --rm artisan db:seed
    ```

### Available Services

The `compose.override.yaml` file defines the following services:

| Service    | Port(s)         | Description                               |
|------------|-----------------|-------------------------------------------|
| `app`      | `80:80`         | Nginx web server                          |
| `mysql`    | `3306:3306`     | MySQL database server                     |
| `postgres` | `5432:5432`     | PostgreSQL database server                |
| `php`      | `9000:9000`     | PHP-FPM service                           |
| `redis`    | `6379:6379`     | Redis server                              |
| `composer` | -               | Service to run Composer commands          |
| `npm`      | `5173:5173`     | Service to run NPM commands (Vite)        |
| `artisan`  | -               | Service to run Artisan commands           |
| `mailpit`  | `8025:8025`     | Email testing tool (web interface)        |
| `adminer`  | `8080:8080`     | Database management tool (web interface)  |

- **Application**: http://localhost
- **Mailpit**: http://localhost:8025
- **Adminer**: http://localhost:8080

## Local Development (Without Docker)

### Prerequisites for Local Development

- **PHP >= 8.2**
- **Composer**
- **Node.js & NPM**
- **A database server** (e.g., MySQL, PostgreSQL, SQLite)

### Local Installation

Follow these steps to get your development environment set up:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Bini-A10/sacco-management.git
    cd sacco-management/backend
    ```

2.  **Install PHP Dependencies:**
    ```bash
    composer install
    ```

3.  **Install Frontend Build Dependencies:**
    ```bash
    npm install
    ```

4.  **Create Environment File:**
    Copy the example environment file and customize it for your local setup.
    ```bash
    cp .env.example .env
    ```

5.  **Generate Application Key:**
    ```bash
    php artisan key:generate
    ```

6.  **Configure Your `.env` File:**
    Open the `.env` file and set up your database connection details (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

7.  **Run Database Migrations:**
    ```bash
    php artisan migrate
    ```

8.  **(Optional) Seed the Database:**
    ```bash
    php artisan db:seed
    ```

### Running the Application Locally

1.  **Start the Laravel Server:**
    ```bash
    php artisan serve
    ```
    Available at `http://127.0.0.1:8000`.

2.  **Start the Vite Server** (in a new terminal):
    ```bash
    npm run dev
    ```

## Coding Conventions

### 1. Naming Conventions

-   **Variables**: `camelCase` — e.g. `$loanAmount`, `$totalSavings`
-   **Functions & Methods**: `camelCase` — e.g. `function calculateDividend()`, `public function getMemberProfile()`
-   **Classes**: `PascalCase` — e.g. `class LoanController`, `class SavingsService`
-   **Route URIs**: `kebab-case` — e.g. `Route::get('/loan-applications', ...)`
-   **Migrations**: `snake_case` (plural) — e.g. `create_loans_table.php`
-   **Database Tables**: `snake_case` (plural) — e.g. `members`, `saccos`, `loan_repayments`
    **Note**: Pivot tables use `snake_case` (singular) in alphabetical order, e.g. `role_user`.
-   **Database Columns**: `snake_case` — e.g. `first_name`, `is_approved`, `sacco_id`
-   **Files**: `PascalCase` for classes, `snake_case` for other files.

### 2. General Guidelines

-   **Indentation**: 4 spaces, not tabs.
-   **Line Endings**: Unix-style (LF).
-   **Comments**: Explain complex logic; avoid commenting on obvious code.
-   **Single Responsibility**: Each class and method should have one well-defined responsibility.
-   **Multi-tenancy**: Every model and query that belongs to a SACCO must be scoped by `sacco_id`. Never return or expose data across SACCOs.

## Branch Naming Guidelines

- `fix/bug_name` — bug fixes
- `hotfix/bug_name` — urgent bug fixes
- `feature/feature_name` or `feat/feature_name` — new features
- `refactor/refactor_name` — refactoring existing code
- `chore/name` — maintenance tasks
- `docs/name` — documentation updates
- `release/version_name` — releases

## Commit Message Guidelines

- `fix: bug name`
- `hotfix: bug name`
- `feature: feature name` or `feat: feature name`
- `chore: name`
- `refactor: name`
- `docs: name`

## Pull Request Guidelines

- Provide a clear and concise description of the changes.
- Include screenshots or examples if applicable.
- Ensure all tests pass before submitting.
- Request reviews from relevant team members.
- Target the `develop` branch, not `main`.

## Contributing

1. **Branch from `develop`**: `git checkout develop && git pull && git checkout -b feature/your-feature`
2. **Make Your Changes**: Follow the coding conventions and commit message guidelines above.
3. **Submit a Pull Request** into `develop`, following the PR guidelines above.
4. **Wait for Review**: Your PR will be reviewed before merging.

## FAQ

### Common Issues and Solutions
- **Issue**: Docker containers fail to start.
  - **Solution**: Ensure Docker Desktop is running and your `.env` file is correctly configured.
- **Issue**: Composer dependencies fail to install.
  - **Solution**: Run `docker compose run --rm composer install` again and check for errors.
- **Issue**: Database migrations fail.
  - **Solution**: Verify your database credentials in `.env` and ensure the database service is running.
