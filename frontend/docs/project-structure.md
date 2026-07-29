# Project Structure

```
Frontend/
├── public/                    # Static assets
│   └── favicon.svg
│
├── src/
│   ├── components/            # Reusable UI components
│   │   └── ui/                # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   │
│   ├── lib/                   # Utilities and services
│   │   ├── api.ts             # Axios instance + interceptors
│   │   └── utils.ts           # cn() helper, common utils
│   │
│   ├── pages/                 # Route-level components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── DashboardPage.tsx
│   │
│   ├── stores/                # Zustand state stores
│   │   └── auth.ts            # Authentication state
│   │
│   ├── types/                 # TypeScript types
│   │   └── index.ts           # Shared interfaces
│   │
│   ├── App.tsx                # Root component + routing
│   ├── index.css              # Tailwind + theme config
│   └── main.tsx               # Entry point
│
├── index.html                 # HTML template
├── package.json               # Dependencies + scripts
├── tsconfig.json              # TypeScript config (root)
├── tsconfig.app.json          # TypeScript config (app)
├── tsconfig.node.json         # TypeScript config (node)
└── vite.config.ts             # Vite + Tailwind config
```

## Adding Files

### New Page

```
src/pages/NewPage.tsx
```

Add route in `App.tsx`:
```tsx
<Route path="/new" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
```

### New Component

```
src/components/ui/component-name.tsx
```

### New Store

```
src/stores/entity.ts
```

### New Type

```
src/types/index.ts  (add to existing file)
```

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserCard.tsx` |
| Pages | PascalCase + Page | `LoginPage.tsx` |
| Stores | camelCase | `auth.ts` |
| Hooks | use + PascalCase | `useAuth.ts` |
| Types | PascalCase | `User`, `LoginRequest` |
| Lib utils | camelCase | `formatDate.ts` |
| CSS classes | kebab-case | `bg-primary` |
| Variables | camelCase | `userName` |
| Constants | UPPER_SNAKE | `API_BASE_URL` |
| shadcn/ui | lowercase (don't rename) | `button.tsx` |

### Verify Naming

```bash
bash scripts/check-naming.sh
```

Checks: Components, Pages, Stores, Types, Lib files, Hooks, Import paths.
