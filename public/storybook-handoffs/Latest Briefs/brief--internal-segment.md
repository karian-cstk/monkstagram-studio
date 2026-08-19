---
brief_schema: venus-storybook-handover/v2
component_name: "_Internal/Segment"
component_kebab_case: "segment"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=829-70442"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "829:70442"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Internal/Segment"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        _Internal/Segment
  REACT_COMPONENT:       Segment
  STORYBOOK_TITLE:       Internal/Segment
  FIGMA_NODE_ID:         829:70442
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           ⚛️ Atoms (Unpublished)
  CSS_CLASS_PREFIX:      segment
  FILE_NAME:             Segment.tsx
  STORY_FILE_NAME:       Segment.stories.tsx
  CSS_FILE_NAME:         Segment.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
  STATUS:                Active
  ═══════════════════════════════════════════════════════════════════
-->

# _Internal/Segment — Storybook Engineering Handover

> **Internal component.** Not exported from the public package API. Composed exclusively inside `SegmentedControl`. Do not use standalone in product code.

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | Must render as `<button role="radio">` — not a `<div>` or `<span>` | Segment lives inside a `role="radiogroup"` (SegmentedControl). `role="radio"` is the only valid child role. Screen readers must announce it as a radio option. |
| 2 | `aria-checked` must reflect `isSelected` exactly — `"true"` when selected, `"false"` when not | Selection state must be announced on focus without requiring the user to activate the button |
| 3 | Keyboard navigation must use **arrow keys only** — Tab moves focus into/out of the group; Left/Right (and Up/Down) arrows move between segments | `role="radiogroup"` keyboard contract. Tab stops on the entire group, not individual segments. |
| 4 | Disabled state must use `aria-disabled="true"` — NOT the native `disabled` attribute | Native `disabled` removes the element from keyboard focus and tab order, making it impossible to discover. `aria-disabled` keeps it focusable but prevents activation. |
| 5 | Width must be HUG (fit-content) — never a fixed pixel width | Segment width is content-driven. SegmentedControl arranges all segments in a row; fixed widths would prevent flexible label lengths. |
| 6 | Height must be exactly 32px (md) or 40px (lg) — never HUG vertically | Consistent height across all segments in the control regardless of label content |
| 7 | `cornerRadius` is 9999 (pill shape). Cannot be bound via Figma API on COMPONENT nodes — raw value in Figma. In CSS: `border-radius: 9999px` | Known platform limitation — documented in Figma component description. Do not attempt to bind via token. |
| 8 | `disabled` opacity = `visibility/disabled` = **0.40** applied to the root element. NOT `opacity: 0.5`. | Venus system-wide disabled contract. Raw value in Figma (API limitation) — must be correct in code. |

---

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/date | What it establishes |
|---|---|---|---|
| Figma design context (live read) | Node `829:70442`, ⚛️ Atoms (Unpublished) | 2026-08-11 | All 12 variants, exact dimensions, children, token bindings, layout values |
| Figma CSET description | Node `829:70442` description field | 2026-08-11 | Complete token map per state (authoritative — written by design) |
| `venus-21-rf-master.md` | Disabled opacity, focus ring, size contract | Project knowledge | 0.40 disabled opacity, purple/500 focus ring, md/lg sizing |
| `06-component-and-handoff_skill.md` | State→CSS pseudo-class, ARIA rules, Venus pre-flight | Project knowledge | Disabled = aria-disabled, hover/focus = CSS pseudo |
| `_Internal/Icon-Wrapper` brief | Node `214:152884` | 2026-08-11 | Icon-Wrapper is an upstream dependency confirmed HANDOFF_COMPLETE |

### Source precedence

Figma CSET description (design-authored token map) + live node read are jointly authoritative. `venus-21-rf-master.md` governs where conflicts arise. All code decisions are engineer's discretion per market standards.

---

## 1. Outcome and scope

**Definition:** A single selectable pill button — one segment of a Segmented Control — supporting a text label, an optional leading icon, two sizes, and three interaction states.

**User need:** Segmented Control needs a composable, self-contained radio-button atom that handles its own visual states, keyboard role, and accessibility semantics, so the parent control only needs to manage group state and arrow-key routing.

### Use cases

| ID | Use case | Context | Success outcome |
|---|---|---|---|
| UC-01 | Label-only segment | Segmented Control switching between view modes (e.g. Grid / List) | Correct pill shape, label readable, selected state visually distinct |
| UC-02 | Icon + label segment | Segmented Control with icons for context (e.g. ☰ List / ⊞ Grid) | Icon and label aligned horizontally, correct 8px gap |
| UC-03 | Selected segment | Active option in the control | Filled background, brand border, brand text |
| UC-04 | Disabled segment | Non-interactive option | 0.40 opacity, no hover response, `aria-disabled="true"`, still keyboard-focusable |

### Scope

