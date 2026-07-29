# Architecture

## Overview

```
┌─────────────────────────────────────────────┐
│                  App.tsx                     │
│  ┌─────────────────────────────────────────┐│
│  │         QueryClientProvider             ││
│  │  ┌─────────────────────────────────────┐││
│  │  │          BrowserRouter              │││
│  │  │  ┌─────────────────────────────┐    │││
│  │  │  │          Routes             │    │││
│  │  │  │  ┌──────────────────────┐   │    │││
│  │  │  │  │   ProtectedRoute     │   │    │││
│  │  │  │  │   GuestRoute         │   │    │││
│  │  │  │  │   Pages              │   │    │││
│  │  │  │  └──────────────────────┘   │    │││
│  │  │  └─────────────────────────────┘    │││
│  │  └─────────────────────────────────────┘││
│  └─────────────────────────────────────────┘│
│                                              │
│  Stores (Zustand)    API Client (Axios)      │
│  ┌──────────────┐   ┌──────────────────┐    │
│  │  useAuth     │   │  /api/v1/*       │    │
│  │  use[Entity] │───│  Interceptors    │    │
│  └──────────────┘   │  Token mgmt      │    │
│                     └──────────────────┘    │
└─────────────────────────────────────────────┘
                      │
                      ▼
              ┌──────────────┐
              │  Backend API  │
              │  localhost:8000│
              └──────────────┘
```

## Data Flow

1. **User action** → Component calls store method
2. **Store** → Calls API client (`src/lib/api.ts`)
3. **API client** → Sends request with auth token
4. **Backend** → Returns JSON response
5. **Store** → Updates state
6. **Component** → Re-renders with new data

## Key Decisions

### Why Zustand over Redux/Context?
- Less boilerplate
- No providers needed
- Built-in selector optimization
- Works outside React (useful for API interceptors)

### Why React Query alongside Zustand?
- Zustand = client state (UI, auth, preferences)
- React Query = server state (API data, caching, refetching)
- They complement each other

### Why shadcn/ui over Material UI/Ant Design?
- Copy-paste components (no vendor lock)
- Full control over styling
- Built on Radix UI (accessible)
- Tailwind-native

### Why Axios over Fetch?
- Request/response interceptors (auto-attach tokens)
- Better error handling
- Request cancellation
- Automatic JSON parsing
