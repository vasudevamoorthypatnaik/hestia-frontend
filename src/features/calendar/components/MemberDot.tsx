import { View, Text } from 'react-native'
import type { MemberVM } from '@/features/calendar/types'
import { MemberRoleValues } from '@/features/calendar/types'

/** A small square color swatch for a household member (color is backend-authoritative). */
export function MemberDot({ colorHex, size = 11 }: { colorHex: string; size?: number }) {
  return (
    <View
      style={{ width: size, height: size, borderRadius: 3, backgroundColor: colorHex }}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  )
}

/** Trailing hint for a member row: "admin" for the admin, the age label for kids, else nothing. */
export function MemberRoleLabel({ member }: { member: MemberVM }) {
  const text = member.role === MemberRoleValues.Admin ? 'admin' : member.ageLabel ?? null
  if (!text) return null
  return (
    <Text className="ml-auto font-sans text-[11px] text-ink-muted dark:text-ink-muted-dark">
      {text}
    </Text>
  )
}
