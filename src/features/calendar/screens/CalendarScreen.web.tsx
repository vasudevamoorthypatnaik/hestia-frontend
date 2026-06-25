import { useState } from 'react'
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { clearTokens } from '@/shared/auth/token'
import { resetUrqlClient } from '@/shared/graphql/client'
import { CalendarRangeValues } from '@/features/calendar/types'
import { useHouseholdCalendar } from '@/features/calendar/hooks/useHouseholdCalendar'
import { useMemberFilter } from '@/features/calendar/hooks/useMemberFilter'
import { HouseholdSidebar } from '@/features/calendar/components/HouseholdSidebar.web'
import { WeekGrid } from '@/features/calendar/components/WeekGrid.web'
import { CoverageGapBanner } from '@/features/calendar/components/CoverageGapBanner'
import { LoadBar } from '@/features/calendar/components/LoadBar'
import { NewEventModal } from '@/features/calendar/components/NewEventModal.web'

/** Web household dashboard — Mon–Sun week grid, member sidebar, coverage gaps, weekly load. */
export default function CalendarScreenWeb() {
  const router = useRouter()
  const { calendar, fetching, error, shiftPeriod, anchor, refetch } = useHouseholdCalendar(
    CalendarRangeValues.Week
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
      {!calendar ? (
        <CenterState fetching={fetching} error={error} />
      ) : (
        <View className="flex-1 flex-row">
          <HouseholdSidebar
            members={members}
            accounts={calendar.connectedAccounts}
            isVisible={isVisible}
            onToggle={toggle}
          />
          <View className="flex-1">
            <View className="flex-row items-center justify-between border-b border-field-border px-6 py-4 dark:border-field-border-dark">
              <View className="flex-row items-center gap-3.5">
                <Pressable onPress={() => shiftPeriod(-1)} accessibilityRole="button" accessibilityLabel="Previous week">
                  <Text className="text-xl text-ink-muted">‹</Text>
                </Pressable>
                <Text className="font-display text-xl text-ink dark:text-ink-dark">{calendar.period.label}</Text>
                <Pressable onPress={() => shiftPeriod(1)} accessibilityRole="button" accessibilityLabel="Next week">
                  <Text className="text-xl text-ink-muted">›</Text>
                </Pressable>
              </View>
              <View className="flex-row items-center gap-3">
                <ThemeToggle />
                <Pressable onPress={handleSignOut} accessibilityRole="button" accessibilityLabel="Sign out">
                  <Text className="font-sans text-[13px] font-semibold text-ink-muted">Sign out</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowNew(true)}
                  accessibilityRole="button"
                  accessibilityLabel="New event"
                  className="min-h-[36px] justify-center rounded-button bg-terracotta px-4"
                >
                  <Text className="font-sans text-[13px] font-bold text-white">+ New event</Text>
                </Pressable>
              </View>
            </View>

            {calendar.coverageGaps.length > 0 && (
              <View className="px-6 pt-3">
                <CoverageGapBanner gaps={calendar.coverageGaps} />
              </View>
            )}

            <ScrollView className="flex-1">
              <WeekGrid events={filterEvents(calendar.events)} periodStart={calendar.period.start} />
            </ScrollView>

            <View className="border-t border-field-border bg-field px-6 py-4 dark:border-field-border-dark dark:bg-field-dark">
              <LoadBar load={calendar.load} />
            </View>
          </View>
        </View>
      )}

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

function CenterState({ fetching, error }: { fetching: boolean; error: boolean }) {
  return (
    <View className="flex-1 items-center justify-center">
      {error ? (
        <Text className="font-sans text-sm text-danger">Could not load your calendar.</Text>
      ) : fetching ? (
        <ActivityIndicator color="#C4603D" />
      ) : (
        <Text className="font-sans text-sm text-ink-muted">Loading your household…</Text>
      )}
    </View>
  )
}
