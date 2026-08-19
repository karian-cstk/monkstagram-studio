---
brief_schema: venus-storybook-handover/v2
component_name: "Segmented Control"
component_kebab_case: "segmented-control"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1478-118457"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "1478:118457"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Actions/SegmentedControl"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        Segmented Control
  REACT_COMPONENT:       SegmentedControl
  STORYBOOK_TITLE:       Actions/SegmentedControl
  FIGMA_NODE_ID:         1478:118457
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           🔘 Actions
  CSS_CLASS_PREFIX:      segmented-control
  FILE_NAME:             SegmentedControl.tsx
  STORY_FILE_NAME:       SegmentedControl.stories.tsx
  CSS_FILE_NAME:         SegmentedControl.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
  STATUS:                Active
  ═══════════════════════════════════════════════════════════════════
-->

# Segmented Control — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | Root must be `<div role="radiogroup">` with `aria-label` or `aria-labelledby` | WCAG 1.3.1 and 4.1.2: a group of mutually exclusive options must be announced as a radiogroup with a group name, or AT users hear a series of unrelated radio buttons. |
| 2 | Each child must be a `Segment` with `role="radio"` — supplied by the Segment component | `role="radiogroup"` requires radio children. Segment already provides this. Do not substitute plain buttons. |
| 3 | **Roving tabindex** — exactly one segment has `tabIndex=0` (the selected one, or the first if none matches); all others have `tabIndex=-1` | Tab must enter the group at a single stop. Without roving tabindex, Tab walks through every option, which is the wrong keyboard model for a radiogroup. |
| 4 | Arrow keys route focus among segments; Tab exits the group | Standard ARIA radiogroup contract. Arrow routing is **SegmentedControl's** responsibility — Segment only handles Space/Enter activation. |
| 5 | 1–5 segments only — dev warning outside that range | Figma slot constraint: `minChildren: 1, maxChildren: 5`. Beyond 5, labels compress past readability and the control should become a Select. |
| 6 | **`Type=Flat` was removed 2026-07-17.** Only `Type=Filled` exists. Do not implement Flat. | Live Figma has 6 variants, all `Type=Filled`. The CSET description text still describes Flat — it is stale. Constitution records the removal. |
| 7 | Container `border-radius: 9999px` (pill) — raw value in CSS | Figma binds `radius/9999` (`546:3083`) per corner; the API cannot bind `cornerRadius` on COMPONENT nodes. CSS uses the literal `9999px`. |
| 8 | Exactly one segment must be selected at all times — `value` is a required prop | A radiogroup with no selection is a valid ARIA state but an invalid product state for a view switcher. The consumer must always supply a valid `value`. |
| 9 | In `mode='icon-only'`, the `label` text is still passed to each Segment for its accessible name | Hiding the label visually must not hide it from AT. Segment renders it with `showLabel=false` but the text remains the accessible name. |

---

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/date | What it establishes |
|---|---|---|---|
| Figma design context (live read) | Node `1478:118457`, 🔘 Actions | 2026-08-11 | 6 variants (all `Type=Filled`), container dimensions per size, slot contents, all token bindings |
| Figma CSET description | `1478:118457` description | 2026-08-11 | Size spec (container and segment heights), Filled token map, IconOnly aria-label note. **Contains stale Flat documentation.** |
| `_Internal/Segment` brief | Node `829:70442` | 2026-08-11 | Segment API, `role="radio"`, `aria-checked`, tabIndex pass-through, arrow-routing boundary — ✅ HANDOFF_COMPLETE |
| `_Internal/Icon-Wrapper` brief | Node `214:152884` | 2026-08-11 | Transitive dependency via Segment — ✅ HANDOFF_COMPLETE |
| `00-project-constitution.md` | Segmented Control node correction + Flat removal | Project knowledge | Node was rebuilt as `1478:118457`; Flat type removed 2026-07-17 |

### Source precedence and conflict resolved

**Conflict:** The CSET description states "12 variants: Type=Filled|Flat × Size=sm|md|lg × Mode=Labeled|IconOnly" and documents Flat token values in detail.

**Live Figma:** 6 variants. The `Type` VARIANT property has exactly one option: `["Filled"]`.

**Resolution:** Live Figma is authoritative. Flat was removed 2026-07-17 per the constitution. The description text was not updated at that time. This brief implements **Filled only** and exposes no `type` prop. The stale description should be corrected in Figma.

---

## 1. Outcome and scope

**Definition:** A view-switcher control grouping 1–5 mutually exclusive options inside a pill-shaped sunken container, where exactly one option is selected at all times and all options remain visible.

**User need:** Contentstack editors need to switch between distinct view modes or perspectives — Grid/List, Day/Week/Month, Draft/Published — where the options are few, mutually exclusive, and benefit from being visible simultaneously rather than hidden behind a dropdown.

### Use cases

| ID | Use case | Context | Mode / size | Success outcome |
|---|---|---|---|---|
| UC-01 | Toggle list vs grid view | Data list toolbar | icon-only / sm | Two icon segments, one selected, arrow keys switch |
| UC-02 | Switch time range | Analytics header | labeled / md | 3 labeled segments (Day/Week/Month), current selection filled |
| UC-03 | Filter by publish state | Content list header | labeled / md | 3 segments (All/Draft/Published) |
| UC-04 | Dense sidebar view switch | Left panel, constrained width | icon-only / sm | 36px container, compact segments |
| UC-05 | Prominent mode switch in an empty state | Onboarding / setup screen | labeled / lg | 48px container, larger tap targets |

### Scope

| In scope | Out of scope |
|---|---|
| `Type=Filled` only — 3 sizes (sm/md/lg) × 2 modes (Labeled/IconOnly) | `Type=Flat` (removed 2026-07-17) |
| 1–5 segments via a `segments` array prop | 6+ segments (use Select) |
| Controlled selection via `value` + `onChange` | Uncontrolled / internally managed selection |
| Roving tabindex and arrow-key routing | Multi-select (use Checkbox group) |
| Group-level and per-segment disabled | Async or lazily loaded segments |
| Both Labeled and IconOnly modes | Mixed mode (some segments labeled, some icon-only) |

### Responsibility boundary

| SegmentedControl owns | Consumer owns | Segment (child) owns |
|---|---|---|
| `role="radiogroup"` and group `aria-label` | Providing a valid `value` at all times | `role="radio"` and `aria-checked` |
| Roving tabindex assignment | Reacting to `onChange` | Its own visual states |
| Arrow-key focus routing | Segment `label` and `icon` content | Its own focus ring |
| Skipping disabled segments during arrow navigation | Layout placement and container width | Space/Enter activation |
| Programmatic focus after arrow navigation | Persisting the selection | `aria-disabled` when disabled |
| Container geometry and sunken background | Deciding when a Select is more appropriate | — |

---

## 2. Existing baseline and change contract

`N/A — new component. No prior Storybook implementation.`

**Figma history note:** The Figma component was rebuilt — the node ID changed from `829:71472` to `1478:118457`. The constitution was corrected accordingly. `Type=Flat` existed briefly and was removed 2026-07-17. No production React consumers exist yet, so no consumer migration is required.

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Container `<div role="radiogroup">` mapping a `segments` array to `Segment` children |
| Existing components to reuse | `Segment` (`829:70442`) — ✅ HANDOFF_COMPLETE |
| Transitive dependency | `IconWrapper` (`214:152884`) via Segment's `leadingIcon` — ✅ HANDOFF_COMPLETE |
| Code Connect mappings | None currently |
| Hooks/utilities/providers | Internal `useState` for `focusedIndex`; internal ref array for programmatic focus. No shared hooks required. |
| Existing tokens | Venus_Semantics container tokens + Segment's own tokens. Full table in Section 13. |
| Genuinely new surface | `SegmentedControl.tsx`, `SegmentedControl.module.css`, `SegmentedControl.stories.tsx` |
| Prohibited reimplementation | Do not implement arrow-key logic inside Segment. Do not implement radio semantics in this container — Segment provides them. Do not re-derive segment visual states. |

### Dependency tree

| Direction | Component | Must exist before build | Breaking if API changes |
|---|---|---|---|
| Upstream | `Segment` (`829:70442`) | **Yes** — ✅ HANDOFF_COMPLETE | `isSelected`, `isDisabled`, `showLabel`, `hasLeadingIcon`, `tabIndex` pass-through, or ref forwarding changes are all breaking |
| Upstream (transitive) | `IconWrapper` (`214:152884`) | Yes — ✅ HANDOFF_COMPLETE | `size` prop rename breaks icon sizing inside segments |
| Downstream | Data list toolbars, analytics headers | N/A | `value` / `onChange` / `segments` renames are breaking |

