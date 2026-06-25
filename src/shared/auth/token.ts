import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const ACCESS_TOKEN_KEY = 'auth_access_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

const isWeb = Platform.OS === 'web'

// Interim token storage (HES-SETUP). Web uses localStorage so tokens survive refresh
// (T5); native uses Expo SecureStore (Keychain/Keystore). HTTP-only cookies are a
// production-hardening follow-up — tokens currently travel in the GraphQL payload.

// Synchronous cache for the access token (URQL fetchOptions must read it sync).
let _cachedAccessToken: string | null =
  isWeb && typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null

// Token-change pub-sub so useSyncExternalStore consumers (UserProfileProvider) re-render
// when the token flips anon -> authed -> anon. Load-bearing for T15 (me query pause).
let _tokenVersion = 0
const _tokenChangeListeners = new Set<() => void>()

function emitTokenChange(): void {
  _tokenVersion++
  for (const listener of _tokenChangeListeners) {
    try {
      listener()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[token] token-change listener threw:', err)
    }
  }
}

export function subscribeToTokenChanges(listener: () => void): () => void {
  _tokenChangeListeners.add(listener)
  return () => {
    _tokenChangeListeners.delete(listener)
  }
}

export function getTokenChangeVersion(): number {
  return _tokenVersion
}

export async function setAccessToken(token: string): Promise<void> {
  const previous = _cachedAccessToken
  _cachedAccessToken = token
  if (isWeb) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } else {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token)
  }
  if (previous !== token) emitTokenChange()
}

export async function getAccessToken(): Promise<string | null> {
  if (isWeb) {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    _cachedAccessToken = token
    return token
  }
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
  _cachedAccessToken = token
  return token
}

export async function setRefreshToken(token: string): Promise<void> {
  if (isWeb) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
    return
  }
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token)
}

export async function getRefreshToken(): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
}

/** Synchronous access-token getter for URQL fetchOptions. May be stale on native cold
 *  start until the first async getAccessToken() resolves (mitigated by route hydration). */
export function getAccessTokenSync(): string | null {
  return _cachedAccessToken
}

/** Persist both tokens together (login). */
export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await setAccessToken(accessToken)
  await setRefreshToken(refreshToken)
}

/** Clear all stored auth tokens (logout) — T5. */
export async function clearTokens(): Promise<void> {
  const previous = _cachedAccessToken
  _cachedAccessToken = null
  if (isWeb) {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } else {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
  }
  if (previous !== null) emitTokenChange()
}
