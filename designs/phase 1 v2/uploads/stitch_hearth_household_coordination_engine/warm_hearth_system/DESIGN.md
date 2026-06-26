---
name: Warm Hearth System
colors:
  surface: '#fff8f5'
  surface-dim: '#e0d8d5'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ef'
  surface-container: '#f4ece9'
  surface-container-high: '#efe7e3'
  surface-container-highest: '#e9e1de'
  on-surface: '#1e1b19'
  on-surface-variant: '#56423d'
  inverse-surface: '#33302e'
  inverse-on-surface: '#f7efec'
  outline: '#89726b'
  outline-variant: '#dcc1b9'
  surface-tint: '#9d4325'
  primary: '#9a4023'
  on-primary: '#ffffff'
  primary-container: '#b95838'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59e'
  secondary: '#456649'
  on-secondary: '#ffffff'
  secondary-container: '#c3e9c4'
  on-secondary-container: '#496a4d'
  tertiary: '#5d5c58'
  on-tertiary: '#ffffff'
  tertiary-container: '#767470'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#7e2c10'
  secondary-fixed: '#c6ecc7'
  secondary-fixed-dim: '#abd0ac'
  on-secondary-fixed: '#01210a'
  on-secondary-fixed-variant: '#2d4e33'
  tertiary-fixed: '#e6e2dd'
  tertiary-fixed-dim: '#c9c6c1'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#484743'
  background: '#fff8f5'
  on-background: '#1e1b19'
  surface-variant: '#e9e1de'
typography:
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  calendar-cell:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  calendar-density-sm: 40px
  calendar-density-md: 64px
---

## Brand & Style

The design system is built on the philosophy of the "digital hearth"—a central, glowing point of reliability and warmth for the modern family. It rejects the cold, sterile efficiency of corporate productivity tools in favor of a **Humanist-Modern** aesthetic. 

The target audience is multi-generational families navigating complex schedules, requiring a UI that feels supportive rather than demanding. The style utilizes **Tonal Layering** and **Soft Tactility**, combining high-contrast accessibility with organic color palettes. The goal is to reduce the cognitive "noise" of family management through a soothing, domestic-inspired interface that balances serious reliability with emotional warmth.

## Colors

This design system uses a primary palette of **Terracotta** (#D16A49) for action and urgency, **Sage Green** (#6B8E6E) for growth and confirmation, and **Cream** (#F9F5F0) as a soft, non-reflective background base. 

The "Family Member System" employs a five-color harmonious spectrum. Each color is tested for high contrast against the Cream background (WCAG AA minimum). Use these colors for event borders, member avatars, and specific "ownership" indicators. To maintain accessibility, never rely on color alone; always pair family member colors with initials or icons.

- **Primary (Terracotta):** Hero buttons, active states, important alerts.
- **Secondary (Sage):** Success states, "Confirmed" event markers.
- **Background (Cream):** Page surfaces to reduce eye strain.
- **Neutral (Warm Charcoal):** Primary text and structural borders.

## Typography

The typography strategy pairs **Quicksand** for headlines with **Be Vietnam Pro** for functional text. Quicksand’s rounded terminals provide the "warmth" and "approachability" required for a family-centric brand. Be Vietnam Pro provides the professional, contemporary structure needed for high-density information like calendars and lists.

- **Headlines:** Use Quicksand for all titles to create a soft, welcoming entry point.
- **Body & Data:** Use Be Vietnam Pro for its excellent legibility at small sizes, specifically within calendar views.
- **Hierarchy:** Maintain a clear distinction between "Reading" text (Body-lg) and "Action" text (Label-sm).

## Layout & Spacing

The design system utilizes a **4px baseline grid** to ensure precise alignment of high-density calendar data. The layout is fluid but constrained by safe margins to maintain the feeling of "breathable" space.

- **Calendar Views:** On mobile, the system switches to a "Vertical Stack" or "Time-Strip" layout rather than a traditional 7-day grid to maximize horizontal space for text.
- **Mental Load Indicators:** Spacing between task icons and labels is fixed at 8px (2 units) to ensure they are perceived as a single functional group.
- **Touch Targets:** All interactive elements maintain a minimum 44x44px hit area, even in high-density views.

## Elevation & Depth

This design system uses **Tonal Layering** over heavy shadows. Depth is communicated through subtle shifts in background color and "pressed" vs. "elevated" states.

- **Base Layer:** The warm Cream surface.
- **Mid Layer:** Used for "Draft" events. These use a dashed border and a 50% opacity fill to look "temporary" or "floating."
- **Top Layer:** Used for "Confirmed" events. These have a solid, subtle shadow (4px blur, 5% opacity charcoal) and a 100% solid fill to feel "grounded" and "set in stone."
- **Interaction:** Buttons use a soft neomorphic "press" effect (inner shadow) when active to mimic physical tactile feedback.

## Shapes

The shape language is consistently **Rounded** (8px / 0.5rem base radius). This removes the "sharpness" associated with corporate tools and mirrors the organic feel of home environments.

- **Event Cards:** Use `rounded-lg` (16px) for a soft, container-like feel.
- **Status Pills:** Use `rounded-xl` (24px) for "Mental Load" indicators to make them feel like physical tokens.
- **Avatars:** Always circular to distinguish human elements from functional blocks.

## Components

### 1. Calendar Cards (Event Types)
- **Draft Events:** Dashed 1.5px border in Neutral-300, italicized typography, and a "Confirm?" trailing button. Background is semi-transparent.
- **Confirmed Events:** Solid border in the Family Member's assigned color, 100% opaque Cream background, bolded title.

### 2. Mental Load Indicators
Icons are styled as "Charcoal Tokens" with soft-colored glyphs:
- **Needs Pickup:** A shopping bag icon with a small Terracotta dot.
- **Needs Prep:** A whisk/knife icon with a small Sage dot.
- **Unassigned:** A dotted-outline circle icon; triggers a "Pulse" animation to draw attention.

### 3. Labor Balance Visualization
Avoid "Bar Charts" which feel like a performance review. Use the **"Hearth Glow"** style: A soft, blurred gradient bar where colors bleed into one another. The width of each color segment represents the member's share of tasks. The edges are soft and diffused, making the visualization feel like a spectrum of contribution rather than a hard competition.

### 4. High-Density Mobile Calendar
- **Date Headers:** Sticky at the top.
- **Time Slots:** 15-minute increments indicated by subtle hair-line dividers.
- **Collision Handling:** If two members have an event at once, cards shrink to 50% width and stack horizontally with a 2px "gap" showing the background Cream.

### 5. Buttons & Controls
- **Primary Action:** Terracotta fill, white text, 16px padding.
- **Secondary Action:** Sage Green outline, Sage text, Cream background.
- **Input Fields:** Soft cream fill with a 1px border that turns Terracotta on focus.