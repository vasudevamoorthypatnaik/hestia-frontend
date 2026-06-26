import { View, Text, Pressable, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { useRouter, type Href } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { useLogin } from '../hooks/useLogin'
import { EmailLoginForm } from '../components/EmailLoginForm'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
// Hero photo (web split-panel). Bundled asset; the terracotta gradient/fill shows through if the
// image is absent so login never breaks (T9).
import HERO from '../../../../assets/images/login-hero.jpg'

/** Inert social button (T7) — rendered per Warm Hearth design but non-interactive this iteration. */
function SocialButton({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <View
      accessibilityRole="button"
      accessibilityState={{ disabled: true }}
      className={`relative min-h-[48px] w-full flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 opacity-90 ${
        dark
          ? 'bg-inverse-surface dark:bg-inverse-surface-dark'
          : 'border border-outline-variant bg-surface-container-lowest dark:border-outline-variant-dark dark:bg-surface-container-low-dark'
      }`}
    >
      <Text
        className={`text-sm font-semibold font-body ${
          dark ? 'text-inverse-on-surface dark:text-inverse-on-surface-dark' : 'text-on-surface dark:text-on-surface-dark'
        }`}
      >
        {label}
      </Text>
      <Text className="absolute -top-2 right-3 rounded-pill bg-surface-container-high px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant dark:bg-surface-container-high-dark dark:text-on-surface-variant-dark">
        soon
      </Text>
    </View>
  )
}

/** Hestia diamond mark. */
function HestiaMark({ size = 32, onPrimary = false }: { size?: number; onPrimary?: boolean }) {
  return (
    <View
      className={`items-center justify-center rounded-pill ${onPrimary ? 'bg-white/20' : 'bg-primary dark:bg-primary-dark'}`}
      style={{ width: size, height: size }}
    >
      <View
        className={onPrimary ? 'rotate-45 rounded-[3px] bg-white' : 'rotate-45 rounded-[2px] bg-surface dark:bg-surface-dark'}
        style={{ width: size * 0.4, height: size * 0.4 }}
      />
    </View>
  )
}

/**
 * Login screen (HES-REDESIGN) — Warm Hearth split-panel. Web/desktop: hero photo + terracotta
 * gradient + brand copy (left), form (right). Mobile: centered card with mark + form. Inert
 * Google/Apple (T7), Forgot? + register links, theme toggle. Route: /auth/login.
 */
export function LoginScreen() {
  const router = useRouter()
  const { values, formErrors, isLoading, globalError, onChange, onSubmit } = useLogin()

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark md:flex-row">
      {/* Hero panel — desktop/web only (terracotta fill is the fallback if the photo is absent). */}
      <View className="hidden bg-primary dark:bg-primary-dark md:flex md:flex-1">
        <Image
          source={HERO}
          accessibilityLabel="A warm family kitchen hearth"
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          contentFit="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-b from-terracotta-deep/40 to-terracotta-deep/90" />
        <View className="relative flex-1 justify-between p-12">
          <View className="flex-row items-center gap-3">
            <HestiaMark size={36} onPrimary />
            <Text className="font-head text-2xl font-bold text-white">Hestia</Text>
          </View>
          <View>
            <Text className="mb-3 font-head text-4xl font-bold leading-tight text-white">
              Keep the hearth glowing, even when you&apos;re apart.
            </Text>
            <Text className="mb-6 max-w-[34ch] font-body text-[15px] leading-relaxed text-white/85">
              A layer on top of Google &amp; Apple iCloud — your calendar stays the source of truth.
            </Text>
            <View className="gap-3">
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="auto-awesome" size={18} color="#ffffff" />
                <Text className="font-body text-sm font-semibold text-white">Trusted capture from any email</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="balance" size={18} color="#ffffff" />
                <Text className="font-body text-sm font-semibold text-white">See who carries the load</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Form panel */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="min-h-full items-center justify-center p-6 md:p-12"
      >
        <View className="w-full max-w-[400px]">
          {/* Mobile-only brand header */}
          <View className="mb-8 items-center md:hidden">
            <HestiaMark size={56} />
            <Text className="mt-3 font-head text-2xl font-bold text-primary dark:text-primary-dark">Hestia</Text>
          </View>

          <View className="mb-1 flex-row items-center justify-between">
            <Text className="font-head text-3xl font-bold text-on-surface dark:text-on-surface-dark">Welcome Home</Text>
            <ThemeToggle />
          </View>
          <Text className="mb-6 font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
            Sign in to manage your family&apos;s daily rhythm.
          </Text>

          {/* Social cluster */}
          <View className="mb-6 gap-3">
            <SocialButton label="Google" />
            <SocialButton label="Apple" dark />
          </View>

          {/* Divider */}
          <View className="mb-6 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-outline-variant dark:bg-outline-variant-dark" />
            <Text className="font-body text-xs uppercase tracking-wider text-outline dark:text-outline-dark">
              or email
            </Text>
            <View className="h-px flex-1 bg-outline-variant dark:bg-outline-variant-dark" />
          </View>

          <EmailLoginForm
            values={values}
            formErrors={formErrors}
            isLoading={isLoading}
            globalError={globalError}
            onChange={onChange}
            onSubmit={onSubmit}
          />

          <View className="mt-8 flex-row items-center justify-center gap-1">
            <Text className="font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
              New to Hestia?
            </Text>
            <Pressable
              onPress={() => router.push('/auth/register' as Href)}
              accessibilityRole="link"
              accessibilityLabel="Create a household"
              testID="register-link"
              className="min-h-[44px] justify-center"
            >
              <Text className="font-body text-sm font-bold text-primary dark:text-primary-dark">
                Create your household
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
