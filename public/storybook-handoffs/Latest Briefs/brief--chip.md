---
brief_schema: venus-storybook-handover/v2
component_name: "Chip"
component_kebab_case: "chip"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1272-31030"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "1272:31030"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Actions/Chip"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  COMPONENT_NAME:        Chip
  REACT_COMPONENT:       Chip
  STORYBOOK_TITLE:       Actions/Chip
  FIGMA_NODE_ID:         1272:31030
  CSS_CLASS_PREFIX:      chip
  FILE_NAME:             Chip.tsx
  STORY_FILE_NAME:       Chip.stories.tsx
  CSS_FILE_NAME:         Chip.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
-->

# Chip (Filter Chip) — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | The chip contains **two independent interactive zones** — the dropdown trigger (chevron area) and the close button (×) — each must be a separate `<button>` | Two distinct actions with different outcomes. A single click handler cannot distinguish them. WCAG 2.1 requires each action to be individually operable. |
| 2 | The close button must have `aria-label="Remove [field] filter"` | The × icon has no text. Screen readers need the accessible label to announce the action. |
| 3 | The dropdown trigger must have `aria-haspopup="listbox"` or `aria-haspopup="dialog"` when `hasDropdown=true` | Communicates to AT that clicking will open a selection overlay — prevents surprising navigation. |
| 4 | `badgeIntent` instance swap controls which `Badge/Counter` variant is used — brand (default) or brand-secondary (lavender). Both are valid. Only these two intents are supported. | Documented in constitution: "badgeIntent INSTANCE_SWAP prop added 2026-07-08. Swaps between intent=brand (default) and intent=brand-secondary (lavender)." |
| 5 | Single size only: 32px height, 12px label (Label/SM), no vertical padding | Confirmed from live Figma: `paddingTop=0, paddingBottom=0`. The 32px height comes from the chip-label line height + auto-layout constraints. |
| 6 | Focus ring stroke = `border/focus` (`VariableID:564:3210`) — the chip uses a different focus variable than other components | Confirmed live read: chip-focus-ring uses `564:3210` not `564:3227`. Both resolve to `border/focus` — same visual result. |

---

## 0. Evidence and source contract

| Source | Reference | Date | Establishes |
|---|---|---|---|
| Figma live read | Node `1272:31030`, 🔘 Actions | 2026-08-11 | 4 variants, all children, all token bindings |
| Constitution | `00-project-constitution.md` | 2026-08-11 | `badgeIntent` INSTANCE_SWAP history, 4 variants confirmed |

---

## 1. Outcome and scope

**Definition:** A filter chip — a compact interactive control for managing active table/list filters, with a label, optional leading icon, optional counter badge, a dropdown trigger, and a clear button.

**User need:** Data-list users in Contentstack need to see which filters are active, know how many values are selected within each filter (via badge), expand to modify filter values, and quickly clear individual filters.

### Scope

| In scope | Out of scope |
|---|---|
| 4 states: Default / Hover / Selected / Disabled | Multiple sizes |
| `hasCounter`, `hasDropdown`, `hasClose`, `hasLeadingIcon` booleans | Tag-style chip without dropdown (use Tag component) |
| `badgeIntent` swap: brand / brand-secondary | Other badge intents |

### Responsibility boundary

| Chip owns | Consumer owns |
|---|---|
| Visual state, focus ring | Opening/closing the filter dropdown |
| Counter badge display (count value) | Updating the counter value |
| Accessible labels on close and dropdown buttons | Popover/dropdown content |
| Disabled state | Resetting or persisting filters |

---

## 2. Existing baseline

`N/A — new component.`

---

## 3. Composition and reuse

| Concern | Decision |
|---|---|
| Architecture | Compound — outer `<div>` container with two `<button>` children (dropdown trigger + close) |
| Upstream deps | `IconWrapper` (`214:152884`) ✅, `Badge/Counter` (brief pending) |
| Note | `Badge/Counter` is used via the `badgeIntent` swap. Its brief will be created when the Feedback page is processed. For now, reference by component name. |

