# API Integration

## Axios Client (`src/lib/api.ts`)

Pre-configured instance with:

- **Base URL**: `/api/v1` (proxied to `localhost:8000`)
- **Auto token**: Attaches `Authorization: Bearer <token>` header
- **Auto logout**: 401 responses clear token and redirect to `/login`

### Usage

```tsx
import api from '@/lib/api'

// GET
const response = await api.get('/profile')
// response.data.data → User object

// POST
const response = await api.post('/login', { login: 'email', password: 'pass' })
// response.data → AuthResponse

// PUT
await api.put('/change-password', { current_password: 'old', password: 'new' })

// PATCH
await api.patch('/tasks/1', { status: 'completed' })

// DELETE
await api.delete('/tasks/1')
```

### With React Query

```tsx
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users')
      return response.data
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return (
    <ul>
      {data.data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## API Endpoints Reference

### Auth

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| POST | `/register` | `{ name, email, username, password, password_confirmation, remember_me? }` | `AuthResponse` |
| POST | `/login` | `{ login, password, remember_me? }` | `AuthResponse` |
| POST | `/logout` | - | `{ message }` |
| GET | `/profile` | - | `{ data: User }` |
| PUT | `/change-password` | `{ current_password, password, password_confirmation }` | `{ message }` |
| GET | `/health` | - | `{ status, timestamp }` |

### AuthResponse

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe"
  },
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "expires_at": "2026-07-25 00:00:00"
}
```

## Error Handling

```tsx
import { toast } from 'sonner'

async function handleLogin() {
  try {
    await login({ login: 'email', password: 'pass' })
    toast.success('Logged in')
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    }
  }
}
```

### Validation Errors (422)

```tsx
import axios from 'axios'

try {
  await api.post('/register', data)
} catch (error) {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    const errors = error.response.data.errors
    // errors.email → ["The email has already been taken."]
    Object.entries(errors).forEach(([field, messages]) => {
      toast.error(`${field}: ${messages[0]}`)
    })
  }
}
```

## Adding New API Calls

1. Add types to `src/types/index.ts`:

```tsx
export interface Task {
  id: number
  status: 'pending' | 'in_progress' | 'completed'
  address: string
  created_at: string
}

export interface CreateTaskRequest {
  address: string
  recipient_name: string
}
```

2. Use in a store or component:

```tsx
import api from '@/lib/api'
import type { Task, CreateTaskRequest } from '@/types'

export async function getTasks(): Promise<Task[]> {
  const response = await api.get<{ data: Task[] }>('/tasks')
  return response.data.data
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const response = await api.post<{ data: Task }>('/tasks', data)
  return response.data.data
}
```
