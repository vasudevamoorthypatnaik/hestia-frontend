import { View, Text, Pressable } from 'react-native'
import { MemberDot } from '@/features/calendar/components/MemberDot'
import { MemberRoleLabel } from '@/features/calendar/components/MemberDot'
import type { ConnectedAccountVM, MemberVM } from '@/features/calendar/types'
import { SyncStatusValues } from '@/features/calendar/types'

/** Web dashboard left rail: brand, nav, member filter rows, connected accounts. */
export function HouseholdSidebar({
  members,
  accounts,
  isVisible,
  onToggle,
}: {
  members: readonly MemberVM[]
  accounts: readonly ConnectedAccountVM[]
  isVisible: (memberId: string) => boolean
  onToggle: (memberId: string) => void
}) {
  return (
    <View className="w-60 border-r border-field-border bg-field px-4 py-6 dark:border-field-border-dark dark:bg-field-dark">
      <View className="mb-6 flex-row items-center gap-2.5">
        <View className="h-7 w-7 items-center justify-center rounded-pill bg-terracotta">
          <View className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-field dark:bg-field-dark" />
        </View>
        <Text className="font-display text-xl text-ink dark:text-ink-dark">Hestia</Text>
      </View>

      <NavRow icon="▦" label="Calendar" active />
      <NavRow icon="✉" label="Capture" />
      <NavRow icon="⚖" label="Mental load" />

      <Text className="mb-3 mt-6 font-sans text-[10px] font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
        Household · tap to filter
      </Text>
      {members.map((m) => {
        const on = isVisible(m.id)
        return (
          <Pressable
            key={m.id}
            onPress={() => onToggle(m.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={`${m.displayName} filter`}
            className="min-h-[36px] flex-row items-center gap-2.5 py-1.5"
            style={{ opacity: on ? 1 : 0.4 }}
          >
            <MemberDot colorHex={on ? m.colorHex : '#A89A88'} />
            <Text className="font-sans text-[13px] font-medium text-ink dark:text-ink-dark">
              {m.displayName}
            </Text>
            <MemberRoleLabel member={m} />
          </Pressable>
        )
      })}

      <Text className="mb-3 mt-6 font-sans text-[10px] font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
        Connected
      </Text>
      {accounts.map((a) => (
        <View key={a.id} className="flex-row items-center gap-2 py-1">
          <View
            className="h-2 w-2 rounded-pill"
            style={{ backgroundColor: a.status === SyncStatusValues.Synced ? '#6E9466' : '#C4603D' }}
          />
          <Text className="font-sans text-xs text-ink-muted dark:text-ink-muted-dark">{a.label}</Text>
          <Text
            className="ml-auto font-sans text-[11px] font-semibold"
            style={{ color: a.status === SyncStatusValues.Synced ? '#6E9466' : '#C4603D' }}
          >
            {a.statusLabel}
          </Text>
        </View>
      ))}
    </View>
  )
}

function NavRow({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <View
      accessibilityRole={active ? 'tab' : 'none'}
      accessibilityState={active ? { selected: true } : undefined}
      className={`min-h-[40px] flex-row items-center gap-3 rounded-xl px-3 py-2.5 ${
        active ? 'border border-field-border bg-cream dark:border-field-border-dark dark:bg-cream-dark' : ''
      }`}
    >
      <Text style={{ fontSize: 16 }} className={active ? 'text-ink dark:text-ink-dark' : 'text-ink-muted'}>
        {icon}
      </Text>
      <Text
        className={`font-sans text-sm ${
          active ? 'font-semibold text-ink dark:text-ink-dark' : 'font-medium text-ink-muted'
        }`}
      >
        {label}
      </Text>
    </View>
  )
}
