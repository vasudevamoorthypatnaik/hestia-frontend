import { createContext, useContext, type ReactNode } from 'react'

type Locale = 'en'

interface LocaleValue {
  locale: Locale
  /** Translate a key — English-only scaffold: returns the provided fallback (or the key). */
  t: (key: string, fallback?: string) => string
}

const LocaleContext = createContext<LocaleValue>({
  locale: 'en',
  t: (key, fallback) => fallback ?? key,
})

/** English-only locale scaffold (HES-SETUP). Full i18n (locales, setLocale) is a follow-up. */
export function LocaleProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale: 'en', t: (key, fallback) => fallback ?? key }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useTranslation(): LocaleValue {
  return useContext(LocaleContext)
}