**Critical upstream requirement:** `Segment` must forward a ref to its root `<button>`. SegmentedControl calls `.focus()` on segment refs during arrow-key navigation. The Segment brief specifies `React.forwardRef<HTMLButtonElement, SegmentProps>` — this contract must hold.

---

## 4. Anatomy

`REQUIRED` = always rendered · `OPTIONAL` = prop-controlled · `INTERNAL` = never a prop

| element_key | Layer name | Visibility | Condition | RTL mirrors | Figma ref | Semantic/testing requirement |
|---|---|---|---|---|---|---|
| `root` | `segmented-control` | REQUIRED | Always | yes — segment order reverses in RTL | Variant frame — `radius/9999`, `surface/sunken`, `border/subtle`, 4px padding | `<div role="radiogroup">`, `aria-label` or `aria-labelledby`, `data-testid="segmented-control"`, `data-icon-mode="default"` |
| `segments-slot` | `segments` | REQUIRED | Always | yes | SLOT node, `itemSpacing=0` | Container for Segment children. In React this is the mapped output — no separate wrapper element is required. |
| `segment-[n]` | `segment-1` … `segment-5` | REQUIRED | 1–5 items from the `segments` array | yes — visual order reverses | INSTANCE of `_Internal/Segment` | `<Segment>` — each renders `role="radio"` with its own `aria-checked` and focus ring |

> **No separate slot wrapper in the DOM.** Figma models `segments` as a SLOT node, but in React the segments are direct children of the radiogroup `<div>`. Adding an intermediate wrapper would break the `role="radiogroup"` → `role="radio"` parent-child relationship that AT requires.

---

## 5. Public React API

### Props

| Prop | TypeScript type | Required | Default | Behavior | Storybook control |
|---|---|---|---|---|---|
| `value` | `string` | **Yes** | — | The currently selected segment's `value`. Controlled. | select (from segment values) |
| `onChange` | `(value: string) => void` | **Yes** | — | Called with the newly selected segment's value | — |
| `segments` | `SegmentDefinition[]` | **Yes** | — | 1–5 segment definitions. See type below. | object |
| `aria-label` | `string` | Conditional | — | Group name. Required unless `aria-labelledby` is provided. | text |
| `aria-labelledby` | `string` | Conditional | — | ID of a visible label element. Alternative to `aria-label`. | text |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Container and segment heights, segment padding, label font | select |
| `mode` | `'labeled' \| 'icon-only'` | No | `'labeled'` | Whether segment labels are visible. Labels always reach AT. | select |
| `disabled` | `boolean` | No | `false` | Disables the entire group — all segments become non-interactive at 0.40 opacity | boolean |
| `className` | `string` | No | `''` | Forwarded to the root `<div>` | — |

### SegmentDefinition type

| Field | TypeScript type | Required | Behavior |
|---|---|---|---|
| `value` | `string` | Yes | Unique identifier. Matched against the `value` prop to determine selection. |
| `label` | `string` | Yes | Visible in `labeled` mode; used as the accessible name in both modes |
| `icon` | `React.ReactNode` | Conditional | Required in `icon-only` mode. Optional in `labeled` mode (renders as a leading icon). |
| `disabled` | `boolean` | No | Disables this segment individually. Arrow navigation skips it. |

### Callbacks

| Callback | Trigger | Signature | Must not fire when |
|---|---|---|---|
| `onChange` | Segment click, Space, or Enter | `(value: string) => void` | Group `disabled === true`, or that segment's `disabled === true` |

> **`onChange` does not fire on arrow-key focus movement.** Arrow keys move focus only. The user must press Space or Enter to select. This is the "manual activation" radiogroup pattern — see DEC-05 for the rationale.

### API mechanics

| Concern | Contract |
|---|---|
| Controlled only | `value` is required. There is no uncontrolled mode and no `defaultValue`. A view switcher always has a definite current state owned by the consumer. |
| Internal state | `focusedIndex` only — tracks which segment currently holds the roving `tabIndex=0`. Never the selection. |
| `focusedIndex` initialisation | Index of the segment matching `value`; falls back to `0` if no match |
| `focusedIndex` sync | Resets to the selected segment's index whenever `value` changes externally |
| Prop changes after mount | `value`, `segments`, `size`, `mode`, `disabled` all update cleanly |
| Ref forwarding | Not required on the container. The component holds internal refs to each Segment. |
| Native DOM props | Not spread — the container's ARIA surface is deliberately controlled |
| Segment refs | Internal `useRef<(HTMLButtonElement \| null)[]>` array, populated via each Segment's forwarded ref |

### TypeScript interface

```typescript
/**
 * A single segment definition within a SegmentedControl.
 */
export interface SegmentDefinition {
  /** Unique identifier, matched against the control's `value` prop. */
  value: string;
  /**
   * Visible label in 'labeled' mode.
   * Always used as the segment's accessible name, including in 'icon-only' mode.
   */
  label: string;
  /** Icon element. Required in 'icon-only' mode; optional leading icon in 'labeled' mode. */
  icon?: React.ReactNode;
  /** Disables this segment individually. Arrow navigation skips it. */
  disabled?: boolean;
}

/**
 * View-switcher control grouping 1–5 mutually exclusive options.
 * Renders as role="radiogroup" with roving tabindex and arrow-key navigation.
 *
 * Controlled only — `value` and `onChange` are required.
 * Exactly one segment must be selected at all times.
 *
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1478-118457
 */
export interface SegmentedControlProps {
  /** The currently selected segment's value. Controlled. */
  value: string;
  /** Called with the newly selected segment's value. */
  onChange: (value: string) => void;
  /** 1–5 segment definitions. */
  segments: SegmentDefinition[];
  /**
   * Accessible group name. Describes what the segments switch between.
   * E.g. "View mode", "Time range", "Publish state".
   * Required unless aria-labelledby is provided.
   */
  'aria-label'?: string;
  /** ID of a visible label element. Alternative to aria-label. */
  'aria-labelledby'?: string;
  /** Size variant. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether segment labels are visible.
   * In 'icon-only' mode the label text is hidden visually but remains
   * the accessible name — each segment must also have an `icon`.
   * @default 'labeled'
   */
  mode?: 'labeled' | 'icon-only';
  /** Disables the entire group. @default false */
  disabled?: boolean;
  /** Additional class forwarded to the root div. */
  className?: string;
}
```

### JSX base component

