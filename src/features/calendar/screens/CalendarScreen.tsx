import { useState } from 'react'
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { clearTokens } from '@/shared/auth/token'
import { resetUrqlClient } from '@/shared/graphql/client'
import { CalendarRangeValues } from '@/features/calendar/types'
import { useHouseholdCalendar } from '@/features/calendar/hooks/useHouseholdCalendar'
import { useMemberFilter } from '@/features/calendar/hooks/useMemberFilter'
import { MemberFilterChips } from '@/features/calendar/components/MemberFilterChips'
import { CoverageGapBanner } from '@/features/calendar/components/CoverageGapBanner'
import { DayAgenda } from '@/features/calendar/components/DayAgenda'
import { CalendarBottomNav } from '@/features/calendar/components/CalendarBottomNav'
import { NewEventModal } from '@/features/calendar/components/NewEventModal'

/** Mobile household view — a single day's agenda with member filters and coverage gaps. */
export default function CalendarScreen() {
  const router = useRouter()
  const { calendar, fetching, error, shiftPeriod, anchor } = useHouseholdCalendar(
    CalendarRangeValues.Day
  )
  const members = calendar?.members ?? []
  const { isVisible, toggle, filterEvents } = useMemberFilter(members)
  const [showNew, setShowNew] = useState(false)

  const handleSignOut = async () => {
    await clearTokens()
    resetUrqlClient()
    router.replace('/auth/login' as Href)
  }

  return (
    <View className="flex-1 bg-surface-light dark:bg-surface-dark">
      <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
        <Text className="font-display text-2xl text-ink dark:text-ink-dark">
          {calendar?.period.label ?? 'Calendar'}
        </Text>
        <View className="flex-row items-center gap-3">
          <ThemeToggle />
          <Pressable onPress={handleSignOut} accessibilityRole="button" accessibilityLabel="Sign out">
            <Text className="font-sans text-[13px] font-semibold text-ink-muted">Sign out</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center gap-2 px-5 pb-2">
        <Pressable onPress={() => shiftPeriod(-1)} accessibilityRole="button" accessibilityLabel="Previous day">
          <Text className="text-lg text-ink-muted">‹</Text>
        </Pressable>
        <Pressable onPress={() => shiftPeriod(1)} accessibilityRole="button" accessibilityLabel="Next day">
          <Text className="text-lg text-ink-muted">›</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowNew(true)}
          accessibilityRole="button"
          accessibilityLabel="New event"
          className="ml-auto h-9 w-9 items-center justify-center rounded-pill bg-terracotta"
        >
          <Text className="text-lg font-bold text-white">+</Text>
        </Pressable>
      </View>

      {members.length > 0 && (
        <View className="px-5 pb-3">
          <MemberFilterChips members={members} isVisible={isVisible} onToggle={toggle} />
        </View>
      )}

      <ScrollView className="flex-1 rounded-t-3xl border-t border-field-border bg-white px-4 pt-4 dark:border-field-border-dark dark:bg-cream-dark">
        {!calendar ? (
          <View className="items-center justify-center py-16">
            {error ? (
              <Text className="font-sans text-sm text-danger">Could not load your calendar.</Text>
            ) : fetching ? (
              <ActivityIndicator color="#C4603D" />
            ) : (
              <Text className="font-sans text-sm text-ink-muted">Loading…</Text>
            )}
          </View>
        ) : (
          <>
            {calendar.coverageGaps.length > 0 && (
              <View className="mb-4">
                <CoverageGapBanner gaps={calendar.coverageGaps} actionLabel="Claim" />
              </View>
            )}
            <DayAgenda events={filterEvents(calendar.events)} />
            <View className="h-6" />
          </>
        )}
      </ScrollView>

      <CalendarBottomNav />

      <NewEventModal
        visible={showNew}
        members={members}
        defaultDate={anchor}
        onClose={() => setShowNew(false)}
      />
    </View>
  )
}
