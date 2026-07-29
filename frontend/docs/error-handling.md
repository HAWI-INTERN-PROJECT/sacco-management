# Error Handling

## Error Boundary

Catches JavaScript errors anywhere in the component tree.

### Usage

Already wrapped around the app in `App.tsx`:

```tsx
import ErrorBoundary from '@/components/ErrorBoundary'

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### How It Works

1. Catches errors in child components
2. Shows fallback UI with error message
3. Provides "Try Again" (reload) and "Go Home" buttons
4. Logs error to console

### Fallback UI

```
┌─────────────────────────────────┐
│                                 │
│            500                  │
│                                 │
│    Something Went Wrong         │
│                                 │
│    An unexpected error          │
│    occurred. Please try again.  │
│                                 │
│    [Error message]              │
│                                 │
│    [Try Again]  [Go Home]       │
│                                 │
└─────────────────────────────────┘
```

### Custom Error Boundary

```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## 404 Page

Created in `src/pages/NotFoundPage.tsx`:

- Shows "404 - Page Not Found"
- Provides "Go Home" button
- Triggered by any unknown route

### Routes

```tsx
<Route path="*" element={<NotFoundPage />} />
```

## Toast Notifications

Using Sonner for success/error messages:

```tsx
import { toast } from 'sonner'

// Success
toast.success('Operation completed')

// Error
toast.error('Something went wrong')

// With description
toast('Title', {
  description: 'Description here',
})
```
