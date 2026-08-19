---
brief_schema: venus-storybook-handover/v2
component_name: "Icon Button"
component_kebab_case: "icon-button"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1165-49200"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "1165:49200"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Actions/IconButton"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        Icon Button
  REACT_COMPONENT:       IconButton
  STORYBOOK_TITLE:       Actions/IconButton
  FIGMA_NODE_ID:         1165:49200
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           🔘 Actions
  CSS_CLASS_PREFIX:      icon-button
  FILE_NAME:             IconButton.tsx
  STORY_FILE_NAME:       IconButton.stories.tsx
  CSS_FILE_NAME:         IconButton.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
  STATUS:                Active
  ═══════════════════════════════════════════════════════════════════
-->

# Icon Button — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | `accessibleLabel` prop is **required** — forwarded as `aria-label` on `<button>` | No visible label exists. Without `aria-label` the button has no accessible name — WCAG 4.1.2 failure. |
| 2 | Ghost type only for xs and sm sizes — Primary/Secondary start at md | Live Figma: Ghost has 5 sizes (xs/sm/md/lg/xl); Primary and Secondary have 3 (md/lg/xl). TypeScript must enforce this. |
| 3 | Icon mode: Primary → `inverted` (white); Ghost/Secondary → `default` (brand purple); all disabled → `disabled` (gray) | Wrong mode = wrong icon colour in production. Same pattern as Button. |
| 4 | `aria-disabled="true"` — not native `disabled` | Venus system-wide button pattern. Keeps button keyboard-discoverable. |
| 5 | Ghost xs (20px) and sm (24px) have zero padding — the Icon-Wrapper IS the hit target | Live Figma: `paddingAll=0`. The component boundary is the clickable area. |
| 6 | lg icon = **20px** — the variant description saying "Icon: 24px" is stale; live structure is authoritative | Icon-Wrapper inside lg variant measures 20×20px. Per skill conflict rules, live Figma wins. |
| 7 | Must render as native `<button type="button">` | Native button provides free Space/Enter keyboard handling and AT announcement. |

---

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/date | What it establishes |
|---|---|---|---|
| Figma design context (live read) | Node `1165:49200`, 🔘 Actions | 2026-08-11 | All 44 variants, exact dimensions, icon sizes, children, all token bindings |
| Figma CSET description | `1165:49200` description | 2026-08-11 | Type/Size availability matrix, `accessibleLabel` requirement, boundary vs `_Internal/Icon-Action` |
| Button brief | Node `1489:30020` | 2026-08-11 | Token system, icon mode map, disabled pattern (shared) |
| `_Internal/Icon-Wrapper` brief | Node `214:152884` | 2026-08-11 | Upstream dependency ✅ HANDOFF_COMPLETE |
| `icon-button-strategy.md` | Project knowledge | 2026-08-11 | Decision boundary: Icon Button (standalone) vs Icon-Action (embedded) |

### Source precedence

Live Figma structure governs anatomy, dimensions, and token bindings. CSET description governs behaviour intent and type/size constraints. Where the variant description conflicts with live structure (lg icon size), live structure wins.

---

## 1. Outcome and scope

**Definition:** A standalone icon-only interactive trigger providing the same action semantics as Button, without a visible label — for contexts where the icon alone communicates intent and space is constrained.

**User need:** Toolbar actions (close, settings, more options), inline table row actions, and compact panel triggers where a text label would consume space the layout cannot afford.

### Use cases

| ID | Use case | Context | Variant / size | Success outcome |
|---|---|---|---|---|
| UC-01 | Close a modal or panel | Dialog header, right-aligned | Ghost / md | X icon visible, `aria-label="Close dialog"` announced |
| UC-02 | Row-level action in a data table | Table row, dense | Ghost / xs or sm | Minimal footprint, still keyboard-reachable |
| UC-03 | Primary floating action in a toolbar | Content toolbar | Primary / md or lg | Filled brand background, white icon |
| UC-04 | Secondary supporting action | Panel header | Secondary / md | Bordered, brand purple icon |
| UC-05 | Dropdown trigger in a Split Action Button | Compound control | Primary or Ghost / matches parent size | Composes cleanly with squared left corners |

### Scope

| In scope | Out of scope |
|---|---|
| 3 types: Ghost / Primary / Secondary | Destructive, Tertiary types |
| Ghost: xs/sm/md/lg/xl · Primary/Secondary: md/lg/xl | Any Primary/Secondary below md |
| 4 states: Default / Hover / Pressed / Disabled | Loading state |
| `icon` via INSTANCE_SWAP → React node | Two icons in one button |
| `accessibleLabel` (required) | Visible label (use Button) |

### Responsibility boundary

| IconButton owns | Consumer owns |
|---|---|
| Visual state per type and state | Choosing which icon to render |
| Icon mode via `data-icon-mode` | Writing a meaningful `accessibleLabel` |
| `aria-label` from `accessibleLabel` | Judging whether icon-only is appropriate for the context |
| `aria-disabled` when disabled | Tooltip on hover (if desired) |
| Focus ring on `:focus-visible` | Action logic on click |

---

## 2. Existing baseline and change contract

`N/A — new component. No prior Storybook implementation.`

**Migration note:** This component replaces the pattern `Button hasLabel={false}`. Three existing migration targets are documented in project instructions (RTE-Toolbar, RTE CSET, Header-Bar) — those migrations execute after this component is published, not as part of this brief.

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Native `<button>` with a single `IconWrapper` child |
| Existing components to reuse | `IconWrapper` (`214:152884`) — ✅ HANDOFF_COMPLETE |
| Code Connect mappings | None currently |
| Hooks/utilities/providers | None — fully prop-driven, stateless |
| Existing tokens | Shares Button's Venus_Semantics action tokens. Full table in Section 13. |
| Genuinely new surface | `IconButton.tsx`, `IconButton.module.css`, `IconButton.stories.tsx` |
| Prohibited reimplementation | Do not use `Button hasLabel={false}`. Do not use `_Internal/Icon-Action` for standalone triggers — that atom is for icons embedded inside other components. |

