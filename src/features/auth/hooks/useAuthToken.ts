import { useSyncExternalStore, useState, useEffect } from 'react'
import {
  subscribeToTokenChanges,
  getTokenChangeVersion,
  getAccessTokenSync,
  getAccessToken,
} from '@/shared/auth/token'

interface AuthTokenState {
  token: string | null
  /** False until the async token store has been read once (native cold-start, AG3). */
  hydrated: boolean
}

/**
 * Reactive auth-token state. Re-renders on login/logout via the token pub-sub, and awaits
 * the async store on mount so native cold-start does not falsely redirect a logged-in user
 * before the token hydrates (AG3).
 */
export function useAuthToken(): AuthTokenState {
  // Re-render whenever the token changes (version is the external-store snapshot).
  useSyncExternalStore(subscribeToTokenChanges, getTokenChangeVersion, getTokenChangeVersion)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true
    getAccessToken().finally(() => {
      if (active) setHydrated(true)
    })
    return () => {
      active = false
    }
  }, [])

  return { token: getAccessTokenSync(), hydrated }
}
