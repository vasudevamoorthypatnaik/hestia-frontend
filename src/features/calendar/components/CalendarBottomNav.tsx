import { View, Text } from 'react-native'

/** Mobile bottom tab bar. Only Calendar is wired this slice; Capture/Load are inert (UAC-9). */
export function CalendarBottomNav() {
  const items: { icon: string; label: string; active: boolean }[] = [
    { icon: '▦', label: 'Calendar', active: true },
    { icon: '✉', label: 'Capture', active: false },
    { icon: '⚖', label: 'Load', active: false },
  ]
  return (
    <View className="flex-row items-center justify-around border-t border-field-border bg-field py-2.5 dark:border-field-border-dark dark:bg-field-dark">
      {items.map((it) => (
        <View
          key={it.label}
          accessibilityRole={it.active ? 'tab' : 'none'}
          accessibilityState={it.active ? { selected: true } : undefined}
          className="items-center gap-0.5"
        >
          <Text style={{ fontSize: 18 }} className={it.active ? 'text-terracotta' : 'text-ink-muted'}>
            {it.icon}
          </Text>
          <Text
            className={`font-sans text-[11px] ${
              it.active ? 'font-bold text-terracotta' : 'font-semibold text-ink-muted'
            }`}
          >
            {it.label}
          </Text>
        </View>
      ))}
    </View>
  )
}