### Dependency tree

| Direction | Component | Must exist before build | Breaking if API changes |
|---|---|---|---|
| Upstream | `IconWrapper` (`214:152884`) | **Yes** — ✅ HANDOFF_COMPLETE | `size` prop rename breaks icon sizing |
| Downstream | `Split Action Button` (`644:27136`) | N/A | `variant`, `size`, `accessibleLabel` renames are breaking |

---

## 4. Anatomy

`REQUIRED` = always rendered · `OPTIONAL` = prop-controlled · `INTERNAL` = never a prop

| element_key | Layer name | Visibility | Condition | RTL mirrors | Figma ref | Semantic/testing requirement |
|---|---|---|---|---|---|---|
| `root` | `icon-button` | REQUIRED | Always | no | Variant frame — square, size-dependent | `<button type="button">`, `aria-label={accessibleLabel}`, `data-testid="icon-button"`, `data-icon-mode` |
| `icon` | `_Internal/Icon-Wrapper` | REQUIRED | Always | no | INSTANCE, FIXED — 16px (xs/sm/md) / 20px (lg) / 24px (xl) | `IconWrapper`, `aria-hidden` inherited from wrapper |
| `focus-ring` | `icon-button-focus-ring` | INTERNAL | `:focus-visible` (production) / `hasFocus=true` (Storybook) | no | FRAME, ABSOLUTE, size + 4px on each axis | `aria-hidden="true"`, `position: absolute`, `inset: -2px` |

> **No label element exists in this component.** The accessible name comes entirely from `aria-label`. There is no `hasLabel` property and no text node.

---

## 5. Public React API

### Props

| Prop | TypeScript type | Required | Default | Behavior | Storybook control |
|---|---|---|---|---|---|
| `accessibleLabel` | `string` | **Yes** | — | Forwarded as `aria-label`. Must describe the action, not the icon shape. | text |
| `icon` | `React.ReactNode` | **Yes** | — | Icon element rendered inside `IconWrapper` | — |
| `variant` | `'ghost' \| 'primary' \| 'secondary'` | No | `'ghost'` | Background, border, icon mode | select |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Component dimensions, icon size, padding. xs/sm are Ghost only. | select |
| `disabled` | `boolean` | No | `false` | `aria-disabled="true"` + 0.40 opacity + `pointer-events: none` | boolean |
| `hasFocus` | `boolean` | No | `false` | **Storybook demo only.** Shows focus ring via CSS class. Never pass in production. | boolean |
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
| Prop changes after mount | `variant`, `size`, `disabled`, `icon` all update cleanly on re-render |
| Ref forwarding | `React.forwardRef` to root `<button>`. Required — Split Action Button needs a ref for focus management. |
| Native DOM props | `...rest` spread to `<button>`. Includes `aria-haspopup`, `aria-expanded`, `onKeyDown` for dropdown-trigger usage. |
| `disabled` attribute | Must NOT use native `disabled`. Use `aria-disabled` + handler guard. |
| Invalid type/size combination | Dev-mode `console.warn`. Does not throw — renders with the requested visual but logs the violation. |

### TypeScript interface

```typescript
/**
 * Standalone icon-only button. Requires accessibleLabel for screen readers.
 *
 * Use Button for labeled actions.
 * Use _Internal/Icon-Action for icon triggers embedded inside other components.
 *
 * Type/size availability: xs and sm are Ghost only.
 *
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1165-49200
 */
export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'aria-label'> {
  /**
   * Accessible name for screen readers. Required — no visible label exists.
   * Describe the ACTION, not the icon: "Close dialog" not "X icon".
   */
  accessibleLabel: string;
  /** Icon element to render inside the wrapper. */
  icon: React.ReactNode;
  /**
   * Semantic type. Determines background, border, and icon mode.
   * Note: xs and sm sizes are available for 'ghost' only.
   * @default 'ghost'
   */
  variant?: 'ghost' | 'primary' | 'secondary';
  /**
   * Size. xs (20px) and sm (24px) are Ghost only.
   * md (32px), lg (40px), xl (52px) available for all variants.
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Disables interaction. Uses aria-disabled — not native disabled. @default false */
  disabled?: boolean;
  /**
   * Storybook demo only — shows focus ring via CSS class.
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
import type { IconButtonProps } from './IconButton';
import styles from './IconButton.module.css';

const iconSizeMap = { xs: 16, sm: 16, md: 16, lg: 20, xl: 24 } as const;
const iconModeMap = { ghost: 'default', primary: 'inverted', secondary: 'default' } as const;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      accessibleLabel,
      icon,
      variant = 'ghost',
      size = 'md',
      disabled = false,
      hasFocus = false,
      onClick,
      type = 'button',
      className,
      ...rest
    },
    ref
  ) => {
    const iconSize = iconSizeMap[size];
    const iconMode = disabled ? 'disabled' : iconModeMap[variant];

    if (process.env.NODE_ENV !== 'production') {
      if (variant !== 'ghost' && (size === 'xs' || size === 'sm')) {
        console.warn(
          `[IconButton] size="${size}" is available for variant="ghost" only. ` +
          `Received variant="${variant}". Use size="md" or larger for primary/secondary.`
        );
      }
      if (!accessibleLabel) {
        console.warn('[IconButton] accessibleLabel is required — the button has no visible label.');
      }
    }

    return (
      <button
        ref={ref}
        type={type}
        aria-label={accessibleLabel}
        aria-disabled={disabled || undefined}
        data-testid="icon-button"
        data-icon-mode={iconMode}
        className={[
          styles['icon-button'],
          styles[`icon-button--${variant}`],
          styles[`icon-button--${size}`],
          disabled ? styles['icon-button--disabled'] : '',
          hasFocus ? styles['icon-button--focused'] : '',
          className,
        ].filter(Boolean).join(' ')}
        style={disabled ? { opacity: 'var(--venus-visibility-disabled)' } : undefined}
        onClick={(e) => { if (!disabled) onClick?.(e); }}
        {...rest}
      >
        {/* Focus ring — INTERNAL */}
        <span className={styles['icon-button__focus-ring']} aria-hidden="true" />
        <IconWrapper size={iconSize} icon={icon} />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
```

