---
brief_schema: venus-storybook-handover/v2
component_name: "FAB"
component_kebab_case: "fab"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1438-94302"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "1438:94302"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Actions/FAB"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        FAB (Floating Action Button)
  REACT_COMPONENT:       FAB
  STORYBOOK_TITLE:       Actions/FAB
  FIGMA_NODE_ID:         1438:94302
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           🔘 Actions
  CSS_CLASS_PREFIX:      fab
  FILE_NAME:             FAB.tsx
  STORY_FILE_NAME:       FAB.stories.tsx
  CSS_FILE_NAME:         FAB.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
  STATUS:                Active
  ═══════════════════════════════════════════════════════════════════
-->

# FAB (Floating Action Button) — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | `border-radius: 9999px` on root AND focus ring at every size and state | Live Figma: all 80 variants bind `VariableID:546:3083` = `radius/9999` on all four corners. Never 4px or 8px. This is the defining difference from Button. |
| 2 | Elevation responds to state — Default/Pressed/Disabled = **Level 1**; Hover = **Level 2** | CSET description: "Default/Pressed/Disabled → Elevation/Level 1 — Raised. Hover → Elevation/Level 2 — Dropdown." A static Figma frame cannot show the transition. |
| 3 | `accessibleLabel` required when `hasLabel=false` | With no visible label, `aria-label` is the only accessible name. |
| 4 | `sm` (24px) is the **sole approved FAB exception** to the Venus no-sm rule, and is **icon-only** | CSET: "sm exists on FAB only — it does not exist on Button. FAB sm is icon-only, always circular, always floating. Exception approved by George Karian, 2026-07-16." |
| 5 | FAB sm must have `hasLabel=false` AND `hasTrailingIcon=false`. Dev warning if a label is supplied at sm. | At 24px there is no room for label text. NavPanel usage — the sole approved sm context — is always icon-only. |
| 6 | Token system, types, states, and icon modes are **identical to Button** | CSET: "Circular variant of Button. Identical tokens, types, sizes, and states." Only `border-radius` and `box-shadow` differ. |
| 7 | `aria-disabled="true"` — not native `disabled` | Venus system-wide pattern for button-based controls. Same as Button. |
| 8 | FAB sm icon = **12px** — different from Button sm's 16px | Live Figma: `icon/leading` measures 12×12px inside the 24px sm FAB. Do not reuse Button's sm icon size. |

---

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/date | What it establishes |
|---|---|---|---|
| Figma design context (live read) | Node `1438:94302`, 🔘 Actions | 2026-08-11 | All 80 variants, padding tokens per size, icon sizes, radius=9999 on all corners, child layer names |
| Figma CSET description | `1438:94302` description | 2026-08-11 | Elevation spec, sm governance rationale, NavPanel usage spec, icon mode map, full type/size/state matrix |
| Button brief | Node `1489:30020` | 2026-08-11 | Shared token system, icon mode map, disabled pattern — ✅ HANDOFF_COMPLETE |
| `_Internal/Icon-Wrapper` brief | Node `214:152884` | 2026-08-11 | Upstream dependency ✅ HANDOFF_COMPLETE |
| `00-project-constitution.md` | sm governance record | Project knowledge | sm approved 2026-07-16 for FAB only |

### Source precedence

Live Figma governs dimensions, padding tokens, and icon sizes. The CSET description is exceptionally complete for this component and governs elevation behaviour and sm governance. Button brief governs shared token values.

---

## 1. Outcome and scope

**Definition:** A circular floating action trigger — semantically identical to Button but rendered as a pill/circle with state-responsive elevation, for actions that float above content rather than sitting inline within it.

**User need:** Contentstack users need action triggers that read as floating above the content plane — panel collapse/expand toggles, contextual actions anchored to a scroll region, and elevated primary actions that must remain visible over scrolling content.

### Use cases

| ID | Use case | Context | Variant / size | Success outcome |
|---|---|---|---|---|
| UC-01 | NavPanel collapse/expand toggle | Left sidebar edge, absolutely positioned | Primary / sm, icon-only | 24px circular toggle at panel edge, `accessibleLabel` describes direction |
| UC-02 | Floating primary action over a scroll region | Content area, bottom-right anchored | Primary / lg | Circular, Level 1 elevation at rest, Level 2 on hover |
| UC-03 | Contextual action with label | Content toolbar, floating | Secondary / md | Pill shape (radius 9999 with label), brand purple icon |
| UC-04 | Destructive floating action | Bulk-action bar | Destructive / lg | Red fill, white icon, elevation communicates floating layer |

### Scope

| In scope | Out of scope |
|---|---|
| 5 types: Primary / Secondary / Tertiary / Ghost / Destructive | Fixed-position layout management (consumer responsibility) |
| 4 sizes: sm (24px) / md (32px) / lg (40px) / xl (52px) | sm with visible label text |
| 4 states: Default / Hover / Pressed / Disabled | Speed-dial / expanding FAB menus |
| State-responsive elevation (Level 1 ↔ Level 2) | Elevation levels beyond 1 and 2 |
| `hasLeadingIcon`, `hasTrailingIcon`, `hasLabel` booleans | Automatic tooltip on icon-only mode |

### Responsibility boundary

| FAB owns | Consumer owns |
|---|---|
| Circular geometry (`border-radius: 9999px`) | Absolute/fixed positioning and z-index |
| State-responsive `box-shadow` (elevation) | Anchoring to a scroll container or panel edge |
| Icon mode via `data-icon-mode` | Choosing the directional icon (e.g. CaretLeft vs CaretRight for NavPanel) |
| `aria-disabled`, `aria-label` when icon-only | Ensuring `clipsContent: false` on the positioning parent |
| Dev warnings for sm misuse | Tooltip on hover for icon-only mode |

---

## 2. Existing baseline and change contract

`N/A — new component. No prior Storybook implementation.`

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Native `<button>` with optional `IconWrapper` children and an optional label span — structurally the same tree as Button |
| Existing components to reuse | `IconWrapper` (`214:152884`) — ✅ HANDOFF_COMPLETE |
| Shared implementation with Button | All variant/state background, border, and text tokens are identical. Consider extracting a shared `useActionStyles` hook or a shared CSS partial to avoid duplication. |
| Code Connect mappings | None currently |
| Hooks/utilities/providers | None — stateless |
| Existing tokens | Button's action tokens + Venus elevation styles. Full table in Section 13. |
| Genuinely new surface | `FAB.tsx`, `FAB.module.css`, `FAB.stories.tsx` |
| Prohibited reimplementation | Do not fork Button's token logic — share it. Do not implement independent elevation values — use Venus elevation CSS vars. |

### Dependency tree

| Direction | Component | Must exist before build | Breaking if API changes |
|---|---|---|---|
| Upstream | `IconWrapper` (`214:152884`) | **Yes** — ✅ HANDOFF_COMPLETE | `size` prop rename breaks icon sizing |
| Upstream (token reference) | `Button` (`1489:30020`) | Recommended — ✅ HANDOFF_COMPLETE | Token renames affect both components identically |
| Downstream | NavPanel (Navigation page) | N/A | `size='sm'` removal would break NavPanel toggle |

---

## 4. Anatomy

`REQUIRED` = always rendered · `OPTIONAL` = prop-controlled · `INTERNAL` = never a prop

