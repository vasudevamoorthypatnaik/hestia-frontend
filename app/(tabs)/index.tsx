import { View, Text, Pressable, ScrollView } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { clearTokens } from '@/shared/auth/token'
import { resetUrqlClient } from '@/shared/graphql/client'
import { ThemeToggle } from '@/shared/components/ThemeToggle'

/** Stub card for the household home. */
function HomeCard({ title, body }: { title: string; body: string }) {
  return (
    <View className="min-w-[220px] flex-1 rounded-card bg-cream p-5 dark:bg-cream-dark">
      <Text className="mb-1.5 font-display text-lg text-ink dark:text-ink-dark">{title}</Text>
      <Text className="font-sans text-[13px] text-ink-muted dark:text-ink-muted-dark">{body}</Text>
    </View>
  )
}

/**
 * Household home stub (HES-SETUP) — auth-gated landing login redirects to on success ('/').
 * Real content is future work. Sign out clears tokens (T5) and returns to /auth/login.
 */
export default function HomeStub() {
  const router = useRouter()

  const handleSignOut = async () => {
    await clearTokens()
    resetUrqlClient()
    router.replace('/auth/login' as Href)
  }

  return (
    <ScrollView className="flex-1 bg-surface-light dark:bg-surface-dark">
      <View className="flex-row items-center justify-between border-b border-field-border px-7 py-4 dark:border-field-border-dark">
        <View className="flex-row items-center gap-3">
          <View className="h-8 w-8 items-center justify-center rounded-pill bg-terracotta">
            <View className="h-3 w-3 rotate-45 rounded-[2px] bg-white" />
          </View>
          <Text className="font-display text-2xl text-ink dark:text-ink-dark">Hestia</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <ThemeToggle />
          <Pressable
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            testID="sign-out"
            className="min-h-[44px] justify-center rounded-button border border-field-border px-4 dark:border-field-border-dark"
          >
            <Text className="font-sans text-sm font-semibold text-terracotta">Sign out</Text>
          </Pressable>
        </View>
      </View>

      <View className="p-8 md:p-10">
        <Text className="mb-2 font-display text-3xl text-ink dark:text-ink-dark">
          Welcome back.
        </Text>
        <Text className="mb-8 font-sans text-[15px] text-ink-muted dark:text-ink-muted-dark">
          You&apos;re signed in to your household.
        </Text>
        <View className="flex-row flex-wrap gap-4">
          <HomeCard title="Your calendar" body="Connected calendar stays the source of truth. Coming soon." />
          <HomeCard title="Household" body="Members & shared tasks. Coming soon." />
          <HomeCard title="Events" body="Upcoming events & RSVPs. Coming soon." />
        </View>
      </View>
    </ScrollView>
  )
}
