import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const loginSchema = z.object({
    login: z.string().min(1, t('auth.emailRequired')),
    password: z.string().min(1, t('auth.passwordRequired')),
  })

  type LoginForm = z.infer<typeof loginSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data)
      toast.success('Logged in successfully')
      const loggedInUser = useAuthStore.getState().user
      const isSuperAdmin =
        loggedInUser?.role === 'superadmin' ||
        loggedInUser?.username === 'superadmin' ||
        loggedInUser?.email === 'superadmin@example.com' ||
        data.login === 'superadmin' ||
        data.login === 'superadmin@example.com'

      if (isSuperAdmin) {
        navigate('/super-admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('auth.loginTitle')}</CardTitle>
          <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">{t('auth.emailOrUsername')}</Label>
              <Input
                id="login"
                placeholder="john@example.com"
                {...register('login')}
              />
              {errors.login && (
                <p className="text-sm text-destructive">{errors.login.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('common.loading') : t('auth.loginButton')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-primary underline-offset-4 hover:underline">
                {t('auth.register')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