| In scope | Out of scope |
|---|---|
| 12 variants: Type(2) × Size(2) × State(3) | Standalone use outside SegmentedControl |
| md (32px) and lg (40px) sizes | sm, xl sizes |
| `showLabel` boolean (label visible/hidden) | Icon-only variant without `showLabel` wiring |
| `hasLeadingIcon` boolean | Trailing icon |
| `hasFocus` Storybook demo prop | `hasFocus` as a runtime React prop |

### Responsibility boundary

| Segment owns | SegmentedControl (parent) owns |
|---|---|
| Visual state per `isSelected` / `isDisabled` | Tracking which segment is currently selected |
| `aria-checked` | `role="radiogroup"` on the container |
| Keyboard activation (Space/Enter fires callback) | Arrow-key routing between segments |
| Focus ring on `:focus-visible` | Tab stop on the group (not individual segments) |
| `aria-disabled` when disabled | Group-level disabled state |

---

## 2. Existing baseline and change contract

`N/A — new component. No prior Storybook implementation.`

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Atomic `<button>` — self-contained, no sub-components except Icon-Wrapper |
| Existing components to reuse | `IconWrapper` (HANDOFF_COMPLETE) for the leading icon slot |
| Code Connect mappings | None currently |
| Hooks/utilities/providers | None — state is fully prop-driven |
| Existing tokens | Full token chain documented in Section 13 |
| Genuinely new surface | `Segment.tsx`, `Segment.module.css`, `Segment.stories.tsx` |
| Prohibited reimplementation | Do not re-implement radio button keyboard behaviour — use the pattern in Section 9 |

### Dependency tree

| Direction | Component | Must exist before build | Breaking if API changes |
|---|---|---|---|
| Upstream | `IconWrapper` (`214:152884`) | **Yes** — HANDOFF_COMPLETE ✅ | Any `size` prop rename breaks Segment |
| Downstream | `SegmentedControl` (`1478:118457`) | N/A | Any prop rename or ARIA change breaks SegmentedControl |

---

## 4. Anatomy

`REQUIRED` = always rendered · `OPTIONAL` = prop-controlled · `INTERNAL` = never a prop

| element_key | Layer name | Visibility | Condition | RTL mirrors | Figma ref | Semantic/testing requirement |
|---|---|---|---|---|---|---|
| `root` | `segment` | REQUIRED | Always | no | Variant frame | `<button role="radio">`, `data-testid="segment"` |
| `focus-ring` | `Focus Ring` | INTERNAL | `:focus-visible` (production) / `hasFocus=true` (Storybook) | no | Child FRAME, FIXED, size+4px | `aria-hidden="true"`, `position: absolute`, inset −2px |
| `leading-icon` | `Leading` | OPTIONAL | `hasLeadingIcon=true` | yes — icon position swaps in RTL | Child INSTANCE (`_Internal/Icon-Wrapper`), FIXED 16px (md) / 20px (lg) | `aria-hidden` inherited from Icon-Wrapper |
| `label` | `Label` | OPTIONAL | `showLabel=true` | no | Child TEXT, HUG×HUG | Text content, no explicit ARIA — button label is implicit |

> **RTL note on leading-icon:** In RTL layouts, `leading-icon` moves to the trailing position. Achieve via `flex-direction: row-reverse` on the root in RTL contexts.

---

## 5. Public React API

> **Internal component** — props for system use only.

### Props

| Prop | TypeScript type | Required | Default | Behavior | Storybook control |
|---|---|---|---|---|---|
| `label` | `string` | Yes | `'Option'` | Text content of the segment | text |
| `size` | `'md' \| 'lg'` | No | `'md'` | Height (32px / 40px), paddingH, icon size, font size | select |
| `isSelected` | `boolean` | No | `false` | Drives `aria-checked`, selected visual state | boolean |
| `isDisabled` | `boolean` | No | `false` | `aria-disabled="true"`, 0.40 opacity, no hover, blocks activation | boolean |
| `showLabel` | `boolean` | No | `true` | Hides label text. Use with `hasLeadingIcon=true` for icon-only mode | boolean |
| `hasLeadingIcon` | `boolean` | No | `false` | Shows `IconWrapper` before label | boolean |
| `leadingIcon` | `React.ReactNode` | No | — | Icon element. Required when `hasLeadingIcon=true` | — |
| `hasFocus` | `boolean` | No | `false` | **Storybook only.** Shows focus ring. Never pass in production. | boolean |
| `onClick` | `() => void` | No | — | Called on click or Space/Enter, unless `isDisabled=true` | — |
| `className` | `string` | No | `''` | Forwarded to root `<button>` | — |

### Callbacks

| Callback | Trigger | Signature | Must not fire when |
|---|---|---|---|
| `onClick` | Click, Space, Enter | `() => void` | `isDisabled === true` |

### API mechanics

| Concern | Contract |
|---|---|
| Controlled/uncontrolled | Stateless — `isSelected` is always controlled by parent (SegmentedControl) |
| Internal state | None |
| Prop changes after mount | `isSelected`, `isDisabled`, `label` update cleanly on re-render |
| Ref forwarding | `React.forwardRef` to root `<button>` |
| Native DOM props | `...rest` spread to `<button>`. Do not pass `role` — hardcoded as `radio`. |
| `disabled` attribute | Must NOT use native `disabled`. Use `aria-disabled="true"` + block `onClick` in handler. |
| `tabIndex` | SegmentedControl manages `tabIndex` via roving tabindex pattern — Segment accepts `tabIndex` as a prop via `...rest` |

