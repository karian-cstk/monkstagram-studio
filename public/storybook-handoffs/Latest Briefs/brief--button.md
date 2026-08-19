---
brief_schema: venus-storybook-handover/v2
component_name: "Button"
component_kebab_case: "button"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1489-30020"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "1489:30020"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Actions/Button"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  COMPONENT_NAME:        Button
  REACT_COMPONENT:       Button
  STORYBOOK_TITLE:       Actions/Button
  FIGMA_NODE_ID:         1489:30020
  CSS_CLASS_PREFIX:      button
  FILE_NAME:             Button.tsx
  STORY_FILE_NAME:       Button.stories.tsx
  CSS_FILE_NAME:         Button.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
-->

# Button — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | Must render as native `<button type="button">` | Native button provides free keyboard behaviour (Space/Enter), form semantics, and AT announcement |
| 2 | Icon mode must match `variant`: Primary/Destructive → `inverted` (white icon); Secondary/Tertiary/Ghost → `default` (brand purple); all `disabled` → `disabled` (gray) | Wrong icon mode = wrong icon colour in production. Confirmed in `06-component-and-handoff_skill` and venus-21-rf-master. |
| 3 | No Destructive/Pressed variant exists — this is intentional | Live Figma confirmed: Destructive does not have a Pressed state across any size. Do not create one. |
| 4 | `sm` size (24px height) is a **governance-approved exception** — for dense panel contexts only (LHSB footer, compact toolbars). Never use in main content, forms, or primary CTAs. | Constitution documents: "sm added 2026-07-17. Dense panel contexts only." Standard Venus no-sm rule applies everywhere else. |
| 5 | Disabled uses `aria-disabled="true"` — NOT native `disabled` attribute | Keeps button keyboard-discoverable. Venus system-wide pattern for button-based controls. |
| 6 | `hasLeadingIcon` and `hasTrailingIcon` default to **true** in Figma | Confirmed from component properties: `hasLeadingIcon` and `hasTrailingIcon` both default to `true`. In React, default to `false` — only show icons when explicitly provided. |
| 7 | Opacity `VariableID:564:3251` is bound to the root on non-disabled non-sm variants. This appears to be `visibility/enabled` = 1.0 for explicit token binding. It does NOT affect visual appearance. | Live Figma confirmed. Do not add opacity in CSS for non-disabled states. |
| 8 | Focus ring stroke = `border/focus` (`VariableID:564:3210`) — same as Chip, different ID from most other components that use `564:3227`. Both resolve to `border/focus`. | Live Figma confirmed. Visual result is identical. |
| 9 | **Icon size discrepancy vs master file**: Live Figma shows lg icon = **24px**, xl icon = **28px**. Master file (`venus-21-rf-master.md`) says lg=20px. Live Figma is authoritative. | Per skill conflict resolution rules: live Figma > master file. Brief documents live values. Master should be corrected. |

---

## 0. Evidence and source contract

| Source | Reference | Date | Establishes |
|---|---|---|---|
| Figma live read | Node `1489:30020`, 🔘 Actions | 2026-08-11 | All 76 variants, dimensions, children, token bindings, icon sizes |
| Constitution | `00-project-constitution.md` | 2026-08-11 | sm size governance, 76 variant confirmation |
| `06-component-and-handoff_skill.md` | Icon Mode Map | 2026-08-11 | inverted/default/disabled icon mode rules |
| `_Internal/Icon-Wrapper` brief | `214:152884` | 2026-08-11 | Upstream dep ✅ HANDOFF_COMPLETE |

### Conflict resolved: icon size

| Source | lg icon | xl icon |
|---|---|---|
| `venus-21-rf-master.md` | 20px | 28px |
| Live Figma (2026-08-11) | **24px** | **28px** |
| **This brief uses** | **24px** | **28px** |

Master file should be updated to correct lg=24px. This brief uses the live-verified values.

---

## 1. Outcome and scope

**Definition:** The primary interactive trigger for user-initiated actions in Contentstack CMS, available in five semantic types, four sizes, and four interaction states.

**User need:** Content editors and developers need clearly differentiated action triggers — primary CTAs, secondary supporting actions, minimal text actions, and destructive operations — that communicate affordance and danger through consistent visual treatment.

