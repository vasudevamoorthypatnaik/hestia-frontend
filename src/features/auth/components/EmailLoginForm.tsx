import { useRef } from 'react'
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  type TextInput as RNTextInput,
} from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
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
 * Email + password login form (HES-REDESIGN, Warm Hearth). Leading mail/lock icons, password
 * show/hide toggle, "Enter the Hearth" CTA. Generic error banner (enumeration-safe, rendered as
 * plain text). accessibilityLabel/testIDs preserved for Playwright getByLabel/testID (T2, U5).
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
          className="mb-4 rounded-xl border border-error-container bg-error-container px-3.5 py-3 dark:border-error-container-dark dark:bg-error-container-dark"
          accessibilityRole="alert"
        >
          <Text className="text-sm font-semibold font-body text-on-error-container dark:text-on-error-container-dark">
            {globalError}
          </Text>
        </View>
      ) : null}

      <FormField
        label="Email"
        required
        leadingIcon={<MaterialIcons name="mail-outline" size={20} color="#89726b" />}
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
        leadingIcon={<MaterialIcons name="lock-outline" size={20} color="#89726b" />}
        secureToggle
        secureToggleTestID="login-password-toggle"
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
          <Text className="text-sm font-semibold font-body text-primary dark:text-primary-dark">Forgot?</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel="Enter the Hearth"
        accessibilityState={{ disabled: isLoading, busy: isLoading }}
        testID="login-submit"
        className={`min-h-[52px] flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 shadow-glow dark:bg-primary-dark ${
          isLoading ? 'opacity-75' : ''
        }`}
      >
        {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
        <Text className="text-base font-bold font-body text-on-primary dark:text-on-primary-dark">
          {isLoading ? 'Signing in…' : 'Enter the Hearth'}
        </Text>
        {!isLoading ? <MaterialIcons name="arrow-forward" size={18} color="#ffffff" /> : null}
      </Pressable>
    </View>
  )
}
