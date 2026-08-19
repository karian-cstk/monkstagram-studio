<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        Nav/Top-Bar
  REACT_COMPONENT:       NavTopBar
  STORYBOOK_TITLE:       Navigation/NavTopBar
  FIGMA_NODE_ID:         1292:41138
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           🧭 Navigation
  CSS_CLASS_PREFIX:      nav-top-bar
  FILE_NAME:             NavTopBar.tsx
  STORY_FILE_NAME:       NavTopBar.stories.tsx
  CSS_FILE_NAME:         NavTopBar.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-07-21
  STATUS:                Active
  VERSION:               2.1.0
  ═══════════════════════════════════════════════════════════════════
-->

# Nav/Top-Bar — Storybook Brief

---

## ⚠️ READ THIS ENTIRE SECTION BEFORE WRITING A SINGLE LINE OF CODE

This brief is the only document an AI agent needs to implement `NavTopBar.tsx`,
`NavTopBar.css`, and `NavTopBar.stories.tsx`. Do not open Figma. Do not reference
other files. Every structural, responsive, token, and accessibility decision is
documented here with the exact source of truth.

---

## CRITICAL — HOW RESPONSIVENESS WORKS IN THIS COMPONENT

**This is the single most common failure point for AI generation.**

The Figma component has **4 variant breakpoints**. These are NOT the same as
CSS media-query breakpoints where one DOM tree responds to viewport width.

Each Figma breakpoint variant represents a **completely different DOM tree** — different
elements, different child order, elements that do not exist at all in some layouts.

You **cannot** implement this with a single JSX tree + CSS `display:none`. That approach
breaks keyboard tab order and causes screen readers to announce hidden content.

**The correct implementation is conditional JSX rendering:**

```
Mobile layout    → render branch A (brand + spacer only)
Tablet layout    → render branch B (hamburger + brand + spacer + avatar)
Desktop layout   → render branch C (brand + separator + nav + spacer + trailing)
Large Display    → render branch C at a wider frame width (identical structure to Desktop)
```

CSS media queries are used **only** to switch which render branch is active at runtime.
`Desktop` and `Large Display` are the same branch — CSS handles the width difference.

**The `breakpoint` prop is the runtime equivalent of the Figma variant axis.** It forces
a specific render branch. In production it is not used — the CSS media queries drive it.
In Storybook it is a controls-panel prop that lets reviewers see each layout without
resizing the window.

---

## FIGMA BREAKPOINT → DOM TREE MAP

This is the authoritative structural reference. Live-verified against Figma node
`1292:41138` on 2026-07-21. Every child is listed in DOM order (left to right = top to bottom).

### Mobile (Figma node 1292:41134 — frame width 390px)

```
<header class="nav-top-bar nav-top-bar--mobile">
  <a class="nav-top-bar__brand">          ← brand-item (150×40, FIXED)
  <div class="nav-top-bar__spacer">       ← spacer (FILL width, pushes nothing — no trailing here)
  <div class="nav-top-bar__bottom-separator">  ← 1px absolute, bottom edge
</header>
```

**Mobile has NO avatar. NO hamburger. NO trailing icons.**
Mobile is brand-only with a bottom border. The Figma Mobile variant was measured at
390px with exactly 3 direct children: brand-item, spacer, bottom-separator.

### Tablet (Figma node 1292:41135 — frame width 768px)

```
<header class="nav-top-bar nav-top-bar--tablet">
  <button class="nav-top-bar__hamburger">  ← hamburger-btn (40×40, FIRST child — before brand)
  <a class="nav-top-bar__brand">           ← brand-item (150×40, SECOND child)
  <div class="nav-top-bar__spacer">        ← spacer (FILL width)
  <div class="nav-top-bar__trailing">      ← trailing (avatar only — icon-slot hidden)
  <div class="nav-top-bar__bottom-separator">
</header>
```

**IMPORTANT: hamburger is FIRST, brand is SECOND.** Not the other way around.
This is the correct DOM order for both visual layout (hamburger left of brand)
and keyboard tab order (hamburger is focused before brand).
The trailing on Tablet contains only the avatar — the icon-slot (`icon-slot`) is
`visible: false` in Figma. Do not render the icon slot at Tablet.

### Desktop (Figma node 1292:41136 — frame width 1280px)

```
<header class="nav-top-bar nav-top-bar--desktop">
  <a class="nav-top-bar__brand">           ← brand-item (150×40)
  <div class="nav-top-bar__brand-separator"> ← 1×20px vertical rule
  <nav class="nav-top-bar__nav">           ← nav-items (HUG width, contains 7 Nav/Item instances)
  <div class="nav-top-bar__spacer">        ← spacer (FILL width)
  <div class="nav-top-bar__trailing">      ← trailing (icon-slot + avatar, full)
  <div class="nav-top-bar__bottom-separator">
</header>
```

### Large Display (Figma node 1292:41137 — frame width 1440px)

**Identical structure to Desktop.** The only difference is frame width (1440 vs 1280).
Both map to the same React render branch. CSS sets `max-width` and layout only.

---

## BASE COMPONENT — START HERE

Build this first. Verify it renders correctly before adding conditional logic.
This is the Desktop layout — the fullest, most complex branch.

```tsx
// NavTopBar.tsx
import React, { useId } from 'react';
import './NavTopBar.css';

export const NavTopBar = ({
  brand,
  navItems = [],
  avatarInitials,
  showIconSlot = true,
  iconSlot,
  onAvatarClick,
  onHamburgerClick,
  onOverflowOpenChange,
  navAriaLabel = 'Main navigation',
  overflowLabel = 'More',
  className,
  'data-testid': testId,
}: NavTopBarProps) => {
  const breakpoint = useBreakpoint(); // 'mobile' | 'tablet' | 'desktop'

  if (breakpoint === 'mobile') return <MobileLayout {...} />;
  if (breakpoint === 'tablet') return <TabletLayout {...} />;
  return <DesktopLayout {...} />;      // desktop + large-display share this branch
};
```

The three layout branches are not separate components in Storybook stories — they are
internal render functions. The exported component is always `NavTopBar`. The `breakpoint`
prop in Storybook stories forces the branch directly.

---

## SECTION 1 — Purpose

The Nav/Top-Bar is the persistent global header rendered once at the top of every
Contentstack application page. It is always 40px tall regardless of breakpoint.

It combines three zones:
- **Brand zone** — product logo/name lockup, always a link to application home
- **Nav zone** — primary page navigation links (Desktop/Large Display only)
- **Trailing zone** — utility actions (AI Assist, Help, Notifications, App Switcher) + user avatar

**Use only once per application layout** as the topmost element. Do not compose a
custom header from atoms elsewhere in the product.

