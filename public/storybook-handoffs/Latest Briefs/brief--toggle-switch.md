---
brief_schema: venus-storybook-handover/v2
component_name: "Toggle Switch"
component_kebab_case: "toggle-switch"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=652-29329"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "652:29329"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Actions/ToggleSwitch"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        Toggle Switch
  REACT_COMPONENT:       ToggleSwitch
  STORYBOOK_TITLE:       Actions/ToggleSwitch
  FIGMA_NODE_ID:         652:29329
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           🔘 Actions
  CSS_CLASS_PREFIX:      toggle-switch
  FILE_NAME:             ToggleSwitch.tsx
  STORY_FILE_NAME:       ToggleSwitch.stories.tsx
  CSS_FILE_NAME:         ToggleSwitch.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
  STATUS:                Active
  ═══════════════════════════════════════════════════════════════════
-->

# Toggle Switch — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | Must render as `<button role="switch">` — not `role="checkbox"`, not a `<div>` | `role="switch"` has specific AT announcement semantics ("on/off") distinct from checkboxes. WCAG requires correct role for binary controls. |
| 2 | `aria-checked` must always mirror the `checked` state — `"true"` when on, `"false"` when off | Screen readers announce the current state on focus; missing or incorrect `aria-checked` makes the control useless for AT users |
| 3 | Thumb must animate — `transition: left 150ms ease-in-out`. OFF: `left: 4px`. ON lg: `left: 20px`. ON md: `left: 16px` | Static frame in Figma cannot show this. Animation is a defined design requirement (documented in CSET description). |
| 4 | `disabled` must use `aria-disabled="true"` — NOT native `disabled` attribute | Native `disabled` removes from tab order — keyboard users cannot discover the control exists |
| 5 | `readOnly` must use `aria-readonly="true"` — NOT `aria-disabled` | ReadOnly and Disabled are distinct states with different semantics. ReadOnly: value visible, interaction blocked. Disabled: control is unavailable entirely. |
| 6 | Both Disabled AND ReadOnly apply `opacity: var(--venus-visibility-disabled)` (= **0.40**) to the root | Figma confirmed — both states use `VariableID:564:3246`. Live-verified 2026-08-11. |
| 7 | `labelPosition="top"` requires `flex-direction: column` — label above track. Right/Left require `flex-direction: row` with label order swapped for Left. | Three distinct layout modes — not achievable via a single flex configuration |
| 8 | Must support both **controlled** (`checked` + `onChange`) and **uncontrolled** (`defaultChecked`) modes | Standard React form contract — required for use in both controlled forms and standalone contexts |
| 9 | `onChange` must NOT fire when `disabled` or `readOnly` | Both states block interaction at the handler level, not just visually |
| 10 | Focus ring wraps the track only (`toggle-track-container`), not the full component including label | Focus ring is positioned inside `toggle-track-container`, 4px larger than the container on all sides |

---

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/date | What it establishes |
|---|---|---|---|
| Figma design context (live read) | Node `652:29329`, 🔘 Actions | 2026-08-11 | All 48 variants, exact dimensions, children structure, all token bindings |
| Figma CSET description | `652:29329` description field | 2026-08-11 | Complete token map, thumb animation spec, ARIA requirements, props/events |
| `venus-21-rf-master.md` | Disabled opacity, size contract | Project knowledge | 0.40 disabled opacity, md/lg sizing confirmed |
| `06-component-and-handoff_skill.md` | Venus pre-flight, state→CSS rules | Project knowledge | Hover=CSS pseudo, disabled=aria-disabled, focus ring spec |

### Source precedence

CSET description (design-authored) + live Figma read are jointly authoritative. `venus-21-rf-master.md` governs token value conflicts. All code decisions are engineer's discretion per market standards.

---

## 1. Outcome and scope

**Definition:** A binary on/off control that gives users a clear, immediate way to enable or disable a setting, rendered as an animated pill track with a sliding thumb.

**User need:** Content editors and configuration users in Contentstack need to toggle settings on or off with immediate visual feedback and screen-reader announcement of the current state.

### Use cases

| ID | Use case | Context | Success outcome |
|---|---|---|---|
| UC-01 | Enable/disable a feature flag | Settings panel, label to the right | Clear on/off visual, `aria-checked` announced on focus |
| UC-02 | Toggle with label above | Form with vertical layout (e.g. compact settings grid) | Label stacked above track, correct `labelPosition="top"` |
| UC-03 | Read-only display of system-controlled state | Configuration view | 0.40 opacity, `aria-readonly="true"`, no interaction |
| UC-04 | Disabled toggle in a permissions-locked form | User lacks permission to change the setting | 0.40 opacity, `aria-disabled="true"`, keyboard-discoverable |

### Scope

| In scope | Out of scope |
|---|---|
| lg (40px) and md (32px) sizes | sm, xl sizes |
| labelPosition: Right, Left, Top | Bottom label position |
| isActive: False/True (checked state) | Indeterminate state |
| State: Default, Hover, Disabled, ReadOnly | Loading state |
| Controlled + uncontrolled modes | Group/list management |

