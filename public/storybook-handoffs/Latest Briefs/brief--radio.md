---
brief_schema: venus-storybook-handover/v2
component_name: "Radio"
component_kebab_case: "radio"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=660-33013"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "660:33013"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Actions/Radio"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        Radio
  REACT_COMPONENT:       Radio
  STORYBOOK_TITLE:       Actions/Radio
  FIGMA_NODE_ID:         660:33013
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           🔘 Actions
  CSS_CLASS_PREFIX:      radio
  FILE_NAME:             Radio.tsx
  STORY_FILE_NAME:       Radio.stories.tsx
  CSS_FILE_NAME:         Radio.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
  STATUS:                Active
  ═══════════════════════════════════════════════════════════════════
-->

# Radio — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | Must render as `<input type="radio">` wrapped in `<label>` — never a `<div role="radio">` | Native `<input type="radio">` provides free form participation, grouping via `name`, keyboard behaviour, and AT semantics. Custom implementations are fragile and rarely correct. |
| 2 | `name` prop must be forwarded to the `<input>` — this is how mutual exclusivity within a group is enforced by the browser | Radio buttons with the same `name` are automatically grouped by the browser — only one can be checked at a time within the group |
| 3 | `disabled` must use native `disabled` attribute on `<input>` — also apply `aria-disabled="true"` on the root for visual consistency | For native `<input type="radio">`, the native `disabled` attribute is correct. Also add 0.40 opacity on root via CSS. |
| 4 | Selection dot (the inner filled circle) must only render when `checked` — it is ABSENT in all unselected variants | Verified from live Figma: `selection-dot` (ELLIPSE) only exists inside `radio-control` in Selected variants. Conditional render, not just opacity. |
| 5 | Component height is content-driven — sm = 37px, md = 40px — driven by label line height, NOT a fixed container height | Figma confirmed: paddingAll=8px + label height (21px sm / 24px md) drives the total. Do not set a fixed height on the root. |
| 6 | `subtext` is embedded inside the Radio atom — rendered below the label when `hasSubtext=true` | Live Figma structure confirmed: `subtext` TEXT node is a direct child of `content` frame inside this component. Implement as designed. (See DEC-01.) |
| 7 | Focus ring is ABSOLUTE inside `box-container`, offset +2px on all sides (sm: 20×20px ring around 16×16px control; md: 24×24px ring around 20×20px control) | Focus ring wraps the radio control only — NOT the full component including label |
| 8 | Disabled state: `opacity: var(--venus-visibility-disabled)` (= **0.40**) applied to root wrapper. Native `disabled` on input also present. | Confirmed `VariableID:564:3246` on root in all Disabled variants |

---

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/date | What it establishes |
|---|---|---|---|
| Figma design context (live read) | Node `660:33013`, 🔘 Actions | 2026-08-11 | All 16 variants, exact dimensions, children hierarchy, all token bindings |
| Figma CSET description | `660:33013` description | 2026-08-11 | ARIA requirements, `hasFocus` usage, disabled semantics, dumb-atom principle |
| `venus-21-rf-master.md` | Disabled opacity, focus ring | Project knowledge | 0.40 opacity, `border/focus` = purple/500 |
| `06-component-and-handoff_skill.md` | Venus pre-flight, state→CSS rules | Project knowledge | Focus ring spec, disabled pattern |

### Source precedence

Live Figma structure (2026-08-11) governs anatomy and token bindings. CSET description governs ARIA and behaviour intent. Code decisions are engineer's discretion.

---

## 1. Outcome and scope

**Definition:** A single radio option — a circular selection control with a label and optional subtext — for use within a radio group where exactly one option can be selected.

**User need:** Content editors in Contentstack need to choose one option from a set of mutually exclusive choices (e.g. publishing frequency, content type, sort order) with clear visual feedback on which is currently selected.

### Use cases

| ID | Use case | Context | Success outcome |
|---|---|---|---|
| UC-01 | Single selection in a form group | Settings form with 3–5 options, label to the right | Selected option shows filled circle; unselected shows empty ring |
| UC-02 | Option with supporting description | Radio with subtext clarifying the option | Subtext renders below label in text/subtle colour |
| UC-03 | Disabled option in a permissions-locked group | User cannot select this option | 0.40 opacity, native `disabled`, no interaction |

### Scope

