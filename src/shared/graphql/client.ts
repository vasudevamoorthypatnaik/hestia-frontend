import { createClient, fetchExchange, cacheExchange, errorExchange, mapExchange } from 'urql'
import type { Client } from 'urql'
import type { Href } from 'expo-router'
import { env } from '@/shared/config/env'
import { getAccessTokenSync, clearTokens } from '@/shared/auth/token'
import { createAuthExchange } from './authExchange'
import { safeReplace } from '@/shared/utils/safeNavigate'
import { captureError } from '@/shared/config/sentry'

/** Called when token refresh fails — clears tokens, resets client, redirects to login. */
function handleAuthFailure(): void {
  clearTokens()
    .catch(() => {})
    .finally(() => {
      resetUrqlClient()
      safeReplace('/auth/login' as Href)
    })
}

function makeClient(): Client {
  return createClient({
    url: env.EXPO_PUBLIC_API_URL,
    exchanges: [
      // 1. Error logging (outermost)
      errorExchange({
        onError: (error) => {
          if (error.networkError) {
            const networkErr = error.networkError as { status?: number; statusCode?: number }
            const status = networkErr.status ?? networkErr.statusCode
            if (status === 429) {
              console.warn('[Rate Limited]: 429 — too many requests')
              return
            }
            console.error('[Network Error]:', error.networkError)
            captureError(error.networkError)
          }
          if (error.graphQLErrors) {
            error.graphQLErrors.forEach((err) => {
              console.error('[GraphQL Error]:', err.message, err.extensions)
              if (err.extensions?.['classification'] === 'INTERNAL_ERROR') {
                captureError(new Error(`GraphQL INTERNAL_ERROR: ${err.message}`))
              }
            })
          }
        },
      }),
      // 2. Auth exchange — refresh on UNAUTHORIZED, retry (T3)
      createAuthExchange(handleAuthFailure),
      // 3. Transient network log
      mapExchange({
        onError: (error) => {
          if (error.networkError) {
            console.warn('[URQL]: network error — cache fallback')
          }
        },
      }),
      // 4. Document cache
      cacheExchange,
      // 5. Network fetch (innermost)
      fetchExchange,
    ],
    requestPolicy: env.EXPO_PUBLIC_APP_ENV === 'development' ? 'network-only' : 'cache-first',
    fetchOptions: () => {
      const token = getAccessTokenSync()
      return {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    },
  })
}

let urqlClient = makeClient()

type ResetListener = () => void
const resetListeners: ResetListener[] = []

/** Replace the URQL client with a fresh instance (clears the document cache). */
export function resetUrqlClient(): void {
  urqlClient = makeClient()
  resetListeners.forEach((fn) => fn())
}

/** Subscribe to client resets — the Provider swaps to the new client. */
export function onUrqlClientReset(listener: ResetListener): () => void {
  resetListeners.push(listener)
  return () => {
    const idx = resetListeners.indexOf(listener)
    if (idx >= 0) resetListeners.splice(idx, 1)
  }
}

/** Current URQL client (use in non-React code to avoid stale references after reset). */
export function getUrqlClient(): typeof urqlClient {
  return urqlClient
}

export { urqlClient }
