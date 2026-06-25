import { graphql, HttpResponse } from 'msw'

/** Mock auth user for tests/dev (gated by EXPO_PUBLIC_USE_MOCKS for the browser worker, T13). */
const MOCK_USER = { email: 'test@hestia.app', password: 'password123' }

export const handlers = [
  graphql.mutation('Login', ({ variables }) => {
    const input = (variables as { input?: { email?: string; password?: string } }).input ?? {}
    if (input.email === MOCK_USER.email && input.password === MOCK_USER.password) {
      return HttpResponse.json({
        data: {
          login: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            preferredLanguage: 'en',
          },
        },
      })
    }
    // Generic UNAUTHORIZED — enumeration-safe (T2)
    return HttpResponse.json({
      data: { login: null },
      errors: [
        { message: 'Invalid credentials', extensions: { classification: 'UNAUTHORIZED' } },
      ],
    })
  }),
  graphql.mutation('RefreshToken', () =>
    HttpResponse.json({
      data: { refreshToken: { accessToken: 'mock-access-2', refreshToken: 'mock-refresh-2' } },
    })
  ),
  graphql.mutation('Logout', () => HttpResponse.json({ data: { logout: { success: true } } })),
]