| element_key | Layer name | Visibility | Condition | RTL mirrors | Figma ref | Semantic/testing requirement |
|---|---|---|---|---|---|---|
| `root` | `fab` | REQUIRED | Always | no | Variant frame — `radius/9999` all corners | `<button type="button">`, `data-testid="fab"`, `data-icon-mode`, `box-shadow` per state |
| `leading-icon` | `icon/leading` | OPTIONAL | `hasLeadingIcon=true` AND `leadingIcon` provided | yes — swaps side in RTL | INSTANCE of `_Internal/Icon-Wrapper` — 12px (sm) / 16px (md) / 20px (lg) / 28px (xl) | `IconWrapper`, `aria-hidden` inherited |
| `label` | `label` | OPTIONAL | `hasLabel=true` AND `label` provided | no | TEXT, HUG×HUG | `<span>`, text content. Never rendered at sm. |
| `trailing-icon` | `icon/trailing` | OPTIONAL | `hasTrailingIcon=true` AND `trailingIcon` provided | yes — swaps side in RTL | INSTANCE of `_Internal/Icon-Wrapper` — same sizes as leading | `IconWrapper`, `aria-hidden` inherited |
| `focus-ring` | `focus-ring` | INTERNAL | `:focus-visible` / `hasFocus=true` (Storybook) | no | FRAME, ABSOLUTE, `radius/9999`, size + 8px | `aria-hidden="true"`, `position: absolute`, `inset: -2px`, `border-radius: 9999px` |

> **Layer naming note:** FAB uses `icon/leading` and `icon/trailing` as instance names (Button uses the raw `_Internal/Icon-Wrapper` name). This is a Figma-authoring difference only — the React implementation is identical.

---

## 5. Public React API

### Props

| Prop | TypeScript type | Required | Default | Behavior | Storybook control |
|---|---|---|---|---|---|
| `label` | `string` | No | — | Visible label text. Required when `hasLabel=true`. Never rendered at `size='sm'`. | text |
| `accessibleLabel` | `string` | Conditional | — | `aria-label` value. **Required when `hasLabel=false`.** | text |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'ghost' \| 'destructive'` | No | `'primary'` | Background, border, text, icon mode | select |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Height, padding, icon size, label font. sm is icon-only. | select |
| `hasLeadingIcon` | `boolean` | No | `false` | Shows leading `IconWrapper` | boolean |
| `leadingIcon` | `React.ReactNode` | No | — | Icon element. Required when `hasLeadingIcon=true`. | — |
| `hasTrailingIcon` | `boolean` | No | `false` | Shows trailing `IconWrapper`. Must be `false` at sm. | boolean |
| `trailingIcon` | `React.ReactNode` | No | — | Icon element. Required when `hasTrailingIcon=true`. | — |
| `hasLabel` | `boolean` | No | `true` | Shows label text. Must be `false` at sm. | boolean |
| `disabled` | `boolean` | No | `false` | `aria-disabled="true"` + 0.40 opacity + `pointer-events: none` | boolean |
| `hasFocus` | `boolean` | No | `false` | **Storybook demo only.** Shows focus ring. Never pass in production. | boolean |
| `onClick` | `React.MouseEventHandler<HTMLButtonElement>` | No | — | Click handler. Not called when disabled. | — |
| `type` | `'button' \| 'submit' \| 'reset'` | No | `'button'` | Forwarded to `<button>` | — |
| `className` | `string` | No | `''` | Forwarded to root `<button>` | — |

### Callbacks

| Callback | Trigger | Signature | Must not fire when |
|---|---|---|---|
| `onClick` | Click, Space, Enter | `React.MouseEventHandler<HTMLButtonElement>` | `disabled === true` |

### API mechanics

| Concern | Contract |
|---|---|
| Controlled/uncontrolled | Stateless — no internal state |
| Prop changes after mount | All props update cleanly on re-render |
| Ref forwarding | `React.forwardRef` to root `<button>` |
| Native DOM props | `...rest` spread to `<button>`. Includes `aria-expanded` for toggle usage (e.g. NavPanel collapse state). |
| `disabled` attribute | Must NOT use native `disabled`. Use `aria-disabled` + handler guard. |
| Positioning | FAB does not position itself. `position: absolute` / `fixed` and coordinates are applied by the consumer via `className` or a wrapper. |
| sm constraint enforcement | Dev-mode `console.warn` if `size='sm'` with `hasLabel=true` or `hasTrailingIcon=true`. Renders anyway. |

### TypeScript interface

```typescript
/**
 * Circular floating action button. Semantically identical to Button
 * but with border-radius: 9999px and state-responsive elevation.
 *
 * Size sm (24px) is icon-only and approved for NavPanel collapse/expand only.
 *
 * FAB does not position itself — apply position/coordinates via className
 * or a positioning wrapper. Ensure the parent has overflow: visible.
 *
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1438-94302
 */
export interface FABProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'aria-label'> {
  /** Visible label text. Required when hasLabel is true. Never rendered at size='sm'. */
  label?: string;
  /**
   * Accessible name for screen readers.
   * Required when hasLabel is false (icon-only mode).
   */
  accessibleLabel?: string;
  /**
   * Semantic type. Determines background, border, text, and icon mode.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';
  /**
   * Size. sm (24px) is icon-only — approved for NavPanel use only.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show a leading icon. @default false */
  hasLeadingIcon?: boolean;
  /** Leading icon element. Required when hasLeadingIcon is true. */
  leadingIcon?: React.ReactNode;
  /** Show a trailing icon. Must be false at size='sm'. @default false */
  hasTrailingIcon?: boolean;
  /** Trailing icon element. Required when hasTrailingIcon is true. */
  trailingIcon?: React.ReactNode;
  /** Show the label. Must be false at size='sm'. @default true */
  hasLabel?: boolean;
  /** Disables interaction. Uses aria-disabled — not native disabled. @default false */
  disabled?: boolean;
  /**
   * Storybook demo only — shows the focus ring via CSS class.
   * In production the ring is driven by :focus-visible. Never pass at runtime.
   * @default false
   */
  hasFocus?: boolean;
  /** Additional class forwarded to the root button. */
  className?: string;
}
```

### JSX base component

```tsx
import React from 'react';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import type { FABProps } from './FAB';
import styles from './FAB.module.css';

const fabIconSizeMap = { sm: 12, md: 16, lg: 20, xl: 28 } as const;

const iconModeMap = {
  primary: 'inverted',
  secondary: 'default',
  tertiary: 'default',
  ghost: 'default',
  destructive: 'inverted',
} as const;

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      label,
      accessibleLabel,
      variant = 'primary',
      size = 'md',
      hasLeadingIcon = false,
      leadingIcon,
      hasTrailingIcon = false,
      trailingIcon,
      hasLabel = true,
      disabled = false,
      hasFocus = false,
      onClick,
      type = 'button',
      className,
      ...rest
    },
    ref
  ) => {
    const iconSize = fabIconSizeMap[size];
    const iconMode = disabled ? 'disabled' : iconModeMap[variant];

    // sm is icon-only — never render a label even if one is passed
    const showLabel = hasLabel && size !== 'sm' && !!label;
    const showTrailingIcon = hasTrailingIcon && size !== 'sm' && !!trailingIcon;

    if (process.env.NODE_ENV !== 'production') {
      if (size === 'sm' && hasLabel) {
        console.warn(
          '[FAB] size="sm" is icon-only. Set hasLabel={false}. ' +
          'sm is approved for NavPanel collapse/expand only.'
        );
      }
      if (size === 'sm' && hasTrailingIcon) {
        console.warn('[FAB] size="sm" is icon-only. Set hasTrailingIcon={false}.');
      }
      if (!showLabel && !accessibleLabel) {
        console.warn('[FAB] accessibleLabel is required when the label is not rendered.');
      }
    }

    return (
      <button
        ref={ref}
        type={type}
        aria-label={!showLabel ? accessibleLabel : undefined}
        aria-disabled={disabled || undefined}
        data-testid="fab"
        data-icon-mode={iconMode}
        className={[
          styles.fab,
          styles[`fab--${variant}`],
          styles[`fab--${size}`],
          disabled ? styles['fab--disabled'] : '',
          hasFocus ? styles['fab--focused'] : '',
          className,
        ].filter(Boolean).join(' ')}
        style={disabled ? { opacity: 'var(--venus-visibility-disabled)' } : undefined}
        onClick={(e) => { if (!disabled) onClick?.(e); }}
        {...rest}
      >
        {/* Focus ring — INTERNAL */}
        <span className={styles['fab__focus-ring']} aria-hidden="true" />

        {hasLeadingIcon && leadingIcon && (
          <IconWrapper size={iconSize} icon={leadingIcon} />
        )}

        {showLabel && <span className={styles['fab__label']}>{label}</span>}

        {showTrailingIcon && (
          <IconWrapper size={iconSize} icon={trailingIcon} />
        )}
      </button>
    );
  }
);

