import { render, screen, fireEvent } from '@testing-library/react-native'
import { NewEventForm } from './NewEventForm'
import type { MemberVM } from '@/features/calendar/types'

const members: MemberVM[] = [
  { id: 'a1', displayName: 'Pallavi', initial: 'P', colorHex: '#C4603D', kind: 'ADULT', role: 'ADMIN', isResponsibleCapable: true, ageLabel: null },
  { id: 'm1', displayName: 'Maya', initial: 'M', colorHex: '#B6843C', kind: 'CHILD', role: 'NONE', isResponsibleCapable: false, ageLabel: '8' },
] as MemberVM[]

function setup() {
  const onSubmit = jest.fn()
  const onCancel = jest.fn()
  render(
    <NewEventForm
      members={members}
      defaultDate="2026-06-25"
      submitting={false}
      errorMessage={null}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  )
  return { onSubmit, onCancel }
}

describe('NewEventForm', () => {
  it('blocks submit and shows errors when required fields are missing', () => {
    const { onSubmit } = setup()
    fireEvent.press(screen.getByLabelText('Save event'))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText('Title is required.')).toBeTruthy()
    expect(screen.getByText('Pick at least one owner.')).toBeTruthy()
  })

  it('submits a valid event input', () => {
    const { onSubmit } = setup()
    fireEvent.changeText(screen.getByLabelText('Title'), 'Dentist — Maya')
    fireEvent.press(screen.getByLabelText('For (owner): Maya'))
    fireEvent.press(screen.getByLabelText('Save event'))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Dentist — Maya',
        date: '2026-06-25',
        ownerMemberIds: ['m1'],
        allDay: false,
      })
    )
  })
})
