import { View, Text, Pressable } from 'react-native'
import type { CoverageGapVM } from '@/features/calendar/types'

/**
 * Surfaces the first backend-detected coverage gap (a duty with no responsible adult). The
 * "Assign"/"Claim" action is rendered for visual fidelity but inert in this slice (U6, T7-style).
 */
export function CoverageGapBanner({
  gaps,
  actionLabel = 'Assign',
}: {
  gaps: readonly CoverageGapVM[]
  actionLabel?: string
}) {
  const gap = gaps[0]
  if (!gap) return null
  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={gap.label}
      className="flex-row items-center gap-2.5 rounded-xl border border-error-container bg-error-container px-3.5 py-2.5 dark:border-error-container-dark dark:bg-error-container-dark"
    >
      <View className="h-5 w-5 items-center justify-center rounded-md bg-primary dark:bg-primary-dark">
        <Text className="text-xs font-bold text-on-primary dark:text-on-primary-dark">!</Text>
      </View>
      <Text className="flex-1 font-body text-[13px] font-semibold text-on-error-container dark:text-on-error-container-dark">
        {gap.shortLabel}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${actionLabel} (coming soon)`}
        disabled
        className="min-h-[28px] justify-center rounded-pill bg-primary px-3 py-1.5 opacity-80 dark:bg-primary-dark"
      >
        <Text className="font-body text-xs font-bold text-on-primary dark:text-on-primary-dark">{actionLabel}</Text>
      </Pressable>
    </View>
  )
}
