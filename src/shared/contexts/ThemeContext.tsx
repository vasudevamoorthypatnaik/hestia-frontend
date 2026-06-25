import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useColorScheme as useSystemColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colorScheme as nativeWindColorScheme } from 'nativewind'

type Theme = 'light' | 'dark' | 'system'
type ColorScheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = '@hestia/theme'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme() ?? 'light'
  // Phase 1 design is a warm light palette → default to 'light' (invite defaulted 'dark').
  const [theme, setThemeState] = useState<Theme>('light')

  // Load the saved theme preference on mount. The provider mounts unconditionally (the root
  // layout gates only on fonts), so there is no splash-coordination callback to fire.
  useEffect(() => {
    void loadTheme()
  }, [])

  // Single source of truth for the NativeWind observable + web `dark` class.
  useEffect(() => {
    const effective = theme === 'system' ? systemColorScheme : theme
    nativeWindColorScheme.set(effective)
    if (typeof document !== 'undefined') {
      if (effective === 'dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }
  }, [theme, systemColorScheme])

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'light' || saved === 'dark' || saved === 'system') setThemeState(saved)
    } catch (error) {
      console.error('Failed to load theme preference:', error)
    }
  }

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme)
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch (error) {
      console.error('Failed to save theme preference:', error)
    }
  }

  const colorScheme: ColorScheme = theme === 'system' ? systemColorScheme : theme

  const toggleTheme = () => setTheme(colorScheme === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