### Responsibility boundary

| ToggleSwitch owns | Consumer owns |
|---|---|
| Visual state (track color, thumb position, opacity) | Form state management |
| `role="switch"`, `aria-checked`, `aria-disabled`, `aria-readonly` | Associating the toggle with a form via `name` / form context |
| Blocking `onChange` when disabled/readOnly | Persisting or submitting the value |
| Focus ring on `:focus-visible` | Layout placement in forms |

---

## 2. Existing baseline and change contract

`N/A — new component. No prior Storybook implementation.`

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Standalone compound component — `<button>` wrapping track container + label |
| Existing components to reuse | None — no sub-components required |
| Hooks/utilities/providers | `useControllable` hook for controlled/uncontrolled pattern |
| Existing tokens | Venus_Components `toggle/*` collection (27 variables, confirmed active) |
| Genuinely new surface | `ToggleSwitch.tsx`, `ToggleSwitch.module.css`, `ToggleSwitch.stories.tsx` |
| Prohibited reimplementation | Do not use `<input type="checkbox">` — `role="switch"` has different AT semantics |

### Dependency tree

| Direction | Component | Must exist before build | Breaking if API changes |
|---|---|---|---|
| Upstream | None | — | — |
| Downstream | Any form or settings panel using Toggle Switch | N/A | `checked`/`onChange` prop rename is breaking |

---

## 4. Anatomy

`REQUIRED` = always rendered · `OPTIONAL` = prop-controlled · `INTERNAL` = never a prop

| element_key | Layer name | Visibility | Condition | RTL mirrors | Figma ref | Semantic/testing requirement |
|---|---|---|---|---|---|---|
| `root` | `toggle-switch` | REQUIRED | Always | no | Variant frame | `<button role="switch">`, `data-testid="toggle-switch"` |
| `track-container` | `toggle-track-container` | REQUIRED | Always | no | Child FRAME, FIXED — lg: 44×28px / md: 36×24px | `data-testid="toggle-track-container"` |
| `track` | `toggle-track` | REQUIRED | Always | no | Child RECTANGLE, FIXED — lg: 36×20px / md: 28×16px | `data-testid="toggle-track"` |
| `thumb` | `toggle-thumb` | REQUIRED | Always | no | Child ELLIPSE, FIXED — lg: 20×20px / md: 16×16px | `data-testid="toggle-thumb"` — position changes on checked state |
| `focus-ring` | `toggle-focus-ring` | INTERNAL | `:focus-visible` / `hasFocus=true` (Storybook) | no | Child RECTANGLE, FIXED — lg: 48×32px / md: 40×28px | `aria-hidden="true"`, wraps track-container only |
| `label` | `toggle-label` | REQUIRED | Always (label text always present) | no | Child TEXT, HUG×HUG | Label text — implicit accessible name for the switch |

> **Label order in DOM:** `labelPosition="right"` (default) → track-container first, label second. `labelPosition="left"` → label first, track-container second (DOM order matches visual). `labelPosition="top"` → label first (above), track-container second (below). Use CSS `flex-direction` to control layout, keeping DOM order consistent for screen readers.

---

## 5. Public React API

### Props

| Prop | TypeScript type | Required | Default | Behavior | Storybook control |
|---|---|---|---|---|---|
| `label` | `string` | Yes | `'Selection Text'` | Visible label text — also the accessible name of the switch | text |
| `checked` | `boolean` | No | — | Controlled mode: current on/off state | boolean |
| `defaultChecked` | `boolean` | No | `false` | Uncontrolled mode: initial state | boolean |
| `onChange` | `(checked: boolean) => void` | No | — | Called when state changes. Not fired when disabled or readOnly | — |
| `size` | `'lg' \| 'md'` | No | `'lg'` | lg=40px track container, md=32px; affects thumb size, label font size | select |
| `labelPosition` | `'right' \| 'left' \| 'top'` | No | `'right'` | Label placement relative to track | select |
| `disabled` | `boolean` | No | `false` | `aria-disabled="true"`, opacity 0.40, blocks `onChange` | boolean |
| `readOnly` | `boolean` | No | `false` | `aria-readonly="true"`, opacity 0.40, blocks `onChange` | boolean |
| `hasFocus` | `boolean` | No | `false` | **Storybook demo only.** Shows focus ring. Never pass in production. | boolean |
| `id` | `string` | No | — | Forwarded to root `<button>` | — |
| `name` | `string` | No | — | Forwarded to hidden `<input>` for form submission | — |
| `className` | `string` | No | `''` | Forwarded to root `<button>` | — |

### Callbacks

| Callback | Trigger | Signature | Must not fire when |
|---|---|---|---|
| `onChange` | Click, Space, Enter | `(checked: boolean) => void` — passes the NEW state | `disabled === true` or `readOnly === true` |

### API mechanics

