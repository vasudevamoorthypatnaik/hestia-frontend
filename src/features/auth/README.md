# Auth Feature (HES-SETUP)

Email/password login for hestia-frontend, styled per the Phase 1 `signin` design. Bootstrapped
as the first feature of the app; mirrors the proven patterns in the sibling `invite-frontend`
(identical stack).

## Scope (this iteration)
- **Functional:** email/password login → token persistence → redirect to the auth-gated
  household home stub (`/`).
- **Inert (visual-only, U7/T14):** Google / Apple buttons render per design but are
  non-interactive. Real OAuth is a follow-up.
- **Stubs:** register + forgot-password screens are navigable placeholders.

## Files
| Path | Role |
|------|------|
| `screens/LoginScreen.tsx` | Split-panel login (terracotta brand + form); inert social; theme toggle |
| `screens/RegisterScreen.tsx`, `ForgotPasswordScreen.tsx` | Navigable stubs |
| `components/EmailLoginForm.tsx` | Email/password form, inline generic error, pending Sign-in |
| `hooks/useLogin.ts` | Validate → `login` mutation → persist tokens → redirect; double-submit guard |
| `hooks/useAuthToken.ts` | Reactive token state (`useSyncExternalStore`) + cold-start hydration |
| `api/mutations.graphql` | `Login` / `RegisterUser` / `RefreshToken` / `Logout` (codegen source) |
| `types.ts` | Form types + `validateLoginForm` |

Routes: `app/auth/login.tsx` (`/auth/login`), `register.tsx`, `forgot-password.tsx`;
auth gate + home at `app/(tabs)/_layout.tsx` + `app/(tabs)/index.tsx`.

## Key decisions
- **Errors are generic + inline (T2/T8):** all credential failures show one
  "Invalid email or password" banner — enumeration-safe, never `Alert.alert` (no-op on web).
- **Tokens:** SecureStore (native) / localStorage (web) via `@/shared/auth/token` (T5); a
  pub-sub (`subscribeToTokenChanges`) drives reactive auth state (T15 mechanism).
- **Refresh:** `@/shared/graphql/authExchange` performs exactly one refresh on UNAUTHORIZED
  with an AST-based loop guard (T3).
- **Cold-start (AG3):** the auth gate awaits async token hydration before redirecting, so a
  logged-in user isn't falsely bounced on native cold start.
- **Backend target (interim):** codegen + login run against the running backend at
  `EXPO_PUBLIC_API_URL` (currently `:8080`, identical auth schema). Building hestia-backend's
  own auth (path A) is the parallel/follow-up track.

## Verification
- `npm run codegen` ✅ (auth schema, T7) · `npm run typecheck` ✅ · `npm run lint` ✅
- `npm run build:web` ✅ (820 modules) · live render matches Phase 1 design
- Unit: `src/features/auth/{types,hooks/useLogin}.test.ts` — 7 tests (validation, success,
  enumeration-safe failure)

## Follow-ups
- Real Google/Apple OAuth (useGoogleSignIn/useAppleSignIn).
- hestia-backend auth (login/register/refresh + users table) — path A.
- Login Playwright E2E against local (EX-36) once a seeded test user exists.
- Native font bundling (Newsreader/Hanken `.ttf`); AlertModal (Reanimated) if modal alerts needed.

## HES-REDESIGN — Warm Hearth reskin
- **Fonts:** Quicksand (headlines, `font-head`) + Be Vietnam Pro (body, `font-body`); legacy
  `font-display`/`font-sans` remapped to them. Web fonts via `app/+html.tsx` Google Fonts link;
  native via `useFonts` (splash still gates on fonts only).
- **Login:** split-panel — web/desktop hero (photo `assets/images/login-hero.jpg` + terracotta
  gradient overlay + Hestia mark + tagline + 2 feature bullets) left, form right; mobile centered
  card. `EmailLoginForm` adds leading mail/lock icons (`@expo/vector-icons` MaterialIcons) + a
  password show/hide toggle (`testID="login-password-toggle"`).
- **CTA rename (string-rename contract):** the primary CTA visible text + accessibilityLabel are
  now **"Enter the Hearth"** (was "Sign in"); `testID="login-submit"` preserved. E2E specs
  (`auth-login.spec.ts`, `calendar.spec.ts` login helper) updated in lockstep.
- **Register / Forgot:** reskinned navigable placeholders (web Register = gradient hero split-panel).
  Functional registration/reset remain out of scope (A5) — these screens render NO credential
  inputs and NO submit (zero attack surface, asserted in `RegisterScreen.test.tsx`).
- **Dark mode:** light-first + coherent dark variant; primary CTA keeps a terracotta fill in dark.
- **Tests:** `FormField.test.tsx` (icon + show/hide), `LoginScreen.test.tsx` (hero + CTA + inert
  social), `RegisterScreen.test.tsx` (no credential surface).