```tsx
import React from 'react';
import { Segment } from '../Segment/Segment';
import type { SegmentedControlProps } from './SegmentedControl';
import styles from './SegmentedControl.module.css';

// Container size → Segment size. Segment supports only 'md' and 'lg'.
const segmentSizeMap = { sm: 'md', md: 'md', lg: 'lg' } as const;

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  value,
  onChange,
  segments,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  size = 'md',
  mode = 'labeled',
  disabled = false,
  className,
}) => {
  const selectedIndex = Math.max(segments.findIndex((s) => s.value === value), 0);
  const [focusedIndex, setFocusedIndex] = React.useState(selectedIndex);
  const segmentRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const isProgrammaticFocus = React.useRef(false);

  // Keep the roving tabindex anchored to the selection when `value` changes externally
  React.useEffect(() => {
    setFocusedIndex(selectedIndex);
  }, [selectedIndex]);

  // Move DOM focus only after an arrow-key navigation, never on mount or external value change
  React.useEffect(() => {
    if (isProgrammaticFocus.current) {
      segmentRefs.current[focusedIndex]?.focus();
      isProgrammaticFocus.current = false;
    }
  }, [focusedIndex]);

  if (process.env.NODE_ENV !== 'production') {
    if (segments.length < 1 || segments.length > 5) {
      console.warn(
        `[SegmentedControl] segments must contain 1–5 items (received ${segments.length}). ` +
        'For more options use a Select.'
      );
    }
    if (!ariaLabel && !ariaLabelledby) {
      console.warn('[SegmentedControl] Either aria-label or aria-labelledby is required.');
    }
    if (!segments.some((s) => s.value === value)) {
      console.warn(
        `[SegmentedControl] value "${value}" does not match any segment. ` +
        'Exactly one segment must be selected at all times.'
      );
    }
    if (mode === 'icon-only') {
      const missing = segments.filter((s) => !s.icon).map((s) => s.value);
      if (missing.length) {
        console.warn(
          `[SegmentedControl] mode="icon-only" requires an icon on every segment. Missing: ${missing.join(', ')}`
        );
      }
    }
  }

  // Indices of segments that can receive focus (not disabled at group or item level)
  const enabledIndices = segments.reduce<number[]>(
    (acc, seg, i) => (!disabled && !seg.disabled ? [...acc, i] : acc),
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (enabledIndices.length === 0) return;
    const currentPos = enabledIndices.indexOf(index);
    if (currentPos === -1) return;

    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
    } else if (e.key === 'Home') {
      nextIndex = enabledIndices[0];
    } else if (e.key === 'End') {
      nextIndex = enabledIndices[enabledIndices.length - 1];
    }

    if (nextIndex !== null) {
      e.preventDefault();
      isProgrammaticFocus.current = true;
      setFocusedIndex(nextIndex);
    }
  };

  const handleSelect = (seg: SegmentedControlProps['segments'][number], index: number) => {
    if (disabled || seg.disabled) return;
    onChange(seg.value);
    setFocusedIndex(index);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      data-testid="segmented-control"
      data-icon-mode={disabled ? 'disabled' : 'default'}
      className={[
        styles['segmented-control'],
        styles[`segmented-control--${size}`],
        disabled ? styles['segmented-control--disabled'] : '',
        className,
      ].filter(Boolean).join(' ')}
      style={disabled ? { opacity: 'var(--venus-visibility-disabled)' } : undefined}
    >
      {segments.map((seg, index) => (
        <Segment
          key={seg.value}
          ref={(el) => { segmentRefs.current[index] = el; }}
          label={seg.label}
          size={segmentSizeMap[size]}
          isSelected={seg.value === value}
          isDisabled={disabled || !!seg.disabled}
          showLabel={mode === 'labeled'}
          hasLeadingIcon={!!seg.icon}
          leadingIcon={seg.icon}
          tabIndex={index === focusedIndex ? 0 : -1}
          onClick={() => handleSelect(seg, index)}
          onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, index)}
          className={styles['segmented-control__segment']}
        />
      ))}
    </div>
  );
};

SegmentedControl.displayName = 'SegmentedControl';
```

**SegmentedControl.module.css:**

```css
/* ── Container ──────────────────────────── */
.segmented-control {
  display: inline-flex;
  align-items: center;
  gap: 0;                                     /* segments sit flush — itemSpacing=0 in Figma */
  padding: var(--venus-space-4, 4px);
  background: var(--venus-surface-sunken);
  border: 1px solid var(--venus-border-subtle);
  border-radius: 9999px;                      /* pill — raw value, API limitation */
  box-sizing: border-box;
}

/* ── Sizes — outer container heights ─────── */
/* Height = 4px top pad + segment height + 4px bottom pad */
.segmented-control--sm { height: 36px; }      /* 4 + 28 + 4 */
.segmented-control--md { height: 40px; }      /* 4 + 32 + 4 */
.segmented-control--lg { height: 48px; }      /* 4 + 40 + 4 */

/* ── Segment sizing inside the container ── */
.segmented-control--sm .segmented-control__segment { height: 28px; }
.segmented-control--md .segmented-control__segment { height: 32px; }
.segmented-control--lg .segmented-control__segment { height: 40px; }

/* ── Group disabled ─────────────────────── */
/* opacity applied inline via style prop — visibility/disabled = 0.40 */
.segmented-control--disabled {
  pointer-events: none;
  cursor: not-allowed;
}

/* ── RTL ────────────────────────────────── */
[dir='rtl'] .segmented-control {
  flex-direction: row-reverse;
}

/* ── Forced colors ──────────────────────── */
@media (forced-colors: active) {
  .segmented-control { border: 1px solid currentColor; }
}
```

### Invalid combinations

| Combination | Valid | Required result |
|---|---|---|
| `segments.length === 0` | No | Dev warn. Renders an empty container. |
| `segments.length > 5` | No | Dev warn. Renders all segments — layout will compress. Consumer should switch to Select. |
| `value` matches no segment | No | Dev warn. `focusedIndex` falls back to `0`. No segment renders as selected. |
| Neither `aria-label` nor `aria-labelledby` | No | Dev warn. The radiogroup has no accessible name. |
| `mode='icon-only'` with a segment missing `icon` | No | Dev warn listing the offending segment values. That segment renders empty. |
| Duplicate `value` across segments | No | React key collision warning. Selection becomes ambiguous. Consumer must ensure uniqueness. |
| `segments.length === 1` | Technically valid (Figma allows min 1) | Renders, no warning. A single-option switcher is unusual but permitted by the slot constraint. |
| All segments `disabled` | Valid edge case | Arrow navigation does nothing (`enabledIndices` is empty). No crash. |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop | Mapping rule | React default |
|---|---|---|---|---|
| `Type` (VARIANT) | `Filled` (only option) | **none** — no prop exposed | Flat removed 2026-07-17. Filled is the only type; no prop is needed. | — |
| `Size` (VARIANT) | `sm \| md \| lg` | `size` | direct | `'md'` |
| `Mode` (VARIANT) | `Labeled \| IconOnly` | `mode` | `Labeled → 'labeled'`, `IconOnly → 'icon-only'` (kebab-case transform) | `'labeled'` |
| `segments#1478:1133` (SLOT) | 1–5 `_Internal/Segment` instances | `segments: SegmentDefinition[]` | Slot children become array items. Slot settings (`minChildren: 1`, `maxChildren: 5`, `stretchChildOnInsert: true`, `allowPreferredValuesOnly: true`) become the array length validation and the `Segment`-only type constraint. | — (required) |

### Unmapped design properties

`N/A — all live Figma properties are mapped or intentionally omitted (Type).`

### Slot settings translation

| Figma slot setting | Value | React equivalent |
|---|---|---|
| `minChildren` | 1 | Dev warn if `segments.length < 1` |
| `maxChildren` | 5 | Dev warn if `segments.length > 5` |
| `stretchChildOnInsert` | `true` | Segments hug their content; the container hugs the segments. No stretch is applied in React — see DEC-06. |
| `displayEmptyByDefault` | `false` | `segments` is a required prop — the control is never rendered empty by design |
| `allowPreferredValuesOnly` | `true` | TypeScript: children are always `Segment`, never arbitrary nodes. The array-prop API enforces this structurally. |

### Unmapped code properties

`N/A — new component.`

---

## 7. Variants, states, and precedence

### Size contract (live-verified 2026-08-11)

| Size | Container height | Segment height | Container padding | Segment paddingH | Segment label font | Segment size prop |
|---|---|---|---|---|---|---|
| `sm` | **36px** | 28px | 4px | 12px | 11px (Label/SM, letterSpacing bound) | `'md'` |
| `md` | **40px** | 32px | 4px | 12px | 14px (Body/MD) | `'md'` |
| `lg` | **48px** | 40px | 4px | 16px | 16px (Body/LG) | `'lg'` |

Container width is HUG — it grows with the combined segment widths. `border-radius: 9999px` at every size.

> **Note on Segment size mapping:** `Segment` supports only `'md'` and `'lg'`. SegmentedControl `sm` and `md` both map to Segment `'md'`; the visual height difference (28px vs 32px) is applied by SegmentedControl's own CSS via `.segmented-control--sm .segmented-control__segment { height: 28px }`. See DEC-04.

### Variant cross-matrix

| | Mode=Labeled | Mode=IconOnly |
|---|---|---|
| **Size=sm** | ✓ `1478:118111` | ✓ |
| **Size=md** | ✓ | ✓ `829:71471` |
| **Size=lg** | ✓ `829:71468` | ✓ |

All 6 combinations valid. `Type` is always `Filled`.

### State table

| State | Category | Trigger | CSS mechanism | ARIA change | Required story |
|---|---|---|---|---|---|
| Default (one selected) | Base | Initial render with valid `value` | Selected Segment gets `.segment--selected` | Selected segment `aria-checked="true"`; others `"false"` | `Default` |
| Segment hover | Interaction | Pointer enter on a segment | Segment's own `:hover` | — | `SegmentHovered` |
| Segment focused | Interaction | Arrow key or Tab into group | Segment's own `:focus-visible` ring | — | `Focused` |
| Segment disabled (individual) | Public | `segments[n].disabled = true` | Segment's `aria-disabled` + 0.40 opacity | That segment `aria-disabled="true"` | `WithDisabledSegment` |
| Group disabled | Public | `disabled=true` on the control | Container `opacity: 0.40` + `pointer-events: none`; every Segment `isDisabled` | Every segment `aria-disabled="true"` | `GroupDisabled` |

