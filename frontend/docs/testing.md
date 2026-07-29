# Testing

## Setup

The project uses **Vitest** for unit tests and **React Testing Library** for component tests.

### Install

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Configure

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom'
```

### Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Writing Tests

### Unit Test

```ts
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('p-4', 'bg-red-500')
    expect(result).toBe('p-4 bg-red-500')
  })

  it('handles conditional classes', () => {
    const result = cn('p-4', false && 'bg-red-500', 'text-white')
    expect(result).toBe('p-4 text-white')
  })
})
```

### Component Test

```tsx
// src/components/ui/button.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-destructive')
  })

  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

### Integration Test

```tsx
// src/pages/LoginPage.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

// Mock the auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
    isLoading: false,
  }),
}))

describe('LoginPage', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Email or username is required')).toBeInTheDocument()
  })
})
```

### Mocking API Calls

```ts
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.post('/api/v1/login', () => {
    return HttpResponse.json({
      user: { id: 1, name: 'Test User' },
      access_token: 'test-token',
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## File Conventions

| File Pattern | Purpose |
|---|---|
| `*.test.ts` | Unit tests |
| `*.test.tsx` | Component tests |
| `*.spec.ts` | Alternative naming |
| `*.spec.tsx` | Alternative naming |
| `src/test/setup.ts` | Test setup |
| `src/test/mocks/` | Mock data |

## Test Coverage

| Test File | Tests | Covers |
|---|---|---|
| `button.test.tsx` | 10 | Variants, sizes, disabled, ref |
| `input.test.tsx` | 7 | Types, placeholder, disabled |
| `label.test.tsx` | 3 | Rendering, styling |
| `card.test.tsx` | 6 | All card sub-components |
| `LoginPage.test.tsx` | 5 | Form, validation, submit |
| `RegisterPage.test.tsx` | 6 | Form, validation, password match |
| `DashboardPage.test.tsx` | 5 | User info, logout |
| `auth.test.ts` | 6 | Login, logout, profile, token |
| `utils.test.ts` | 5 | cn() function |
| **Total** | **53+** | |

## Running Tests

```bash
# Watch mode
npm test

# Single run
npm run test:run

# With coverage
npm run test:coverage

# Specific file
npm test -- src/components/ui/button.test.tsx

# By pattern
npm test -- --testNamePattern="renders"
```

## Best Practices

1. **Test behavior, not implementation** - What the user sees/does
2. **Use `screen` queries** - `getByText`, `getByRole`, `getByLabelText`
3. **User events** - Use `userEvent` over `fireEvent`
4. **Async operations** - Use `findBy*` for async elements
5. **Mock external dependencies** - API calls, stores, routers
6. **Keep tests isolated** - Each test should be independent
