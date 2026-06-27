import { View, Text } from 'react-native'
import { EventCard } from '@/features/calendar/components/EventCard'
import { addDaysIso, todayIso, type CalendarEventVM } from '@/features/calendar/types'

const DOW_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

/** ISO weekday 1=Mon..7=Sun for a yyyy-MM-dd string (local, no tz shift). */
function isoWeekdayMon1(iso: string): number {
  const parts = iso.split('-')
  const y = parseInt(parts[0] ?? '1970', 10)
  const m = parseInt(parts[1] ?? '1', 10)
  const d = parseInt(parts[2] ?? '1', 10)
  const jsDow = new Date(y, m - 1, d).getDay() // 0=Sun..6=Sat
  return jsDow === 0 ? 7 : jsDow
}

interface DayCell {
  iso: string
  day: number
  inMonth: boolean
  isToday: boolean
  events: CalendarEventVM[]
}

/**
 * Web month grid (Warm Hearth). Renders Mon–Sun weeks spanning the backend-computed month window
 * (period.start = the 1st, period.end = the last day) with leading/trailing out-of-month days, a
 * today highlight, and each event placed on its concrete calendar cell by events[].date. The
 * backend already projects recurring events onto each occurrence date, so this is pure rendering.
 */
export function MonthGrid({
  events,
  periodStart,
  periodEnd,
}: {
  events: readonly CalendarEventVM[]
  periodStart: string
  periodEnd: string
}) {
  const today = todayIso()
  const month = periodStart.slice(0, 7) // yyyy-MM of the displayed month

  // Grid spans the Monday on/before the 1st through the Sunday on/after the last day.
  const gridStart = addDaysIso(periodStart, -(isoWeekdayMon1(periodStart) - 1))
  const gridEnd = addDaysIso(periodEnd, 7 - isoWeekdayMon1(periodEnd))

  // Group events by their concrete date (ISO strings sort lexicographically, so <= is safe).
  const byDate = new Map<string, CalendarEventVM[]>()
  for (const e of events) {
    const list = byDate.get(e.date)
    if (list) list.push(e)
    else byDate.set(e.date, [e])
  }

  const weeks: DayCell[][] = []
  let cursor = gridStart
  while (cursor <= gridEnd) {
    const week: DayCell[] = []
    for (let i = 0; i < 7; i += 1) {
      week.push({
        iso: cursor,
        day: parseInt(cursor.split('-')[2] ?? '1', 10),
        inMonth: cursor.slice(0, 7) === month,
        isToday: cursor === today,
        events: byDate.get(cursor) ?? [],
      })
      cursor = addDaysIso(cursor, 1)
    }
    weeks.push(week)
  }

  return (
    <View className="flex-1 p-4">
      {/* Weekday header */}
      <View className="flex-row">
        {DOW_SHORT.map((d) => (
          <View key={d} className="flex-1 px-1 pb-2">
            <Text className="text-center font-body text-[11px] font-bold text-on-surface-variant dark:text-on-surface-variant-dark">
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* Week rows */}
      <View className="border-l border-t border-outline-variant dark:border-outline-variant-dark">
        {weeks.map((week) => (
          <View key={week[0]?.iso} className="flex-row">
            {week.map((cell) => (
              <View
                key={cell.iso}
                accessibilityLabel={`${cell.iso}${
                  cell.events.length
                    ? `, ${cell.events.length} event${cell.events.length > 1 ? 's' : ''}`
                    : ''
                }`}
                className={`min-h-[116px] flex-1 gap-1 border-b border-r border-outline-variant px-1.5 py-1.5 dark:border-outline-variant-dark ${
                  cell.isToday
                    ? 'bg-surface-container-high dark:bg-surface-container-high-dark'
                    : cell.inMonth
                      ? 'bg-surface dark:bg-surface-dark'
                      : 'bg-surface-container-low dark:bg-surface-container-low-dark'
                }`}
              >
                <View className="flex-row items-center">
                  {cell.isToday ? (
                    <View className="h-6 w-6 items-center justify-center rounded-pill bg-primary dark:bg-primary-dark">
                      <Text className="font-body text-[12px] font-bold text-on-primary dark:text-on-primary-dark">
                        {cell.day}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      className={`font-body text-[12px] font-semibold ${
                        cell.inMonth
                          ? 'text-on-surface dark:text-on-surface-dark'
                          : 'text-on-surface-variant dark:text-on-surface-variant-dark'
                      }`}
                      style={cell.inMonth ? undefined : { opacity: 0.5 }}
                    >
                      {cell.day}
                    </Text>
                  )}
                </View>
                {cell.events.map((e) => (
                  <EventCard key={`${cell.iso}-${e.id}`} event={e} showResponsible={false} />
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}