For secondary in-page navigation use `Tab Bar`.
For contextual side navigation use `Left Hand Side Bar`.

This component **does not own** the hamburger drawer, overflow dropdown menus, or
nav-item dropdown menus. It renders triggers and fires callbacks — the consuming
layout owns what opens.

---

## SECTION 2 — Anatomy → DOM Translation

Every Figma layer name and its exact code equivalent. **These names are the contract.**
Do not invent different names.

```
Figma layer                    → DOM element + className
────────────────────────────────────────────────────────────────────────
Nav/Top-Bar (root)             → <header class="nav-top-bar nav-top-bar--{breakpoint}">
brand-item                     → <a class="nav-top-bar__brand" href={brand.href}>
brand-separator                → <div class="nav-top-bar__brand-separator" aria-hidden="true">
                                    (Desktop/Large Display only)
nav-items (SLOT)               → <nav class="nav-top-bar__nav" aria-label="{navAriaLabel}">
  Nav/Item instances            →   <a class="nav-top-bar__nav-item"> (one per item)
  nav-item-indicator            →   <span class="nav-top-bar__nav-item-indicator"> (inside nav-item)
  overflow trigger (if needed)  →   <button class="nav-top-bar__nav-overflow">
spacer                         → <div class="nav-top-bar__spacer" aria-hidden="true">
trailing (INSTANCE)            → <div class="nav-top-bar__trailing" role="toolbar" aria-label="Navigation utilities">
  icon-slot (SLOT)              →   <div class="nav-top-bar__icon-slot">
    icon button instances       →     <button class="nav-top-bar__icon-btn"> (×4)
  avatar                        →   <button class="nav-top-bar__avatar" aria-haspopup="true">
hamburger-btn (Tablet only)    → <button class="nav-top-bar__hamburger" aria-label="Open navigation menu">
bottom-separator               → <div class="nav-top-bar__bottom-separator" aria-hidden="true">
```

### Layer measurements (live-verified from Figma)

| Layer | Desktop width | Desktop height | Notes |
|---|---|---|---|
| Root | 1280px | 40px | Fixed 40px all breakpoints |
| brand-item | 150px | 40px | FIXED sizing |
| brand-separator | 1px | 20px | Vertically centered in 40px bar |
| nav-items | HUG | 40px | Auto-width — sum of item widths + 4px gaps |
| nav-item | HUG | 40px | paddingH 8px, gap 4px |
| spacer | FILL | 40px | `flex: 1 0 0` in CSS |
| trailing (Desktop) | 196px | 40px | HUG sizing |
| trailing (Tablet) | 40px | 40px | Avatar only |
| icon-slot | 148px | 32px | Contains 4 × 32px icon buttons |
| avatar | 24px | 24px | Hit area: 32×32 recommended |
| hamburger-btn | 40px | 40px | **lg size (40×40), NOT md (32×32)** |
| bottom-separator | 100% | 1px | Absolute, bottom: 0, left: 0, right: 0 |

---

## SECTION 3 — TypeScript Props Interface

```typescript
// NavTopBar.types.ts

export type NavTopBarBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'large-display';

export interface NavTopBarBrand {
  /** Consumer-supplied logo/icon ReactNode. This component does not style internals. */
  icon: React.ReactNode;
  /** Product name shown next to the icon. */
  name: string;
  /** Link target for the brand lockup. Default: '/' */
  href?: string;
}

export interface NavTopBarItem {
  /** Unique identifier. Passed to onClick handler. */
  id: string;
  /** Visible link text. 1–2 words recommended. */
  label: string;
  /** Navigation target. */
  href: string;
  /** Marks this item as the current page.
   *  Drives active-indicator visibility + aria-current="page".
   *  Consumer is responsible for mutual exclusivity — only one item should be active. */
  isActive?: boolean;
  /** 16px icon rendered before the label. */
  leadingIcon?: React.ReactNode;
  /** Shows a trailing dropdown caret. This component renders the caret only — not the menu. */
  hasDropdown?: boolean;
  /** Disables the item. Non-interactive, aria-disabled="true", 40% opacity. */
  disabled?: boolean;
  /** Click handler. Receives the item's id. */
  onClick?: (id: string) => void;
}

export interface NavTopBarProps {
  // ─── LAYOUT CONTROL ─────────────────────────────────────────────────────

  /** Forces a specific layout branch.
   *
   *  ⚠️ STORYBOOK / TESTING ONLY. Do not use in production.
   *  In production the CSS media queries control which branch renders.
   *  In Storybook this prop lets reviewers switch layouts without resizing the browser.
   *
   *  Production code should omit this prop entirely. The component internally reads
   *  the viewport via a `useBreakpoint()` hook driven by matchMedia.
   *
   *  Mapping to Figma variants:
   *    'mobile'        → Breakpoint=Mobile  (390px frame in Figma)
   *    'tablet'        → Breakpoint=Tablet  (768px frame in Figma)
   *    'desktop'       → Breakpoint=Desktop (1280px frame in Figma)
   *    'large-display' → Breakpoint=Large Display (1440px frame in Figma)
   *
   *  Note: 'desktop' and 'large-display' render the SAME JSX branch.
   *  CSS handles the width difference only.
   *
   *  Default: undefined (production derives from matchMedia) */
  breakpoint?: NavTopBarBreakpoint;

  // ─── CONTENT PROPS ───────────────────────────────────────────────────────

  /** Product logo + name + link target.
   *  Maps to: brand-item in Figma.
   *  Required. */
  brand: NavTopBarBrand;

  /** Primary navigation links. Rendered in array order.
   *  Maps to: nav-items SLOT in Figma (Desktop/Large Display only).
   *  Not rendered at Mobile or Tablet — nav-items slot is absent from those DOM trees.
   *  Default: [] */
  navItems?: NavTopBarItem[];

  /** Label for the overflow "More" trigger button.
   *  Only renders when navItems overflow the available nav zone width.
   *  Default: 'More' */
  overflowLabel?: string;

  /** Shows/hides the utility icon group (AI Assist, Help, Notifications, App Switcher).
   *  ⚠️ Never hides the avatar — avatar is always rendered on Desktop/Large Display.
   *  ⚠️ Icon slot is never shown on Tablet or Mobile regardless of this prop.
   *  Default: true */
  showIconSlot?: boolean;

  /** Overrides the default 4-button utility icon set with custom content.
   *  Maps to: icon-slot SLOT in Figma.
   *  When not provided, renders the default 4 icon buttons.
   *  Only rendered on Desktop/Large Display. */
  iconSlot?: React.ReactNode;

  /** 1–2 character initials shown in the avatar button.
   *  Maps to: initials text inside avatar in Figma.
   *  Pass-through only — this component does not validate or truncate.
   *  Required. */
  avatarInitials: string;

  /** Unread notification count. Renders a Badge/Counter on the Notifications icon.
   *  Pass 0 or undefined to show no badge.
   *  Only relevant on Desktop/Large Display when showIconSlot=true. */
  notificationCount?: number;

  // ─── CALLBACKS ──────────────────────────────────────────────────────────

  /** Fired when the avatar button is clicked. Consumer owns what opens. */
  onAvatarClick?: () => void;

  /** Fired when the hamburger button is clicked (Tablet layout only).
   *  Consumer owns the off-canvas drawer — this component only fires the event.
   *  Whether the hamburger aria-expanded state updates depends on the consumer
   *  passing isHamburgerOpen back to the component. */
  onHamburgerClick?: () => void;

  /** Whether the hamburger-triggered drawer is currently open.
   *  Controls aria-expanded on the hamburger button.
   *  Only relevant on Tablet.
   *  Default: false */
  isHamburgerOpen?: boolean;

  /** Fired when the overflow "More" dropdown opens or closes.
   *  Receives `true` on open, `false` on close. */
  onOverflowOpenChange?: (open: boolean) => void;

  // ─── ACCESSIBILITY ───────────────────────────────────────────────────────

  /** aria-label for the <nav> landmark.
   *  Default: 'Main navigation' */
  navAriaLabel?: string;

  // ─── UTILITY ─────────────────────────────────────────────────────────────

  /** Additional CSS class names on root <header>. */
  className?: string;

  /** Test selector. */
  'data-testid'?: string;
}
```

