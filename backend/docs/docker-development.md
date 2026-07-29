# Docker Development Environment

This project uses Docker Compose for a consistent development environment.

## Services

| Service | Port | Description |
|---|---|---|
| `app` | `80` | Nginx web server |
| `php` | `9000` | PHP-FPM |
| `mysql` | `3306` | MySQL database |
| `postgres` | `5432` | PostgreSQL database |
| `redis` | `6379` | Redis cache |
| `mailpit` | `8025` | Email testing UI |
| `adminer` | `8080` | Database management UI |
| `composer` | - | PHP dependency management |
| `artisan` | - | Laravel CLI |

## Setup

### 1. Clone and configure

```bash
git clone <repo-url>
cd SACCO-Management-System
cp .env.example .env
cp compose.override.yaml.example compose.override.yaml
```

Edit `compose.override.yaml` to configure ports and services.

Key `.env` variables for Docker:

| Variable | Value |
|---|---|
| `DB_CONNECTION` | `mysql` or `postgres` |
| `DB_HOST` | `mysql` or `postgres` (service name) |
| `DB_DATABASE` | `homestead` |
| `DB_USERNAME` | `homestead` |
| `DB_PASSWORD` | `secret` |

### 2. Build and start

```bash
docker compose up -d --build
```

### 3. Install dependencies

```bash
docker compose run --rm composer install
```

### 4. Setup application

```bash
docker compose run --rm artisan key:generate
docker compose run --rm artisan migrate
```

### 5. (Optional) Seed database

```bash
docker compose run --rm artisan db:seed
```

## Running Commands

### PHP / Artisan

```bash
docker compose run --rm artisan <command>

# Examples:
docker compose run --rm artisan migrate
docker compose run --rm artisan make:controller ProductController
docker compose run --rm artisan tinker
```

### Composer

```bash
docker compose run --rm composer <command>

# Examples:
docker compose run --rm composer require laravel/sanctum
docker compose run --rm composer dump-autoload
```

### Database CLI

```bash
# MySQL
docker compose exec mysql mysql -u homestead -psecret homestead

# PostgreSQL
docker compose exec postgres psql -U homestead -d homestead
```

## Accessing Services

| Service | URL |
|---|---|
| Application | [http://localhost](http://localhost) |
| API Docs (Scramble) | [http://localhost/docs/api](http://localhost/docs/api) |
| Mailpit | [http://localhost:8025](http://localhost:8025) |
| Adminer | [http://localhost:8080](http://localhost:8080) |

## Docker Files

```
dockerfiles/
├── nginx.dockerfile       # Nginx web server
├── nginx/                 # Nginx config files
├── php.dockerfile         # PHP-FPM with extensions
└── php.root.dockerfile    # PHP running as root
```

## Common Issues

### Port conflicts

If ports are already in use, edit `compose.override.yaml`:

```yaml
services:
  app:
    ports:
      - "8080:80"  # Use different host port
```

### Rebuild containers

After changing Dockerfiles or adding new PHP extensions:

```bash
docker compose up -d --build
```

### Reset database

```bash
docker compose run --rm artisan migrate:fresh --seed
```

### View logs

```bash
docker compose logs -f            # All services
docker compose logs -f php        # PHP service only
docker compose logs -f app        # Nginx service only
```

### Stop containers

```bash
docker compose down              # Stop and remove containers
docker compose down -v           # Also remove volumes (data loss!)
```
