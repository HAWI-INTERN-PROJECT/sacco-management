# Styling

## Tailwind CSS 4

### Utility Classes

```tsx
<div className="p-4 bg-background text-foreground rounded-lg border">
  <h1 className="text-2xl font-bold">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Responsive

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

### Conditional Classes

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "p-4 rounded-lg",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
  Content
</div>
```

## shadcn/ui Theme

Theme is defined in `src/index.css`:

```css
@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  --color-primary: hsl(222.2 47.4% 11.2%);
  --color-primary-foreground: hsl(210 40% 98%);
  /* ... */
  --radius: 0.5rem;
}
```

### Theme Colors

| Color | Use |
|---|---|
| `background` | Page background |
| `foreground` | Default text |
| `primary` | Main brand color, buttons |
| `secondary` | Secondary buttons, badges |
| `muted` | Subtle backgrounds |
| `muted-foreground` | Secondary text |
| `destructive` | Delete, errors |
| `border` | Borders, dividers |
| `input` | Input borders |
| `ring` | Focus rings |
| `card` | Card backgrounds |
| `accent` | Hover states |

### Using Theme Colors

```tsx
{/* Tailwind classes */}
<div className="bg-primary text-primary-foreground">Primary</div>
<div className="bg-secondary text-secondary-foreground">Secondary</div>
<div className="bg-muted text-muted-foreground">Muted</div>
<div className="bg-destructive text-destructive-foreground">Destructive</div>

{/* Inline with CSS variables */}
<div style={{ backgroundColor: 'hsl(var(--primary))' }}>Custom</div>
```

## Changing Theme

### Dark Mode

Add to `src/index.css`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: hsl(222.2 84% 4.9%);
    --color-foreground: hsl(210 40% 98%);
    --color-card: hsl(222.2 84% 4.9%);
    --color-card-foreground: hsl(210 40% 98%);
    --color-primary: hsl(210 40% 98%);
    --color-primary-foreground: hsl(222.2 47.4% 11.2%);
    /* ... */
  }
}
```

### Toggle Component

```tsx
// src/components/theme-toggle.tsx
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const toggle = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

## Adding New Components

### Using CVA (recommended)

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
```

### Usage

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
```
