import { useEffect, useRef } from 'react'
import { Modal, View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native'
import Animated, { type AnimatedStyle } from 'react-native-reanimated'
import { useAlertAnimation } from '@/shared/hooks/useAlertAnimation'

type AlertButton = {
  text: string
  style?: 'default' | 'cancel' | 'destructive'
  onPress?: () => void
}

interface AlertModalProps {
  visible: boolean
  showCycle: number
  title: string
  message: string | null
  buttons: AlertButton[]
  onStartDismiss: (callback?: () => void) => void
  onAnimationComplete: () => void
}

/**
 * Custom styled alert modal (HES-SETUP, Phase 1 tokens) — cross-platform replacement for
 * window.confirm/Alert.alert (T8). Reanimated-controlled fade for deterministic callbacks.
 */
export function AlertModal({
  visible,
  showCycle,
  title,
  message,
  buttons,
  onStartDismiss,
  onAnimationComplete,
}: AlertModalProps) {
  const { modalMounted, backdropAnimatedStyle, contentAnimatedStyle, startFadeOut } =
    useAlertAnimation(visible, showCycle)

  const isDismissingRef = useRef(false)

  useEffect(() => {
    if (visible) {
      isDismissingRef.current = false
    }
  }, [visible, showCycle])

  const handleButtonPress = (button: AlertButton) => {
    if (isDismissingRef.current) return
    isDismissingRef.current = true
    onStartDismiss(button.onPress)
    startFadeOut(onAnimationComplete)
  }

  const handleBackdropPress = () => {
    if (isDismissingRef.current) return
    isDismissingRef.current = true
    const cancelButton = buttons.find((b) => b.style === 'cancel')
    onStartDismiss(cancelButton?.onPress)
    startFadeOut(onAnimationComplete)
  }

  const isSingleButton = buttons.length <= 1

  return (
    <Modal
      visible={modalMounted}
      transparent
      animationType="none"
      onRequestClose={handleBackdropPress}
    >
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle as AnimatedStyle<ViewStyle>]}>
        <Pressable
          style={styles.backdropPressable}
          onPress={handleBackdropPress}
          accessibilityRole="none"
        />
      </Animated.View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.contentContainer, contentAnimatedStyle as AnimatedStyle<ViewStyle>]}
      >
        <Pressable
          className="mx-8 w-full max-w-sm rounded-card bg-white p-6 shadow-elevated dark:bg-cream-dark"
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="alert"
          accessibilityLabel={title}
        >
          <Text className="font-display text-lg text-ink dark:text-ink-dark">{title}</Text>
          {message ? (
            <Text className="mt-2 font-sans text-base text-ink-muted dark:text-ink-muted-dark">
              {message}
            </Text>
          ) : null}

          <View className={`mt-6 ${isSingleButton ? '' : 'flex-row justify-end gap-3'}`}>
            {buttons.map((button, index) => (
              <Pressable
                key={index}
                onPress={() => handleButtonPress(button)}
                accessibilityRole="button"
                accessibilityLabel={button.text}
                className={getButtonClassName(button.style, isSingleButton)}
              >
                <Text className={getButtonTextClassName(button.style)}>{button.text}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#2B2521' },
  backdropPressable: { flex: 1 },
  contentContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})

function getButtonClassName(style: AlertButton['style'], isSingleButton: boolean): string {
  const base = 'min-h-[44px] items-center justify-center rounded-button px-5 py-3'
  const width = isSingleButton ? 'w-full' : ''
  switch (style) {
    case 'destructive':
      return `${base} ${width} bg-danger active:opacity-90`
    case 'cancel':
      return `${base} ${width} bg-cream dark:bg-field-dark active:opacity-90`
    default:
      return `${base} ${width} bg-terracotta active:opacity-90`
  }
}

function getButtonTextClassName(style: AlertButton['style']): string {
  const base = 'text-center font-sans text-base font-semibold'
  switch (style) {
    case 'cancel':
      return `${base} text-ink dark:text-ink-dark`
    default:
      return `${base} text-white`
  }
}
