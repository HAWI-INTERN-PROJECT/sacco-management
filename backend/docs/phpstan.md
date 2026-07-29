# PHPStan / Larastan (Static Analysis)

This project uses **Larastan** (PHPStan for Laravel) for static analysis.

## Setup

Installed via Composer:

```bash
composer require --dev larastan/larastan
```

Configuration in `phpstan.neon`:

```neon
includes:
    - vendor/larastan/laravel-structure/extension.neon

parameters:
    paths:
        - app
    level: 6
    ignoreErrors:
        - '#Unsafe call to static method#'
        - '#Cannot call method#'
    excludePaths:
        - vendor
        - storage
        - bootstrap/cache
```

## Running Analysis

```bash
# Run PHPStan
vendor/bin/phpstan analyse

# Run via Composer script
composer analyse

# With output format
vendor/bin/phpstan analyse --format=table

# Check specific file
vendor/bin/phpstan analyse app/Http/Controllers/Api/V1/AuthController.php
```

## Level Guide

| Level | Description |
|---|---|
| 0 | Basic checks (unknown classes, functions) |
| 1 | Possibly undefined variables, unknown magic methods |
| 2 | Unknown methods on `$this`, validating PHPDocs |
| 3 | Return types, types assigned to properties |
| 4 | Basic dead code, always true/false conditions |
| 5 | Checking types of arguments passed to methods |
| **6 (current)** | **Reporting partially wrong union types** |
| 7 | Reporting nullable type mismatches |
| 8 | Report missing type hints |
| 9 | Strict type checking |
| 10 | Tainting analysis |

## CI Integration

PHPStan runs in GitHub Actions on every push/PR:

```yaml
backend-static-analysis:
  name: Backend Static Analysis
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
    - run: composer install
    - run: vendor/bin/phpstan analyse --no-progress
```

## Common Errors

| Error | Fix |
|---|---|
| `Call to an undefined method` | Check method exists or add `@method` PHPDoc |
| `Parameter #1 of method expects string, int given` | Fix type or add cast |
| `Property does not exist` | Check property name or add `@property` PHPDoc |
| `Variable might not be defined` | Initialize variable or add null check |