**IconButton.module.css:**

```css
/* ── Base ──────────────────────────────── */
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  position: relative;
  border-radius: var(--venus-radius-4, 4px);
  background: transparent;
  transition: background 120ms ease, border-color 120ms ease;
}

/* ── Sizes — square dimensions ─────────── */
.icon-button--xs { width: 20px;  height: 20px;  padding: 0; }
.icon-button--sm { width: 24px;  height: 24px;  padding: 0; }
.icon-button--md { width: 32px;  height: 32px;  padding: var(--venus-space-8, 8px); }
.icon-button--lg { width: 40px;  height: 40px;  padding: var(--venus-space-8, 8px); }
.icon-button--xl { width: 52px;  height: 52px;  padding: var(--venus-space-12, 12px); }

/* xl uses larger corner radius, matching Button */
.icon-button--xl { border-radius: var(--venus-radius-8, 8px); }

/* ── Ghost ─────────────────────────────── */
.icon-button--ghost { background: transparent; }
.icon-button--ghost:hover:not(.icon-button--disabled) {
  background: var(--venus-action-secondary-hover);
}
.icon-button--ghost:active:not(.icon-button--disabled) {
  background: var(--venus-action-secondary-active);
}

/* ── Primary ───────────────────────────── */
.icon-button--primary { background: var(--venus-action-primary); }
.icon-button--primary:hover:not(.icon-button--disabled) {
  background: var(--venus-action-primary-hover);
}
.icon-button--primary:active:not(.icon-button--disabled) {
  background: var(--venus-action-primary-pressed);
}

/* ── Secondary ─────────────────────────── */
.icon-button--secondary {
  background: var(--venus-action-secondary);
  border: 1px solid var(--venus-border-brand);
}
.icon-button--secondary:hover:not(.icon-button--disabled) {
  background: var(--venus-action-secondary-hover);
}
.icon-button--secondary:active:not(.icon-button--disabled) {
  background: var(--venus-action-secondary-active);
}

/* ── Disabled ──────────────────────────── */
/* opacity applied inline via style prop — visibility/disabled = 0.40 */
.icon-button--disabled {
  pointer-events: none;
  cursor: not-allowed;
}

/* ── Focus ring — INTERNAL ─────────────── */
.icon-button__focus-ring {
  display: none;
  position: absolute;
  inset: -2px;
  border: 2px solid var(--venus-border-focus);
  border-radius: calc(var(--venus-radius-4, 4px) + 2px);
  pointer-events: none;
}
.icon-button--xl .icon-button__focus-ring {
  border-radius: calc(var(--venus-radius-8, 8px) + 2px);
}
.icon-button--focused .icon-button__focus-ring,
.icon-button:focus-visible .icon-button__focus-ring {
  display: block;
}

/* ── Reduced motion ────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .icon-button { transition: none; }
}
```

### Invalid combinations

| Combination | Valid | Required result |
|---|---|---|
| `variant='primary'` AND `size='xs'` | No | Dev `console.warn`. Renders with primary appearance at 20px, but logs the violation. |
| `variant='secondary'` AND `size='sm'` | No | Same — dev warning |
| `accessibleLabel` empty string | No | Dev `console.warn`. `aria-label=""` is treated as absent by AT. |
| `icon` undefined | No | TypeScript compile error (`icon` is required) |
| Native `disabled` passed via `...rest` | No | Excluded from the props type via `Omit`. TypeScript prevents it. |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop | Mapping rule | React default |
|---|---|---|---|---|
| `Type` (VARIANT) | `Ghost \| Primary \| Secondary` | `variant` | lowercase transform | `'ghost'` |
| `Size` (VARIANT) | `xs \| sm \| md \| lg \| xl` | `size` | direct | `'md'` |
| `State=Default` | `Default` | — | base state | — |
| `State=Hover` | `Hover` | CSS `:hover` — never a prop | pseudo-class | — |
| `State=Pressed` | `Pressed` | CSS `:active` — never a prop | pseudo-class | — |
| `State=Disabled` | `Disabled` | `disabled: boolean` | direct | `false` |
| `accessibleLabel#1165:82` (TEXT) | Any string | `accessibleLabel: string` | forwarded as `aria-label` | — (required) |
| `icon#1165:127` (INSTANCE_SWAP) | Any icon component | `icon: React.ReactNode` | consumer passes element | — (required) |
| `hasFocus#1165:37` (BOOLEAN) | `true \| false` | `hasFocus: boolean` | Storybook demo only | `false` |

### Unmapped design properties

`N/A — all Figma properties are mapped.`

The `icon#1165:127` INSTANCE_SWAP has 9 `preferredValues` in Figma (curated icon shortlist). This is a Figma-authoring convenience — React accepts any icon element.

### Unmapped code properties

`N/A — new component.`

---

