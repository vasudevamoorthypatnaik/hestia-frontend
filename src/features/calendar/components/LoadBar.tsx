import { View, Text } from 'react-native'
import type { CalendarLoadVM } from '@/features/calendar/types'

/** The backend-computed weekly load split per responsible adult (UAC-6). */
export function LoadBar({ load }: { load: CalendarLoadVM }) {
  if (load.entries.length === 0) return null
  const headline = load.entries.map((e) => `${e.percent}`).join(' / ')

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-sans text-xs font-bold uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark">
          This week's load
        </Text>
        <Text className="rounded-pill bg-danger-bg px-2.5 py-1 font-sans text-xs font-bold text-danger">
          {headline}
        </Text>
      </View>
      <View
        className="h-8 flex-row overflow-hidden rounded-lg"
        accessibilityRole="progressbar"
        accessibilityLabel={`Load: ${load.entries
          .map((e) => `${e.member.displayName} ${e.percent} percent`)
          .join(', ')}`}
      >
        {load.entries.map((e) => (
          <View
            key={e.member.id}
            className="justify-center px-3"
            style={{ width: `${e.percent}%`, backgroundColor: e.member.colorHex }}
          >
            <Text numberOfLines={1} className="font-sans text-xs font-bold text-white">
              {e.member.displayName} · {e.count}
            </Text>
          </View>
        ))}
      </View>
      {load.summaryLabel ? (
        <Text className="mt-2 font-sans text-xs text-ink-muted dark:text-ink-muted-dark">
          {load.summaryLabel}
        </Text>
      ) : null}
    </View>
  )
}
