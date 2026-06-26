import { Modal, View, Text, Pressable, ScrollView } from 'react-native'
import { NewEventForm } from '@/features/calendar/components/NewEventForm'
import { useCreateCalendarEvent } from '@/features/calendar/hooks/useCreateCalendarEvent'
import type { CreateCalendarEventInput } from '@/__generated__/graphql'
import type { MemberVM } from '@/features/calendar/types'

/** Mobile "New event" — full-screen form (matches ADD BY HAND mobile design). */
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

  // Unmount the form while closed so it remounts with fresh state + the current defaultDate on each
  // open (RN Modal keeps children mounted otherwise → stale draft / stale defaultDate on reopen).
  if (!visible) return null

  const handleSubmit = async (input: CreateCalendarEventInput) => {
    if (await create(input)) {
      onCreated?.()
      onClose()
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-surface dark:bg-surface-dark">
        <View className="flex-row items-center justify-between border-b border-outline-variant px-5 py-4 dark:border-outline-variant-dark">
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cancel">
            <Text className="font-body text-sm font-semibold text-on-surface-variant dark:text-on-surface-variant-dark">Cancel</Text>
          </Pressable>
          <Text className="font-head text-base font-bold text-on-surface dark:text-on-surface-dark">New event</Text>
          <View className="w-12" />
        </View>
        <ScrollView className="flex-1 px-5 py-5">
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
    </Modal>
  )
}
