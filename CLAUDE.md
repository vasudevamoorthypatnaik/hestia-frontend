# Claude Code Instructions for Hestia Frontend

> **NON-NEGOTIABLE — ALL Code Changes Use /c_feature Pipeline:** Every code change request — even a one-line fix — MUST use the `/c_feature` pipeline approach. No exceptions, no shortcuts. Plan → Execute → Review → E2E Prep → Local E2E → PR + Deploy → DEV AWS E2E → Learnings → Linear Closure. Output the PIPELINE STATUS tracker before writing any code.

> **NON-NEGOTIABLE — No Assumptions When Debugging — Confirm Facts First:** When debugging an issue, NEVER assume the state of any system. Before proposing a solution, you MUST confirm the actual state from evidence. Two modes apply depending on access:
>
> - **Systems you CAN access** (logs, Docker containers, config files, database, code, git history, CLI tools): **Check the logs and confirm the facts yourself** before proposing a solution. Run `docker logs`, `git log`, `cat` config files, query the database, read error output — whatever it takes to confirm the actual state. Do NOT skip this step because you think you know the answer. Past experience: multiple debugging cycles were wasted because solutions were proposed based on assumptions that turned out to be wrong after checking the logs.
> - **Systems you CANNOT access** (AWS Console, Terraform Cloud, App Store Connect, Google Play Console, DNS registrar, email provider dashboards, third-party service dashboards): **Interview the user** — ask specific, targeted questions about what they see. Ask one thing at a time. Wait for their response before proceeding. Do NOT dump a list of 10 things to check.
> - In BOTH cases: (1) **State what you know vs. what you're assuming** — clearly separate confirmed facts from hypotheses. (2) **Do NOT guess** — never say "it's probably X" without evidence. (3) **Propose solutions ONLY after facts are confirmed** — either by you (from logs/tools) or by the user (from external dashboards). **The cost of a wrong assumption is a wasted debugging cycle. The cost of checking logs or asking is one minute.**

> **Working Agreement — read before starting any task:**
>
> 1. **Tests are part of the task.** Before marking any task complete, write the corresponding tests following `.cursor/rules/04_frontend-testing-strategy.mdc`. Unit/integration tests (Jest + RTL) for logic and UI; Playwright E2E for any user-visible change. Tests must pass before the task is considered done.
> 2. **Feature documentation is part of the task.** When making changes to a feature:
>    - **Read** `src/features/[feature-name]/README.md` first to understand context
>    - **Update** the README with changes made (what, why, use cases)
>    - **Document** bug fixes, improvements, and architecture decisions
>    - Feature READMEs provide cross-session context and institutional knowledge
> 3. **Continuous doc improvement — autonomous.** While working on a task, if you discover a concept, pattern, or strategy (in development, testing, or requirements) that could improve project quality:
>    - **Identify** the right governance file in `.cursor/rules/` or create a new `.mdc` file if none fits
>    - **Add the learning directly** — do NOT ask for permission. Choose files judiciously based on the topic.
>    - **Include** governance updates in the same commit/PR as the feature implementation (keeps learning and code together)
>    - The `.cursor/rules/` directory is the correct location for `.mdc` governance files.
> 4. **Proactive code review before commits.** Before creating any commit:
>    - **Claude proactively runs code review** by invoking Task tool with feature-dev:code-reviewer agent
>    - **Review scope:** All staged changes (or all uncommitted changes if nothing staged)
>    - **Review focus:** Bugs, logic errors, security issues, governance compliance, test coverage
>    - **If issues found:** Report issues grouped by severity, then ask user: "Fix these issues using Ralph Loop?"
>    - **If no issues or after fixes:** Proceed with commit creation
>    - **Implementation:** Claude invokes `Task(subagent_type: "feature-dev:code-reviewer")` before creating commits
>    - **User experience:** Review happens proactively as part of commit workflow, user doesn't need to request it

This is the **frontend repository** of the Hestia project - a cross-platform event RSVP application.

**Repository Context:**

- **This repo (frontend):** `/Users/vasu/workspaces/hestia/hestia-frontend`
- **Backend repo:** `/Users/vasu/workspaces/hestia/hestia-backend`

---

## Git Hooks & Commit Workflow (MANDATORY)

**This repository uses Git hooks to enforce quality gates and provide task reminders. Claude MUST honor these hooks.**

### Hook Setup

Git hooks are located in `.githooks/` and automatically active via `git config core.hooksPath .githooks`. No manual setup needed for new clones.

### Pre-Commit Hook (SELF-GOVERNANCE CHECK)

**Automatically runs before every commit:**

- 📋 **Governance documentation reminder** (from `.githooks/pre-commit-governance-check`)
- ✅ **TypeScript type checking** (ensures no type errors)
- ✅ **ESLint checks** (code quality and consistency)