### Use cases

| ID | Use case | Variant | Size |
|---|---|---|---|
| UC-01 | Primary CTA ("Save", "Publish") | Primary | lg (default for forms) |
| UC-02 | Secondary supporting action ("Cancel", "Preview") | Secondary | lg |
| UC-03 | Minimal text action in toolbar | Ghost | md |
| UC-04 | Destructive action ("Delete", "Remove") | Destructive | lg |
| UC-05 | Compact toolbar trigger in LHSB footer | Any | sm (governance exception) |

### Scope

| In scope | Out of scope |
|---|---|
| 5 types: Primary / Secondary / Tertiary / Ghost / Destructive | Split Action Button (separate component) |
| 4 sizes: sm (24px, restricted) / md (32px) / lg (40px) / xl (52px) | Button Group (separate component) |
| 4 states: Default / Hover / Pressed / Disabled | Icon-only button (use Icon Button component) |
| `hasLeadingIcon`, `hasTrailingIcon`, `hasLabel` booleans | Router-level active/current state |

### Responsibility boundary

| Button owns | Consumer owns |
|---|---|
| Visual state, icon mode, focus ring | Action logic on click |
| `aria-disabled`, `aria-busy` if loading | Loading state management |
| Icon sizing and mode per variant | Choosing which icon to display |
| sm-context enforcement (warning in dev) | Ensuring sm is only used in approved contexts |

---

## 2. Existing baseline

`N/A — new component.`

---

## 3. Composition and reuse

| Concern | Decision |
|---|---|
| Architecture | Native `<button>` with Icon-Wrapper children |
| Upstream dep | `IconWrapper` (`214:152884`) — ✅ HANDOFF_COMPLETE |
| Prohibited | `<a>` masquerading as a button. `<div role="button">`. `hasLeadingIcon=false` with `hasLabel=false` (use Icon Button instead). |

### Dependency tree

| Direction | Component | Blocks |
|---|---|---|
| Upstream | `IconWrapper` | Yes — ✅ done |
| Downstream | Split Action Button | Cannot build until this brief is HANDOFF_COMPLETE |

---

## 4. Anatomy

| element_key | Layer name | Visibility | Condition | Semantic |
|---|---|---|---|---|
| `root` | `button` | REQUIRED | Always | `<button type="button">`, `data-testid="button"` |
| `leading-icon` | `_Internal/Icon-Wrapper` (leading) | OPTIONAL | `hasLeadingIcon=true` AND `leadingIcon` provided | `IconWrapper`, `aria-hidden` |
| `label` | `label` | OPTIONAL | `hasLabel=true` | `<span>`, text content |
| `trailing-icon` | `_Internal/Icon-Wrapper` (trailing) | OPTIONAL | `hasTrailingIcon=true` AND `trailingIcon` provided | `IconWrapper`, `aria-hidden` |
| `focus-ring` | `focus-ring` | INTERNAL | `:focus-visible` / `hasFocus=true` | ABSOLUTE, inset −2px |

> **Icon-only mode:** `hasLabel=false` with icon(s) present. Must provide `aria-label` — the button has no text. Do not use for standalone icon triggers — use Icon Button component instead.

---

## 5. Public React API

### TypeScript interface

```typescript
/**
 * Primary interactive trigger for user actions in Contentstack CMS.
 * Five semantic types, four sizes, four states.
 *
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1489-30020
 */
export interface ButtonProps {
  /** Button label text. */
  label?: string;
  /**
   * Semantic type. Controls background, border, text, and icon color.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';
  /**
   * Size. sm is restricted to dense panel contexts (LHSB footer, compact toolbars).
   * Default is 'md' for most contexts; 'lg' is recommended for main content forms.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show leading icon. @default false */
  hasLeadingIcon?: boolean;
  /** Leading icon element. Required when hasLeadingIcon=true. */
  leadingIcon?: React.ReactNode;
  /** Show trailing icon. @default false */
  hasTrailingIcon?: boolean;
  /** Trailing icon element. Required when hasTrailingIcon=true. */
  trailingIcon?: React.ReactNode;
  /** Show label text. @default true */
  hasLabel?: boolean;
  /** Disables the button. Uses aria-disabled — not native disabled. @default false */
  disabled?: boolean;
  /** Storybook demo only — shows focus ring. @default false */
  hasFocus?: boolean;
  /** Click handler. Not called when disabled. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Forwarded to button. Use for form submission: type="submit". @default 'button' */
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  /** Required when hasLabel=false — provides accessible name. */
  'aria-label'?: string;
}
```

