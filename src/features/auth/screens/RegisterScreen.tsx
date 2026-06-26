import { View, Text, Pressable, ScrollView } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { HestiaMark } from '@/shared/components/HestiaMark'

/**
 * Register screen (HES-REDESIGN) — Warm Hearth split-panel SHELL. Web/desktop shows the gradient
 * hero (left) + a "create your household" placeholder (right). Functional registration is OUT of
 * scope (A5): the screen renders NO credential inputs and NO submit — preserving today's zero
 * attack-surface stub while adopting the new design. Route: /auth/register.
 */
export function RegisterScreen() {
  const router = useRouter()
  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark md:flex-row">
      {/* Gradient hero — desktop/web only. bg-gradient-* is a web-only NativeWind utility; the
          bg-primary base fill is the cross-platform fallback (this panel is hidden md:flex anyway). */}
      <View className="hidden bg-primary p-12 dark:bg-primary-dark md:flex md:flex-1 md:justify-between bg-gradient-to-br from-primary to-terracotta-deep">
        <View className="flex-row items-center gap-3">
          <HestiaMark variant="onPrimary" size={36} />
          <Text className="font-head text-2xl font-bold text-white">Hestia</Text>
        </View>
        <View>
          <Text className="mb-4 font-head text-4xl font-bold leading-tight text-white">
            Start your household in two minutes.
          </Text>
          <Text className="max-w-[34ch] font-body text-[15px] leading-relaxed text-white/85">
            A layer on top of Google &amp; Apple iCloud — your calendar stays the source of truth.
          </Text>
        </View>
      </View>

      {/* Content panel */}
      <ScrollView className="flex-1" contentContainerClassName="min-h-full items-center justify-center p-6 md:p-12">
        <View className="w-full max-w-[400px]">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="font-head text-3xl font-bold text-on-surface dark:text-on-surface-dark">
              Create your household
            </Text>
            <ThemeToggle />
          </View>
          <Text className="mb-8 font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
            You&apos;ll be the admin — invite your partner right after.
          </Text>

          <View className="rounded-card border border-outline-variant bg-surface-container-low p-6 dark:border-outline-variant-dark dark:bg-surface-container-low-dark">
            <Text className="font-head text-lg font-bold text-on-surface dark:text-on-surface-dark">
              Registration is coming soon
            </Text>
            <Text className="mt-2 font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
              We&apos;re putting the finishing touches on household sign-up. For now, sign in with an
              existing account.
            </Text>
          </View>

          <View className="mt-8 flex-row items-center justify-center gap-1">
            <Text className="font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
              Already have an account?
            </Text>
            <Pressable
              onPress={() => router.replace('/auth/login' as Href)}
              accessibilityRole="link"
              accessibilityLabel="Back to sign in"
              className="min-h-[44px] justify-center"
            >
              <Text className="font-body text-sm font-bold text-primary dark:text-primary-dark">Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
