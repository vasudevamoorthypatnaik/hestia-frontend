import { env } from './env'

/**
 * Sentry — no-op safe (HES-SETUP). If EXPO_PUBLIC_SENTRY_DSN is absent (this iteration),
 * init + capture are no-ops so the app boots cleanly without a DSN. Wire the real SDK in
 * the DEV/prod hardening pass. NEVER include access/refresh tokens in any breadcrumb/event (T4).
 */
export function initSentry(): void {
  if (!env.EXPO_PUBLIC_SENTRY_DSN) return
  // Not wired this iteration (no DSN). Placeholder for follow-up.
}

/** Capture an error to Sentry. No-op until a DSN is configured. Never pass token values (T4). */
export function captureError(error: unknown): void {
  if (!env.EXPO_PUBLIC_SENTRY_DSN) return
  void error
}