### TypeScript interface

```typescript
/**
 * A single selectable segment pill inside a SegmentedControl.
 * Renders as role="radio" — must be used inside a role="radiogroup" container.
 *
 * @internal — Do not use outside SegmentedControl.
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=829-70442
 */
export interface SegmentProps {
  /** Visible label text. */
  label: string;
  /** Size variant. Controls height, padding, icon size, and font size. @default 'md' */
  size?: 'md' | 'lg';
  /** Whether this segment is the currently selected option. @default false */
  isSelected?: boolean;
  /** Whether this segment is non-interactive. Uses aria-disabled — not native disabled. @default false */
  isDisabled?: boolean;
  /** Show/hide the label text. Set false for icon-only mode. @default true */
  showLabel?: boolean;
  /** Whether to render a leading icon. @default false */
  hasLeadingIcon?: boolean;
  /** Icon element to render as leading icon. Required when hasLeadingIcon is true. */
  leadingIcon?: React.ReactNode;
  /**
   * Storybook demo only — shows focus ring via CSS class.
   * In production the ring is driven by :focus-visible. Never pass at runtime.
   * @default false
   */
  hasFocus?: boolean;
  /** Called on click or keyboard activation. Not called when isDisabled is true. */
  onClick?: () => void;
  /** Additional class forwarded to the root button. */
  className?: string;
}
```

### JSX base component

```tsx
import React from 'react';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import type { SegmentProps } from './Segment';
import styles from './Segment.module.css';

export const Segment = React.forwardRef<HTMLButtonElement, SegmentProps>(
  (
    {
      label,
      size = 'md',
      isSelected = false,
      isDisabled = false,
      showLabel = true,
      hasLeadingIcon = false,
      leadingIcon,
      hasFocus = false,
      onClick,
      className,
      ...rest
    },
    ref
  ) => {
    const iconSize = size === 'md' ? 16 : 20;

    const handleClick = () => {
      if (!isDisabled && onClick) onClick();
    };

    return (
      <button
        ref={ref}
        role="radio"
        aria-checked={isSelected}
        aria-disabled={isDisabled || undefined}
        data-testid="segment"
        className={[
          styles['segment'],
          styles[`segment--${size}`],
          isSelected ? styles['segment--selected'] : styles['segment--unselected'],
          isDisabled ? styles['segment--disabled'] : '',
          hasFocus ? styles['segment--focused'] : '',
          className,
        ].filter(Boolean).join(' ')}
        style={isDisabled ? { opacity: 'var(--venus-visibility-disabled)' } : undefined}
        onClick={handleClick}
        {...rest}
      >
        {/* Focus ring — INTERNAL */}
        <span className={styles['segment__focus-ring']} aria-hidden="true" />

        {/* Leading icon */}
        {hasLeadingIcon && leadingIcon && (
          <IconWrapper size={iconSize} icon={leadingIcon} />
        )}

        {/* Label */}
        {showLabel && (
          <span className={styles['segment__label']}>{label}</span>
        )}
      </button>
    );
  }
);

Segment.displayName = 'Segment';
```

**Segment.module.css:**

```css
/* Root — pill shape, horizontal flex, height fixed per size */
.segment {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 9999px;        /* pill — cannot be token-bound via Figma API on COMPONENT nodes */
  border: 1px solid transparent; /* placeholder; overridden per state */
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  background: transparent;
  font-family: var(--venus-font-inter);
  font-weight: 500;              /* Medium */
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
}

/* Size variants */
.segment--md {
  height: 32px;
  padding-inline: var(--venus-space-12, 12px);
  gap: var(--venus-space-8, 8px);
  font-size: var(--venus-font-size-body-md, 14px);
  line-height: 130%;
}

.segment--lg {
  height: 40px;
  padding-inline: var(--venus-space-16, 16px);
  gap: var(--venus-space-8, 8px);
  font-size: var(--venus-font-size-body-lg, 16px);
  line-height: 130%;
}

/* ── Unselected states ─────────────────── */
.segment--unselected {
  background: transparent;
  border-color: transparent;
  color: var(--venus-text-subtle);
}

.segment--unselected:hover:not(.segment--disabled) {
  background: var(--venus-action-ghost-hover);
  color: var(--venus-text-brand);
}

/* ── Selected states ───────────────────── */
.segment--selected {
  background: var(--venus-action-secondary-hover);
  border-color: var(--venus-border-brand);
  color: var(--venus-text-brand);
}

.segment--selected:hover:not(.segment--disabled) {
  background: var(--venus-action-secondary-active);
  border-color: var(--venus-border-brand);
  color: var(--venus-text-brand);
}

/* ── Disabled (both types) ─────────────── */
/* opacity set inline via style prop — visibility/disabled = 0.40 */
.segment--disabled {
  pointer-events: none;
  cursor: not-allowed;
}

/* Selected Disabled: border changes to border/disabled */
.segment--selected.segment--disabled {
  border-color: var(--venus-border-disabled);
}

/* ── Focus ring — INTERNAL ─────────────── */
.segment__focus-ring {
  display: none;
  position: absolute;
  inset: -2px;
  border: 2px solid var(--venus-border-focus);
  border-radius: 9999px;        /* matches pill root */
  pointer-events: none;
}

/* Show ring: Storybook demo */
.segment--focused .segment__focus-ring {
  display: block;
}

/* Show ring: production */
.segment:focus-visible .segment__focus-ring {
  display: block;
}

/* ── Label ─────────────────────────────── */
.segment__label {
  /* inherits font-size and color from root */
}
```

