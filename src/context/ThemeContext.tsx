import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'


export type ThemeMode =
  | 'light'
  | 'dark'


type ThemeContextValue = {
  theme: ThemeMode
  resolvedTheme: ThemeMode

  setTheme: (
    theme: ThemeMode,
  ) => void
}


export const ThemeContext =
  createContext<
    ThemeContextValue | undefined
  >(undefined)


type ThemeProviderProps = {
  children: ReactNode
}


const STORAGE_KEY =
  'tattoo-stories-theme'


function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const savedTheme =
    window.localStorage.getItem(
      STORAGE_KEY,
    )

  if (
    savedTheme === 'light' ||
    savedTheme === 'dark'
  ) {
    return savedTheme
  }

  /*
   * ВАЖНО:
   * больше не смотрим на тему системы.
   *
   * Первый заход всегда LIGHT.
   */
  return 'light'
}


export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [
    theme,
    setTheme,
  ] = useState<ThemeMode>(
    getInitialTheme,
  )


  useEffect(() => {
    document.documentElement.dataset.theme =
      theme

    document.documentElement.style.colorScheme =
      theme

    window.localStorage.setItem(
      STORAGE_KEY,
      theme,
    )
  }, [theme])


  const value =
    useMemo<ThemeContextValue>(
      () => ({
        theme,

        /*
         * Оставляем resolvedTheme,
         * чтобы ничего другого в проекте
         * случайно не сломалось.
         *
         * Теперь он просто равен theme.
         */
        resolvedTheme: theme,

        setTheme,
      }),
      [theme],
    )


  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  )
}