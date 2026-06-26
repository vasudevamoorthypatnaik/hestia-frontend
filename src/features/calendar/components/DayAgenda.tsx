import { View, Text } from 'react-native'
import { EventCard } from '@/features/calendar/components/EventCard'
import type { CalendarEventVM } from '@/features/calendar/types'

/** Mobile day agenda — a simple ordered timeline of the day's events. */
export function DayAgenda({ events }: { events: readonly CalendarEventVM[] }) {
  if (events.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Text className="font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
          Nothing scheduled.
        </Text>
      </View>
    )
  }

  return (
    <View className="gap-3">
      {events.map((e) => (
        <View key={e.id} className="flex-row gap-3">
          <Text className="w-14 pt-1 font-body text-[11px] font-semibold text-on-surface-variant dark:text-on-surface-variant-dark">
            {e.allDay ? 'All day' : e.timeLabel.split(' – ')[0]}
          </Text>
          <View className="flex-1">
            <EventCard event={e} />
          </View>
        </View>
      ))}
    </View>
  )
}