### Dependency tree

| Direction | Component | Status |
|---|---|---|
| Upstream | `IconWrapper` | ✅ HANDOFF_COMPLETE |
| Upstream | `Badge/Counter` | 📝 NEEDS_HANDOFF (Feedback page) |
| Downstream | Data table filter bar | N/A |

---

## 4. Anatomy

| element_key | Layer name | Visibility | Condition | Semantic |
|---|---|---|---|---|
| `root` | `chip` | REQUIRED | Always | `<div role="group">`, `data-testid="chip"` |
| `focus-ring` | `chip-focus-ring` | INTERNAL | `hasFocus` / `:focus-within` | `aria-hidden`, ABSOLUTE, inset −2px |
| `leading-icon` | `chip-leading-icon-slot` | OPTIONAL | `hasLeadingIcon=true` | `IconWrapper` 16px, `aria-hidden` |
| `label` | `chip-label` | REQUIRED | Always | `<span>`, 12px/500 |
| `counter` | `chip-counter-slot` | OPTIONAL | `hasCounter=true` | `Badge/Counter` instance |
| `dropdown-trigger` | `chip-chevron-slot` | OPTIONAL | `hasDropdown=true` | `<button aria-haspopup="listbox">`, chevron icon |
| `close-button` | `chip-close-slot` | OPTIONAL | `hasClose=true` | `<button aria-label="Remove [label] filter">`, × icon |

---

## 5. Public React API

### TypeScript interface

```typescript
/**
 * Filter chip — for managing active filters in data tables and lists.
 * Contains a dropdown trigger and close button as separate interactive zones.
 *
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1272-31030
 */
export interface ChipProps {
  /** Filter field name displayed as label. */
  label: string;
  /** Visual state. @default 'default' */
  state?: 'default' | 'hover' | 'selected' | 'disabled';
  /** Show leading icon before label. @default false */
  hasLeadingIcon?: boolean;
  /** Leading icon element. */
  leadingIcon?: React.ReactNode;
  /** Show counter badge. @default false */
  hasCounter?: boolean;
  /** Count to display in the badge. */
  count?: number;
  /**
   * Badge color intent.
   * 'brand' = purple fill + white text (default)
   * 'brand-secondary' = lavender fill + purple text
   * @default 'brand'
   */
  badgeIntent?: 'brand' | 'brand-secondary';
  /** Show dropdown trigger chevron. @default true */
  hasDropdown?: boolean;
  /** Called when dropdown trigger is clicked. */
  onDropdownClick?: () => void;
  /** aria-expanded state for dropdown trigger. */
  dropdownOpen?: boolean;
  /** Show close/clear button. @default true */
  hasClose?: boolean;
  /** Called when close button is clicked. */
  onClose?: () => void;
  /** Disables all interaction. @default false */
  disabled?: boolean;
  /** Storybook demo only — shows focus ring. @default false */
  hasFocus?: boolean;
  className?: string;
}
```

### JSX base component

```tsx
export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ label, state = 'default', hasLeadingIcon = false, leadingIcon,
     hasCounter = false, count, badgeIntent = 'brand',
     hasDropdown = true, onDropdownClick, dropdownOpen = false,
     hasClose = true, onClose, disabled = false, hasFocus = false,
     className, ...rest }, ref) => {
    return (
      <div ref={ref} role="group" data-testid="chip"
        className={[styles.chip, styles[`chip--${state}`],
          disabled ? styles['chip--disabled'] : '',
          hasFocus ? styles['chip--focused'] : '', className].filter(Boolean).join(' ')}
        aria-disabled={disabled || undefined}>
        {/* Focus ring — visible on :focus-within in production */}
        <span className={styles['chip__focus-ring']} aria-hidden="true" />
        {hasLeadingIcon && leadingIcon && (
          <IconWrapper size={16} icon={leadingIcon} />
        )}
        <span className={styles['chip__label']}>{label}</span>
        {hasCounter && typeof count === 'number' && (
          <Badge intent={badgeIntent} count={count} size="sm" />
        )}
        {hasDropdown && (
          <button type="button" className={styles['chip__dropdown-trigger']}
            aria-haspopup="listbox" aria-expanded={dropdownOpen}
            aria-label={`${label} filter options`}
            disabled={disabled} onClick={onDropdownClick}>
            <IconWrapper size={16} icon={<ChevronDownIcon />} />
          </button>
        )}
        {hasClose && (
          <button type="button" className={styles['chip__close-button']}
            aria-label={`Remove ${label} filter`}
            disabled={disabled} onClick={onClose}>
            <IconWrapper size={16} icon={<XIcon />} />
          </button>
        )}
      </div>
    );
  }
);
```