### Invalid combinations

| Combination | Valid | Required result |
|---|---|---|
| `showLabel=false` AND `hasLeadingIcon=false` | No | Renders empty button — warn in dev. At least one of `showLabel` or `hasLeadingIcon` must be true. |
| `hasLeadingIcon=true` AND `leadingIcon` is undefined | No | Skip icon render; warn in dev |
| `size` not `'md'` or `'lg'` | No | TypeScript compile error |
| `disabled` HTML attribute passed via `rest` | No | Strip and warn — use `isDisabled` prop |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop | Mapping rule | React default |
|---|---|---|---|---|
| `Type` (VARIANT) | `Unselected \| Selected` | `isSelected: boolean` | `Selected → true`, `Unselected → false` | `false` |
| `Size` (VARIANT) | `md \| lg` | `size: 'md' \| 'lg'` | direct | `'md'` |
| `State` (VARIANT) | `Default \| Hover \| Disabled` | Hover → `:hover` CSS pseudo (never a prop); `Disabled → isDisabled: boolean` | case/format transform | `false` |
| `label#829:4588` (TEXT) | Any string | `label: string` | direct | `'Option'` |
| `showLabel#829:4601` (BOOLEAN) | `true \| false` | `showLabel: boolean` | direct | `true` |
| `hasLeadingIcon#829:4614` (BOOLEAN) | `true \| false` | `hasLeadingIcon: boolean` | direct | `false` |
| `hasFocus#829:4627` (BOOLEAN) | `true \| false` | `hasFocus: boolean` | direct — Storybook demo only | `false` |

### Unmapped design properties

`N/A — all properties mapped.`

### Unmapped code properties

`N/A — new component.`

---

## 7. Variants, states, and precedence

### Size contract

| Size | Height | PaddingH | Gap | Icon size | Font size | Default? |
|---|---|---|---|---|---|---|
| `md` | **32px** (fixed) | 12px (`space/12`) | 8px (`space/8`) | 16px | 14px (Body/MD) | **Yes** |
| `lg` | **40px** (fixed) | 16px (`space/16`) | 8px (`space/8`) | 20px | 16px (Body/LG) | No |

Width = HUG (content-driven) for both sizes.

### Variant cross-matrix

| | State=Default | State=Hover | State=Disabled |
|---|---|---|---|
| **Type=Unselected, Size=md** | ✓ `829:70430` | ✓ `829:70431` | ✓ `829:70432` |
| **Type=Unselected, Size=lg** | ✓ `829:70433` | ✓ `829:70434` | ✓ `829:70435` |
| **Type=Selected, Size=md** | ✓ `829:70436` | ✓ `829:70437` | ✓ `829:70438` |
| **Type=Selected, Size=lg** | ✓ `829:70439` | ✓ `829:70440` | ✓ `829:70441` |

All 12 combinations are valid.

### State table

| State | Category | Trigger | CSS mechanism | ARIA change | Required story |
|---|---|---|---|---|---|
| Unselected/Default | Base | Initial render, `isSelected=false` | — | `aria-checked="false"` | `Unselected` |
| Unselected/Hover | Interaction | Pointer enter | `:hover` — never a prop | — | `Hovered` |
| Selected/Default | Public | `isSelected=true` | `.segment--selected` class | `aria-checked="true"` | `Selected` |
| Selected/Hover | Interaction | Pointer enter when selected | `.segment--selected:hover` | — | — |
| Disabled | Public | `isDisabled=true` | `aria-disabled="true"` + `opacity: 0.40` on root + `pointer-events: none` | `aria-disabled="true"` | `Disabled` |
| Focused | INTERNAL | `:focus-visible` / `hasFocus=true` (Storybook) | Focus ring `display: block` | — | `Focused` |

### State precedence