| In scope | Out of scope |
|---|---|
| sm (37px) and md (40px) sizes | xl, lg sizes |
| Embedded `subtext` boolean | External Hint Text sibling management |
| `hasLabel` boolean | Right-to-left label placement |
| Selection: Unselected / Selected | Indeterminate state |
| State: Default / Hover / Focused / Disabled | ReadOnly state (not in this component) |

### Responsibility boundary

| Radio owns | RadioGroup (parent) owns |
|---|---|
| Visual state per `checked` and `disabled` | Tracking which option is selected across the group |
| Native radio semantics via `<input type="radio">` | Providing `role="radiogroup"` container and accessible group label |
| Focus ring on `:focus-visible` | Roving tabindex / arrow-key navigation |
| `selection-dot` conditional render | Mutual exclusivity enforcement |

---

## 2. Existing baseline and change contract

`N/A — new component. No prior Storybook implementation.`

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Native `<input type="radio">` wrapped in `<label>`. Custom visual control overlaid via CSS. |
| Existing components to reuse | None |
| Hooks/utilities/providers | None — relies entirely on native radio grouping via `name` |
| Existing tokens | Venus_Semantics + Radio-specific tokens. Full chain in Section 13. |
| Genuinely new surface | `Radio.tsx`, `Radio.module.css`, `Radio.stories.tsx` |
| Prohibited reimplementation | Do not use `<div role="radio">` — native input is required for forms |

### Dependency tree

| Direction | Component | Must exist before build | Breaking if API changes |
|---|---|---|---|
| Upstream | None | — | — |
| Downstream | RadioGroup pattern (composes Radio atoms) | N/A | `name`, `checked`, `onChange` prop changes are breaking |

---

## 4. Anatomy

`REQUIRED` = always rendered · `OPTIONAL` = prop-controlled · `INTERNAL` = never a prop

| element_key | Layer name | Visibility | Condition | RTL mirrors | Figma ref | Semantic/testing requirement |
|---|---|---|---|---|---|---|
| `root` | `radio` | REQUIRED | Always | no | Variant frame | `<label>`, `data-testid="radio"` |
| `input` | (hidden) | REQUIRED | Always | no | — (no Figma equivalent) | `<input type="radio">`, visually hidden, real form element |
| `box-container` | `box-container` | REQUIRED | Always | no | FRAME, FIXED — sm: 16×16 / md: 20×20 | `data-testid="radio-box-container"` |
| `focus-ring` | `focus-ring` | INTERNAL | `:focus-visible` / `hasFocus=true` (Storybook) | no | FRAME, ABSOLUTE — sm: 20×20 / md: 24×24 | `aria-hidden="true"`, inset −2px from control |
| `radio-control` | `radio-control` | REQUIRED | Always | no | FRAME, ABSOLUTE, 16×16 sm / 20×20 md | Custom circular radio indicator |
| `selection-dot` | `selection-dot` | OPTIONAL | `checked=true` only | no | ELLIPSE, ABSOLUTE — sm: 6×6 / md: 8×8 | Filled inner circle; absent when unchecked |
| `content` | `content` | REQUIRED | Always | no | FRAME, FILL×HUG | Contains label and subtext |
| `label-row` | `label-row` | OPTIONAL | `hasLabel=true` | no | FRAME, wired to `hasLabel` | Label row wrapper |
| `label` | `label` | OPTIONAL | `hasLabel=true` | no | TEXT, FILL×HUG | Visible label text |
| `subtext` | `subtext` | OPTIONAL | `hasSubtext=true` | no | TEXT, visible=false by default | Supporting description below label |

---

## 5. Public React API

### Props

| Prop | TypeScript type | Required | Default | Behavior | Storybook control |
|---|---|---|---|---|---|
| `label` | `string` | Yes | `'Radio label'` | Visible label text | text |
| `value` | `string` | Yes | — | Value submitted with form; identifies this option in the group | text |
| `name` | `string` | Yes | — | Groups radio buttons for mutual exclusivity | text |
| `checked` | `boolean` | No | — | Controlled selected state | boolean |
| `defaultChecked` | `boolean` | No | `false` | Uncontrolled initial state | boolean |
| `onChange` | `(value: string) => void` | No | — | Called when this radio is selected | — |
| `size` | `'sm' \| 'md'` | No | `'sm'` | sm=16px control / md=20px control; affects overall component size | select |
| `disabled` | `boolean` | No | `false` | Native `disabled` on input; 0.40 opacity on root | boolean |
| `hasLabel` | `boolean` | No | `true` | Shows/hides label text | boolean |
| `hasSubtext` | `boolean` | No | `false` | Shows subtext below label | boolean |
| `subtext` | `string` | No | — | Supporting text. Required when `hasSubtext=true`. | text |
| `hasFocus` | `boolean` | No | `false` | **Storybook demo only.** Shows focus ring via CSS class. Never pass in production. | boolean |
| `id` | `string` | No | auto-generated | Forwarded to `<input>` |  — |
| `className` | `string` | No | `''` | Forwarded to root `<label>` | — |