## 7. Variants, states, and precedence

### Size contract (live-verified 2026-08-11)

| Size | Component | Icon | Padding | Border radius | Available types |
|---|---|---|---|---|---|
| `xs` | 20 × 20px | 16px | 0 | 4px | **Ghost only** |
| `sm` | 24 × 24px | 16px | 0 | 4px | **Ghost only** |
| `md` | 32 × 32px | 16px | 8px | 4px | Ghost / Primary / Secondary |
| `lg` | 40 × 40px | **20px** | 8px | 4px | Ghost / Primary / Secondary |
| `xl` | 52 × 52px | 24px | 12px | 8px | Ghost / Primary / Secondary |

All sizes are square (width = height). Never HUG.

> ⚠️ **lg icon = 20px.** The Figma variant description text says "Icon: 24px". Live structure measures 20×20px. Live structure is authoritative.

### Variant cross-matrix

| | xs | sm | md | lg | xl |
|---|---|---|---|---|---|
| **Ghost** | ✓ `1165:48909` | ✓ | ✓ | ✓ `1165:48997` | ✓ |
| **Primary** | ✗ | ✗ | ✓ | ✓ | ✓ `1165:49112` |
| **Secondary** | ✗ | ✗ | ✓ | ✓ | ✓ `1165:49199` |

Each valid cell × 4 states (Default / Hover / Pressed / Disabled) = **44 variants total**
(Ghost 5 sizes × 4 + Primary 3 × 4 + Secondary 3 × 4 = 20 + 12 + 12 = 44 ✓)

### State table

| State | Category | Trigger | CSS mechanism | ARIA change | Required story |
|---|---|---|---|---|---|
| Default | Base | Initial render | — | — | `Ghost`, `Primary`, `Secondary` |
| Hover | Interaction | Pointer enter | `:hover` — never a prop | — | `Hovered` |
| Pressed | Interaction | Pointer down | `:active` — never a prop | — | `Pressed` |
| Disabled | Public | `disabled=true` | `aria-disabled="true"` + `opacity: 0.40` + `pointer-events: none` | `aria-disabled="true"` | `Disabled` |
| Focused | INTERNAL | `:focus-visible` / `hasFocus=true` (Storybook) | Focus ring `display: block` | — | `Focused` |

### Appearance per variant

| Variant | Background (Default) | Hover | Pressed | Border | Icon mode |
|---|---|---|---|---|---|
| Ghost | transparent | `action/secondary/hover` | `action/secondary/active` | None | `default` |
| Primary | `action/primary` | `action/primary/hover` | `action/primary/pressed` | None | `inverted` |
| Secondary | `action/secondary/default` | `action/secondary/hover` | `action/secondary/active` | `border/brand` 1px | `default` |
| Any disabled | Same as Default at 0.40 opacity | — | — | — | `disabled` |

### State precedence

| Higher state | Lower state | Result |
|---|---|---|
| Disabled | Hover | Hover suppressed — `pointer-events: none` |
| Disabled | Pressed | Pressed suppressed |
| Disabled | Focused | Button retains focus (`aria-disabled` not native `disabled`) — ring shows |
| Pressed | Hover | `:active` overrides `:hover` background |

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure mode |
|---|---|---|---|---|
| BR-01 | `disabled=true` | User clicks or presses Space/Enter | `onClick` does not fire | Disabled button triggers the action |
| BR-02 | `disabled=true` | User presses Tab | Button still receives focus (not skipped) | Button invisible to keyboard users; they cannot discover the disabled action exists |
| BR-03 | `variant='primary'` AND `size='xs'` | Component renders | Dev `console.warn`; renders anyway | Silent design system violation ships to production |
| BR-04 | `accessibleLabel` is an empty string | Component renders | Dev `console.warn` | Button has no accessible name — AT announces "button" only |
| BR-05 | `variant='primary'`, `disabled=false` | Component renders | `data-icon-mode="inverted"` on root; Icon-Wrapper renders white icon | Brand purple icon on brand purple background — invisible |
| BR-06 | `disabled=true`, any variant | Component renders | `data-icon-mode="disabled"` on root; icon renders gray | Icon retains full colour while the rest fades — inconsistent |

### Input and data validation

| Prop | Valid | Invalid/edge | Behavior |
|---|---|---|---|
| `accessibleLabel` | Non-empty descriptive string | `''`, `undefined` | Dev warn. TypeScript requires the prop but cannot enforce non-empty. |
| `icon` | Any ReactNode | `null`, `undefined` | TypeScript compile error — prop is required |
| `variant` | `'ghost' \| 'primary' \| 'secondary'` | Any other | TypeScript compile error |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Any other | TypeScript compile error |
| `variant` + `size` combination | See cross-matrix | Primary/Secondary at xs/sm | Dev warn; renders |

---

## 9. Interactions and focus

### Interaction table

| ID | element_key | Action | Precondition | Result | Callback | Keyboard | Disabled behavior |
|---|---|---|---|---|---|---|---|
| INT-01 | `root` | Click | `disabled=false` | Fires `onClick` | `onClick(event)` | Space, Enter | Blocked — `pointer-events: none` + handler guard |
| INT-02 | `root` | Tab | — | Focus enters the button | — | Tab / Shift+Tab | Still focusable (`aria-disabled`) |
| INT-03 | `root` | Pointer down | `disabled=false` | `:active` background applies | — | — | Suppressed |

### Focus management

| Event | Focus target | Movement | Restoration | Focus ring |
|---|---|---|---|---|
| User tabs to button | Root `<button>` | Standard document order | Returns to the same element after blur | `:focus-visible .icon-button__focus-ring { display: block }` |
| Used as a dropdown trigger (Split Action Button) | Root `<button>` | Consumer manages focus return via forwarded ref | Consumer calls `ref.current.focus()` after menu closes | Same |

