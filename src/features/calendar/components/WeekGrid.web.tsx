import { View, Text } from 'react-native'
import { EventCard } from '@/features/calendar/components/EventCard'
import { addDaysIso, todayIso, type CalendarEventVM } from '@/features/calendar/types'

const DOW_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

/** Web Mon–Sun week grid. Columns are derived from the period start; events placed by dayOfWeek. */
export function WeekGrid({
  events,
  periodStart,
}: {
  events: readonly CalendarEventVM[]
  periodStart: string
}) {
  const today = todayIso()
  const columns = Array.from({ length: 7 }, (_, i) => {
    const iso = addDaysIso(periodStart, i)
    const dayNum = parseInt(iso.split('-')[2] ?? '1', 10)
    return {
      dow: i + 1,
      label: `${DOW_SHORT[i]} ${dayNum}`,
      isToday: iso === today,
      events: events.filter((e) => e.dayOfWeek === i + 1),
    }
  })

  return (
    <View className="flex-1 flex-row gap-2 p-4">
      {columns.map((col) => (
        <View
          key={col.dow}
          className="flex-1 gap-2 border-l border-outline-variant px-1 dark:border-outline-variant-dark"
        >
          <Text
            className={`mb-1 text-center font-body text-[11px] font-bold ${
              col.isToday ? 'text-primary dark:text-primary-dark' : 'text-on-surface-variant dark:text-on-surface-variant-dark'
            }`}
          >
            {col.label}
          </Text>
          {col.events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </View>
      ))}
    </View>
  )
}