### JSX base component

```tsx
const iconSizeMap = { sm: 16, md: 16, lg: 24, xl: 28 } as const;

const iconModeMap = {
  primary: 'inverted', secondary: 'default', tertiary: 'default',
  ghost: 'default', destructive: 'inverted'
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, variant = 'primary', size = 'md', hasLeadingIcon = false, leadingIcon,
     hasTrailingIcon = false, trailingIcon, hasLabel = true, disabled = false,
     hasFocus = false, onClick, type = 'button', className, ...rest }, ref) => {

    const iconSize = iconSizeMap[size];
    const iconMode = disabled ? 'disabled' : iconModeMap[variant];

    if (process.env.NODE_ENV !== 'production' && size === 'sm') {
      console.warn('[Button] size="sm" is restricted to dense panel contexts (LHSB footer, compact toolbars). Do not use in main content, forms, or primary CTAs.');
    }

    return (
      <button ref={ref} type={type}
        aria-disabled={disabled || undefined}
        data-testid="button"
        data-icon-mode={iconMode}
        className={[styles.button, styles[`button--${variant}`], styles[`button--${size}`],
          disabled ? styles['button--disabled'] : '',
          hasFocus ? styles['button--focused'] : '', className].filter(Boolean).join(' ')}
        style={disabled ? { opacity: 'var(--venus-visibility-disabled)' } : undefined}
        onClick={(e) => { if (!disabled) onClick?.(e); }}
        {...rest}>
        <span className={styles['button__focus-ring']} aria-hidden="true" />
        {hasLeadingIcon && leadingIcon && <IconWrapper size={iconSize} icon={leadingIcon} />}
        {hasLabel && label && <span className={styles['button__label']}>{label}</span>}
        {hasTrailingIcon && trailingIcon && <IconWrapper size={iconSize} icon={trailingIcon} />}
      </button>
    );
  }
);
```

**Key CSS:**
```css
/* ── Base ───────────────────────────── */
.button { display: inline-flex; align-items: center; justify-content: center;
  border: none; cursor: pointer; font-family: var(--venus-font-inter);
  font-weight: 500; border-radius: var(--venus-radius-4, 4px); position: relative;
  transition: background 120ms ease, border-color 120ms ease; }

/* ── Sizes ──────────────────────────── */
.button--sm  { height: 24px; padding-inline: var(--venus-space-12, 12px); gap: var(--venus-space-4, 4px); font-size: 12px; }
.button--md  { height: 32px; padding: var(--venus-space-8, 8px);  gap: var(--venus-space-4, 4px); font-size: 14px; }
.button--lg  { height: 40px; padding: var(--venus-space-8, 8px);  gap: var(--venus-space-8, 8px); font-size: 16px; border-radius: var(--venus-radius-4, 4px); }
.button--xl  { height: 52px; padding: var(--venus-space-12, 12px); gap: var(--venus-space-8, 8px); font-size: 18px; border-radius: var(--venus-radius-8, 8px); }

/* ── Variants ───────────────────────── */
.button--primary    { background: var(--venus-action-primary);    color: var(--venus-text-on-brand); }
.button--primary:hover:not(.button--disabled) { background: var(--venus-action-primary-hover); }
.button--primary:active:not(.button--disabled) { background: var(--venus-action-primary-pressed); }

.button--secondary  { background: var(--venus-action-secondary);  color: var(--venus-text-brand);
  border: 1px solid var(--venus-border-brand); }
.button--secondary:hover:not(.button--disabled) { background: var(--venus-action-secondary-hover); }
.button--secondary:active:not(.button--disabled) { background: var(--venus-action-secondary-active); }

.button--tertiary   { background: var(--venus-surface-default);   color: var(--venus-text-default);
  border: 1px solid var(--venus-border-default); }
.button--tertiary:hover:not(.button--disabled) { background: var(--venus-action-ghost-hover); }
.button--tertiary:active:not(.button--disabled) { background: var(--venus-action-tertiary-pressed); }

.button--ghost      { background: transparent;  color: var(--venus-text-brand); }
.button--ghost:hover:not(.button--disabled) { background: var(--venus-action-ghost-hover); }
.button--ghost:active:not(.button--disabled) { background: var(--venus-action-ghost-pressed); }

.button--destructive { background: var(--venus-action-destructive); color: var(--venus-text-on-destructive); }
.button--destructive:hover:not(.button--disabled) { background: var(--venus-action-destructive-hover); }
/* No Destructive Pressed — intentional */

/* ── Disabled ───────────────────────── */
.button--disabled { pointer-events: none; cursor: not-allowed; }

/* ── Focus ring ─────────────────────── */
.button__focus-ring { display: none; position: absolute; inset: -2px;
  border: 2px solid var(--venus-border-focus); pointer-events: none;
  border-radius: calc(var(--venus-radius-4, 4px) + 2px); }
.button--xl .button__focus-ring { border-radius: calc(var(--venus-radius-8, 8px) + 2px); }
.button--focused .button__focus-ring,
.button:focus-visible .button__focus-ring { display: block; }

@media (prefers-reduced-motion: reduce) { .button { transition: none; } }
```