---

## SECTION 4 — Figma → React Prop Mapping

**Complete exhaustive table. Every Figma property. No gaps. No guessing.**

| Figma Concept | Figma Type | React Prop | React Type | Notes |
|---|---|---|---|---|
| `Breakpoint` variant axis | VARIANT | `breakpoint` | `NavTopBarBreakpoint \| undefined` | **Storybook/testing only**. Production omits this prop entirely. |
| `Breakpoint=Mobile` | VARIANT VALUE | `breakpoint="mobile"` | — | Renders brand + spacer only. No hamburger, no avatar, no trailing. |
| `Breakpoint=Tablet` | VARIANT VALUE | `breakpoint="tablet"` | — | Renders hamburger (first) + brand + spacer + avatar. |
| `Breakpoint=Desktop` | VARIANT VALUE | `breakpoint="desktop"` | — | Full layout. |
| `Breakpoint=Large Display` | VARIANT VALUE | `breakpoint="large-display"` | — | Same JSX as desktop. CSS sets wider frame. |
| `brand-item` (INSTANCE_SWAP) | SLOT | `brand` | `NavTopBarBrand` | Consumer supplies icon, name, href. |
| `nav-items` (SLOT) | SLOT | `navItems` | `NavTopBarItem[]` | Only rendered at desktop/large-display. |
| `trailing` (INSTANCE) | INSTANCE | `showIconSlot` / `iconSlot` | `boolean` / `ReactNode` | Instance is always present on Desktop — showIconSlot controls icon-slot visibility inside it. |
| `icon-slot` (SLOT inside trailing) | SLOT | `iconSlot` | `ReactNode` | visible=false on Tablet (avatar-only trailing). |
| `avatar` (inside trailing) | INSTANCE | `avatarInitials` | `string` | Always visible on Desktop/Large Display/Tablet. Never on Mobile. |
| `hamburger-btn` | INSTANCE | `onHamburgerClick` / `isHamburgerOpen` | `() => void` / `boolean` | Tablet only. Size: 40×40 (lg Icon Button Ghost). |
| `showIconSlot` (on trailing instance) | BOOLEAN (on instance) | `showIconSlot` | `boolean` | Default: `true`. Hides the icon-slot group. Avatar unaffected. |
| `hasFocus` on brand/nav/avatar | BOOLEAN (demo only) | — (CSS) | — | Maps to `:focus-visible`. Never a prop. |
| Nav item `State=Active` | VARIANT | `navItems[n].isActive` | `boolean` | Drives active-indicator + `aria-current="page"`. |
| Nav item `State=Disabled` | VARIANT | `navItems[n].disabled` | `boolean` | `aria-disabled="true"`, 40% opacity, non-interactive. |
| Nav item `State=Hover` | VARIANT | — (CSS) | — | `:hover` on nav-item anchor. Never a prop. |
| Nav item `State=Focused` | VARIANT | — (CSS) | — | `:focus-visible` on nav-item anchor. Never a prop. |
| Nav item `hasLeadingIcon` | BOOLEAN | `navItems[n].leadingIcon` | `ReactNode \| undefined` | Presence of ReactNode drives visibility — no separate boolean needed. |
| Nav item `hasDropdown` | BOOLEAN | `navItems[n].hasDropdown` | `boolean` | Renders caret icon only. Menu is consumer responsibility. |

---

## SECTION 5 — The Three Render Branches

This is the JSX specification for each layout branch. Implement exactly as shown.
Do not combine into one tree with CSS hiding.

### Branch A — Mobile (`breakpoint === 'mobile'`)

```tsx
<header className={cn('nav-top-bar', 'nav-top-bar--mobile', className)}>
  <a
    href={brand.href ?? '/'}
    className="nav-top-bar__brand"
    aria-label={`${brand.name} — Home`}
  >
    {brand.icon}
  </a>

  <div className="nav-top-bar__spacer" aria-hidden="true" />

  <div className="nav-top-bar__bottom-separator" aria-hidden="true" />
</header>
```

**No trailing. No avatar. No hamburger. No nav items.** This is intentional.

### Branch B — Tablet (`breakpoint === 'tablet'`)

```tsx
<header className={cn('nav-top-bar', 'nav-top-bar--tablet', className)}>
  {/* HAMBURGER IS FIRST — before brand */}
  <button
    className="nav-top-bar__hamburger"
    aria-label="Open navigation menu"
    aria-haspopup="true"
    aria-expanded={isHamburgerOpen ? 'true' : 'false'}
    onClick={onHamburgerClick}
  >
    <MenuIcon size={20} aria-hidden="true" />
  </button>

  {/* BRAND IS SECOND — after hamburger */}
  <a
    href={brand.href ?? '/'}
    className="nav-top-bar__brand"
    aria-label={`${brand.name} — Home`}
  >
    {brand.icon}
  </a>

  <div className="nav-top-bar__spacer" aria-hidden="true" />

  {/* TRAILING — avatar only. NO icon slot. */}
  <div
    className="nav-top-bar__trailing nav-top-bar__trailing--avatar-only"
    role="toolbar"
    aria-label="Navigation utilities"
  >
    <button
      className="nav-top-bar__avatar"
      aria-label={`User profile — ${avatarInitials}`}
      aria-haspopup="true"
      onClick={onAvatarClick}
    >
      {avatarInitials}
    </button>
  </div>

  <div className="nav-top-bar__bottom-separator" aria-hidden="true" />
</header>
```

