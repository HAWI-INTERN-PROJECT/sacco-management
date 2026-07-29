import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    return (localStorage.getItem('theme') as Theme) || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    return theme === 'system' ? getSystemTheme() : theme
  })

  useEffect(() => {
    const root = document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => setResolvedTheme(getSystemTheme())

      mediaQuery.addEventListener('change', handleChange)
      setResolvedTheme(getSystemTheme())

      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    setResolvedTheme(theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme)
    setThemeState(newTheme)
  }

  return { theme, resolvedTheme, setTheme }
}
