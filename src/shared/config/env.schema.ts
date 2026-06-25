import { z } from 'zod'

// Environment variable schema (validated at boot — fail fast on misconfig).
export const envSchema = z.object({
  // API
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_API_TIMEOUT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .optional()
    .default('30000'),

  // App environment
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),

  // Mocks (web prod must stay false — MSW disabled in prod bundle, T13)
  EXPO_PUBLIC_USE_MOCKS: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional()
    .default('false'),

  // Social OAuth (present-but-inert this iteration — all optional, U7/T14)
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: z.string().optional(),
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: z.string().optional(),
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: z.string().optional(),
  EXPO_PUBLIC_APPLE_SERVICE_ID: z.string().optional(),
  EXPO_PUBLIC_APPLE_REDIRECT_URI: z.string().optional(),

  // Sentry (optional — empty/absent = disabled, no-op)
  EXPO_PUBLIC_SENTRY_DSN: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.string().url().optional()),
})

export type Env = z.infer<typeof envSchema>