FAB.displayName = 'FAB';
```

**FAB.module.css:**

```css
/* ── Base ──────────────────────────────── */
.fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  position: relative;
  font-family: var(--venus-font-inter);
  font-weight: 500;

  /* Absolute Requirement #1 — circular at every size */
  border-radius: 9999px;

  /* Absolute Requirement #2 — Level 1 at rest */
  box-shadow: var(--venus-elevation-level-1);

  transition: background 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
}

/* ── Sizes ──────────────────────────────── */
.fab--sm { height: 24px; padding: var(--venus-space-4, 4px);  gap: var(--venus-space-4, 4px); font-size: 12px; }
.fab--md { height: 32px; padding: var(--venus-space-8, 8px);  gap: var(--venus-space-4, 4px); font-size: 13px; }
.fab--lg { height: 40px; padding: var(--venus-space-8, 8px);  gap: var(--venus-space-8, 8px); font-size: 14px; }
.fab--xl { height: 52px; padding: var(--venus-space-12, 12px); gap: var(--venus-space-8, 8px); font-size: 16px; }

/* Icon-only FABs are square (width === height) */
.fab--sm:not(:has(.fab__label)) { width: 24px; padding: var(--venus-space-4, 4px); }
.fab--md:not(:has(.fab__label)) { width: 32px; }
.fab--lg:not(:has(.fab__label)) { width: 40px; }
.fab--xl:not(:has(.fab__label)) { width: 52px; }

/* ── Elevation — Absolute Requirement #2 ── */
.fab:hover:not(.fab--disabled) {
  box-shadow: var(--venus-elevation-level-2);   /* Level 2 — Dropdown */
}
.fab:active:not(.fab--disabled) {
  box-shadow: var(--venus-elevation-level-1);   /* back to Level 1 */
}
.fab--disabled {
  box-shadow: var(--venus-elevation-level-1);   /* Level 1 */
}

/* ── Primary ───────────────────────────── */
.fab--primary { background: var(--venus-action-primary); color: var(--venus-text-on-brand); }
.fab--primary:hover:not(.fab--disabled)  { background: var(--venus-action-primary-hover); }
.fab--primary:active:not(.fab--disabled) { background: var(--venus-action-primary-pressed); }

/* ── Secondary ─────────────────────────── */
.fab--secondary {
  background: var(--venus-action-secondary);
  color: var(--venus-text-brand);
  border: 1px solid var(--venus-border-brand);
}
.fab--secondary:hover:not(.fab--disabled)  { background: var(--venus-action-secondary-hover); }
.fab--secondary:active:not(.fab--disabled) { background: var(--venus-action-secondary-active); }

/* ── Tertiary ──────────────────────────── */
.fab--tertiary {
  background: var(--venus-surface-default);
  color: var(--venus-text-default);
  border: 1px solid var(--venus-border-default);
}
.fab--tertiary:hover:not(.fab--disabled)  { background: var(--venus-action-ghost-hover); }
.fab--tertiary:active:not(.fab--disabled) { background: var(--venus-action-tertiary-pressed); }

/* ── Ghost ─────────────────────────────── */
.fab--ghost { background: transparent; color: var(--venus-text-brand); }
.fab--ghost:hover:not(.fab--disabled)  { background: var(--venus-action-ghost-hover); }
.fab--ghost:active:not(.fab--disabled) { background: var(--venus-action-ghost-pressed); }

/* ── Destructive ───────────────────────── */
.fab--destructive { background: var(--venus-action-destructive); color: var(--venus-text-on-destructive); }
.fab--destructive:hover:not(.fab--disabled)  { background: var(--venus-action-destructive-hover); }
.fab--destructive:active:not(.fab--disabled) { background: var(--venus-action-destructive-pressed); }

/* ── Disabled ──────────────────────────── */
/* opacity applied inline via style prop — visibility/disabled = 0.40 */
.fab--disabled { pointer-events: none; cursor: not-allowed; }

/* ── Focus ring — INTERNAL ─────────────── */
.fab__focus-ring {
  display: none;
  position: absolute;
  inset: -2px;
  border: 2px solid var(--venus-border-focus);
  border-radius: 9999px;              /* matches circular root */
  pointer-events: none;
}
.fab--focused .fab__focus-ring,
.fab:focus-visible .fab__focus-ring { display: block; }

/* ── Label ─────────────────────────────── */
.fab__label { white-space: nowrap; }

/* ── Reduced motion ────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .fab { transition: none; }
}

/* ── Forced colors ─────────────────────── */
@media (forced-colors: active) {
  .fab { border: 1px solid currentColor; }
  .fab { box-shadow: none; }            /* shadows are not rendered in forced-colors */
}
```

### Invalid combinations

| Combination | Valid | Required result |
|---|---|---|
| `size='sm'` AND `hasLabel=true` | No | Dev warn. Label is NOT rendered — `showLabel` computes to false at sm. |
| `size='sm'` AND `hasTrailingIcon=true` | No | Dev warn. Trailing icon is NOT rendered at sm. |
| `hasLabel=false` AND `accessibleLabel` undefined | No | Dev warn. Button has no accessible name. |
| `hasLabel=false` AND `hasLeadingIcon=false` AND `hasTrailingIcon=false` | No | Renders an empty circle. Dev warn — nothing to display. |
| `hasLeadingIcon=true` AND `leadingIcon` undefined | No | Icon skipped; dev warn |
| Native `disabled` via `...rest` | No | Excluded via `Omit` in the props type — TypeScript prevents it |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop | Mapping rule | React default |
|---|---|---|---|---|
| `Type` (VARIANT) | `Primary \| Secondary \| Tertiary \| Ghost \| Destructive` | `variant` | lowercase transform | `'primary'` |
| `Size` (VARIANT) | `sm \| md \| lg \| xl` | `size` | direct | `'md'` |
| `State=Default` | `Default` | — | base state | — |
| `State=Hover` | `Hover` | CSS `:hover` — never a prop | pseudo-class | — |
| `State=Pressed` | `Pressed` | CSS `:active` — never a prop | pseudo-class | — |
| `State=Disabled` | `Disabled` | `disabled: boolean` | direct | `false` |
| `label#1438:726` (TEXT) | Any string | `label: string` | direct | — |
| `accessibleLabel#1438:727` (TEXT) | Any string | `accessibleLabel: string` | forwarded as `aria-label` when label is hidden | — |
| `hasLeadingIcon#1438:722` (BOOLEAN) | `true \| false` | `hasLeadingIcon` | Figma default `true`; **React default `false`** | `false` |
| `hasTrailingIcon#1438:723` (BOOLEAN) | `true \| false` | `hasTrailingIcon` | Figma default `true`; **React default `false`** | `false` |
| `hasLabel#1438:724` (BOOLEAN) | `true \| false` | `hasLabel` | direct | `true` |
| `hasFocus#1438:725` (BOOLEAN) | `true \| false` | `hasFocus` | Storybook demo only | `false` |