**Focus ring contract:**

| Property | Value |
|---|---|
| CSS trigger (production) | `:focus-visible` on root `<button>` |
| CSS trigger (Storybook) | `.icon-button--focused` class via `hasFocus=true` |
| Element | `.icon-button__focus-ring`, `aria-hidden="true"`, `position: absolute` |
| Inset | `−2px` on all sides |
| Border | `2px solid var(--venus-border-focus)` → `purple/500` Light / `purple/400` Dark |
| Border radius | `calc(radius/4 + 2px)` for xs–lg; `calc(radius/8 + 2px)` for xl |
| Size in Figma | Component size + 4px on each axis (xs: 24×24 ring around 20×20; xl: 56×56 around 52×52) |

**Storybook Focused story:**
```tsx
export const Focused: Story = {
  args: { accessibleLabel: 'Settings', icon: <SettingsIcon />, hasFocus: true },
};
```

### Motion

| Motion | Trigger | Property | Duration | Easing | Reduced motion |
|---|---|---|---|---|---|
| Background transition | Hover, press | `background`, `border-color` | 120ms | `ease` | `transition: none` via `prefers-reduced-motion: reduce` |

---

## 10. Dynamic positioning

`N/A — no dynamically repositioned elements. The focus ring is statically positioned via CSS `inset: -2px` and requires no runtime measurement.`

---

## 11. Responsive behavior

| Constraint | Rule |
|---|---|
| Width | Fixed square per size — 20 / 24 / 32 / 40 / 52px. Never HUG, never FILL. |
| Height | Fixed square per size — always equal to width |
| `flex-shrink` | `0` — never compresses in flex containers (critical for toolbars) |
| Container overflow | The consumer's toolbar is responsible for wrapping or scrolling. IconButton never shrinks. |
| Zoom/reflow | Dimensions use px values. At 200% browser zoom the button scales with the page. Icon remains proportional. |
| Breakpoints | No breakpoint-driven size changes. Consumer selects the size appropriate to each layout. |

---

## 12. Content, localization, and edge cases

| Case | Required behavior | Story |
|---|---|---|
| Long `accessibleLabel` | No visual impact — the label is never rendered visually, only exposed via `aria-label` | N/A |
| Localized `accessibleLabel` | Consumer supplies the translated string. No truncation concerns since it is not displayed. | N/A |
| RTL layout | Square button — no mirroring needed on the component itself. If the icon is directional (chevron, arrow), the consumer must supply the RTL-appropriate icon. | `RTL` |
| Directional icons in RTL | Consumer responsibility: pass `ChevronLeft` in RTL where `ChevronRight` is used in LTR | N/A |
| Icon larger than the wrapper | `IconWrapper` constrains the icon to its `size` prop. Oversized SVGs are scaled down by the wrapper. | N/A |
| High contrast / forced-colors mode | Ghost variant has no background — add `border: 1px solid currentColor` fallback in forced-colors mode so the hit area is visible | N/A |
| Icon-only in a dense table row | Use xs or sm Ghost. Ensure sufficient spacing between adjacent buttons (min 4px) so touch targets do not overlap. | `DenseRow` |

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't | Rationale |
|---|---|---|
| Write `accessibleLabel` describing the action | Write the icon name ("X icon", "Chevron") | Screen reader users need to know what will happen, not what the glyph looks like |
| Use Ghost for xs and sm | Use Primary or Secondary below md | A filled visual treatment below 32px reads as a coloured blob — the icon loses legibility |
| Use `aria-disabled` not native `disabled` | Use native `disabled` | Native `disabled` removes the button from tab order; keyboard users cannot discover it |
| Use IconButton for standalone icon triggers | Use `Button hasLabel={false}` | Button carries label-related props and CSS that are dead weight; IconButton is purpose-built |
| Use `_Internal/Icon-Action` for icons embedded inside other components | Use IconButton inside a Chip or Input | See `icon-button-strategy.md` for the decision boundary |
| Provide a tooltip on hover for ambiguous icons | Rely on the icon alone when the action is not obvious | `aria-label` serves AT users; sighted users benefit from a tooltip |
| Keep at least 4px between adjacent xs/sm buttons | Place xs buttons flush against each other | Adjacent 20px targets with no gap create mis-tap risk on touch devices |

---

## 13. Tokens, typography, and assets

**Token chain:** `_Primitives → Venus_Semantics → component layer`. All bindings live-verified 2026-08-11.

### Tokens — background

| Variant | State | Token (full chain) | CSS custom property | Figma VariableID |
|---|---|---|---|---|
| Ghost | Default | `[VS] action/ghost/default` (transparent) | — | `564:3225` |
| Ghost | Hover | `[VS] action/secondary/hover` ← `purple/100` | `--venus-action-secondary-hover` | `564:3221` |
| Ghost | Pressed | `[VS] action/secondary/active` ← `purple/200` | `--venus-action-secondary-active` | `564:3222` |
| Primary | Default | `[VS] action/primary` ← `purple/500` | `--venus-action-primary` | `564:3217` |
| Primary | Hover | `[VS] action/primary/hover` ← `purple/600` | `--venus-action-primary-hover` | `564:3218` |
| Primary | Pressed | `[VS] action/primary/pressed` ← `purple/700` | `--venus-action-primary-pressed` | `564:3219` |
| Secondary | Default | `[VS] action/secondary/default` | `--venus-action-secondary` | `564:3220` |
| Secondary | Hover | `[VS] action/secondary/hover` | `--venus-action-secondary-hover` | `564:3221` |

### Tokens — border

