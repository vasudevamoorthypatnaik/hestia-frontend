import { Modal, View, Text, Pressable, ScrollView } from 'react-native'
import { NewEventForm } from '@/features/calendar/components/NewEventForm'
import { useCreateCalendarEvent } from '@/features/calendar/hooks/useCreateCalendarEvent'
import type { CreateCalendarEventInput } from '@/__generated__/graphql'
import type { MemberVM } from '@/features/calendar/types'

/** Web "New event" — centered modal card over the dashboard (matches ADD BY HAND web design). */
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40 p-4">
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
    </Modal>
  )
}
