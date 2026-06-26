import { render, screen } from '@testing-library/react-native'
import { RegisterScreen } from './RegisterScreen'

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}))

jest.mock('@/shared/components/ThemeToggle', () => ({ ThemeToggle: () => null }))

describe('RegisterScreen (Warm Hearth placeholder)', () => {
  it('renders the reskinned create-household shell with coming-soon copy', () => {
    render(<RegisterScreen />)
    expect(screen.getByText('Create your household')).toBeTruthy()
    expect(screen.getByText('Registration is coming soon')).toBeTruthy()
    expect(screen.getByLabelText('Back to sign in')).toBeTruthy()
  })

  it('exposes NO credential inputs and NO submit (zero attack surface — A5)', () => {
    render(<RegisterScreen />)
    // No text inputs at all on the placeholder.
    expect(screen.queryByTestId('register-email-input')).toBeNull()
    expect(screen.queryByLabelText('Password')).toBeNull()
    expect(screen.queryByLabelText('Email')).toBeNull()
    // No create/submit button.
    expect(screen.queryByLabelText('Create account')).toBeNull()
  })
})