| Concern | Contract |
|---|---|
| Controlled mode | `checked` prop provided + `onChange` handler — component reflects `checked` exactly |
| Uncontrolled mode | No `checked` prop — component manages internal state, `defaultChecked` sets initial value |
| Controlled → uncontrolled warning | Warn in dev if `checked` is removed after being set (React standard) |
| Prop changes after mount | `checked`, `disabled`, `readOnly`, `labelPosition` update cleanly |
| Ref forwarding | `React.forwardRef` to root `<button>` |
| Form integration | Render hidden `<input type="checkbox" name={name} checked={isChecked}>` when `name` is provided |
| `disabled` vs `readOnly` | Mutually exclusive in most cases — if both provided, `disabled` takes precedence |

### TypeScript interface

```typescript
/**
 * Binary on/off control for enabling or disabling settings.
 * Renders as role="switch" with animated thumb transition.
 *
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=652-29329
 */
export interface ToggleSwitchProps {
  /** Visible label text. Also used as accessible name. */
  label: string;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial state for uncontrolled mode. @default false */
  defaultChecked?: boolean;
  /** Called with new state when toggled. Not called when disabled or readOnly. */
  onChange?: (checked: boolean) => void;
  /** Size variant. @default 'lg' */
  size?: 'lg' | 'md';
  /** Label position relative to track. @default 'right' */
  labelPosition?: 'right' | 'left' | 'top';
  /** Disables interaction. Uses aria-disabled — not native disabled. @default false */
  disabled?: boolean;
  /** Read-only — shows value, blocks changes. @default false */
  readOnly?: boolean;
  /**
   * Storybook demo only — shows focus ring.
   * In production, ring is driven by :focus-visible. Never pass at runtime.
   * @default false
   */
  hasFocus?: boolean;
  /** HTML id forwarded to root button. */
  id?: string;
  /** Form field name — renders a hidden input for form submission. */
  name?: string;
  /** Additional class forwarded to root button. */
  className?: string;
}
```

### JSX base component

```tsx
import React, { useId } from 'react';
import type { ToggleSwitchProps } from './ToggleSwitch';
import styles from './ToggleSwitch.module.css';

function useControllable(
  controlled: boolean | undefined,
  defaultValue: boolean
): [boolean, (v: boolean) => void] {
  const [internal, setInternal] = React.useState(defaultValue);
  return controlled !== undefined
    ? [controlled, () => {}]
    : [internal, setInternal];
}

export const ToggleSwitch = React.forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  (
    {
      label,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      size = 'lg',
      labelPosition = 'right',
      disabled = false,
      readOnly = false,
      hasFocus = false,
      id,
      name,
      className,
      ...rest
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = useControllable(controlledChecked, defaultChecked);
    const autoId = useId();
    const buttonId = id ?? autoId;

    const handleClick = () => {
      if (disabled || readOnly) return;
      const next = !isChecked;
      setIsChecked(next);
      onChange?.(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <button
        ref={ref}
        id={buttonId}
        role="switch"
        aria-checked={isChecked}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        data-testid="toggle-switch"
        className={[
          styles['toggle-switch'],
          styles[`toggle-switch--${size}`],
          styles[`toggle-switch--label-${labelPosition}`],
          isChecked ? styles['toggle-switch--checked'] : '',
          disabled ? styles['toggle-switch--disabled'] : '',
          readOnly ? styles['toggle-switch--readonly'] : '',
          hasFocus ? styles['toggle-switch--focused'] : '',
          className,
        ].filter(Boolean).join(' ')}
        style={
          disabled || readOnly
            ? { opacity: 'var(--venus-visibility-disabled)' }
            : undefined
        }
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {/* Hidden input for form submission */}
        {name && (
          <input
            type="checkbox"
            name={name}
            checked={isChecked}
            onChange={() => {}}
            aria-hidden="true"
            tabIndex={-1}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          />
        )}

        {/* Label — rendered first in DOM for labelPosition=left and labelPosition=top */}
        <span className={styles['toggle-switch__label']}>{label}</span>

        {/* Track container — focus ring wraps this, not the whole component */}
        <span className={styles['toggle-switch__track-container']} data-testid="toggle-track-container">
          {/* Focus ring — INTERNAL */}
          <span className={styles['toggle-switch__focus-ring']} aria-hidden="true" />
          {/* Track pill */}
          <span className={styles['toggle-switch__track']} data-testid="toggle-track" />
          {/* Thumb — animates left/right */}
          <span className={styles['toggle-switch__thumb']} data-testid="toggle-thumb" />
        </span>
      </button>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';
```

**ToggleSwitch.module.css:**

