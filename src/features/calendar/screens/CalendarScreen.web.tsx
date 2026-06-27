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
import { MonthGrid } from '@/features/calendar/components/MonthGrid.web'
import { CoverageGapBanner } from '@/features/calendar/components/CoverageGapBanner'
import { LoadBar } from '@/features/calendar/components/LoadBar'
import { EmptyCalendarState } from '@/features/calendar/components/EmptyCalendarState'
import { NewEventModal } from '@/features/calendar/components/NewEventModal.web'

/** Web household dashboard — month grid, member sidebar, coverage gaps, weekly load. */
export default function CalendarScreenWeb() {
  const router = useRouter()
  const { calendar, fetching, error, shiftPeriod, anchor, refetch } = useHouseholdCalendar(
    CalendarRangeValues.Month
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
            <View className="flex-row items-center justify-between border-b border-outline-variant px-6 py-4 dark:border-outline-variant-dark">
              <View className="flex-row items-center gap-3.5">
                <Pressable onPress={() => shiftPeriod(-1)} accessibilityRole="button" accessibilityLabel="Previous month">
                  <Text className="text-xl text-on-surface-variant dark:text-on-surface-variant-dark">‹</Text>
                </Pressable>
                <Text className="font-head text-xl font-bold text-on-surface dark:text-on-surface-dark">{calendar.period.label}</Text>
                <Pressable onPress={() => shiftPeriod(1)} accessibilityRole="button" accessibilityLabel="Next month">
                  <Text className="text-xl text-on-surface-variant dark:text-on-surface-variant-dark">›</Text>
                </Pressable>
              </View>
              <View className="flex-row items-center gap-3">
                <ThemeToggle />
                <Pressable onPress={handleSignOut} accessibilityRole="button" accessibilityLabel="Sign out">
                  <Text className="font-body text-[13px] font-semibold text-on-surface-variant dark:text-on-surface-variant-dark">Sign out</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowNew(true)}
                  accessibilityRole="button"
                  accessibilityLabel="New event"
                  className="min-h-[36px] justify-center rounded-button bg-primary px-4 dark:bg-primary-dark"
                >
                  <Text className="font-body text-[13px] font-bold text-on-primary dark:text-on-primary-dark">+ New event</Text>
                </Pressable>
              </View>
            </View>

            {calendar.coverageGaps.length > 0 && (
              <View className="px-6 pt-3">
                <CoverageGapBanner gaps={calendar.coverageGaps} />
              </View>
            )}

            <ScrollView className="flex-1">
              {calendar.events.length === 0 ? (
                <EmptyCalendarState onAddEvent={() => setShowNew(true)} />
              ) : (
                <MonthGrid
                  events={filterEvents(calendar.events)}
                  periodStart={calendar.period.start}
                  periodEnd={calendar.period.end}
                />
              )}
            </ScrollView>

            <View className="border-t border-outline-variant bg-surface-container-low px-6 py-4 dark:border-outline-variant-dark dark:bg-surface-container-low-dark">
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
        <Text className="font-body text-sm text-error dark:text-error-dark">Could not load your calendar.</Text>
      ) : fetching ? (
        <ActivityIndicator color="#9a4023" />
      ) : (
        <Text className="font-body text-sm text-on-surface-variant dark:text-on-surface-variant-dark">Loading your household…</Text>
      )}
    </View>
  )
}