**What the pre-commit hook asks:**

```
🔍 Governance & Documentation Check:

📋 Governance Updates (.cursor/rules/*.mdc):
   - Have you identified learnings that should become patterns?
   - Have you documented new conventions or architecture decisions?

💡 Note: Feature README updates are handled in post-commit hook.
```

**Claude's MANDATORY actions before committing:**

1. **Review your changes for learnings:**
   - Did you discover a new React Native pattern that should be documented?
   - Did you make a UX decision that affects future features?
   - Did you solve a cross-platform compatibility issue others should know about?
   - Did you find a GraphQL/URQL pattern that improves code quality?

2. **If YES to any of the above:**
   - **Identify** the right `.mdc` file in `.cursor/rules/` (or create a new one if none fits)
   - **Add the learning directly** — no need to ask for permission
   - **Commit** the governance update in the same commit as the feature code

3. **If NO learnings:**
   - Proceed with commit
   - The reminder has done its job

**Why this matters:**

- Governance documents evolve organically from real development work
- Frontend-specific patterns (RN, Expo, cross-platform) are captured when fresh
- Future Claude sessions benefit from documented learnings
- Self-governing means Claude takes responsibility for identifying when rules should be added

**Example scenario:**

```
Claude: "I discovered that wrapping URQL mutations in useCallback prevents
unnecessary re-renders in React Native. Should I add this to
06_graphql-integration.mdc under 'Performance Patterns'?"

User: "Yes, that's helpful"

Claude: *Updates governance file, then commits with both the component
and the governance update in the same commit*
```

### Post-Commit Hook (CRITICAL - CLAUDE MUST FOLLOW)

**After EVERY commit, the post-commit hook displays a task checklist. Claude MUST complete ALL tasks before considering work done:**

#### 1. 📝 Update Linear Ticket (MANDATORY)

- **What:** Add a comment to the relevant Linear ticket (e.g., INV-20)
- **How:** Use Linear MCP `create_comment` tool
- **Include:**
  - Commit hash (short form)
  - Summary of changes
  - Files/components modified
  - Links to PR if applicable

**Example:**

```
**Frontend: RSVP UI fixes** (commit `xyz789`)

Fixed rendering issues in invitation view:
- Updated Email scalar handling in HostInfoCard
- Fixed RsvpStatus enum usage in action buttons

Components: HostInfoCard.tsx, RsvpActionButtons.tsx
PR: https://github.com/user/repo/pull/17
```

#### 2. 🔀 Check PR Mergeability (MANDATORY if PR exists)

- **What:** Verify PR can be merged
- **How:** Run `gh pr view --json mergeable,mergeStateStatus`
- **Action:**
  - If `MERGEABLE`: ✅ Note in response
  - If conflicts: Resolve them immediately
  - If review comments: Address them

#### 3. 🧪 Verify Tests (MANDATORY)

- **What:** Ensure tests pass for the commit
- **How:**
  - Unit/integration: `npm test` (Jest + RTL)
  - Type checking: `npm run type-check`
  - Linting: `npm run lint`
  - E2E (if needed): `npm run test:e2e`
- **Action:**
  - If tests fail due to your changes: Fix immediately
  - If tests fail due to pre-existing issues: Document which failures are pre-existing vs new
  - Never leave broken tests without explaining the cause

#### 4. 📚 Feature README Updates (MANDATORY if feature code changed)

- **What:** Update feature README.md files with changes
- **Where:**
  - `src/features/[feature-name]/README.md`
  - Example: `src/features/invitation/README.md`, `src/features/rsvp/README.md`
- **Include:**
  - Feature changes (what/why)
  - Component changes (new components, modified props)
  - GraphQL query/mutation changes
  - UX/accessibility improvements
  - Bug fixes and learnings

**IMPORTANT:** The post-commit hook output is NOT optional. Claude must explicitly address each task in the conversation, showing what was done or why it was skipped.

### Enforcement

**Why this matters:**

- Linear tickets stay updated with progress (important for team coordination)
- PRs don't get stuck in unmergeable states
- Test failures are caught and addressed immediately
- Feature documentation stays current across sessions

**How Claude should handle it:**

1. Commit is made → post-commit hook displays checklist
2. Claude **immediately** works through each task in order
3. Claude **explicitly reports** completion of each task to the user
4. Only after all tasks are complete should Claude consider the work done

**If Claude skips these tasks:**

- User has to manually do them (defeats the purpose of automation)
- Context is lost for future sessions
- PRs become harder to review and merge

---

## Governance Documents

This project has **16 comprehensive governance documents** that define all development standards, patterns, and conventions. These are located in `.cursor/rules/` and must be followed for all development work.

