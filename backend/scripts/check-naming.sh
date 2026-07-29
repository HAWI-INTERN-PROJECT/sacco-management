#!/bin/bash

# Laravel Naming Convention Checker
# Checks: Models, Controllers, Migrations, Config files

ERRORS=0

error() {
    echo "ERROR: $1"
    ERRORS=$((ERRORS + 1))
}

info() {
    echo "INFO: $1"
}

# ─── Models: PascalCase, singular ─────────────────────────

echo ""
echo "Checking Models..."

for file in app/Models/*.php; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .php)

    # PascalCase check
    if ! echo "$filename" | grep -qP '^[A-Z][a-zA-Z0-9]+$'; then
        error "Model '$filename' must be PascalCase"
    fi
done

# ─── Controllers: PascalCase + Controller suffix ──────────

echo ""
echo "Checking Controllers..."

find app/Http/Controllers -name "*.php" | while read -r file; do
    filename=$(basename "$file" .php)

    # Skip base Controller
    [ "$filename" = "Controller" ] && continue

    if ! echo "$filename" | grep -qP '^[A-Z][a-zA-Z0-9]+Controller$'; then
        error "Controller '$filename' must be PascalCase with 'Controller' suffix"
    fi
done

# ─── Form Requests: PascalCase + Request suffix ───────────

echo ""
echo "Checking Form Requests..."

find app/Http/Requests -name "*.php" | while read -r file; do
    filename=$(basename "$file" .php)

    if ! echo "$filename" | grep -qP '^[A-Z][a-zA-Z0-9]+Request$'; then
        error "Form Request '$filename' must be PascalCase with 'Request' suffix"
    fi
done

# ─── Resources: PascalCase + Resource suffix ──────────────

echo ""
echo "Checking Resources..."

find app/Http/Resources -name "*.php" | while read -r file; do
    filename=$(basename "$file" .php)

    if ! echo "$filename" | grep -qP '^[A-Z][a-zA-Z0-9]+Resource$'; then
        error "Resource '$filename' must be PascalCase with 'Resource' suffix"
    fi
done

# ─── Migrations: snake_case with timestamp prefix ─────────

echo ""
echo "Checking Migrations..."

for file in database/migrations/*.php; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .php)

    if ! echo "$filename" | grep -qP '^\d{4}_\d{2}_\d{2}_\d{6}_[a-z0-9_]+$'; then
        error "Migration '$filename' must follow: YYYY_MM_DD_HHMMSS_snake_case"
    fi
done

# ─── Config files: snake_case.php ─────────────────────────

echo ""
echo "Checking Config files..."

for file in config/*.php; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .php)

    # Skip vendor-published configs (may contain hyphens)
    case "$filename" in
        log-viewer) continue ;;
    esac

    if ! echo "$filename" | grep -qP '^[a-z][a-z0-9_]+$'; then
        error "Config '$filename' must be snake_case"
    fi
done

# ─── Routes: kebab-case in route definitions ──────────────

echo ""
echo "Checking Route files..."

for file in routes/*.php routes/**/*.php; do
    [ -f "$file" ] || continue

    # Check route URIs are kebab-case (skip PHP syntax lines)
    grep -nP "Route::(get|post|put|patch|delete)\s*\(\s*['\"]" "$file" | while read -r line; do
        uri=$(echo "$line" | grep -oP "['\"]([^'\"]+)['\"]" | head -1 | tr -d "'\"")

        # Skip empty, root, or parameter URIs
        [ -z "$uri" ] || [ "$uri" = "/" ] && continue
        echo "$uri" | grep -qP '^{' && continue

        # Check kebab-case (allow slashes and {params})
        clean_uri=$(echo "$uri" | sed 's/{[^}]*}//g' | sed 's/\///g')
        if [ -n "$clean_uri" ] && ! echo "$clean_uri" | grep -qP '^[a-z][a-z0-9-]*$'; then
            error "Route URI '$uri' in $file must be kebab-case"
        fi
    done
done

# ─── Namespace: PSR-4 should match path ───────────────────

echo ""
echo "Checking Namespaces..."

find app -name "*.php" | while read -r file; do
    # Extract namespace
    namespace=$(grep -oP '^namespace\s+\K[^;]+' "$file" | head -1)

    [ -z "$namespace" ] && continue

    # Convert namespace to path: App\Http\Controllers -> app/Http/Controllers
    expected_path=$(echo "$namespace" | sed 's/App/app/' | sed 's/\\/\//g')

    # Get actual path relative to project root
    actual_path=$(dirname "$file")

    if [ "$expected_path" != "$actual_path" ]; then
        error "Namespace mismatch: $file has namespace $namespace (expected: $expected_path, actual: $actual_path)"
    fi
done

# ─── Summary ──────────────────────────────────────────────

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -gt 0 ]; then
    echo "FAILED: $ERRORS naming convention errors found"
    exit 1
else
    echo "PASSED: All naming conventions OK"
    exit 0
fi