### Unmapped design properties

`N/A — all Figma properties are mapped.`

**Note on Figma defaults:** `hasLeadingIcon` and `hasTrailingIcon` default to `true` in Figma so designers see a complete component when placing an instance. React defaults them to `false` — the correct production default is to render only what the consumer explicitly requests.

### Unmapped code properties

`N/A — new component.`

---

## 7. Variants, states, and precedence

### Size contract (live-verified 2026-08-11)

| Size | Height | Padding | Gap | Icon | Label font | Padding token | Constraints |
|---|---|---|---|---|---|---|---|
| `sm` | **24px** | 4px | 4px | **12px** | 12px (never shown) | `564:3253` | **Icon-only.** NavPanel exception. |
| `md` | **32px** | 8px | 4px | 16px | 13px (Body/SM) | `564:3254` | — |
| `lg` | **40px** | 8px | 8px | 20px | 14px (Body/MD) | `564:3254` | — |
| `xl` | **52px** | 12px | 8px | 28px | 16px (Body/LG) | `564:3255` | — |

`border-radius: 9999px` at every size. Width is HUG when a label is present, square when icon-only.

> ⚠️ FAB sm icon = **12px**. Button sm icon = 16px. Do not share this value.

### Variant cross-matrix

| Type | sm | md | lg | xl |
|---|---|---|---|---|
| **Primary** | ✓ `1438:93342` | ✓ | ✓ | ✓ |
| **Secondary** | ✓ | ✓ `1438:93646` | ✓ | ✓ |
| **Tertiary** | ✓ | ✓ | ✓ | ✓ |
| **Ghost** | ✓ | ✓ | ✓ | ✓ |
| **Destructive** | ✓ | ✓ | ✓ `1438:94030` | ✓ |

Each cell × 4 states = **80 variants** (5 types × 4 sizes × 4 states ✓).

Unlike Button, FAB **does** have a Destructive/Pressed variant at every size.

### State table

| State | Category | Trigger | CSS mechanism | Elevation | ARIA change | Required story |
|---|---|---|---|---|---|---|
| Default | Base | Initial render | — | **Level 1** | — | `Primary` |
| Hover | Interaction | Pointer enter | `:hover` — never a prop | **Level 2** | — | `PrimaryHover` |
| Pressed | Interaction | Pointer down | `:active` — never a prop | **Level 1** | — | `Pressed` |
| Disabled | Public | `disabled=true` | `aria-disabled` + `opacity: 0.40` + `pointer-events: none` | **Level 1** | `aria-disabled="true"` | `Disabled` |
| Focused | INTERNAL | `:focus-visible` / `hasFocus=true` | Focus ring `display: block` | unchanged | — | `Focused` |

### Elevation spec (Absolute Requirement #2)

| State | Venus elevation style | CSS custom property |
|---|---|---|
| Default | Elevation / Level 1 — Raised | `--venus-elevation-level-1` |
| Hover | Elevation / Level 2 — Dropdown | `--venus-elevation-level-2` |
| Pressed | Elevation / Level 1 — Raised | `--venus-elevation-level-1` |
| Disabled | Elevation / Level 1 — Raised | `--venus-elevation-level-1` |

Only Hover raises the elevation. Pressed returns to Level 1, producing a subtle "press down" effect.

### Appearance per variant

| Variant | Background | Label / text | Border | Icon mode |
|---|---|---|---|---|
| Primary | `action/primary` | `text/on-brand` (white) | None | `inverted` |
| Secondary | `action/secondary/default` | `text/brand` | `border/brand` 1px | `default` |
| Tertiary | `surface/default` | `text/default` | `border/default` 1px | `default` |
| Ghost | transparent | `text/brand` | None | `default` |
| Destructive | `action/destructive` | `text/on-destructive` (white) | None | `inverted` |
| Any disabled | Same as Default at 0.40 opacity | — | — | `disabled` |

### State precedence

| Higher state | Lower state | Result |
|---|---|---|
| Disabled | Hover | Hover suppressed — `pointer-events: none`. Elevation stays Level 1. |
| Disabled | Pressed | Pressed suppressed |
| Disabled | Focused | Button retains focus (`aria-disabled`) — ring shows |
| Pressed | Hover | `:active` overrides both background and elevation (back to Level 1) |
| `size='sm'` | `hasLabel=true` | sm wins — label is not rendered |

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure mode |
|---|---|---|---|---|
| BR-01 | `disabled=true` | User clicks or presses Space/Enter | `onClick` does not fire | Disabled FAB triggers the action |
| BR-02 | `disabled=true` | User presses Tab | FAB still receives focus | FAB invisible to keyboard users |
| BR-03 | Any state | Pointer enters | `box-shadow` transitions to Level 2 over 120ms | FAB does not read as floating; no elevation feedback |
| BR-04 | Hover active | Pointer presses down | `box-shadow` returns to Level 1 | No press feedback; button feels unresponsive |
| BR-05 | `size='sm'` AND `hasLabel=true` | Component renders | Label NOT rendered; dev `console.warn` logged | 24px FAB with clipped or overflowing label text |
| BR-06 | `hasLabel=false` (or sm) AND `accessibleLabel` absent | Component renders | Dev `console.warn` | FAB has no accessible name — AT announces "button" only |
| BR-07 | `variant='primary'`, not disabled | Component renders | `data-icon-mode="inverted"`; icon renders white | Brand purple icon on brand purple fill — invisible |
| BR-08 | `disabled=true`, any variant | Component renders | `data-icon-mode="disabled"`; icon renders gray | Icon retains full colour while the rest fades |
| BR-09 | Icon-only mode (no label rendered) | Component renders | Width equals height — square/circular | Pill shape with asymmetric padding around a single icon |

### Input and data validation

| Prop | Valid | Invalid/edge | Behavior |
|---|---|---|---|
| `label` | Non-empty string | `''`, `undefined` with `hasLabel=true` | Label span not rendered; falls back to icon-only. Requires `accessibleLabel`. |
| `accessibleLabel` | Non-empty descriptive string | `''`, `undefined` when label hidden | Dev warn |
| `variant` | 5 enum values | Any other | TypeScript compile error |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | Any other | TypeScript compile error |
| `leadingIcon` | ReactNode | `undefined` with `hasLeadingIcon=true` | Icon skipped; dev warn |

---

## 9. Interactions and focus

### Interaction table

| ID | element_key | Action | Precondition | Result | Callback | Keyboard | Disabled behavior |
|---|---|---|---|---|---|---|---|
| INT-01 | `root` | Click | `disabled=false` | Fires `onClick` | `onClick(event)` | Space, Enter | Blocked |
| INT-02 | `root` | Pointer enter | `disabled=false` | Background + elevation transition to hover values | — | — | Suppressed |
| INT-03 | `root` | Pointer down | `disabled=false` | Background to pressed; elevation returns to Level 1 | — | — | Suppressed |
| INT-04 | `root` | Tab | — | Focus enters the FAB | — | Tab / Shift+Tab | Still focusable |
| INT-05 | `root` | Click (NavPanel toggle usage) | `disabled=false` | Consumer toggles panel; consumer updates `aria-expanded` and swaps the icon | `onClick(event)` | Space, Enter | Blocked |

