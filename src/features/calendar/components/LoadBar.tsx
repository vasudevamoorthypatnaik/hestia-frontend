import { View, Text } from 'react-native'
import type { CalendarLoadVM } from '@/features/calendar/types'

/**
 * "Hearth Glow" — the backend-computed weekly labor balance (U6). Renders a soft warm bar with
 * one segment per responsible adult (authentic member colors, width = share), plus a balance
 * pill and optional nudge. Returns null when there's no responsible-event load to show
 * (empty entries or total=0) so the marker/segment math never divides by zero.
 */
export function LoadBar({ load }: { load: CalendarLoadVM }) {
  if (load.entries.length === 0 || load.total === 0) return null
  // "Balanced" when no single adult carries >60% of the responsible-event load.
  const maxShare = Math.max(...load.entries.map((e) => e.percent))
  const balanced = maxShare <= 60

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-baseline gap-2">
          <Text className="font-head text-[15px] font-bold text-on-surface dark:text-on-surface-dark">
            Hearth Glow
          </Text>
          <Text className="font-body text-[11.5px] text-on-surface-variant dark:text-on-surface-variant-dark">
            this week&apos;s labor balance
          </Text>
        </View>
        <Text
          className={`rounded-pill px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wide ${
            balanced
              ? 'bg-secondary-container text-on-secondary-container dark:bg-secondary-container-dark dark:text-on-secondary-container-dark'
              : 'bg-error-container text-on-error-container dark:bg-error-container-dark dark:text-on-error-container-dark'
          }`}
        >
          {balanced ? '● Balanced' : '● Lopsided'}
        </Text>
      </View>

      {/* Soft warm bar: per-member segments in authentic colors (Hearth Glow tonal blend). */}
      <View
        className="h-6 flex-row overflow-hidden rounded-pill"
        accessibilityRole="progressbar"
        accessibilityLabel={`Labor balance: ${load.entries
          .map((e) => `${e.member.displayName} ${e.percent} percent`)
          .join(', ')}`}
      >
        {load.entries.map((e) => (
          <View
            key={e.member.id}
            className="justify-center px-3"
            style={{ width: `${e.percent}%`, backgroundColor: e.member.colorHex }}
          >
            <Text numberOfLines={1} className="font-body text-[11px] font-bold text-white">
              {e.member.displayName} · {e.count}
            </Text>
          </View>
        ))}
      </View>

      {load.summaryLabel ? (
        <Text className="mt-2 font-body text-xs text-on-surface-variant dark:text-on-surface-variant-dark">
          {load.summaryLabel}
        </Text>
      ) : null}
    </View>
  )
}
