import { createContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { AlertModal } from '@/shared/components/AlertModal'

type AlertButton = {
  text: string
  style?: 'default' | 'cancel' | 'destructive'
  onPress?: () => void
}

type ShowAlertFn = (title: string, message?: string, buttons?: AlertButton[]) => void

interface AlertState {
  visible: boolean
  title: string
  message: string | null
  buttons: AlertButton[]
}

// Module-level ref so showAlert() can call the provider without a hook (react-hot-toast pattern).
let alertRef: ShowAlertFn | null = null

export function registerAlertRef(fn: ShowAlertFn | null) {
  alertRef = fn
}

export function getAlertRef(): ShowAlertFn | null {
  return alertRef
}

const AlertContext = createContext<{ show: ShowAlertFn } | undefined>(undefined)

/** Renders the AlertModal for all showAlert() calls. Place inside ThemeProvider (dark mode). */
export function AlertProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlertState>({
    visible: false,
    title: '',
    message: null,
    buttons: [],
  })
  const [showCycle, setShowCycle] = useState(0)

  const pendingSettleRef = useRef<(() => void) | null>(null)
  const watchdogRef = useRef<ReturnType<typeof setTimeout>>()
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      clearTimeout(watchdogRef.current)
    }
  }, [])

  const handleStartDismiss = useCallback((callback?: () => void) => {
    let settled = false
    const settle = () => {
      if (settled || !isMountedRef.current) return
      settled = true
      clearTimeout(watchdogRef.current)
      setState({ visible: false, title: '', message: null, buttons: [] })
      if (!callback) return
      try {
        const result: unknown = callback()
        if (result && typeof (result as Promise<void>).catch === 'function') {
          ;(result as Promise<void>).catch((err: unknown) =>
            console.error('[AlertModal] async callback error:', err)
          )
        }
      } catch (err) {
        console.error('[AlertModal] callback error:', err)
      }
    }
    pendingSettleRef.current = settle
    clearTimeout(watchdogRef.current)
    watchdogRef.current = setTimeout(() => {
      console.warn('[AlertModal] Watchdog fallback fired')
      settle()
    }, 500)
  }, [])

  const handleAnimationComplete = useCallback(() => {
    pendingSettleRef.current?.()
    pendingSettleRef.current = null
  }, [])

  const show = useCallback<ShowAlertFn>((title, message, buttons) => {
    clearTimeout(watchdogRef.current)
    pendingSettleRef.current = null
    setShowCycle((c) => c + 1)
    setState({
      visible: true,
      title,
      message: message ?? null,
      buttons: buttons ?? [{ text: 'OK' }],
    })
  }, [])

  useEffect(() => {
    registerAlertRef(show)
    return () => registerAlertRef(null)
  }, [show])

  return (
    <AlertContext.Provider value={{ show }}>
      {children}
      <AlertModal
        visible={state.visible}
        showCycle={showCycle}
        title={state.title}
        message={state.message}
        buttons={state.buttons}
        onStartDismiss={handleStartDismiss}
        onAnimationComplete={handleAnimationComplete}
      />
    </AlertContext.Provider>
  )
}
