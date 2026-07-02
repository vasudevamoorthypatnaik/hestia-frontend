import { useMemo, useState } from 'react'
import { View, Text, Pressable, Switch } from 'react-native'
import { z } from 'zod'
import { FormField } from '@/shared/components/FormField'
import type { CreateCalendarEventInput } from '@/__generated__/graphql'
import { MemberKindValues, type MemberVM } from '@/features/calendar/types'

const TIME_RE = /^([01]?\d|2[0-3]):[0-5]\d$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const schema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.'),
    date: z.string().regex(DATE_RE, 'Date must be yyyy-MM-dd.'),
    allDay: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
    ownerIds: z.array(z.string()).min(1, 'Pick at least one owner.'),
  })
  .refine((v) => v.allDay || TIME_RE.test(v.startTime), {
    message: 'Start time must be HH:mm.',
    path: ['startTime'],
  })
  .refine((v) => v.allDay || v.endTime === '' || TIME_RE.test(v.endTime), {
    message: 'End time must be HH:mm.',
    path: ['endTime'],
  })

type FieldErrors = Partial<Record<'title' | 'date' | 'startTime' | 'endTime' | 'ownerIds', string>>

/**
 * The "New event" form (UAC-10) — matches the ADD BY HAND design. Client validation is UX-only;
 * the backend is authoritative (TAC-11). Builds a CreateCalendarEventInput and hands it to onSubmit.
 */
export function NewEventForm({
  members,
  defaultDate,
  submitting,
  errorMessage,
  onCancel,
  onSubmit,
}: {
  members: readonly MemberVM[]
  defaultDate: string
  submitting: boolean
  errorMessage: string | null
  onCancel: () => void
  onSubmit: (input: CreateCalendarEventInput) => void
}) {
  // Only adults the backend marks as capable can be the responsible adult (mirrors server validation).
  const adults = useMemo(
    () => members.filter((m) => m.kind === MemberKindValues.Adult && m.isResponsibleCapable),
    [members]
  )
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate)
  const [startTime, setStartTime] = useState('15:00')
  const [endTime, setEndTime] = useState('15:45')
  const [allDay, setAllDay] = useState(false)
  const [location, setLocation] = useState('')
  const [needsDriver, setNeedsDriver] = useState(false)
  const [ownerIds, setOwnerIds] = useState<string[]>([])
  const [responsibleId, setResponsibleId] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})

  const toggleOwner = (id: string) =>
    setOwnerIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const submit = () => {
    const parsed = schema.safeParse({ title, date, allDay, startTime, endTime, ownerIds })
    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors
        if (key && !next[key]) next[key] = issue.message
      }
      setErrors(next)
      return
    }
    setErrors({})
    onSubmit({
      title: title.trim(),
      date,
      allDay,
      startTime: allDay ? null : startTime,
      endTime: allDay || endTime === '' ? null : endTime,
      ownerMemberIds: ownerIds,
      responsibleMemberId: responsibleId,
      needsDriver,
      location: location.trim() === '' ? null : location.trim(),
    })
  }

  return (
    <View>
      {errorMessage ? (
        <View className="mb-4 rounded-xl border border-error-container bg-error-container px-3.5 py-3 dark:border-error-container-dark dark:bg-error-container-dark" accessibilityRole="alert">
          <Text className="font-body text-sm font-semibold text-on-error-container dark:text-on-error-container-dark">{errorMessage}</Text>
        </View>
      ) : null}

      <FormField label="Title" required value={title} onChangeText={setTitle} error={errors.title} testID="event-title-input" maxLength={200} />

      <View className="flex-row gap-4">
        <View className="flex-1">
          <FormField label="Date" required value={date} onChangeText={setDate} error={errors.date} autoCapitalize="none" testID="event-date-input" />
        </View>
        {!allDay && (
          <>
            <View className="flex-1">
              <FormField label="Start" required value={startTime} onChangeText={setStartTime} error={errors.startTime} autoCapitalize="none" testID="event-start-input" />
            </View>
            <View className="flex-1">
              <FormField label="End" value={endTime} onChangeText={setEndTime} error={errors.endTime} autoCapitalize="none" testID="event-end-input" />
            </View>
          </>
        )}
      </View>

      <ToggleRow label="All-day" value={allDay} onValueChange={setAllDay} />

      <FormField
        label="Location"
        value={location}
        onChangeText={setLocation}
        hint="Optional"
        testID="event-location-input"
        maxLength={255}
      />

      <ChipGroup
        legend="For (owner)"
        error={errors.ownerIds}
        chips={members.map((m) => ({ id: m.id, label: m.displayName, selected: ownerIds.includes(m.id) }))}
        onToggle={toggleOwner}
      />

      <ChipGroup
        legend="Responsible adult"
        chips={[
          ...adults.map((m) => ({ id: m.id, label: m.displayName, selected: responsibleId === m.id })),
          { id: '__none__', label: 'Unassigned', selected: responsibleId === null },
        ]}
        onToggle={(id) => setResponsibleId(id === '__none__' ? null : id)}
      />

      <ToggleRow label="Needs a driver" value={needsDriver} onValueChange={setNeedsDriver} />

      <View className="mt-2 flex-row gap-3">
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          className="min-h-[44px] justify-center rounded-button bg-surface-container px-6 dark:bg-surface-container-dark"
        >
          <Text className="font-body text-sm font-bold text-on-surface-variant dark:text-on-surface-variant-dark">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={submit}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel="Save event"
          className="ml-auto min-h-[44px] justify-center rounded-button bg-primary px-7 dark:bg-primary-dark"
          style={{ opacity: submitting ? 0.6 : 1 }}
        >
          <Text className="font-body text-sm font-bold text-on-primary dark:text-on-primary-dark">{submitting ? 'Saving…' : 'Save event'}</Text>
        </Pressable>
      </View>
    </View>
  )
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string
  value: boolean
  onValueChange: (v: boolean) => void
}) {
  return (
    <View className="mb-4 min-h-[44px] flex-row items-center justify-between rounded-input border border-outline-variant px-4 dark:border-outline-variant-dark">
      <Text className="font-body text-sm font-semibold text-on-surface dark:text-on-surface-dark">{label}</Text>
      <Switch value={value} onValueChange={onValueChange} accessibilityLabel={label} />
    </View>
  )
}

function ChipGroup({
  legend,
  error,
  chips,
  onToggle,
}: {
  legend: string
  error?: string | undefined
  chips: { id: string; label: string; selected: boolean }[]
  onToggle: (id: string) => void
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-body text-[11px] font-bold uppercase tracking-wide text-on-surface-variant dark:text-on-surface-variant-dark">
        {legend}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {chips.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => onToggle(c.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: c.selected }}
            accessibilityLabel={`${legend}: ${c.label}`}
            className="min-h-[36px] justify-center rounded-pill border px-3.5 py-2"
            style={{
              backgroundColor: c.selected ? '#9a4023' : 'transparent',
              borderColor: c.selected ? '#9a4023' : '#dcc1b9',
            }}
          >
            <Text className="font-body text-[13px] font-semibold" style={{ color: c.selected ? '#fff' : '#56423d' }}>
              {c.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {error ? <Text className="mt-1 font-body text-xs text-error dark:text-error-dark">{error}</Text> : null}
    </View>
  )
}