### Branch C — Desktop + Large Display

(`breakpoint === 'desktop' || breakpoint === 'large-display'` or default)

```tsx
<header className={cn('nav-top-bar', 'nav-top-bar--desktop', className)}>
  <a
    href={brand.href ?? '/'}
    className="nav-top-bar__brand"
    aria-label={`${brand.name} — Home`}
  >
    {brand.icon}
  </a>

  <div className="nav-top-bar__brand-separator" aria-hidden="true" />

  <nav
    className="nav-top-bar__nav"
    aria-label={navAriaLabel}
  >
    {visibleNavItems.map((item) => (
      <a
        key={item.id}
        href={item.href}
        className={cn(
          'nav-top-bar__nav-item',
          item.isActive && 'nav-top-bar__nav-item--active',
          item.disabled && 'nav-top-bar__nav-item--disabled',
        )}
        aria-current={item.isActive ? 'page' : undefined}
        aria-disabled={item.disabled ? 'true' : undefined}
        aria-haspopup={item.hasDropdown ? 'true' : undefined}
        tabIndex={item.disabled ? -1 : undefined}
        onClick={(e) => {
          if (item.disabled) { e.preventDefault(); return; }
          item.onClick?.(item.id);
        }}
      >
        {item.leadingIcon && (
          <span className="nav-top-bar__nav-item-icon" aria-hidden="true">
            {item.leadingIcon}
          </span>
        )}
        <span className="nav-top-bar__nav-item-label">{item.label}</span>
        {item.hasDropdown && (
          <span className="nav-top-bar__nav-item-caret" aria-hidden="true">
            <ChevronDownIcon size={12} />
          </span>
        )}
        <span
          className="nav-top-bar__nav-item-indicator"
          aria-hidden="true"
        />
      </a>
    ))}

    {/* Overflow trigger — only renders when items overflow */}
    {overflowItems.length > 0 && (
      <button
        className="nav-top-bar__nav-overflow"
        aria-haspopup="true"
        aria-expanded={isOverflowOpen ? 'true' : 'false'}
        aria-label="More navigation items"
        onClick={() => {
          setIsOverflowOpen(!isOverflowOpen);
          onOverflowOpenChange?.(!isOverflowOpen);
        }}
      >
        <DotsThreeIcon size={16} aria-hidden="true" />
        <span className="nav-top-bar__nav-overflow-label">{overflowLabel}</span>
      </button>
    )}
  </nav>

  <div className="nav-top-bar__spacer" aria-hidden="true" />

  <div
    className="nav-top-bar__trailing"
    role="toolbar"
    aria-label="Navigation utilities"
  >
    {showIconSlot && (
      <div className="nav-top-bar__icon-slot">
        {iconSlot ?? <DefaultIconSlot notificationCount={notificationCount} />}
      </div>
    )}
    <button
      className="nav-top-bar__avatar"
      aria-label={`User profile — ${avatarInitials}`}
      aria-haspopup="true"
      onClick={onAvatarClick}
    >
      {avatarInitials}
    </button>
  </div>

  <div className="nav-top-bar__bottom-separator" aria-hidden="true" />
</header>
```

---

## SECTION 6 — State Behaviour

### Nav item states

| State | Trigger | Token | CSS class |
|---|---|---|---|
| Default | Not current page | `text/subtle` label | `.nav-top-bar__nav-item` |
| Active | `isActive=true` | `text/brand` label + `action/primary` indicator | `.nav-top-bar__nav-item--active` |
| Hover | `:hover` | `surface/interactive/hover` background | CSS `:hover` only — no class |
| Focused | `:focus-visible` | `focus/ring/color` 2px ring, 2px offset | CSS `:focus-visible` only — no class |
| Disabled | `disabled=true` | `text/disabled`, `opacity: var(--visibility-disabled)` | `.nav-top-bar__nav-item--disabled` |

### Active indicator

The `nav-top-bar__nav-item-indicator` is a 2px absolute bar at the bottom of each nav item.

```css
.nav-top-bar__nav-item {
  position: relative; /* Required — indicator is absolute child */
}

.nav-top-bar__nav-item-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: transparent; /* invisible by default */
  transition: none; /* No transition — reduced-motion safe */
}

.nav-top-bar__nav-item--active .nav-top-bar__nav-item-indicator {
  background-color: var(--action-primary); /* action/primary = purple/500 */
}
```

Use `opacity: 0` instead of `display: none` if you want CSS transitions.
Use `background-color: transparent` (no transition needed) for zero-motion compliance.

### Overflow "More" trigger

This trigger **does not exist in Figma**. It is a product requirement added on top
of the Figma component to handle nav item overflow at runtime. It is not Figma-sourced.

The trigger renders as a nav-item-styled button. It appears **only** when at least one
nav item has been moved to the overflow list by the ResizeObserver calculation.

```
Overflow trigger appearance:
  Icon:    DotsThree (16×16)
  Label:   overflowLabel prop (default: "More")
  Style:   Same height, padding, and font as a regular nav-item
  State:   Default / Hover / Focused (same tokens as nav-item)
           aria-expanded="true" when dropdown is open
```

### Disabled vs active exclusivity

`isActive` and `disabled` should not both be true on the same item. If they are,
`disabled` wins — the item is non-interactive and the indicator is suppressed.

---

## SECTION 7 — Overflow Computation

**This section documents a runtime behaviour that does not exist in Figma.**
It is a product-level requirement. Do not confuse it with Figma-sourced measurements.

Nav items overflow from the **end of the array first** (last item hides first).
Inside the "More" dropdown they appear in their original array order.

### Implementation

Use `ResizeObserver` on the `nav-top-bar__nav` element. This runs alongside (not
instead of) the CSS media-query breakpoint switching.

```typescript
// Pseudo-code — implement with ResizeObserver
function computeOverflow(navWidth: number, items: NavTopBarItem[]): {
  visible: NavTopBarItem[];
  overflow: NavTopBarItem[];
} {
  // Measure rendered item widths
  // Subtract overflow trigger width (if needed)
  // Return split: visible items that fit, overflow items that don't
  // Items are removed from the END of the array first
}
```

The overflow trigger itself takes up space when visible — account for its width
(approximately 72px) when computing available space.

