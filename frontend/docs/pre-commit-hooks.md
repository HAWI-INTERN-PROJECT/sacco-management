# Pre-commit Hooks

Automated code quality checks before each commit using Husky and lint-staged.

## Setup

### Frontend

```bash
cd Frontend
npm install
```

Husky is installed automatically via `prepare` script.

### Hooks Location

```
.husky/
└── pre-commit    # Runs before each commit
```

## What It Does

On `git commit`, the pre-commit hook runs:

### Frontend (lint-staged)

```bash
npx lint-staged --config Frontend/lint-staged.config.js
```

**Checks:**
- `*.ts`, `*.tsx` files → `oxlint --fix` + `tsc --noEmit`
- `*.json`, `*.css`, `*.md` files → `prettier --write`

### Backend (Laravel Pint)

```bash
cd Backend && vendor/bin/pint --test
```

**Checks:**
- `*.php` files → Code style validation

## Configuration

### Frontend (lint-staged.config.js)

```js
export default {
  '*.{ts,tsx}': ['oxlint --fix', 'tsc --noEmit --pretty'],
  '*.{json,css,md}': ['prettier --write'],
}
```

### Customizing Rules

Edit `Frontend/lint-staged.config.js`:

```js
export default {
  // Add more patterns
  '*.{ts,tsx}': ['oxlint --fix', 'tsc --noEmit --pretty'],
  '*.php': ['vendor/bin/pint --test'],
  '*.blade.php': ['blade-formatter --write'],
}
```

## Bypassing Hooks

### Skip for One Commit

```bash
git commit --no-verify -m "Skip hooks"
```

### Temporarily Disable

```bash
HUSKY=0 git commit -m "Skip hooks"
```

### Permanently Disable (Not Recommended)

```bash
git config core.hooksPath /dev/null
```

## Troubleshooting

| Issue | Solution |
|---|---|
| Hook not running | Run `npx husky` in Frontend |
| Permission denied | `chmod +x .husky/pre-commit` |
| Lint errors | Fix the errors, then commit again |
| TypeScript errors | Run `npx tsc --noEmit` to see issues |

## CI vs Local

- **Local:** Pre-commit hooks run automatically
- **CI:** GitHub Actions runs full lint + type check + tests

Both ensure code quality, but hooks are faster (only check staged files).
