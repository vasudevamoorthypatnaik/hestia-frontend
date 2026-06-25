import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  cancelAnimation,
  useReducedMotion,
} from 'react-native-reanimated'

const FADE_DURATION = 250

interface UseAlertAnimationReturn {
  /** Controls Modal visible prop — stays true during fade-out, false after completion */
  modalMounted: boolean
  backdropAnimatedStyle: ReturnType<typeof useAnimatedStyle>
  contentAnimatedStyle: ReturnType<typeof useAnimatedStyle>
  startFadeOut: (onComplete: () => void) => void
}

/**
 * Manages AlertModal animation lifecycle using Reanimated.
 *
 * Replaces the native `<Modal animationType="fade">` with JS-controlled animation
 * so the completion callback is deterministic (via withTiming + runOnJS) instead of
 * relying on the unreliable Modal.onDismiss on iOS native.
 *
 * Two-state pattern: external `visible` (intent) vs internal `modalMounted` (controls Modal).
 * Modal stays mounted during fade-out so the animation is visible, then unmounts after.
 *
 * Fade-in is driven by a useEffect (not Modal.onShow) so it works reliably for both
 * initial mount and alert chaining (true→true transitions where Modal never unmounts).
 *
 * @param visible - Whether the alert should be shown
 * @param showCycle - Monotonically increasing counter from AlertContext, incremented on
 *   every show() call. Invalidates any in-flight fade-out completion even when visible
 *   stays true (e.g., new alert shown while previous dismiss is in-flight).
 */
export function useAlertAnimation(visible: boolean, showCycle: number): UseAlertAnimationReturn {
  const [modalMounted, setModalMounted] = useState(false)
  const opacity = useSharedValue(0)
  const reduceMotion = useReducedMotion()
  const isMountedRef = useRef(true)
  // Close-cycle generation token: prevents stale fade-out completions from
  // unmounting a newer alert that was shown during an in-flight fade-out.
  const closeCycleRef = useRef(0)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      cancelAnimation(opacity)
    }
  }, [opacity])

  // Mount the Modal and reset opacity when a new alert is shown.
  // Depends on showCycle (not just visible) so it fires even on true→true transitions
  // (e.g., show() called while a dismiss is in-flight).
  useEffect(() => {
    if (visible) {
      closeCycleRef.current++ // invalidate any stale fade-out completion
      cancelAnimation(opacity) // cancel any in-flight fade-out
      opacity.value = 0
      setModalMounted(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- showCycle drives re-mount on true→true
  }, [visible, showCycle, opacity])

  // Trigger fade-in when the modal is mounted and a new alert is shown.
  // For initial mount: modalMounted changes false→true after setModalMounted(true), effect fires.
  // For chaining: showCycle changes while modalMounted is already true, effect fires directly.
  // This replaces the previous Modal.onShow dependency, which doesn't re-fire when
  // the Modal never unmounts (true→true chaining scenario).
  useEffect(() => {
    if (modalMounted && visible) {
      const duration = reduceMotion ? 0 : FADE_DURATION
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.out(Easing.ease),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- showCycle triggers re-animation on chaining
  }, [modalMounted, visible, showCycle, opacity, reduceMotion])

  const startFadeOut = useCallback(
    (onComplete: () => void) => {
      const duration = reduceMotion ? 0 : FADE_DURATION
      const cycleId = closeCycleRef.current

      const handleComplete = () => {
        // Ignore if a newer alert was shown (close cycle changed)
        if (cycleId !== closeCycleRef.current) return
        if (isMountedRef.current) {
          setModalMounted(false)
        }
        onComplete()
      }

      if (duration === 0) {
        // Reduce Motion: skip animation, fire immediately
        opacity.value = 0
        handleComplete()
        return
      }

      opacity.value = withTiming(0, { duration, easing: Easing.in(Easing.ease) }, () => {
        'worklet'
        // Complete dismiss whether animation finished naturally or was interrupted.
        // An interrupted dismiss (e.g., show() called mid-fade) should settle
        // immediately rather than waiting 500ms for the watchdog.
        runOnJS(handleComplete)()
      })
    },
    [opacity, reduceMotion]
  )

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }))

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: 0.95 + 0.05 * opacity.value }],
  }))

  return {
    modalMounted,
    backdropAnimatedStyle,
    contentAnimatedStyle,
    startFadeOut,
  }
}
