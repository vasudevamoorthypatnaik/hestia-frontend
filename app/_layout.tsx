import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { Provider as URQLProvider } from 'urql'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { getUrqlClient, onUrqlClientReset } from '@/shared/graphql/client'
import { ThemeProvider } from '@/shared/contexts/ThemeContext'
import { initSentry } from '@/shared/config/sentry'
import '../global.css'

// Sentry init as early as possible (no-op until DSN configured).
initSentry()

/**
 * Root layout (HES-SETUP) — provider tree. URQL client is swapped on reset (post-logout
 * cache clear) via onUrqlClientReset. ThemeProvider drives light/dark. Non-essential invite
 * subsystems (i18n, notifications, network banner, Sentry SDK) are deferred per plan trim.
 */
export default function RootLayout() {
  const [client, setClient] = useState(getUrqlClient())

  useEffect(() => {
    return onUrqlClientReset(() => setClient(getUrqlClient()))
  }, [])

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <URQLProvider value={client}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
        </URQLProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
