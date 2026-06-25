import type { Exchange, Operation, OperationResult } from 'urql'
import { makeOperation, createRequest } from 'urql'
import { mergeMap, fromValue, fromPromise, type Source } from 'wonka'
import { getRefreshToken, setAccessToken, setRefreshToken } from '@/shared/auth/token'
import { env } from '@/shared/config/env'

/**
 * UNAUTHORIZED detection (Spring for GraphQL: extensions.classification === 'UNAUTHORIZED').
 * Matches both expired-access-token and credential-validation errors — callers distinguish.
 */
export function isUnauthorizedError(result: OperationResult): boolean {
  return (
    result.error?.graphQLErrors.some((e) => e.extensions?.['classification'] === 'UNAUTHORIZED') ??
    false
  )
}

/** AST-based detection of the RefreshToken mutation — prevents infinite refresh loops (T3). */
export function isRefreshMutation(operation: Operation): boolean {
  return operation.query.definitions.some(
    (d) =>
      d.kind === 'OperationDefinition' &&
      d.operation === 'mutation' &&
      d.name?.value === 'RefreshToken'
  )
}

/** Login/register carry no token → their UNAUTHORIZED is a credential failure, not expiry. */
function hadAuthorizationHeader(operation: Operation): boolean {
  const fetchOpts = operation.context.fetchOptions
  const headers = typeof fetchOpts === 'function' ? fetchOpts().headers : fetchOpts?.headers
  if (!headers) return false
  if (headers instanceof Headers) return headers.has('Authorization')
  if (Array.isArray(headers)) return headers.some(([key]) => key.toLowerCase() === 'authorization')
  return 'Authorization' in headers
}

/** All skip conditions for retry, including the _authRetried loop guard (T3). */
function shouldRetry(result: OperationResult): boolean {
  if (!isUnauthorizedError(result)) return false
  if (isRefreshMutation(result.operation)) return false
  if (!hadAuthorizationHeader(result.operation)) return false
  const context = result.operation.context as Record<string, unknown>
  if (context['_authRetried']) return false
  return true
}

let refreshPromise: Promise<boolean> | null = null

/** Refresh via raw fetch (bypasses URQL so the auth exchange can't intercept → no loop). */
export async function performRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken()
  if (!refreshToken) return false
  try {
    const response = await fetch(env.EXPO_PUBLIC_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation RefreshToken($input: RefreshTokenInput!) {
          refreshToken(input: $input) { accessToken refreshToken }
        }`,
        variables: { input: { refreshToken } },
      }),
    })
    if (!response.ok) return false
    const json = await response.json()
    const data = json.data?.refreshToken
    if (!data?.accessToken || !data?.refreshToken) return false
    await setAccessToken(data.accessToken)
    await setRefreshToken(data.refreshToken)
    return true
  } catch {
    return false
  }
}

/** Coalesce concurrent refreshes into a single network call (exactly one refresh — T3). */
export function refreshOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

/**
 * URQL exchange: on UNAUTHORIZED, refresh once and retry. Mutations hold the stream and
 * emit the retried result; queries reexecute via cache. _authRetried prevents loops (T3).
 */
export function createAuthExchange(onAuthFailure: () => void): Exchange {
  return ({ forward, client }) =>
    (operations$) => {
      const results$ = forward(operations$)

      const mergeMapFn = mergeMap((result: OperationResult) => {
        if (!shouldRetry(result)) return fromValue(result)

        const isMutation = result.operation.kind === 'mutation'

        if (isMutation) {
          return fromPromise(
            refreshOnce().then(async (success) => {
              if (!success) {
                onAuthFailure()
                return result
              }
              const retryOperation = makeOperation(result.operation.kind, result.operation, {
                ...result.operation.context,
                _authRetried: true,
              })
              const request = createRequest(retryOperation.query, retryOperation.variables ?? {})
              return await client
                .executeMutation(request, { ...retryOperation.context })
                .toPromise()
            })
          )
        }

        refreshOnce().then((success) => {
          if (!success) {
            onAuthFailure()
            return
          }
          const retryOperation = makeOperation(result.operation.kind, result.operation, {
            ...result.operation.context,
            _authRetried: true,
          })
          client.reexecuteOperation(retryOperation)
        })

        return fromValue(result)
      })

      return mergeMapFn(results$) as Source<OperationResult>
    }
}