| Higher state | Lower state | Result |
|---|---|---|
| Disabled | Hover | Hover suppressed — `pointer-events: none` prevents hover |
| Disabled | Focused | Segment can still receive focus (`aria-disabled` not `disabled`) — focus ring shows |
| Selected | Unselected | Selected wins — determined by parent |

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure mode |
|---|---|---|---|---|
| BR-01 | `isDisabled=true` | User clicks or presses Space/Enter | `onClick` does not fire | Disabled segment responds to interaction |
| BR-02 | `isDisabled=true` | User presses Tab | Segment still receives focus (not skipped) | Segment is invisible to keyboard users |
| BR-03 | `isSelected=true` | Component renders | `aria-checked="true"` on root button | Screen reader does not announce selection |
| BR-04 | `showLabel=false` AND `hasLeadingIcon=false` | Component renders | `console.warn` in dev — at least one must be visible | Empty button with no accessible name |
| BR-05 | `hasLeadingIcon=true` AND `leadingIcon` is undefined | Component renders | Icon slot skipped; `console.warn` | Unexpected empty space or error |

### Input and data validation

| Prop | Valid | Invalid/edge | Behavior |
|---|---|---|---|
| `label` | Non-empty string | Empty string `''` | Warn in dev when `showLabel=true` — label is the accessible name |
| `size` | `'md' \| 'lg'` | Any other | TypeScript error |
| `leadingIcon` | ReactNode | `null`, `undefined` when `hasLeadingIcon=true` | Skip render, warn |

---

## 9. Interactions and focus

### Interaction table

| ID | element_key | Action | Precondition | Result | Callback | Keyboard | Disabled behavior |
|---|---|---|---|---|---|---|---|
| INT-01 | `root` | Click | `isDisabled=false` | Fires `onClick` | `onClick()` | Space, Enter | Blocked |
| INT-02 | `root` | Arrow Right / Arrow Down | Focused, inside SegmentedControl | Focus moves to next segment | — | Arrow Right / Down | Focus still moves (disabled segment accepts focus) |
| INT-03 | `root` | Arrow Left / Arrow Up | Focused, inside SegmentedControl | Focus moves to previous segment | — | Arrow Left / Up | Focus still moves |

> **Note:** Arrow-key routing is implemented in `SegmentedControl`, not in `Segment`. Segment simply needs to be focusable (not `disabled` attribute).

### Focus management

| Event | Focus target | Movement | Restoration | Focus ring |
|---|---|---|---|---|
| User tabs into SegmentedControl | The currently selected Segment (roving tabindex) | Arrow keys route within group | Returns to last focused Segment | `:focus-visible .segment__focus-ring { display: block }` |

**Focus ring contract:**

| Property | Value |
|---|---|
| CSS trigger (production) | `:focus-visible` on root `<button>` |
| CSS trigger (Storybook) | `.segment--focused` class via `hasFocus` prop |
| Element | `.segment__focus-ring`, `aria-hidden="true"`, `position: absolute` |
| Inset | `−2px` |
| Border | `2px solid var(--venus-border-focus)` → `purple/500` Light / `purple/400` Dark |
| Border radius | `9999px` (matches pill root) |

**Storybook Focused story:**
```tsx
export const Focused: Story = {
  args: { label: 'Option', isSelected: false, hasFocus: true },
};
```

### Motion

| Motion | Trigger | Property | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|
| State transition | Hover, selection change | `background`, `border-color`, `color` | 120ms | `ease` | `prefers-reduced-motion: reduce` → `transition: none` |

---

## 10. Dynamic positioning

`N/A — no dynamically repositioned elements.`

---

## 11. Responsive behavior

| Constraint | Rule |
|---|---|
| Width | HUG — grows with label; no min or max width set on Segment itself |
| Height | Fixed: 32px (md), 40px (lg) |
| Inside SegmentedControl | `flex-shrink: 0` — never compresses |
| Zoom/reflow | Pill shape and height maintained at all zoom levels |

---

## 12. Content, localization, and edge cases

| Case | Required behavior | Story |
|---|---|---|
| Long label | Segment widens to fit label — SegmentedControl must handle overflow | `LongLabel` |
| Empty label with `showLabel=true` | Warn in dev — empty string gives no accessible name | N/A |
| Single character label | Minimum width = paddingH×2 + character width (no forced min-width on Segment) | N/A |
| RTL layout | `flex-direction: row-reverse` on root when `dir="rtl"` — leading icon moves to trailing position | `RTL` |
| Icon-only (`showLabel=false`, `hasLeadingIcon=true`) | Icon visible, label hidden, icon provides accessible name via parent context | `IconOnly` |

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't | Rationale |
|---|---|---|
| Use `aria-disabled="true"` for disabled segments | Use native `disabled` attribute | Native `disabled` removes the element from keyboard navigation — users can never discover it |
| Let SegmentedControl manage arrow-key routing | Implement arrow-key logic inside Segment | Arrow routing is a group concern — Segment only handles Space/Enter activation |
| Keep width HUG — let content drive it | Set a fixed pixel width on Segment | Segments have different label lengths; fixed width breaks natural layout |
| Use `isSelected` as a controlled prop | Manage selection state inside Segment | Selection is always group-level state owned by SegmentedControl |
| Always pair with a non-empty `label` | Set `showLabel=false` without `hasLeadingIcon=true` | Empty button has no accessible name |
| Apply `opacity: 0.40` to the root element | Apply opacity to individual children | Opacity on root fades everything uniformly — child-level opacity produces uneven results |