**When `navItems` is an empty array:**
- No nav items rendered
- No overflow trigger rendered
- Spacer still pushes trailing to the far edge
- This is valid and should not cause errors

---

## SECTION 8 — Token Reference

> **Token governance:** Every token name listed here exists in Venus_Semantics and resolves
> to a CSS custom property. Do not use hardcoded hex values. The Figma REST API on the
> current plan can only read `_Primitives`, not `Venus_Semantics` — tokens may appear
> "not found" via API lookup but they exist and are correct.

| Layer | State | Token | CSS Custom Property | Resolved value (Light) |
|---|---|---|---|---|
| Root `<header>` | All | `surface/default` | `--surface-default` | #F9FAFB |
| bottom-separator | All | `border/default` | `--border-default` | #E5E7EB |
| brand-separator | All | `border/default` | `--border-default` | #E5E7EB |
| nav-item label | Default | `text/subtle` | `--text-subtle` | #4B5563 |
| nav-item label | Active | `text/brand` | `--text-brand` | #5D50BF |
| nav-item label | Disabled | `text/disabled` | `--text-disabled` | #9CA3AF |
| nav-item label | Hover | `text/subtle` (unchanged) | `--text-subtle` | #4B5563 |
| nav-item background | Hover | `surface/interactive/hover` | `--surface-interactive-hover` | gray/900 at 4% opacity |
| nav-item indicator | Active | `action/primary` | `--action-primary` | #6C5CE7 |
| nav-item font | All | `Label/LG` | 13px / 500 weight / Inter | — |
| focus ring | Focused | `focus/ring/color` | `--focus-ring-color` | #6C5CE7 |
| avatar background | All | `action/primary` | `--action-primary` | #6C5CE7 |
| avatar text | All | `text/on-brand` | `--text-on-brand` | #FFFFFF |
| disabled item | Disabled | `visibility/disabled` | `--visibility-disabled` | 0.40 opacity |
| root padding-inline | All | `space/16` | `--space-16` | 16px |
| root gap | All | `space/8` | `--space-8` | 8px |
| nav-item padding-inline | All | `space/8` | `--space-8` | 8px |
| nav-item gap (icon→label) | All | `space/4` (layout/gap/2xs) | `--space-4` | 4px |
| nav-item gap (between items) | All | `space/4` (layout/gap/2xs) | `--space-4` | 4px |

### CSS Custom Properties declarations

```css
/* NavTopBar.css */
.nav-top-bar {
  /* Layout */
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;          /* Fixed. Never changes at any breakpoint. */
  width: 100%;
  position: relative;    /* Required for bottom-separator absolute positioning */

  /* Spacing */
  padding-inline: var(--space-16);
  gap: var(--space-8);

  /* Visual */
  background-color: var(--surface-default);
  box-sizing: border-box;
}

.nav-top-bar__brand-separator {
  width: 1px;
  height: 20px;
  background-color: var(--border-default);
  flex-shrink: 0;
}

.nav-top-bar__spacer {
  flex: 1 0 0;
}

.nav-top-bar__bottom-separator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--border-default);
}

.nav-top-bar__nav {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: var(--space-4);
  height: 40px;
}

.nav-top-bar__nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-4);
  padding-inline: var(--space-8);
  height: 40px;
  position: relative;    /* Required for indicator absolute positioning */
  text-decoration: none;
  color: var(--text-subtle);
  font-size: 13px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  cursor: pointer;
  white-space: nowrap;
}

.nav-top-bar__nav-item:hover {
  background-color: var(--surface-interactive-hover);
}

.nav-top-bar__nav-item:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}

.nav-top-bar__nav-item--active {
  color: var(--text-brand);
}

.nav-top-bar__nav-item--disabled {
  opacity: var(--visibility-disabled);
  cursor: not-allowed;
  pointer-events: none;
}

.nav-top-bar__nav-item-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: transparent;
}

.nav-top-bar__nav-item--active .nav-top-bar__nav-item-indicator {
  background-color: var(--action-primary);
}

.nav-top-bar__trailing {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-8);
  padding-inline: var(--space-8);
  height: 40px;
}

.nav-top-bar__icon-slot {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-4);
}

.nav-top-bar__avatar {
  width: 24px;
  height: 24px;
  min-width: 32px;   /* Minimum hit target */
  min-height: 32px;
  border-radius: 9999px;
  background-color: var(--action-primary);
  color: var(--text-on-brand);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
}

.nav-top-bar__avatar:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}

.nav-top-bar__hamburger {
  width: 40px;    /* lg size — NOT 32px */
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-top-bar__hamburger:hover {
  background-color: var(--surface-interactive-hover);
}

.nav-top-bar__hamburger:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}

/* Responsive breakpoints — switch render branch */
/* Mobile: ≤767px */
/* Tablet: 768px–1023px */
/* Desktop: 1024px–1439px */
/* Large Display: ≥1440px */

@media (prefers-reduced-motion: reduce) {
  .nav-top-bar__nav-item-indicator {
    transition: none;
  }
}

@media (forced-colors: active) {
  .nav-top-bar {
    border-bottom: 1px solid ButtonText;
    forced-color-adjust: none;
  }
  .nav-top-bar__nav-item-indicator {
    background-color: Highlight;
  }
  .nav-top-bar__nav-item:focus-visible,
  .nav-top-bar__hamburger:focus-visible,
  .nav-top-bar__avatar:focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
}
```

---

## SECTION 9 — Accessibility

### ARIA structure (Desktop full layout)

