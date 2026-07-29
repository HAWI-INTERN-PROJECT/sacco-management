#!/bin/bash

# Frontend Naming Convention Checker
# Checks: Components, Hooks, Stores, Types, Files

ERRORS=0

error() {
    echo "ERROR: $1"
    ERRORS=$((ERRORS + 1))
}

# ─── Components: PascalCase ───────────────────────────────

echo ""
echo "Checking Components..."

find src/components -name "*.tsx" -not -path "*/ui/*" 2>/dev/null | while read -r file; do
    filename=$(basename "$file" .tsx)

    # Skip index files
    [ "$filename" = "index" ] && continue

    if ! echo "$filename" | grep -qP '^[A-Z][a-zA-Z0-9]+$'; then
        error "Component '$filename' must be PascalCase (in $file)"
    fi
done

echo "  (shadcn/ui components in components/ui/ are excluded)"

# ─── Pages: PascalCase + Page suffix ──────────────────────

echo ""
echo "Checking Pages..."

for file in src/pages/*.tsx; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .tsx)

    # Skip test files
    echo "$filename" | grep -qP '\.test$' && continue

    if ! echo "$filename" | grep -qP '^[A-Z][a-zA-Z0-9]+Page$'; then
        error "Page '$filename' must be PascalCase with 'Page' suffix"
    fi
done

# ─── Stores: camelCase ────────────────────────────────────

echo ""
echo "Checking Stores..."

for file in src/stores/*.ts; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .ts)

    # Skip test files
    echo "$filename" | grep -qP '\.test$' && continue

    if ! echo "$filename" | grep -qP '^[a-z][a-zA-Z0-9]+$'; then
        error "Store '$filename' must be camelCase"
    fi
done

# ─── Types: PascalCase ────────────────────────────────────

echo ""
echo "Checking Types..."

for file in src/types/*.ts; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .ts)

    # Types file can be index.ts or PascalCase
    if [ "$filename" != "index" ]; then
        if ! echo "$filename" | grep -qP '^[A-Z][a-zA-Z0-9]+$'; then
            error "Types file '$filename' must be PascalCase"
        fi
    fi
done

# ─── Lib: camelCase ───────────────────────────────────────

echo ""
echo "Checking Lib files..."

for file in src/lib/*.ts; do
    [ -f "$file" ] || continue
    filename=$(basename "$file" .ts)

    # Skip test files
    echo "$filename" | grep -qP '\.test$' && continue

    if ! echo "$filename" | grep -qP '^[a-z][a-zA-Z0-9]+$'; then
        error "Lib file '$filename' must be camelCase"
    fi
done

# ─── Hooks: use camelCase ─────────────────────────────────

echo ""
echo "Checking Hooks..."

find src -name "use*.ts" -o -name "use*.tsx" 2>/dev/null | while read -r file; do
    filename=$(basename "$file" | sed 's/\.\(ts\|tsx\)$//')

    if ! echo "$filename" | grep -qP '^use[A-Z][a-zA-Z0-9]+$'; then
        error "Hook '$filename' must start with 'use' + PascalCase"
    fi
done

# ─── CSS classes: kebab-case (in .tsx files) ──────────────

echo ""
echo "Checking className attributes..."

find src -name "*.tsx" 2>/dev/null | while read -r file; do
    # Extract className values and check for camelCase violations
    grep -oP 'className="[^"]*"' "$file" 2>/dev/null | grep -oP '"[^"]*"' | tr -d '"' | tr ' ' '\n' | grep -v '^$' | while read -r class; do
        # Skip template literals, dynamic classes, and Tailwind utilities with colons
        echo "$class" | grep -qP '^\$' && continue
        echo "$class" | grep -qP '^\{' && continue
        echo "$class" | grep -qP ':' && continue
        echo "$class" | grep -qP '^[A-Z]' && continue

        # Check if it's a valid Tailwind class or CSS variable
        echo "$class" | grep -qP '^bg-\[' && continue
        echo "$class" | grep -qP '^text-\[' && continue
        echo "$class" | grep -qP '^border-\[' && continue
    done
done

# ─── Import paths: @/ alias ───────────────────────────────

echo ""
echo "Checking Import paths..."

find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read -r file; do
    # Check for relative imports going up more than 2 levels
    grep -nP "from '\.\./\.\./\.\." "$file" 2>/dev/null | while read -r line; do
        error "Deep relative import in $file: use @/ alias instead"
    done
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