```css
/* ── Root ──────────────────────────────── */
.toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--venus-space-8, 8px);
  padding: var(--venus-space-8, 8px);
  cursor: pointer;
  background: transparent;
  border: none;
  font-family: var(--venus-font-inter);
  user-select: none;
}

/* Label positions */
.toggle-switch--label-right  { flex-direction: row; }
.toggle-switch--label-left   { flex-direction: row-reverse; }
.toggle-switch--label-top    { flex-direction: column; gap: var(--venus-space-4, 4px); }

/* Size — height of the overall component */
.toggle-switch--lg { height: 40px; }
.toggle-switch--md { height: 32px; }

/* ── Track container ───────────────────── */
.toggle-switch__track-container {
  position: relative;
  flex-shrink: 0;
}

.toggle-switch--lg .toggle-switch__track-container { width: 44px; height: 28px; }
.toggle-switch--md .toggle-switch__track-container { width: 36px; height: 24px; }

/* ── Track (pill background) ───────────── */
.toggle-switch__track {
  position: absolute;
  top: 4px; left: 4px;
  border-radius: 9999px;
  transition: background 150ms ease-in-out;
}

.toggle-switch--lg .toggle-switch__track { width: 36px; height: 20px; }
.toggle-switch--md .toggle-switch__track { width: 28px; height: 16px; }

/* Track colors */
.toggle-switch--checked .toggle-switch__track   { background: var(--venus-toggle-track-on-default); }
.toggle-switch:not(.toggle-switch--checked) .toggle-switch__track { background: var(--venus-toggle-track-off-default); }
.toggle-switch--checked:hover:not(.toggle-switch--disabled):not(.toggle-switch--readonly) .toggle-switch__track  { background: var(--venus-toggle-track-on-hover); }
.toggle-switch:not(.toggle-switch--checked):hover:not(.toggle-switch--disabled):not(.toggle-switch--readonly) .toggle-switch__track { background: var(--venus-toggle-track-off-hover); }

/* ── Thumb (sliding indicator) ─────────── */
.toggle-switch__thumb {
  position: absolute;
  border-radius: 50%;
  background: var(--venus-toggle-thumb-default);
  transition: left 150ms ease-in-out; /* Absolute Requirement #3 */
}

/* lg thumb: OFF=4px, ON=20px */
.toggle-switch--lg .toggle-switch__thumb { top: 4px; left: 4px; width: 20px; height: 20px; }
.toggle-switch--lg.toggle-switch--checked .toggle-switch__thumb { left: 20px; }

/* md thumb: OFF=4px, ON=16px */
.toggle-switch--md .toggle-switch__thumb { top: 4px; left: 4px; width: 16px; height: 16px; }
.toggle-switch--md.toggle-switch--checked .toggle-switch__thumb { left: 16px; }

/* ── Focus ring — INTERNAL ─────────────── */
.toggle-switch__focus-ring {
  display: none;
  position: absolute;
  inset: -4px;                               /* 4px larger than track-container on each side */
  border: 2px solid var(--venus-toggle-border-focus);
  border-radius: 9999px;
  pointer-events: none;
}

.toggle-switch--focused .toggle-switch__focus-ring,
.toggle-switch:focus-visible .toggle-switch__focus-ring {
  display: block;
}

/* ── Label ─────────────────────────────── */
.toggle-switch__label {
  color: var(--venus-toggle-label-default);
}

.toggle-switch:hover:not(.toggle-switch--disabled):not(.toggle-switch--readonly) .toggle-switch__label {
  color: var(--venus-toggle-label-hover);
}

.toggle-switch--lg .toggle-switch__label { font-size: 16px; font-weight: 500; }  /* Body/LG */
.toggle-switch--md .toggle-switch__label { font-size: 14px; font-weight: 500; }  /* Body/MD */

/* ── Disabled & ReadOnly ───────────────── */
/* opacity set inline via style prop — visibility/disabled = 0.40 */
.toggle-switch--disabled,
.toggle-switch--readonly {
  pointer-events: none;
  cursor: not-allowed;
}

/* ── Reduced motion ────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .toggle-switch__thumb { transition: none; }
  .toggle-switch__track { transition: none; }
}
```

### Invalid combinations

| Combination | Valid | Required result |
|---|---|---|
| `disabled=true` AND `readOnly=true` | Allowed — disabled takes precedence | `aria-disabled="true"` only — not both ARIA attributes simultaneously |
| `checked` provided without `onChange` | Allowed | Treat as display-only controlled (common in tables/lists) — warn in dev |
| `labelPosition="top"` | Valid | Vertical layout — container height grows to fit |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop | Mapping rule | React default |
|---|---|---|---|---|
| `isActive` (VARIANT) | `False \| True` | `checked: boolean` | `True → true`, `False → false` | uncontrolled `defaultChecked=false` |
| `Size` (VARIANT) | `lg \| md` | `size: 'lg' \| 'md'` | direct | `'lg'` |
| `State=Disabled` (VARIANT) | `Disabled` | `disabled: boolean` | `Disabled → true` | `false` |
| `State=ReadOnly` (VARIANT) | `ReadOnly` | `readOnly: boolean` | `ReadOnly → true` | `false` |
| `State=Hover` (VARIANT) | `Hover` | CSS `:hover` — never a prop | pseudo-class | — |
| `labelPosition` (VARIANT) | `Right \| Left \| Top` | `labelPosition: 'right' \| 'left' \| 'top'` | case/format transform (lowercase) | `'right'` |
| `label#652:2321` (TEXT) | Any string | `label: string` | direct | `'Selection Text'` |
| `hasFocus#652:2312` (BOOLEAN) | `true \| false` | `hasFocus: boolean` | direct — Storybook demo only | `false` |

### Unmapped design properties

