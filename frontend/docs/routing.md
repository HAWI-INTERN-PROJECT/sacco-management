# Routing

## React Router

Routes are defined in `src/App.tsx`.

### Current Routes

| Path | Component | Auth | Description |
|---|---|---|---|
| `/` | → `/dashboard` | - | Redirects to dashboard |
| `/login` | `LoginPage` | Guest | Login page |
| `/register` | `RegisterPage` | Guest | Registration page |
| `/dashboard` | `DashboardPage` | Protected | Main dashboard |
| `*` | → `/dashboard` | - | Catch-all redirect |

### Route Guards

#### ProtectedRoute

Requires authentication. Redirects to `/login` if not authenticated.

```tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

#### GuestRoute

For unauthenticated users only. Redirects to `/dashboard` if already authenticated.

```tsx
<Route path="/login" element={
  <GuestRoute>
    <LoginPage />
  </GuestRoute>
} />
```

## Adding New Routes

### 1. Create the page

```tsx
// src/pages/SettingsPage.tsx
export default function SettingsPage() {
  return <div>Settings</div>
}
```

### 2. Add route in App.tsx

```tsx
import SettingsPage from '@/pages/SettingsPage'

// Inside <Routes>
<Route path="/settings" element={
  <ProtectedRoute>
    <SettingsPage />
  </ProtectedRoute>
} />
```

### 3. Add navigation

```tsx
import { Link } from 'react-router-dom'

<Link to="/settings">Settings</Link>
```

## Navigation

### Link Component

```tsx
import { Link } from 'react-router-dom'

<Link to="/dashboard">Dashboard</Link>
<Link to="/settings">Settings</Link>
```

### Programmatic Navigation

```tsx
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/dashboard')
  }

  // With replace (no history entry)
  navigate('/login', { replace: true })

  // Go back
  navigate(-1)
}
```

### Active Link Styling

```tsx
import { NavLink } from 'react-router-dom'

<NavLink
  to="/dashboard"
  className={({ isActive }) =>
    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
  }
>
  Dashboard
</NavLink>
```

## Nested Routes

```tsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
  <Route path="tasks" element={<TaskList />} />
  <Route path="tasks/:id" element={<TaskDetail />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

DashboardLayout:

```tsx
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet /> {/* Nested route content renders here */}
      </main>
    </div>
  )
}
```

## Reading URL Parameters

```tsx
import { useParams, useSearchParams } from 'react-router-dom'

// /tasks/123
function TaskDetail() {
  const { id } = useParams()
  // id = "123"
}

// /tasks?page=2&sort=desc
function TaskList() {
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') // "2"
  const sort = searchParams.get('sort') // "desc"
}
```