**Key CSS:**
```css
.chip { display: inline-flex; align-items: center; gap: var(--venus-space-4, 4px);
  padding-inline: var(--venus-space-8, 8px); height: 32px; border-radius: var(--venus-radius-4, 4px);
  background: var(--venus-surface-raised); border: 1px solid var(--venus-border-default);
  position: relative; }
.chip--selected { background: var(--venus-action-secondary-hover); border-color: var(--venus-border-brand); }
.chip--hover { background: var(--venus-action-ghost-hover); }
.chip--disabled { opacity: var(--venus-visibility-disabled); pointer-events: none; }
.chip__label { font-size: 12px; font-weight: 500; color: var(--venus-text-default);
  font-family: var(--venus-font-inter); white-space: nowrap; }
.chip__focus-ring { display: none; position: absolute; inset: -2px;
  border: 2px solid var(--venus-border-focus); border-radius: calc(var(--venus-radius-4, 4px) + 2px); pointer-events: none; }
.chip--focused .chip__focus-ring,
.chip:focus-within .chip__focus-ring { display: block; }
.chip__dropdown-trigger, .chip__close-button {
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none; cursor: pointer; padding: 0; }
```

---

## 6. Figma → React mapping

| Figma property | React prop | Notes |
|---|---|---|
| `State` (VARIANT) | `state` | Hover/Default/Selected/Disabled → CSS / prop |
| `label#1272:27` (TEXT) | `label` | direct |
| `hasLeadingIcon#1272:28` | `hasLeadingIcon` | direct |
| `hasCounter#1272:29` | `hasCounter` | direct; `count` prop carries the number |
| `hasDropdown#1272:30` | `hasDropdown` | direct |
| `hasFocus#1272:31` | `hasFocus` | Storybook demo only |
| `hasClose#1272:32` | `hasClose` | direct |
| `badgeIntent#1272:59` (INSTANCE_SWAP) | `badgeIntent: 'brand' \| 'brand-secondary'` | Maps Badge/Counter variant via enum |

---

## 7. Variants and states

### Size contract

Single size: **32px height**, `paddingH=8px`, `paddingV=0`, `gap=4px`, label 12px/500.

### State table

| State | Trigger | Background | Border | Label | Required story |
|---|---|---|---|---|---|
| Default | Initial | `surface/raised` | `border/default` | `text/default` | `Default` |
| Hover | `:hover` | `action/ghost/hover` | `border/default` | `text/default` | `Hovered` |
| Selected | `state='selected'` | `action/secondary/hover` | `border/brand` | `text/default` | `Selected` |
| Disabled | `disabled=true` | same as Default at 0.40 opacity | — | — | `Disabled` |

---

## 8. Functional behavior

| Rule | Behavior |
|---|---|
| BR-01 | `onDropdownClick` and `onClose` are independent — clicking one does not affect the other |
| BR-02 | `disabled=true` disables both buttons (`disabled` attribute on each `<button>`) |
| BR-03 | `badgeIntent='brand-secondary'` shows lavender fill + purple text badge |
| BR-04 | `hasCounter=false` → badge not rendered regardless of `count` value |

---

## 9. Interactions and focus

