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
  Date: { input: string; output: string; }
  DateTime: { input: string; output: string; }
  Email: { input: string; output: string; }
  JSON: { input: any; output: any; }
  URL: { input: string; output: string; }
};

/**
 * Input for accepting a pending co-host invitation.
 * Caller is derived from JWT.
 */
export type AcceptCoHostInviteInput = {
  token: Scalars['String']['input'];
};

export type AcceptCoHostInvitePayload = {
  __typename?: 'AcceptCoHostInvitePayload';
  errors: Array<UserError>;
  eventId?: Maybe<Scalars['ID']['output']>;
  eventName?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AccountSummary = {
  __typename?: 'AccountSummary';
  eventCount: Scalars['Int']['output'];
  invitationCount: Scalars['Int']['output'];
};

/**  --- Add Attendees to existing event --- */
export type AddAttendeesInput = {
  attendees: Array<AttendeeInput>;
  eventId: Scalars['ID']['input'];
};

export type AddAttendeesPayload = {
  __typename?: 'AddAttendeesPayload';
  created: Array<CreatedAttendee>;
  duplicates: Array<DuplicateInfo>;
  failed: Array<FailedAttendee>;
  success: Scalars['Boolean']['output'];
};

export type AppleSignInAccountNotFound = {
  __typename?: 'AppleSignInAccountNotFound';
  message: Scalars['String']['output'];
};

export type AppleSignInError = {
  __typename?: 'AppleSignInError';
  message: Scalars['String']['output'];
  reason: AppleSignInErrorReason;
};

export type AppleSignInErrorReason =
  | 'EMAIL_NOT_VERIFIED'
  | 'INVALID_TOKEN'
  /**
   *  Transient infrastructure failure (Apple JWKS unreachable, crypto error). Distinct from
   *  INVALID_TOKEN so the client can surface a retry-friendly message during outages.
   */
  | 'SERVICE_UNAVAILABLE';

/**  Apple Account Linking — Inputs */
export type AppleSignInInput = {
  /** Apple ID token from expo-apple-authentication (iOS) or expo-auth-session/providers/apple (Web) */
  idToken: Scalars['String']['input'];
};

export type AppleSignInLinkRequired = {
  __typename?: 'AppleSignInLinkRequired';
  email: Scalars['String']['output'];
  linkingToken: Scalars['String']['output'];
};

export type AppleSignInRelayEmailNotSupported = {
  __typename?: 'AppleSignInRelayEmailNotSupported';
  message: Scalars['String']['output'];
};

/**  Apple Account Linking — Types */
export type AppleSignInResult = AppleSignInAccountNotFound | AppleSignInError | AppleSignInLinkRequired | AppleSignInRelayEmailNotSupported | AppleSignInSuccess;

export type AppleSignInSuccess = {
  __typename?: 'AppleSignInSuccess';
  accessToken: Scalars['String']['output'];
  /**
   * The authenticated user's preferred-language BCP-47 tag (e.g. "en", "es-419").
   * Frontend awaits setLocale(preferredLanguage) BEFORE navigating post-login so the
   * dashboard renders in the user's chosen language. Non-null; backfilled rows default to "en".
   */
  preferredLanguage: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

/** Individual attendee details within an event's RSVP breakdown. */
export type AttendeeDetail = {
  __typename?: 'AttendeeDetail';
  adults?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['String']['output'];
  dietaryRestrictions?: Maybe<Scalars['String']['output']>;
  /** ISO-8601 string of when the guest first viewed the invitation. Null if not yet viewed. */
  firstViewedAt?: Maybe<Scalars['String']['output']>;
  guestEmail?: Maybe<Scalars['String']['output']>;
  guestName: Scalars['String']['output'];
  guestPhone?: Maybe<Scalars['String']['output']>;
  invitationId: Scalars['ID']['output'];
  kids?: Maybe<Scalars['Int']['output']>;
  lastReminderSentAt?: Maybe<Scalars['String']['output']>;
  /** First name of the host who sent the last reminder (null if no reminder sent). */
  lastReminderSentByName?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  respondedAt?: Maybe<Scalars['String']['output']>;
  rsvpStatus?: Maybe<Scalars['String']['output']>;
  source?: Maybe<InvitationSource>;
};

export type AttendeeInput = {
  guestEmail?: InputMaybe<Scalars['String']['input']>;
  guestName: Scalars['String']['input'];
  guestPhone?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A single banner record. Returned by the public `activeBanners` query and by the admin
 * `adminBannerList` query.
 */
export type Banner = {
  __typename?: 'Banner';
  /**
   * Sanitized HTML body. The backend strips event handlers, `<script>`/`<iframe>`/`<img>` and
   * similar tags before persistence; the frontend re-sanitizes via DOMPurify before rendering.
   */
  content: Scalars['String']['output'];
  /** When the banner was created. */
  createdAt: Scalars['DateTime']['output'];
  /**
   * Whether viewers may dismiss this banner. Configured per-banner at creation: when true a
   * close affordance is rendered and dismissals persist (per-user server-side for authenticated
   * viewers, per-device localStorage for anonymous). When false the banner is forced-display —
   * useful for safety / compliance announcements.
   */
  dismissible: Scalars['Boolean']['output'];
  /**
   * Optional schedule end. Null means "no end". When set, the banner stops being live at this
   * instant (exclusive).
   */
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  /** Unique banner identifier (UUID). */
  id: Scalars['ID']['output'];
  /** Target audience (GLOBAL or AUTHENTICATED_ONLY). */
  scope: BannerScope;
  /** Visual severity (INFO, WARNING, PROMO). */
  severity: BannerSeverity;
  /** Optional schedule start. Null means "live as soon as it is published". */
  startsAt?: Maybe<Scalars['DateTime']['output']>;
  /** Lifecycle status (DRAFT or PUBLISHED). */
  status: BannerStatus;
};

/**
 * Audience scope of a banner.
 *
 * - GLOBAL — visible to anonymous and authenticated viewers.
 * - AUTHENTICATED_ONLY — visible only when a valid JWT is presented.
 */
export type BannerScope =
  | 'AUTHENTICATED_ONLY'
  | 'GLOBAL';

/** Visual severity. Drives the rendered colour tint on the frontend. */
export type BannerSeverity =
  | 'INFO'
  | 'PROMO'
  | 'WARNING';

/**
 * Lifecycle status of a banner.
 *
 * - DRAFT — authored but not visible to any viewer.
 * - PUBLISHED — eligible for activeBanners (subject to scope and schedule filters).
 */
export type BannerStatus =
  | 'DRAFT'
  | 'PUBLISHED';

/**
 * Preview of a co-host invitation for the acceptance screen.
 * Returned by the unauthenticated coHostInviteDetails query.
 */
export type CoHostInvitePreview = {
  __typename?: 'CoHostInvitePreview';
  eventDate?: Maybe<Scalars['Date']['output']>;
  eventName: Scalars['String']['output'];
  primaryHostFirstName: Scalars['String']['output'];
  status: CoHostInviteStatus;
};

/** The lifecycle state of a co-host invitation. */
export type CoHostInviteStatus =
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'PENDING';

/** An active co-host record: a User with their role and status on a specific event. */
export type CoHostMember = {
  __typename?: 'CoHostMember';
  acceptedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['Email']['output'];
  firstName: Scalars['String']['output'];
  invitedAt: Scalars['DateTime']['output'];
  lastName: Scalars['String']['output'];
  notificationMuted: Scalars['Boolean']['output'];
  role: EventHostRole;
  userId: Scalars['ID']['output'];
};

export type CompleteEventInput = {
  eventId: Scalars['ID']['input'];
};

export type CompleteEventPayload = {
  __typename?: 'CompleteEventPayload';
  acceptedCount: Scalars['Int']['output'];
  eventName: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  totalInvitees: Scalars['Int']['output'];
};

export type ConfirmAccountDeletionInput = {
  code: Scalars['String']['input'];
};

export type ConfirmAccountDeletionPayload = {
  __typename?: 'ConfirmAccountDeletionPayload';
  /**
   * Email address of the deleted account — used by the frontend to display
   * a confirmation banner on the login screen after redirect.
   */
  deletedEmail?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/**
 * Input for confirming an uploaded image.
 * Called after the frontend successfully PUTs the image to S3 via presigned URL.
 */
export type ConfirmImageUploadInput = {
  /** Content type declared at upload time (e.g. "image/jpeg") */
  contentType: Scalars['String']['input'];
  /** ID of the event the image belongs to */
  eventId: Scalars['ID']['input'];
  /** S3 object key returned by getImageUploadUrl (imageKey field) */
  imageKey: Scalars['String']['input'];
};

/** Result of confirming an image upload. */
export type ConfirmImageUploadPayload = {
  __typename?: 'ConfirmImageUploadPayload';
  /**
   * Error code on failure (null on success).
   * Values: MAGIC_BYTES_MISMATCH, SIZE_EXCEEDED, UNSUPPORTED_TYPE, VALIDATION_ERROR
   */
  errorCode?: Maybe<Scalars['String']['output']>;
  /** The confirmed, permanent image URL (null on failure) */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Whether the confirmation succeeded */
  success: Scalars['Boolean']['output'];
};

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

/** Input for createBanner and duplicateBanner mutations. */
export type CreateBannerInput = {
  /**
   * HTML banner body. Sanitized server-side against a strict allowlist (jsoup Safelist) before
   * persistence. Maximum 2000 characters after sanitization.
   */
  content: Scalars['String']['input'];
  /** Whether viewers may dismiss this banner. */
  dismissible: Scalars['Boolean']['input'];
  /** Optional schedule end. Omit / null for "no end". */
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** If true, persist as PUBLISHED. If false, persist as DRAFT. */
  publishImmediately: Scalars['Boolean']['input'];
  /** Audience scope (GLOBAL or AUTHENTICATED_ONLY). */
  scope: BannerScope;
  /** Visual severity (INFO, WARNING, PROMO). */
  severity: BannerSeverity;
  /** Optional schedule start. Omit / null for "live immediately on publish". */
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
};

/**
 * Input for creating a new event (draft or published).
 * Host ID is derived server-side from the JWT Bearer token.
 */
export type CreateEventInput = {
  /** Event date (ISO format YYYY-MM-DD). Required for non-DRAFT events. */
  date?: InputMaybe<Scalars['Date']['input']>;
  /** Event description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Dress code (optional) */
  dressCode?: InputMaybe<Scalars['String']['input']>;
  /** End time (HH:MM 24-hour format, optional) */
  endTime?: InputMaybe<Scalars['String']['input']>;
  /** Event image URL (optional) */
  imageUrl?: InputMaybe<Scalars['URL']['input']>;
  /**
   * Display name for an optional event link (e.g. 'Gift Registry', 'Zoom link').
   * Must be provided together with linkUrl. Max 60 characters.
   */
  linkName?: InputMaybe<Scalars['String']['input']>;
  /**
   * URL for the optional event link. Must be http or https. Max 2000 characters.
   * Must be provided together with linkName.
   */
  linkUrl?: InputMaybe<Scalars['String']['input']>;
  /** Event location. Required for non-DRAFT events; optional for DRAFT (can be added later). */
  location?: InputMaybe<LocationInput>;
  /** Max attendees per invitation (optional, null = no limit) */
  maxAttendeesPerInvitation?: InputMaybe<Scalars['Int']['input']>;
  /**
   * Per-event guest limit (optional, null = use system default). Overrides the system maximum
   * when set to a lower value; the effective limit is min(maxGuests, system default).
   */
  maxGuests?: InputMaybe<Scalars['Int']['input']>;
  /** Event name */
  name: Scalars['String']['input'];
  /** RSVP deadline (ISO Date, YYYY-MM-DD). Required for non-DRAFT events. */
  rsvpDeadline?: InputMaybe<Scalars['Date']['input']>;
  /** Special instructions for guests (optional) */
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
  /** Start time (HH:MM 24-hour format). Required for non-DRAFT events. */
  startTime?: InputMaybe<Scalars['String']['input']>;
  /** Event status: DRAFT or CREATED */
  status: EventStatus;
  /** Timezone (e.g. America/New_York) */
  timezone: Scalars['String']['input'];
};

/** Result of creating an event. */
export type CreateEventPayload = {
  __typename?: 'CreateEventPayload';
  /** The newly created event */
  event: Event;
};

/** Input for creating a new test user account. */
export type CreateTestUserInput = {
  /** Email address for the test user (must be unique). */
  email: Scalars['String']['input'];
  /** First name for the test user. */
  firstName: Scalars['String']['input'];
  /** Last name for the test user. */
  lastName: Scalars['String']['input'];
  /** Password for the test user account. */
  password: Scalars['String']['input'];
  /** Phone number for the test user (optional). */
  phone?: InputMaybe<Scalars['String']['input']>;
};

/** Payload returned from the createTestUser mutation. */
export type CreateTestUserPayload = {
  __typename?: 'CreateTestUserPayload';
  /** Errors that prevented creation (empty on success). */
  errors: Array<UserError>;
  /** True when the test user was successfully created. */
  success: Scalars['Boolean']['output'];
  /** The newly created test user (null on failure). */
  testUser?: Maybe<TestUser>;
};

/** Input for creating a new user (admin/internal use) */
export type CreateUserInput = {
  /** User's email address (must be unique) */
  email: Scalars['Email']['input'];
  /** User's first name */
  firstName: Scalars['String']['input'];
  /** User's last name */
  lastName: Scalars['String']['input'];
};

export type CreatedAttendee = {
  __typename?: 'CreatedAttendee';
  guestEmail?: Maybe<Scalars['String']['output']>;
  guestName: Scalars['String']['output'];
  guestPhone?: Maybe<Scalars['String']['output']>;
  invitationId: Scalars['ID']['output'];
  status: InvitationStatus;
};

/**
 * Input for declining a pending co-host invitation.
 * Caller is derived from JWT.
 */
export type DeclineCoHostInviteInput = {
  token: Scalars['String']['input'];
};

export type DeclineCoHostInvitePayload = {
  __typename?: 'DeclineCoHostInvitePayload';
  errors: Array<UserError>;
  success: Scalars['Boolean']['output'];
};

/**
 * Input for cancelling (soft-deleting) an event.
 * Host ID is derived server-side from the JWT Bearer token.
 */
export type DeleteEventInput = {
  /** The event ID to cancel */
  eventId: Scalars['ID']['input'];
  /**
   * Optional reason for cancelling the event (max 500 characters).
   * Included in cancellation notifications to guests.
   */
  reason?: InputMaybe<Scalars['String']['input']>;
};

/** Result of deleting an event. */
export type DeleteEventPayload = {
  __typename?: 'DeleteEventPayload';
  /** Name of the deleted event */
  eventName: Scalars['String']['output'];
  /** Number of invitees that were associated with the event */
  inviteeCount: Scalars['Int']['output'];
  /** Human-readable message describing the result */
  message: Scalars['String']['output'];
  /**
   * Number of invitees that received cancellation notifications via email.
   * Only guests with email addresses are notified; phone-only guests are excluded.
   */
  notifiedCount: Scalars['Int']['output'];
  /** Whether the event was deleted successfully */
  success: Scalars['Boolean']['output'];
};

/** Input for deleting a test user account. */
export type DeleteTestUserInput = {
  /** ID of the test user to delete. */
  id: Scalars['ID']['input'];
};

/** Payload returned from the deleteTestUser mutation. */
export type DeleteTestUserPayload = {
  __typename?: 'DeleteTestUserPayload';
  /** Errors that prevented deletion (empty on success). */
  errors: Array<UserError>;
  /** True when the test user was successfully deleted. */
  success: Scalars['Boolean']['output'];
};

export type DisableEventLinkPayload = {
  __typename?: 'DisableEventLinkPayload';
  success: Scalars['Boolean']['output'];
};

/**
 * Input for dismissing/undismissing a follow-up action item.
 * Host ID is derived server-side from the JWT Bearer token.
 */
export type DismissFollowUpInput = {
  eventId: Scalars['ID']['input'];
  hostNotes?: InputMaybe<Scalars['String']['input']>;
  itemKey: Scalars['String']['input'];
};

/** Result of dismissing a follow-up item. */
export type DismissFollowUpPayload = {
  __typename?: 'DismissFollowUpPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type DuplicateInfo = {
  __typename?: 'DuplicateInfo';
  contactHint: Scalars['String']['output'];
  guestName: Scalars['String']['output'];
};

export type EnableEventLinkPayload = {
  __typename?: 'EnableEventLinkPayload';
  publicRsvpToken: Scalars['ID']['output'];
  publicRsvpUrl: Scalars['String']['output'];
};

/** Error codes for categorizing errors */
export type ErrorCode =
  /** User is already a host (primary or co-host) on this event */
  | 'ALREADY_A_HOST'
  /** Resource already exists (duplicate) */
  | 'ALREADY_EXISTS'
  /** Business rule violation */
  | 'BUSINESS_RULE_VIOLATION'
  /** Co-host invitation has expired */
  | 'CO_HOST_INVITE_EXPIRED'
  /** No pending co-host invitation found for this token */
  | 'CO_HOST_INVITE_NOT_FOUND'
  /** Co-host limit for this event has been reached (max 2 co-hosts per event) */
  | 'CO_HOST_LIMIT_REACHED'
  /** External service error */
  | 'EXTERNAL_SERVICE_ERROR'
  /** User does not have permission */
  | 'FORBIDDEN'
  /** Internal server error */
  | 'INTERNAL_ERROR'
  /** Requested resource not found */
  | 'NOT_FOUND'
  /** Primary host cannot resign — must transfer ownership first */
  | 'PRIMARY_HOST_CANNOT_RESIGN'
  /** Rate limit exceeded */
  | 'RATE_LIMIT_EXCEEDED'
  /** Target user for ownership transfer is not an accepted co-host on this event */
  | 'TRANSFER_TARGET_NOT_CO_HOST'
  /** User is not authenticated */
  | 'UNAUTHORIZED'
  /** Validation error (invalid input) */
  | 'VALIDATION_ERROR';

export type Event = {
  __typename?: 'Event';
  /** Optional reason provided by host when cancelling the event */
  cancellationReason?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the event was cancelled (null if not cancelled) */
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  /** Accepted co-hosts for this event (empty list if no co-hosts). */
  coHosts: Array<CoHostMember>;
  createdAt: Scalars['DateTime']['output'];
  /** Nullable for DRAFT and CANCELLED events */
  date?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dressCode?: Maybe<Scalars['String']['output']>;
  endTime?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use primaryHost instead. Will be removed after v2.0. */
  host: User;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['URL']['output']>;
  /** Optional display name for the event link (e.g. 'Gift Registry'). Null if no link set. */
  linkName?: Maybe<Scalars['String']['output']>;
  /** Optional URL for the event link. Null if no link set. */
  linkUrl?: Maybe<Scalars['String']['output']>;
  /** Event location (null for name-only DRAFT events that haven't filled in location yet) */
  location?: Maybe<Location>;
  maxAttendeesPerInvitation?: Maybe<Scalars['Int']['output']>;
  /** Per-event guest limit (null = use system default) */
  maxGuests?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  /** The primary owner of this event. */
  primaryHost: User;
  /** Nullable for DRAFT and CANCELLED events */
  rsvpDeadline?: Maybe<Scalars['Date']['output']>;
  specialInstructions?: Maybe<Scalars['String']['output']>;
  /** Nullable for DRAFT and CANCELLED events */
  startTime?: Maybe<Scalars['String']['output']>;
  status: EventStatus;
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Detailed view of a single event for the host, including attendee lists and follow-ups. */
export type EventDetails = {
  __typename?: 'EventDetails';
  /** RSVP summary counts */
  accepted: Scalars['Int']['output'];
  acceptedAdultsCount?: Maybe<Scalars['Int']['output']>;
  /** Attendee lists grouped by RSVP status */
  acceptedAttendees: Array<AttendeeDetail>;
  acceptedGuestCount?: Maybe<Scalars['Int']['output']>;
  acceptedKidsCount?: Maybe<Scalars['Int']['output']>;
  /** Whether the caller can add attendees. */
  canAddAttendees: Scalars['Boolean']['output'];
  /** Whether the caller can cancel the event. */
  canCancel: Scalars['Boolean']['output'];
  /** Whether the caller can edit event details. */
  canEdit: Scalars['Boolean']['output'];
  /** Whether the caller can manage co-hosts (invite, remove, transfer). */
  canManageCoHosts: Scalars['Boolean']['output'];
  /** Whether the caller can permanently delete the event. */
  canPermanentDelete: Scalars['Boolean']['output'];
  /** Whether the caller can send reminders. */
  canSendReminders: Scalars['Boolean']['output'];
  cancellationReason?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  /** Accepted co-hosts for this event. */
  coHosts: Array<CoHostMember>;
  declined: Scalars['Int']['output'];
  declinedAttendees: Array<AttendeeDetail>;
  dressCode?: Maybe<Scalars['String']['output']>;
  endTime?: Maybe<Scalars['String']['output']>;
  eventDate?: Maybe<Scalars['String']['output']>;
  eventDescription?: Maybe<Scalars['String']['output']>;
  eventId: Scalars['ID']['output'];
  eventLocation?: Maybe<Scalars['String']['output']>;
  eventName: Scalars['String']['output'];
  eventStatus: EventStatus;
  /** Follow-up action items */
  followUpItems: Array<FollowUpItem>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Link conversion rate as a ratio (0.0 to 1.0). Multiply by 100 for percentage display. */
  linkConversionRate: Scalars['Float']['output'];
  /** Display name of the optional link (e.g., 'Gift Registry'). Null if no link set. */
  linkName?: Maybe<Scalars['String']['output']>;
  /** URL of the optional link. Null if no link set. */
  linkUrl?: Maybe<Scalars['String']['output']>;
  locationAddress?: Maybe<Scalars['String']['output']>;
  locationCity?: Maybe<Scalars['String']['output']>;
  locationState?: Maybe<Scalars['String']['output']>;
  locationZipCode?: Maybe<Scalars['String']['output']>;
  maxAttendeesPerInvitation?: Maybe<Scalars['Int']['output']>;
  /** Maximum guests allowed per event (configurable limit) */
  maxGuestsAllowed: Scalars['Int']['output'];
  /** The caller's role on this event (PRIMARY or CO_HOST). */
  myRole: EventHostRole;
  pending: Scalars['Int']['output'];
  pendingAttendees: Array<AttendeeDetail>;
  /** Pending co-host invitations (visible to PRIMARY only, empty for CO_HOST). */
  pendingCoHostInvites: Array<PendingCoHostInvite>;
  /** Public link analytics */
  publicLinkViewCount: Scalars['Int']['output'];
  publicRsvpToken?: Maybe<Scalars['ID']['output']>;
  publicRsvpUrl?: Maybe<Scalars['String']['output']>;
  responseRate: Scalars['Float']['output'];
  rsvpDeadline?: Maybe<Scalars['Date']['output']>;
  rsvpsViaLinkCount: Scalars['Int']['output'];
  /** True when the event has an optional link configured (linkName + linkUrl both set). */
  showOptionalLink: Scalars['Boolean']['output'];
  startTime?: Maybe<Scalars['String']['output']>;
  tentative: Scalars['Int']['output'];
  tentativeAttendees: Array<AttendeeDetail>;
  thankYouSentAt?: Maybe<Scalars['DateTime']['output']>;
  timezone: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

/** The role a user plays as a host on an event. */
export type EventHostRole =
  /** A co-host invited by the primary host. Can manage invitations and RSVPs but cannot delete the event. */
  | 'CO_HOST'
  /** The original creator and owner of the event. Can transfer ownership and manage co-hosts. */
  | 'PRIMARY';

/**
 * Public view of an event for guests arriving via the generic RSVP link.
 * Does not require authentication.
 */
export type EventPublicView = {
  __typename?: 'EventPublicView';
  /**
   * True when a guest can submit an RSVP: event is CREATED, today is on or before the RSVP
   * deadline (if set), and today is on or before the event date (if set).
   */
  canRsvp: Scalars['Boolean']['output'];
  /** Host-provided reason for cancellation (null if not cancelled or no reason given) */
  cancellationReason?: Maybe<Scalars['String']['output']>;
  /** Current number of guests (invitations) for this event */
  currentGuestCount: Scalars['Int']['output'];
  date?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dressCode?: Maybe<Scalars['String']['output']>;
  endTime?: Maybe<Scalars['String']['output']>;
  eventId: Scalars['ID']['output'];
  eventName: Scalars['String']['output'];
  /** Event status — guests check this to detect cancellation before rendering the RSVP form */
  eventStatus: EventStatus;
  /** Pre-formatted display string of all host names (e.g. 'Alice, Bob, and Carol'). */
  hostDisplayName: Scalars['String']['output'];
  /** @deprecated Use hostDisplayName instead. Will be removed after v2.0. */
  hostFirstName: Scalars['String']['output'];
  /** All active hosts for this event, ordered: primary first. */
  hosts: Array<PublicHostInfo>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Optional link display name (e.g. 'Gift Registry'). Null if link should not be shown. */
  linkName?: Maybe<Scalars['String']['output']>;
  /** Optional link URL. Null if link should not be shown. */
  linkUrl?: Maybe<Scalars['String']['output']>;
  location: Location;
  maxAttendeesPerInvitation?: Maybe<Scalars['Int']['output']>;
  /** Maximum guests allowed per event (from config). Null if no limit configured. */
  maxGuestsAllowed?: Maybe<Scalars['Int']['output']>;
  rsvpDeadline?: Maybe<Scalars['Date']['output']>;
  rsvpDeadlinePassed: Scalars['Boolean']['output'];
  /**
   * True when the optional event link should be shown on this public RSVP page.
   * Requires: link is set AND canRsvp is true (event is CREATED, deadline/date not passed).
   */
  showOptionalLink: Scalars['Boolean']['output'];
  specialInstructions?: Maybe<Scalars['String']['output']>;
  startTime?: Maybe<Scalars['String']['output']>;
  timezone: Scalars['String']['output'];
};

export type EventStatus =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'CREATED'
  | 'DRAFT';

/** Summary of RSVP counts for a single event on the host dashboard. */
export type EventSummary = {
  __typename?: 'EventSummary';
  /** Number of accepted invitations */
  accepted: Scalars['Int']['output'];
  /** Number of declined invitations */
  declined: Scalars['Int']['output'];
  /** Event date (ISO format). Null for DRAFT or CANCELLED events without a date. */
  eventDate?: Maybe<Scalars['String']['output']>;
  /** Event ID */
  eventId: Scalars['ID']['output'];
  /** Event venue/location name */
  eventLocation?: Maybe<Scalars['String']['output']>;
  /** Event name */
  eventName: Scalars['String']['output'];
  /** Event status (DRAFT, CREATED, CANCELLED) */
  eventStatus: EventStatus;
  /** True when the event has an optional link configured (linkName + linkUrl set). */
  hasOptionalLink: Scalars['Boolean']['output'];
  /** Display name of the optional link (e.g. 'Gift Registry'). Null if no link set. */
  linkName?: Maybe<Scalars['String']['output']>;
  /** The caller's role on this event (PRIMARY or CO_HOST). */
  myRole: EventHostRole;
  /** Number of pending invitations */
  pending: Scalars['Int']['output'];
  /**
   * First name of the event's primary host. Useful for co-host views
   * that display "Co-hosting with {name}".
   */
  primaryHostFirstName?: Maybe<Scalars['String']['output']>;
  /** Total number of invitations */
  total: Scalars['Int']['output'];
};

export type FailedAttendee = {
  __typename?: 'FailedAttendee';
  guestEmail?: Maybe<Scalars['String']['output']>;
  guestName: Scalars['String']['output'];
  guestPhone?: Maybe<Scalars['String']['output']>;
  reason: Scalars['String']['output'];
};

/** A single piece of user-submitted feedback. */
export type Feedback = {
  __typename?: 'Feedback';
  /** Feedback category (BUG, FEATURE_REQUEST, GENERAL). */
  category: FeedbackCategory;
  /** Whether the user consented to be contacted about this feedback. */
  contactable: Scalars['Boolean']['output'];
  /** Timestamp when the feedback was submitted. */
  createdAt: Scalars['DateTime']['output'];
  /** Unique feedback identifier (UUID). */
  id: Scalars['ID']['output'];
  /** Feedback message text (10–1000 characters). */
  message: Scalars['String']['output'];
  /** Whether an admin has read this feedback entry. */
  read: Scalars['Boolean']['output'];
  /** Timestamp when the feedback was marked as read (null if unread). */
  readAt?: Maybe<Scalars['DateTime']['output']>;
  /** Basic profile of the user who submitted the feedback. */
  user: FeedbackUser;
};

/** Category of user-submitted feedback. */
export type FeedbackCategory =
  | 'BUG'
  | 'FEATURE_REQUEST'
  | 'GENERAL';

/** Minimal user information attached to a feedback entry (admin view only). */
export type FeedbackUser = {
  __typename?: 'FeedbackUser';
  /** User's email address. */
  email: Scalars['String']['output'];
  /** User's first name. */
  firstName: Scalars['String']['output'];
  /** User's last name. */
  lastName: Scalars['String']['output'];
};

/** Auto-generated follow-up action item for the host. */
export type FollowUpItem = {
  __typename?: 'FollowUpItem';
  description: Scalars['String']['output'];
  dismissed: Scalars['Boolean']['output'];
  dismissedAt?: Maybe<Scalars['String']['output']>;
  hostNotes?: Maybe<Scalars['String']['output']>;
  invitationId?: Maybe<Scalars['String']['output']>;
  itemKey: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type ForgotPasswordPayload = {
  __typename?: 'ForgotPasswordPayload';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  ttlMinutes?: Maybe<Scalars['Int']['output']>;
};

export type GoogleSignInAccountNotFound = {
  __typename?: 'GoogleSignInAccountNotFound';
  message: Scalars['String']['output'];
};

export type GoogleSignInError = {
  __typename?: 'GoogleSignInError';
  message: Scalars['String']['output'];
  reason: GoogleSignInErrorReason;
};

export type GoogleSignInErrorReason =
  | 'EMAIL_NOT_VERIFIED'
  | 'INVALID_TOKEN';

/**  Google Account Linking — Inputs */
export type GoogleSignInInput = {
  /** Google ID token from Expo AuthSession / Google Sign-In SDK */
  idToken: Scalars['String']['input'];
};

export type GoogleSignInLinkRequired = {
  __typename?: 'GoogleSignInLinkRequired';
  email: Scalars['String']['output'];
  linkingToken: Scalars['String']['output'];
};

/**  Google Account Linking — Types */
export type GoogleSignInResult = GoogleSignInAccountNotFound | GoogleSignInError | GoogleSignInLinkRequired | GoogleSignInSuccess;

export type GoogleSignInSuccess = {
  __typename?: 'GoogleSignInSuccess';
  accessToken: Scalars['String']['output'];
  /**
   * The authenticated user's preferred-language BCP-47 tag (e.g. "en", "es-419").
   * Frontend awaits setLocale(preferredLanguage) BEFORE navigating post-login so the
   * dashboard renders in the user's chosen language. Non-null; backfilled rows default to "en".
   */
  preferredLanguage: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type GuestCount = {
  __typename?: 'GuestCount';
  adults: Scalars['Int']['output'];
  kids: Scalars['Int']['output'];
};

export type GuestCountInput = {
  adults: Scalars['Int']['input'];
  kids: Scalars['Int']['input'];
};

export type HealthStatus = {
  __typename?: 'HealthStatus';
  /** Current health status (OK, DEGRADED, ERROR) */
  status: Scalars['String']['output'];
  /** Timestamp of the health check */
  timestamp: Scalars['DateTime']['output'];
};

/** Host usage limits for proactive UI display. */
export type HostLimits = {
  __typename?: 'HostLimits';
  /** Number of active events (DRAFT + CREATED) */
  activeEventCount: Scalars['Int']['output'];
  /** Number of accepted + pending co-hosts on the queried event. */
  currentCoHosts: Scalars['Int']['output'];
  /** Maximum co-hosts allowed per event. */
  maxCoHosts: Scalars['Int']['output'];
  /** Maximum events allowed. Null means unlimited (TEST_USER or ADMIN accounts). */
  maxEventsAllowed?: Maybe<Scalars['Int']['output']>;
  /** Remaining co-host slots available. */
  remainingCoHostSlots: Scalars['Int']['output'];
};

export type ImageUploadUrlInput = {
  contentType: Scalars['String']['input'];
  eventId: Scalars['ID']['input'];
  filename: Scalars['String']['input'];
};

export type ImageUploadUrlPayload = {
  __typename?: 'ImageUploadUrlPayload';
  expiresIn: Scalars['Int']['output'];
  imageKey: Scalars['String']['output'];
  imageUrl: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type Invitation = {
  __typename?: 'Invitation';
  /**
   * True when the guest can edit their existing RSVP: RSVP already exists AND
   * today is on or before the event date.
   */
  canEditRsvp: Scalars['Boolean']['output'];
  /**
   * True when the guest can submit a first RSVP: no existing RSVP AND today is
   * on or before the RSVP deadline.
   */
  canRsvp: Scalars['Boolean']['output'];
  /**
   * The cancellation reason of the associated event (null if not cancelled).
   * Provided directly on Invitation for guest RSVP pages.
   */
  cancellationReason?: Maybe<Scalars['String']['output']>;
  event: Event;
  /**
   * The status of the associated event. Provided directly on Invitation for
   * convenient checking on guest RSVP pages without traversing to event.
   */
  eventStatus: EventStatus;
  guestEmail?: Maybe<Scalars['Email']['output']>;
  guestName: Scalars['String']['output'];
  guestPhone?: Maybe<Scalars['String']['output']>;
  host: User;
  id: Scalars['ID']['output'];
  maxAttendeesPerInvitation?: Maybe<Scalars['Int']['output']>;
  rsvp?: Maybe<Rsvp>;
  rsvpDeadline: Scalars['Date']['output'];
  /**
   * True when the optional event link should be shown to this guest.
   * Requires: link is set, event is CREATED, deadline/date not passed, guest not declined.
   */
  showOptionalLink: Scalars['Boolean']['output'];
  source?: Maybe<InvitationSource>;
  specialInstructions?: Maybe<Scalars['String']['output']>;
  status: InvitationStatus;
  /**
   * The authenticated viewer's email address. Only populated when the invitation
   * is fetched via `myInvitation` (authenticated query). Null for public access
   * via `invitation(id)`. Used by frontend for Report Event without requiring
   * a separate user profile query.
   */
  viewerEmail?: Maybe<Scalars['String']['output']>;
};

export type InvitationSource =
  | 'HOST'
  | 'LINK';

export type InvitationStatus =
  | 'ACCEPTED'
  | 'DECLINED'
  | 'PENDING'
  | 'TENTATIVE';

/**
 * Input for inviting a co-host to an event by email.
 * Primary host only. Max 2 co-hosts per event (enforced server-side).
 */
export type InviteCoHostInput = {
  /** Email address of the user to invite as co-host. */
  email: Scalars['Email']['input'];
  eventId: Scalars['ID']['input'];
};

export type InviteCoHostPayload = {
  __typename?: 'InviteCoHostPayload';
  errors: Array<UserError>;
  success: Scalars['Boolean']['output'];
};

export type LinkAppleAccountError = {
  __typename?: 'LinkAppleAccountError';
  message: Scalars['String']['output'];
  reason: LinkAppleAccountErrorReason;
};

export type LinkAppleAccountErrorReason =
  | 'ALREADY_LINKED'
  | 'LINKING_TOKEN_EXPIRED'
  | 'LINKING_TOKEN_INVALID'
  | 'USER_ALREADY_HAS_APPLE';

export type LinkAppleAccountInput = {
  /** Linking token returned by appleSignIn when LINK_REQUIRED */
  linkingToken: Scalars['String']['input'];
};

export type LinkAppleAccountResult = LinkAppleAccountError | LinkAppleAccountSuccess;

export type LinkAppleAccountSuccess = {
  __typename?: 'LinkAppleAccountSuccess';
  accessToken: Scalars['String']['output'];
  /**
   * The authenticated user's preferred-language BCP-47 tag (e.g. "en", "es-419").
   * Frontend awaits setLocale(preferredLanguage) BEFORE navigating post-login so the
   * dashboard renders in the user's chosen language. Non-null; backfilled rows default to "en".
   */
  preferredLanguage: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type LinkGoogleAccountError = {
  __typename?: 'LinkGoogleAccountError';
  message: Scalars['String']['output'];
  reason: LinkGoogleAccountErrorReason;
};

export type LinkGoogleAccountErrorReason =
  | 'ALREADY_LINKED'
  | 'LINKING_TOKEN_EXPIRED'
  | 'LINKING_TOKEN_INVALID'
  | 'USER_ALREADY_HAS_GOOGLE';

export type LinkGoogleAccountInput = {
  /** Linking token returned by googleSignIn when LINK_REQUIRED */
  linkingToken: Scalars['String']['input'];
};

export type LinkGoogleAccountResult = LinkGoogleAccountError | LinkGoogleAccountSuccess;

export type LinkGoogleAccountSuccess = {
  __typename?: 'LinkGoogleAccountSuccess';
  accessToken: Scalars['String']['output'];
  /**
   * The authenticated user's preferred-language BCP-47 tag (e.g. "en", "es-419").
   * Frontend awaits setLocale(preferredLanguage) BEFORE navigating post-login so the
   * dashboard renders in the user's chosen language. Non-null; backfilled rows default to "en".
   */
  preferredLanguage: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Location = {
  __typename?: 'Location';
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  coordinates?: Maybe<Coordinates>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  state: Scalars['String']['output'];
  zipCode: Scalars['String']['output'];
};

/** Input for event location. */
export type LocationInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  name: Scalars['String']['input'];
  state: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
};

/** Input for the login mutation (email + password authentication) */
export type LoginInput = {
  /** Cloudflare Turnstile CAPTCHA token (web only; omit on native mobile) */
  captchaToken?: InputMaybe<Scalars['String']['input']>;
  /** User's email address */
  email: Scalars['String']['input'];
  /** User's plaintext password (transmitted over HTTPS, verified against bcrypt hash) */
  password: Scalars['String']['input'];
};

/**
 * Payload returned after a successful login.
 * Contains short-lived access token and long-lived refresh token.
 */
export type LoginPayload = {
  __typename?: 'LoginPayload';
  /** JWT access token (short-lived, use in Authorization header) */
  accessToken: Scalars['String']['output'];
  /**
   * The authenticated user's preferred-language BCP-47 tag (e.g. "en", "es-419").
   * Frontend awaits setLocale(preferredLanguage) BEFORE navigating to the post-login screen
   * so the dashboard renders in the user's chosen language regardless of which locale the
   * device was set to. Non-null because backfilled rows default to "en".
   */
  preferredLanguage: Scalars['String']['output'];
  /** JWT refresh token (long-lived, use to obtain new access tokens) */
  refreshToken: Scalars['String']['output'];
};

/** Payload returned after a logout attempt. */
export type LogoutPayload = {
  __typename?: 'LogoutPayload';
  /**
   * Whether the logout was processed successfully.
   * Always true — logout is idempotent and never fails from the caller's perspective.
   */
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Placeholder mutation (will be replaced with actual mutations) */
  _empty?: Maybe<Scalars['String']['output']>;
  /** Accept a pending co-host invitation. Caller must be the invited user (JWT). */
  acceptCoHostInvite: AcceptCoHostInvitePayload;
  /**
   * Add new attendees to an already-created event.
   * Deduplicates by email. Returns created, duplicate, and failed attendees.
   */
  addAttendees: AddAttendeesPayload;
  /**
   * Sign in with Apple. Returns one of:
   * - AppleSignInSuccess: already linked, returns auth tokens
   * - AppleSignInLinkRequired: email match found, returns linking token for consent
   * - AppleSignInAccountNotFound: no matching account, register first
   * - AppleSignInRelayEmailNotSupported: Apple private-relay email; user must share their real email
   * - AppleSignInError: token invalid or email not verified
   */
  appleSignIn: AppleSignInResult;
  /**
   * Mark a CREATED event as COMPLETED. Only the event host can complete.
   * Returns celebration data (accepted count, total invitees) for the frontend modal.
   */
  completeEvent: CompleteEventPayload;
  /**
   * Step 2 of account deletion: verifies the OTP and permanently deletes the account and all data.
   * Returns FORBIDDEN (DELETION_VERIFICATION_FAILED) if the code is wrong, expired, or max attempts reached.
   */
  confirmAccountDeletion: ConfirmAccountDeletionPayload;
  /**
   * Confirm an image upload after S3 PUT completes.
   * Validates magic bytes, checks file size, strips EXIF metadata (JPEG), and tags as confirmed.
   * Returns the confirmed image URL on success, or an error code on validation failure.
   */
  confirmImageUpload: ConfirmImageUploadPayload;
  /**
   * Create a new banner. Admin-only. Content is sanitized server-side via jsoup Safelist before
   * persistence and rejected if longer than 2000 characters post-sanitization.
   * Returns FORBIDDEN if the authenticated user is not an ADMIN.
   * Returns BAD_REQUEST if content exceeds the length cap or is empty after sanitization.
   */
  createBanner: Banner;
  /**
   * Create a new event (draft or published).
   * Persists the event and its location to the database.
   */
  createEvent: CreateEventPayload;
  /**
   * Create a new test user account. Admin-only.
   * Returns UNAUTHORIZED if not authenticated.
   * Returns FORBIDDEN if the authenticated user is not an ADMIN.
   * Returns BAD_REQUEST if the email is already in use.
   */
  createTestUser: CreateTestUserPayload;
  /** Decline a pending co-host invitation. Caller must be the invited user (JWT). */
  declineCoHostInvite: DeclineCoHostInvitePayload;
  /**
   * Permanently delete a banner. Admin-only. Cascades to viewer dismissal records.
   * Returns true on success.
   */
  deleteBanner: Scalars['Boolean']['output'];
  /**
   * Delete an event and all associated data (invitations, RSVPs, locations).
   * Sends cancellation notifications to invitees if any exist.
   * Only the event host can delete.
   */
  deleteEvent: DeleteEventPayload;
  /**
   * Delete a test user account and all associated data. Admin-only.
   * Returns UNAUTHORIZED if not authenticated.
   * Returns FORBIDDEN if the authenticated user is not an ADMIN.
   * Returns BAD_REQUEST if the target user does not exist or is not a TEST_USER.
   */
  deleteTestUser: DeleteTestUserPayload;
  /**
   * Disable the generic RSVP link for an event. Invalidates the shareable URL.
   * Only the event host can disable (authenticated via JWT).
   */
  disableEventLink: DisableEventLinkPayload;
  /**
   * Record a viewer-side dismissal of the given banner. Requires authentication.
   * Idempotent — repeat calls are no-ops.
   * Returns UNAUTHORIZED if not authenticated.
   */
  dismissBanner: Scalars['Boolean']['output'];
  /** Dismiss a follow-up action item with optional host notes. */
  dismissFollowUp: DismissFollowUpPayload;
  /**
   * Create a new banner copied from the referenced source banner, overlaid with the supplied
   * input. Admin-only.
   */
  duplicateBanner: Banner;
  /**
   * Enable the generic RSVP link for an event. Generates a shareable URL.
   * Only the event host can enable (authenticated via JWT).
   */
  enableEventLink: EnableEventLinkPayload;
  /**
   * Request a password reset OTP code sent to the given email.
   * Returns success + ttlMinutes for frontend countdown timer.
   * Enumeration-safe: always returns success even if email doesn't exist.
   */
  forgotPassword: ForgotPasswordPayload;
  /**
   * Generate a presigned S3 URL for uploading an event image.
   * Only the event host can request upload URLs.
   * Returns an upload URL (PUT), the permanent image URL, the S3 key, and expiration time.
   */
  getImageUploadUrl: ImageUploadUrlPayload;
  /**
   * Sign in with Google. Returns one of:
   * - GoogleSignInSuccess: already linked, returns auth tokens
   * - GoogleSignInLinkRequired: email match found, returns linking token for consent
   * - GoogleSignInAccountNotFound: no matching account, register first
   * - GoogleSignInError: token invalid or email not verified
   */
  googleSignIn: GoogleSignInResult;
  /**
   * Invite a user as co-host for an event. Primary host only. Max 2 co-hosts.
   * The invited user receives an email with an acceptance link (24-hour expiry).
   */
  inviteCoHost: InviteCoHostPayload;
  /**
   * Link an Apple account after user consent (second step of Apple sign-in).
   * Uses the linking token from appleSignIn's LINK_REQUIRED response.
   */
  linkAppleAccount: LinkAppleAccountResult;
  /**
   * Link a Google account after user consent (second step of Google sign-in).
   * Uses the linking token from googleSignIn's LINK_REQUIRED response.
   */
  linkGoogleAccount: LinkGoogleAccountResult;
  /** Authenticate with email and password, returns JWT access and refresh tokens */
  login: LoginPayload;
  /**
   * Log out the current user. Clears server-side audit trail.
   * Idempotent — always succeeds even if already logged out.
   */
  logout: LogoutPayload;
  /**
   * Mark a feedback entry as read. Admin-only.
   * Returns UNAUTHORIZED if not authenticated.
   * Returns FORBIDDEN if the authenticated user is not an ADMIN.
   * Returns BAD_REQUEST if the feedback ID is not found.
   */
  markFeedbackRead: Feedback;
  /** Mute or unmute co-host-specific notifications for an event. */
  muteCoHostNotifications: MuteCoHostNotificationsPayload;
  /**
   * Permanently delete a cancelled event and all associated data.
   * This is an irreversible hard delete — the event, invitations, RSVPs,
   * and all related records are removed from the database.
   * Only the event host can delete. Only CANCELLED events are eligible.
   */
  permanentlyDeleteEvent: PermanentlyDeleteEventPayload;
  /** Transition a banner from DRAFT to PUBLISHED. Admin-only. Idempotent if already published. */
  publishBanner: Banner;
  /**
   * Record that a guest viewed their invitation (unauthenticated, fire-and-forget).
   * Always returns success:true — errors are silently swallowed.
   */
  recordInvitationView: RecordViewPayload;
  /**
   * Record a view of the public RSVP link (unauthenticated, fire-and-forget).
   * Always returns success:true — errors are silently swallowed.
   */
  recordPublicLinkView: RecordViewPayload;
  /**
   * Exchange a valid refresh token for a new access token and rotated refresh token.
   * Does NOT require Authorization header — the refresh token itself is the credential.
   * Returns UNAUTHORIZED if the refresh token is invalid, expired, or has wrong type.
   */
  refreshToken: RefreshTokenPayload;
  /**
   * Register a device push token for the authenticated user.
   * Push notifications are mobile-only (iOS + Android).
   */
  registerPushToken: RegisterPushTokenPayload;
  /**
   * Register a new user account with email and password.
   * Returns a success message — user must verify email and log in separately.
   */
  registerUser: RegisterPayload;
  /** Remove an accepted co-host from an event. Primary host only. */
  removeCoHost: RemoveCoHostPayload;
  /**
   * Report an event for objectionable content. Sends report to support team.
   * No authentication required (guests can report from public RSVP page).
   */
  reportEvent: ReportEventPayload;
  /**
   * Step 1 of account deletion: sends a 6-digit OTP code to the authenticated user's email.
   * Rate limited to 3 requests per hour.
   * Returns BAD_REQUEST (RATE_LIMIT_EXCEEDED) when limit is hit.
   */
  requestAccountDeletion: RequestAccountDeletionPayload;
  /**
   * Re-send an existing invitation to a guest.
   * Works for PENDING, DECLINED, and TENTATIVE invitations.
   * Enforces 24-hour cooldown (shared with sendReminder).
   */
  resendInvitation: ResendInvitationPayload;
  /**
   * Resend email verification code. Rate limited to 3 per hour.
   * Returns BAD_REQUEST (RATE_LIMIT_EXCEEDED extension code) when limit is hit.
   */
  resendVerificationCode: ResendVerificationCodePayload;
  /**
   * Reset password using a 6-digit OTP code and new password.
   * Returns FORBIDDEN if the code is invalid, expired, or already used.
   */
  resetPassword: ResetPasswordPayload;
  /** Resign from a co-host role. CO_HOST only (PRIMARY cannot resign, must transfer first). */
  resignAsCoHost: ResignAsCoHostPayload;
  /** Respond to an invitation with RSVP status and guest details */
  respondToInvitation: RespondToInvitationPayload;
  /** Revoke a pending co-host invitation by email. Primary host only. */
  revokePendingInvitation: RevokePendingInvitePayload;
  /**
   * Guest self-RSVPs via generic event link (unauthenticated).
   * Creates or merges an invitation record and records the RSVP response.
   */
  rsvpViaEventLink: RsvpViaEventLinkPayload;
  /**
   * Send reminders to all pending invitees for an event.
   * Skips invitations within 24-hour cooldown.
   */
  sendBulkReminder: SendBulkReminderPayload;
  /**
   * Send a reminder to a pending invitee.
   * Enforces 24-hour cooldown between reminders.
   */
  sendReminder: SendReminderPayload;
  /**
   * Send thank-you messages to all accepted invitees for a completed event.
   * Can only be sent once per event — subsequent calls will fail.
   */
  sendThankYou: SendThankYouPayload;
  /**
   * Submit feedback from any authenticated user.
   * Returns UNAUTHORIZED if not authenticated.
   * Returns BAD_REQUEST if message length is outside 10-1000 characters.
   */
  submitFeedback: SubmitFeedbackPayload;
  /**
   * Transfer primary ownership of an event to an accepted co-host.
   * Caller (current primary) derived from JWT. Also updates events.host_id.
   */
  transferOwnership: TransferOwnershipPayload;
  /** Undo a follow-up item dismissal (re-activate it). */
  undismissFollowUp: DismissFollowUpPayload;
  /** Transition a banner from PUBLISHED to DRAFT. Admin-only. Idempotent if already draft. */
  unpublishBanner: Banner;
  /** Unregister a device push token (e.g., on logout or token rotation). */
  unregisterPushToken: UnregisterPushTokenPayload;
  /**
   * Update an existing event (edit fields or change status).
   * Only the event host can update. Enforces status transition rules:
   * DRAFT to DRAFT, DRAFT to CREATED, CREATED to CREATED are permitted.
   */
  updateEvent: UpdateEventPayload;
  /**
   * Update notification preferences for the authenticated user.
   * OTP types (VERIFICATION, PASSWORD_RESET, ACCOUNT_DELETION_OTP) cannot have email disabled.
   */
  updateNotificationPreferences: UpdateNotificationPreferencesPayload;
  /**
   * Update an existing test user's profile fields. Admin-only.
   * Returns UNAUTHORIZED if not authenticated.
   * Returns FORBIDDEN if the authenticated user is not an ADMIN.
   * Returns BAD_REQUEST if the target user does not exist or is not a TEST_USER.
   */
  updateTestUser: UpdateTestUserPayload;
  /**
   * Verify email with 6-digit OTP code sent during registration.
   * Returns FORBIDDEN (EMAIL_NOT_VERIFIED extension code) if code is wrong or expired.
   */
  verifyEmail: VerifyEmailPayload;
};


export type MutationAcceptCoHostInviteArgs = {
  input: AcceptCoHostInviteInput;
};


export type MutationAddAttendeesArgs = {
  input: AddAttendeesInput;
};


export type MutationAppleSignInArgs = {
  input: AppleSignInInput;
};


export type MutationCompleteEventArgs = {
  input: CompleteEventInput;
};


export type MutationConfirmAccountDeletionArgs = {
  input: ConfirmAccountDeletionInput;
};


export type MutationConfirmImageUploadArgs = {
  input: ConfirmImageUploadInput;
};


export type MutationCreateBannerArgs = {
  input: CreateBannerInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateTestUserArgs = {
  input: CreateTestUserInput;
};


export type MutationDeclineCoHostInviteArgs = {
  input: DeclineCoHostInviteInput;
};


export type MutationDeleteBannerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEventArgs = {
  input: DeleteEventInput;
};


export type MutationDeleteTestUserArgs = {
  input: DeleteTestUserInput;
};


export type MutationDisableEventLinkArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationDismissBannerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDismissFollowUpArgs = {
  input: DismissFollowUpInput;
};


export type MutationDuplicateBannerArgs = {
  input: CreateBannerInput;
  sourceId: Scalars['ID']['input'];
};


export type MutationEnableEventLinkArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationGetImageUploadUrlArgs = {
  input: ImageUploadUrlInput;
};


export type MutationGoogleSignInArgs = {
  input: GoogleSignInInput;
};


export type MutationInviteCoHostArgs = {
  input: InviteCoHostInput;
};


export type MutationLinkAppleAccountArgs = {
  input: LinkAppleAccountInput;
};


export type MutationLinkGoogleAccountArgs = {
  input: LinkGoogleAccountInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMarkFeedbackReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMuteCoHostNotificationsArgs = {
  input: MuteCoHostNotificationsInput;
};


export type MutationPermanentlyDeleteEventArgs = {
  input: PermanentlyDeleteEventInput;
};


export type MutationPublishBannerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRecordInvitationViewArgs = {
  input: RecordInvitationViewInput;
};


export type MutationRecordPublicLinkViewArgs = {
  input: RecordPublicLinkViewInput;
};


export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};


export type MutationRegisterPushTokenArgs = {
  input: RegisterPushTokenInput;
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};


export type MutationRemoveCoHostArgs = {
  input: RemoveCoHostInput;
};


export type MutationReportEventArgs = {
  input: ReportEventInput;
};


export type MutationResendInvitationArgs = {
  input: ResendInvitationInput;
};


export type MutationResendVerificationCodeArgs = {
  input: ResendVerificationCodeInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationResignAsCoHostArgs = {
  input: ResignAsCoHostInput;
};


export type MutationRespondToInvitationArgs = {
  input: RespondToInvitationInput;
};


export type MutationRevokePendingInvitationArgs = {
  input: RevokePendingInviteInput;
};


export type MutationRsvpViaEventLinkArgs = {
  input: RsvpViaEventLinkInput;
};


export type MutationSendBulkReminderArgs = {
  input: SendBulkReminderInput;
};


export type MutationSendReminderArgs = {
  input: SendReminderInput;
};


export type MutationSendThankYouArgs = {
  input: SendThankYouInput;
};


export type MutationSubmitFeedbackArgs = {
  input: SubmitFeedbackInput;
};


export type MutationTransferOwnershipArgs = {
  input: TransferOwnershipInput;
};


export type MutationUndismissFollowUpArgs = {
  input: DismissFollowUpInput;
};


export type MutationUnpublishBannerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnregisterPushTokenArgs = {
  input: UnregisterPushTokenInput;
};


export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};


export type MutationUpdateNotificationPreferencesArgs = {
  input: UpdateNotificationPreferencesInput;
};


export type MutationUpdateTestUserArgs = {
  input: UpdateTestUserInput;
};


export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput;
};

/**
 * Input for muting or unmuting co-host-specific notifications on an event.
 * Caller derived from JWT.
 */
export type MuteCoHostNotificationsInput = {
  eventId: Scalars['ID']['input'];
  muted: Scalars['Boolean']['input'];
};

export type MuteCoHostNotificationsPayload = {
  __typename?: 'MuteCoHostNotificationsPayload';
  errors: Array<UserError>;
  success: Scalars['Boolean']['output'];
};

/**
 * A single invitation as seen from the guest's perspective, for the "Invited" tab.
 * All event and host fields are pre-fetched and flattened.
 */
export type MyInvitation = {
  __typename?: 'MyInvitation';
  eventDate?: Maybe<Scalars['String']['output']>;
  eventImageUrl?: Maybe<Scalars['String']['output']>;
  eventLocation?: Maybe<Scalars['String']['output']>;
  eventName: Scalars['String']['output'];
  eventStatus: EventStatus;
  guestCount?: Maybe<GuestCount>;
  /** Pre-formatted display string of all host names (e.g. 'Alice, Bob, and Carol'). */
  hostDisplayName: Scalars['String']['output'];
  /** @deprecated Use hostDisplayName or hosts instead. Will be removed after v2.0. */
  hostFirstName: Scalars['String']['output'];
  /** @deprecated Use hostDisplayName or hosts instead. Will be removed after v2.0. */
  hostLastName: Scalars['String']['output'];
  /** All active hosts for this event, ordered: primary first. */
  hosts: Array<PublicHostInfo>;
  invitationId: Scalars['ID']['output'];
  invitationStatus: InvitationStatus;
  rsvpDeadline: Scalars['Date']['output'];
  rsvpDeadlinePassed: Scalars['Boolean']['output'];
};

/**
 * Delivery channels for notifications.
 * Push notifications are mobile-only (iOS + Android) — expo-notifications does NOT support web.
 * SMS is reserved for future use.
 */
export type NotificationChannel =
  | 'EMAIL'
  | 'PUSH'
  | 'SMS';

export type NotificationPreferenceInput = {
  channel: NotificationChannel;
  enabled: Scalars['Boolean']['input'];
  notificationType: NotificationType;
};

/** A user's notification preference for a specific type and channel. */
export type NotificationPreferenceItem = {
  __typename?: 'NotificationPreferenceItem';
  channel: NotificationChannel;
  enabled: Scalars['Boolean']['output'];
  notificationType: NotificationType;
};

/**
 * All notification preferences for the authenticated user.
 * Preferences not explicitly set default to enabled (opt-out model).
 */
export type NotificationPreferencesPayload = {
  __typename?: 'NotificationPreferencesPayload';
  preferences: Array<NotificationPreferenceItem>;
};

/**
 * Notification type categories for channel routing and preference management.
 * OTP types (VERIFICATION, PASSWORD_RESET, ACCOUNT_DELETION_OTP) are always email-only
 * and cannot be disabled by user preferences.
 */
export type NotificationType =
  | 'ACCOUNT_DELETION'
  | 'ACCOUNT_DELETION_OTP'
  | 'EVENT_CANCELLED'
  | 'INVITATION'
  | 'PASSWORD_RESET'
  | 'REMINDER'
  | 'RSVP_RESPONSE'
  | 'VERIFICATION';

/** Pagination metadata for cursor-based pagination */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Cursor pointing to the last item in the current page */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Whether there are more items after the current page */
  hasNextPage: Scalars['Boolean']['output'];
  /** Whether there are more items before the current page */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** Cursor pointing to the first item in the current page */
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** Input for cursor-based pagination */
export type PaginationInput = {
  /** Cursor to start fetching after (forward pagination) */
  after?: InputMaybe<Scalars['String']['input']>;
  /** Cursor to start fetching before (backward pagination) */
  before?: InputMaybe<Scalars['String']['input']>;
  /** Number of items to fetch after the cursor (forward pagination) */
  first?: InputMaybe<Scalars['Int']['input']>;
  /** Number of items to fetch before the cursor (backward pagination) */
  last?: InputMaybe<Scalars['Int']['input']>;
};

/** A pending co-host invitation (not yet accepted). */
export type PendingCoHostInvite = {
  __typename?: 'PendingCoHostInvite';
  email: Scalars['Email']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  invitedAt: Scalars['DateTime']['output'];
  status: CoHostInviteStatus;
};

/**
 * Input for permanently deleting a cancelled event.
 * Host ID is derived server-side from the JWT Bearer token.
 */
export type PermanentlyDeleteEventInput = {
  /** The cancelled event ID to permanently delete */
  eventId: Scalars['ID']['input'];
};

/** Result of permanently deleting an event. */
export type PermanentlyDeleteEventPayload = {
  __typename?: 'PermanentlyDeleteEventPayload';
  /** Human-readable message describing the result */
  message: Scalars['String']['output'];
  /** Whether the event was permanently deleted successfully */
  success: Scalars['Boolean']['output'];
};

/** Minimal host info for public-facing pages (no sensitive data). */
export type PublicHostInfo = {
  __typename?: 'PublicHostInfo';
  firstName: Scalars['String']['output'];
  role: EventHostRole;
};

export type Query = {
  __typename?: 'Query';
  /**
   * Get a summary of the authenticated user's account data (event count, invitation count).
   * Requires authentication via JWT Bearer token.
   */
  accountSummary: AccountSummary;
  /**
   * Return up to 3 banners that are currently active for the viewer.
   *
   * - Anonymous viewers receive only GLOBAL banners.
   * - Authenticated viewers receive GLOBAL + AUTHENTICATED_ONLY banners with their server-side
   *   dismissals applied.
   *
   * Both viewer classes share the same schedule + status filter (PUBLISHED, within window).
   * Ordered by `createdAt DESC`.
   *
   * Cacheable: a `Cache-Control: private, max-age=30` header is added on the HTTP response by
   * `BannerCacheControlInterceptor` so the requesting client's browser can serve this query from
   * cache for 30 seconds. `private` is required because the body varies per viewer (anonymous vs
   * authenticated scope, per-viewer dismissal filter) — a shared CDN cache would cross viewers.
   */
  activeBanners: Array<Banner>;
  /**
   * Return every banner (DRAFT and PUBLISHED), newest first. Admin-only.
   * Returns FORBIDDEN if the authenticated user is not an ADMIN.
   */
  adminBannerList: Array<Banner>;
  /**
   * Preview a co-host invitation by token (unauthenticated).
   * Shows event name, date, and primary host name before the invitee accepts.
   * Returns null if the token is invalid or does not exist.
   */
  coHostInviteDetails?: Maybe<CoHostInvitePreview>;
  /**
   * Get a single event by ID with full details including location.
   * Only the event host can access this (authenticated via JWT).
   */
  event?: Maybe<Event>;
  /**
   * Get event details via public RSVP token (unauthenticated).
   * Returns event info for the public RSVP page.
   */
  eventByPublicToken?: Maybe<EventPublicView>;
  /**
   * Get detailed event info with RSVP breakdown, attendee lists, and follow-up items.
   * Only accessible by the event host. Host ID is derived server-side from the JWT Bearer token.
   */
  eventDetails?: Maybe<EventDetails>;
  /**
   * Get all submitted feedback ordered by creation time descending. Admin-only.
   * Returns UNAUTHORIZED if not authenticated.
   * Returns FORBIDDEN if the authenticated user is not an ADMIN.
   */
  feedbackList: Array<Feedback>;
  /** Health check endpoint for monitoring */
  health: HealthStatus;
  /**
   * Get event summaries with RSVP counts for a host's dashboard.
   * Host ID is derived server-side from the JWT Bearer token.
   */
  hostDashboard: Array<EventSummary>;
  /**
   * Returns the host's current usage limits (active event count, max allowed).
   * Requires authentication.
   */
  hostLimits: HostLimits;
  /** Get an invitation by ID */
  invitation?: Maybe<Invitation>;
  /**
   * Get the authenticated user's profile.
   * Requires authentication via JWT Bearer token.
   */
  me: User;
  /**
   * Get a single invitation by ID for the authenticated user.
   * Returns the full Invitation object (including nested event and host) for the attendee detail view.
   * Requires authentication via JWT Bearer token.
   * Returns UNAUTHORIZED if not authenticated.
   * Returns FORBIDDEN if the invitation exists but does not belong to the authenticated user.
   * Returns null if no invitation with the given ID exists.
   */
  myInvitation?: Maybe<Invitation>;
  /**
   * Get all invitations addressed to the authenticated user.
   * Shows events the user has been invited to (the "Invited" tab on the guest dashboard).
   * Host ID is derived server-side from the JWT Bearer token.
   * Filters out DRAFT events and self-hosted events.
   */
  myInvitations: Array<MyInvitation>;
  /**
   * Get the authenticated user's notification preferences.
   * Preferences not returned default to enabled (opt-out model).
   * Requires authentication via JWT Bearer token.
   */
  notificationPreferences: NotificationPreferencesPayload;
  /**
   * Returns system-wide default configuration values (e.g., max invitations per event).
   * No authentication required — values are non-sensitive.
   */
  systemDefaults: SystemDefaults;
  /**
   * List all test user accounts. Admin-only.
   * Returns UNAUTHORIZED if not authenticated.
   * Returns FORBIDDEN if the authenticated user is not an ADMIN.
   */
  testUsers: Array<TestUser>;
  /**
   * Get the count of unread feedback entries. Admin-only.
   * Returns UNAUTHORIZED if not authenticated.
   * Returns FORBIDDEN if the authenticated user is not an ADMIN.
   */
  unreadFeedbackCount: Scalars['Int']['output'];
  /** Get a single user by ID */
  user?: Maybe<User>;
};


export type QueryCoHostInviteDetailsArgs = {
  token: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryEventByPublicTokenArgs = {
  token: Scalars['ID']['input'];
};


export type QueryEventDetailsArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryInvitationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMyInvitationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RecordInvitationViewInput = {
  invitationId: Scalars['ID']['input'];
};

export type RecordPublicLinkViewInput = {
  token: Scalars['ID']['input'];
};

export type RecordViewPayload = {
  __typename?: 'RecordViewPayload';
  success: Scalars['Boolean']['output'];
};

/** Input for the refreshToken mutation. */
export type RefreshTokenInput = {
  /** The long-lived refresh token obtained from login or a previous refresh. */
  refreshToken: Scalars['String']['input'];
};

/**
 * Payload from a successful token refresh.
 * Always returns a rotated refresh token alongside the new access token.
 */
export type RefreshTokenPayload = {
  __typename?: 'RefreshTokenPayload';
  /** New short-lived JWT access token */
  accessToken: Scalars['String']['output'];
  /** New rotated JWT refresh token. Store this and discard the old one. */
  refreshToken: Scalars['String']['output'];
};

/**
 * Payload returned after successful user registration.
 *
 * Does NOT include auth tokens — the user must verify their email and log in separately.
 */
export type RegisterPayload = {
  __typename?: 'RegisterPayload';
  /** Human-readable success message for the frontend to display. */
  message: Scalars['String']['output'];
  /**
   * The preferred-language BCP-47 tag the user was registered with (e.g. "en", "es-419").
   * Frontend awaits setLocale(preferredLanguage) BEFORE transitioning to the OTP step so
   * the verification screen renders in the chosen language without a momentary flash of
   * the previous catalog. Non-null because the backend defaults to "en" when input is null.
   */
  preferredLanguage: Scalars['String']['output'];
  /**
   * Verification code TTL in minutes. Frontend uses this to drive the countdown timer
   * on the email verification screen without re-reading backend configuration.
   */
  ttlMinutes?: Maybe<Scalars['Int']['output']>;
  /** ID of the newly created user (useful for frontend routing or analytics). */
  userId: Scalars['ID']['output'];
};

export type RegisterPushTokenInput = {
  /** Device platform: IOS or ANDROID */
  platform: Scalars['String']['input'];
  /** Expo push token (e.g., "ExponentPushToken[xxxx]" or "ExpoPushToken[xxxx]") */
  token: Scalars['String']['input'];
};

export type RegisterPushTokenPayload = {
  __typename?: 'RegisterPushTokenPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** Input for registering a new user account with email+password. */
export type RegisterUserInput = {
  /** Cloudflare Turnstile CAPTCHA token (web only; omit on native mobile) */
  captchaToken?: InputMaybe<Scalars['String']['input']>;
  /** User's email address (must be unique) */
  email: Scalars['Email']['input'];
  /** User's first name */
  firstName: Scalars['String']['input'];
  /** User's last name */
  lastName: Scalars['String']['input'];
  /** Plaintext password (min 8 characters; hashed with BCrypt before storage) */
  password: Scalars['String']['input'];
  /** User's phone number (e.g. +1 555 123 4567) */
  phone: Scalars['String']['input'];
  /**
   * User's preferred UI language as a BCP-47 tag (e.g. "en", "es-419"). OPTIONAL — the
   * backend defaults to "en" when null/absent so older mobile clients keep working without a
   * forced update. Whitelisted to {"en", "es-419"} at the resolver and domain level; any
   * other value yields an INVALID_PREFERRED_LANGUAGE error.
   */
  preferredLanguage?: InputMaybe<Scalars['String']['input']>;
};

/** Input for removing a co-host from an event. Primary host only. */
export type RemoveCoHostInput = {
  coHostUserId: Scalars['ID']['input'];
  eventId: Scalars['ID']['input'];
};

export type RemoveCoHostPayload = {
  __typename?: 'RemoveCoHostPayload';
  errors: Array<UserError>;
  success: Scalars['Boolean']['output'];
};

export type ReportEventInput = {
  details?: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  reason: ReportReason;
  reporterEmail?: InputMaybe<Scalars['String']['input']>;
};

export type ReportEventPayload = {
  __typename?: 'ReportEventPayload';
  success: Scalars['Boolean']['output'];
};

export type ReportReason =
  | 'HARASSMENT'
  | 'INAPPROPRIATE'
  | 'OTHER'
  | 'SPAM';

export type RequestAccountDeletionPayload = {
  __typename?: 'RequestAccountDeletionPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  ttlMinutes?: Maybe<Scalars['Int']['output']>;
};

/** Input for re-sending an existing invitation to a guest. */
export type ResendInvitationInput = {
  /** The invitation ID to resend */
  invitationId: Scalars['ID']['input'];
};

/** Result of re-sending an invitation. */
export type ResendInvitationPayload = {
  __typename?: 'ResendInvitationPayload';
  /** Human-readable message describing the result */
  message: Scalars['String']['output'];
  /** Whether the invitation was resent successfully */
  success: Scalars['Boolean']['output'];
};

export type ResendVerificationCodeInput = {
  userId: Scalars['ID']['input'];
};

export type ResendVerificationCodePayload = {
  __typename?: 'ResendVerificationCodePayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  /**
   * Verification code TTL in minutes. Frontend uses this to reset the countdown timer
   * on the email verification screen after a resend without re-reading backend configuration.
   */
  ttlMinutes?: Maybe<Scalars['Int']['output']>;
};

export type ResetPasswordInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type ResetPasswordPayload = {
  __typename?: 'ResetPasswordPayload';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/**
 * Input for a co-host voluntarily leaving an event.
 * Caller derived from JWT. Only CO_HOST role can resign (not PRIMARY).
 */
export type ResignAsCoHostInput = {
  eventId: Scalars['ID']['input'];
};

export type ResignAsCoHostPayload = {
  __typename?: 'ResignAsCoHostPayload';
  errors: Array<UserError>;
  success: Scalars['Boolean']['output'];
};

export type RespondToInvitationInput = {
  dietaryRestrictions?: InputMaybe<Scalars['String']['input']>;
  guestCount?: InputMaybe<GuestCountInput>;
  invitationId: Scalars['ID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  status: RsvpStatus;
};

export type RespondToInvitationPayload = {
  __typename?: 'RespondToInvitationPayload';
  invitation?: Maybe<Invitation>;
};

/** Input for revoking a pending co-host invitation by email. Primary host only. */
export type RevokePendingInviteInput = {
  email: Scalars['String']['input'];
  eventId: Scalars['ID']['input'];
};

export type RevokePendingInvitePayload = {
  __typename?: 'RevokePendingInvitePayload';
  errors: Array<UserError>;
  success: Scalars['Boolean']['output'];
};

export type Rsvp = {
  __typename?: 'Rsvp';
  dietaryRestrictions?: Maybe<Scalars['String']['output']>;
  guestCount: GuestCount;
  id: Scalars['ID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  respondedAt: Scalars['DateTime']['output'];
  status: RsvpStatus;
};

export type RsvpStatus =
  | 'ACCEPTED'
  | 'DECLINED'
  | 'TENTATIVE';

export type RsvpViaEventLinkInput = {
  captchaToken?: InputMaybe<Scalars['String']['input']>;
  dietaryRestrictions?: InputMaybe<Scalars['String']['input']>;
  guestCount: GuestCountInput;
  guestEmail?: InputMaybe<Scalars['String']['input']>;
  guestName: Scalars['String']['input'];
  guestPhone?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  status: RsvpStatus;
  token: Scalars['ID']['input'];
};

export type RsvpViaEventLinkPayload = {
  __typename?: 'RsvpViaEventLinkPayload';
  invitation: Invitation;
  isUpdate: Scalars['Boolean']['output'];
};

/**
 * Input for sending reminders to all pending invitees for an event.
 * Host ID is derived server-side from the JWT Bearer token.
 */
export type SendBulkReminderInput = {
  eventId: Scalars['ID']['input'];
  /**
   * Optional list of invitation IDs to remind. When provided, only these pending
   * invitations are reminded. When null or absent, all pending invitations are reminded.
   * An empty list ([]) sends to nobody (safety guard).
   */
  invitationIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Result of sending bulk reminders. */
export type SendBulkReminderPayload = {
  __typename?: 'SendBulkReminderPayload';
  errors: Array<Scalars['String']['output']>;
  failed: Scalars['Int']['output'];
  sent: Scalars['Int']['output'];
  skipped: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

/** Input for sending a reminder to a pending invitee. */
export type SendReminderInput = {
  /** The invitation ID to send a reminder for */
  invitationId: Scalars['ID']['input'];
};

/** Result of sending a reminder. */
export type SendReminderPayload = {
  __typename?: 'SendReminderPayload';
  /** Human-readable message describing the result */
  message: Scalars['String']['output'];
  /** Whether the reminder was sent successfully */
  success: Scalars['Boolean']['output'];
};

export type SendThankYouInput = {
  eventId: Scalars['ID']['input'];
  /**
   * Optional: specific invitation IDs to send thank-you to.
   * If omitted, sends to all accepted guests (backward-compatible).
   * Allows hosts to include tentative/declined guests who attended,
   * or exclude accepted guests who no-showed.
   */
  invitationIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  message: Scalars['String']['input'];
};

export type SendThankYouPayload = {
  __typename?: 'SendThankYouPayload';
  recipientCount: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

/** Input for submitting user feedback. */
export type SubmitFeedbackInput = {
  /** Feedback category (BUG, FEATURE_REQUEST, GENERAL). */
  category: FeedbackCategory;
  /** Whether the user consents to be contacted about this feedback. */
  contactable: Scalars['Boolean']['input'];
  /** Feedback message text. Must be between 10 and 1000 characters. */
  message: Scalars['String']['input'];
};

/** Payload returned from the submitFeedback mutation. */
export type SubmitFeedbackPayload = {
  __typename?: 'SubmitFeedbackPayload';
  /** True when the feedback was successfully saved. */
  success: Scalars['Boolean']['output'];
};

/**
 * System-wide default configuration values.
 * Exposed to the frontend for dynamic UI hints (e.g., placeholder text, limit messages).
 */
export type SystemDefaults = {
  __typename?: 'SystemDefaults';
  /** Default maximum invitations allowed per event (configurable via application.yml) */
  maxInvitationsPerEvent: Scalars['Int']['output'];
};

/**
 * A synthetic test user account created by an admin for QA and demo purposes.
 * TEST_USER accounts are excluded from real analytics and can be bulk-reset or deleted safely.
 */
export type TestUser = {
  __typename?: 'TestUser';
  /** Timestamp when the test user was created. */
  createdAt: Scalars['DateTime']['output'];
  /** Test user's email address (unique). */
  email: Scalars['Email']['output'];
  /** Test user's first name. */
  firstName: Scalars['String']['output'];
  /** Unique user identifier (UUID). */
  id: Scalars['ID']['output'];
  /** Test user's last name. */
  lastName: Scalars['String']['output'];
  /** Test user's phone number (nullable). */
  phone?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the test user was last updated. */
  updatedAt: Scalars['DateTime']['output'];
};

/**
 * Input for transferring primary ownership to an accepted co-host.
 * The current primary host becomes a co-host after transfer.
 * Caller (current primary) derived from JWT.
 */
export type TransferOwnershipInput = {
  eventId: Scalars['ID']['input'];
  newPrimaryUserId: Scalars['ID']['input'];
};

export type TransferOwnershipPayload = {
  __typename?: 'TransferOwnershipPayload';
  errors: Array<UserError>;
  success: Scalars['Boolean']['output'];
};

export type UnregisterPushTokenInput = {
  /** Expo push token to remove */
  token: Scalars['String']['input'];
};

export type UnregisterPushTokenPayload = {
  __typename?: 'UnregisterPushTokenPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/**
 * Input for updating an existing event.
 * Host ID is derived server-side from the JWT Bearer token.
 * Location ID is preserved from the existing event (not sent by client).
 */
export type UpdateEventInput = {
  /** Event date (ISO format YYYY-MM-DD). Required for non-DRAFT events. */
  date?: InputMaybe<Scalars['Date']['input']>;
  /** Event description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Dress code (optional) */
  dressCode?: InputMaybe<Scalars['String']['input']>;
  /** End time (HH:MM 24-hour format, optional) */
  endTime?: InputMaybe<Scalars['String']['input']>;
  /** ID of the event to update */
  eventId: Scalars['ID']['input'];
  /** Event image URL (optional) */
  imageUrl?: InputMaybe<Scalars['URL']['input']>;
  /**
   * Display name for an optional event link (e.g. 'Gift Registry', 'Zoom link').
   * Must be provided together with linkUrl. Max 60 characters.
   */
  linkName?: InputMaybe<Scalars['String']['input']>;
  /**
   * URL for the optional event link. Must be http or https. Max 2000 characters.
   * Must be provided together with linkName.
   */
  linkUrl?: InputMaybe<Scalars['String']['input']>;
  /** Event location. Required when promoting DRAFT to CREATED; optional for DRAFT→DRAFT updates. */
  location?: InputMaybe<LocationInput>;
  /** Max attendees per invitation (optional, null = no limit) */
  maxAttendeesPerInvitation?: InputMaybe<Scalars['Int']['input']>;
  /**
   * Per-event guest limit (optional, null = use system default). Overrides the system maximum
   * when set to a lower value; the effective limit is min(maxGuests, system default).
   */
  maxGuests?: InputMaybe<Scalars['Int']['input']>;
  /** Event name */
  name: Scalars['String']['input'];
  /** RSVP deadline (ISO Date, YYYY-MM-DD). Required for non-DRAFT events. */
  rsvpDeadline?: InputMaybe<Scalars['Date']['input']>;
  /** Special instructions for guests (optional) */
  specialInstructions?: InputMaybe<Scalars['String']['input']>;
  /** Start time (HH:MM 24-hour format). Required for non-DRAFT events. */
  startTime?: InputMaybe<Scalars['String']['input']>;
  /** Event status: DRAFT or CREATED */
  status: EventStatus;
  /** Timezone (e.g. America/New_York) */
  timezone: Scalars['String']['input'];
};

/** Result of updating an event. */
export type UpdateEventPayload = {
  __typename?: 'UpdateEventPayload';
  /** The updated event */
  event: Event;
};

export type UpdateNotificationPreferencesInput = {
  preferences: Array<NotificationPreferenceInput>;
};

export type UpdateNotificationPreferencesPayload = {
  __typename?: 'UpdateNotificationPreferencesPayload';
  preferences: Array<NotificationPreferenceItem>;
  success: Scalars['Boolean']['output'];
};

/** Input for updating an existing test user's profile fields and/or password. */
export type UpdateTestUserInput = {
  /** Email address (required; the admin UI does not allow email changes on edit). */
  email: Scalars['String']['input'];
  /** New first name. */
  firstName: Scalars['String']['input'];
  /** ID of the test user to update. */
  id: Scalars['ID']['input'];
  /** New last name. */
  lastName: Scalars['String']['input'];
  /**
   * New password (optional). Null or omitted keeps the existing password.
   * Must be 8–72 characters when provided.
   */
  password?: InputMaybe<Scalars['String']['input']>;
  /** New phone number (null to clear). */
  phone?: InputMaybe<Scalars['String']['input']>;
};

/** Payload returned from the updateTestUser mutation. */
export type UpdateTestUserPayload = {
  __typename?: 'UpdateTestUserPayload';
  /** Errors that prevented the update (empty on success). */
  errors: Array<UserError>;
  /** True when the test user was successfully updated. */
  success: Scalars['Boolean']['output'];
  /** The updated test user (null on failure). */
  testUser?: Maybe<TestUser>;
};

/** Input for updating an existing user */
export type UpdateUserInput = {
  /** User's first name (optional) */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** User's last name (optional) */
  lastName?: InputMaybe<Scalars['String']['input']>;
};

/** User entity */
export type User = {
  __typename?: 'User';
  /** Timestamp when the user was created */
  createdAt: Scalars['DateTime']['output'];
  /** User's email address (unique) */
  email: Scalars['Email']['output'];
  /** User's first name */
  firstName: Scalars['String']['output'];
  /** Unique user identifier (UUID) */
  id: Scalars['ID']['output'];
  /** User's last name */
  lastName: Scalars['String']['output'];
  /** User's phone number (nullable — not all users register with a phone) */
  phone?: Maybe<Scalars['String']['output']>;
  /** Timestamp when the user was last updated */
  updatedAt: Scalars['DateTime']['output'];
  /** User's access level. CUSTOMER for regular users, ADMIN for Invite team members. */
  userType?: Maybe<UserType>;
};

/** User-facing error with field-level details */
export type UserError = {
  __typename?: 'UserError';
  /** Error code for programmatic handling */
  code: ErrorCode;
  /** Field that caused the error (null for global errors) */
  field?: Maybe<Scalars['String']['output']>;
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** User type discriminator — distinguishes regular customers from admin users and test accounts. */
export type UserType =
  | 'ADMIN'
  | 'CUSTOMER'
  | 'TEST_USER';

export type VerifyEmailInput = {
  code: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type VerifyEmailPayload = {
  __typename?: 'VerifyEmailPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', accessToken: string, refreshToken: string, preferredLanguage: string } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'RegisterPayload', message: string, userId: string, ttlMinutes?: number | null, preferredLanguage: string } };

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'RefreshTokenPayload', accessToken: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutPayload', success: boolean } };


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