# SACCO Management System — Backend

This is the Laravel REST API for SACCO Management System. A multi-tenant platform where SACCOs (Savings and Credit Cooperative Organizations) manage their own members, savings, loans, share capital, and dividends.

This backend is built on a shared Laravel starter kit that already provides authentication (register, login, logout, email verification, password reset) via Laravel Sanctum, and a versioned API structure (`/api/v1/...`). Your project's own domain-specific features are built on top of this foundation, following the same pattern the Auth feature already demonstrates — see **GETTING-STARTED.docx** in the project root.

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
- [API Response Format](#api-response-format)
- [Activity Logging](#activity-logging)
- [Testing](#testing)
- [Code Quality Tools](#code-quality-tools)
- [API Documentation](#api-documentation)
- [Log Viewer](#log-viewer)
- [Continuous Integration (CI/CD)](#continuous-integration-cicd)
- [Further Documentation](#further-documentation)
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

1.  **Clone the repository** (this project lives inside the `Backend/` folder of the monorepo):
    ```bash
    git clone https://github.com/YOUR-ORG/sacco-management-system.git
    cd SACCO-Management-System/Backend
    ```

2.  **Create Environment File and Compose Override:**
    Copy the example environment file (default values are configured for Docker), and copy the example compose override file, modifying it according to your needs.
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

5.  **Generate Application Key:**
    ```bash
    docker compose run --rm artisan key:generate
    ```

6.  **Run Database Migrations:**
    ```bash
    docker compose run --rm artisan migrate
    ```

7.  **(Optional) Seed the Database:**
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
| `artisan`  | -               | Service to run Artisan commands           |
| `mailpit`  | `8025:8025`     | Email testing tool (web interface)        |
| `adminer`  | `8080:8080`     | Database management tool (web interface)  |

- **Application**: http://localhost
- **Mailpit**: http://localhost:8025
- **Adminer**: http://localhost:8080

## Local Development (Without Docker)

### Prerequisites for Local Development

- **PHP >= 8.3**
- **Composer**
- **A database server** (e.g., MySQL, PostgreSQL, SQLite)

### Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR-ORG/sacco-management-system.git
    cd SACCO-Management-System/Backend
    ```

2.  **Install PHP Dependencies:**
    ```bash
    composer install
    ```

3.  **Create Environment File:**
    Copy the example environment file and customize it for your local setup.
    ```bash
    cp .env.example .env
    ```

4.  **Generate Application Key:**
    ```bash
    php artisan key:generate
    ```

5.  **Configure Your `.env` File:**
    Open the `.env` file and set up your database connection details (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

6.  **Run Database Migrations:**
    ```bash
    php artisan migrate
    ```

7.  **(Optional) Seed the Database:**
    ```bash
    php artisan db:seed
    ```

### Running the Application Locally

```bash
php artisan serve
```

Available at `http://127.0.0.1:8000`.

## Coding Conventions

### 1. Naming Conventions

-   **Variables**: `camelCase` — e.g. `$taskStatus`, `$isApproved`
-   **Functions & Methods**: `camelCase` — e.g. `function approveTask()`, `public function getUserProfile()`
-   **Classes**: `PascalCase` — e.g. `class TaskController`, `class TaskService`
-   **Route URIs**: `kebab-case` — e.g. `Route::get('/task-items', ...)`
-   **Migrations**: `snake_case` (plural) — e.g. `create_tasks_table.php`
-   **Database Tables**: `snake_case` (plural) — e.g. `tasks`, `task_items`
    **Note**: Pivot tables use `snake_case` (singular) in alphabetical order, e.g. `role_user`.
-   **Database Columns**: `snake_case` — e.g. `first_name`, `is_approved`, `owner_id`
-   **Files**: `PascalCase` for classes, `snake_case` for other files.

A naming convention checker script is included — run it before opening a pull request:
```bash
bash scripts/check-naming.sh
```

### 2. General Guidelines

-   **Indentation**: 4 spaces, not tabs.
-   **Line Endings**: Unix-style (LF).
-   **Comments**: Explain complex logic; avoid commenting on obvious code.
-   **Single Responsibility**: Each class and method should have one well-defined responsibility.
-   **Authorization**: Enforce ownership and role-based access checks for your project's own entities (e.g. a user should generally only see or modify their own records unless their role grants broader access).

## API Response Format

Every API response should follow this consistent shape, using the `App\Http\Traits\ApiResponse` trait already included in `AuthController`:

```json
// Success
{
  "success": true,
  "message": "Success",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

Use it in any new controller by adding `use ApiResponse;` to the class, then calling `$this->success($data, $message)` or `$this->error($message, $code)` instead of building `response()->json(...)` by hand. See `docs/api-response-format.md` for details.

## Activity Logging

User actions (register, login, logout, password changes, etc.) are recorded via `App\Services\ActivityLogger` to `storage/logs/activity.log`. When you add a new feature with a meaningful user action (e.g. a task was approved, a status changed), log it the same way — see `docs/activity-logging.md` and the existing calls in `AuthController` for the pattern.

## Testing

```bash
php artisan test                      # Run all tests
php artisan test --testsuite=Unit     # Unit tests only
php artisan test --testsuite=Feature  # Feature tests only
php artisan test --filter=AuthTest    # A specific test class
```

The auth flow already has full test coverage (registration, login, logout, profile, password change, email verification, password reset, rate limiting — 52 tests in total). **Every new feature you build should ship with its own tests, following the same pattern** — see `docs/testing.md`.

## Code Quality Tools

```bash
vendor/bin/pint --test              # Code style check (fix with: vendor/bin/pint)
vendor/bin/phpstan analyse          # Static analysis (level 6)
bash scripts/check-naming.sh        # Naming convention check
```

Run all three before opening a pull request — the CI pipeline (see below) will run them automatically on every push and pull request anyway, but catching issues locally first saves review time.

## API Documentation

Auto-generated OpenAPI/Swagger documentation is available at `/docs/api` once the app is running (powered by `dedoc/scramble` — no manual Postman collection maintenance required). See `docs/scramble-api-docs.md`.

## Log Viewer

A web-based log viewer is available at `/logs` once the app is running — useful for debugging without SSHing into a server or tailing files manually. See `docs/log-viewer.md`.

## Continuous Integration (CI/CD)

A GitHub Actions pipeline runs automatically on every push and pull request to `develop` (and on push to `main`):

```
Backend
├── Lint (Pint + naming convention check)
├── Static Analysis (PHPStan, level 6)
└── Test (PHP 8.3 / 8.4 × SQLite / MySQL / PostgreSQL)

Frontend
├── Lint (type check + oxlint + naming convention check)
├── Test (Vitest)
└── Build
```

If any step fails, the pull request will show a red ❌ — fix the issue before merging. This catches style issues, bugs, and broken builds before they reach `develop`.

## Further Documentation

The `docs/` folder has focused guides for each tool used in this project:

- [Documentation Index](docs/README.md)
- [API Versioning](docs/laravel-api-versioning.md)
- [Sanctum Authentication](docs/sanctum-authentication.md)
- [API Response Format](docs/api-response-format.md)
- [Activity Logging](docs/activity-logging.md)
- [Rate Limiting](docs/rate-limiting.md)
- [Testing](docs/testing.md)
- [PHPStan / Static Analysis](docs/phpstan.md)
- [API Docs (Scramble)](docs/scramble-api-docs.md)
- [Log Viewer](docs/log-viewer.md)
- [Docker Development](docs/docker-development.md)

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
- Ensure all tests pass before submitting (`php artisan test`).
- Run `vendor/bin/pint --test`, `vendor/bin/phpstan analyse`, and `bash scripts/check-naming.sh` before submitting — the CI pipeline runs these automatically, but fixing issues locally first is faster.
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
- **Issue**: `composer install` complains about the lock file.
  - **Solution**: Run `composer update` once instead of `composer install` — this regenerates `composer.lock` for your machine.
- **Issue**: PHPStan reports errors on code that looks fine.
  - **Solution**: Read the specific error message — it's usually a missing type hint or a possible-null value PHPStan wants handled explicitly. See `docs/phpstan.md`.