**IMPORTANT:** Before making significant changes, consult the relevant governance documents below:

1. **01_decision-making.mdc** - When to ask the user vs. making autonomous decisions
2. **02_development_governance.mdc** - Core development philosophy, technology stack (LOCKED), and non-negotiable patterns
3. **03_frontend-architecture-spa-s3-cloudfront.mdc** - Frontend architecture and deployment strategy
4. **04_frontend-testing-strategy.mdc** - Testing requirements and patterns (Jest, React Testing Library, Playwright)
5. **05_technology-stack.mdc** - Technology choices and rationale (React Native, Expo, TypeScript, URQL, NativeWind)
6. **06_graphql-integration.mdc** - GraphQL patterns, code generation, and URQL usage
7. **07_environment-configuration.mdc** - Environment variables, configuration management
8. **08_mobile-deployment.mdc** - Mobile build and deployment processes
9. **09_authentication-security.mdc** - Authentication patterns and security requirements
10. **10_cross-platform-patterns.mdc** - Cross-platform development patterns (iOS, Android, Web)
11. **11_naming-conventions-complete.mdc** - File naming, component naming, all naming standards
12. **12_accessibility-standards.mdc** - WCAG 2.1 Level AA accessibility requirements
13. **13_error-handling-patterns.mdc** - Error handling, user feedback, and resilience patterns
14. **14_ci-cd-requirements.mdc** - CI/CD pipeline requirements and automation
15. **15_native-e2e-integration.mdc** - Native E2E test integration patterns
16. **16_ai-implementation-governance.mdc** - AI-assisted implementation governance: search-before-create, no duplicate logic, architecture boundary preservation, security review, meaningful tests

---

## Feature Documentation (Cross-Session Context)

Each feature folder contains a **README.md** file that serves as living documentation and cross-session memory. These READMEs are critical for understanding feature history, requirements, and implementation decisions.

**When working on a feature, ALWAYS:**

1. **Read the feature README first** - `src/features/[feature-name]/README.md`
   - Understand requirements, use cases, and architecture decisions
   - Review bug fixes and improvements from previous sessions
   - Check backend integration status and TODOs

2. **Update the feature README when making changes:**
   - Document WHAT changed (files, components, behavior)
   - Document WHY changes were made (rationale, problem solved)
   - Document use cases supported or added
   - Add to "Bug Fixes & Improvements" section with commit references
   - Update requirements, architecture, or file structure if needed

3. **Feature READMEs provide:**
   - Requirements and user flows
   - Architecture diagrams and patterns
   - File structure and component responsibilities
   - Validation rules and constraints
   - Test coverage details
   - Bug fixes with root cause analysis
   - Backend integration TODOs
   - Historical context for future sessions

**Example Feature READMEs:**

- `src/features/event/README.md` - Event creation, invitations, image upload

**Why this matters:**

- Enables cross-session context without digging through git history
- Documents "why" decisions, not just "what" code
- Helps future Claude sessions understand feature evolution
- Creates institutional knowledge for the project

**Pre-commit reminder:** The `.husky/pre-commit-governance-check` hook reminds you to update feature READMEs before committing.

---

## Critical Rules Summary

### Technology Stack (LOCKED - Do Not Change)

**Core Stack:**

- React Native with Expo 52 (single codebase for iOS, Android, Web)
- TypeScript with strict mode + `exactOptionalPropertyTypes`
- NativeWind v4 for styling (Tailwind CSS for React Native)
- URQL for GraphQL (with document caching strategy)
- Expo Router for file-based routing
- React Hook Form + Zod for form validation
- Jest + React Testing Library for unit/integration tests
- Playwright for E2E tests

**File Organization:**

```
src/
├── features/          # Feature-based modules
│   └── [feature-name]/
│       ├── api/       # GraphQL queries/mutations
│       ├── components/ # Feature-specific components
│       ├── hooks/     # Feature-specific hooks
│       ├── screens/   # Screen components
│       └── types.ts   # Feature types
├── shared/            # Shared/reusable code
│   ├── components/    # Shared UI components
│   ├── hooks/         # Shared hooks
│   ├── graphql/       # GraphQL client setup
│   └── utils/         # Utility functions
└── __generated__/     # Auto-generated GraphQL types
```

### Development Philosophy

1. **User Experience First** - Excellent UX over technical cleverness
2. **Explicit Over Implicit** - Predictable, readable code over abstractions
3. **Mobile-First** - Design for mobile, enhance for desktop
4. **Accessibility Required** - WCAG 2.1 Level AA compliance is mandatory
5. **Ask, Don't Guess** - When there's ambiguity, ask the user instead of guessing

### Code Patterns (Non-Negotiable)

**TypeScript:**