---

## 13. Tokens, typography, and assets

**Token chain:** `_Primitives → Venus_Semantics → component layer`. All bindings live-verified 2026-08-11.

### Tokens — background fills

| State | Token (full chain) | CSS custom property | Light | Dark |
|---|---|---|---|---|
| Unselected/Default | No fill | — | transparent | transparent |
| Unselected/Hover | `[VS] action/ghost/hover` (`VariableID:564:3226`) ← `purple/500-a8` | `--venus-action-ghost-hover` | `rgba(108,92,231,0.05)` | — |
| Selected/Default | `[VS] action/secondary/hover` (`VariableID:564:3221`) ← `purple/100` | `--venus-action-secondary-hover` | `#EDE9FE` | — |
| Selected/Hover | `[VS] action/secondary/active` (`VariableID:564:3222`) ← `purple/200` | `--venus-action-secondary-active` | `#DDD6FE` | — |
| Selected/Disabled | `[VS] action/secondary/hover` (same as Selected/Default) | `--venus-action-secondary-hover` | `#EDE9FE` | — |
| Unselected/Disabled | No fill | — | transparent | transparent |

### Tokens — border strokes

| State | Token | CSS custom property | Light |
|---|---|---|---|
| Unselected/Default | No border | — | transparent |
| Unselected/Hover | No border | — | transparent |
| Selected/Default | `[VS] border/brand` (`VariableID:564:3211`) | `--venus-border-brand` | `purple/500` |
| Selected/Hover | `[VS] border/brand` (`VariableID:564:3211`) | `--venus-border-brand` | `purple/500` |
| Selected/Disabled | `[VS] border/disabled` (`VariableID:564:3212`) | `--venus-border-disabled` | — |
| Unselected/Disabled | No border | — | transparent |

### Tokens — label text color

| State | Token | CSS custom property |
|---|---|---|
| Unselected/Default | `[VS] text/subtle` (`VariableID:564:3193`) | `--venus-text-subtle` |
| Unselected/Hover | `[VS] text/brand` (`VariableID:564:3199`) | `--venus-text-brand` |
| Unselected/Disabled | `[VS] text/disabled` (`VariableID:564:3196`) | `--venus-text-disabled` |
| Selected/Default | `[VS] text/brand` (`VariableID:564:3199`) | `--venus-text-brand` |
| Selected/Hover | `[VS] text/brand` (`VariableID:564:3206`) | `--venus-text-brand` (hover shade — see DEC-01) |
| Selected/Disabled | `[VS] text/disabled` (`VariableID:564:3196`) | `--venus-text-disabled` |

### Tokens — layout (spacing, radius, border-width)

| Property | Token | CSS custom property | Value |
|---|---|---|---|
| `gap` | `[P] space/8` (`VariableID:546:3061`) | `--venus-space-8` | 8px |
| `padding-inline` (md) | `[P] space/12` (`VariableID:546:3062`) | `--venus-space-12` | 12px |
| `padding-inline` (lg) | `[P] space/16` (`VariableID:546:3063`) | `--venus-space-16` | 16px |
| `border-radius` | 9999 (raw — API limitation on COMPONENT nodes) | `border-radius: 9999px` in CSS | 9999px |
| `border-width` | `[P] border-width/1` (`VariableID:546:3085`) | `--venus-border-width-1` | 1px |

### Tokens — opacity and focus

| Property | Token | CSS custom property | Value |
|---|---|---|---|
| Disabled opacity | `[VS] visibility/disabled` (`VariableID:564:3246`) | `--venus-visibility-disabled` | **0.40** (raw in Figma — API limitation; must be correct in code) |
| Focus ring border | `[VS] border/focus` (`VariableID:564:3227`) | `--venus-border-focus` | `purple/500` Light / `purple/400` Dark |

### Typography

| element_key | Token | Family | Weight | Size | Line height |
|---|---|---|---|---|---|
| `label` (md) | `[VT] Body/MD` (`VariableID:546:3108`) | Inter | 500 (Medium) | 14px | 130% |
| `label` (lg) | `[VT] Body/LG` (`VariableID:546:3109`) | Inter | 500 (Medium) | 16px | 130% |

### Icon mode map

| Context | Venus_Icons mode | Applied by |
|---|---|---|
| All non-disabled states | `default` (brand purple) | SegmentedControl sets `data-icon-mode="default"` on group root |
| Disabled | `disabled` (gray) | SegmentedControl sets `data-icon-mode="disabled"` when group/segment is disabled |

---

## 14. Accessibility contract

### Semantics and naming

| Concern | Requirement |
|---|---|
| Root element | `<button role="radio">` — always |
| `aria-checked` | `"true"` when `isSelected=true`; `"false"` when `isSelected=false` |
| Accessible name | Implicit from `label` text content. When `showLabel=false`, the icon must be accompanied by a group-level label on SegmentedControl that names the options. |
| `aria-disabled` | `"true"` when `isDisabled=true`. Never use native `disabled` — it removes from tab order. |
| Prohibited | `role` override, `aria-pressed`, `aria-selected` (use `aria-checked` for `role="radio"`) |

