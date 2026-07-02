import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  allDay: Scalars['Boolean']['output'];
  colorHex: Scalars['String']['output'];
  /** ISO date of the occurrence. */
  date: Scalars['String']['output'];
  /** 1=Mon .. 7=Sun for the occurrence. */
  dayOfWeek: Scalars['Int']['output'];
  /** ISO-8601 instant for the end, null when allDay/open-ended. */
  end?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /** True when this event needs a responsible adult but has none. */
  isCoverageGap: Scalars['Boolean']['output'];
  location?: Maybe<Scalars['String']['output']>;
  needsDriver: Scalars['Boolean']['output'];
  /** Whom the event is about (color comes from the primary owner). */
  ownerMembers: Array<HouseholdMember>;
  /** Which adult is responsible for logistics; null => coverage gap when a driver is needed. */
  responsibleMember?: Maybe<HouseholdMember>;
  /** ISO-8601 instant for the start, null when allDay. */
  start?: Maybe<Scalars['String']['output']>;
  /** Backend-formatted label, e.g. '4:00 – 5:30', '9:00', 'All day'. */
  timeLabel: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CalendarPeriod = {
  __typename?: 'CalendarPeriod';
  /** ISO date of the last day in the window. */
  end: Scalars['String']['output'];
  /** Human label, e.g. 'Jun 23 – 29, 2026' or 'Thursday June 26'. */
  label: Scalars['String']['output'];
  /** DAY, WEEK, or MONTH. */
  range: CalendarRange;
  /** ISO date (yyyy-MM-dd) of the first day in the window. */
  start: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
};

/**  Household Calendar inputs (HES-CAL). */
export type CalendarPeriodInput = {
  /** ISO date (yyyy-MM-dd) anchoring the window; the server resolves the window in the household tz. */
  anchor: Scalars['String']['input'];
  range: CalendarRange;
};

export type CalendarRange =
  | 'DAY'
  | 'MONTH'
  | 'WEEK';

export type ConnectedAccount = {
  __typename?: 'ConnectedAccount';
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  provider: Scalars['String']['output'];
  status: SyncStatus;
  statusLabel: Scalars['String']['output'];
};

export type CoverageGap = {
  __typename?: 'CoverageGap';
  eventId: Scalars['ID']['output'];
  /** Full sentence, e.g. "Fri 3:30 — Maya's pickup has no responsible adult." */
  label: Scalars['String']['output'];
  /** Compact label, e.g. 'Fri 3:30 — Maya pickup unassigned'. */
  shortLabel: Scalars['String']['output'];
};

