import { View, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

/** Mobile bottom tab bar (Warm Hearth). Only Calendar is wired this slice; Capture/Load are inert. */
export function CalendarBottomNav() {
  const items: { icon: keyof typeof MaterialIcons.glyphMap; label: string; active: boolean }[] = [
    { icon: 'calendar-month', label: 'Calendar', active: true },
    { icon: 'mail-outline', label: 'Capture', active: false },
    { icon: 'balance', label: 'Load', active: false },
  ]
  return (
    <View className="flex-row items-center justify-around border-t border-outline-variant bg-surface-container-lowest py-2.5 dark:border-outline-variant-dark dark:bg-surface-container-low-dark">
      {items.map((it) => (
        <View
          key={it.label}
          accessibilityRole={it.active ? 'tab' : 'none'}
          accessibilityState={it.active ? { selected: true } : undefined}
          className="items-center gap-0.5"
        >
          <MaterialIcons name={it.icon} size={20} color={it.active ? '#9a4023' : '#89726b'} />
          <Text
            className={`font-body text-[11px] ${
              it.active
                ? 'font-bold text-primary dark:text-primary-dark'
                : 'font-semibold text-on-surface-variant dark:text-on-surface-variant-dark'
            }`}
          >
            {it.label}
          </Text>
        </View>
      ))}
    </View>
  )
}
