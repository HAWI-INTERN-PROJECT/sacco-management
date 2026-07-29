import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">{t('errors.notFound')}</h2>
        <p className="max-w-md text-muted-foreground">
          {t('errors.notFoundDescription')}
        </p>
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('errors.goHome')}
        </Link>
      </div>
    </div>
  )
}
