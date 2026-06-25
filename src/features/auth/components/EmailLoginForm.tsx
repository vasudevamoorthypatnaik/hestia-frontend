import { useRef } from 'react'
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  type TextInput as RNTextInput,
} from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { FormField } from '@/shared/components/FormField'
import type { LoginFormValues, LoginFormErrors } from '../types'

interface EmailLoginFormProps {
  values: LoginFormValues
  formErrors: LoginFormErrors
  isLoading: boolean
  globalError: string | null
  onChange: (field: keyof LoginFormValues, value: string) => void
  onSubmit: () => void
}

/**
 * Email + password login form (HES-SETUP). Phase 1 styling. Generic error banner (T2/T8),
 * disabled+spinner Sign-in during submit (T11), Forgot? link. accessibilityLabel on inputs
 * maps to aria-label for Playwright getByLabel (T9/U4).
 */
export function EmailLoginForm({
  values,
  formErrors,
  isLoading,
  globalError,
  onChange,
  onSubmit,
}: EmailLoginFormProps) {
  const router = useRouter()
  const passwordRef = useRef<RNTextInput>(null)

  return (
    <View>
      {globalError ? (
        <View
          className="mb-4 rounded-xl border border-danger-border bg-danger-bg px-3.5 py-3"
          accessibilityRole="alert"
        >
          <Text className="text-sm font-semibold font-sans text-danger">{globalError}</Text>
        </View>
      ) : null}

      <FormField
        label="Email"
        required
        value={values.email}
        onChangeText={(text) => onChange('email', text)}
        error={formErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        testID="login-email-input"
        maxLength={254}
      />

      <FormField
        ref={passwordRef}
        label="Password"
        required
        value={values.password}
        onChangeText={(text) => onChange('password', text)}
        error={formErrors.password}
        secureTextEntry
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
        testID="login-password-input"
        maxLength={72}
      />

      <View className="-mt-2 mb-3 items-end">
        <Pressable
          onPress={() => router.push('/auth/forgot-password' as Href)}
          accessibilityRole="link"
          accessibilityLabel="Forgot password"
          testID="forgot-password-link"
          className="min-h-[44px] justify-center"
        >
          <Text className="text-sm font-semibold font-sans text-terracotta">Forgot?</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel="Sign in"
        accessibilityState={{ disabled: isLoading, busy: isLoading }}
        testID="login-submit"
        className={`min-h-[50px] flex-row items-center justify-center gap-2 rounded-button bg-terracotta px-4 py-3.5 ${
          isLoading ? 'opacity-75' : ''
        }`}
      >
        {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
        <Text className="text-base font-bold font-sans text-white">
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Text>
      </Pressable>
    </View>
  )
}