```html
<header role="banner" class="nav-top-bar">

  <a href="/" class="nav-top-bar__brand" aria-label="Contentstack Administration — Home">
    <!-- brand.icon content -->
  </a>

  <div class="nav-top-bar__brand-separator" aria-hidden="true"></div>

  <nav class="nav-top-bar__nav" aria-label="Main navigation">

    <!-- Active nav item -->
    <a href="/dashboard" class="nav-top-bar__nav-item nav-top-bar__nav-item--active"
       aria-current="page">
      <span class="nav-top-bar__nav-item-icon" aria-hidden="true"><!-- icon --></span>
      <span class="nav-top-bar__nav-item-label">Dashboard</span>
      <span class="nav-top-bar__nav-item-indicator" aria-hidden="true"></span>
    </a>

    <!-- Standard nav item -->
    <a href="/organisations" class="nav-top-bar__nav-item">
      <span class="nav-top-bar__nav-item-label">Organisations</span>
      <span class="nav-top-bar__nav-item-indicator" aria-hidden="true"></span>
    </a>

    <!-- Nav item with dropdown caret -->
    <a href="/settings" class="nav-top-bar__nav-item"
       aria-haspopup="true" aria-expanded="false">
      <span class="nav-top-bar__nav-item-label">Settings</span>
      <span class="nav-top-bar__nav-item-caret" aria-hidden="true"><!-- caret icon --></span>
      <span class="nav-top-bar__nav-item-indicator" aria-hidden="true"></span>
    </a>

    <!-- Overflow trigger (only when overflow exists) -->
    <button class="nav-top-bar__nav-overflow"
            aria-haspopup="true" aria-expanded="false"
            aria-label="More navigation items">
      <!-- dots icon -->
      <span>More</span>
    </button>

  </nav>

  <div class="nav-top-bar__spacer" aria-hidden="true"></div>

  <div class="nav-top-bar__trailing" role="toolbar" aria-label="Navigation utilities">
    <button aria-label="AI Assist" class="nav-top-bar__icon-btn"><!-- icon --></button>
    <button aria-label="Help" class="nav-top-bar__icon-btn"><!-- icon --></button>
    <button aria-label="Notifications — 3 unread"
            class="nav-top-bar__icon-btn" aria-haspopup="true">
      <!-- icon + Badge/Counter -->
    </button>
    <button aria-label="App Switcher"
            class="nav-top-bar__icon-btn" aria-haspopup="true"><!-- icon --></button>
    <button aria-label="User profile — GK"
            class="nav-top-bar__avatar" aria-haspopup="true" aria-expanded="false">
      GK
    </button>
  </div>

</header>
```

### ARIA structure — Tablet layout

```html
<header role="banner" class="nav-top-bar nav-top-bar--tablet">
  <!-- hamburger is FIRST — before brand -->
  <button class="nav-top-bar__hamburger"
          aria-label="Open navigation menu"
          aria-haspopup="true"
          aria-expanded="false">
    <!-- menu icon -->
  </button>

  <a href="/" class="nav-top-bar__brand" aria-label="Contentstack Administration — Home">
    <!-- brand icon -->
  </a>

  <div class="nav-top-bar__spacer" aria-hidden="true"></div>

  <div class="nav-top-bar__trailing" role="toolbar" aria-label="Navigation utilities">
    <button aria-label="User profile — GK"
            class="nav-top-bar__avatar" aria-haspopup="true">GK</button>
  </div>
</header>
```

### ARIA structure — Mobile layout

```html
<header role="banner" class="nav-top-bar nav-top-bar--mobile">
  <a href="/" class="nav-top-bar__brand" aria-label="Contentstack Administration — Home">
    <!-- brand icon -->
  </a>
  <div class="nav-top-bar__spacer" aria-hidden="true"></div>
  <!-- No trailing. No avatar. No hamburger. -->
</header>
```

### Conditional ARIA attributes

| Condition | Element | Attribute | Value |
|---|---|---|---|
| Nav item is current page | nav-item `<a>` | `aria-current` | `"page"` |
| Nav item is disabled | nav-item `<a>` | `aria-disabled` | `"true"` |
| Nav item has dropdown | nav-item `<a>` | `aria-haspopup` | `"true"` |
| Nav item dropdown is open | nav-item `<a>` | `aria-expanded` | `"true"` |
| Overflow trigger visible | overflow `<button>` | `aria-haspopup` | `"true"` |
| Overflow dropdown is open | overflow `<button>` | `aria-expanded` | `"true"` |
| Hamburger drawer is open | hamburger `<button>` | `aria-expanded` | `"true"` |
| Avatar menu is open | avatar `<button>` | `aria-expanded` | `"true"` |
| Notification count > 0 | notification `<button>` | `aria-label` | `"Notifications — N unread"` |

### Keyboard navigation

| Key | Behaviour |
|---|---|
| `Tab` | Brand → Nav items (in order, incl. overflow trigger if visible) → Trailing icons → Avatar |
| `Shift+Tab` | Reverse of above |
| `Enter` / `Space` | Activate focused element |
| `Arrow Left` / `Arrow Right` | Move focus between nav items within the `<nav>` landmark |
| `Home` | First nav item in `<nav>` |
| `End` | Last nav item (or overflow trigger) in `<nav>` |
| `Escape` | Close any open dropdown/popover triggered from the nav |

### Screen reader announcements

| Interaction | Announcement |
|---|---|
| Focus brand link | "Contentstack Administration — Home, link" |
| Focus active nav item | "Dashboard, current page, link" |
| Focus inactive nav item | "Organisations, link" |
| Focus nav item with dropdown | "Settings, has popup, collapsed, link" |
| Focus disabled nav item | "Settings, dimmed, link" |
| Focus overflow trigger | "More navigation items, has popup, collapsed, button" |
| Focus avatar | "User profile — GK, has popup, collapsed, button" |
| Focus notification (unread) | "Notifications — 3 unread, has popup, button" |
| Focus hamburger (Tablet) | "Open navigation menu, has popup, collapsed, button" |

### Contrast ratios

