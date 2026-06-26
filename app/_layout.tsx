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
// Warm Hearth fonts (HES-REDESIGN): Quicksand (headlines) + Be Vietnam Pro (body).
import Quicksand from '@expo-google-fonts/quicksand/600SemiBold/Quicksand_600SemiBold.ttf'
import QuicksandBold from '@expo-google-fonts/quicksand/700Bold/Quicksand_700Bold.ttf'
import BeVietnamPro from '@expo-google-fonts/be-vietnam-pro/400Regular/BeVietnamPro_400Regular.ttf'
import BeVietnamProMedium from '@expo-google-fonts/be-vietnam-pro/500Medium/BeVietnamPro_500Medium.ttf'
import BeVietnamProSemiBold from '@expo-google-fonts/be-vietnam-pro/600SemiBold/BeVietnamPro_600SemiBold.ttf'
import BeVietnamProBold from '@expo-google-fonts/be-vietnam-pro/700Bold/BeVietnamPro_700Bold.ttf'
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
 * Root layout. Provider tree + Warm Hearth fonts (Quicksand/Be Vietnam Pro, native via
 * expo-font; web also via +html Google Fonts). URQL client swaps on reset (post-logout cache
 * clear). GestureHandlerRootView is required for the Reanimated AlertModal. Splash gates on
 * FONTS ONLY (never theme) — see note below.
 */
export default function RootLayout() {
  const [client, setClient] = useState(getUrqlClient())

  const [fontsLoaded, fontError] = useFonts({
    // Family-name keys MUST match tailwind.config fontFamily values (head: 'Quicksand',
    // body: 'Be Vietnam Pro') so NativeWind resolves them on native.
    Quicksand,
    'Quicksand-Bold': QuicksandBold,
    'Be Vietnam Pro': BeVietnamPro,
    'Be Vietnam Pro-Medium': BeVietnamProMedium,
    'Be Vietnam Pro-SemiBold': BeVietnamProSemiBold,
    'Be Vietnam Pro-Bold': BeVietnamProBold,
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
