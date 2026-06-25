import { Redirect, Stack, type Href } from 'expo-router'
import { View } from 'react-native'
import { useAuthToken } from '@/features/auth/hooks/useAuthToken'

/**
 * Auth gate for the authenticated app (HES-SETUP). Waits for token hydration (AG3) so a
 * logged-in user is not falsely bounced on native cold start, then redirects to /auth/login
 * when there is no token (T5/T15). Otherwise renders the authenticated stack.
 */
export default function TabsLayout() {
  const { token, hydrated } = useAuthToken()

  if (!hydrated) {
    return <View className="flex-1 bg-surface-light dark:bg-surface-dark" />
  }
  if (!token) {
    return <Redirect href={'/auth/login' as Href} />
  }
  return <Stack screenOptions={{ headerShown: false }} />
}
