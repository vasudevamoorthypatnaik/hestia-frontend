import { render, screen } from '@testing-library/react-native'
import { LoginScreen } from './LoginScreen'

// Stable, non-interactive login state for rendering.
jest.mock('../hooks/useLogin', () => ({
  useLogin: () => ({
    values: { email: '', password: '' },
    formErrors: {},
    isLoading: false,
    globalError: null,
    onChange: jest.fn(),
    onSubmit: jest.fn(),
  }),
}))

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}))

jest.mock('@/shared/components/ThemeToggle', () => ({ ThemeToggle: () => null }))

describe('LoginScreen (Warm Hearth)', () => {
  it('renders the brand hero, welcome copy, and the Enter the Hearth CTA', () => {
    render(<LoginScreen />)
    // Hero (web split-panel) renders with its photo + tagline.
    expect(screen.getByLabelText('A warm family kitchen hearth')).toBeTruthy()
    expect(screen.getByText("Keep the hearth glowing, even when you're apart.")).toBeTruthy()
    expect(screen.getByText('Welcome Home')).toBeTruthy()
    // Renamed CTA (string-rename contract).
    expect(screen.getByLabelText('Enter the Hearth')).toBeTruthy()
  })

  it('renders inert Google and Apple social buttons with a "soon" badge', () => {
    render(<LoginScreen />)
    expect(screen.getByText('Google')).toBeTruthy()
    expect(screen.getByText('Apple')).toBeTruthy()
    expect(screen.getAllByText('soon').length).toBeGreaterThan(0)
  })

  it('exposes the email + password fields and the create-household link', () => {
    render(<LoginScreen />)
    expect(screen.getByTestId('login-email-input')).toBeTruthy()
    expect(screen.getByTestId('login-password-input')).toBeTruthy()
    expect(screen.getByTestId('register-link')).toBeTruthy()
  })
})
