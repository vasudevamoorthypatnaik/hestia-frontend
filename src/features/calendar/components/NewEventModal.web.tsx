import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { NewEventForm } from '@/features/calendar/components/NewEventForm'
import { useCreateCalendarEvent } from '@/features/calendar/hooks/useCreateCalendarEvent'
import type { CreateCalendarEventInput } from '@/__generated__/graphql'
import type { MemberVM } from '@/features/calendar/types'

/**
 * Web "New event" — a centered in-app overlay (NOT react-native `Modal`, which renders a
 * full-screen container even when hidden and intercepts clicks on web — the app's documented
 * web-modal gotcha). Absent from the tree when closed, so it never blocks calendar interactions.
 */
export function NewEventModal({
  visible,
  members,
  defaultDate,
  onClose,
  onCreated,
}: {
  visible: boolean
  members: readonly MemberVM[]
  defaultDate: string
  onClose: () => void
  onCreated?: () => void
}) {
  const { create, submitting, error } = useCreateCalendarEvent()

  if (!visible) return null

  const handleSubmit = async (input: CreateCalendarEventInput) => {
    if (await create(input)) {
      onCreated?.()
      onClose()
    }
  }

  return (
    <View
      style={StyleSheet.absoluteFill}
      className="z-50 items-center justify-center bg-black/40 p-4"
    >
      <View className="max-h-[90%] w-[600px] max-w-full overflow-hidden rounded-card bg-field dark:bg-field-dark">
        <View className="flex-row items-center justify-between border-b border-field-border px-7 py-5 dark:border-field-border-dark">
          <Text className="font-display text-2xl text-ink dark:text-ink-dark">New event</Text>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
            <Text className="text-xl text-ink-muted">×</Text>
          </Pressable>
        </View>
        <ScrollView className="px-7 py-6">
          <NewEventForm
            members={members}
            defaultDate={defaultDate}
            submitting={submitting}
            errorMessage={error}
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </View>
    </View>
  )
}
