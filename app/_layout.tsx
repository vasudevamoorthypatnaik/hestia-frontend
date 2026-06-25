// WeakRef polyfill must load before React Navigation (which uses WeakRef internally).
import '@/shared/polyfills/weakref'
import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { Provider as URQLProvider } from 'urql'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import Newsreader from '@expo-google-fonts/newsreader/500Medium/Newsreader_500Medium.ttf'
import NewsreaderSemiBold from '@expo-google-fonts/newsreader/600SemiBold/Newsreader_600SemiBold.ttf'
import HankenGrotesk from '@expo-google-fonts/hanken-grotesk/500Medium/HankenGrotesk_500Medium.ttf'
import HankenGroteskBold from '@expo-google-fonts/hanken-grotesk/700Bold/HankenGrotesk_700Bold.ttf'
import { getUrqlClient, onUrqlClientReset } from '@/shared/graphql/client'
import { ThemeProvider } from '@/shared/contexts/ThemeContext'
import { AlertProvider } from '@/shared/contexts/AlertContext'
import { LocaleProvider } from '@/shared/i18n/LocaleContext'
import { NetworkStatusProvider } from '@/shared/contexts/NetworkStatusContext'
import { UserProfileProvider } from '@/shared/contexts/UserProfileContext'
import { initSentry } from '@/shared/config/sentry'
import '../global.css'

initSentry()
// Keep splash visible until fonts + theme are ready (avoids unstyled/flash on cold start).
void SplashScreen.preventAutoHideAsync()

/**
 * Root layout (HES-SETUP). Provider tree + Phase 1 fonts (Newsreader/Hanken Grotesk, native via
 * expo-font; web also via +html Google Fonts). URQL client swaps on reset (post-logout cache
 * clear). GestureHandlerRootView is required for the Reanimated AlertModal.
 */
export default function RootLayout() {
  const [client, setClient] = useState(getUrqlClient())

  const [fontsLoaded, fontError] = useFonts({
    Newsreader,
    'Newsreader-SemiBold': NewsreaderSemiBold,
    HankenGrotesk,
    'HankenGrotesk-Bold': HankenGroteskBold,
  })

  useEffect(() => {
    return onUrqlClientReset(() => setClient(getUrqlClient()))
  }, [])

  // Gate ONLY on fonts — NOT on theme. ThemeProvider must mount unconditionally; gating the
  // whole tree (incl. ThemeProvider) on a theme-ready signal it emits would deadlock (the app
  // would render null forever and the screen stays blank).
  const ready = fontsLoaded || !!fontError
  useEffect(() => {
    if (ready) void SplashScreen.hideAsync()
  }, [ready])

  if (!ready) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LocaleProvider>
            <AlertProvider>
              <URQLProvider value={client}>
                <NetworkStatusProvider>
                  <UserProfileProvider>
                    <StatusBar style="auto" />
                    <Stack screenOptions={{ headerShown: false }} />
                  </UserProfileProvider>
                </NetworkStatusProvider>
              </URQLProvider>
            </AlertProvider>
          </LocaleProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
