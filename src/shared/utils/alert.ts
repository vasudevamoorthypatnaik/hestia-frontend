import { Alert, Platform } from 'react-native'
import { getAlertRef } from '@/shared/contexts/AlertContext'

type AlertButton = {
  text: string
  style?: 'default' | 'cancel' | 'destructive'
  onPress?: () => void
}

/**
 * Cross-platform alert (HES-SETUP, T8). Renders the in-app AlertModal on ALL platforms when
 * AlertProvider is mounted. Falls back to native Alert.alert (iOS/Android) or window dialogs
 * (web) only if the provider isn't mounted yet. NEVER use Alert.alert directly — it's a no-op
 * on web.
 */
export function showAlert(title: string, message?: string, buttons?: AlertButton[]) {
  const showModal = getAlertRef()
  if (showModal) {
    showModal(title, message, buttons)
    return
  }
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons)
    return
  }
  const fullMessage = message ? `${title}\n\n${message}` : title
  if (!buttons || buttons.length <= 1) {
    window.alert(fullMessage)
    buttons?.[0]?.onPress?.()
    return
  }
  const cancelButton = buttons.find((b) => b.style === 'cancel')
  const actionButton = buttons.find((b) => b.style !== 'cancel') ?? buttons[buttons.length - 1]
  if (window.confirm(fullMessage)) actionButton?.onPress?.()
  else cancelButton?.onPress?.()
}