---

## 6. Figma → React mapping

| Figma property | React prop | Mapping |
|---|---|---|
| `Type` (VARIANT) | `variant` | direct (lowercase) |
| `Size` (VARIANT) | `size` | direct |
| `State=Disabled` | `disabled=true` | `aria-disabled` + opacity |
| `State=Hover` | `:hover` | CSS pseudo — never a prop |
| `State=Pressed` | `:active` | CSS pseudo — never a prop |
| `label#1489:33` (TEXT) | `label` | direct |
| `hasLeadingIcon#1489:29` (BOOLEAN) | `hasLeadingIcon` | Figma default=true; React default=false |
| `hasTrailingIcon#1489:30` (BOOLEAN) | `hasTrailingIcon` | Figma default=true; React default=false |
| `hasLabel#1489:31` (BOOLEAN) | `hasLabel` | direct |
| `hasFocus#1489:32` (BOOLEAN) | `hasFocus` | Storybook demo only |

---

## 7. Variants, states, and precedence

### Size contract (live-verified 2026-08-11)

| Size | Height | PaddingH | Gap | Icon | Font | Border radius | Context |
|---|---|---|---|---|---|---|---|
| `sm` | **24px** | 12px | 4px | 16px | 12px | 4px | Governance exception — dense panels only |
| `md` | **32px** | 8px | 4px | 16px | 14px | 4px | Default |
| `lg` | **40px** | 8px | 8px | **24px** (live) | 16px | 4px | Main content forms |
| `xl` | **52px** | 12px | 8px | **28px** | 18px | 8px | Hero / empty states |

> ⚠️ `venus-21-rf-master.md` says lg icon = 20px. Live Figma shows 24px. **Live Figma is authoritative.** Master file requires correction.

### Variant cross-matrix

| Type | Default | Hover | Pressed | Disabled |
|---|---|---|---|---|
| Primary | ✓ `633:12351` | ✓ | ✓ | ✓ |
| Secondary | ✓ | ✓ | ✓ | ✓ |
| Tertiary | ✓ | ✓ | ✓ | ✓ |
| Ghost | ✓ | ✓ | ✓ | ✓ |
| Destructive | ✓ `633:12361` | ✓ | **✗ — no Pressed** | ✓ |

Each of the above × 4 sizes = 76 total (Destructive missing Pressed for all 4 sizes = 4 fewer = 76 ✓).

### Appearance per variant

| Variant | Background | Label colour | Border | Icon mode |
|---|---|---|---|---|
| Primary | `action/primary` | `text/on-brand` (white) | None | `inverted` |
| Secondary | `action/secondary` (transparent) | `text/brand` | `border/brand` | `default` |
| Tertiary | `surface/default` | `text/default` | `border/default` | `default` |
| Ghost | transparent | `text/brand` | None | `default` |
| Destructive | `action/destructive` | `text/on-destructive` (white) | None | `inverted` |
| Any disabled | Same as default at 0.40 opacity | — | — | `disabled` |

