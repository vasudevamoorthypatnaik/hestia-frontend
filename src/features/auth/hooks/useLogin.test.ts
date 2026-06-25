import { renderHook, act } from '@testing-library/react-native'
import { useLogin } from './useLogin'

const mockLoginMutation = jest.fn()
jest.mock('@/__generated__/graphql', () => ({
  useLoginMutation: () => [{}, mockLoginMutation],
}))

const mockSetTokens = jest.fn()
jest.mock('@/shared/auth/token', () => ({
  setTokens: (...args: unknown[]) => mockSetTokens(...args),
}))

const mockSafeReplace = jest.fn()
jest.mock('@/shared/utils/safeNavigate', () => ({
  safeReplace: (...args: unknown[]) => mockSafeReplace(...args),
}))

describe('useLogin', () => {
  beforeEach(() => jest.clearAllMocks())

  it('blocks submit and surfaces field errors on invalid input (no mutation sent)', async () => {
    const { result } = renderHook(() => useLogin())
    let sent = true
    await act(async () => {
      sent = await result.current.onSubmit()
    })
    expect(sent).toBe(false)
    expect(mockLoginMutation).not.toHaveBeenCalled()
    expect(result.current.formErrors.email).toBeTruthy()
  })

  it('persists tokens and redirects on success', async () => {
    mockLoginMutation.mockResolvedValue({
      data: { login: { accessToken: 'a', refreshToken: 'r', preferredLanguage: 'en' } },
    })
    const { result } = renderHook(() => useLogin())
    act(() => result.current.onChange('email', 'test@hestia.app'))
    act(() => result.current.onChange('password', 'password123'))
    await act(async () => {
      await result.current.onSubmit()
    })
    expect(mockSetTokens).toHaveBeenCalledWith('a', 'r')
    expect(mockSafeReplace).toHaveBeenCalled()
  })

  it('shows a generic, enumeration-safe error on auth failure (no tokens persisted)', async () => {
    mockLoginMutation.mockResolvedValue({ error: { graphQLErrors: [] } })
    const { result } = renderHook(() => useLogin())
    act(() => result.current.onChange('email', 'test@hestia.app'))
    act(() => result.current.onChange('password', 'wrong'))
    await act(async () => {
      await result.current.onSubmit()
    })
    expect(result.current.globalError).toBe('Invalid email or password. Please try again.')
    expect(mockSetTokens).not.toHaveBeenCalled()
    expect(mockSafeReplace).not.toHaveBeenCalled()
  })

  it('shows a connectivity error (not "wrong password") on a network failure', async () => {
    mockLoginMutation.mockResolvedValue({ error: { networkError: new Error('Failed to fetch') } })
    const { result } = renderHook(() => useLogin())
    act(() => result.current.onChange('email', 'test@hestia.app'))
    act(() => result.current.onChange('password', 'password123'))
    await act(async () => {
      await result.current.onSubmit()
    })
    expect(result.current.globalError).toMatch(/connection/i)
    expect(mockSafeReplace).not.toHaveBeenCalled()
  })

  it('does not navigate when the response has no error but no login payload', async () => {
    mockLoginMutation.mockResolvedValue({ data: { login: null } })
    const { result } = renderHook(() => useLogin())
    act(() => result.current.onChange('email', 'test@hestia.app'))
    act(() => result.current.onChange('password', 'password123'))
    await act(async () => {
      await result.current.onSubmit()
    })
    expect(mockSetTokens).not.toHaveBeenCalled()
    expect(mockSafeReplace).not.toHaveBeenCalled()
    expect(result.current.globalError).toBe('Invalid email or password. Please try again.')
  })
})