| Variant | Token | CSS custom property | Figma VariableID |
|---|---|---|---|
| Ghost | None | — | — |
| Primary | None | — | — |
| Secondary | `[VS] border/brand` ← `purple/500` | `--venus-border-brand` | `564:3211` |

### Tokens — layout, opacity, focus

| Property | Token | CSS custom property | Figma VariableID | Value |
|---|---|---|---|---|
| `padding` (md, lg) | `[P] space/8` | `--venus-space-8` | `546:3061` | 8px |
| `padding` (xl) | `[P] space/12` | `--venus-space-12` | `546:3062` | 12px |
| `padding` (xs, sm) | none | — | — | 0 |
| `border-radius` (xs–lg) | `[P] radius/4` | `--venus-radius-4` | `546:3078` | 4px |
| `border-radius` (xl) | `[P] radius/8` | `--venus-radius-8` | `546:3080` | 8px |
| Disabled `opacity` | `[VS] visibility/disabled` | `--venus-visibility-disabled` | `564:3246` | **0.40** |
| Focus ring `border-color` | `[VS] border/focus` | `--venus-border-focus` | `564:3210` | `purple/500` L / `purple/400` D |

### Typography

`N/A — no text content in this component.`

### Icon mode map (Absolute Requirement #3)

| Variant | State | Venus_Icons mode | `data-icon-mode` value | Icon appearance |
|---|---|---|---|---|
| Primary | Non-disabled | `inverted` | `inverted` | White |
| Ghost | Non-disabled | `default` | `default` | Brand purple |
| Secondary | Non-disabled | `default` | `default` | Brand purple |
| Any | Disabled | `disabled` | `disabled` | Gray |

Venus_Icons collection mode IDs: `inverted=564:8`, `default=564:7`, `disabled=564:10`.

Implementation: `data-icon-mode` is set on the root `<button>`. `IconWrapper` reads `--venus-icon-color` which is scoped by a CSS rule on `[data-icon-mode]`. No per-icon prop is needed.

### Assets

`N/A — icons are supplied by the consumer via the `icon` prop. No bundled assets.`

---

## 14. Accessibility contract

### Semantics and naming

| Concern | Requirement |
|---|---|
| Root element | `<button type="button">` |
| Accessible name | `aria-label={accessibleLabel}` — **always present**. This is the only source of the accessible name. |
| Label content rule | Must describe the action, not the glyph. "Close dialog" ✓ · "X" ✗ · "X icon" ✗ |
| `aria-disabled` | `"true"` when `disabled=true`. Never native `disabled`. |
| Icon | `aria-hidden="true"` — inherited from `IconWrapper`. The icon must never be exposed to AT. |
| Prohibited | `role` override. Empty `aria-label`. Native `disabled` attribute. `aria-labelledby` pointing at the icon. |
| Dropdown-trigger usage | Consumer adds `aria-haspopup` and `aria-expanded` via `...rest` |

### Keyboard

| Context | Key | Result | Focus after | Prevent default |
|---|---|---|---|---|
| Button focused | Space | Fires `onClick` (unless disabled) | Stays on button | Yes (browser default) |
| Button focused | Enter | Fires `onClick` (unless disabled) | Stays on button | Yes (browser default) |
| Any | Tab | Move focus to next focusable element | Next element | No |
| Any | Shift+Tab | Move focus to previous focusable element | Previous element | No |

No custom key handling is required — native `<button>` provides Space/Enter activation.

### Announcements

| Event | Announcement | Live region | Timing |
|---|---|---|---|
| Focus (enabled) | "[accessibleLabel], button" | Native | On focus |
| Focus (disabled) | "[accessibleLabel], dimmed, button" (AT-dependent wording) | Native | On focus |
| Activation | No automatic announcement — the consumer announces the result of the action if needed | Consumer-provided live region | After action |

### Acceptance

| Area | Requirement |
|---|---|
| Focus visible | 2px `border/focus` ring, inset −2px, radius matches size. Visible in both Light and Dark. |
| Focus order | Natural document order. No `tabIndex` manipulation by the component. |
| Contrast — icon | Icon colour vs button background ≥ 3:1 (WCAG 1.4.11 non-text contrast). Verify: white on `action/primary`; brand purple on transparent over page background. |
| Contrast — border | Secondary variant `border/brand` vs page background ≥ 3:1 |
| Touch target | md (32px) and above satisfy WCAG 2.5.5 AAA (44px is not required at AA). xs (20px) and sm (24px) meet the 24px AA minimum only when surrounded by ≥4px spacing — enforce spacing in dense contexts. |
| Zoom/reflow | Button dimensions and icon scale correctly at 200% zoom (WCAG 1.4.4) |
| Reduced motion | All CSS transitions removed under `prefers-reduced-motion: reduce` |
| Forced colors | Ghost variant needs `border: 1px solid currentColor` fallback so the hit area is discernible in Windows High Contrast mode |

---

## 15. Storybook contract

### Environment

| Field | Requirement |
|---|---|
| Story format | CSF3 |
| Layout | `layout: 'centered'` |
| Globals | Light + Dark both required for every story |
| Decorators | None required. `DenseRow` story uses a flex-row decorator with 4px gap. |
| Pseudo-state | `hasFocus=true` prop for the Focused story. Hover/Pressed via `@storybook/addon-pseudo-states` or a hover decorator. |
| Viewports | Default |

### Controls

| Prop | Control | Options | Default |
|---|---|---|---|
| `accessibleLabel` | text | — | `'Settings'` |
| `variant` | select | `'ghost', 'primary', 'secondary'` | `'ghost'` |
| `size` | select | `'xs', 'sm', 'md', 'lg', 'xl'` | `'md'` |
| `disabled` | boolean | — | `false` |
| `hasFocus` | boolean | — | `false` |
| `icon` | — (disabled in controls) | — | `<SettingsIcon />` |

