import { View, Text, Pressable } from 'react-native'
import type { MemberVM } from '@/features/calendar/types'

/** Tappable chips to show/hide each member's events. */
export function MemberFilterChips({
  members,
  isVisible,
  onToggle,
}: {
  members: readonly MemberVM[]
  isVisible: (memberId: string) => boolean
  onToggle: (memberId: string) => void
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {members.map((m) => {
        const on = isVisible(m.id)
        return (
          <Pressable
            key={m.id}
            onPress={() => onToggle(m.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={`${m.displayName} filter`}
            className="min-h-[36px] flex-row items-center gap-1.5 rounded-pill border px-2.5 py-1.5"
            style={{
              backgroundColor: on ? m.colorHex : 'transparent',
              borderColor: on ? m.colorHex : '#E0D5C5',
            }}
          >
            <View
              className="h-5 w-5 items-center justify-center rounded-pill"
              style={{ backgroundColor: on ? 'rgba(255,255,255,0.25)' : m.colorHex }}
            >
              <Text className="text-[10px] font-bold text-white">{m.initial}</Text>
            </View>
            <Text
              className="font-sans text-xs font-semibold"
              style={{ color: on ? '#ffffff' : '#6B6155' }}
            >
              {m.displayName}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