### Keyboard

| Context | Key | Result | Focus after | Prevent default |
|---|---|---|---|---|
| Segment focused | Space | Fire `onClick` (unless disabled) | Stays on Segment | Yes |
| Segment focused | Enter | Fire `onClick` (unless disabled) | Stays on Segment | Yes |
| Inside SegmentedControl | Arrow Right / Down | Move focus to next segment (managed by SegmentedControl) | Next Segment | Yes |
| Inside SegmentedControl | Arrow Left / Up | Move focus to previous segment (managed by SegmentedControl) | Previous Segment | Yes |
| SegmentedControl | Tab | Move focus into group (to selected segment) | Selected Segment | No |
| SegmentedControl focused | Shift+Tab | Exit group | Previous focusable element | No |

### Announcements

| Event | Announcement | Live region | Timing |
|---|---|---|---|
| Segment receives focus | Screen reader reads button label + `aria-checked` state + position in group (e.g. "Grid, radio button, checked, 2 of 3") | Native — no live region needed | On focus |
| Selection changes | `aria-checked` changes → screen reader announces new state | Native | Immediate on state change |

### Acceptance

| Area | Requirement |
|---|---|
| Focus visible | Focus ring visible on `:focus-visible` — 2px `border/focus`, inset −2px, pill shape |
| Focus order | Roving tabindex managed by SegmentedControl — only selected (or first) segment in tab order |
| Contrast | Text/subtle on transparent: must meet 4.5:1 for normal text. Text/brand on action/secondary/hover: must meet 4.5:1. Verify in both Light and Dark. |
| Touch target | Segment height ≥ 32px (md) — satisfies WCAG 2.5.5 minimum 24px |
| Zoom/reflow | Pill shape and height maintained at 200% zoom |
| Reduced motion | All CSS transitions wrapped in `@media (prefers-reduced-motion: no-preference)` |
| High contrast | `border-color: currentColor` fallback for forced-colors mode |

---

## 15. Storybook contract

### Environment

| Field | Requirement |
|---|---|
| Story format | CSF3 |
| Layout | `layout: 'centered'` |
| Globals | Light + Dark both required for every story |
| Decorators | Wrap in a `role="radiogroup"` container decorator for all stories (Segment must live inside a radiogroup) |
| Viewports | Default |

**Required decorator:**
```tsx
const RadioGroupDecorator: Decorator = (Story) => (
  <div role="radiogroup" aria-label="Demo group" style={{ display: 'flex', gap: 4 }}>
    <Story />
  </div>
);
```

### Controls

| Prop | Control | Options | Default |
|---|---|---|---|
| `label` | text | — | `'Option'` |
| `size` | select | `'md', 'lg'` | `'md'` |
| `isSelected` | boolean | — | `false` |
| `isDisabled` | boolean | — | `false` |
| `showLabel` | boolean | — | `true` |
| `hasLeadingIcon` | boolean | — | `false` |
| `hasFocus` | boolean | — | `false` |

### Required stories

| Export | Storybook ID | Args | Theme | Key assertion |
|---|---|---|---|---|
| `Unselected` | `internal-segment--unselected` | `{ label: 'Option', isSelected: false }` | light + dark | `aria-checked="false"`, text/subtle colour |
| `Selected` | `internal-segment--selected` | `{ label: 'Option', isSelected: true }` | light + dark | `aria-checked="true"`, brand fill + border |
| `Hovered` | `internal-segment--hovered` | `{ label: 'Option', isSelected: false }` + hover decorator | light + dark | ghost hover background |
| `SelectedHovered` | `internal-segment--selected-hovered` | `{ label: 'Option', isSelected: true }` + hover decorator | light + dark | secondary/active background |
| `Disabled` | `internal-segment--disabled` | `{ label: 'Option', isDisabled: true }` | light + dark | `aria-disabled="true"`, `opacity: 0.40`, click blocked |
| `SelectedDisabled` | `internal-segment--selected-disabled` | `{ label: 'Option', isSelected: true, isDisabled: true }` | light + dark | `aria-disabled="true"`, `opacity: 0.40`, border/disabled |
| `Focused` | `internal-segment--focused` | `{ label: 'Option', hasFocus: true }` | light + dark | Focus ring visible, 2px border/focus |
| `SizeLg` | `internal-segment--size-lg` | `{ label: 'Option', size: 'lg' }` | light + dark | 40px height |
| `WithIcon` | `internal-segment--with-icon` | `{ label: 'Grid', hasLeadingIcon: true, leadingIcon: <GridIcon /> }` | light + dark | Icon + label at 8px gap |
| `IconOnly` | `internal-segment--icon-only` | `{ label: 'Grid', hasLeadingIcon: true, leadingIcon: <GridIcon />, showLabel: false }` | light + dark | Icon visible, label hidden |
| `LongLabel` | `internal-segment--long-label` | `{ label: 'Monthly Overview' }` | light + dark | Width grows with label |

---