- Always use strict mode with `exactOptionalPropertyTypes: true`
- Use path aliases: `@/shared/*`, `@/features/*`
- Never use `any` type without explicit justification

**GraphQL:**

- Define all queries/mutations in `.graphql` files
- Run `npm run codegen` to generate TypeScript types
- Use generated hooks from `@/__generated__/graphql`
- Never manually write GraphQL types

**Styling:**

- Use NativeWind (Tailwind) for all styling
- No inline StyleSheet.create() unless platform-specific
- Mobile-first responsive design (use `md:` and `lg:` breakpoints)

**Components:**

- Functional components only (no class components)
- Use TypeScript interfaces for props
- Include accessibility props: `accessibilityRole`, `accessibilityLabel`
- Minimum touch target: 44x44pt (use `min-h-[44px]`)

**Error Handling:**

- All async operations must have error handling
- Use ErrorBoundary for component-level errors
- Display user-friendly error messages (not raw error text)
- Log errors for debugging but show clean UI to users

**Testing:**

- Unit/integration tests with Jest + React Testing Library
- E2E tests with Playwright for critical flows
- Test user interactions, not implementation details
- Mock GraphQL with MSW (Mock Service Worker)
- **MANDATORY: Any UI change requires a Playwright E2E test before marking task complete**

### Decision-Making Rules

**When to ask the user:**

- Ambiguous requirements or multiple valid approaches
- Architectural decisions that affect multiple features
- Changes to locked technology stack
- Security or authentication patterns
- Changes that impact cross-platform behavior

**When to proceed autonomously:**

- Bug fixes with clear root cause
- Adding tests for existing code
- Refactoring that doesn't change behavior
- Documentation updates
- Code formatting and linting fixes

---

## Common Operations

### Git Worktree & Branch Management (NON-NEGOTIABLE)

> **ALL changes MUST be done in a git worktree on a feature branch — NEVER commit directly to `main`.**
> After a PR is merged, the worktree and local branch MUST be deleted immediately.

`main` is protected. All changes go through PRs from feature branches in worktrees.

```bash
# 1. Clean up old worktrees/branches first
/clean_gone                              # Automated cleanup of [gone] branches
git worktree list                        # Check existing worktrees

# 2. Create worktree for new work
git worktree add .claude/worktrees/inv-XX-feature -b claude/inv-XX-feature
cd .claude/worktrees/inv-XX-feature
cp ../.env .env  # Copy environment variables
npm install      # Install dependencies

# 3. After PR is merged — MANDATORY cleanup
git worktree remove .claude/worktrees/inv-XX-feature
git branch -d claude/inv-XX-feature
```

**Worktree Strategy:**

- Keep 1-2 reusable worktrees (e.g., `.claude/worktrees/epic-hertz`) for sequential work
- Create new worktrees only for parallel development
- **Always clean up after PRs are merged — do not accumulate stale worktrees**

**See**: `.cursor/rules/02_development_governance.mdc`, Section 3 for full details.

---

### GraphQL Development

```bash
# After editing .graphql files, regenerate types
npm run codegen

# Watch mode during development
npm run codegen:watch
```

### Testing

```bash
# Unit/integration tests
npm test
npm test -- --watch
npm run test:coverage

# E2E tests
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
```

### Development

```bash
# Start dev server (all platforms)
npm start

# Web only
npm run web

# Run on iOS/Android
npm run ios
npm run android
```

### Code Quality

```bash
# Lint
npm run lint
npm run lint:fix

# Type check
npm run typecheck

# Format
npm run format
npm run format:check

# Run all validations
npm run validate
```

---

## Platform-Specific Notes

### Web (SPA + S3 + CloudFront)

- MSW (Mock Service Worker) is **disabled for web** due to bundling issues with static class blocks
- Use `expo-image` instead of React Native's `Image` component (for web compatibility)
- Dark mode configured with `darkMode: 'class'` in tailwind.config.js

### Mobile (iOS/Android)

- MSW works fine for native platforms
- Use Expo's managed workflow (not bare React Native)
- Build with EAS Build for production

---

## Important Files

**Configuration:**

- `app.config.ts` - Expo configuration
- `tailwind.config.js` - NativeWind/Tailwind configuration
- `codegen.yml` - GraphQL Code Generator configuration
- `.env` - Environment variables (not committed)
- `.env.example` - Example environment variables (committed)

**Entry Points:**

- `app/_layout.tsx` - Root layout with providers (URQL, MSW setup)
- `app/index.tsx` - Home screen
- `app/invitation/[invitationId].tsx` - Dynamic invitation route

**GraphQL:**

- `src/shared/graphql/client.ts` - URQL client configuration
- `src/__generated__/graphql.ts` - Auto-generated types (do not edit manually)