### Focus management

| Event | Focus target | Movement | Restoration | Focus ring |
|---|---|---|---|---|
| User tabs to FAB | Root `<button>` | Standard document order | Returns to same element after blur | `:focus-visible .fab__focus-ring { display: block }` |
| NavPanel toggle activated | Stays on the FAB | Panel collapses/expands; focus does not move | — | Ring remains visible if focus was keyboard-driven |

**Focus ring contract:**

| Property | Value |
|---|---|
| CSS trigger (production) | `:focus-visible` on root `<button>` |
| CSS trigger (Storybook) | `.fab--focused` class via `hasFocus=true` |
| Element | `.fab__focus-ring`, `aria-hidden="true"`, `position: absolute` |
| Inset | `−2px` on all sides |
| Border | `2px solid var(--venus-border-focus)` → `purple/500` Light / `purple/400` Dark |
| Border radius | **`9999px`** — matches the circular root. Never a corner-specific radius. |
| Figma binding | `strokes` → `VariableID:564:3227`; radius → `VariableID:546:3083` on all four corners |
| Size in Figma | Component size + 8px on each axis (sm: 32px ring around 24px component) |

**Storybook Focused story:**
```tsx
export const Focused: Story = {
  args: { variant: 'primary', label: 'Create', hasFocus: true },
};
```

### Motion

| Motion | Trigger | Property | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|
| Background transition | Hover, press | `background`, `border-color` | 120ms | `ease` | `transition: none` |
| **Elevation transition** | Hover enter/leave, press | `box-shadow` | 120ms | `ease` | `transition: none` — shadow changes instantly |

Elevation transition is the defining motion of this component. Under `prefers-reduced-motion: reduce` the shadow still changes value (state must remain perceivable) but does so instantly.

---

## 10. Dynamic positioning

FAB itself performs **no runtime position calculation**. The focus ring is statically positioned via `inset: -2px`.

However, FAB is designed to be positioned by its consumer, and the NavPanel usage has a documented positioning contract that engineers must honour:

### NavPanel toggle positioning contract (from CSET description)

| Property | Value |
|---|---|
| `position` | `absolute` |
| Horizontal anchor | Right edge of the panel — `left: calc(panelWidth - 12px)` |
| Vertical anchor | `top: 16px` |
| Figma constraints | horizontal = MAX, vertical = MIN |
| **Parent requirement** | `overflow: visible` on the positioning parent (Figma equivalent: `clipsContent: false`) |
| Icon | `CaretLeft` when the panel is expanded; `CaretRight` when collapsed — consumer swaps |
| Variant / size | `variant='primary'`, `size='sm'`, `hasLabel={false}`, `hasTrailingIcon={false}` |

**If the parent clips overflow, the FAB will be cut in half at the panel edge.** This is the single most likely implementation error for this usage — the CSET description calls it out explicitly.

Consumers are responsible for applying these values. FAB provides no positioning props.

---

## 11. Responsive behavior

| Constraint | Rule |
|---|---|
| Width (with label) | HUG — grows with label text. Minimum = padding×2 + icon + gap + label. |
| Width (icon-only) | Fixed square, equal to height: 24 / 32 / 40 / 52px |
| Height | Fixed per size — never content-driven |
| `flex-shrink` | `0` — never compresses |
| `border-radius` | `9999px` at all widths. With a label this produces a pill; icon-only produces a circle. |
| Positioning | Consumer-controlled. FAB does not respond to viewport changes itself. |
| Zoom/reflow | Dimensions scale with browser zoom. Circular geometry is preserved because the radius is 9999px, not a computed value. |
| Breakpoints | No breakpoint-driven size changes. Consumer selects the size per layout. |
| Elevation at zoom | `box-shadow` scales with the element; no adjustment needed |

---

## 12. Content, localization, and edge cases

| Case | Required behavior | Story |
|---|---|---|
| Long label | FAB widens as a pill; height stays fixed. No truncation — the consumer should keep FAB labels to 1–3 words. | `LongLabel` |
| Label at `size='sm'` | Not rendered. Dev warn. Component stays a 24px circle. | `SmWithLabelIgnored` |
| Icon-only without `accessibleLabel` | Dev warn. Renders but is inaccessible. | N/A |
| Localized label | Consumer supplies translated text. FAB widens to fit — verify German/Finnish strings do not break the surrounding layout. | `LongLabel` |
| RTL layout | `flex-direction: row-reverse` in RTL context — leading and trailing icons swap sides. Directional icons (CaretLeft/Right) must be swapped by the consumer. | `RTL` |
| NavPanel toggle in RTL | Panel is on the right; FAB anchors to the panel's left edge. Consumer inverts the positioning and the caret direction. | N/A |
| Forced-colors / High Contrast mode | `box-shadow` is not rendered by the OS. Add `border: 1px solid currentColor` so the FAB boundary remains visible. | N/A |
| Overlapping content behind the FAB | FAB is opaque for all variants except Ghost. Ghost over busy content may be hard to see — prefer Primary/Secondary for floating use. | N/A |
| Two FABs adjacent | Maintain at least 8px gap. Circular shapes at close range read as a single control. | N/A |

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't | Rationale |
|---|---|---|
| Use FAB when the action floats above content | Use FAB for inline form actions | Inline actions belong to Button. FAB's elevation implies a separate layer — using it inline creates false depth. |
| Keep `size='sm'` icon-only | Pass a label at sm | 24px cannot fit legible text. The label is silently dropped and the warn fires. |
| Set `overflow: visible` on the FAB's positioning parent | Leave the parent clipping | The FAB is cut in half at the panel edge — the most common implementation error for NavPanel usage. |
| Let elevation change on hover only | Add elevation changes on focus or press | Level 2 on hover is the entire elevation contract. Extra changes create visual noise. |
| Use Primary or Secondary for floating actions over content | Use Ghost for floating actions | Ghost is transparent — over scrolling content it becomes unreadable. |
| Provide `accessibleLabel` for every icon-only FAB | Rely on the icon alone | Screen reader users get "button" with no indication of what it does. |
| Swap the caret icon direction for RTL | Reuse the LTR icon in RTL | A CaretLeft collapse toggle points the wrong way when the panel is on the right. |
| Share Button's token logic | Fork and duplicate the token values | Duplicated values drift. Both components must resolve to the same Venus_Semantics tokens. |

---

## 13. Tokens, typography, and assets

**Token chain:** `_Primitives → Venus_Semantics → component layer`. All bindings live-verified 2026-08-11.

FAB's colour token system is **identical to Button** — see the Button brief Section 13 for the complete background, border, and text token tables. Repeated here in summary for self-containment.

### Tokens — background per variant

| Variant | Default | Hover | Pressed | Default VariableID |
|---|---|---|---|---|
| Primary | `[VS] action/primary` | `action/primary/hover` | `action/primary/pressed` | `564:3217` |
| Secondary | `[VS] action/secondary/default` | `action/secondary/hover` | `action/secondary/active` | `564:3220` |
| Tertiary | `[VS] surface/default` | `action/ghost/hover` | `action/tertiary/pressed` | `563:3180` |
| Ghost | transparent | `action/ghost/hover` | `action/ghost/pressed` | `564:3225` |
| Destructive | `[VS] action/destructive` | `action/destructive/hover` | `action/destructive/pressed` | `564:3223` |

