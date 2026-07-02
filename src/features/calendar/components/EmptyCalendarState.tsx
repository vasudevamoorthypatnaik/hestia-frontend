import { View, Text, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

// Warm Hearth terracotta — legible on both light and dark surface containers.
const ICON_COLOR = '#9a4023'

/**
 * Friendly empty state for the calendar (UAC-6). Shown when a period has no events. Offers an
 * "Add your first event" affordance that opens the same New-event flow as the header button, so the
 * empty state is actionable on both web (month grid) and mobile (day agenda). Warm Hearth + dark.
 */
export function EmptyCalendarState({ onAddEvent }: { onAddEvent: () => void }) {
  return (
    <View className="items-center justify-center px-6 py-16">
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-pill bg-surface-container-high dark:bg-surface-container-high-dark">
        <MaterialIcons name="calendar-month" size={26} color={ICON_COLOR} />
      </View>
      <Text className="mb-1.5 font-head text-lg font-bold text-on-surface dark:text-on-surface-dark">
        Nothing scheduled yet
      </Text>
      <Text className="mb-5 max-w-[280px] text-center font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
        Your calendar is wide open. Add your first event and it&apos;ll appear right here on the day
        it happens.
      </Text>
      <Pressable
        onPress={onAddEvent}
        accessibilityRole="button"
        accessibilityLabel="Add your first event"
        className="min-h-[44px] justify-center rounded-button bg-primary px-6 dark:bg-primary-dark"
      >
        <Text className="font-body text-sm font-bold text-on-primary dark:text-on-primary-dark">
          + Add your first event
        </Text>
      </Pressable>
    </View>
  )
}
