import { View } from 'react-native'

/**
 * The Hestia brand mark — a rounded square (diamond) inside a circle. `variant="onPrimary"`
 * renders the white-on-translucent treatment for placement over the terracotta hero; `solid`
 * renders the terracotta circle with a cream diamond for light/neutral surfaces.
 */
export function HestiaMark({
  size = 32,
  variant = 'solid',
}: {
  size?: number
  variant?: 'solid' | 'onPrimary'
}) {
  const onPrimary = variant === 'onPrimary'
  return (
    <View
      className={`items-center justify-center rounded-pill ${
        onPrimary ? 'bg-white/20' : 'bg-primary dark:bg-primary-dark'
      }`}
      style={{ width: size, height: size }}
    >
      <View
        className={
          onPrimary
            ? 'rotate-45 rounded-[3px] bg-white'
            : 'rotate-45 rounded-[2px] bg-surface dark:bg-surface-dark'
        }
        style={{ width: size * 0.4, height: size * 0.4 }}
      />
    </View>
  )
}
