import { useCallback, useState } from 'react'
import {
  useCreateCalendarEventMutation,
  type CreateCalendarEventInput,
} from '@/__generated__/graphql'

interface UseCreateCalendarEventResult {
  create: (input: CreateCalendarEventInput) => Promise<boolean>
  submitting: boolean
  error: string | null
}

/**
 * Wraps the createCalendarEvent mutation. Returns true on success. All real validation runs
 * server-side (TAC-11); this just surfaces the outcome to the form.
 */
export function useCreateCalendarEvent(): UseCreateCalendarEventResult {
  const [{ fetching }, executeMutation] = useCreateCalendarEventMutation()
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async (input: CreateCalendarEventInput): Promise<boolean> => {
      setError(null)
      const result = await executeMutation({ input })
      if (result.error) {
        setError(result.error.graphQLErrors[0]?.message ?? 'Could not create the event.')
        return false
      }
      return !!result.data?.createCalendarEvent.event
    },
    [executeMutation]
  )

  return { create, submitting: fetching, error }
}