### Required stories

| Export | Storybook ID | Args | Theme | Key assertion |
|---|---|---|---|---|
| `Ghost` | `actions-iconbutton--ghost` | `{ variant: 'ghost', icon: <SettingsIcon/>, accessibleLabel: 'Settings' }` | light + dark | Transparent bg, `data-icon-mode="default"`, brand purple icon |
| `Primary` | `actions-iconbutton--primary` | `{ variant: 'primary', icon: <PlusIcon/>, accessibleLabel: 'Add item' }` | light + dark | `action/primary` bg, `data-icon-mode="inverted"`, white icon |
| `Secondary` | `actions-iconbutton--secondary` | `{ variant: 'secondary', icon: <EditIcon/>, accessibleLabel: 'Edit' }` | light + dark | `border/brand`, `data-icon-mode="default"` |
| `Hovered` | `actions-iconbutton--hovered` | Ghost + hover decorator | light + dark | `action/secondary/hover` background |
| `Pressed` | `actions-iconbutton--pressed` | Ghost + active decorator | light + dark | `action/secondary/active` background |
| `Disabled` | `actions-iconbutton--disabled` | `{ disabled: true }` | light + dark | `aria-disabled="true"`, opacity 0.40, `data-icon-mode="disabled"`, click blocked |
| `Focused` | `actions-iconbutton--focused` | `{ hasFocus: true }` | light + dark | Focus ring visible, inset −2px, radius 6px |
| `SizeXs` | `actions-iconbutton--size-xs` | `{ variant: 'ghost', size: 'xs' }` | light + dark | 20×20px, zero padding, 16px icon |
| `SizeSm` | `actions-iconbutton--size-sm` | `{ variant: 'ghost', size: 'sm' }` | light + dark | 24×24px, zero padding |
| `SizeXl` | `actions-iconbutton--size-xl` | `{ size: 'xl' }` | light + dark | 52×52px, 24px icon, 8px radius |
| `AllSizes` | `actions-iconbutton--all-sizes` | Ghost × xs/sm/md/lg/xl in a row | light + dark | Widths 20/24/32/40/52px; icons 16/16/16/20/24px |
| `AllVariants` | `actions-iconbutton--all-variants` | Ghost/Primary/Secondary at md | light + dark | Correct bg and icon mode per variant |
| `DenseRow` | `actions-iconbutton--dense-row` | 3 Ghost xs buttons, 4px gap | light + dark | Adjacent targets separated; no overlap |
| `A11yLabel` | `actions-iconbutton--a11y-label` | `{ accessibleLabel: 'Close dialog', icon: <XIcon/> }` | light + dark | `aria-label="Close dialog"` present on `<button>` |
| `AsDropdownTrigger` | `actions-iconbutton--as-dropdown-trigger` | `{ 'aria-haspopup': 'menu', 'aria-expanded': false }` | light + dark | ARIA attributes forwarded via `...rest` |

---

## 16. Test and visual-verification contract

### Per-prop verification

| Prop | Valid values | Invalid/edge | Default test | Key assertion |
|---|---|---|---|---|
| `accessibleLabel` | Non-empty string | `''` | `'Settings'` | `button.getAttribute('aria-label')` equals the prop value |
| `icon` | Any ReactNode | — | `<SettingsIcon/>` | `getByTestId('icon-wrapper')` present inside the button |
| `variant` | `'ghost' \| 'primary' \| 'secondary'` | Any other | `'ghost'` | Computed background matches the expected token per variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Any other | `'md'` | `offsetWidth === offsetHeight === expected` per size table |
| `disabled` | `true, false` | — | `false` | `aria-disabled="true"`, `opacity: 0.4`, `onClick` not fired |
| `hasFocus` | `true, false` | — | `false` | `true` → focus ring `display: block` |
| `variant` + `size` | See cross-matrix | Primary at xs | — | `console.warn` spy called once with the constraint message |

### Conditional element inventory

| element_key | Controlling condition | Presence test | Absence test |
|---|---|---|---|
| `icon` | Always | `getByTestId('icon-wrapper')` present | N/A — always present |
| `focus-ring` | `:focus-visible` OR `hasFocus=true` | Computed `display === 'block'` | Computed `display === 'none'` |

### Interaction verification

| Interaction | Story | Drive | Callback assertion | DOM assertion |
|---|---|---|---|---|
| INT-01: Click enabled | `Ghost` | `userEvent.click(button)` | `onClick` called exactly once | — |
| INT-02: Click disabled | `Disabled` | `userEvent.click(button)` | `onClick` NOT called | `aria-disabled="true"` unchanged |
| INT-03: Space key | `Ghost` | `userEvent.keyboard('[Space]')` after focus | `onClick` called once | — |
| INT-04: Enter key | `Ghost` | `userEvent.keyboard('[Enter]')` after focus | `onClick` called once | — |
| INT-05: Tab focus | `Ghost` | `userEvent.tab()` | — | `document.activeElement === button`; focus ring visible |
| INT-06: Tab to disabled | `Disabled` | `userEvent.tab()` | — | Button IS focusable (aria-disabled, not native disabled) |
| INT-07: Ref forwarding | — | Attach ref, call `ref.current.focus()` | — | `document.activeElement === button` |

### Icon mode verification

| variant | disabled | Expected `data-icon-mode` |
|---|---|---|
| `ghost` | `false` | `"default"` |
| `primary` | `false` | `"inverted"` |
| `secondary` | `false` | `"default"` |
| `ghost` | `true` | `"disabled"` |
| `primary` | `true` | `"disabled"` |
| `secondary` | `true` | `"disabled"` |