### Callbacks

| Callback | Trigger | Signature | Must not fire when |
|---|---|---|---|
| `onChange` | Radio selected | `(value: string) => void` | `disabled === true` |

### API mechanics

| Concern | Contract |
|---|---|
| Controlled mode | `checked` prop + `onChange`. Component reflects `checked` exactly. |
| Uncontrolled mode | No `checked` prop — native browser handles selection within the group via `name` |
| Mutual exclusivity | Enforced by browser via matching `name` attribute — not by component logic |
| Ref forwarding | `React.forwardRef` to root `<label>` element |
| Native DOM props | `...rest` spread to hidden `<input type="radio">` (not to `<label>`) |
| Form integration | Native — `<input type="radio" name={name} value={value}>` participates in form submission automatically |

### TypeScript interface

```typescript
/**
 * A single radio option for use within a RadioGroup.
 * Uses native <input type="radio"> for correct form semantics.
 *
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=660-33013
 */
export interface RadioProps {
  /** Visible label text and accessible name. */
  label: string;
  /** Value submitted with the form. Identifies this option within the group. */
  value: string;
  /** Groups radio buttons for mutual exclusivity. Must be the same across all options in a group. */
  name: string;
  /** Controlled selected state. */
  checked?: boolean;
  /** Initial state for uncontrolled mode. @default false */
  defaultChecked?: boolean;
  /** Called with the value when this option is selected. */
  onChange?: (value: string) => void;
  /** Size variant. @default 'sm' */
  size?: 'sm' | 'md';
  /** Disables the radio. Uses native disabled + 0.40 opacity. @default false */
  disabled?: boolean;
  /** Show/hide label. @default true */
  hasLabel?: boolean;
  /** Show supporting text below label. @default false */
  hasSubtext?: boolean;
  /** Supporting description. Required when hasSubtext is true. */
  subtext?: string;
  /**
   * Storybook demo only — shows focus ring. Never pass in production.
   * @default false
   */
  hasFocus?: boolean;
  /** HTML id forwarded to input. */
  id?: string;
  /** Additional class forwarded to root label. */
  className?: string;
}
```

### JSX base component

```tsx
import React, { useId } from 'react';
import type { RadioProps } from './Radio';
import styles from './Radio.module.css';

export const Radio = React.forwardRef<HTMLLabelElement, RadioProps>(
  (
    {
      label,
      value,
      name,
      checked,
      defaultChecked = false,
      onChange,
      size = 'sm',
      disabled = false,
      hasLabel = true,
      hasSubtext = false,
      subtext,
      hasFocus = false,
      id,
      className,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label
        ref={ref}
        htmlFor={inputId}
        data-testid="radio"
        className={[
          styles['radio'],
          styles[`radio--${size}`],
          disabled ? styles['radio--disabled'] : '',
          hasFocus ? styles['radio--focused'] : '',
          className,
        ].filter(Boolean).join(' ')}
        style={disabled ? { opacity: 'var(--venus-visibility-disabled)' } : undefined}
      >
        {/* Hidden native input — real form element */}
        <input
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={() => onChange?.(value)}
          className={styles['radio__input']}
          {...rest}
        />

        {/* Custom visual control */}
        <span className={styles['radio__box-container']} data-testid="radio-box-container">
          {/* Focus ring — INTERNAL */}
          <span className={styles['radio__focus-ring']} aria-hidden="true" />
          {/* Radio circle */}
          <span className={styles['radio__control']} data-testid="radio-control">
            {/* Selection dot — only rendered when checked */}
            {checked && (
              <span className={styles['radio__selection-dot']} aria-hidden="true" />
            )}
          </span>
        </span>

        {/* Label + subtext */}
        <span className={styles['radio__content']}>
          {hasLabel && (
            <span className={styles['radio__label-row']}>
              <span className={styles['radio__label']}>{label}</span>
            </span>
          )}
          {hasSubtext && subtext && (
            <span className={styles['radio__subtext']}>{subtext}</span>
          )}
        </span>
      </label>
    );
  }
);

Radio.displayName = 'Radio';
```

