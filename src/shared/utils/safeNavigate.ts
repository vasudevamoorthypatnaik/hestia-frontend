import { router } from 'expo-router'
import type { Href } from 'expo-router'
import { InteractionManager } from 'react-native'

/**
 * Replace current route with deferred execution to avoid cross-navigator flash
 * (Stack → Tabs). Dismisses stacked screens, then defers router.replace via
 * InteractionManager so the dismissal completes first. Returns a cancel handle.
 */
export function safeReplace(href: Href): { cancel: () => void } {
  if (router.canDismiss()) {
    router.dismissAll()
  }
  let cancelled = false
  const handle = InteractionManager.runAfterInteractions(() => {
    if (!cancelled) {
      router.replace(href)
    }
  })
  return {
    cancel: () => {
      cancelled = true
      handle.cancel()
    },
  }
}

/** Navigate back if possible, otherwise safe-replace to fallback (deep-link case). */
export function safeBack(
  navigation: { canGoBack: () => boolean; goBack: () => void },
  fallbackHref: Href
): void {
  if (navigation.canGoBack()) {
    navigation.goBack()
  } else {
    safeReplace(fallbackHref)
  }
}
