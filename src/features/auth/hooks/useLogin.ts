import { useState, useRef } from 'react'
import type { Href } from 'expo-router'
import { safeReplace } from '@/shared/utils/safeNavigate'
import { useLoginMutation } from '@/__generated__/graphql'
import { setTokens } from '@/shared/auth/token'
import { validateLoginForm, type LoginFormValues, type LoginFormErrors } from '../types'

const INITIAL_FORM: LoginFormValues = { email: '', password: '' }

// Post-login landing = household home stub at '/' (auth-gated). See app/(tabs)/index.tsx.
const POST_LOGIN_DESTINATION = '/' as Href

// Generic, enumeration-safe message for any credential failure (T2). The backend owns the
// precise wire error; the frontend renders one generic string for all auth failures so it
// never reveals whether the email exists.
const GENERIC_AUTH_ERROR = 'Invalid email or password. Please try again.'
const NETWORK_ERROR = 'Something went wrong. Please check your connection and try again.'

export interface UseLoginReturn {
  values: LoginFormValues
  formErrors: LoginFormErrors
  isLoading: boolean
  globalError: string | null
  onChange: (field: keyof LoginFormValues, value: string) => void
  /** Returns true if the mutation was sent, false if blocked by validation or double-submit guard. */
  onSubmit: () => Promise<boolean>
}

/**
 * Email/password login (HES-SETUP). Validates, calls the backend login mutation, persists
 * tokens (T5), redirects to the household home stub. Errors render as a generic, inline
 * banner (T2 enumeration-safe, T8 no Alert.alert). Double-submit guarded via a sync ref (T11).
 * Social sign-in is inert this iteration (U7/T14) — not wired here.
 */
export function useLogin(): UseLoginReturn {
  const [values, setValues] = useState<LoginFormValues>(INITIAL_FORM)
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [, loginMutation] = useLoginMutation()

  // Synchronous mutex — React state is async, so two rapid clicks could both read
  // isLoading=false. A ref updates synchronously, guaranteeing a single request (T11).
  const submittingRef = useRef(false)

  const onChange = (field: keyof LoginFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    setGlobalError(null)
  }

  const onSubmit = async (): Promise<boolean> => {
    if (submittingRef.current) {
      console.warn('[Login] Double-submit blocked')
      return false
    }
    submittingRef.current = true
    try {
      const errors = validateLoginForm(values)
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return false
      }
      setFormErrors({})
      setGlobalError(null)
      setIsLoading(true)

      try {
        const result = await loginMutation({
          input: { email: values.email, password: values.password },
        })
        setIsLoading(false)

        if (result.error) {
          // Transport failure (server down, network, CORS) → connectivity message.
          if (result.error.networkError) {
            setGlobalError(NETWORK_ERROR)
            return true
          }
          // Rate-limit lockout is FORBIDDEN with a safe backend userMessage — surface it so the
          // user isn't told "wrong password" and made to keep retrying during lockout. Credential
          // failures (UNAUTHORIZED) stay generic + enumeration-safe (T2). (PR review MED.)
          const rateLimited = result.error.graphQLErrors?.find(
            (e) => e.extensions?.['classification'] === 'FORBIDDEN'
          )
          if (rateLimited) {
            setGlobalError(
              (rateLimited.extensions?.['userMessage'] as string | undefined) ??
                'Too many login attempts. Please try again later.'
            )
            return true
          }
          setGlobalError(GENERIC_AUTH_ERROR)
          return true
        }

        const loginData = result.data?.login
        if (!loginData) {
          // No error but no payload — a malformed/empty response. Don't navigate to the
          // authed home with no tokens (would flicker back to login); surface the error.
          setGlobalError(GENERIC_AUTH_ERROR)
          return true
        }

        await setTokens(loginData.accessToken, loginData.refreshToken)
        safeReplace(POST_LOGIN_DESTINATION)
        return true
      } catch (error) {
        setIsLoading(false)
        setGlobalError(NETWORK_ERROR)
        console.error('[Login] Unexpected error:', error)
        return true
      }
    } finally {
      submittingRef.current = false
    }
  }

  return { values, formErrors, isLoading, globalError, onChange, onSubmit }
}
