import { View, Text, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { HestiaMark } from '@/shared/components/HestiaMark'
import { MemberDot, MemberRoleLabel } from '@/features/calendar/components/MemberDot'
import type { ConnectedAccountVM, MemberVM } from '@/features/calendar/types'
import { SyncStatusValues } from '@/features/calendar/types'

const SYNC_OK = '#456649'
const SYNC_OFF = '#9a4023'

/** Web dashboard left rail (Warm Hearth): brand, nav, member filter rows, connected accounts. */
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
    <View className="w-60 border-r border-outline-variant bg-surface-container-low px-4 py-6 dark:border-outline-variant-dark dark:bg-surface-container-low-dark">
      <View className="mb-6 flex-row items-center gap-2.5">
        <HestiaMark size={28} />
        <Text className="font-head text-xl font-bold text-on-surface dark:text-on-surface-dark">Hestia</Text>
      </View>

      <NavRow icon="calendar-month" label="Calendar" active />
      <NavRow icon="mail-outline" label="Capture" />
      <NavRow icon="balance" label="Mental load" />

      <Text className="mb-3 mt-6 font-body text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-surface-variant-dark">
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
            <MemberDot colorHex={on ? m.colorHex : '#89726b'} />
            <Text className="font-body text-[13px] font-medium text-on-surface dark:text-on-surface-dark">
              {m.displayName}
            </Text>
            <MemberRoleLabel member={m} />
          </Pressable>
        )
      })}

      <Text className="mb-3 mt-6 font-body text-[10px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-surface-variant-dark">
        Connected
      </Text>
      {accounts.map((a) => (
        <View key={a.id} className="flex-row items-center gap-2 py-1">
          <View
            className="h-2 w-2 rounded-pill"
            style={{ backgroundColor: a.status === SyncStatusValues.Synced ? SYNC_OK : SYNC_OFF }}
          />
          <Text className="font-body text-xs text-on-surface-variant dark:text-on-surface-variant-dark">{a.label}</Text>
          <Text
            className="ml-auto font-body text-[11px] font-semibold"
            style={{ color: a.status === SyncStatusValues.Synced ? SYNC_OK : SYNC_OFF }}
          >
            {a.statusLabel}
          </Text>
        </View>
      ))}
    </View>
  )
}

function NavRow({
  icon,
  label,
  active = false,
}: {
  icon: keyof typeof MaterialIcons.glyphMap
  label: string
  active?: boolean
}) {
  return (
    <View
      accessibilityRole={active ? 'tab' : 'none'}
      accessibilityState={active ? { selected: true } : undefined}
      className={`min-h-[40px] flex-row items-center gap-3 rounded-xl px-3 py-2.5 ${
        active
          ? 'border border-outline-variant bg-surface-container-lowest dark:border-outline-variant-dark dark:bg-surface-container-dark'
          : ''
      }`}
    >
      <MaterialIcons name={icon} size={18} color={active ? '#9a4023' : '#89726b'} />
      <Text
        className={`font-body text-sm ${
          active
            ? 'font-semibold text-on-surface dark:text-on-surface-dark'
            : 'font-medium text-on-surface-variant dark:text-on-surface-variant-dark'
        }`}
      >
        {label}
      </Text>
    </View>
  )
}