**Radio.module.css:**

```css
/* ── Root (label element) ─────────────── */
.radio {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--venus-space-8, 8px);
  padding: var(--venus-space-8, 8px);
  cursor: pointer;
  position: relative;
}

.radio--sm { /* height is content-driven: ~37px */ }
.radio--md { /* height is content-driven: ~40px */ }

.radio--disabled {
  cursor: not-allowed;
  pointer-events: none;
  /* opacity applied inline via style prop — visibility/disabled = 0.40 */
}

/* ── Hidden native input ───────────────── */
.radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ── Box container ─────────────────────── */
.radio__box-container {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio--sm .radio__box-container { width: 16px; height: 16px; }
.radio--md .radio__box-container { width: 20px; height: 20px; }

/* ── Focus ring — INTERNAL ─────────────── */
.radio__focus-ring {
  display: none;
  position: absolute;
  inset: -2px;
  border: 2px solid var(--venus-border-focus);
  border-radius: 50%;
  pointer-events: none;
}

.radio--focused .radio__focus-ring,
.radio__input:focus-visible ~ .radio__box-container .radio__focus-ring,
.radio:has(.radio__input:focus-visible) .radio__focus-ring {
  display: block;
}

/* ── Radio control (circle) ────────────── */
.radio__control {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--venus-surface-raised);
  border: 1.5px solid var(--venus-border-default);
  transition: background 120ms ease, border-color 120ms ease;
}

/* Hover — unselected */
.radio:hover:not(.radio--disabled) .radio__control {
  border-color: var(--venus-border-brand);
}

/* Selected */
.radio:has(.radio__input:checked) .radio__control {
  background: var(--venus-action-primary);
  border-color: var(--venus-action-primary);
}

/* Selected hover */
.radio:has(.radio__input:checked):hover:not(.radio--disabled) .radio__control {
  background: var(--venus-action-primary-hover);
  border-color: transparent;
}

/* Focused — selected */
.radio:has(.radio__input:checked):has(.radio__input:focus-visible) .radio__control,
.radio--focused:has(.radio__input:checked) .radio__control {
  border-color: var(--venus-border-brand);
}

/* ── Selection dot ─────────────────────── */
.radio__selection-dot {
  border-radius: 50%;
  background: var(--venus-text-on-brand); /* white */
  flex-shrink: 0;
}

.radio--sm .radio__selection-dot { width: 6px; height: 6px; }
.radio--md .radio__selection-dot { width: 8px; height: 8px; }

/* ── Content (label + subtext) ─────────── */
.radio__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ── Label ─────────────────────────────── */
.radio__label {
  display: block;
  color: var(--venus-text-default);
  font-family: var(--venus-font-inter);
  font-weight: 500;
}

.radio--sm .radio__label { font-size: 14px; line-height: 130%; } /* Body/MD */
.radio--md .radio__label { font-size: 16px; line-height: 130%; } /* Body/LG */

.radio:hover:not(.radio--disabled) .radio__label,
.radio:has(.radio__input:checked) .radio__label {
  color: var(--venus-text-brand);
}

/* ── Subtext ─────────────────────────────*/
.radio__subtext {
  display: block;
  color: var(--venus-text-subtle);
  font-family: var(--venus-font-inter);
  font-weight: 400;
  font-size: 13px; /* Body/SM */
  line-height: 130%;
}

/* ── Reduced motion ─────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .radio__control { transition: none; }
}
```

### Invalid combinations

| Combination | Valid | Required result |
|---|---|---|
| `hasSubtext=true` AND `subtext` is undefined | No | Skip subtext render; warn in dev |
| `hasLabel=false` AND `hasSubtext=false` | Allowed | Visually icon-only; ensure parent provides accessible label for the group |
| `checked` without `onChange` | Allowed — display only | No warning needed — common in read-only lists |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop | Mapping rule | React default |
|---|---|---|---|---|
| `Selection` (VARIANT) | `Unselected \| Selected` | `checked: boolean` | `Selected → true`, `Unselected → false` | uncontrolled `defaultChecked=false` |
| `Size` (VARIANT) | `sm \| md` | `size: 'sm' \| 'md'` | direct | `'sm'` |
| `State=Disabled` (VARIANT) | `Disabled` | `disabled: boolean` | direct | `false` |
| `State=Hover` (VARIANT) | `Hover` | CSS `:hover` / `:has(input:hover)` — never a prop | pseudo-class | — |
| `State=Focused` (VARIANT) | `Focused` | CSS `:has(input:focus-visible)` — never a prop; `hasFocus=true` for Storybook only | pseudo-class | — |
| `label#661:2590` (TEXT) | Any string | `label: string` | direct | `'Radio label'` |
| `hasLabel#661:2564` (BOOLEAN) | `true \| false` | `hasLabel: boolean` | direct | `true` |
| `hasSubtext#661:2577` (BOOLEAN) | `true \| false` | `hasSubtext: boolean` | direct | `false` |
| `isDisabled#661:2603` (BOOLEAN) | `true \| false` | `disabled: boolean` | direct | `false` |
| `hasFocus#663:2632` (BOOLEAN) | `true \| false` | `hasFocus: boolean` | direct — Storybook demo only | `false` |