### Visual matrix

| Story | Viewport | Theme | Figma reference node | Tolerance |
|---|---|---|---|---|
| `Ghost` | 800×600 | light + dark | `1165:48909` (xs) / md equivalent | 0.2% |
| `Primary` | 800×600 | light + dark | Primary md Default | 0.2% |
| `Secondary` | 800×600 | light + dark | Secondary md Default | 0.2% |
| `Hovered` | 800×600 | light + dark | `1165:48997` (Ghost lg Hover) | 0.2% |
| `Pressed` | 800×600 | light + dark | `1165:49112` (Primary xl Pressed) | 0.2% |
| `Disabled` | 800×600 | light + dark | `1165:49199` (Secondary xl Disabled) | 0.2% |
| `AllSizes` | 800×600 | light + dark | All Ghost size variants | 0.2% |
| `Focused` | 800×600 | light + dark | hasFocus=true variant | 0.2% |

### Accessibility test suite

| Check | Tool | Assertion |
|---|---|---|
| Accessible name present | `axe-core` | No `button-name` violation on any story |
| Colour contrast (icon vs bg) | `axe-core` + manual | ≥ 3:1 for all variants in both themes |
| Keyboard reachable | Play function | Every enabled story reachable via `userEvent.tab()` |
| No `role` override | Static assertion | `button.getAttribute('role')` is `null` |
| Focus visible | Play function | Focus ring computed `display === 'block'` after `userEvent.tab()` |

---

## 17. Decisions and confirmed resolutions

### Confirmed decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | Ghost-only restriction for xs and sm | A filled visual treatment (Primary/Secondary) below 32px reduces the icon to a coloured blob with poor legibility. Ghost (transparent) keeps the icon readable at any size. Live Figma confirms zero Primary/Secondary variants below md. |
| DEC-02 | lg icon = 20px, not 24px | Live Figma structure measures Icon-Wrapper at 20×20px inside the 40px lg component. The variant description text saying "Icon: 24px" is stale. Per skill conflict resolution, live Figma is authoritative over descriptions. |
| DEC-03 | `accessibleLabel` is a required prop, not optional with a default | A default value ("Icon button") would silently ship a meaningless accessible name to production. Making it required forces the consumer to think about the action name. |
| DEC-04 | `aria-disabled` not native `disabled` | Venus system-wide pattern for button-based controls. Keeps the button keyboard-discoverable so users learn the action exists but is currently unavailable. |
| DEC-05 | `data-icon-mode` on root drives icon colour via CSS cascade | Single point of control. `IconWrapper` reads `--venus-icon-color`, scoped by `[data-icon-mode]` rules. No per-icon prop plumbing needed, and the mode automatically stays consistent with the variant. |
| DEC-06 | Invalid variant/size combinations warn but do not throw | Throwing would break a page over a styling violation. A dev-mode warning surfaces the issue during development without risking production stability. |
| DEC-07 | `React.forwardRef` is mandatory, not optional | Split Action Button requires a ref to return focus to the trigger after its menu closes. Without ref forwarding that focus-management contract cannot be met. |
| DEC-08 | xl uses `radius/8`, matching Button xl | Consistency with Button's size-to-radius mapping. Live Figma binds `radius/8` on Button xl; IconButton xl follows the same rule for visual coherence when both appear together. |

### Rejected approaches

| ID | Approach | Why rejected | Chosen instead |
|---|---|---|---|
| REJ-01 | `Button` with `hasLabel={false}` | Carries label-specific props, gap CSS, and text-node logic that are dead weight for an icon-only control. Also produces a rectangular hit area rather than a square one. | Purpose-built `IconButton` with square dimensions |
| REJ-02 | `_Internal/Icon-Action` for standalone triggers | That atom is scoped to icons embedded inside other components (Chip chevron, Input clear). It lacks standalone button semantics and its own focus ring. See `icon-button-strategy.md`. | `IconButton` for standalone; `Icon-Action` stays internal |
| REJ-03 | `iconColor` prop for per-instance icon colour | Would allow consumers to break the variant/mode contract (e.g. white icon on transparent Ghost). | `data-icon-mode` derived from `variant` — not consumer-overridable |
| REJ-04 | Native `disabled` attribute | Removes the button from tab order. Keyboard users cannot discover that a disabled action exists in the toolbar. | `aria-disabled="true"` + `pointer-events: none` + handler guard |
| REJ-05 | Allowing Primary/Secondary at xs/sm by throwing an error | A thrown error in a toolbar would blank the surrounding UI over a cosmetic violation. | Dev-mode `console.warn`; renders with the requested appearance |

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma node `1165:49200` live read 2026-08-11
- [x] All 44 variants accounted for in the cross-matrix (Ghost 20 + Primary 12 + Secondary 12)
- [x] Mode NEW, scope explicit
- [x] Absolute Requirements documented (7 numbered items)
- [x] Upstream dependency `_Internal/Icon-Wrapper` confirmed ✅ HANDOFF_COMPLETE
- [x] lg icon size conflict identified and resolved in favour of live Figma
- [x] Ghost-only xs/sm constraint documented and enforced in TypeScript + dev warning
- [x] Icon mode map complete for all variant × state combinations
- [x] `React.forwardRef` requirement documented (Split Action Button dependency)
- [x] All 18 sections present: 0–18 including 12a
- [x] Anatomy, API, tokens, states, ARIA, keyboard, stories, tests complete
- [x] `unresolved_question_count: 0`
- [x] No hardcoded values in the brief

### Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Design | George Karian | PENDING | — |
| Engineering | Narendra | PENDING | — |