| Pair | Ratio | WCAG AA | WCAG AAA |
|---|---|---|---|
| `text/subtle` (#4B5563) on `surface/default` (#F9FAFB) | ~7.1:1 | ✅ Pass | ✅ Pass |
| `text/brand` (#5D50BF) on `surface/default` (#F9FAFB) | ~5.8:1 | ✅ Pass | ✅ Pass |
| `text/on-brand` (#FFFFFF) on avatar `action/primary` (#6C5CE7) | 4.54:1 | ✅ Pass | — |
| `action/primary` (#6C5CE7) active indicator (UI component) | 3.1:1 | ✅ Pass (3:1 UI) | — |
| Disabled items (0.40 opacity) | Exempt | ✅ Exempt (WCAG 1.4.3) | — |

### Touch targets

| Element | Visual size | Hit target | WCAG 2.5.5 |
|---|---|---|---|
| Nav items | 40px tall × HUG | Native 40px | ✅ Pass |
| Brand link | 40×150px | Native | ✅ Pass |
| Trailing icon buttons | 32×32px | 32×32px | ✅ Pass |
| Hamburger button | 40×40px | Native | ✅ Pass |
| Avatar | 24×24px visual | 32×32px min hit area | ✅ Pass |

---

## SECTION 10 — Storybook Stories

```typescript
// NavTopBar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { NavTopBar } from './NavTopBar';
import {
  ContentstackLogo,
  DashboardIcon, OrganisationIcon, UserIcon,
  PlanIcon, MailIcon, WebhookIcon, SettingsIcon,
  AiAssistIcon, HelpIcon, BellIcon, AppSwitcherIcon,
} from '@contentstack/venus-icons';

// ── Default nav items for reuse across stories ─────────────────────────────
const DEFAULT_NAV_ITEMS = [
  { id: 'dashboard',      label: 'Dashboard',      href: '/dashboard',      isActive: true,  leadingIcon: <DashboardIcon size={16} /> },
  { id: 'organisations',  label: 'Organisations',  href: '/organisations',  leadingIcon: <OrganisationIcon size={16} /> },
  { id: 'users',          label: 'Users',           href: '/users',          leadingIcon: <UserIcon size={16} /> },
  { id: 'plans',          label: 'Plans',           href: '/plans',          leadingIcon: <PlanIcon size={16} /> },
  { id: 'email',          label: 'Email Settings',  href: '/email-settings', leadingIcon: <MailIcon size={16} /> },
  { id: 'webhooks',       label: 'Webhooks',        href: '/webhooks',       leadingIcon: <WebhookIcon size={16} /> },
  { id: 'settings',       label: 'Settings',        href: '/settings',       leadingIcon: <SettingsIcon size={16} /> },
];

const DEFAULT_BRAND = {
  icon: <ContentstackLogo />,
  name: 'Contentstack Administration',
  href: '/',
};

const meta: Meta<typeof NavTopBar> = {
  title: 'Navigation/NavTopBar',
  component: NavTopBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Persistent 40px global header. Adapts structure across 3 render branches: Mobile (brand only), Tablet (hamburger + brand + avatar), Desktop/Large Display (full layout with nav, icons, avatar).',
      },
    },
  },
  argTypes: {
    breakpoint: {
      control: 'select',
      options: ['mobile', 'tablet', 'desktop', 'large-display'],
      description:
        '⚠️ Storybook/testing only. Forces a render branch. Omit in production — the component reads viewport via matchMedia.',
      table: { defaultValue: { summary: 'undefined (CSS media queries)' } },
    },
    showIconSlot: { control: 'boolean' },
    avatarInitials: { control: 'text' },
    navAriaLabel: { control: 'text' },
    overflowLabel: { control: 'text' },
    notificationCount: { control: { type: 'number', min: 0 } },
  },
};

export default meta;
type Story = StoryObj<typeof NavTopBar>;

// ── 1. Default (Desktop) ────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    brand: DEFAULT_BRAND,
    navItems: DEFAULT_NAV_ITEMS,
    avatarInitials: 'GK',
    showIconSlot: true,
    breakpoint: 'desktop',
  },
};

// ── 2. All Breakpoints — renders all three layouts stacked ──────────────────
// USE THIS to review all layouts at once without resizing the viewport.
export const AllBreakpoints: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#6B7280' }}>
          MOBILE (brand only — no hamburger, no avatar)
        </p>
        <NavTopBar
          breakpoint="mobile"
          brand={DEFAULT_BRAND}
          navItems={DEFAULT_NAV_ITEMS}
          avatarInitials="GK"
        />
      </div>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#6B7280' }}>
          TABLET (hamburger FIRST, then brand, then avatar — no icon slot, no inline nav)
        </p>
        <NavTopBar
          breakpoint="tablet"
          brand={DEFAULT_BRAND}
          navItems={DEFAULT_NAV_ITEMS}
          avatarInitials="GK"
        />
      </div>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#6B7280' }}>
          DESKTOP (full layout)
        </p>
        <NavTopBar
          breakpoint="desktop"
          brand={DEFAULT_BRAND}
          navItems={DEFAULT_NAV_ITEMS}
          avatarInitials="GK"
          showIconSlot
        />
      </div>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#6B7280' }}>
          LARGE DISPLAY (same structure as desktop, wider frame)
        </p>
        <NavTopBar
          breakpoint="large-display"
          brand={DEFAULT_BRAND}
          navItems={DEFAULT_NAV_ITEMS}
          avatarInitials="GK"
          showIconSlot
        />
      </div>
    </div>
  ),
};

// ── 3. Mobile ───────────────────────────────────────────────────────────────
export const Mobile: Story = {
  args: {
    breakpoint: 'mobile',
    brand: DEFAULT_BRAND,
    navItems: DEFAULT_NAV_ITEMS,
    avatarInitials: 'GK',
  },
};

// ── 4. Tablet ───────────────────────────────────────────────────────────────
// Verify: hamburger is on the LEFT, brand is on the RIGHT of hamburger.
export const Tablet: Story = {
  args: {
    breakpoint: 'tablet',
    brand: DEFAULT_BRAND,
    navItems: DEFAULT_NAV_ITEMS,
    avatarInitials: 'GK',
  },
};

// ── 5. Large Display ────────────────────────────────────────────────────────
export const LargeDisplay: Story = {
  args: {
    breakpoint: 'large-display',
    brand: DEFAULT_BRAND,
    navItems: DEFAULT_NAV_ITEMS,
    avatarInitials: 'GK',
    showIconSlot: true,
  },
};

// ── 6. Different Active Item ─────────────────────────────────────────────────
export const DifferentActiveItem: Story = {
  args: {
    ...Default.args,
    navItems: DEFAULT_NAV_ITEMS.map((item) => ({
      ...item,
      isActive: item.id === 'settings',
    })),
  },
};

// ── 7. Without Icon Slot ─────────────────────────────────────────────────────
export const WithoutIconSlot: Story = {
  args: {
    ...Default.args,
    showIconSlot: false,
  },
};

// ── 8. With Notification Badge ───────────────────────────────────────────────
export const WithNotificationBadge: Story = {
  args: {
    ...Default.args,
    notificationCount: 3,
  },
};

// ── 9. With Dropdown Nav Items ───────────────────────────────────────────────
export const WithDropdownItems: Story = {
  args: {
    ...Default.args,
    navItems: DEFAULT_NAV_ITEMS.map((item) => ({
      ...item,
      hasDropdown: item.id === 'settings' || item.id === 'users',
    })),
  },
};

// ── 10. Overflow — too many items for the container ──────────────────────────
// Verify: last items move to "More" dropdown. Trigger only appears when overflow exists.
export const Overflow: Story = {
  args: {
    ...Default.args,
    navItems: [
      ...DEFAULT_NAV_ITEMS,
      { id: 'api',      label: 'API Tokens',   href: '/api-tokens' },
      { id: 'audit',    label: 'Audit Log',    href: '/audit-log' },
      { id: 'sso',      label: 'SSO',          href: '/sso' },
      { id: 'security', label: 'Security',     href: '/security' },
    ],
  },
};

// ── 11. Disabled Nav Item ────────────────────────────────────────────────────
export const DisabledNavItem: Story = {
  args: {
    ...Default.args,
    navItems: DEFAULT_NAV_ITEMS.map((item) => ({
      ...item,
      disabled: item.id === 'webhooks',
    })),
  },
};

// ── 12. Empty Nav Items ──────────────────────────────────────────────────────
// Verify: spacer still pushes trailing to far edge. No overflow trigger. No errors.
export const EmptyNavItems: Story = {
  args: {
    ...Default.args,
    navItems: [],
  },
};

// ── 13. Focused Nav Item ─────────────────────────────────────────────────────
// Verify: 2px purple focus ring visible on focused nav item.
export const FocusedNavItem: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navItems = canvas.getAllByRole('link');
    // Brand link is first link. First nav item is second.
    if (navItems[1]) navItems[1].focus();
  },
};

// ── 14. Focused Overflow Trigger ─────────────────────────────────────────────
export const FocusedOverflowTrigger: Story = {
  args: { ...Overflow.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overflowBtn = canvas.getByRole('button', { name: /more navigation items/i });
    if (overflowBtn) overflowBtn.focus();
  },
};

// ── 15. Hamburger Open State ─────────────────────────────────────────────────
// Verify: aria-expanded="true" on hamburger button.
export const HamburgerOpen: Story = {
  args: {
    breakpoint: 'tablet',
    brand: DEFAULT_BRAND,
    navItems: DEFAULT_NAV_ITEMS,
    avatarInitials: 'GK',
    isHamburgerOpen: true,
  },
};

// ── 16. Dark Mode ─────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  decorators: [
    (Story) => (
      <div data-theme="dark">
        <Story />
      </div>
    ),
  ],
  args: { ...Default.args },
};

// ── 17. Long Nav Labels ───────────────────────────────────────────────────────
// Verify overflow behaviour with verbose labels. Confirm ellipsis or wrap handling.
export const LongNavLabels: Story = {
  args: {
    ...Default.args,
    navItems: DEFAULT_NAV_ITEMS.map((item) => ({
      ...item,
      label: item.label + ' Management',
    })),
  },
};
```

---

## SECTION 11 — Implementation Notes

### 1. Never implement with a single DOM tree

The temptation is to write one JSX tree with CSS `display: none` on Mobile/Tablet
sections. Do not do this. It breaks:

- Tab order (hidden elements are still in the tab sequence without `tabIndex=-1` on every interactive element)
- Screen readers (hidden elements in the accessibility tree without `aria-hidden` on every element)
- The hamburger child order (hamburger must be first in Tablet DOM — you can't achieve this with display:none on a single tree without absolute positioning hacks)

Use three explicit render branches as specified in Section 5.

### 2. Hamburger is 40×40 (lg), not 32×32 (md)

The Figma Tablet variant was measured at 40×40px for `hamburger-btn`. Use an Icon Button
Ghost/lg component (40×40) with a 20px icon inside. Do not use the md size (32×32).

### 3. The `breakpoint` prop is for Storybook only

In production, implement a `useBreakpoint()` hook using `window.matchMedia`:

```typescript
function useBreakpoint(): NavTopBarBreakpoint {
  const [bp, setBp] = useState<NavTopBarBreakpoint>('desktop');
  useEffect(() => {
    const mq = {
      mobile:  window.matchMedia('(max-width: 767px)'),
      tablet:  window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
    };
    const update = () => {
      if (mq.mobile.matches) setBp('mobile');
      else if (mq.tablet.matches) setBp('tablet');
      else setBp('desktop');
    };
    update();
    Object.values(mq).forEach(m => m.addEventListener('change', update));
    return () => Object.values(mq).forEach(m => m.removeEventListener('change', update));
  }, []);
  return bp;
}
```

When the `breakpoint` prop is supplied (Storybook), use it directly instead of the hook.

### 4. Token values came from Venus_Semantics — not from the REST API

The Figma REST API on the current plan tier can only read `_Primitives`. When the
original spec document noted "No exact Venus token match", this was a REST API lookup
failure — not a missing token. The tokens exist in `Venus_Semantics` and all resolve
correctly. Use the token names and CSS custom properties from Section 8. Never
hardcode hex values.

### 5. Overflow computation requires ResizeObserver

This is a runtime measurement concern, not solvable with static CSS. The overflow
trigger ("More") is **not in Figma** — it is a product-level addition. The ResizeObserver
runs only on breakpoints that show the nav (Desktop/Large Display). See Section 7 for
the computation spec.

### 6. The nav-items slot in Figma vs the navItems prop in React

In Figma, `nav-items` is a SLOT that holds Nav/Item instances. In React, `navItems` is a
data array the component maps over internally. These are compatible but different patterns.
The component owns the nav-item rendering loop — consumers pass data, not rendered JSX.
If you need full control over nav-item rendering, use the `iconSlot` override pattern
as a model — but this is not currently specified for nav items.

### 7. Spacer implementation

```css
.nav-top-bar__spacer {
  flex: 1 0 0;  /* grow: 1, shrink: 0, basis: 0 — pushes trailing to right edge */
}
```

No JS required. No DOM content.

---

## SECTION 12 — Do / Don't

### Do

- Render three distinct JSX branches for Mobile / Tablet / Desktop
- Place hamburger **before** brand in the DOM on Tablet
- Use 40×40px (lg) for the hamburger button
- Derive all colours from CSS custom properties — never hardcode hex
- Keep the component at exactly 40px height at every breakpoint
- Use `aria-current="page"` on the active nav item
- Use `aria-disabled="true"` (not the HTML `disabled` attribute) on disabled nav items — this preserves focus for screen readers
- Return focus to the overflow trigger when its dropdown closes

### Don't

- Don't use a single DOM tree with CSS `display:none` to switch layouts — this breaks tab order
- Don't render the hamburger at Mobile — Mobile is brand-only (no hamburger, no avatar)
- Don't render nav items inline at Tablet — Tablet nav is hamburger-only
- Don't render the icon slot at Tablet — Tablet trailing is avatar-only
- Don't use hardcoded hex values — all colours are Venus_Semantics tokens
- Don't make the hamburger 32×32 — it is 40×40 (measured from live Figma)
- Don't use the `breakpoint` prop in production code — CSS media queries drive it
- Don't couple the overflow dropdown contents or hamburger drawer to this component

---

## SECTION 13 — Related Components

| Component | Relationship |
|---|---|
| `Nav/Item` | The individual nav link atom used inside nav-items slot |
| `_Internal/Nav/Trailing` | The trailing zone atom (icon buttons + avatar) |
| `Tab Bar` | For secondary in-page navigation — not the global header |
| `Left Hand Side Bar` | For contextual side navigation — not the global header |
| `Icon Button` (Ghost) | Used for utility buttons and hamburger trigger |
| `Avatar` (sm/24px) | Used inside the trailing zone |
| `Badge/Counter` | Optional overlay on the Notifications icon button |
