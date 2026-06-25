# PRD — Family Planning Scheduler (working name: "Hearth")

**Status:** Draft v0.1
**Author:** Vasu
**Date:** 2026-06-21
**Type:** Product Requirements Document — problem framing + v1 scope

---

## 1. Summary

A shared household coordination app that goes beyond a color-coded family calendar. The core bet: the unsolved job is not *displaying* a schedule, it's *reducing the mental load* of running a household — capturing the chaos of school emails, activity texts, and appointments into one source of truth, then distributing the work fairly and proactively.

Incumbents (Cozi, FamilyWall, Skylight, Maple, Google/Apple Calendar) are sticky but dated. They digitize the calendar; almost none reduce the cognitive labor. This PRD defines the problems v1 must address and the requirements to address them.

---

## 2. Problem statement

Running a household generates a constant stream of obligations that arrive in unstructured form (emails, flyers, texts, verbal asks) and must be turned into events, reminders, and tasks — then assigned, remembered, and executed across multiple people, most of whom won't adopt a new app. Today this labor falls disproportionately on one "household manager," is invisible, and is poorly supported by existing tools.

### Who we're building for

| Persona | Description | Primary need |
|---|---|---|
| **The Household Manager** (primary) | Usually one parent who holds the schedule, deadlines, and logistics in their head | Offload mental load; stop being the single point of failure |
| **The Partner** (secondary) | Co-parent who wants to help but lacks visibility; "just tell me what to do" | Low-friction visibility and clear assignments |
| **The Teen** (tertiary) | Has a phone, won't use a "family app" | Get only what's relevant, where they already are |
| **Young kids** | Have schedules, no phones | Modeled as schedule subjects, not app users |

---

## 3. Pain points to address (prioritized)

### P0 — Must address in v1

**3.1 The "second account" problem.**
Families already live in Google/Apple Calendar (and work calendars). A separate app means double-entry or abandonment. The top churn driver for incumbents is "my spouse never opens it." *Requirement: bidirectional, real-time sync with Google and Apple Calendar from day one. The app must be additive to existing calendars, never a replacement that demands migration.*

**3.2 Input friction.**
The school email says "early dismissal Friday, pizza day Wednesday, picture-day form due Monday." Converting that into 3 events + 1 task + 1 reminder is the actual work, and it's manual in every existing tool. *Requirement: forward an email, paste a text, or photograph a flyer and get back structured, reviewable events/tasks — the single biggest AI-enabled unlock.*

**3.3 Invisible and unequal mental load.**
Apps store events but don't distribute labor. No incumbent answers "what's on my plate vs. my partner's, and is it balanced?" *Requirement: every event/task has an owner and an optional "responsible adult"; a household view surfaces load distribution.*

### P1 — Strongly desired in v1, acceptable in fast-follow

**3.4 Dumb notifications.**
Current reminders are either spam or silence. *Requirement: context-aware nudges ("you have a meeting until 6 — who's getting Maya?") and digest-style summaries instead of per-event pings.*

**3.5 Irregular recurrence.**
Custody schedules (2-2-3, week-on/week-off), shift work, and alternating activity weeks can't be expressed by standard recurrence rules — and that's exactly where coordination matters most. *Requirement: a custody/rotation schedule builder beyond RFC-5527 RRULE patterns.*

**3.6 Kid-activity fragmentation.**
Activities live in their own silos (TeamSnap, Remind, Brightwheel, classroom apps) that don't talk to anything. *Requirement: email-ingestion as the universal bridge (most of these send emails); direct integrations later.*

### P2 — Out of scope for v1, on the roadmap

