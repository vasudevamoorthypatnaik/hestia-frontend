/**
 * Client-side JWT payload decoder. Extracts the user ID from the `sub` claim WITHOUT
 * validating the signature — the backend (GraphQLAuthInterceptor) is authoritative.
 * Used only for client-side auth-state checks.
 */
export function decodeUserId(token: string): string | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]!
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const parsed = JSON.parse(decoded) as { sub?: string }
    return parsed.sub ?? null
  } catch {
    return null
  }
}