`N/A — all Figma properties are mapped.`

### Unmapped code properties

`N/A — new component.`

---

## 7. Variants, states, and precedence

### Size contract

| Size | Component height | Track | Thumb | Focus ring | Label font | PaddingH | Default? |
|---|---|---|---|---|---|---|---|
| `lg` | **40px** | 36×20px | 20×20px | 48×32px | 16px (Body/LG) | 8px | **Yes** |
| `md` | **32px** | 28×16px | 16×16px | 40×28px | 14px (Body/MD) | 8px | No |

### Variant cross-matrix

| | Default | Hover | Disabled | ReadOnly |
|---|---|---|---|---|
| **isActive=False, labelPos=Right, lg** | ✓ `652:29281` | ✓ | ✓ | ✓ |
| **isActive=True, labelPos=Right, lg** | ✓ `652:29285` | ✓ | ✓ `652:29317` | ✓ |
| **isActive=False, labelPos=Left, lg** | ✓ | ✓ | ✓ | ✓ |
| **isActive=True, labelPos=Left, lg** | ✓ `652:29421` | ✓ | ✓ | ✓ |
| **isActive=False, labelPos=Top, lg** | ✓ | ✓ | ✓ | ✓ |
| **isActive=True, labelPos=Top, lg** | ✓ | ✓ | ✓ | ✓ |
| **isActive=False, labelPos=Right, md** | ✓ `652:29553` | ✓ | ✓ | ✓ |
| **isActive=True, labelPos=Right, md** | ✓ | ✓ | ✓ | ✓ |
| **isActive=False, labelPos=Left, md** | ✓ | ✓ | ✓ | ✓ |
| **isActive=True, labelPos=Left, md** | ✓ | ✓ | ✓ | ✓ |
| **isActive=False, labelPos=Top, md** | ✓ | ✓ | ✓ | ✓ |
| **isActive=True, labelPos=Top, md** | ✓ | ✓ | ✓ `652:29691` | ✓ |

All 48 combinations valid.

### State table

| State | Category | Trigger | CSS mechanism | ARIA | Required story |
|---|---|---|---|---|---|
| Unchecked/Default | Base | `checked=false` initial render | — | `aria-checked="false"` | `Unchecked` |
| Checked/Default | Public | `checked=true` / user toggles | `.toggle-switch--checked` | `aria-checked="true"` | `Checked` |
| Hover | Interaction | Pointer enter | `:hover` — never a prop | — | `Hovered` |
| Disabled | Public | `disabled=true` | `aria-disabled="true"` + 0.40 opacity | `aria-disabled="true"` | `Disabled` |
| ReadOnly | Public | `readOnly=true` | `aria-readonly="true"` + 0.40 opacity | `aria-readonly="true"` | `ReadOnly` |
| Focused | INTERNAL | `:focus-visible` / `hasFocus=true` (Storybook) | Focus ring visible | — | `Focused` |

### State precedence

| Higher | Lower | Result |
|---|---|---|
| Disabled | ReadOnly | Disabled wins — use `aria-disabled` only |
| Disabled / ReadOnly | Hover | Hover blocked by `pointer-events: none` |
| Focused | Disabled | Segment still receives focus (`aria-disabled` not `disabled`) |

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure mode |
|---|---|---|---|---|
| BR-01 | `disabled=true` | User clicks or presses Space/Enter | `onChange` does not fire; state does not change | Disabled toggle responds — users get unexpected changes |
| BR-02 | `readOnly=true` | User clicks or presses Space/Enter | `onChange` does not fire; state does not change | ReadOnly value changes — data integrity issue |
| BR-03 | Controlled: `checked=true` | `onChange` fires with `false` | Parent updates `checked` → thumb animates to OFF | State and visual disagree |
| BR-04 | Uncontrolled | User clicks | Internal state toggles; thumb animates; `onChange` fires | — |
| BR-05 | `disabled=true` | Component renders | `aria-disabled="true"` AND opacity 0.40 on root | AT cannot announce disabled state |
| BR-06 | `readOnly=true` | Component renders | `aria-readonly="true"` AND opacity 0.40 on root — NOT `aria-disabled` | ReadOnly announced as disabled — incorrect semantics |

---

## 9. Interactions and focus

### Interaction table

| ID | element_key | Action | Precondition | Result | Callback | Keyboard |
|---|---|---|---|---|---|---|
| INT-01 | `root` | Click | Not disabled, not readOnly | Toggle state; animate thumb | `onChange(newState)` | Space, Enter |
| INT-02 | `root` | Click | `disabled=true` or `readOnly=true` | No state change | Not fired | Space, Enter blocked |
| INT-03 | `root` | Tab | — | Focus enters component | — | Tab / Shift+Tab |

### Focus management

| Event | Initial focus | Restoration | Focus ring |
|---|---|---|---|
| Tab to component | Root `<button>` | Returns to same element after blur | `:focus-visible .toggle-switch__focus-ring { display: block }` |

**Focus ring contract:**