---

## 8. Functional behavior

| Rule | Behavior |
|---|---|
| BR-01 | `disabled=true` → `onClick` not fired; `aria-disabled="true"`; pointer-events:none |
| BR-02 | `hasLabel=false` requires `aria-label` on root — dev warning if missing |
| BR-03 | `size='sm'` emits dev console warning if used outside approved contexts (checked by consumer) |
| BR-04 | Destructive/Pressed does not exist — if Pressed state is triggered on Destructive, `:active` falls through to default Destructive appearance |

---

## 9. Interactions and focus

**Keyboard:** Space / Enter activate. Tab / Shift+Tab move focus. No special routing.

**Focus ring:** `border/focus` (`VariableID:564:3210`), 2px, inset −2px. `border-radius` matches size: md/lg = 4px+2px, xl = 8px+2px.

**Icon mode set via `data-icon-mode`** on root — `IconWrapper` inherits via CSS cascade:
```tsx
data-icon-mode={disabled ? 'disabled' : iconModeMap[variant]}
```

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `variant="destructive"` for delete/remove actions | Use `variant="primary"` for destructive actions |
| Use `size="lg"` as the default for main content forms | Use `size="sm"` in main content or forms |
| Provide `aria-label` on icon-only buttons | Leave icon-only buttons without accessible names |
| Use `aria-disabled` not native `disabled` | Use native `disabled` on buttons (removes from tab order) |
| Use Icon Button for standalone icon triggers | Use `hasLabel=false` on Button for icon-only triggers |

---

## 13. Tokens, typography, and assets

### Background tokens per variant + state

| Variant | Default | Hover | Pressed | VariableIDs (Default) |
|---|---|---|---|---|
| Primary | `action/primary` | `action/primary/hover` | `action/primary/pressed` | `564:3217` |
| Secondary | `action/secondary` | `action/secondary/hover` | `action/secondary/active` | (transparent) |
| Tertiary | `surface/default` | `action/ghost/hover` | `action/tertiary/pressed` | `563:3180` |
| Ghost | transparent | `action/ghost/hover` | `action/ghost/pressed` | `564:3225` |
| Destructive | `action/destructive` | `action/destructive/hover` | (none) | `564:3223` |

### Label text tokens

| Variant | Token | VariableID |
|---|---|---|
| Primary, Destructive | `text/on-brand` (white) | `564:3198` |
| Secondary (hover) | `text/link/hover` | `564:3201` |
| Secondary, Tertiary, Ghost | `text/default` / `text/brand` | `564:3192` / `564:3199` |
| Destructive label | `text/on-destructive` (white) | `564:3197` |

### Opacity

| State | Token | VariableID | Value |
|---|---|---|---|
| Disabled | `visibility/disabled` | `564:3246` | **0.40** |
| Non-disabled non-sm root | `visibility/enabled` (explicit binding) | `564:3251` | 1.0 |

### Border radius

| Size | Token | VariableID | Value |
|---|---|---|---|
| sm, md, lg | `radius/4` | `546:3078` | 4px |
| xl | `radius/8` | `546:3080` | 8px |

### Icon mode map (required — Absolute Requirement #2)

| Variant | State | Mode | `data-icon-mode` |
|---|---|---|---|
| Primary | Non-disabled | `inverted` (white) | `inverted` |
| Destructive | Non-disabled | `inverted` (white) | `inverted` |
| Secondary / Tertiary / Ghost | Non-disabled | `default` (brand purple) | `default` |
| Any | Disabled | `disabled` (gray) | `disabled` |

### Typography

| Size | Font | Weight | Size |
|---|---|---|---|
| sm | Inter | 500 | 12px |
| md | Inter | 500 | 14px (Body/MD `546:3108`) |
| lg | Inter | 500 | 16px (Body/LG `546:3109`) |
| xl | Inter | 500 | 18px (Body/XL `546:3110`) |

---

## 14. Accessibility

