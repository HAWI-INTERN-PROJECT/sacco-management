# SACCO Management System - Tool Documentation

This folder contains documentation for all tools, packages, and configurations used in this Laravel SACCO Management System project.

## Project Overview

This is a **Laravel 12** backend-only REST API project with:
- **PHP 8.2+** backend
- **Docker** development environment
- **Sanctum** API token authentication
- **API versioning** via `grazulex/laravel-apiroute`
- **Auto-generated API docs** via `dedoc/scramble`

## Documentation Index

| Document | Description |
|---|---|
| [API Versioning](./laravel-api-versioning.md) | How to use `grazulex/laravel-apiroute` for versioned APIs |
| [Sanctum Authentication](./sanctum-authentication.md) | API token auth with Laravel Sanctum |
| [API Documentation (Scramble)](./scramble-api-docs.md) | Auto-generated OpenAPI docs with Dedoc Scramble |
| [Docker Development](./docker-development.md) | Docker-based development environment setup |
| [Testing](./testing.md) | PHPUnit testing setup and conventions |
| [Rate Limiting](./rate-limiting.md) | Rate limiter configuration and usage |
| [PHPStan/Larastan](./phpstan.md) | Static analysis with Larastan |
| [API Response Format](./api-response-format.md) | Standardized JSON responses |
| [Activity Logging](./activity-logging.md) | User activity logging to files |
| [Log Viewer](./log-viewer.md) | Web UI for viewing logs |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
php artisan key:generate
```

Key variables:

| Variable | Description | Default |
|---|---|---|
| `APP_NAME` | Application name | `SACCO Management System` |
| `APP_ENV` | Environment | `local` |
| `APP_DEBUG` | Debug mode | `true` |
| `APP_URL` | Application URL | `http://localhost` |
| `APP_FRONTEND_URL` | Frontend URL (for CORS) | `http://localhost:3000` |
| `DB_CONNECTION` | Database driver | `sqlite` |
| `CACHE_STORE` | Cache driver | `database` |
| `SESSION_DRIVER` | Session driver | `database` |
| `QUEUE_CONNECTION` | Queue driver | `database` |
| `MAIL_MAILER` | Mail driver | `log` |
| `SANCTUM_STATEFUL_DOMAINS` | Sanctum domains | `localhost` |
| `API_VERSION_STRATEGY` | Version detection | `uri` |

## Project Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/   # Versioned API controllers
│   │   ├── Requests/V1/Auth/     # Form request validation
│   │   └── Resources/V1/         # API resource transformers
│   ├── Models/                   # Eloquent models
│   └── Notifications/V1/         # Notification classes
├── config/
│   ├── apiroute.php              # API versioning config
│   ├── cors.php                  # CORS config for frontend
│   ├── sanctum.php               # Sanctum auth config
│   └── scramble.php              # Scramble API docs config
├── database/
│   ├── migrations/               # Database migrations
│   ├── factories/                # Model factories
│   └── seeders/                  # Database seeders
├── dockerfiles/                  # Docker build files
├── routes/
│   ├── api.php                   # Base API routes
│   └── api/v1.php                # Version 1 API routes
├── tests/
│   ├── Feature/                  # Feature tests
│   │   ├── AuthTest.php          # Auth endpoint tests (15)
│   │   ├── ChangePasswordTest.php      # Password change (7)
│   │   ├── EmailVerificationTest.php   # Email verification (6)
│   │   ├── PasswordResetTest.php       # Password reset (8)
│   │   └── RateLimitingTest.php        # Rate limiting (5)
│   └── Unit/                     # Unit tests
│       └── UserTest.php          # User model tests (9)
├── .editorconfig                 # Editor formatting rules
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── docs/                         # This documentation folder
└── phpunit.xml                   # PHPUnit configuration
```