**Mocks:**

- `src/mocks/` - MSW setup for development and testing

---

## UI Changes Require E2E Tests (CRITICAL)

**⚠️ MANDATORY RULE: Any UI change must have a Playwright E2E test before marking the task complete.**

### What counts as a UI change:

- New screens or pages
- New user-facing components
- Changes to layouts or navigation
- Form interactions
- Button/link additions or modifications
- Responsive behavior changes

### Required test coverage:

1. ✅ Page loads without JavaScript errors
2. ✅ Core content is visible
3. ✅ Interactive elements work (buttons, links, forms)
4. ✅ Responsive behavior (mobile + desktop viewports if applicable)

### Before marking ANY UI task complete:

```bash
# 1. Write Playwright test in e2e/
# 2. Run the test
npm run test:e2e

# 3. Verify it passes
# 4. Only then mark task as complete
```

**Skipping E2E tests for UI changes = incomplete work.**

---

## Before Making Changes

1. **Check relevant governance document** from `.cursor/rules/`
2. **Read existing code** to understand current patterns
3. **Ask the user** if requirements are ambiguous
4. **Run tests** after changes: `npm run validate && npm run test:e2e`
5. **Update tests** if behavior changes
6. **For UI changes: Write Playwright test BEFORE marking complete**

---

## Troubleshooting & Learnings

### GraphQL Enum Types vs Runtime Values

**Problem:** `Cannot read properties of undefined (reading 'Accepted')` when using `RsvpStatus.Accepted`.

**Root Cause:**

- GraphQL Code Generator creates TypeScript string literal union types:
  ```typescript
  export type RsvpStatus = 'ACCEPTED' | 'DECLINED' | 'TENTATIVE'
  ```
- These types only exist at compile-time, not at runtime
- Trying to access `RsvpStatus.Accepted` returns `undefined` because there's no runtime object

**Solution:**
Create a separate runtime constants object in `types.ts`:

```typescript
// Runtime values for RsvpStatus enum
export const RsvpStatusValues = {
  Accepted: 'ACCEPTED' as RsvpStatus,
  Declined: 'DECLINED' as RsvpStatus,
  Tentative: 'TENTATIVE' as RsvpStatus,
} as const

// Use in code:
submitRsvp({
  status: RsvpStatusValues.Accepted, // ✅ Works
  adults: 2,
  kids: 0,
})

// ❌ WRONG:
status: RsvpStatus.Accepted // undefined!
```

**Best Practice:** For all GraphQL enum types, create a corresponding `[EnumName]Values` constant object for runtime usage.

### GraphQL Value Objects Rendering

**Problem:** React error "Objects are not valid as a React child (found: object with keys {value})".

**Root Cause:**

- GraphQL custom scalars (like `Email`, `URL`) return value objects:
  ```typescript
  email: {
    value: 'user@example.com'
  }
  ```
- Attempting to render the object directly fails

**Solution:**
Always access the `.value` property:

```tsx
// ❌ WRONG:
<Text>{host.email}</Text>  // Renders object

// ✅ CORRECT:
<Text>{host.email.value}</Text>  // Renders string
```

### Stale GraphQL Schema Files

**Problem:** GraphQL validation errors like "Field 'name' in type 'User' is undefined" even though backend schema is correct.

**Root Cause:**

- Local `schema.graphql` file cached from previous schema version
- GraphQL Code Generator prioritizes local schema over fetching from backend
- Changes to backend schema (like `name` → `firstName`/`lastName`) aren't reflected

**Solution:**

```bash
# Delete local schema cache
rm src/shared/graphql/schema.graphql

# Regenerate types from backend
npm run codegen

# Restart Metro with cache clear
npm start -- --clear
```

**Best Practice:** Don't commit `schema.graphql` to git. Let codegen fetch fresh schema from backend each time.

### Metro Bundler Aggressive Caching

**Problem:** TypeScript type changes don't reflect in running app even after rebuilding.

**Root Cause:**

- Metro bundler caches transformed modules aggressively
- Type changes from GraphQL codegen may not trigger cache invalidation

**Solution:**

```bash
# Always restart Metro with --clear after codegen
npm start -- --clear

# Or manually clear Metro cache
rm -rf node_modules/.cache
npm start
```

**Best Practice:** After running `npm run codegen`, always restart Metro with `--clear` flag.

### TypeScript Null Safety with GraphQL Optionals

**Problem:** Type errors like "Type 'string | null | undefined' is not assignable to type 'string'".

**Root Cause:**

- GraphQL schema marks fields as nullable: `endTime: String`
- Generated TypeScript types reflect this: `endTime?: string | null`
- Functions expecting non-null values fail type checking

**Solution:**
Provide fallback values using nullish coalescing:

