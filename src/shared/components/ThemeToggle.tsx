import { Pressable, Text } from 'react-native'
import { useTheme } from '@/shared/contexts/ThemeContext'

/** Light/dark toggle. accessibilityLabel reflects the action for screen readers + E2E. */
export function ThemeToggle() {
  const { colorScheme, toggleTheme } = useTheme()
  const next = colorScheme === 'dark' ? 'light' : 'dark'
  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${next} theme`}
      testID="theme-toggle"
      className="min-h-[44px] min-w-[44px] items-center justify-center rounded-button"
    >
      <Text className="text-lg">{colorScheme === 'dark' ? '☀️' : '🌙'}</Text>
    </Pressable>
  )
}
