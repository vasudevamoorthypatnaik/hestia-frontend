import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Platform } from 'react-native'

interface NetworkStatusValue {
  isOnline: boolean
}

const NetworkStatusContext = createContext<NetworkStatusValue>({ isOnline: true })

/**
 * Online/offline awareness (HES-SETUP, minimal scaffold). On web, tracks navigator.onLine +
 * online/offline events. On native, defaults online (NetInfo integration is a follow-up).
 */
export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return
    const update = () => setIsOnline(window.navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>{children}</NetworkStatusContext.Provider>
  )
}

export function useNetworkStatus(): NetworkStatusValue {
  return useContext(NetworkStatusContext)
}
