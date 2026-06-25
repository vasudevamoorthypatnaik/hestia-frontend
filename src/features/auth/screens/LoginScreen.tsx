import { View, Text, Pressable, ScrollView } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { useLogin } from '../hooks/useLogin'
import { EmailLoginForm } from '../components/EmailLoginForm'
import { ThemeToggle } from '@/shared/components/ThemeToggle'

/** Inert social button (U7/T14) — rendered per design but non-interactive this iteration. */
function SocialButton({ label }: { label: string }) {
  return (
    <View
      accessibilityRole="button"
      accessibilityState={{ disabled: true }}
      className="relative min-h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-button border border-field-border bg-white px-3 py-3 opacity-70 dark:border-field-border-dark dark:bg-field-dark"
    >
      <Text className="text-sm font-semibold font-sans text-ink-muted dark:text-ink-muted-dark">
        {label}
      </Text>
      <Text className="absolute -top-2 right-2 rounded-pill bg-ink-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
        soon
      </Text>
    </View>
  )
}

/**
 * Login screen (HES-SETUP) — split-panel per Phase 1 signin design. Terracotta brand panel
 * (desktop) + email/password form; stacks on mobile. Inert Google/Apple (U7/T14), Forgot? +
 * register links, theme toggle. Route: /auth/login (T10).
 */
export function LoginScreen() {
  const router = useRouter()
  const { values, formErrors, isLoading, globalError, onChange, onSubmit } = useLogin()

  return (
    <ScrollView
      className="flex-1 bg-surface-light dark:bg-surface-dark"
      contentContainerClassName="min-h-full items-center justify-center p-4 md:p-14"
    >
      <View className="w-full max-w-[960px] overflow-hidden rounded-card bg-white shadow-elevated dark:bg-cream-dark md:flex-row">
        {/* Brand panel */}
        <View className="bg-terracotta p-8 md:flex-1 md:justify-center md:p-12">
          <View className="mb-6 flex-row items-center gap-3 md:mb-10">
            <View className="h-8 w-8 items-center justify-center rounded-pill bg-white/20">
              <View className="h-3 w-3 rotate-45 rounded-[2px] bg-white" />
            </View>
            <Text className="font-display text-2xl text-white">Hestia</Text>
          </View>
          <Text className="mb-4 font-display text-3xl leading-tight text-white md:text-4xl">
            Welcome back to your household.
          </Text>
          <Text className="max-w-[30ch] font-sans text-[15px] leading-relaxed text-white/85">
            A layer on top of Google & Apple iCloud — your calendar stays the source of truth.
          </Text>
        </View>

        {/* Form panel */}
        <View className="p-8 md:flex-1 md:p-12">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="font-display text-3xl text-ink dark:text-ink-dark">Sign in</Text>
            <ThemeToggle />
          </View>
          <Text className="mb-6 font-sans text-sm text-ink-muted dark:text-ink-muted-dark">
            Use your email, or continue with Google or Apple.
          </Text>

          <EmailLoginForm
            values={values}
            formErrors={formErrors}
            isLoading={isLoading}
            globalError={globalError}
            onChange={onChange}
            onSubmit={onSubmit}
          />

          {/* Divider */}
          <View className="my-5 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-field-border dark:bg-field-border-dark" />
            <Text className="text-xs font-sans text-ink-muted dark:text-ink-muted-dark">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-field-border dark:bg-field-border-dark" />
          </View>

          <View className="flex-row gap-3">
            <SocialButton label="Google" />
            <SocialButton label="Apple" />
          </View>

          <View className="mt-6 flex-row items-center justify-center gap-1">
            <Text className="font-sans text-sm text-ink-muted dark:text-ink-muted-dark">
              New to Hestia?
            </Text>
            <Pressable
              onPress={() => router.push('/auth/register' as Href)}
              accessibilityRole="link"
              accessibilityLabel="Create a household"
              testID="register-link"
              className="min-h-[44px] justify-center"
            >
              <Text className="font-sans text-sm font-bold text-terracotta">Create a household</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
