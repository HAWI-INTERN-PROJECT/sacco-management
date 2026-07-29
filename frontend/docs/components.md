# Components

## shadcn/ui Components

Pre-installed components in `src/components/ui/`:

| Component | File | Purpose |
|---|---|---|
| Button | `button.tsx` | Actions, form submits |
| Card | `card.tsx` | Content containers |
| Input | `input.tsx` | Text inputs |
| Label | `label.tsx` | Form labels |

### Installing More Components

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add toast
```

Or add them all at once:

```bash
npx shadcn@latest add button card input label dialog dropdown-menu select tabs toast separator avatar checkbox popover scroll-area tooltip
```

## Button

```tsx
import { Button } from "@/components/ui/button"

// Variants
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// With icon
<Button><Save className="mr-2 h-4 w-4" /> Save</Button>

// Loading state
<Button disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>

// As child (for links)
<Button asChild>
  <a href="/download">Download</a>
</Button>
```

## Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Input

```tsx
import { Input } from "@/components/ui/input"

<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="••••••••" disabled />
<Input type="file" />
```

## Creating New Components

### Simple Component

```tsx
// src/components/ui/badge.tsx
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      variant === "default" && "bg-primary text-primary-foreground",
      variant === "secondary" && "bg-secondary text-secondary-foreground",
      variant === "destructive" && "bg-destructive text-destructive-foreground",
      className
    )}>
      {children}
    </span>
  )
}
```

### Component with CVA (recommended)

```tsx
// src/components/ui/badge.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
```

## Using Icons

```tsx
import { LogOut, User, Save, Trash2 } from "lucide-react"

<LogOut className="h-4 w-4" />
<User className="h-5 w-5 text-muted-foreground" />
<Save className="mr-2 h-4 w-4" /> Save
```

Browse icons: https://lucide.dev/icons
