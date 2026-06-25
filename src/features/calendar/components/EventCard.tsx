import { View, Text } from 'react-native'
import type { CalendarEventVM } from '@/features/calendar/types'

/** A single event tile. Color comes from the backend (`colorHex`); coverage gaps render dashed. */
export function EventCard({
  event,
  showResponsible = true,
}: {
  event: CalendarEventVM
  showResponsible?: boolean
}) {
  const gap = event.isCoverageGap
  const owners = event.ownerMembers.map((o) => o.displayName).join(' & ')
  const a11yLabel = `${event.title}, ${event.timeLabel}${
    gap ? ', unassigned' : event.responsibleMember ? `, ${event.responsibleMember.displayName}` : ''
  }`

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={a11yLabel}
      className="rounded-md px-2.5 py-2"
      style={
        gap
          ? { borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#E2A88E', backgroundColor: 'transparent' }
          : { borderLeftWidth: 3, borderLeftColor: event.colorHex, backgroundColor: `${event.colorHex}1A` }
      }
    >
      <Text
        className="font-sans text-[10px] font-bold"
        style={{ color: gap ? '#C4603D' : event.colorHex }}
      >
        {event.needsDriver ? `${event.timeLabel} 🚗` : event.timeLabel}
        {gap ? ' ⚠' : ''}
      </Text>
      <Text
        className="font-sans text-xs font-semibold text-ink dark:text-ink-dark"
        style={gap ? { color: '#C4603D' } : undefined}
      >
        {event.title}
      </Text>
      {showResponsible && (
        <Text
          className="mt-0.5 font-sans text-[10px] text-ink-muted dark:text-ink-muted-dark"
          style={gap ? { color: '#D08C70', fontWeight: '600' } : undefined}
        >
          {gap ? 'Unassigned' : event.responsibleMember?.displayName ?? owners}
        </Text>
      )}
    </View>
  )
}
