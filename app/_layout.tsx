import { useEffect, useState, useCallback } from 'react'
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
  const [themeReady, setThemeReady] = useState(false)

  const [fontsLoaded, fontError] = useFonts({
    Newsreader,
    'Newsreader-SemiBold': NewsreaderSemiBold,
    HankenGrotesk,
    'HankenGrotesk-Bold': HankenGroteskBold,
  })

  useEffect(() => {
    return onUrqlClientReset(() => setClient(getUrqlClient()))
  }, [])

  const onThemeReady = useCallback(() => setThemeReady(true), [])

  const ready = (fontsLoaded || !!fontError) && themeReady
  useEffect(() => {
    if (ready) void SplashScreen.hideAsync()
  }, [ready])

  if (!ready) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider onReady={onThemeReady}>
          <AlertProvider>
            <URQLProvider value={client}>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }} />
            </URQLProvider>
          </AlertProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
