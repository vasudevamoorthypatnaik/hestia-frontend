import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'
import { useMeQuery, type MeQuery } from '@/__generated__/graphql'
import {
  subscribeToTokenChanges,
  getTokenChangeVersion,
  getAccessTokenSync,
} from '@/shared/auth/token'

type Me = MeQuery['me']

interface UserProfileValue {
  me: Me
  isLoading: boolean
}

const UserProfileContext = createContext<UserProfileValue | undefined>(undefined)

/**
 * Provides the authenticated viewer's identity (HES-SETUP). Mounted at the root so any consumer
 * can read the viewer. The `me` query is PAUSED while no access token exists, so the anonymous
 * login screen issues ZERO authenticated queries (T15). useSyncExternalStore subscribes to the
 * token pub-sub so the query un-pauses the instant a login stores a token.
 */
export function UserProfileProvider({ children }: { children: ReactNode }) {
  // Re-render on any token change (login/logout) so `pause` re-evaluates.
  useSyncExternalStore(subscribeToTokenChanges, getTokenChangeVersion, getTokenChangeVersion)
  const hasToken = !!getAccessTokenSync()

  const [{ data, fetching }] = useMeQuery({ pause: !hasToken })

  const value: UserProfileValue = {
    me: hasToken ? (data?.me ?? null) : null,
    isLoading: hasToken && fetching,
  }

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>
}

export function useUserProfile(): UserProfileValue {
  const context = useContext(UserProfileContext)
  if (!context) throw new Error('useUserProfile must be used within UserProfileProvider')
  return context
}
