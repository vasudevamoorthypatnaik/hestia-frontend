import { View, Text, Pressable } from 'react-native'
import { useRouter, type Href } from 'expo-router'

/** Register stub (HES-SETUP) — navigable placeholder; full flow is follow-up work. */
export function RegisterScreen() {
  const router = useRouter()
  return (
    <View className="flex-1 items-center justify-center bg-surface-light p-8 dark:bg-surface-dark">
      <Text className="mb-2 font-display text-3xl text-ink dark:text-ink-dark">
        Create a household
      </Text>
      <Text className="mb-6 text-center font-sans text-sm text-ink-muted dark:text-ink-muted-dark">
        Registration is coming soon.
      </Text>
      <Pressable
        onPress={() => router.replace('/auth/login' as Href)}
        accessibilityRole="link"
        accessibilityLabel="Back to sign in"
        className="min-h-[44px] justify-center"
      >
        <Text className="font-sans text-sm font-bold text-terracotta">Back to sign in</Text>
      </Pressable>
    </View>
  )
}