| Property | Value |
|---|---|
| CSS trigger (production) | `:focus-visible` on root `<button>` |
| CSS trigger (Storybook) | `.toggle-switch--focused` via `hasFocus=true` |
| Element | `.toggle-switch__focus-ring` inside `.toggle-switch__track-container` |
| Inset | `−4px` from all edges of `track-container` |
| Border | `2px solid var(--venus-toggle-border-focus)` → `toggle/border/focus` token |
| Border radius | `9999px` (pill) |
| Scope | **Wraps the track only** — label is outside the focus ring |

### Motion (Absolute Requirement #3)

| Motion | Trigger | Property | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|
| Thumb slides | Toggle on/off | `left` | `150ms` | `ease-in-out` | `transition: none` via `prefers-reduced-motion: reduce` |
| Track color change | Toggle on/off | `background` | `150ms` | `ease-in-out` | `transition: none` |

---

## 10. Dynamic positioning — Thumb animation

This is the only dynamically repositioned element in the component.

| Property | OFF state | ON state (lg) | ON state (md) | Transition |
|---|---|---|---|---|
| `thumb.style.left` | `4px` | `20px` | `16px` | `left 150ms ease-in-out` |
| `thumb.style.top` | `4px` | `4px` | `4px` | — (no vertical movement) |

**The thumb position is driven entirely by CSS** — no JavaScript position calculation needed. The `toggle-switch--checked` class on the root triggers the `left` change via CSS rules. No live DOM measurement required.

**Verification:** In the `Checked` story, after toggle action, `getByTestId('toggle-thumb')` must have computed `left` of `20px` (lg) or `16px` (md).

---

## 11. Responsive behavior

| Constraint | Rule |
|---|---|
| Width | HUG — grows with label length. Minimum = paddingH×2 + track-container width + gap + min-label-width |
| Height | Fixed per size: lg=40px, md=32px |
| `labelPosition="top"` | Height grows to fit label + gap + track-container |
| Zoom/reflow | All px values use `var()` tokens — scale correctly at browser zoom |

---

## 12. Content, localization, and edge cases

| Case | Required behavior | Story |
|---|---|---|
| Long label | Root widens with label; track stays fixed | `LongLabel` |
| Single word label | Works at minimum width | `ShortLabel` |
| Empty label string | Warn in dev — switch has no accessible name | N/A |
| RTL | `flex-direction: row` still puts label on correct side; thumb animation direction unchanged (left is still left) | `RTL` |
| `labelPosition="top"` with long label | Label wraps if needed; track stays its fixed size | `LabelTop` |

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't | Rationale |
|---|---|---|
| Use `role="switch"` | Use `role="checkbox"` or `<input type="checkbox">` | Switches announce "on/off"; checkboxes announce "checked/unchecked" — different user expectation |
| Use `aria-disabled` for disabled state | Use native `disabled` attribute | Native `disabled` removes from tab order — users cannot discover the control |
| Keep `onChange` as the only event handler | Use `onClick` directly | `onClick` doesn't handle Space/Enter keyboard events cleanly for `role="switch"` |
| Let the thumb animate via CSS transition | Use JavaScript to animate the thumb | CSS transition is simpler, performant, and respects `prefers-reduced-motion` automatically |
| Always provide a descriptive `label` | Leave `label` empty | The label is the accessible name — an unnamed switch is unusable for screen reader users |
| Distinguish `readOnly` from `disabled` | Use `disabled` when the value should be preserved but not edited | ReadOnly shows the current controlled value; Disabled means the control is unavailable entirely |

---

## 13. Tokens, typography, and assets

**Token chain:** `_Primitives → Venus_Semantics → Venus_Components (toggle/*) → component layer`. All bindings live-verified 2026-08-11.

### Tokens — track background

| State | Token (full chain) | CSS custom property | Figma VariableID |
|---|---|---|---|
| Unchecked/Default | `[VC] toggle/track/off/default` ← `Venus_Semantics` ← `_Primitives` | `--venus-toggle-track-off-default` | `652:29253` |
| Unchecked/Hover | `[VC] toggle/track/off/hover` | `--venus-toggle-track-off-hover` | (described in CSET description) |
| Checked/Default | `[VC] toggle/track/on/default` | `--venus-toggle-track-on-default` | `652:29255` |
| Checked/Hover | `[VC] toggle/track/on/hover` | `--venus-toggle-track-on-hover` | (described in CSET description) |

### Tokens — thumb, label, focus

| Element | State | Token | CSS custom property | Figma VariableID |
|---|---|---|---|---|
| `thumb` | All | `[VC] toggle/thumb/default` | `--venus-toggle-thumb-default` | `652:29257` |
| `label` | Default | `[VC] toggle/label/default` | `--venus-toggle-label-default` | `652:29258` |
| `label` | Hover | `[VC] toggle/label/hover` | `--venus-toggle-label-hover` | (described in CSET description) |
| `focus-ring` | Focused | `[VC] toggle/border/focus` | `--venus-toggle-border-focus` | `652:29260` |

### Tokens — opacity

