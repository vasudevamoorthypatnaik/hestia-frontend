import { View, Text } from 'react-native'
import type { CalendarEventVM } from '@/features/calendar/types'

// Warm Hearth gap accents (terracotta family) for unassigned/coverage-gap events.
const GAP_BORDER = '#e2a88e'
const GAP_PRIMARY = '#9a4023'
const GAP_MUTED = '#d08c70'

/** A single event tile (Warm Hearth). Color comes from the backend (`colorHex`); coverage gaps render dashed. */
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
          ? { borderWidth: 1.5, borderStyle: 'dashed', borderColor: GAP_BORDER, backgroundColor: 'transparent' }
          : { borderLeftWidth: 3, borderLeftColor: event.colorHex, backgroundColor: `${event.colorHex}1A` }
      }
    >
      <Text className="font-body text-[10px] font-bold" style={{ color: gap ? GAP_PRIMARY : event.colorHex }}>
        {event.needsDriver ? `${event.timeLabel} 🚗` : event.timeLabel}
        {gap ? ' ⚠' : ''}
      </Text>
      <Text
        className="font-body text-xs font-semibold text-on-surface dark:text-on-surface-dark"
        style={gap ? { color: GAP_PRIMARY } : undefined}
      >
        {event.title}
      </Text>
      {showResponsible && (
        <Text
          className="mt-0.5 font-body text-[10px] text-on-surface-variant dark:text-on-surface-variant-dark"
          style={gap ? { color: GAP_MUTED, fontWeight: '600' } : undefined}
        >
          {gap ? 'Unassigned' : event.responsibleMember?.displayName ?? owners}
        </Text>
      )}
    </View>
  )
}
