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
  const { calendar, fetching, error, shiftPeriod, anchor, refetch } = useHouseholdCalendar(
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
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
        <Text className="font-head text-2xl font-bold text-on-surface dark:text-on-surface-dark">
          {calendar?.period.label ?? 'Calendar'}
        </Text>
        <View className="flex-row items-center gap-3">
          <ThemeToggle />
          <Pressable
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            className="min-h-[44px] justify-center"
          >
            <Text className="font-body text-[13px] font-semibold text-on-surface-variant dark:text-on-surface-variant-dark">Sign out</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center gap-2 px-5 pb-2">
        <Pressable onPress={() => shiftPeriod(-1)} accessibilityRole="button" accessibilityLabel="Previous day">
          <Text className="text-lg text-on-surface-variant dark:text-on-surface-variant-dark">‹</Text>
        </Pressable>
        <Pressable onPress={() => shiftPeriod(1)} accessibilityRole="button" accessibilityLabel="Next day">
          <Text className="text-lg text-on-surface-variant dark:text-on-surface-variant-dark">›</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowNew(true)}
          accessibilityRole="button"
          accessibilityLabel="New event"
          className="ml-auto h-9 w-9 items-center justify-center rounded-pill bg-primary dark:bg-primary-dark"
        >
          <Text className="text-lg font-bold text-on-primary dark:text-on-primary-dark">+</Text>
        </Pressable>
      </View>

      {members.length > 0 && (
        <View className="px-5 pb-3">
          <MemberFilterChips members={members} isVisible={isVisible} onToggle={toggle} />
        </View>
      )}

      <ScrollView className="flex-1 rounded-t-3xl border-t border-outline-variant bg-surface-container-lowest px-4 pt-4 dark:border-outline-variant-dark dark:bg-surface-container-low-dark">
        {!calendar ? (
          <View className="items-center justify-center py-16">
            {error ? (
              <Text className="font-body text-sm text-error dark:text-error-dark">Could not load your calendar.</Text>
            ) : fetching ? (
              <ActivityIndicator color="#9a4023" />
            ) : (
              <Text className="font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">Loading…</Text>
            )}
          </View>
        ) : (
          <>
            {calendar.coverageGaps.length > 0 && (
              <View className="mb-4">
                <CoverageGapBanner gaps={calendar.coverageGaps} actionLabel="Claim" />
              </View>
            )}
            <DayAgenda events={filterEvents(calendar.events)} onAddEvent={() => setShowNew(true)} />
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
        onCreated={refetch}
      />
    </View>
  )
}
