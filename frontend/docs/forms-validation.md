# Forms & Validation

## React Hook Form + Zod

### Basic Pattern

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 1. Define schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

// 2. Infer type
type FormValues = z.infer<typeof formSchema>

// 3. Use in component
function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormValues) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Common Validation Rules

```tsx
const schema = z.object({
  // Required
  name: z.string().min(1, 'Required'),

  // Email
  email: z.string().email('Invalid email'),

  // Min length
  password: z.string().min(8, 'Must be at least 8 characters'),

  // Max length
  bio: z.string().max(500, 'Must be 500 characters or less'),

  // Number
  age: z.number().min(18, 'Must be 18+').max(120),

  // Optional
  phone: z.string().optional(),

  // Default
  role: z.enum(['user', 'admin']).default('user'),

  // Boolean
  remember_me: z.boolean().default(false),

  // Refine (custom validation)
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
})
```

## Form with API Submit

```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const loginSchema = z.object({
  login: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data)
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed'
      toast.error(message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login">Email or Username</Label>
            <Input id="login" {...register('login')} />
            {errors.login && <p className="text-sm text-destructive">{errors.login.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
```

## React Hook Form API

### `register`

```tsx
<input {...register('fieldName')} />
<input {...register('fieldName', { required: true })} />
```

### `handleSubmit`

```tsx
<form onSubmit={handleSubmit(onSuccess, onError)}>
  {/* fields */}
</form>
```

### `formState`

```tsx
const { formState: { errors, isSubmitting, isDirty, isValid } } = useForm()
```

### `setValue` / `watch`

```tsx
const { setValue, watch } = useForm()
const value = watch('fieldName')
setValue('fieldName', 'new value')
```

### `reset`

```tsx
const { reset } = useForm()
reset() // reset to defaults
reset({ name: 'John', email: 'john@example.com' }) // reset with values
```

## Reusable Form Field

```tsx
// src/components/ui/form-field.tsx
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
}

export function FormField({ name, label, type, placeholder }: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} placeholder={placeholder} {...register(name)} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
```

Usage with `FormProvider`:

```tsx
import { FormProvider, useForm } from 'react-hook-form'

function MyForm() {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField name="email" label="Email" type="email" />
        <FormField name="password" label="Password" type="password" />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  )
}
```
