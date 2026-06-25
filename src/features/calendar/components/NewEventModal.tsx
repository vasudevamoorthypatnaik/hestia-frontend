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
}: {
  visible: boolean
  members: readonly MemberVM[]
  defaultDate: string
  onClose: () => void
}) {
  const { create, submitting, error } = useCreateCalendarEvent()

  const handleSubmit = async (input: CreateCalendarEventInput) => {
    if (await create(input)) onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-surface-light dark:bg-surface-dark">
        <View className="flex-row items-center justify-between border-b border-field-border px-5 py-4 dark:border-field-border-dark">
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cancel">
            <Text className="font-sans text-sm font-semibold text-ink-muted">Cancel</Text>
          </Pressable>
          <Text className="font-sans text-base font-bold text-ink dark:text-ink-dark">New event</Text>
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