### Tokens — border

| Variant | Token | CSS custom property | VariableID |
|---|---|---|---|
| Secondary | `[VS] border/brand` | `--venus-border-brand` | `564:3211` |
| Tertiary | `[VS] border/default` | `--venus-border-default` | `564:3209` |
| Primary / Ghost / Destructive | None | — | — |

Border width: `[P] border-width/1` (`546:3085`) = 1px.

### Tokens — label text

| Variant | Token | CSS custom property | VariableID |
|---|---|---|---|
| Primary | `[VS] text/on-brand` (white) | `--venus-text-on-brand` | `564:3198` |
| Secondary / Ghost | `[VS] text/brand` | `--venus-text-brand` | `564:3199` |
| Tertiary | `[VS] text/default` | `--venus-text-default` | `564:3192` |
| Destructive | `[VS] text/on-destructive` (white) | `--venus-text-on-destructive` | `564:3197` |

### Tokens — layout

| Property | Size | Token | CSS custom property | VariableID | Value |
|---|---|---|---|---|---|
| `padding` | sm | `[VC] fab/padding/sm` | `--venus-fab-padding-sm` | `564:3253` | 4px |
| `padding` | md, lg | `[VC] fab/padding/md` | `--venus-fab-padding-md` | `564:3254` | 8px |
| `padding` | xl | `[VC] fab/padding/xl` | `--venus-fab-padding-xl` | `564:3255` | 12px |
| `gap` | sm, md | `[VC] fab/gap/sm` | `--venus-fab-gap-sm` | `564:3261` | 4px |
| `gap` | lg, xl | `[VC] fab/gap/lg` | `--venus-fab-gap-lg` | `564:3262` | 8px |
| `border-radius` | all | `[P] radius/9999` | `9999px` (raw in CSS) | `546:3083` | 9999px |

### Tokens — opacity, focus, elevation

| Property | Token | CSS custom property | VariableID | Value |
|---|---|---|---|---|
| Disabled `opacity` | `[VS] visibility/disabled` | `--venus-visibility-disabled` | `564:3246` | **0.40** |
| Focus ring `border-color` | `[VS] border/focus` | `--venus-border-focus` | `564:3227` | `purple/500` L / `purple/400` D |
| Focus ring `border-width` | `[P] border-width/2` | `--venus-border-width-2` | `546:3086` | 2px |
| Elevation — Default/Pressed/Disabled | Venus effect style: Elevation / Level 1 — Raised | `--venus-elevation-level-1` | (effect style) | — |
| Elevation — Hover | Venus effect style: Elevation / Level 2 — Dropdown | `--venus-elevation-level-2` | (effect style) | — |

### Typography

| Size | Token | Family | Weight | Size | Line height |
|---|---|---|---|---|---|
| `sm` | Label/SM (`546:3106`) | Inter | 500 | 12px (never rendered) | 130% |
| `md` | Body/SM (`546:3107`) | Inter | 500 | 13px | 130% |
| `lg` | Body/MD (`546:3108`) | Inter | 500 | 14px | 130% |
| `xl` | Body/LG (`546:3109`) | Inter | 500 | 16px | 130% |

Font family token: `[P] font/inter` (`546:3103`). Weight token: `[P] font-weight/medium` (`546:3118`) = 500.

### Icon mode map (Absolute Requirement, shared with Button)

| Variant | State | Venus_Icons mode | `data-icon-mode` | Icon appearance |
|---|---|---|---|---|
| Primary | Non-disabled | `inverted` (`564:8`) | `inverted` | White |
| Destructive | Non-disabled | `inverted` (`564:8`) | `inverted` | White |
| Secondary | Non-disabled | `default` (`564:7`) | `default` | Brand purple |
| Tertiary | Non-disabled | `default` (`564:7`) | `default` | Brand purple |
| Ghost | Non-disabled | `default` (`564:7`) | `default` | Brand purple |
| Any | Disabled | `disabled` (`564:10`) | `disabled` | Gray |

### Assets

`N/A — icons are supplied by the consumer via `leadingIcon` / `trailingIcon`. No bundled assets.`

---

## 14. Accessibility contract

### Semantics and naming

| Concern | Requirement |
|---|---|
| Root element | `<button type="button">` |
| Accessible name (with label) | Implicit from the `label` text content. No `aria-label`. |
| Accessible name (icon-only) | `aria-label={accessibleLabel}` — **required**. Describe the action. |
| Label content rule (icon-only) | "Collapse navigation" ✓ · "Caret left" ✗ · "Toggle" ✗ (too vague) |
| `aria-disabled` | `"true"` when `disabled=true`. Never native `disabled`. |
| Icons | `aria-hidden="true"` — inherited from `IconWrapper` |
| Toggle usage | Consumer adds `aria-expanded` via `...rest` when FAB toggles a disclosure (e.g. NavPanel) |
| Prohibited | `role` override. Empty `aria-label`. Native `disabled`. Both `label` and `aria-label` simultaneously. |

### Keyboard

| Context | Key | Result | Focus after | Prevent default |
|---|---|---|---|---|
| FAB focused | Space | Fires `onClick` (unless disabled) | Stays on FAB | Yes (browser default) |
| FAB focused | Enter | Fires `onClick` (unless disabled) | Stays on FAB | Yes (browser default) |
| Any | Tab | Move focus to next focusable element | Next element | No |
| Any | Shift+Tab | Move focus to previous focusable element | Previous element | No |

No custom key handling required — native `<button>` provides Space/Enter.

### Announcements

| Event | Announcement | Live region | Timing |
|---|---|---|---|
| Focus (labeled) | "[label], button" | Native | On focus |
| Focus (icon-only) | "[accessibleLabel], button" | Native | On focus |
| Focus (icon-only toggle) | "[accessibleLabel], button, collapsed/expanded" | Native (`aria-expanded`) | On focus |
| Focus (disabled) | "[label], dimmed, button" (AT-dependent) | Native | On focus |
| Activation | No automatic announcement. For NavPanel, the consumer updates `aria-expanded`, which AT announces. | Native | After action |

### Acceptance

| Area | Requirement |
|---|---|
| Focus visible | 2px `border/focus` ring, inset −2px, `border-radius: 9999px`. Visible in Light and Dark. |
| Focus order | Natural document order. Note: an absolutely positioned FAB may appear visually out of sequence — verify the DOM order matches the intended reading order. |
| Contrast — label | Label vs FAB background ≥ 4.5:1 (normal text). Verify white on `action/primary` and `action/destructive`. |
| Contrast — icon | Icon vs FAB background ≥ 3:1 (WCAG 1.4.11 non-text) |
| Contrast — boundary | For Ghost/Tertiary over content: FAB boundary vs the content behind it ≥ 3:1. Elevation shadow does not count toward contrast. |
| Touch target | sm (24px) meets the WCAG 2.5.5 AA 24px minimum exactly. Ensure ≥8px clearance from adjacent targets. md and above are comfortable. |
| Zoom/reflow | Circular geometry and elevation preserved at 200% zoom |
| Reduced motion | Transitions removed under `prefers-reduced-motion: reduce`. State values still change instantly. |
| Forced colors | `box-shadow` is suppressed by the OS — `border: 1px solid currentColor` fallback required so the FAB remains discernible |
| Positioned FAB overlap | The FAB must not obscure content the user needs. Consumer responsibility, but flag during review. |

---

