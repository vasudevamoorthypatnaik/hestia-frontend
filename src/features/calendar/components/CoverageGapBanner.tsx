import { View, Text, Pressable } from 'react-native'
import type { CoverageGapVM } from '@/features/calendar/types'

/**
 * Surfaces the first backend-detected coverage gap (a duty with no responsible adult). The
 * "Assign"/"Claim" action is rendered for visual fidelity but inert in this slice (UAC-9).
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
      className="flex-row items-center gap-2.5 rounded-xl border border-danger-border bg-danger-bg px-3.5 py-2.5"
    >
      <View className="h-5 w-5 items-center justify-center rounded-md bg-terracotta">
        <Text className="text-xs font-bold text-white">!</Text>
      </View>
      <Text className="flex-1 font-sans text-[13px] font-semibold text-danger">{gap.shortLabel}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${actionLabel} (coming soon)`}
        disabled
        className="min-h-[28px] justify-center rounded-pill bg-terracotta px-3 py-1.5 opacity-80"
      >
        <Text className="font-sans text-xs font-bold text-white">{actionLabel}</Text>
      </Pressable>
    </View>
  )
}
