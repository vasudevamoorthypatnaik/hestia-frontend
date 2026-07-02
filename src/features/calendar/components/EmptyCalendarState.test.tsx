import { render, screen, fireEvent } from '@testing-library/react-native'
import { EmptyCalendarState } from './EmptyCalendarState'

describe('EmptyCalendarState', () => {
  it('shows the friendly empty-state hint (AC6)', () => {
    render(<EmptyCalendarState onAddEvent={jest.fn()} />)
    expect(screen.getByText('Nothing scheduled yet')).toBeTruthy()
  })

  it('renders an accessible "add your first event" affordance (AC6)', () => {
    render(<EmptyCalendarState onAddEvent={jest.fn()} />)
    const button = screen.getByLabelText('Add your first event')
    expect(button).toBeTruthy()
    expect(button.props.accessibilityRole).toBe('button')
  })

  it('invokes onAddEvent when the affordance is pressed (AC6)', () => {
    const onAddEvent = jest.fn()
    render(<EmptyCalendarState onAddEvent={onAddEvent} />)
    fireEvent.press(screen.getByLabelText('Add your first event'))
    expect(onAddEvent).toHaveBeenCalledTimes(1)
  })
})
