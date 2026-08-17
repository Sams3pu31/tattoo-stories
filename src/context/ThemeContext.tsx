import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

type ThemeContextValue = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
}

type ThemeProviderProps = {
  children: ReactNode
}

const THEME_STORAGE_KEY = 'tattoo-stories-theme'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  if (
    savedTheme === 'light' ||
    savedTheme === 'dark' ||
    savedTheme === 'system'
  ) {
    return savedTheme
  }

  return 'system'
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)
  const [systemTheme, setSystemTheme] =
    useState<ResolvedTheme>(getSystemTheme)

  const resolvedTheme: ResolvedTheme =
    theme === 'system'
      ? systemTheme
      : theme

  // ----------------------------------------
  // Следим за системной темой.
  // Если пользователь изменит тему Windows/macOS,
  // сайт тоже сможет обновиться.
  // ----------------------------------------

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    setSystemTheme(
      mediaQuery.matches ? 'dark' : 'light',
    )

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleChange,
      )
    }
  }, [])

  // ----------------------------------------
  // Применяем тему к <html>
  // и запоминаем выбор пользователя.
  // ----------------------------------------

  useEffect(() => {
    const root = document.documentElement

    root.dataset.theme = resolvedTheme

    localStorage.setItem(
      THEME_STORAGE_KEY,
      theme,
    )
  }, [theme, resolvedTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}