### Unmapped design properties

`N/A — all properties mapped.`

### Unmapped code properties

`N/A — new component.`

---

## 7. Variants, states, and precedence

### Size contract

| Size | Control (circle) | Component height | Label font | Default? |
|---|---|---|---|---|
| `sm` | 16 × 16px | ~37px (content-driven) | 14px (Body/MD) | **Yes** |
| `md` | 20 × 20px | ~40px (content-driven) | 16px (Body/LG) | No |

Selection dot: sm = 6×6px · md = 8×8px · centered inside control · absent when unchecked.

### Variant cross-matrix

| | Default | Hover | Focused | Disabled |
|---|---|---|---|---|
| **Unselected, sm** | ✓ `660:32911` | ✓ | ✓ | ✓ `661:33014` |
| **Selected, sm** | ✓ | ✓ `660:32944` | ✓ | ✓ |
| **Unselected, md** | ✓ | ✓ | ✓ `660:32978` | ✓ |
| **Selected, md** | ✓ | ✓ | ✓ | ✓ `661:33039` |

### State table

| State | Trigger | CSS mechanism | `radio-control` appearance | `selection-dot` | Required story |
|---|---|---|---|---|---|
| Unselected/Default | `checked=false`, initial | — | `surface/raised` fill, `border/default` stroke | Absent | `Unselected` |
| Unselected/Hover | Pointer enter | `:hover` / `:has(input:hover)` | `border/brand` stroke | Absent | `Hovered` |
| Unselected/Focused | `:focus-visible` on input | Focus ring visible, `border/brand` stroke | `border/brand` stroke | Absent | `Focused` |
| Selected/Default | `checked=true` | `:has(input:checked)` | `action/primary` fill, no border | Present | `Selected` |
| Selected/Hover | `checked=true` + hover | `:has(input:checked):hover` | `action/primary/hover` fill | Present | — |
| Selected/Focused | `checked=true` + focus | `:has(input:checked:focus-visible)` | `action/primary` fill, `border/brand` stroke | Present | — |
| Disabled | `disabled=true` | Native `disabled` + opacity 0.40 | `border/disabled` stroke | Present/absent per checked state | `Disabled` |

### State precedence

| Higher | Lower | Result |
|---|---|---|
| Disabled | Hover | Hover blocked by native `disabled` |
| Disabled | Focused | Focus suppressed by native `disabled` (unlike Toggle Switch — native disabled removes from tab order) |

> **Disabled removes from tab order** — unlike Toggle Switch where `aria-disabled` was used. For native `<input type="radio" disabled>`, this is correct behaviour. Disabled options in a radio group should not be navigable; the remaining enabled options are what users interact with.

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure mode |
|---|---|---|---|---|
| BR-01 | Multiple Radios with the same `name` | User selects one | Browser deselects all others in the group | Options appear independent — multiple selectable |
| BR-02 | `disabled=true` | User clicks or tabs to | Cannot be selected; native `disabled` prevents interaction | Disabled option selectable |
| BR-03 | `checked=true` | Component renders | Selection dot rendered; `radio-control` shows filled style | No visual indication of selected state |
| BR-04 | `hasSubtext=true` AND `subtext` is empty | Component renders | Warn in dev; empty subtext element rendered | Layout shift from empty element |

---

## 9. Interactions and focus

| ID | element_key | Action | Precondition | Result | Callback |
|---|---|---|---|---|---|
| INT-01 | `root` (label) | Click | Not disabled | Input checked; group deselects others | `onChange(value)` |
| INT-02 | `input` | Space | Input focused, not disabled | Input checked | `onChange(value)` |
| INT-03 | `input` | Arrow keys | Inside RadioGroup with roving tabindex | Focus moves to next/prev radio | Managed by RadioGroup parent |

