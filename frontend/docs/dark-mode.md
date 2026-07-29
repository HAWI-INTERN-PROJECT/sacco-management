# Dark Mode

Built-in dark mode support using Tailwind CSS and a custom theme hook.

## Usage

### Theme Toggle

Click the sun/moon icon in the header to cycle through themes:

- **Light** ☀️ — Light mode
- **Dark** 🌙 — Dark mode
- **System** 💻 — Follow OS preference

### Components

```tsx
import { ThemeToggle } from '@/components/ThemeToggle'

<ThemeToggle />
```

## How It Works

### useTheme Hook

```tsx
import { useTheme } from '@/hooks/useTheme'

function MyComponent() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <div>
      <p>Current: {theme}</p>
      <p>Resolved: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

### Storage

Theme preference is saved in `localStorage`:

```ts
localStorage.setItem('theme', 'dark')  // or 'light' or 'system'
```

### Tailwind Classes

Use `dark:` prefix for dark mode styles:

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

## Theme Colors

| Element | Light | Dark |
|---|---|---|
| Background | `bg-background` | `dark:bg-background` |
| Text | `text-foreground` | `dark:text-foreground` |
| Card | `bg-card` | `dark:bg-card` |
| Border | `border-border` | `dark:border-border` |

## System Preference

When theme is set to "system":
- Listens to `prefers-color-scheme` media query
- Automatically switches when OS theme changes
- Updates in real-time