```typescript
// ❌ WRONG:
formatEventTime(event.startTime, event.endTime, event.timezone)

// ✅ CORRECT:
formatEventTime(
  event.startTime,
  event.endTime || event.startTime,  // Fallback to startTime
  event.timezone
)

// Or for truly optional fields:
description={event.description || ''}
```

### Playwright E2E: Use getByLabel() for React Native Web Form Fields

**Problem:** `page.getByPlaceholderText('First Name')` fails with `getByPlaceholderText is not a function` or finds no matches in Playwright E2E tests.

**Root Cause:**

- React Native Web's `<TextInput>` does not render an HTML `placeholder` attribute
- `FormField` sets `accessibilityLabel={label}` which maps to `aria-label` in the DOM
- `getByPlaceholderText()` looks for `placeholder` attribute which doesn't exist

**Solution:**
Use `getByLabel()` which matches `aria-label` attributes:

```typescript
// ❌ BAD: No placeholder attribute in React Native Web
await page.getByPlaceholderText('First Name').fill('John')

// ✅ GOOD: accessibilityLabel maps to aria-label
await page.getByLabel('First Name').fill('John')

// ⚠️ WATCH OUT: Use { exact: true } when label is a substring of another
// "Password" would match both "Password" and "Confirm Password"
await page.getByLabel('Password', { exact: true }).fill('secret123')
await page.getByLabel('Confirm Password').fill('secret123')
```

**Best Practice:** In this codebase, the E2E selector priority for React Native Web is:

1. `getByRole('button', { name: '...' })` — for buttons/pressables
2. `getByLabel('...')` — for form inputs (via accessibilityLabel → aria-label)
3. `getByText('...')` — for static text content
4. `getByTestId('...')` — last resort when above options are ambiguous

### Expo Router: Route Strings Must Match Full File Path

**Problem:** Navigating to `/login` shows "Unmatched Route — Page could not be found" error.

**Root Cause:**

- Expo Router uses file-based routing: the URL path mirrors the file structure under `app/`
- Login route file is at `app/auth/login.tsx` → correct route is `/auth/login`
- Using `/login` as route string doesn't match any file, causing a 404
- The `as Href` type cast suppresses TypeScript validation that could catch this

**Solution:**

```typescript
// ❌ BAD: Route doesn't match file path, and type cast hides the error
router.replace('/login' as Href)

// ✅ GOOD: Full path matches app/auth/login.tsx
router.replace('/auth/login' as Href)
```

**Route mapping reference for this project:**

```
app/auth/login.tsx       → /auth/login
app/auth/register.tsx    → /auth/register
app/event/create.tsx     → /event/create
app/invitation/rsvp/[invitationId].tsx → /invitation/rsvp/:invitationId
```

**Best Practice:** Avoid `as Href` type casts when possible — they suppress Expo Router's type system which can catch invalid routes at compile time. If you must use a string, always verify the route matches the actual file path under `app/`.

### Expo Router: Route Group Paths Need `as Href` Casts

**Problem:** Routes inside Expo Router groups like `app/(tabs)/my-events/index.tsx` resolve to `/(tabs)/my-events` at runtime, but the auto-generated TypeScript route types do NOT include group path prefixes. Using `'/(tabs)/my-events'` directly causes TS2322 errors.

**Solution:** Add explicit `as Href` casts on all group path strings:

```typescript
// ❌ BAD: TypeScript error
<Redirect href="/(tabs)/my-events" />
router.replace('/(tabs)/my-events')

// ✅ GOOD: Explicit cast
<Redirect href={'/(tabs)/my-events' as Href} />
router.replace('/(tabs)/my-events' as Href)
```

This applies to all `/(tabs)/*` paths used in `Redirect`, `router.push()`, `router.replace()`, and typed `Href` assignments. Import `type Href` from `expo-router`.

### Expo Router: Stack Navigation Keeps Previous Screens Mounted

**Problem:** `router.push()` keeps previous screens mounted in the DOM (stack navigation). Playwright selectors find elements on both the current AND previous screens.

**Solution:** Use `.first()` or `getByRole()` with specific names in Playwright E2E tests when elements may exist on multiple stacked screens.

### Alert.alert() is a No-Op on React Native Web

**Problem:** `Alert.alert()` does nothing on web — it's only implemented for iOS/Android.

**Solution:** Use `showAlert()` from `src/shared/utils/alert.ts` instead. It renders an in-app modal on ALL platforms via `AlertProvider` + module-level ref pattern. In E2E tests, use standard DOM locators (`getByText`, `getByRole('button')`) instead of `page.on('dialog')`.

### E2E Modal Button Disambiguation

When testing modals with buttons like "Delete":