**Focus ring contract:**

| Property | Value |
|---|---|
| CSS trigger (production) | `:has(input:focus-visible)` on root, or direct `.radio__input:focus-visible ~ .radio__box-container .radio__focus-ring` |
| CSS trigger (Storybook) | `.radio--focused` class via `hasFocus=true` |
| Ring element | `.radio__focus-ring`, `aria-hidden="true"`, `position: absolute`, `inset: -2px` |
| Border | `2px solid var(--venus-border-focus)` → `purple/500` Light / `purple/400` Dark |
| Shape | `border-radius: 50%` — matches circular control |
| Scope | Wraps `box-container` (control) only — NOT the label |

---

## 10. Dynamic positioning

`N/A — no dynamically repositioned elements.`

---

## 11. Responsive behavior

| Constraint | Rule |
|---|---|
| Width | FILL (stretches to parent container) — `content` uses FILL. Min = paddingH×2 + control + gap + label |
| Height | Content-driven — NOT fixed. Grows with subtext when `hasSubtext=true`. |
| Control size | Always fixed: sm=16×16px, md=20×20px — never resizes |

---

## 12. Content, localization, and edge cases

| Case | Required behavior | Story |
|---|---|---|
| Long label | Label wraps; radio stays top-aligned | `LongLabel` |
| With subtext | Subtext appears below label in text/subtle | `WithSubtext` |
| No label (`hasLabel=false`) | Radio renders with only control visible | `NoLabel` |
| RTL | `align-items: flex-start` maintains correct alignment; radio circle stays on leading side | N/A |

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't | Rationale |
|---|---|---|
| Use `<input type="radio">` with matching `name` | Use `<div role="radio">` or `<button>` | Native input provides free form participation and mutual exclusivity |
| Use native `disabled` on input | Use `aria-disabled` for radio inputs | Native `disabled` on `<input type="radio">` is the correct ARIA pattern — unlike custom components |
| Provide a matching `name` across all options in the group | Use different `name` per option | Different names create independent single-option groups, breaking mutual exclusivity |
| Conditionally render `selection-dot` only when `checked` | Toggle visibility via opacity | Figma design shows dot is structurally absent in unselected state — conditional render not opacity |
| Keep label as the accessible name | Add a separate `aria-label` | The `<label>` wrapping the input provides the accessible name automatically |
| Apply 0.40 opacity to the root `<label>` | Apply opacity to individual children | Uniform fading from root is simpler and matches Figma — per `visibility/disabled` token |

---

## 13. Tokens, typography, and assets

**Token chain:** `_Primitives → Venus_Semantics → component layer`.

### Tokens

| element_key | Property | Token | CSS custom property | Figma VariableID |
|---|---|---|---|---|
| `radio-control` | `background` (unselected) | `[VS] surface/raised` | `--venus-surface-raised` | `563:3180` |
| `radio-control` | `border-color` (unselected default) | `[VS] border/default` | `--venus-border-default` | `564:3209` |
| `radio-control` | `border-color` (unselected focused) | `[VS] border/brand` | `--venus-border-brand` | `564:3211` |
| `radio-control` | `border-color` (disabled) | `[VS] border/disabled` | `--venus-border-disabled` | `564:3212` |
| `radio-control` | `background` (selected default) | `[VS] action/primary` | `--venus-action-primary` | `564:3217` |
| `radio-control` | `background` (selected hover) | `[VS] action/primary/hover` | `--venus-action-primary-hover` | `564:3218` |
| `selection-dot` | `background` | `[VS] text/on-brand` (white) | `--venus-text-on-brand` | `564:3198` |
| `label` | `color` (default) | `[VS] text/default` | `--venus-text-default` | `564:3192` |
| `label` | `color` (hover/selected) | `[VS] text/brand` | `--venus-text-brand` | `564:3199` |
| `subtext` | `color` | `[VS] text/subtle` | `--venus-text-subtle` | `564:3193` |
| `focus-ring` | `border-color` | `[VS] border/focus` | `--venus-border-focus` | `564:3227` |
| `root` (disabled) | `opacity` | `[VS] visibility/disabled` | `--venus-visibility-disabled` | `564:3246` |

### Typography