export type CreateCalendarEventInput = {
  allDay: Scalars['Boolean']['input'];
  /** ISO date (yyyy-MM-dd) the event occurs on. */
  date: Scalars['String']['input'];
  /** 24h 'HH:mm', optional. */
  endTime?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  needsDriver: Scalars['Boolean']['input'];
  /** ≥1 owner member id. */
  ownerMemberIds: Array<Scalars['ID']['input']>;
  /** Responsible adult member id; null => Unassigned (coverage gap if a driver is needed). */
  responsibleMemberId?: InputMaybe<Scalars['ID']['input']>;
  /** 24h 'HH:mm', null when allDay. */
  startTime?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateCalendarEventPayload = {
  __typename?: 'CreateCalendarEventPayload';
  event: CalendarEvent;
};

export type HealthStatus = {
  __typename?: 'HealthStatus';
  status: Scalars['String']['output'];
};

export type Household = {
  __typename?: 'Household';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
};

/**
 *  Household Calendar types (HES-CAL). All computed values (timeLabel, isCoverageGap, load
 *  percentages, colorHex, period window) are produced by the backend — the frontend renders them.
 *  Date/time values are ISO-8601 strings (no custom scalars).
 */
export type HouseholdCalendar = {
  __typename?: 'HouseholdCalendar';
  connectedAccounts: Array<ConnectedAccount>;
  coverageGaps: Array<CoverageGap>;
  events: Array<CalendarEvent>;
  household: Household;
  load: WeeklyLoad;
  members: Array<HouseholdMember>;
  period: CalendarPeriod;
};

export type HouseholdMember = {
  __typename?: 'HouseholdMember';
  /** Age label for children (e.g. '8'), null for adults. */
  ageLabel?: Maybe<Scalars['String']['output']>;
  /** Authoritative per-person color (e.g. '#C4603D'). */
  colorHex: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Single-letter avatar initial. */
  initial: Scalars['String']['output'];
  /** True for adults who can be a responsible adult. */
  isResponsibleCapable: Scalars['Boolean']['output'];
  kind: MemberKind;
  role: MemberRole;
};

export type LoadEntry = {
  __typename?: 'LoadEntry';
  count: Scalars['Int']['output'];
  member: HouseholdMember;
  /** Share of the responsible-event total, 0–100. */
  percent: Scalars['Int']['output'];
};

/** Input for the login mutation (email + password). */
export type LoginInput = {
  /** Optional CAPTCHA token (web). Ignored this iteration. */
  captchaToken?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** Payload returned after a successful login. */
export type LoginPayload = {
  __typename?: 'LoginPayload';
  accessToken: Scalars['String']['output'];
  preferredLanguage: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

/** Payload returned after a logout attempt. */
export type LogoutPayload = {
  __typename?: 'LogoutPayload';
  success: Scalars['Boolean']['output'];
};

export type MemberKind =
  | 'ADULT'
  | 'CHILD';

export type MemberRole =
  | 'ADMIN'
  | 'MEMBER'
  | 'NONE';

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a calendar event in the authenticated user's household (HES-CAL). */
  createCalendarEvent: CreateCalendarEventPayload;
  /** Authenticate with email + password. */
  login: LoginPayload;
  /** Log out the current session (idempotent). */
  logout: LogoutPayload;
  /** Exchange a refresh token for a new access + refresh token pair. */
  refreshToken: RefreshTokenPayload;
  /** Register a new user. */
  registerUser: RegisterUserPayload;
};


export type MutationCreateCalendarEventArgs = {
  input: CreateCalendarEventInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};

export type Query = {
  __typename?: 'Query';
  /** Health check for monitoring. */
  health: HealthStatus;
  /** The authenticated user's household calendar for the requested period (HES-CAL). */
  householdCalendar: HouseholdCalendar;
  /** The authenticated user, or null when unauthenticated (paused on the frontend without a token). */
  me?: Maybe<User>;
};


export type QueryHouseholdCalendarArgs = {
  period: CalendarPeriodInput;
};

/** Input for the refreshToken mutation. */
export type RefreshTokenInput = {
  refreshToken: Scalars['String']['input'];
};

/** Payload from a successful token refresh (rotated refresh token). */
export type RefreshTokenPayload = {
  __typename?: 'RefreshTokenPayload';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

/** Input for the registerUser mutation. */
export type RegisterUserInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

/** Payload returned after registration. */
export type RegisterUserPayload = {
  __typename?: 'RegisterUserPayload';
  message: Scalars['String']['output'];
  preferredLanguage: Scalars['String']['output'];
  ttlMinutes: Scalars['Int']['output'];
  userId: Scalars['ID']['output'];
};

export type SyncStatus =
  | 'DISCONNECTED'
  | 'SYNCED';

/** The authenticated user profile. */
export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  preferredLanguage: Scalars['String']['output'];
};

export type WeeklyLoad = {
  __typename?: 'WeeklyLoad';
  entries: Array<LoadEntry>;
  /** Optional nudge, e.g. 'Pallavi is carrying a bit more this week.' */
  summaryLabel?: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', accessToken: string, refreshToken: string, preferredLanguage: string } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'RegisterUserPayload', message: string, userId: string, ttlMinutes: number, preferredLanguage: string } };

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'RefreshTokenPayload', accessToken: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutPayload', success: boolean } };

export type CreateCalendarEventMutationVariables = Exact<{
  input: CreateCalendarEventInput;
}>;


export type CreateCalendarEventMutation = { __typename?: 'Mutation', createCalendarEvent: { __typename?: 'CreateCalendarEventPayload', event: { __typename?: 'CalendarEvent', id: string, title: string, start?: string | null, end?: string | null, allDay: boolean, timeLabel: string, dayOfWeek: number, date: string, colorHex: string, location?: string | null, needsDriver: boolean, isCoverageGap: boolean, ownerMembers: Array<{ __typename?: 'HouseholdMember', id: string, displayName: string, initial: string, colorHex: string }>, responsibleMember?: { __typename?: 'HouseholdMember', id: string, displayName: string, initial: string, colorHex: string } | null } } };

export type HouseholdCalendarQueryVariables = Exact<{
  period: CalendarPeriodInput;
}>;


export type HouseholdCalendarQuery = { __typename?: 'Query', householdCalendar: { __typename?: 'HouseholdCalendar', household: { __typename?: 'Household', id: string, name: string, timezone: string }, period: { __typename?: 'CalendarPeriod', range: CalendarRange, start: string, end: string, label: string, timezone: string }, members: Array<{ __typename?: 'HouseholdMember', id: string, displayName: string, initial: string, colorHex: string, kind: MemberKind, role: MemberRole, isResponsibleCapable: boolean, ageLabel?: string | null }>, events: Array<{ __typename?: 'CalendarEvent', id: string, title: string, start?: string | null, end?: string | null, allDay: boolean, timeLabel: string, dayOfWeek: number, date: string, colorHex: string, location?: string | null, needsDriver: boolean, isCoverageGap: boolean, ownerMembers: Array<{ __typename?: 'HouseholdMember', id: string, displayName: string, initial: string, colorHex: string }>, responsibleMember?: { __typename?: 'HouseholdMember', id: string, displayName: string, initial: string, colorHex: string } | null }>, coverageGaps: Array<{ __typename?: 'CoverageGap', eventId: string, label: string, shortLabel: string }>, load: { __typename?: 'WeeklyLoad', total: number, summaryLabel?: string | null, entries: Array<{ __typename?: 'LoadEntry', count: number, percent: number, member: { __typename?: 'HouseholdMember', id: string, displayName: string, initial: string, colorHex: string } }> }, connectedAccounts: Array<{ __typename?: 'ConnectedAccount', id: string, provider: string, label: string, status: SyncStatus, statusLabel: string }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, firstName?: string | null, lastName?: string | null, preferredLanguage: string } | null };


export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    preferredLanguage
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterUserDocument = gql`
    mutation RegisterUser($input: RegisterUserInput!) {
  registerUser(input: $input) {
    message
    userId
    ttlMinutes
    preferredLanguage
  }
}
    `;

export function useRegisterUserMutation() {
  return Urql.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument);
};
export const RefreshTokenDocument = gql`
    mutation RefreshToken($input: RefreshTokenInput!) {
  refreshToken(input: $input) {
    accessToken
    refreshToken
  }
}
    `;

export function useRefreshTokenMutation() {
  return Urql.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    success
  }
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const CreateCalendarEventDocument = gql`
    mutation CreateCalendarEvent($input: CreateCalendarEventInput!) {
  createCalendarEvent(input: $input) {
    event {
      id
      title
      start
      end
      allDay
      timeLabel
      dayOfWeek
      date
      colorHex
      location
      needsDriver
      isCoverageGap
      ownerMembers {
        id
        displayName
        initial
        colorHex
      }
      responsibleMember {
        id
        displayName
        initial
        colorHex
      }
    }
  }
}
    `;

export function useCreateCalendarEventMutation() {
  return Urql.useMutation<CreateCalendarEventMutation, CreateCalendarEventMutationVariables>(CreateCalendarEventDocument);
};
export const HouseholdCalendarDocument = gql`
    query HouseholdCalendar($period: CalendarPeriodInput!) {
  householdCalendar(period: $period) {
    household {
      id
      name
      timezone
    }
    period {
      range
      start
      end
      label
      timezone
    }
    members {
      id
      displayName
      initial
      colorHex
      kind
      role
      isResponsibleCapable
      ageLabel
    }
    events {
      id
      title
      start
      end
      allDay
      timeLabel
      dayOfWeek
      date
      colorHex
      location
      needsDriver
      isCoverageGap
      ownerMembers {
        id
        displayName
        initial
        colorHex
      }
      responsibleMember {
        id
        displayName
        initial
        colorHex
      }
    }
    coverageGaps {
      eventId
      label
      shortLabel
    }
    load {
      total
      summaryLabel
      entries {
        member {
          id
          displayName
          initial
          colorHex
        }
        count
        percent
      }
    }
    connectedAccounts {
      id
      provider
      label
      status
      statusLabel
    }
  }
}
    `;

export function useHouseholdCalendarQuery(options: Omit<Urql.UseQueryArgs<HouseholdCalendarQueryVariables>, 'query'>) {
  return Urql.useQuery<HouseholdCalendarQuery, HouseholdCalendarQueryVariables>({ query: HouseholdCalendarDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    firstName
    lastName
    preferredLanguage
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};