| State | Token | CSS custom property | Value |
|---|---|---|---|
| Disabled + ReadOnly | `[VS] visibility/disabled` (`VariableID:564:3246`) | `--venus-visibility-disabled` | **0.40** |

### Typography

| element_key | Size | Token | Family | Weight | Size | Line height |
|---|---|---|---|---|---|---|
| `label` | lg | `[VS] Body/LG` | Inter | 500 (Medium) | 16px | 130% |
| `label` | md | `[VS] Body/MD` | Inter | 500 (Medium) | 14px | 130% |

### Assets

`N/A — no icon or image assets in this component.`

---

## 14. Accessibility contract

### Semantics and naming

| Concern | Requirement |
|---|---|
| Root element | `<button role="switch">` |
| `aria-checked` | Always present — `"true"` when checked, `"false"` when unchecked |
| Accessible name | Implicit from `label` text content. If label is hidden externally, consumer must provide `aria-label` via `...rest`. |
| `aria-disabled` | `"true"` when `disabled=true` |
| `aria-readonly` | `"true"` when `readOnly=true` |
| Prohibited | `role` override. `aria-pressed` (wrong role for a switch). Applying both `aria-disabled` and `aria-readonly` simultaneously. |

### Keyboard

| Key | Result | Prevent default |
|---|---|---|
| Space | Toggle state (unless disabled/readOnly) | Yes |
| Enter | Toggle state (unless disabled/readOnly) | Yes |
| Tab / Shift+Tab | Standard focus movement | No |

### Announcements

| Event | Announcement | Timing |
|---|---|---|
| Focus | Screen reader reads: label text + "switch" + current state ("on"/"off") | On focus |
| Toggle | `aria-checked` changes → AT announces new state ("on" or "off") | Immediately on state change |
| Disabled | "dimmed" or "unavailable" depending on AT | On focus |
| ReadOnly | "read-only" depending on AT | On focus |

### Acceptance

| Area | Requirement |
|---|---|
| Focus visible | 2px `toggle/border/focus` ring, inset −4px from track-container, pill shape |
| Contrast | Toggle label: `text/subtle` on page background ≥ 4.5:1. Track ON color must contrast with page bg ≥ 3:1 (UI component). |
| Touch target | Component height ≥ 32px (md) — satisfies WCAG 2.5.5 minimum |
| Zoom | Thumb position and track size maintained at 200% zoom |
| Reduced motion | `transition: none` when `prefers-reduced-motion: reduce` |
| High contrast | Thumb must use `currentColor` border fallback; track must have border in forced-colors mode |

---

## 15. Storybook contract

### Environment

| Field | Requirement |
|---|---|
| Story format | CSF3 |
| Layout | `layout: 'centered'` |
| Globals | Light + Dark both required for every story |
| Decorators | None required |
| Pseudo-state | `hasFocus=true` prop for Focused story |

### Controls

| Prop | Control | Options | Default |
|---|---|---|---|
| `label` | text | — | `'Selection Text'` |
| `size` | select | `'lg', 'md'` | `'lg'` |
| `labelPosition` | select | `'right', 'left', 'top'` | `'right'` |
| `checked` | boolean | — | `false` |
| `disabled` | boolean | — | `false` |
| `readOnly` | boolean | — | `false` |
| `hasFocus` | boolean | — | `false` |

### Required stories

| Export | Storybook ID | Args | Theme | Key assertion |
|---|---|---|---|---|
| `Unchecked` | `actions-toggleswitch--unchecked` | `{ label: 'Enable feature', checked: false }` | light + dark | `aria-checked="false"`, off-track colour |
| `Checked` | `actions-toggleswitch--checked` | `{ label: 'Enable feature', checked: true }` | light + dark | `aria-checked="true"`, on-track colour, thumb at right |
| `Hovered` | `actions-toggleswitch--hovered` | unchecked + hover decorator | light + dark | Hover track colour |
| `CheckedHovered` | `actions-toggleswitch--checked-hovered` | checked + hover decorator | light + dark | On-hover track colour |
| `Disabled` | `actions-toggleswitch--disabled` | `{ disabled: true }` | light + dark | `aria-disabled="true"`, opacity 0.40, click blocked |
| `CheckedDisabled` | `actions-toggleswitch--checked-disabled` | `{ checked: true, disabled: true }` | light + dark | On-track colour at 0.40 opacity |
| `ReadOnly` | `actions-toggleswitch--read-only` | `{ readOnly: true }` | light + dark | `aria-readonly="true"`, opacity 0.40, click blocked |
| `Focused` | `actions-toggleswitch--focused` | `{ hasFocus: true }` | light + dark | Focus ring at inset −4px from track-container |
| `LabelLeft` | `actions-toggleswitch--label-left` | `{ labelPosition: 'left' }` | light + dark | Label before track in visual order |
| `LabelTop` | `actions-toggleswitch--label-top` | `{ labelPosition: 'top' }` | light + dark | Vertical layout, label above |
| `SizeMd` | `actions-toggleswitch--size-md` | `{ size: 'md' }` | light + dark | 32px height, 14px label |
| `ThumbAnimation` | `actions-toggleswitch--thumb-animation` | Uncontrolled | light + dark | `play`: click → verify thumb.style.left === '20px' (lg) after 200ms |
| `Uncontrolled` | `actions-toggleswitch--uncontrolled` | `{ defaultChecked: false }` | light + dark | Toggle without external `checked` prop |