```typescript
// ❌ BAD: Matches both modal button AND dashboard trash icon "Delete Event Name"
getByRole('button', { name: 'Delete' })

// ✅ GOOD: Exact match avoids icon labels
getByRole('button', { name: 'Delete', exact: true })
```

### Expo Push Token Requires projectId for Standalone Builds

**Problem:** `getExpoPushTokenAsync()` silently fails to generate tokens on TestFlight/App Store builds if `projectId` is not passed.

**Root Cause:**

- Expo Go and dev client builds can auto-resolve the project ID
- Standalone builds (TestFlight, App Store, APK) cannot — they need it explicitly
- No error is thrown — the token just isn't generated, and push notifications silently don't work

**Solution:**

```typescript
const Constants = await import('expo-constants')
const projectId =
  Constants.default.expoConfig?.extra?.eas?.projectId ?? 'ec3dfbde-b3e0-4908-8dde-a2b5d9b5ed84' // hardcoded fallback
const tokenData = await Notifications.getExpoPushTokenAsync({ projectId })
```

Uses `Constants.expoConfig` (same pattern as `env.ts`) with a hardcoded fallback. The project ID is in `app.config.ts` at `extra.eas.projectId`.

### Don't Call Lifecycle Hooks from Other Hooks for Side Effects

**Problem:** Calling `useNotifications()` inside `useLogout()` re-triggers the entire push notification lifecycle — permissions prompt, token registration, listener setup — every time any component using `useLogout` renders.

**Root Cause:**

- `useNotifications` runs a `useEffect` on mount that registers push tokens and sets up listeners
- Using it in `useLogout` creates a new hook instance per component (LogoutButton, SettingsScreen)
- Each instance independently requests permissions and registers tokens

**Solution:** Extract standalone utility functions for cross-hook operations:

```typescript
// pushTokenManager.ts — standalone module, NOT a hook
export function setLastRegisteredToken(token: string): void { ... }
export async function unregisterPushToken(): Promise<void> { ... }
```

The lifecycle hook (`useNotifications`) calls `setLastRegisteredToken()` during registration. The logout flow imports `unregisterPushToken()` directly — no hook instantiation, no side effects.

**Rule:** If you need a side effect from Hook A inside Hook B, extract it as a standalone function. Never nest hooks that have `useEffect` side effects.

### URQL Request Policy

- Dev: `'network-only'` (always fresh data during development)
- Prod: `'cache-first'` (performance optimization)
- Configured via `EXPO_PUBLIC_APP_ENV` in `src/shared/graphql/client.ts`

### Auth Exchange (URQL)

Key implementation in `src/shared/graphql/authExchange.ts`:

- `hadAuthorizationHeader` guard: skip login/register mutations
- `isRefreshMutation`: AST-based detection to avoid infinite refresh loops
- `_authRetried` context flag: prevents retry loops on persistent auth failures
- **Mobile cold-start limitation:** `_cachedAccessToken` is null until first async `getAccessToken()` resolves. First URQL request may fire without Authorization header.

### GraphQL Optional Properties

With `exactOptionalPropertyTypes: true`, use `null` (not `undefined`) for optional GraphQL `InputMaybe<T>` fields in frontend code.

---

## Local Deploy (from laptop)

```bash
# Dev deploy (S3 + CloudFront, ~5-8 min)
./scripts/deploy/local-deploy.sh --environment dev

# Prod deploy (fallback only, requires typed confirmation)
./scripts/deploy/local-deploy.sh --environment prod --confirm-prod
```

**First-time setup:** `cp scripts/deploy/local-deploy.conf.example scripts/deploy/local-deploy.conf` and fill in values.

**Key files:**

- `scripts/deploy/local-deploy.sh` — main deploy script
- `scripts/deploy/local-deploy.conf.example` — config template

---

## Mobile TestFlight / Play Store Build (Local)

Build iOS + Android locally and submit to TestFlight / Google Play Internal Testing.
Zero EAS cloud costs — all builds run on your Mac. EAS cloud only handles credential management (provisioning profiles, keystores) — that's free.

> **DEFAULT: Use the ngrok script** (`mobile-testflight-local-ngrok.sh`) for all mobile deployments. It auto-starts an ngrok tunnel to your local backend so the mobile app on a real device talks to your laptop. Only use the other scripts when explicitly targeting DEV AWS or production.

### Default — Local Backend via ngrok (day-to-day mobile testing)

