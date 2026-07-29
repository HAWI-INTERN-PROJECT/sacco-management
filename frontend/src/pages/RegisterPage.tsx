import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuthStore()

  const registerSchema = z.object({
    name: z.string().min(1, t('auth.nameRequired')),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, t('auth.passwordMin')),
    password_confirmation: z.string(),
  }).refine((data) => data.password === data.password_confirmation, {
    message: t('auth.passwordMatch'),
    path: ['password_confirmation'],
  })

  type RegisterForm = z.infer<typeof registerSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data)
      toast.success('Account created successfully')
      navigate('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('auth.registerTitle')}</CardTitle>
          <CardDescription>{t('auth.registerSubtitle')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.nameRequired').replace(' is required', '')}</Label>
              <Input id="name" placeholder="John Doe" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">{t('auth.username')}</Label>
              <Input id="username" placeholder="johndoe" {...register('username')} />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">{t('auth.confirmPassword')}</Label>
              <Input id="password_confirmation" type="password" placeholder="••••••••" {...register('password_confirmation')} />
              {errors.password_confirmation && (
                <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('common.loading') : t('auth.registerButton')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                {t('auth.login')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