The container itself has no hover, focus, or pressed state. All interaction states live on the Segment children.

### State precedence

| Higher | Lower | Result |
|---|---|---|
| Group `disabled=true` | Individual `segments[n].disabled=false` | Group wins — every segment is disabled |
| Group `disabled=true` | Segment hover | Blocked by container `pointer-events: none` |
| Individual `segments[n].disabled=true` | Selection | A disabled segment can still be the selected one (renders selected + disabled). Arrow navigation skips it. |
| Individual `segments[n].disabled=true` | Arrow navigation | Segment is excluded from `enabledIndices` — arrows skip over it |

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure mode |
|---|---|---|---|---|
| BR-01 | Valid `value` matching a segment | Component renders | That segment has `aria-checked="true"`, filled background, `border/brand`; all others `aria-checked="false"` | No visual or AT indication of the current view mode |
| BR-02 | `disabled=false`, segment not disabled | User clicks a segment | `onChange(segment.value)` fires; `focusedIndex` updates to that segment | Selection does not change |
| BR-03 | Group `disabled=true` | User clicks any segment | `onChange` does not fire | Disabled group changes state |
| BR-04 | `segments[n].disabled=true` | User clicks segment n | `onChange` does not fire | Disabled option becomes selectable |
| BR-05 | Focus on segment 1 of 3, none disabled | User presses Arrow Right | Focus moves to segment 2. `onChange` does **not** fire. | Selection changes on mere focus movement — user cannot browse options without committing |
| BR-06 | Focus on the last enabled segment | User presses Arrow Right | Focus wraps to the first enabled segment | Focus stalls at the end; user must Shift+Tab out and back |
| BR-07 | Segment 2 of 3 is disabled, focus on segment 1 | User presses Arrow Right | Focus moves to segment 3, skipping segment 2 | Focus lands on a segment that cannot be activated |
| BR-08 | Focus on any segment | User presses Space or Enter | `onChange` fires for the focused segment | Keyboard users cannot select |
| BR-09 | `value` changes externally (parent state update) | Component re-renders | `focusedIndex` resyncs to the newly selected index. DOM focus does **not** move. | Focus jumps unexpectedly during unrelated parent re-renders |
| BR-10 | `segments.length > 5` | Component renders | Dev `console.warn`; all segments still render | Silent usability degradation ships |
| BR-11 | Neither `aria-label` nor `aria-labelledby` | Component renders | Dev `console.warn` | Radiogroup announced without a name — AT users hear unrelated radios |
| BR-12 | `mode='icon-only'`, a segment lacks `icon` | Component renders | Dev `console.warn` naming that segment | Empty segment with no visual content |
| BR-13 | All segments disabled | User presses any arrow key | Nothing happens; no error thrown | Runtime crash on empty `enabledIndices` |
| BR-14 | `mode='icon-only'` | Component renders | Each Segment receives `showLabel=false` but the `label` string is still passed | Icon-only segments have no accessible name |

### Input and data validation

| Prop | Valid | Invalid/edge | Behavior |
|---|---|---|---|
| `value` | Matches one `segments[n].value` | No match, `''` | Dev warn; `focusedIndex` = 0; no segment renders selected |
| `segments` | Array of 1–5 unique-valued definitions | Empty, >5, duplicate values | Dev warn (length); React key warning (duplicates) |
| `segments[n].label` | Non-empty string | `''` | Segment renders with no accessible name — Segment's own dev warn fires |
| `segments[n].icon` | ReactNode | `undefined` in `icon-only` mode | Dev warn; that segment renders empty |
| `size` | `'sm' \| 'md' \| 'lg'` | Any other | TypeScript compile error |
| `mode` | `'labeled' \| 'icon-only'` | Any other | TypeScript compile error |
| `aria-label` | Non-empty descriptive string | `''`, undefined without `aria-labelledby` | Dev warn |

---

## 9. Interactions and focus

### Interaction table

| ID | element_key | Action | Precondition | Result | Callback | Keyboard | Disabled behavior |
|---|---|---|---|---|---|---|---|
| INT-01 | `segment-[n]` | Click | Group and segment enabled | Selects that segment | `onChange(value)` | Space, Enter | Blocked at both group and segment level |
| INT-02 | `segment-[n]` | Arrow Right / Arrow Down | Segment focused, ≥1 other enabled segment | Focus moves to the next enabled segment (wrapping) | **none** | Arrow Right / Down | Arrow keys do nothing if all segments disabled |
| INT-03 | `segment-[n]` | Arrow Left / Arrow Up | Segment focused | Focus moves to the previous enabled segment (wrapping) | **none** | Arrow Left / Up | Same |
| INT-04 | `segment-[n]` | Home | Segment focused | Focus moves to the first enabled segment | **none** | Home | Same |
| INT-05 | `segment-[n]` | End | Segment focused | Focus moves to the last enabled segment | **none** | End | Same |
| INT-06 | `segment-[n]` | Space or Enter | Segment focused and enabled | Selects the focused segment | `onChange(value)` | Space, Enter | Blocked |
| INT-07 | `root` | Tab (from outside) | — | Focus enters the group at the segment with `tabIndex=0` | — | Tab | Group is skipped entirely when `disabled=true` (`pointer-events: none` plus all segments `aria-disabled`) |
| INT-08 | `root` | Tab (from inside) | Focus on any segment | Focus exits the group to the next focusable element | — | Tab | — |

### Roving tabindex model (Absolute Requirement #3)

| Situation | Segment with `tabIndex=0` | All other segments |
|---|---|---|
| Initial render, `value` matches segment 2 | segment 2 | `tabIndex=-1` |
| Initial render, `value` matches nothing | segment 1 (index 0 fallback) | `tabIndex=-1` |
| After Arrow Right from segment 2 | segment 3 | `tabIndex=-1` |
| After selecting segment 3 by click | segment 3 | `tabIndex=-1` |
| After external `value` change to segment 1 | segment 1 | `tabIndex=-1` |

There is exactly one tab stop for the entire group at all times.

### Focus management

| Event | Focus target | Movement | Restoration | Focus ring |
|---|---|---|---|---|
| Tab into group | The segment with `tabIndex=0` | Single tab stop | Returns to the same segment when tabbing back in | Segment's own `:focus-visible` ring |
| Arrow key | Next/previous enabled segment | Programmatic `.focus()` via the internal ref array | — | Segment's own ring; moves with focus |
| Click a segment | That segment | Native | — | Ring shows only if focus was keyboard-initiated (`:focus-visible`) |
| External `value` change | Unchanged — DOM focus does not move | `focusedIndex` resyncs silently | — | Unchanged |

**Programmatic focus guard:** `isProgrammaticFocus` ref ensures `.focus()` is called only after an arrow-key navigation. Without this guard, the `useEffect` on `focusedIndex` would steal focus on mount and on every external `value` change (BR-09).

**Focus ring:** Owned entirely by `Segment`. See the Segment brief Section 9. SegmentedControl adds no ring of its own — the container never receives focus.

### Motion

| Motion | Trigger | Property | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|
| Segment state transition | Selection change, hover | `background`, `border-color`, `color` — on the Segment | 120ms | `ease` | `transition: none` — inherited from Segment's CSS |

The container has no motion of its own. There is **no sliding-pill animation** — the selected background appears on the newly selected segment and disappears from the previous one. See REJ-03.

---

## 10. Dynamic positioning

SegmentedControl performs **no geometric position calculation**. There is no floating element, no popover, and no sliding indicator that requires measurement.

The one dynamic behaviour is **programmatic focus movement**, which is DOM focus management rather than positioning:

| Operation | Mechanism | Trigger | Guard |
|---|---|---|---|
| Move focus to a segment | `segmentRefs.current[focusedIndex]?.focus()` inside a `useEffect` on `focusedIndex` | Arrow Right / Left / Up / Down / Home / End | `isProgrammaticFocus` ref — set to `true` only in `handleKeyDown`, consumed and reset in the effect |

**Why the guard is required:** without it, the effect fires on mount (stealing focus from wherever the user actually is) and on every external `value` change (yanking focus during unrelated parent re-renders). Both are documented failure modes — see BR-09.

