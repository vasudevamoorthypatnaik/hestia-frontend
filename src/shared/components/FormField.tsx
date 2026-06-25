import { forwardRef } from 'react'
import { View, Text, TextInput as RNTextInput, type TextInputProps } from 'react-native'

interface FormFieldProps extends TextInputProps {
  label: string
  error?: string | undefined
  required?: boolean
  hint?: string
}

/**
 * Labeled text input — Phase 1 styling (HES-SETUP). accessibilityLabel maps to aria-label
 * so Playwright E2E uses getByLabel (T9, U4). 48px min height for WCAG touch target.
 */
export const FormField = forwardRef<RNTextInput, FormFieldProps>(function FormField(
  { label, error, required, hint, ...inputProps },
  ref
) {
  return (
    <View className="mb-5">
      <Text className="text-xs font-semibold font-sans uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark mb-1.5">
        {label}
        {required && <Text className="text-terracotta"> *</Text>}
      </Text>

      <RNTextInput
        ref={ref}
        className={`border rounded-input px-4 py-3.5 text-base font-sans text-ink dark:text-ink-dark bg-field dark:bg-field-dark min-h-[48px] ${
          error ? 'border-danger' : 'border-field-border dark:border-field-border-dark'
        }`}
        placeholderTextColor="#A89A88"
        accessibilityLabel={label}
        accessibilityHint={hint}
        {...inputProps}
      />

      {hint && !error && (
        <Text className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1">{hint}</Text>
      )}

      {error && (
        <Text className="text-xs text-danger mt-1" accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  )
})
