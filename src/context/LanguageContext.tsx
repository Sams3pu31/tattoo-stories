import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { en } from '../locales/en'
import { ru } from '../locales/ru'

import type {
  Language,
  Translation,
} from '../locales/types'


// ========================================
// TYPES
// ========================================

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: Translation
}

type LanguageProviderProps = {
  children: ReactNode
}


// ========================================
// CONSTANTS
// ========================================

const LANGUAGE_STORAGE_KEY = 'tattoo-stories-language'


// ========================================
// INITIAL LANGUAGE
// ========================================

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'ru'
  }

  const savedLanguage = window.localStorage.getItem(
    LANGUAGE_STORAGE_KEY,
  )

  if (
    savedLanguage === 'ru' ||
    savedLanguage === 'en'
  ) {
    return savedLanguage
  }

  const browserLanguage =
    window.navigator.language.toLowerCase()

  return browserLanguage.startsWith('ru')
    ? 'ru'
    : 'en'
}


// ========================================
// CONTEXT
// ========================================

export const LanguageContext =
  createContext<LanguageContextValue | null>(null)


// ========================================
// PROVIDER
// ========================================

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguage] =
    useState<Language>(getInitialLanguage)

  const t = language === 'ru' ? ru : en


  // ======================================
  // SYNC LANGUAGE
  // ======================================

  useEffect(() => {
    document.documentElement.lang = language

    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language,
    )
  }, [language])


  // ======================================
  // CONTEXT VALUE
  // ======================================

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, t],
  )


  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}