```bash
# DEFAULT: Both platforms, local backend via ngrok
./scripts/deploy/mobile-testflight-local-ngrok.sh

# iOS only (recommended)
./scripts/deploy/mobile-testflight-local-ngrok.sh --ios-only

# Android only
./scripts/deploy/mobile-testflight-local-ngrok.sh --android-only

# Use an existing ngrok tunnel (skip auto-start)
./scripts/deploy/mobile-testflight-local-ngrok.sh --url https://abc123.ngrok-free.app

# Build without submitting
./scripts/deploy/mobile-testflight-local-ngrok.sh --skip-submit

# Skip quality checks (re-run after failed submit)
./scripts/deploy/mobile-testflight-local-ngrok.sh --skip-checks
```

The ngrok script auto-starts an ngrok tunnel to `localhost:8080`, temporarily patches `eas.json` with the ngrok URL (reverted via `trap` on exit), builds, and submits. **Keep your local backend running** — the mobile app connects through the tunnel.

### DEV AWS Backend

```bash
# Points to DEV AWS (d1twtjfgg5e272.cloudfront.net/graphql)
./scripts/deploy/mobile-testflight.sh
./scripts/deploy/mobile-testflight.sh --ios-only
```

### Production

```bash
# PRODUCTION (justhestia.app) — requires typed "production" confirmation
./scripts/deploy/mobile-testflight-prod.sh
./scripts/deploy/mobile-testflight-prod.sh --ios-only
```

Production builds enable CAPTCHA, Sentry source map upload (`SENTRY_AUTH_TOKEN` required), and Google OAuth. Two confirmation gates prevent accidental production deploys.

### Common Details (all scripts)

**Build flow:** iOS build → iOS submit to TestFlight → Android build → Android submit to Play Store. Each platform submits immediately after its build, so a failure on one platform doesn't block the other.

**Auto-increment:** All three scripts share the same `buildNumber` (iOS) and `versionCode` (Android) counter in `app.config.ts` on `main`. Each script increments, commits, and pushes before building. Apple/Google require unique build numbers per upload — running any script always gets the next available number.

**Bundle ID:** All builds (dev, ngrok, and production) use the same bundle ID `app.just.hestia`. The dev vs prod behavior is controlled by `EXPO_PUBLIC_*` env vars baked into the JS bundle, not the bundle ID.

**Key files:**

- `scripts/deploy/mobile-testflight-local-ngrok.sh` — **DEFAULT** local backend via ngrok
- `scripts/deploy/mobile-testflight.sh` — DEV AWS backend
- `scripts/deploy/mobile-testflight-prod.sh` — production backend
- `eas.json` → `testflight-dev` / `production` profiles

**Prerequisites (first-time setup on a new Mac):**

1. **ngrok** — required for the default deploy script:
   ```bash
   brew install ngrok
   ngrok config add-authtoken YOUR_TOKEN
   ```
2. **Apple WWDR G3 certificate** — required for local iOS builds. Without it, the distribution certificate import fails with "hasn't been imported successfully":
   ```bash
   curl -O https://www.apple.com/certificateauthority/AppleWWDRCAG3.cer && \
   sudo security import AppleWWDRCAG3.cer -k /Library/Keychains/System.keychain && \
   rm AppleWWDRCAG3.cer
   ```
3. **Android SDK** — required for local Android builds. Set `ANDROID_HOME` after installing Android Studio. Without it, use `--ios-only`.
4. **EAS CLI** — `npm install -g eas-cli` and `eas login`

**Known issues & fixes:**

- **ngrok URL changes on restart:** The ngrok URL is baked into the build at compile time. If the tunnel dies, you must restart ngrok and rebuild. Use `--url` to reuse an existing tunnel.
- **Sentry upload fails without auth token:** `SENTRY_DISABLE_AUTO_UPLOAD=true` is set in `testflight-dev` env to skip source map/dSYM upload. Production builds need `SENTRY_AUTH_TOKEN`.
- **Fastlane timeout on back-to-back builds:** `FASTLANE_XCODEBUILD_SETTINGS_TIMEOUT=120` is set in the scripts to prevent `xcodebuild -showBuildSettings` timeout.
- **Dynamic `import()` breaks EAS local builds:** Metro's `asyncRequire` resolves to wrong temp directory. All notification modules (`useNotifications.ts`, `pushTokenManager.ts`) use static imports. Never use `await import()` for Expo SDK modules — use static `import` at the top of the file.
- **Push notifications on TestFlight:** Work out of the box. The provisioning profile includes push entitlement, `expo-notifications` is linked, and `projectId` has a hardcoded fallback. Backend must be reachable at the baked-in API URL.

---

## Remember

- This project prioritizes **user experience, accessibility, and maintainability**
- Follow the **established patterns** - don't introduce new paradigms without discussion
- **Ask questions** when unsure - it's better than making incorrect assumptions
- **Test your changes** - both unit tests and E2E tests
- **Document significant decisions** - update this file or relevant docs as needed

---

For detailed specifications on any topic, consult the corresponding governance document in `.cursor/rules/`.
