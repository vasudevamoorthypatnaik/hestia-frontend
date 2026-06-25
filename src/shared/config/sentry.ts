import { env } from './env'

/**
 * Sentry initialization — no-op safe.
 * If EXPO_PUBLIC_SENTRY_DSN is absent (this iteration), this is a no-op so the
 * app boots cleanly without a DSN. Wire the real SDK in the DEV/prod hardening pass.
 * NEVER include access/refresh tokens in any breadcrumb or event (T4).
 */
export function initSentry(): void {
  if (!env.EXPO_PUBLIC_SENTRY_DSN) {
    return
  }
  // Intentionally not wired this iteration (no DSN). Placeholder for follow-up.
}