| element_key | Size | Token | Family | Weight | Size | Line height |
|---|---|---|---|---|---|---|
| `label` | sm | Body/MD (`564:3295`) | Inter | 500 | 14px | 130% |
| `label` | md | Body/LG (`564:3292`) | Inter | 500 | 16px | 130% |
| `subtext` | sm + md | Body/SM (~`564:3298`) | Inter | 400 | 13px | 130% |

---

## 14. Accessibility contract

### Semantics

| Concern | Requirement |
|---|---|
| Root element | `<label htmlFor={inputId}>` |
| Form element | `<input type="radio" name={name} value={value}>` — hidden visually |
| `checked` state | Native `checked` attribute on `<input>` — AT reads this automatically |
| `disabled` | Native `disabled` on `<input>` + 0.40 opacity on root. Native `disabled` removes from tab order — correct for radio (unlike Toggle Switch). |
| Accessible name | Implicit from `<label>` wrapping the `<input>`. No separate `aria-label` needed. |
| Group context | Requires `role="radiogroup"` parent with `aria-labelledby` or `aria-label` for the group name |

### Keyboard

| Key | Result | Notes |
|---|---|---|
| Space | Select this radio | Only if not disabled |
| Arrow Right / Down | Move focus to next radio in group | Managed by RadioGroup parent via roving tabindex |
| Arrow Left / Up | Move focus to previous radio | Managed by RadioGroup parent |
| Tab | Move focus out of group | Tab leaves the group entirely |

### Announcements

| Event | Announcement | Timing |
|---|---|---|
| Focus on unselected | "Label text, radio button, not checked, N of M" | On focus |
| Focus on selected | "Label text, radio button, checked, N of M" | On focus |
| Selection change | "Checked" | On change |

### Acceptance

| Area | Requirement |
|---|---|
| Focus visible | 2px `border/focus` ring around control, inset −2px, circular |
| Contrast | `text/default` on page background ≥ 4.5:1. `action/primary` fill of selected control ≥ 3:1 against background (UI component). |
| Touch target | Padding of 8px around control provides touch area ≥ 32×32px (sm variant with padding) |
| Zoom | Control size and label maintained at 200% zoom |
| Reduced motion | All CSS transitions wrapped in `@media (prefers-reduced-motion: no-preference)` |

---

## 15. Storybook contract

### Environment

| Field | Requirement |
|---|---|
| Story format | CSF3 |
| Layout | `layout: 'centered'` |
| Globals | Light + Dark both required for every story |
| Decorators | Wrap in a `role="radiogroup"` container for stories showing multiple radios |

### Controls

| Prop | Control | Options | Default |
|---|---|---|---|
| `label` | text | — | `'Radio label'` |
| `size` | select | `'sm', 'md'` | `'sm'` |
| `checked` | boolean | — | `false` |
| `disabled` | boolean | — | `false` |
| `hasLabel` | boolean | — | `true` |
| `hasSubtext` | boolean | — | `false` |
| `subtext` | text | — | — |
| `hasFocus` | boolean | — | `false` |

### Required stories

| Export | Storybook ID | Args | Theme | Key assertion |
|---|---|---|---|---|
| `Unselected` | `actions-radio--unselected` | `{ label: 'Option', checked: false }` | light + dark | Empty circle, `text/default` label |
| `Selected` | `actions-radio--selected` | `{ label: 'Option', checked: true }` | light + dark | Filled circle, selection dot, `text/brand` label |
| `Hovered` | `actions-radio--hovered` | Unselected + hover decorator | light + dark | `border/brand` on control |
| `Focused` | `actions-radio--focused` | `{ hasFocus: true }` | light + dark | Focus ring visible, circular, inset −2px |
| `Disabled` | `actions-radio--disabled` | `{ disabled: true }` | light + dark | 0.40 opacity, not interactive |
| `SelectedDisabled` | `actions-radio--selected-disabled` | `{ checked: true, disabled: true }` | light + dark | Selected appearance at 0.40 opacity |
| `WithSubtext` | `actions-radio--with-subtext` | `{ hasSubtext: true, subtext: 'Supporting info' }` | light + dark | Subtext below label in text/subtle |
| `SizeMd` | `actions-radio--size-md` | `{ size: 'md' }` | light + dark | 20×20px control, 16px label |
| `Group` | `actions-radio--group` | 3 Radios with same `name`, one checked | light + dark | Only one checked at a time; mutual exclusivity |

---

## 16. Test and visual-verification contract

### Per-prop verification

