import { render, screen, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { FormField } from './FormField'

describe('FormField (Warm Hearth)', () => {
  it('renders the label and a leading icon when provided', () => {
    render(
      <FormField
        label="Email"
        leadingIcon={<Text testID="leading-icon">icon</Text>}
        value=""
        onChangeText={() => {}}
      />
    )
    expect(screen.getByText('Email')).toBeTruthy()
    expect(screen.getByTestId('leading-icon')).toBeTruthy()
  })

  it('starts masked and toggles password visibility via the secure toggle', () => {
    render(
      <FormField
        label="Password"
        secureTextEntry
        secureToggle
        secureToggleTestID="login-password-toggle"
        value="secret"
        onChangeText={() => {}}
      />
    )
    const input = screen.getByLabelText('Password')
    // Masked by default.
    expect(input.props.secureTextEntry).toBe(true)
    expect(screen.getByLabelText('Show password')).toBeTruthy()

    // Press the toggle → revealed.
    fireEvent.press(screen.getByTestId('login-password-toggle'))
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false)
    expect(screen.getByLabelText('Hide password')).toBeTruthy()
  })

  it('shows an error message when error is set', () => {
    render(<FormField label="Email" error="Email is required" value="" onChangeText={() => {}} />)
    expect(screen.getByText('Email is required')).toBeTruthy()
  })
})
