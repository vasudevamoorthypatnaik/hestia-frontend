import { forwardRef, useState, type ReactNode } from 'react'
import { View, Text, Pressable, TextInput as RNTextInput, type TextInputProps } from 'react-native'
import { useColorScheme } from 'nativewind'
import { MaterialIcons } from '@expo/vector-icons'

// Outline tone per theme — keeps placeholder + secure-toggle icon legible in dark mode.
const OUTLINE_LIGHT = '#89726b'
const OUTLINE_DARK = '#a08d86'

interface FormFieldProps extends TextInputProps {
  label: string
  error?: string | undefined
  required?: boolean
  hint?: string
  /** Optional leading icon rendered inside the field (left). Warm Hearth auth fields use mail/lock. */
  leadingIcon?: ReactNode
  /** When true (with secureTextEntry), shows a show/hide eye toggle on the right. */
  secureToggle?: boolean
  /** testID for the show/hide toggle (e.g. "login-password-toggle"). */
  secureToggleTestID?: string
}

/**
 * Labeled text input — Warm Hearth styling (HES-REDESIGN). accessibilityLabel maps to aria-label
 * so Playwright E2E uses getByLabel (T2, U5). 48px min height for WCAG touch target.
 * Optional leadingIcon + secureToggle (password show/hide) support the new auth field design.
 */
export const FormField = forwardRef<RNTextInput, FormFieldProps>(function FormField(
  { label, error, required, hint, leadingIcon, secureToggle, secureToggleTestID, ...inputProps },
  ref
) {
  const [visible, setVisible] = useState(false)
  const { colorScheme } = useColorScheme()
  const outlineColor = colorScheme === 'dark' ? OUTLINE_DARK : OUTLINE_LIGHT
  // When secureToggle is on, the toggle owns the secure state; otherwise honor the caller's prop.
  const effectiveSecure = secureToggle ? !visible : inputProps.secureTextEntry

  return (
    <View className="mb-5">
      <Text className="text-xs font-semibold font-body uppercase tracking-wider text-on-surface-variant dark:text-on-surface-variant-dark mb-1.5">
        {label}
        {required && <Text className="text-primary dark:text-primary-dark"> *</Text>}
      </Text>

      <View className="relative justify-center">
        {leadingIcon ? (
          <View className="absolute left-4 z-10" pointerEvents="none">
            {leadingIcon}
          </View>
        ) : null}

        <RNTextInput
          ref={ref}
          className={`border rounded-input py-3.5 text-base font-body text-on-surface dark:text-on-surface-dark bg-surface-container-low dark:bg-surface-container-low-dark min-h-[48px] ${
            leadingIcon ? 'pl-12' : 'px-4'
          } ${secureToggle ? 'pr-12' : leadingIcon ? 'pr-4' : ''} ${
            error
              ? 'border-error dark:border-error-dark'
              : 'border-outline-variant dark:border-outline-variant-dark'
          }`}
          placeholderTextColor={outlineColor}
          accessibilityLabel={label}
          accessibilityHint={hint}
          {...inputProps}
          secureTextEntry={effectiveSecure}
        />

        {secureToggle ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            testID={secureToggleTestID}
            className="absolute right-2 h-11 w-11 items-center justify-center"
            hitSlop={8}
          >
            <MaterialIcons
              name={visible ? 'visibility-off' : 'visibility'}
              size={20}
              color={outlineColor}
            />
          </Pressable>
        ) : null}
      </View>

      {hint && !error && (
        <Text className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark mt-1">
          {hint}
        </Text>
      )}

      {error && (
        <Text className="text-xs text-error dark:text-error-dark mt-1" accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  )
})