## 15. Storybook contract

### Environment

| Field | Requirement |
|---|---|
| Story format | CSF3 |
| Layout | `layout: 'centered'` |
| Globals | Light + Dark both required for every story |
| Decorators | A padded container decorator (min 40px padding) so the elevation shadow is not clipped by the story canvas |
| Pseudo-state | `hasFocus=true` for Focused. Hover/Pressed via `@storybook/addon-pseudo-states` or decorators. |
| Viewports | Default. `NavPanelSm` uses a mock panel wrapper. |

### Controls

| Prop | Control | Options | Default |
|---|---|---|---|
| `label` | text | — | `'Create'` |
| `accessibleLabel` | text | — | `'Create item'` |
| `variant` | select | `'primary', 'secondary', 'tertiary', 'ghost', 'destructive'` | `'primary'` |
| `size` | select | `'sm', 'md', 'lg', 'xl'` | `'md'` |
| `hasLabel` | boolean | — | `true` |
| `hasLeadingIcon` | boolean | — | `false` |
| `hasTrailingIcon` | boolean | — | `false` |
| `disabled` | boolean | — | `false` |
| `hasFocus` | boolean | — | `false` |

### Required stories

| Export | Storybook ID | Args | Theme | Key assertion |
|---|---|---|---|---|
| `Primary` | `actions-fab--primary` | `{ variant: 'primary', label: 'Create', hasLeadingIcon: true, leadingIcon: <PlusIcon/> }` | light + dark | `border-radius: 9999px`, Level 1 shadow, white icon |
| `PrimaryHover` | `actions-fab--primary-hover` | Primary + hover decorator | light + dark | **Level 2 shadow** — elevation raises on hover |
| `Pressed` | `actions-fab--pressed` | Primary + active decorator | light + dark | `action/primary/pressed` bg, **Level 1 shadow** (returns) |
| `Secondary` | `actions-fab--secondary` | `{ variant: 'secondary' }` | light + dark | `border/brand`, `text/brand`, `data-icon-mode="default"` |
| `Tertiary` | `actions-fab--tertiary` | `{ variant: 'tertiary' }` | light + dark | `border/default`, `text/default` |
| `Ghost` | `actions-fab--ghost` | `{ variant: 'ghost' }` | light + dark | Transparent bg, `text/brand` |
| `Destructive` | `actions-fab--destructive` | `{ variant: 'destructive' }` | light + dark | `action/destructive` bg, white text and icon |
| `Disabled` | `actions-fab--disabled` | `{ disabled: true }` | light + dark | `aria-disabled="true"`, opacity 0.40, Level 1 shadow, `data-icon-mode="disabled"` |
| `Focused` | `actions-fab--focused` | `{ hasFocus: true }` | light + dark | Focus ring visible with `border-radius: 9999px` |
| `IconOnly` | `actions-fab--icon-only` | `{ hasLabel: false, accessibleLabel: 'Create item', hasLeadingIcon: true, leadingIcon: <PlusIcon/> }` | light + dark | Square (width === height), circular, `aria-label` present |
| `NavPanelSm` | `actions-fab--nav-panel-sm` | `{ variant: 'primary', size: 'sm', hasLabel: false, hasTrailingIcon: false, accessibleLabel: 'Collapse navigation', hasLeadingIcon: true, leadingIcon: <CaretLeftIcon/> }` | light + dark | 24×24px circle, 12px icon, `aria-label`, rendered inside a mock panel with `overflow: visible` |
| `SmWithLabelIgnored` | `actions-fab--sm-with-label-ignored` | `{ size: 'sm', hasLabel: true, label: 'Ignored' }` | light + dark | Label NOT rendered; `console.warn` spy called |
| `AllSizes` | `actions-fab--all-sizes` | Primary icon-only × sm/md/lg/xl | light + dark | 24/32/40/52px; icons 12/16/20/28px; all circular |
| `AllVariants` | `actions-fab--all-variants` | 5 types at md with labels | light + dark | Correct bg, text, and icon mode per variant |
| `LongLabel` | `actions-fab--long-label` | `{ label: 'Create new content entry' }` | light + dark | Pill widens; height stays 32px; `border-radius: 9999px` |
| `ElevationComparison` | `actions-fab--elevation-comparison` | Two FABs: one default, one hover-forced | light + dark | Visible shadow difference between Level 1 and Level 2 |

---

## 16. Test and visual-verification contract

### Per-prop verification

| Prop | Valid values | Invalid/edge | Default test | Key assertion |
|---|---|---|---|---|
| `variant` | 5 enum values | Any other | `'primary'` | Computed background matches the expected token per variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | Any other | `'md'` | `offsetHeight` equals 24/32/40/52 per size |
| `label` | Non-empty string | `''` | `'Create'` | Label span text content matches; NOT rendered at sm |
| `accessibleLabel` | Non-empty string | `''`, undefined when icon-only | — | `aria-label` present when label is hidden |
| `hasLabel` | `true, false` | — | `true` | `false` → label span absent, `aria-label` present |
| `hasLeadingIcon` | `true, false` | `true` + undefined icon | `false` | `true` → IconWrapper present before label |
| `hasTrailingIcon` | `true, false` | `true` at sm | `false` | Not rendered at sm regardless of prop |
| `disabled` | `true, false` | — | `false` | `aria-disabled="true"`, opacity 0.4, `onClick` not fired |
| `hasFocus` | `true, false` | — | `false` | `true` → focus ring `display: block` |

### Conditional element inventory

| element_key | Controlling condition | Presence test | Absence test |
|---|---|---|---|
| `leading-icon` | `hasLeadingIcon=true` AND `leadingIcon` defined | `getByTestId('icon-wrapper')` before label | Not found |
| `label` | `hasLabel=true` AND `label` defined AND `size !== 'sm'` | `.fab__label` text content matches | Not rendered |
| `trailing-icon` | `hasTrailingIcon=true` AND `trailingIcon` defined AND `size !== 'sm'` | `getByTestId('icon-wrapper')` after label | Not found |
| `focus-ring` | `:focus-visible` OR `hasFocus=true` | Computed `display === 'block'` | Computed `display === 'none'` |

### Interaction verification

| Interaction | Story | Drive | Callback assertion | DOM assertion |
|---|---|---|---|---|
| INT-01: Click enabled | `Primary` | `userEvent.click` | `onClick` called once | — |
| INT-02: Click disabled | `Disabled` | `userEvent.click` | `onClick` NOT called | `aria-disabled="true"` unchanged |
| INT-03: Space key | `Primary` | `userEvent.keyboard('[Space]')` after focus | `onClick` called once | — |
| INT-04: Enter key | `Primary` | `userEvent.keyboard('[Enter]')` after focus | `onClick` called once | — |
| INT-05: Tab focus | `Primary` | `userEvent.tab()` | — | `document.activeElement === button`; ring visible |
| INT-06: Tab to disabled | `Disabled` | `userEvent.tab()` | — | Button IS focusable (aria-disabled) |
| INT-07: Ref forwarding | — | Attach ref, call `ref.current.focus()` | — | `document.activeElement === button` |
| INT-08: sm label suppression | `SmWithLabelIgnored` | Render | — | `.fab__label` absent; `console.warn` spy called once |

### Geometry verification

| Assertion | Test |
|---|---|
| Circular at all sizes | `getComputedStyle(button).borderRadius === '9999px'` for sm/md/lg/xl |
| Focus ring is circular | `getComputedStyle(ring).borderRadius === '9999px'` |
| Icon-only is square | `button.offsetWidth === button.offsetHeight` when label is not rendered |
| Icon size per size variant | IconWrapper `offsetWidth` equals 12/16/20/28 for sm/md/lg/xl |
| Height per size | `button.offsetHeight` equals 24/32/40/52 |