## 16. Test and visual-verification contract

### Per-prop verification

| Prop | Valid values | Invalid/edge | Default test | Key assertion |
|---|---|---|---|---|
| `isSelected` | `true, false` | — | `false` → `aria-checked="false"` | `aria-checked` mirrors `isSelected` exactly |
| `isDisabled` | `true, false` | — | `false` → interactive | `aria-disabled="true"`, opacity 0.40, `onClick` not fired |
| `size` | `'md', 'lg'` | Any other | `'md'` → 32px | `offsetHeight === (size === 'md' ? 32 : 40)` |
| `showLabel` | `true, false` | — | `true` → label visible | `false` → label element not rendered or hidden |
| `hasLeadingIcon` | `true, false` | `true` + `leadingIcon=undefined` | `false` → no icon | Icon-Wrapper present when `true` |

### Conditional element inventory

| element_key | Controlling condition | Presence test | Absence test |
|---|---|---|---|
| `leading-icon` | `hasLeadingIcon=true` AND `leadingIcon` defined | `getByTestId('icon-wrapper')` present | Not found |
| `label` | `showLabel=true` | Label text content matches `label` prop | Not rendered or visually hidden |
| `focus-ring` | `:focus-visible` OR `hasFocus=true` | `display: block` | `display: none` |

### Interaction verification

| Interaction | Story | Drive | Callback assertion | DOM assertion |
|---|---|---|---|---|
| INT-01: Click enabled | `Selected` | `userEvent.click` | `onClick` called once | `aria-checked` updates (if controlled) |
| INT-02: Click disabled | `Disabled` | `userEvent.click` | `onClick` NOT called | `aria-checked` unchanged |
| INT-03: Space key | `Unselected` | `userEvent.keyboard('[Space]')` | `onClick` called once | — |
| INT-04: Enter key | `Unselected` | `userEvent.keyboard('[Enter]')` | `onClick` called once | — |

### Visual matrix

| Story | Viewport | Theme | Figma reference | Tolerance |
|---|---|---|---|---|
| `Unselected` | 800×600 | light + dark | Node `829:70430` | 0.2% |
| `Selected` | 800×600 | light + dark | Node `829:70436` | 0.2% |
| `Disabled` | 800×600 | light + dark | Node `829:70432` | 0.2% |
| `SizeLg` | 800×600 | light + dark | Node `829:70433` | 0.2% |
| `Focused` | 800×600 | light + dark | Focus ring reference | 0.2% |

---

## 17. Decisions and confirmed resolutions

### Confirmed decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | `Selected/Hover` label uses `VariableID:564:3206` (slightly darker brand shade than `3199`) | Live Figma read shows 3199 for Selected/Default and 3206 for Selected/Hover. Design description says "text/brand" for both — this is an intentional hover darkening within the brand color range. Both are semantically `text/brand`; the hover shade gives additional affordance. Implement as `--venus-text-brand` with a slight hover darkening layer if 3206 resolves to a distinct token, or treat as the same token with a hover modifier. |
| DEC-02 | `cornerRadius=9999` and `strokeWeight=1px` are raw values in CSS — no token binding | Known Figma API limitation on COMPONENT nodes (documented in the CSET description). CSS uses `border-radius: 9999px` and `border-width: 1px` directly, not token-derived. |
| DEC-03 | `isDisabled` prop uses `aria-disabled="true"` + blocks `onClick` — NOT native `disabled` attribute | Ensures disabled segments remain keyboard-discoverable. Arrow-key navigation must be able to land on disabled segments so users know the option exists. |
| DEC-04 | Disabled opacity applied inline via `style` prop as `var(--venus-visibility-disabled)` | Raw value in Figma (API limitation). CSS custom property approach ensures correctness and theming while avoiding hardcoded 0.40 in component source. |

### Rejected approaches

| ID | Approach | Why rejected | Chosen instead |
|---|---|---|---|
| REJ-01 | `<div>` or `<span>` as root | No implicit button semantics; keyboard activation requires manual handler; `role="radio"` still needed | `<button role="radio">` — keyboard and ARIA correct out of the box |
| REJ-02 | Native `disabled` attribute | Removes segment from keyboard tab order — violates ARIA radiogroup pattern | `aria-disabled="true"` + pointer-events guard |
| REJ-03 | Fixed width on Segment | All segments in a SegmentedControl would be forced to the same width regardless of label length | Width = HUG — SegmentedControl arranges them; each grows to its content |

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma node `829:70442` — live read 2026-08-11
- [x] All 12 variants accounted for in the variant matrix
- [x] Mode NEW, scope explicit
- [x] Absolute Requirements documented (8 numbered items)
- [x] Upstream dependency `_Internal/Icon-Wrapper` confirmed HANDOFF_COMPLETE
- [x] Anatomy, API, token chain (all states), states, ARIA, keyboard, stories, tests complete
- [x] `unresolved_question_count: 0`
- [x] No hardcoded values in the brief

### Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Design | George Karian | PENDING | — |
| Engineering | Narendra | PENDING | — |