Two keyboard-accessible actions:
- **Dropdown trigger**: Tab to focus, Enter/Space to open
- **Close button**: Tab to focus, Enter/Space to fire `onClose`

Focus ring: `display: block` when `:focus-within` — ring wraps the whole chip when either button is focused.

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use two separate `<button>` elements | Use a single click handler on the whole chip |
| Provide `aria-label` on the close button | Leave the × button unlabeled |
| Use `badgeIntent='brand-secondary'` for lavender badge | Use a different badge variant |
| `hasDropdown=false` for chips without expansion | Show chevron for non-expandable filters |

---

## 13. Tokens

| element_key | Property | Token | CSS var | VariableID |
|---|---|---|---|---|
| `root` (Default) | `background` | `surface/raised` | `--venus-surface-raised` | `563:3180` |
| `root` (Default) | `border` | `border/default` | `--venus-border-default` | `564:3209` |
| `root` (Selected) | `background` | `action/secondary/hover` | `--venus-action-secondary-hover` | `564:3221` (inferred) |
| `root` (Selected) | `border` | `border/brand` | `--venus-border-brand` | `564:3211` (inferred) |
| `chip-label` | `color` | `text/default` | `--venus-text-default` | `564:3192` |
| `chip-label` | `font-size` | Label/SM (12px) | — | `546:3106` |
| `chip-label` | `font-weight` | Medium (500) | — | `546:3118` |
| `focus-ring` | `border-color` | `border/focus` | `--venus-border-focus` | `564:3210` |
| `root` (disabled) | `opacity` | `visibility/disabled` | `--venus-visibility-disabled` | `564:3246` (inferred) |
| `chip-chevron bg` | `background` | `action/ghost/default` (transparent) | — | `564:3225` |

---

## 14. Accessibility

| Concern | Requirement |
|---|---|
| Container | `<div role="group">` |
| Dropdown trigger | `<button aria-haspopup="listbox" aria-expanded={dropdownOpen}>` |
| Close button | `<button aria-label="Remove [label] filter">` |
| Disabled | `aria-disabled="true"` on root + native `disabled` on both buttons |
| Focus ring | Shown on `:focus-within` — wraps entire chip when any child is focused |

---

## 15. Storybook contract

All stories: CSF3, light + dark, `layout: 'centered'`.

| Export | Args | Key assertion |
|---|---|---|
| `Default` | `{ label: 'Status' }` | `surface/raised`, `border/default` |
| `Selected` | `{ state: 'selected' }` | `action/secondary/hover` background |
| `WithCounter` | `{ hasCounter: true, count: 3 }` | Badge visible with count |
| `BrandSecondaryBadge` | `{ hasCounter: true, badgeIntent: 'brand-secondary', count: 2 }` | Lavender badge |
| `WithLeadingIcon` | `{ hasLeadingIcon: true, leadingIcon: <StatusIcon/> }` | Icon before label |
| `NoDropdown` | `{ hasDropdown: false }` | No chevron |
| `NoClose` | `{ hasClose: false }` | No × button |
| `Disabled` | `{ disabled: true }` | Both buttons disabled, 0.40 opacity |
| `Focused` | `{ hasFocus: true }` | Focus ring visible |

---

## 17. Decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | Two separate `<button>` children | Two distinct actions (expand dropdown vs clear filter). A single `<div>` with click zones violates WCAG 2.1 — each action must be independently keyboard-operable. |
| DEC-02 | `badgeIntent` as enum (`'brand' \| 'brand-secondary'`) | Maps directly to the two `Badge/Counter` variants supported per the Figma INSTANCE_SWAP and constitution documentation. |
| DEC-03 | Focus ring shown on `:focus-within` | The chip contains two focusable children. `:focus-within` on the group shows the ring when either child is focused — correct visual treatment. |

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Sign-off

| Role | Name | Status |
|---|---|---|
| Design | George Karian | PENDING |
| Engineering | Narendra | PENDING |
