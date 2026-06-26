import { View, Text, Pressable, ScrollView } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { ThemeToggle } from '@/shared/components/ThemeToggle'

/**
 * Forgot-password screen (HES-REDESIGN) — Warm Hearth card placeholder. Functional reset is OUT
 * of scope (A5): no credential inputs, no submit. Route: /auth/forgot-password.
 */
export function ForgotPasswordScreen() {
  const router = useRouter()
  return (
    <ScrollView
      className="flex-1 bg-surface dark:bg-surface-dark"
      contentContainerClassName="min-h-full items-center justify-center p-6"
    >
      <View className="w-full max-w-[400px] items-center">
        <View className="absolute right-0 top-0">
          <ThemeToggle />
        </View>
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-pill bg-surface-container-high dark:bg-surface-container-high-dark">
          <MaterialIcons name="lock-reset" size={32} color="#9a4023" />
        </View>
        <Text className="mb-2 text-center font-head text-2xl font-bold text-on-surface dark:text-on-surface-dark">
          Reset your password
        </Text>
        <Text className="mb-8 text-center font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
          Password reset is coming soon. For now, contact support to recover your household account.
        </Text>
        <Pressable
          onPress={() => router.replace('/auth/login' as Href)}
          accessibilityRole="link"
          accessibilityLabel="Back to sign in"
          className="min-h-[44px] justify-center"
        >
          <Text className="font-body text-sm font-bold text-primary dark:text-primary-dark">Back to sign in</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}