- Meal planning connected to shopping lists and pantry (the plan → ingredients → list flow incumbents bolt on but don't link).
- Teen-facing lightweight surface (SMS / shared-link / widget rather than full app adoption).
- Smart-display / fridge-screen mode.

---

## 3b. Evidence from the field (reviews, Reddit, comparison sites)

These are the recurring, documented complaints driving users away from incumbents — they validate the pain points above and should be treated as v1 requirements, not nice-to-haves.

**Cozi's paywall backlash is the single loudest signal.** In May 2024 Cozi restricted free users to a rolling 30-day calendar window, making it impossible to plan summer camp, holidays, or next season's sports without paying. Trustpilot dropped to ~2.1 stars; long-time users (8–10 years) described feeling "scammed," "held hostage," and victims of a "bait and switch," locked out of their own data. Millions began searching for alternatives. *Implication: don't gate core planning behind a hostile paywall; if freemium, gate on capture volume or premium automation, never on viewing your own family's schedule.*

**One-way sync is a top structural complaint.** Cozi only pushes events out to Google Calendar; changes made in Google never flow back, so edits silently desync. *Confirms requirement 3.1 — true bidirectional sync is non-negotiable.*

**No admin roles / anyone can delete anything.** Cozi has no permission levels or locked events; one accidental swipe by a kid can wipe a month of entries. *Add: roles, protected events, and undo to v1.*

**Data lock-in.** No CSV/ICS export — families can't take years of history with them. *Add: export and portability; it also lowers adoption anxiety.*

**Manual entry is the universally hated chore.** Comparison sites now headline things like "stop losing 4+ hours to manual entry," and the feature pulling switchers is AI photo extraction (snap a school flyer → events appear). This directly validates smart capture (3.2) as the wedge — it's already what the market is rewarding.

**Ads and clutter drive churn.** TimeTree users cite intrusive ads on daily opens plus syncing issues. *Implication: keep the core experience clean; don't monetize via ads in the daily loop.*

**Feature sprawl alienates the tech-averse member.** FamilyWall is called "overkill" for families who just want calendar + coordination, and reviewers stress that the least tech-savvy relative determines adoption. *Confirms the "second account / spouse won't use it" failure mode (3.1) and argues for ruthless onboarding simplicity over feature breadth.*

> Note on sourcing: Reddit threads on these topics are widely referenced by review/comparison sites but were not always directly retrievable in search; the patterns above are corroborated across multiple independent review sources and align with the well-known r/Cozi and parenting-community grievances. Worth validating with first-party user interviews before locking scope.

## 4. Goals and non-goals

### Goals
- Become the household's single source of truth without requiring everyone to abandon their existing calendar.
- Cut the time to capture an unstructured obligation into a structured, assigned item by ~80% vs. manual entry.
- Make the distribution of household labor visible and more equitable.

### Non-goals (v1)
- Replacing Google/Apple Calendar.
- Being a full project-management or to-do power-tool.
- Forcing every family member onto the app — partial adoption must still deliver value.
- Social/community features.

---

## 5. v1 functional requirements

**5.1 Calendar sync.** Two-way sync with Google Calendar and Apple Calendar (iCloud). Changes in either system reflect within seconds. Per-member calendars map to household members. Conflict handling and de-duplication required.

**5.2 Smart capture (the wedge).**
- Forward an email to a household address → AI extracts candidate events/tasks → user reviews and confirms before anything is written.
- Photograph a flyer/permission slip → same extraction flow.
- Paste text / forward a screenshot → same flow.
- Extraction must capture: title, date/time, location, responsible person, prep tasks, and deadlines. Confidence shown; nothing auto-commits silently.

**5.3 Household model.** Members (adults, kids, others), each with attributes (has-phone, can-be-assigned, schedule-subject-only). Events and tasks carry an *owner* (who it concerns) and a *responsible adult* (who handles logistics).

**5.4 Mental-load view.** A dashboard showing upcoming items grouped by responsible adult, with a simple balance indicator. Not a guilt machine — a visibility tool.

**5.5 Shared lists.** Basic shared lists (shopping, to-do, packing) with real-time sync. Foundation for later meal-planning connection.

**5.6 Smart notifications.** Daily/"tomorrow" digest per adult; configurable. Conflict and gap detection ("no one is assigned to pickup Friday").

**5.7 Custody / rotation schedules (P1).** Template-driven builder for common patterns (week-on/week-off, 2-2-3, every-other-weekend) that generates the underlying events automatically.

---

## 5a. Calendar — detailed P0 specification

The calendar is the foundation everything else attaches to, so it is fully P0. The bar is "as reliable as Google Calendar, plus the household layer incumbents lack." Grouped by capability.

### 5a.1 Sync and interoperability (the make-or-break)
- **True bidirectional sync** with Google Calendar and Apple/iCloud Calendar. An edit, move, or delete in either system reflects in ours within seconds, and vice versa. This directly fixes Cozi's one-way-sync complaint.
- **Outlook/Microsoft 365** sync as a fast-follow within the P0 epic (many parents have work calendars there).
- **CalDAV + ICS subscription** support so any external calendar (school district, sports league, class schedule) can be subscribed read-only.
- **Conflict resolution:** last-write-wins with a visible change log; never silently drop or duplicate an event. Dedupe events that arrive from two synced sources.
- **Sync health surface:** a clear indicator when a connected account is failing to sync, with one-tap re-auth. Silent sync failure is a top trust-killer.

### 5a.2 Views
- **Day, 3-day, Week, Month, and Agenda/List** views, plus a **"Today" focus** view (what's happening today + who's responsible).
- **Per-member and combined views:** toggle individual family members on/off; see one person's day or the whole household overlaid.
- **Multi-calendar overlay:** household calendar + each person's synced external calendars, each independently show/hideable.
- Fast navigation (jump to date, swipe between periods) and a visible "now" line in day/week.

### 5a.3 Member and color model
- Color **by person** (primary), with optional color **by category** (e.g., medical, school, sports) as a secondary lens.
- An event can have **multiple participants** and still render cleanly (e.g., both kids at the same recital).
- Distinction between **whom the event is about** (owner — possibly a phone-less child) and **which adult is responsible** for logistics. This is the hook the mental-load layer reads from.

### 5a.4 Event creation and editing
- **Quick add** with **natural-language parsing** ("Soccer Tue 4pm at Lincoln Park, Maya, Dad drives") → structured event.
- Standard fields: title, start/end, all-day, **multi-day**, location (with map link), notes, URL, attachments (e.g., a permission-slip photo), and per-event color/category.
- **Attendee/assignee picker** drawing from household members.
- **Edit scope control** for recurring events: this event / this-and-future / all.
- **Drag-to-move and drag-to-resize** in day/week views.
- **Undo** on create/edit/delete (pairs with the "anyone can delete" risk).

### 5a.5 Recurrence engine
- Full standard recurrence (daily/weekly/monthly/yearly, intervals, by-weekday, end-by-date or count) — RFC-5545 RRULE-compatible so it round-trips through Google/Apple.
- **Exceptions:** skip or modify a single occurrence without breaking the series.
- **Irregular/rotation patterns** (week-on/week-off, 2-2-3 custody, alternating activity weeks) generated via a template builder — these can't be expressed by standard RRULE and are exactly where families need help. (Detailed builder is P1, but the calendar must *store and render* generated rotation events in P0.)

### 5a.6 Assignment, conflicts, and gaps
- Every timed event can carry a **"responsible adult"** and an optional **"needs a driver / needs pickup"** flag.
- **Conflict detection:** warn when one responsible adult is double-booked (e.g., two pickups at 3:30 in different places).
- **Gap/coverage detection:** flag events that have no responsible adult assigned ("Friday pickup — unassigned").

### 5a.7 Reminders and notifications (calendar-level)
- Per-event reminders (multiple, configurable lead times), defaulting sensibly by category.
- Reminders route to the **responsible adult**, not spammed to everyone.
- Respect quiet hours; batch where possible (the smarter digest logic lives in 5.6, but per-event reminders are P0).

### 5a.8 Roles, permissions, and safety
- **Roles:** organizer/admin vs. member vs. view-only. Admins manage membership and protected events.
- **Protected/locked events** that non-admins can't delete; **undo + trash** (soft-delete with restore window) so an accidental swipe is recoverable. Directly addresses Cozi's "anyone can delete a month of events" flaw.
- **Audit/change log** for who changed what.

### 5a.9 Reliability, offline, and data integrity
- **Offline create/edit** with automatic reconciliation on reconnect.
- Optimistic UI with guaranteed eventual consistency; no lost writes.
- Sync and storage treated as existential — a family calendar that loses or duplicates events is dead on arrival.

### 5a.10 Time, search, and portability
- **Time-zone aware** events; sensible handling when a parent travels.
- **Search and filter** across events (by person, category, text, date range).
- **Import** (ICS/CSV/Google/Apple) on onboarding and **export** (ICS/CSV) any time — no lock-in. Portability lowers switching anxiety for Cozi refugees.

### 5a.11 Capture integration point
- The smart-capture pipeline (3.2 / 5.2) writes into this calendar via a **review-before-commit** queue: extracted events appear as drafts the user confirms, edits, or rejects — never silently committed.

### P0 acceptance criteria (calendar)
1. A change made in Google or Apple Calendar appears in-app within ~5 seconds, and vice versa, with no duplication.
2. A user can create a recurring event, edit a single occurrence, and have both reflect correctly across synced calendars.
3. A non-admin cannot delete a protected event; any deletion is recoverable from trash.
4. Two conflicting responsibilities for the same adult produce a visible warning.
5. An unassigned pickup/event is surfaced as a coverage gap.
6. A user can export their full calendar to ICS and re-import it without data loss.
7. A connected account that loses authorization shows a clear, actionable sync-error state.

## 6. Key flows (described, not mocked)

1. **Onboarding:** connect Google/Apple Calendar → confirm imported members → set who can be assigned work.
2. **Capture:** forward school email → review 3 extracted items → tap confirm → items land on the right calendars with owners and a prep task.
3. **Daily loop:** each adult gets a morning digest of their responsibilities; gaps are flagged for someone to claim.
4. **Rebalance:** household manager opens the load view, sees imbalance, reassigns two pickups to partner in two taps.

---

## 7. Success metrics

- **Activation:** % of new households that connect at least one external calendar and complete one smart-capture in week 1.
- **Core value:** smart-captures per household per week (proxy for offloaded mental load).
- **Adoption depth:** % of households with ≥2 active adult members (beats the "spouse never opens it" failure mode).
- **Retention:** week-4 and week-12 household retention.
- **Load equity (north-star candidate):** reduction in share of items owned by the single busiest adult over time.

---

## 8. Competitive landscape (brief)

| Product | Strength | Gap we exploit |
|---|---|---|
| Cozi | Category default, lists + calendar | Dated; no AI capture; no load balancing; weak sync |
| Google/Apple Calendar | Already where people live | No household model, no capture, no task/owner layer |
| Skylight | Hardware display, family-friendly | Display-first; input still manual; hardware lock-in |
| FamilyWall / Maple | Feature-rich household hubs | Feature sprawl, manual entry, no mental-load framing |

Positioning: **ingestion + delegation engine**, not another calendar. The AI capture and labor-balancing are the moat; calendar UI is table stakes.

---

## 9. Risks and open questions

- **Sync reliability** is existential — a calendar app that loses or duplicates events is dead. Needs heavy investment and testing.
- **Extraction trust:** users must trust AI capture without it silently creating wrong events. Review-before-commit is non-negotiable for v1; measure correction rate.
- **Privacy:** household data (kids, custody, locations) is sensitive. Clear data handling and on-device options should be considered.
- **Open:** iOS-first or cross-platform at launch? (Recommend iOS-first given Apple Calendar + sharing dynamics.)
- **Open:** monetization — freemium with capture limits, or flat household subscription?
- **Open:** how far to push teen engagement in v1 vs. defer to P2.

---

## 10. Suggested phasing

- **Phase 1 (MVP):** Calendar sync + smart capture (email/photo) + household model + basic shared lists. Proves the wedge.
- **Phase 2:** Mental-load view + smart notifications + custody scheduler.
- **Phase 3:** Meal planning → list connection, teen surface, activity-app integrations, display mode.