| Prop | Default test | Key assertion |
|---|---|---|
| `checked` | `false` → empty circle | `true` → selection-dot present in DOM |
| `disabled` | `false` → interactive | `true` → `input[disabled]`, opacity 0.40, not selectable |
| `size` | `'sm'` → 16px control | `offsetWidth` of `radio-box-container` equals 16 (sm) or 20 (md) |
| `hasSubtext` | `false` → no subtext | `true` → `.radio__subtext` present with content |
| `name` grouping | Same name → mutual exclusive | Select one → others with same name are deselected |

### Conditional element inventory

| element_key | Controlling condition | Presence test | Absence test |
|---|---|---|---|
| `selection-dot` | `checked=true` | `.radio__selection-dot` in DOM | Not found |
| `label` | `hasLabel=true` | `.radio__label` has text content | Not rendered |
| `subtext` | `hasSubtext=true` | `.radio__subtext` in DOM | Not found |
| `focus-ring` | `:focus-visible` / `hasFocus=true` | `display: block` | `display: none` |

### Interaction verification

| Interaction | Story | Drive | Callback | DOM |
|---|---|---|---|---|
| Click | `Unselected` | `userEvent.click` | `onChange('value')` | `input.checked === true` |
| Blocked: disabled | `Disabled` | `userEvent.click` | Not fired | `input.checked` unchanged |
| Group exclusivity | `Group` | Click second radio | `onChange` on second | First radio `input.checked === false` |

### Visual matrix

| Story | Viewport | Theme | Figma reference | Tolerance |
|---|---|---|---|---|
| `Unselected` | 800×600 | light + dark | Node `660:32911` | 0.2% |
| `Selected` | 800×600 | light + dark | Node `660:32915` | 0.2% |
| `Focused` | 800×600 | light + dark | Node `660:32913` | 0.2% |
| `Disabled` | 800×600 | light + dark | Node `661:33014` | 0.2% |
| `SizeMd` | 800×600 | light + dark | Node `660:32975` | 0.2% |

---

## 17. Decisions

### Confirmed decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | `subtext` implemented as embedded element inside Radio | Live Figma structure (2026-08-11) shows `subtext` TEXT node as a direct child of `content` frame inside the Radio component. The CSET description states "Supporting text is a sibling Hint Text atom composed by the parent pattern" — this is a governance aspiration that does not reflect the actual build. Implementing per the live structure. The governance principle should be reconciled in a future design system review. |
| DEC-02 | Native `disabled` attribute (not `aria-disabled`) | For `<input type="radio">`, native `disabled` is the correct HTML/ARIA pattern. Removing from tab order is correct for radio groups — users navigate the group via arrow keys; disabled options should not receive focus. This differs from Toggle Switch where `aria-disabled` was used on a custom `<button>`. |
| DEC-03 | `selection-dot` is conditionally rendered, not visibility-toggled | Figma: dot is structurally absent in unselected variants (not a hidden layer). Conditional render (`{checked && <span>}`) matches the design intent. |
| DEC-04 | Use `:has(input:checked)` CSS for selected state styling | Modern CSS `:has()` selector is supported in all major browsers (Chrome 105+, Firefox 121+, Safari 15.4+). Avoids JavaScript-driven class toggling. |

### Rejected approaches

| ID | Approach | Why rejected | Chosen instead |
|---|---|---|---|
| REJ-01 | `<div role="radio">` custom implementation | Requires manual keyboard handling, form integration, and AT announcement — all provided free by native `<input type="radio">` | `<input type="radio">` inside `<label>` |
| REJ-02 | `aria-disabled` only (no native `disabled`) | Correct for custom button-based controls; incorrect for native inputs. For radio inputs, `aria-disabled` alone does not prevent selection — native `disabled` is required. | Native `disabled` + 0.40 opacity |
| REJ-03 | Visibility toggle for `selection-dot` | Dot is absent in Figma, not hidden — conditional render is semantically correct and avoids empty decorative elements | `{checked && <span className="radio__selection-dot" />}` |

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma node `660:33013` live read 2026-08-11
- [x] All 16 variants in cross-matrix
- [x] Mode NEW, scope explicit
- [x] Absolute Requirements documented (8 items)
- [x] DEC-01 governance discrepancy documented (embedded subtext vs dumb-atom principle)
- [x] `selection-dot` conditional render correctly specified
- [x] Native radio vs custom radio decision documented
- [x] `unresolved_question_count: 0`
- [x] No hardcoded values

### Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Design | George Karian | PENDING | — |
| Engineering | Narendra | PENDING | — |