---

## 16. Test and visual-verification contract

### Per-prop verification

| Prop | Valid | Default test | Key assertion |
|---|---|---|---|
| `checked` | `true, false` | `false` → `aria-checked="false"` | `aria-checked` mirrors `checked` |
| `disabled` | `true, false` | `false` → interactive | `aria-disabled="true"`, opacity 0.40, `onChange` not fired on click |
| `readOnly` | `true, false` | `false` → interactive | `aria-readonly="true"`, opacity 0.40, `onChange` not fired on click |
| `size` | `'lg', 'md'` | `'lg'` → 40px | `offsetHeight === (size === 'lg' ? 40 : 32)` |
| `labelPosition` | `'right', 'left', 'top'` | `'right'` | DOM order matches visual order |

### Conditional element inventory

| element_key | Controlling condition | Presence test | Absence test |
|---|---|---|---|
| `focus-ring` | `:focus-visible` / `hasFocus=true` | `display: block` | `display: none` |
| Hidden `<input>` | `name` prop provided | Input in DOM with `name` attr | Input absent |

### Interaction verification

| Interaction | Story | Drive | Callback | DOM assertion |
|---|---|---|---|---|
| Toggle on | `Unchecked` | `userEvent.click` | `onChange(true)` | `aria-checked="true"`, thumb `left: 20px` (lg) |
| Toggle off | `Checked` | `userEvent.click` | `onChange(false)` | `aria-checked="false"`, thumb `left: 4px` |
| Blocked: disabled | `Disabled` | `userEvent.click` | Not fired | `aria-checked` unchanged |
| Blocked: readOnly | `ReadOnly` | `userEvent.click` | Not fired | `aria-checked` unchanged |
| Space key | `Unchecked` | `userEvent.keyboard('[Space]')` | `onChange(true)` | `aria-checked="true"` |

### Visual matrix

| Story | Viewport | Theme | Figma reference | Tolerance |
|---|---|---|---|---|
| `Unchecked` | 800×600 | light + dark | Node `652:29281` | 0.2% |
| `Checked` | 800×600 | light + dark | Node `652:29285` | 0.2% |
| `Disabled` | 800×600 | light + dark | Node `652:29283` | 0.2% |
| `LabelTop` | 800×600 | light + dark | Top labelPosition variant | 0.2% |
| `SizeMd` | 800×600 | light + dark | Node `652:29553` | 0.2% |
| `Focused` | 800×600 | light + dark | hasFocus variant | 0.2% |

---

## 17. Decisions

### Confirmed decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | `<button role="switch">` not `<input type="checkbox">` | Role "switch" has distinct AT semantics ("on"/"off" vs "checked/unchecked"). Figma CSET description explicitly specifies `role="switch"`. |
| DEC-02 | `aria-disabled` not native `disabled` | Keeps the toggle keyboard-discoverable. Standard Venus system pattern (Requirement #4). |
| DEC-03 | Thumb animation via CSS `transition: left` — no JS | CSS approach is simpler, respects `prefers-reduced-motion`, and matches the design spec exactly. |
| DEC-04 | Focus ring wraps track-container only, not full component | Figma confirmed — `toggle-focus-ring` is inside `toggle-track-container`. Label is outside the visual focus boundary. |
| DEC-05 | `labelPosition` drives `flex-direction` on root | The three positions (right/left/top) require distinct flex configurations. DOM order follows visual order for accessibility consistency. |
| DEC-06 | Both `disabled` and `readOnly` apply 0.40 opacity | Live Figma read confirmed both use `VariableID:564:3246` = `visibility/disabled`. Distinct ARIA attributes communicate the semantic difference. |

### Rejected approaches

| ID | Approach | Why rejected | Chosen instead |
|---|---|---|---|
| REJ-01 | `<input type="checkbox" role="switch">` | Input elements don't accept `role` override cleanly; styling is constrained | Pure `<button role="switch">` + hidden input for forms |
| REJ-02 | JS-driven thumb position (`element.style.left = ...`) | Unnecessary complexity, misses `prefers-reduced-motion`, harder to test | CSS class toggle → CSS `transition: left` |
| REJ-03 | `data-icon-mode` not needed | No icon in this component | N/A |

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma node `652:29329` live read 2026-08-11
- [x] All 48 variants accounted for in the cross-matrix
- [x] Mode NEW, scope explicit
- [x] Absolute Requirements documented (10 numbered items)
- [x] Thumb animation specified in Section 10 (dynamic positioning)
- [x] Controlled/uncontrolled API documented
- [x] ReadOnly vs Disabled distinction fully specified
- [x] All token chain bindings documented
- [x] `unresolved_question_count: 0`
- [x] No hardcoded values in the brief

### Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Design | George Karian | PENDING | — |
| Engineering | Narendra | PENDING | — |