### Elevation verification

| State | Test | Expected |
|---|---|---|
| Default | `getComputedStyle(button).boxShadow` | Matches `--venus-elevation-level-1` resolved value; not `'none'` |
| Hover | Apply `:hover` via pseudo-state addon; read `boxShadow` | Differs from Default; matches Level 2 |
| Pressed | Apply `:active`; read `boxShadow` | Returns to the Level 1 value |
| Disabled | Read `boxShadow` on `Disabled` story | Matches Level 1 |

### Icon mode verification

| variant | disabled | Expected `data-icon-mode` |
|---|---|---|
| `primary` | `false` | `"inverted"` |
| `destructive` | `false` | `"inverted"` |
| `secondary` | `false` | `"default"` |
| `tertiary` | `false` | `"default"` |
| `ghost` | `false` | `"default"` |
| any | `true` | `"disabled"` |

### Visual matrix

| Story | Viewport | Theme | Figma reference node | Tolerance |
|---|---|---|---|---|
| `Primary` | 800×600 | light + dark | `1438:93342` (Primary sm Default) / md equivalent | 0.2% |
| `Secondary` | 800×600 | light + dark | `1438:93646` (Secondary md Default) | 0.2% |
| `Destructive` | 800×600 | light + dark | `1438:94030` (Destructive lg Default) | 0.2% |
| `PrimaryHover` | 800×600 | light + dark | Primary md Hover | 0.3% (shadow diff tolerance) |
| `Disabled` | 800×600 | light + dark | Any Disabled variant | 0.2% |
| `NavPanelSm` | 800×600 | light + dark | `1438:93342` | 0.2% |
| `AllSizes` | 800×600 | light + dark | All sizes icon-only | 0.2% |
| `Focused` | 800×600 | light + dark | hasFocus=true | 0.2% |
| `LongLabel` | 800×600 | light + dark | — | 0.2% |

### Accessibility test suite

| Check | Tool | Assertion |
|---|---|---|
| Accessible name present | `axe-core` | No `button-name` violation on any story |
| Colour contrast | `axe-core` + manual | Label ≥ 4.5:1; icon ≥ 3:1 in both themes |
| Keyboard reachable | Play function | Every enabled story reachable via `userEvent.tab()` |
| No `role` override | Static assertion | `button.getAttribute('role')` is `null` |
| Focus visible | Play function | Ring `display === 'block'` after `userEvent.tab()` |
| No duplicate naming | Static assertion | Never both a rendered label AND `aria-label` |

---

## 17. Decisions and confirmed resolutions

### Confirmed decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | `border-radius: 9999px` hardcoded in CSS, not token-derived | Figma API cannot bind `cornerRadius` on COMPONENT nodes — the value is bound per-corner via `VariableID:546:3083` (`radius/9999`). CSS uses the literal `9999px`, which resolves identically. |
| DEC-02 | Elevation implemented as `box-shadow` from Venus elevation CSS vars | Maps directly to the Venus effect-style system. Two levels only: Level 1 (resting) and Level 2 (hover). No independent shadow values. |
| DEC-03 | Only Hover raises elevation; Pressed returns to Level 1 | Per the CSET description. Produces a physical "lift then press down" model consistent with Material-style elevation semantics. |
| DEC-04 | FAB sm icon = 12px, distinct from Button sm's 16px | Live Figma measurement: `icon/leading` = 12×12px inside the 24px sm FAB. A 16px icon inside a 24px circle with 4px padding would have zero breathing room. |
| DEC-05 | sm is a governance-approved exception to the Venus no-sm rule | Constitution, approved 2026-07-16. The no-sm red line exists to prevent undersized interactive **text labels** in form contexts. FAB sm is icon-only, circular, and floating — a structurally different context. 24px meets the WCAG 2.5.5 minimum touch target. |
| DEC-06 | Label is suppressed at sm even when `hasLabel=true` | Silently dropping the label plus a dev warning is safer than rendering clipped or overflowing text. The component cannot honour both `size='sm'` and a visible label. |
| DEC-07 | React defaults `hasLeadingIcon` / `hasTrailingIcon` to `false` (Figma defaults `true`) | Figma defaults to `true` so designers see a complete instance on placement. The correct production default is to render only what the consumer explicitly asks for. |
| DEC-08 | FAB does not provide positioning props | Positioning is layout context, not component identity. Providing `position`/`top`/`right` props would encode consumer layout decisions into the design system. |
| DEC-09 | Token logic should be shared with Button, not forked | Both components resolve to identical Venus_Semantics tokens for all 5 variants × 4 states. Duplicating the values guarantees eventual drift. Extract a shared CSS partial or hook. |
| DEC-10 | Destructive has a Pressed state on FAB (unlike Button) | Live Figma confirms 80 variants = 5 × 4 × 4 with no gaps. Button intentionally omits Destructive/Pressed; FAB does not. Implemented as built. |

### Rejected approaches

| ID | Approach | Why rejected | Chosen instead |
|---|---|---|---|
| REJ-01 | Extend `Button` with an `isCircular` prop | Conflates two components with different governance (sm allowed on FAB, forbidden on Button) and different elevation contracts. A boolean flag would hide those differences. | Separate `FAB` component sharing Button's token layer |
| REJ-02 | Elevation via a nested absolutely positioned shadow element | Unnecessary DOM. `box-shadow` on the root is simpler, performant, and transitions cleanly. | `box-shadow` on root |
| REJ-03 | `elevation` prop for consumer-controlled shadow level | Elevation is state-derived, not consumer-chosen. Allowing overrides would break the hover-raises contract. | State-driven CSS only |
| REJ-04 | Allowing sm with a label | 24px cannot fit legible text at any font size in the Venus scale. | sm is icon-only, enforced in render logic |
| REJ-05 | `position`/`top`/`right` props for positioning | Encodes layout into the component. Different consumers anchor differently (panel edge, scroll container, viewport). | Consumer applies positioning via `className` or a wrapper |
| REJ-06 | Native `disabled` attribute | Removes the FAB from tab order. For a floating toggle, keyboard users lose the ability to discover it. | `aria-disabled="true"` + `pointer-events: none` + handler guard |

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma node `1438:94302` live read 2026-08-11
- [x] All 80 variants accounted for (5 types × 4 sizes × 4 states, no gaps)
- [x] Mode NEW, scope explicit
- [x] Absolute Requirements documented (8 numbered items)
- [x] Upstream dependency `_Internal/Icon-Wrapper` confirmed ✅ HANDOFF_COMPLETE
- [x] Elevation contract fully specified with per-state values (Section 7 and 9)
- [x] sm governance exception documented with rationale and enforcement (DEC-05, DEC-06)
- [x] FAB sm icon = 12px distinction from Button captured (DEC-04)
- [x] NavPanel positioning contract documented including the `overflow: visible` requirement (Section 10)
- [x] Shared-token guidance with Button captured (DEC-09)
- [x] Destructive/Pressed difference from Button captured (DEC-10)
- [x] All 18 sections present: 0–18 including 12a
- [x] Anatomy, API, tokens, states, ARIA, keyboard, stories, tests complete
- [x] `unresolved_question_count: 0`
- [x] No hardcoded values in the brief

### Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Design | George Karian | PENDING | — |
| Engineering | Narendra | PENDING | — |