| Concern | Requirement |
|---|---|
| Root | `<button type="button">` |
| `aria-disabled` | `"true"` when `disabled=true`. Never native `disabled`. |
| Accessible name | Implicit from `label`. Explicit `aria-label` required when `hasLabel=false`. |
| Icon mode | Icons are `aria-hidden` via Icon-Wrapper. Label or `aria-label` provides the accessible name. |
| Focus ring | 2px `border/focus`, inset −2px, `border-radius` matches size |
| Keyboard | Space / Enter activate. No custom key handling needed. |

---

## 15. Storybook contract

All stories: CSF3, light + dark, `layout: 'centered'`.

| Export | Args | Key assertion |
|---|---|---|
| `Primary` | `{ variant: 'primary', label: 'Save' }` | `action/primary` background, white label/icons |
| `Secondary` | `{ variant: 'secondary' }` | `border/brand`, `text/brand` |
| `Tertiary` | `{ variant: 'tertiary' }` | `border/default`, `text/default` |
| `Ghost` | `{ variant: 'ghost' }` | Transparent bg, `text/brand` |
| `Destructive` | `{ variant: 'destructive' }` | `action/destructive` bg, white text |
| `Disabled` | `{ disabled: true }` | `aria-disabled="true"`, opacity 0.40 |
| `WithLeadingIcon` | `{ hasLeadingIcon: true, leadingIcon: <PlusIcon/> }` | Icon before label, correct icon mode |
| `WithTrailingIcon` | `{ hasTrailingIcon: true, trailingIcon: <ChevronIcon/> }` | Icon after label |
| `IconModes` | All 5 variants side by side | Icon color correct per variant |
| `AllSizes` | Primary × sm/md/lg/xl | Heights 24/32/40/52px |
| `Focused` | `{ hasFocus: true }` | Focus ring visible |
| `SizeSm` | `{ size: 'sm' }` | 24px height, 12px label — dev warning logged |
| `Pressed` | Primary + active decorator | `:active` state |

---

## 16. Test contract

| Assertion | Test |
|---|---|
| Variant backgrounds | Computed background matches expected token per variant |
| Icon mode | `data-icon-mode` attribute matches expected value per variant |
| Disabled | `aria-disabled="true"`, opacity 0.40, `onClick` not fired |
| `hasLabel=false` | Label span absent, `aria-label` required |
| Size heights | `offsetHeight` matches expected per size |
| No Destructive/Pressed | No CSS `:active` override for Destructive — falls through to default |

---

## 17. Decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | lg icon = 24px (not 20px as in master) | Live Figma 2026-08-11 is authoritative over master. Master must be corrected. |
| DEC-02 | No Destructive/Pressed state | Intentional design decision. Pressing a destructive button does not need a distinct Pressed visual — doing so could encourage the action. Live Figma confirms: 0 Destructive/Pressed variants. |
| DEC-03 | sm size is a governance exception | Constitution documents sm was added 2026-07-17 for LHSB footer and compact toolbars only. Standard Venus no-sm rule applies everywhere else. Dev warning added in JSX. |
| DEC-04 | `aria-disabled` not native `disabled` | Venus button-based component pattern. Keeps button keyboard-discoverable and in tab order. |
| DEC-05 | `data-icon-mode` drives icon colour | Icon-Wrapper inherits `--venus-icon-color` via CSS cascade from parent `[data-icon-mode]` attribute. Single point of control — no per-icon prop needed. |
| DEC-06 | Figma `hasLeadingIcon` defaults to `true` — React defaults to `false` | Figma defaults show icons visible for demo purposes. React API default=false is the correct production default — icons only appear when explicitly provided. |

### Rejected approaches

| ID | Approach | Why rejected |
|---|---|---|
| REJ-01 | `<a>` with button styling | Wrong semantics. Button triggers actions; `<a>` navigates. |
| REJ-02 | Separate icon color prop | Parent `data-icon-mode` → CSS cascade handles this cleanly for all variants without per-icon props. |
| REJ-03 | Native `disabled` attribute | Removes from tab order — Venus system-wide decision to use `aria-disabled` instead. |

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Sign-off

| Role | Name | Status |
|---|---|---|
| Design | George Karian | PENDING |
| Engineering | Narendra | PENDING |