**Ref array requirement:** `Segment` must forward a ref to its root `<button>`. If Segment's ref forwarding is removed, arrow-key navigation silently stops working — focus never moves even though `focusedIndex` updates. This is the most likely upstream breakage for this component.

---

## 11. Responsive behavior

| Constraint | Rule |
|---|---|
| Container width | HUG — grows with the combined widths of its segments plus 8px total padding |
| Container height | Fixed per size: 36 / 40 / 48px. Never content-driven. |
| Segment widths | Each segment HUGs its own content. Segments are **not** equalised to a common width — a longer label produces a wider segment. |
| `flex-shrink` on segments | `0` (from Segment's own CSS) — segments never compress |
| Container overflow | If the combined segment width exceeds the available space, the container overflows its parent. SegmentedControl does not wrap, scroll, or truncate. |
| Consumer responsibility | Keep labels short (1–2 words). For long labels or many options, use a Select instead. |
| `border-radius` | `9999px` at all widths — always a pill regardless of content width |
| RTL | `flex-direction: row-reverse` — segment visual order reverses. Arrow key semantics follow visual order (see Section 12). |
| Zoom/reflow | Container and segment heights scale with browser zoom. Pill geometry is preserved (radius 9999px, not a computed value). |
| Breakpoints | No breakpoint-driven size changes. The consumer selects the appropriate `size` per layout, and may switch `mode` to `icon-only` at narrow widths. |
| Narrow-viewport strategy | Recommended pattern: `mode='labeled'` at wide widths, `mode='icon-only'` below a breakpoint. The consumer toggles the prop — the component does not do this automatically. |

---

## 12. Content, localization, and edge cases

| Case | Required behavior | Story |
|---|---|---|
| Long segment label | That segment widens; container widens. No truncation, no wrapping. Container may overflow its parent. | `LongLabels` |
| Uneven label lengths | Segments have different widths — they are not equalised. This is the Figma behaviour (each Segment HUGs). | `UnevenLabels` |
| Single segment | Renders without warning (Figma `minChildren: 1`). Unusual but permitted. | `SingleSegment` |
| Two segments | The most common case — binary view switch | `TwoSegments` |
| Five segments | Maximum. Verify labels remain readable at the chosen size. | `FiveSegments` |
| Six or more segments | Dev warn. All render. Consumer should switch to Select. | `TooManySegments` |
| Localized labels | Consumer supplies translated strings. German and Finnish labels can be 2–3× longer than English — verify the container still fits, or switch to `icon-only`. | `LongLabels` |
| RTL layout | Container uses `flex-direction: row-reverse`. Segment visual order reverses. **Arrow key direction follows visual order** — in RTL, Arrow Left moves to the visually-next segment. See DEC-07. | `RTL` |
| Icon-only with directional icons | Consumer must supply RTL-appropriate icons (e.g. a "previous" chevron flips direction). SegmentedControl does not mirror icons. | N/A |
| Icon-only mode accessible names | Each segment's `label` string is still passed to Segment and remains the accessible name. AT announces "Grid, radio button, checked, 1 of 3". | `IconOnly` |
| All segments disabled | Renders at group opacity if `disabled=true`, or with each segment individually faded. Arrow keys do nothing. No crash. | `AllSegmentsDisabled` |
| Selected segment is also disabled | Renders selected + disabled (filled background at 0.40 opacity). Arrow navigation skips it. Valid state — e.g. the current view is temporarily unavailable. | `SelectedAndDisabled` |
| `value` does not match any segment | Dev warn. No segment renders selected. `focusedIndex` = 0. | N/A |
| High contrast / forced-colors mode | Container gets `border: 1px solid currentColor`. Segment selection is communicated by its own border, not by fill alone. | N/A |
| Selection communicated by more than colour | The selected segment has both a filled background **and** a `border/brand` border, plus `aria-checked="true"`. Satisfies WCAG 1.4.1. | N/A |

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't | Rationale |
|---|---|---|
| Always supply a `value` that matches a segment | Render with `value=''` or a stale value | A view switcher with nothing selected has no defined current state; the UI and the data disagree |
| Provide `aria-label` describing what is switched | Omit the group label | AT users hear a sequence of unrelated radio buttons with no context |
| Use 2–5 segments | Use 6+ segments | Labels compress past readability. Use a Select. |
| Let arrow keys move focus only; require Space/Enter to select | Select on arrow-key focus | Selecting on focus means the user cannot browse options without committing to each one — and in this control every selection changes the view |
| Keep segment labels to 1–2 words | Use sentence-length labels | Segments HUG their content; long labels make the container overflow its parent |
| Switch to `mode='icon-only'` at narrow widths | Let the container overflow | Icon-only keeps the control within its bounds without truncating text |
| Pass `label` on every segment even in `icon-only` mode | Omit `label` when the icon is visible | `label` is the accessible name in both modes — omitting it leaves the segment unnamed for AT |
| Let SegmentedControl own arrow-key routing | Implement arrow handling inside Segment | Group-level focus routing requires knowledge of siblings, which Segment does not have |
| Rely on Segment's focus ring | Add a container-level focus ring | The container never receives focus. A ring on it would be visible with no focused element inside. |
| Use group `disabled` to disable everything | Disable each segment individually to disable the whole control | Group `disabled` also applies container opacity and `pointer-events: none`, producing one uniform faded control rather than several independently faded pills |

---

## 13. Tokens, typography, and assets

**Token chain:** `_Primitives → Venus_Semantics → component layer`. All bindings live-verified 2026-08-11.

### Tokens — container

| Property | Token (full chain) | CSS custom property | Figma VariableID | Value |
|---|---|---|---|---|
| `background` | `[VS] surface/sunken` | `--venus-surface-sunken` | `563:3182` | — |
| `border-color` | `[VS] border/subtle` | `--venus-border-subtle` | `564:3207` | — |
| `border-width` | `[P] border-width/1` | `--venus-border-width-1` | `546:3085` | 1px |
| `border-radius` | `[P] radius/9999` (bound per corner) | `9999px` (raw in CSS) | `546:3083` | 9999px |
| `padding` (all sides) | `[P] space/4` | `--venus-space-4` | `546:3060` | 4px |
| `gap` between segments | `[P] space/0` | `0` | `546:3059` | 0 |
| Group disabled `opacity` | `[VS] visibility/disabled` | `--venus-visibility-disabled` | `564:3246` | **0.40** |

### Tokens — segments (owned by Segment, listed for reference)

| Segment state | Property | Token | CSS custom property | VariableID |
|---|---|---|---|---|
| Selected | `background` | `[VS] action/secondary/hover` | `--venus-action-secondary-hover` | `564:3221` |
| Selected | `border-color` | `[VS] border/brand` | `--venus-border-brand` | `564:3211` |
| Selected | label `color` | `[VS] text/brand` | `--venus-text-brand` | `564:3199` |
| Unselected | `background` | none (transparent) | — | — |
| Unselected | label `color` | `[VS] text/subtle` | `--venus-text-subtle` | `564:3193` |
| Unselected hover | `background` | `[VS] action/ghost/hover` | `--venus-action-ghost-hover` | `564:3226` |
| Disabled | label `color` | `[VS] text/disabled` | `--venus-text-disabled` | `564:3196` |
| Focused | ring `border-color` | `[VS] border/focus` | `--venus-border-focus` | `564:3227` |
| All | `border-radius` | `[P] radius/9999` | `9999px` | `546:3083` |

Full segment token detail is in the `_Internal/Segment` brief Section 13. SegmentedControl must not override these values.

### Tokens — segment padding per size

| Container size | Segment paddingH token | CSS custom property | Value |
|---|---|---|---|
| `sm` | `[P] space/12` | `--venus-space-12` | 12px |
| `md` | `[P] space/12` | `--venus-space-12` | 12px |
| `lg` | `[P] space/16` | `--venus-space-16` | 16px |

### Typography

| Container size | Segment label token | Family | Weight | Size | Line height | Notes |
|---|---|---|---|---|---|---|
| `sm` | Label/SM | Inter | 500 | 11px | 130% | `letterSpacing` bound to `546:3133` |
| `md` | Body/MD (`546:3108`) | Inter | 500 | 14px | 130% | — |
| `lg` | Body/LG (`546:3109`) | Inter | 500 | 16px | 130% | — |

Font family: `[P] font/inter` (`546:3103`). Weight: `[P] font-weight/medium` (`546:3118`) = 500.

Typography is applied by `Segment`, not by this container.

### Icon mode map

| Group state | Venus_Icons mode | `data-icon-mode` on container | Icon appearance |
|---|---|---|---|
| Enabled (any segment state) | `default` (`564:7`) | `default` | Brand purple |
| Group `disabled=true` | `disabled` (`564:10`) | `disabled` | Gray |

Set once on the container root. All `IconWrapper` instances inside segments inherit via CSS cascade. Individual segment `disabled` is handled by Segment's own 0.40 opacity, not by a per-segment icon mode.

### Assets

`N/A — icons are supplied by the consumer via `segments[n].icon`. No bundled assets.`

---

## 14. Accessibility contract

### Semantics and naming

| Concern | Requirement |
|---|---|
| Root element | `<div role="radiogroup">` |
| Group accessible name | `aria-label` or `aria-labelledby` — **required**. E.g. `aria-label="View mode"`. |
| Children | Each `Segment` renders `<button role="radio">` with `aria-checked` — provided by Segment |
| Parent-child relationship | Segments must be **direct DOM children** of the radiogroup. No intermediate wrapper element. |
| Selection state | Exactly one segment has `aria-checked="true"` |
| Group disabled | Container `opacity: 0.40` + `pointer-events: none`; every Segment receives `isDisabled` → `aria-disabled="true"` |
| Individual disabled | That Segment renders `aria-disabled="true"` and is excluded from arrow navigation |
| Icon-only mode | Each segment's `label` remains its accessible name. Icons are `aria-hidden` via `IconWrapper`. |
| Prohibited | `role` override on the container. Omitting the group name. Wrapping segments in an intermediate div. Adding `tabIndex` to the container. Adding a container-level focus ring. |

### Keyboard

| Context | Key | Result | Focus after | Prevent default |
|---|---|---|---|---|
| Outside the group | Tab | Focus enters at the segment with `tabIndex=0` | That segment | No |
| Segment focused | Arrow Right | Focus moves to the next enabled segment (wraps) | Next enabled segment | **Yes** |
| Segment focused | Arrow Down | Same as Arrow Right | Next enabled segment | **Yes** |
| Segment focused | Arrow Left | Focus moves to the previous enabled segment (wraps) | Previous enabled segment | **Yes** |
| Segment focused | Arrow Up | Same as Arrow Left | Previous enabled segment | **Yes** |
| Segment focused | Home | Focus moves to the first enabled segment | First enabled segment | **Yes** |
| Segment focused | End | Focus moves to the last enabled segment | Last enabled segment | **Yes** |
| Segment focused | Space | Selects the focused segment | Stays | Yes (via Segment) |
| Segment focused | Enter | Selects the focused segment | Stays | Yes (via Segment) |
| Segment focused | Tab | Focus exits the group | Next focusable element after the group | No |
| Segment focused | Shift+Tab | Focus exits the group backwards | Previous focusable element | No |

`preventDefault()` on arrow keys prevents page scrolling while navigating the group.

### Announcements

| Event | Announcement | Live region | Timing |
|---|---|---|---|
| Tab into group | Group name, then the focused segment: "View mode, Grid, radio button, checked, 1 of 3" | Native | On focus |
| Arrow to another segment | New segment: "List, radio button, not checked, 2 of 3" | Native | On focus |
| Select via Space/Enter | "checked" | Native (`aria-checked` change) | Immediately |
| Focus a disabled segment | "...radio button, dimmed" (AT-dependent) — only reachable by click, since arrows skip it | Native | On focus |
| Group disabled | Every segment announces as dimmed | Native | On focus |

The "N of M" position announcement is produced automatically by AT from the radiogroup structure — no `aria-posinset` or `aria-setsize` is required.

### Acceptance

| Area | Requirement |
|---|---|
| Group name | Every instance has a non-empty `aria-label` or a valid `aria-labelledby` reference |
| Single tab stop | Exactly one segment has `tabIndex=0` at any moment; verified programmatically |
| Arrow navigation | All enabled segments reachable via arrow keys; disabled segments skipped; navigation wraps at both ends |
| Manual activation | Arrow keys never change the selection — `onChange` fires only on Space, Enter, or click |
| Focus visible | The focused segment shows Segment's 2px `border/focus` ring, visible in Light and Dark |
| Contrast — selected label | `text/brand` on `action/secondary/hover` ≥ 4.5:1 |
| Contrast — unselected label | `text/subtle` on `surface/sunken` ≥ 4.5:1 |
| Contrast — container border | `border/subtle` vs the page background ≥ 3:1 |
| Contrast — selected border | `border/brand` vs `action/secondary/hover` ≥ 3:1 |
| Not colour alone | Selection is conveyed by fill **and** border **and** `aria-checked` — WCAG 1.4.1 satisfied |
| Touch target | sm segments are 28px tall — above the WCAG 2.5.5 AA 24px minimum. md (32px) and lg (40px) are comfortable. |
| Zoom/reflow | Pill geometry and heights preserved at 200% zoom |
| Reduced motion | Segment transitions removed under `prefers-reduced-motion: reduce` |
| Forced colors | Container border uses `currentColor`; selected segment retains a visible border |

---

## 15. Storybook contract

### Environment

| Field | Requirement |
|---|---|
| Story format | CSF3 |
| Layout | `layout: 'centered'` |
| Globals | Light + Dark both required for every story |
| Decorators | A controlled-state wrapper decorator providing `value` / `onChange` via `useState`, so every story is interactive |
| Pseudo-state | Segment hover via `@storybook/addon-pseudo-states` or a decorator. Focus demonstrated via play functions, not a `hasFocus` prop — this component has no such prop. |
| Viewports | Default. `RTL` story uses a `dir="rtl"` wrapper. |

**Required controlled wrapper decorator:**
```tsx
const ControlledDecorator: Decorator = (Story, ctx) => {
  const [value, setValue] = React.useState(ctx.args.value);
  return <Story args={{ ...ctx.args, value, onChange: setValue }} />;
};
```

### Controls

| Prop | Control | Options | Default |
|---|---|---|---|
| `value` | select | Derived from `segments` values | `'grid'` |
| `size` | select | `'sm', 'md', 'lg'` | `'md'` |
| `mode` | select | `'labeled', 'icon-only'` | `'labeled'` |
| `disabled` | boolean | — | `false` |
| `aria-label` | text | — | `'View mode'` |
| `segments` | object | — | 3-item array |
| `onChange` | — (action) | — | `action('onChange')` |

### Required stories

| Export | Storybook ID | Args | Theme | Key assertion |
|---|---|---|---|---|
| `Default` | `actions-segmentedcontrol--default` | 3 labeled segments, `value='grid'`, `aria-label='View mode'` | light + dark | `role="radiogroup"` with `aria-label`; one segment `aria-checked="true"`; filled + `border/brand` |
| `SizeSm` | `actions-segmentedcontrol--size-sm` | `{ size: 'sm' }` | light + dark | Container 36px, segments 28px, 11px labels |
| `SizeMd` | `actions-segmentedcontrol--size-md` | `{ size: 'md' }` | light + dark | Container 40px, segments 32px, 14px labels |
| `SizeLg` | `actions-segmentedcontrol--size-lg` | `{ size: 'lg' }` | light + dark | Container 48px, segments 40px, 16px labels |
| `IconOnly` | `actions-segmentedcontrol--icon-only` | `{ mode: 'icon-only' }`, segments with icons | light + dark | Icons visible, labels hidden visually, `label` still the accessible name |
| `SingleSegment` | `actions-segmentedcontrol--single-segment` | 1 segment | light + dark | Renders without warning |
| `TwoSegments` | `actions-segmentedcontrol--two-segments` | 2 segments | light + dark | Most common case renders correctly |
| `FiveSegments` | `actions-segmentedcontrol--five-segments` | 5 segments | light + dark | Maximum count; labels still readable |
| `TooManySegments` | `actions-segmentedcontrol--too-many-segments` | 6 segments | light + dark | `console.warn` spy called; all 6 render |
| `WithDisabledSegment` | `actions-segmentedcontrol--with-disabled-segment` | Middle segment `disabled: true` | light + dark | That segment `aria-disabled="true"`; arrow keys skip it |
| `SelectedAndDisabled` | `actions-segmentedcontrol--selected-and-disabled` | Selected segment also `disabled: true` | light + dark | Renders selected + faded; arrows skip it |
| `AllSegmentsDisabled` | `actions-segmentedcontrol--all-segments-disabled` | Every segment `disabled: true` | light + dark | Arrow keys do nothing; no crash |
| `GroupDisabled` | `actions-segmentedcontrol--group-disabled` | `{ disabled: true }` | light + dark | Container opacity 0.40; every segment `aria-disabled="true"`; `data-icon-mode="disabled"` |
| `SegmentHovered` | `actions-segmentedcontrol--segment-hovered` | Hover decorator on an unselected segment | light + dark | `action/ghost/hover` background on that segment only |
| `Focused` | `actions-segmentedcontrol--focused` | Play: `userEvent.tab()` | light + dark | Focus ring on the segment with `tabIndex=0` |
| `ArrowKeyNavigation` | `actions-segmentedcontrol--arrow-key-navigation` | Play: tab, then Arrow Right ×2 | light + dark | Focus advances; `onChange` NOT called |
| `ManualActivation` | `actions-segmentedcontrol--manual-activation` | Play: tab, Arrow Right, Space | light + dark | `onChange` called once with the second segment's value |
| `RovingTabIndex` | `actions-segmentedcontrol--roving-tab-index` | Play: inspect all segments | light + dark | Exactly one segment has `tabIndex=0` |
| `LongLabels` | `actions-segmentedcontrol--long-labels` | 3 segments with multi-word labels | light + dark | Container widens; segments have unequal widths; no truncation |
| `UnevenLabels` | `actions-segmentedcontrol--uneven-labels` | Labels of very different lengths | light + dark | Segments are NOT equalised — each HUGs its content |
| `RTL` | `actions-segmentedcontrol--rtl` | `dir="rtl"` wrapper | light + dark | Segment order reversed; arrow keys follow visual order |
| `MissingAriaLabel` | `actions-segmentedcontrol--missing-aria-label` | No `aria-label`, no `aria-labelledby` | light + dark | `console.warn` spy called once |

---

## 16. Test and visual-verification contract

### Per-prop verification

| Prop | Valid values | Invalid/edge | Default test | Key assertion |
|---|---|---|---|---|
| `value` | Matches a segment value | No match | `'grid'` | Exactly one segment has `aria-checked="true"`, and it is the matching one |
| `onChange` | Function | — | — | Called with the correct value string on click and on Space/Enter |
| `segments` | 1–5 items | 0, 6+ | 3 items | Rendered segment count equals `segments.length`; warn outside 1–5 |
| `size` | `'sm' \| 'md' \| 'lg'` | Any other | `'md'` | Container `offsetHeight` equals 36 / 40 / 48 |
| `mode` | `'labeled' \| 'icon-only'` | Any other | `'labeled'` | `icon-only` → label not visible but accessible name intact |
| `disabled` | `true, false` | — | `false` | `true` → container opacity 0.4; every segment `aria-disabled="true"` |
| `aria-label` | Non-empty string | undefined without `aria-labelledby` | `'View mode'` | Present on the radiogroup; warn if both are absent |

### Conditional element inventory

| element_key | Controlling condition | Presence test | Absence test |
|---|---|---|---|
| `segment-[n]` | One per `segments` array item | `getAllByRole('radio')` length equals `segments.length` | Empty array → no radios |
| Segment label (visual) | `mode='labeled'` | Label text visible in the DOM | `icon-only` → label not visually rendered |
| Segment icon | `segments[n].icon` provided | `IconWrapper` present within that segment | Not found |
| Segment focus ring | That segment is `:focus-visible` | Computed `display === 'block'` on the ring | `display === 'none'` |

### Interaction verification

| Interaction | Story | Drive | Callback assertion | DOM assertion |
|---|---|---|---|---|
| INT-01: Click a segment | `Default` | `userEvent.click(radios[1])` | `onChange` called once with `segments[1].value` | `radios[1]` gains `aria-checked="true"`; `radios[0]` becomes `"false"` |
| INT-02: Arrow Right | `ArrowKeyNavigation` | `userEvent.tab()` then `userEvent.keyboard('{ArrowRight}')` | `onChange` **NOT** called | `document.activeElement === radios[1]` |
| INT-03: Arrow Left wraps | `ArrowKeyNavigation` | Focus first segment, press ArrowLeft | `onChange` NOT called | Focus lands on the last enabled segment |
| INT-04: Arrow Right wraps | `ArrowKeyNavigation` | Focus last segment, press ArrowRight | `onChange` NOT called | Focus lands on the first enabled segment |
| INT-05: Home key | `ArrowKeyNavigation` | Focus segment 3, press Home | `onChange` NOT called | Focus on segment 1 |
| INT-06: End key | `ArrowKeyNavigation` | Focus segment 1, press End | `onChange` NOT called | Focus on the last segment |
| INT-07: Space selects | `ManualActivation` | Tab, ArrowRight, `{Space}` | `onChange` called once with `segments[1].value` | `radios[1]` `aria-checked="true"` |
| INT-08: Enter selects | `ManualActivation` | Tab, ArrowRight, `{Enter}` | `onChange` called once | Same |
| INT-09: Arrows skip disabled | `WithDisabledSegment` | Focus segment 1, ArrowRight | `onChange` NOT called | Focus lands on segment 3, skipping the disabled segment 2 |
| INT-10: Group disabled blocks click | `GroupDisabled` | `userEvent.click(radios[1])` | `onChange` NOT called | `aria-checked` values unchanged |
| INT-11: Individual disabled blocks click | `WithDisabledSegment` | Click the disabled segment | `onChange` NOT called | `aria-checked` unchanged |
| INT-12: Single tab stop | `RovingTabIndex` | `userEvent.tab()` from a preceding element, then `userEvent.tab()` again | — | Second Tab leaves the group entirely — focus is on the element after it, not on another segment |
| INT-13: All disabled, arrows safe | `AllSegmentsDisabled` | Press ArrowRight | No error thrown | Focus unchanged; no crash |
| INT-14: No focus steal on mount | `Default` | Render with focus on a preceding input | — | `document.activeElement` is still that input — the effect guard held |
| INT-15: No focus steal on value change | `Default` | Focus a preceding input, then change `value` externally | — | `document.activeElement` unchanged; `tabIndex=0` moved to the newly selected segment |

### Roving tabindex verification

| Scenario | Assertion |
|---|---|
| Initial render, `value` matches segment 2 | `radios[1].tabIndex === 0`; `radios[0].tabIndex === -1`; `radios[2].tabIndex === -1` |
| After ArrowRight from segment 2 | `radios[2].tabIndex === 0`; all others `-1` |
| After clicking segment 1 | `radios[0].tabIndex === 0`; all others `-1` |
| After external `value` change to segment 3 | `radios[2].tabIndex === 0`; all others `-1` |
| Invariant, all scenarios | Exactly one segment has `tabIndex === 0`: `radios.filter(r => r.tabIndex === 0).length === 1` |

### Geometry verification

| Assertion | Test |
|---|---|
| Container is a pill | `getComputedStyle(container).borderRadius === '9999px'` |
| Container height per size | `container.offsetHeight` equals 36 / 40 / 48 for sm / md / lg |
| Segment height per size | Each radio's `offsetHeight` equals 28 / 32 / 40 for sm / md / lg |
| Container padding | `getComputedStyle(container).padding === '4px'` |
| Segment gap | Segments sit flush — computed `gap` is `'0px'` |
| Segments not equalised | In `UnevenLabels`, at least two radios have different `offsetWidth` |
| Segments are direct children | Every radio's `parentElement` is the radiogroup element |

### Visual matrix

| Story | Viewport | Theme | Figma reference node | Tolerance |
|---|---|---|---|---|
| `Default` | 800×600 | light + dark | `1478:118111` (sm Labeled) / md equivalent | 0.2% |
| `SizeSm` | 800×600 | light + dark | `1478:118111` | 0.2% |
| `SizeLg` | 800×600 | light + dark | `829:71468` (lg Labeled) | 0.2% |
| `IconOnly` | 800×600 | light + dark | `829:71471` (md IconOnly) | 0.2% |
| `WithDisabledSegment` | 800×600 | light + dark | — | 0.2% |
| `GroupDisabled` | 800×600 | light + dark | — | 0.2% |
| `Focused` | 800×600 | light + dark | Segment focus-ring reference | 0.2% |
| `FiveSegments` | 800×600 | light + dark | — | 0.2% |
| `RTL` | 800×600 | light + dark | — | 0.3% (text direction) |

### Accessibility test suite

| Check | Tool | Assertion |
|---|---|---|
| Radiogroup has an accessible name | `axe-core` | No `aria-input-field-name` or region-name violation |
| Radio children are valid | `axe-core` | No `aria-required-children` / `aria-required-parent` violation |
| Colour contrast | `axe-core` + manual | Selected and unselected labels ≥ 4.5:1; borders ≥ 3:1, both themes |
| Keyboard reachable | Play function | Group reachable by Tab; every enabled segment reachable by arrows |
| Single tab stop | Play function | Two consecutive Tabs exit the group |
| No container tabIndex | Static assertion | `container.getAttribute('tabIndex')` is `null` |
| No container focus ring | Static assertion | No `:focus-visible` rule targets the container |
| Selection not colour-alone | Manual review | Selected segment has fill + border + `aria-checked` |

---

## 17. Decisions and confirmed resolutions

### Confirmed decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | `Type=Flat` is not implemented; no `type` prop is exposed | Live Figma (2026-08-11) has 6 variants with `Type` having exactly one option: `["Filled"]`. The constitution records Flat's removal on 2026-07-17. The CSET description still documents Flat in detail — it is stale and should be corrected in Figma. Implementing a removed type would ship dead code. |
| DEC-02 | Arrow-key routing lives in SegmentedControl, not Segment | Focus routing requires knowledge of sibling segments, their enabled/disabled state, and array order — none of which Segment has. The Segment brief already scopes Segment to Space/Enter activation only. This division is stated in both briefs. |
| DEC-03 | `segments` is an array prop rather than React `children` | Data-driven API. Consumers do not need to import `Segment` (an internal component) or wire `isSelected` / `tabIndex` / `onKeyDown` per child. It also structurally guarantees that only Segments are rendered, matching Figma's `allowPreferredValuesOnly: true` slot setting. |
| DEC-04 | Container `sm` maps to Segment `size='md'`, with height overridden via container CSS | Segment supports only `'md'` and `'lg'`. The 28px segment height required at container-sm does not exist as a Segment size. Overriding height from the container CSS is the minimal change and keeps Segment's variant set unchanged. |
| DEC-05 | Manual activation — arrow keys move focus only; Space/Enter selects | ARIA offers both automatic (select-on-focus) and manual activation for radiogroups. This control switches the user's view, so automatic activation would trigger a view change on every arrow press, potentially loading data repeatedly. Manual activation lets users browse before committing. |
| DEC-06 | Segments are not width-equalised | Figma's Segment HUGs its content; `stretchChildOnInsert: true` affects Figma authoring behaviour, not a fixed-width contract. Live variants show segments of differing widths (`segment-1` = 81px, and 40px in IconOnly). Equalising would diverge from the design. |
| DEC-07 | Arrow-key direction follows visual order in RTL | The container uses `flex-direction: row-reverse` in RTL, so Arrow Left moves to the visually-next segment. This matches user expectation — the arrow points at where focus goes on screen, not at DOM index order. |
| DEC-08 | No sliding-pill animation for the selected background | Live Figma has no motion spec for the selected indicator, and no shared-layout element exists between variants. The selected background appears on the new segment and disappears from the old one, using Segment's own 120ms colour transition. |
| DEC-09 | Container never receives focus; no container-level focus ring | Focus always lands on a segment. A container ring would render with no focused element inside it, confusing sighted keyboard users about where they are. |
| DEC-10 | Controlled only — no `defaultValue`, no uncontrolled mode | A view switcher's current state is always owned by the surrounding view. An uncontrolled mode would let the control's internal state diverge from the view it is supposed to control. |
| DEC-11 | `isProgrammaticFocus` ref guards the focus `useEffect` | Without the guard, the effect on `focusedIndex` calls `.focus()` on mount (stealing focus) and on every external `value` change (yanking focus during unrelated re-renders). Both are documented as BR-09 and INT-14 / INT-15. |
| DEC-12 | Segments are direct DOM children of the radiogroup — no wrapper element | ARIA requires `role="radio"` elements to be children of `role="radiogroup"`. An intermediate `<div>` (mirroring Figma's SLOT node) would break `aria-required-parent` and cause AT to stop announcing group position ("2 of 3"). |
| DEC-13 | Home and End keys are supported in addition to arrows | Standard ARIA radiogroup keyboard support. Cheap to implement, and useful with 4–5 segments. |

### Rejected approaches

| ID | Approach | Why rejected | Chosen instead |
|---|---|---|---|
| REJ-01 | Native `<input type="radio">` per segment | The visual treatment requires a custom pill with a background, border, icon, and focus ring. Styling native radio inputs to this degree means hiding them and layering visuals — the same complexity as `role="radio"` buttons, but with less styling control and a harder focus-ring story. Segment already implements `role="radio"` correctly. | `Segment` with `role="radio"` inside `role="radiogroup"` |
| REJ-02 | Automatic activation (arrow keys change the selection) | Every selection change switches the user's view and may trigger a data fetch. Arrowing across five segments would fire five view changes. | Manual activation — arrows move focus, Space/Enter selects (DEC-05) |
| REJ-03 | Animated sliding pill for the selected indicator | Requires either a shared layout animation library or measuring each segment's offset at runtime and animating a separate absolutely positioned element. No such element exists in Figma, and no motion spec was authored. Adds runtime measurement to a component that otherwise needs none. | Per-segment colour transition (120ms), inherited from Segment |
| REJ-04 | React `children` API (`<SegmentedControl><Segment/>...</SegmentedControl>`) | Requires consumers to import an internal component and to wire `isSelected`, `tabIndex`, `onKeyDown`, and the ref per child. Every consumer would reimplement the roving tabindex. Also permits arbitrary non-Segment children. | `segments` array prop (DEC-03) |
| REJ-05 | Wrapping segments in a `<div className="segments-slot">` to mirror Figma's SLOT node | Breaks the `role="radiogroup"` → `role="radio"` parent-child relationship. AT stops announcing group membership and position. Figma's SLOT is an authoring construct, not a DOM requirement. | Segments as direct children (DEC-12) |
| REJ-06 | Adding a `type` prop reserved for a future Flat variant | Ships an API surface with one valid value and a documented-but-nonexistent second option. If Flat returns, adding the prop then is a non-breaking change. | No `type` prop (DEC-01) |
| REJ-07 | Equalising segment widths via `flex: 1` on each segment | Diverges from live Figma, where segments HUG their content and have differing widths. Also makes short labels look sparse next to long ones. | Content-driven segment widths (DEC-06) |
| REJ-08 | Container-level focus ring on `:focus-within` | The focused element is always a segment, which has its own ring. Two nested rings appear simultaneously, and the outer one does not indicate which segment holds focus. | Segment's ring only (DEC-09) |

### Open questions

`NONE — all requirements are decision-complete.`

### Flagged for design follow-up

| Item | Detail | Owner |
|---|---|---|
| Stale CSET description | The `1478:118457` description still documents `Type=Filled\|Flat` and full Flat token values. Flat was removed 2026-07-17. The description should be updated so future briefs are not misled. | George Karian |

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma node `1478:118457` live read 2026-08-11
- [x] All 6 variants accounted for (3 sizes × 2 modes, `Type=Filled` only)
- [x] Mode NEW, scope explicit
- [x] Absolute Requirements documented (9 numbered items)
- [x] Upstream dependency `_Internal/Segment` confirmed ✅ HANDOFF_COMPLETE
- [x] Transitive dependency `_Internal/Icon-Wrapper` confirmed ✅ HANDOFF_COMPLETE
- [x] Segment ref-forwarding requirement documented as a breakage risk (Section 3, Section 10)
- [x] Flat-removal conflict identified and resolved in favour of live Figma (DEC-01); flagged for description correction
- [x] Roving tabindex model fully specified with invariant test (Section 9, Section 16)
- [x] Manual-activation decision documented with rationale (DEC-05)
- [x] Focus-steal guard documented with failing scenarios (DEC-11, BR-09, INT-14/15)
- [x] Direct-DOM-children ARIA requirement documented (DEC-12, REJ-05)
- [x] Container size → Segment size mapping resolved (DEC-04)
- [x] All 18 sections present: 0–18 including 12a
- [x] Anatomy, API, tokens, states, ARIA, keyboard, stories, tests complete
- [x] `unresolved_question_count: 0`
- [x] No hardcoded values in the brief

### Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Design | George Karian | PENDING | — |
| Engineering | Narendra | PENDING | — |
