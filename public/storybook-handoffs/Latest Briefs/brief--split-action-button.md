---
brief_schema: venus-storybook-handover/v2
component_name: "Split Action Button"
component_kebab_case: "split-action-button"
mode: "NEW"
target_component: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=644-27136"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "644:27136"
figma_verified_at: "2026-08-11T00:00:00Z"
target_storybook_title: "Actions/SplitActionButton"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  COMPONENT_NAME:        Split Action Button
  REACT_COMPONENT:       SplitActionButton
  STORYBOOK_TITLE:       Actions/SplitActionButton
  FIGMA_NODE_ID:         644:27136
-->

# Split Action Button — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | **Two independent tab stops** — `action-button` first, `trigger-button` second. No wrapper focus ring. | CSET description: "Two tab stops — action-button first, trigger-button second." The compound wrapper does not receive focus. Each nested button has its own focus ring. |
| 2 | The divider MUST have `aria-hidden="true"` | Purely decorative 1px separator. Screen readers must not announce it. |
| 3 | Both halves must be disabled simultaneously — never only one | CSET description: "To disable the entire compound component, set both action-button AND trigger-button to State=Disabled. Never disable only one half." |
| 4 | Trigger button `aria-haspopup="menu"` and `aria-expanded` — signals dropdown intent | The trigger (chevron) opens a menu overlay. AT must know it opens a popup before the user activates it. |
| 5 | Down Arrow key on the trigger-button opens the menu | CSET description: "Down Arrow opens menu to first item." In addition to Enter/Space. |
| 6 | Escape closes the menu and **returns focus to the trigger-button** | CSET description: "Escape closes menu and returns focus to trigger." Focus management is the component's responsibility. |
| 7 | 3 sizes only: md/lg/xl. No sm. | CSET confirmed: 3 variants, all size-only. sm is not available and is not an approved exception for this component. |

---

## 0. Evidence and source contract

| Source | Reference | Date | Establishes |
|---|---|---|---|
| Figma live read | `644:27136`, 🔘 Actions | 2026-08-11 | All 3 variants, exact dimensions (md: 113×32, lg: 139×40), children, divider tokens |
| CSET description | `644:27136` | 2026-08-11 | Two-tab-stop model, disabled contract, keyboard spec, divider tokens |
| Button brief | `1489:30020` | 2026-08-11 | `action-button` is a Button instance — ✅ HANDOFF_COMPLETE |
| Icon Button brief | `1165:49200` | 2026-08-11 | `trigger-button` is an Icon Button instance — ✅ HANDOFF_COMPLETE |

---

## 1. Outcome and scope

**Definition:** A compound control combining a primary action button (left) and a dropdown menu trigger (right) in a single unified visual container, separated by a 1px decorative divider.

**User need:** Power users in Contentstack need a primary action with quick access to related secondary actions — "Publish now" with a trigger for "Schedule publish", "Publish to staging", etc.

### Scope

| In scope | Out of scope |
|---|---|
| 3 sizes: md (32px) / lg (40px) / xl (52px) | sm size |
| Action button: all Button props | Icon-only action button |
| Trigger button opens a menu | Managing the menu content itself |
| Divider with `divider/default` + `visibility/divider` | Trigger without dropdown (use Button directly) |

### Responsibility boundary

| SplitActionButton owns | Consumer owns |
|---|---|
| Layout, divider, border radius | Menu component and its content |
| Focus routing when menu closes | Action triggered by menu items |
| Simultaneous disabled state | Keyboard shortcut for the primary action |
| `aria-haspopup`, `aria-expanded` on trigger | Tooltip on the trigger |

---

## 2. Existing baseline

`N/A — new component.`

---

## 3. Composition and reuse

| Concern | Decision |
|---|---|
| Architecture | Container `<div>` composing `Button` (action) + `<div aria-hidden>` (divider) + `IconButton` (trigger) |
| Upstream deps | `Button` — ✅ HANDOFF_COMPLETE; `IconButton` — ✅ HANDOFF_COMPLETE |
| Prohibited | Wrapper-level focus ring. Disabling only one half. Adding `tabIndex` to the wrapper. |

---

## 4. Anatomy

| element_key | Layer | Visibility | Condition | Semantic |
|---|---|---|---|---|
| `root` | `split-action-button` | REQUIRED | Always | `<div>`, `data-testid="split-action-button"`. No focus ring, no `tabIndex`. |
| `action-button` | `action-button` | REQUIRED | Always | `<Button>` instance. Left side — primary action. `data-testid="split-action-button-action"` |
| `divider` | `divider` | REQUIRED | Always | `<div aria-hidden="true">`, 1px wide, `fill=divider/default` at `opacity=visibility/divider (32%)` |
| `trigger-button` | `trigger-button` | REQUIRED | Always | `<IconButton>` instance. Right side — opens menu. `aria-haspopup="menu"` `aria-expanded` |

---

## 5. Public React API

### TypeScript interface

```typescript
/**
 * Compound control: primary action button + dropdown trigger.
 * Two independent tab stops. No wrapper focus ring.
 *
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=644-27136
 */
export interface SplitActionButtonProps {
  /** Size variant. @default 'md' */
  size?: 'md' | 'lg' | 'xl';
  /**
   * Semantic type of the action button.
   * Applies to both halves visually.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';
  /** Primary action label. */
  actionLabel: string;
  /** Called when the action button is clicked. */
  onAction: () => void;
  /** Leading icon for the action button. */
  actionLeadingIcon?: React.ReactNode;
  /**
   * Accessible label for the trigger button.
   * @default 'More options'
   */
  triggerAccessibleLabel?: string;
  /** Icon for the trigger button. Defaults to ChevronDown. */
  triggerIcon?: React.ReactNode;
  /** Called when the trigger button is clicked. */
  onTrigger: () => void;
  /** Whether the dropdown menu is open. Controls aria-expanded. */
  menuOpen?: boolean;
  /**
   * Disables BOTH action and trigger simultaneously.
   * Never disable only one half.
   * @default false
   */
  disabled?: boolean;
  className?: string;
}
```

### JSX base component

```tsx
export const SplitActionButton: React.FC<SplitActionButtonProps> = ({
  size = 'md', variant = 'primary', actionLabel, onAction, actionLeadingIcon,
  triggerAccessibleLabel = 'More options', triggerIcon, onTrigger,
  menuOpen = false, disabled = false, className }) => {

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Return focus to trigger when menu closes
  const prevMenuOpen = React.useRef(menuOpen);
  React.useEffect(() => {
    if (prevMenuOpen.current && !menuOpen) {
      triggerRef.current?.focus();
    }
    prevMenuOpen.current = menuOpen;
  }, [menuOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && !menuOpen) {
      e.preventDefault();
      onTrigger();
    }
  };

  return (
    <div data-testid="split-action-button"
      className={[styles['split-action-button'], styles[`split-action-button--${size}`], className].filter(Boolean).join(' ')}>
      {/* Left: primary action */}
      <Button label={actionLabel} variant={variant} size={size}
        hasLeadingIcon={!!actionLeadingIcon} leadingIcon={actionLeadingIcon}
        hasTrailingIcon={false}
        disabled={disabled} onClick={onAction}
        data-testid="split-action-button-action"
        className={styles['split-action-button__action']} />
      {/* Divider — decorative */}
      <div aria-hidden="true" className={styles['split-action-button__divider']} />
      {/* Right: trigger */}
      <IconButton ref={triggerRef} variant={variant === 'ghost' || variant === 'secondary' || variant === 'tertiary' ? 'ghost' : 'primary'}
        size={size} accessibleLabel={triggerAccessibleLabel}
        icon={triggerIcon ?? <ChevronDownIcon />}
        disabled={disabled}
        aria-haspopup="menu" aria-expanded={menuOpen}
        onClick={onTrigger} onKeyDown={handleTriggerKeyDown}
        data-testid="split-action-button-trigger"
        className={styles['split-action-button__trigger']} />
    </div>
  );
};
```

**Key CSS:**
```css
.split-action-button {
  display: inline-flex; align-items: stretch;
  border-radius: var(--venus-radius-4, 4px);
  overflow: hidden; /* clips children to container border-radius */
}
.split-action-button--xl { border-radius: var(--venus-radius-8, 8px); }
/* Remove Button border-radius on right side, Icon Button on left side */
.split-action-button__action { border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important; }
.split-action-button__trigger { border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important; }

.split-action-button__divider {
  width: 1px; flex-shrink: 0; align-self: stretch;
  background: var(--venus-divider-default, #FFFFFF);
  opacity: var(--venus-visibility-divider, 0.32);
}

/* md: 113px total (80px action + 1px divider + 32px trigger) */
/* lg: 139px total (98px action + 1px divider + 40px trigger) */
/* xl: ~167px total (114px action + 1px divider + 52px trigger) */
```

---

## 6. Figma → React mapping

| Figma property | React prop | Notes |
|---|---|---|
| `Size` (VARIANT) | `size` | direct — only axis in the CSET |
| `action-button` properties | `actionLabel`, `variant`, `disabled`, `onAction` | Exposed via Button nested instance props |
| `trigger-button` properties | `triggerIcon`, `disabled`, `onTrigger`, `menuOpen` | Exposed via Icon Button nested instance props |
| Divider fill | `divider/default` = `#FFFFFF` | `VariableID:664:33200` |
| Divider opacity | `visibility/divider` = 32% | `VariableID:664:33199` |

---

## 7. Variants, states, and precedence

### Size contract (live-verified 2026-08-11)

| Size | Total | Action width | Divider | Trigger |
|---|---|---|---|---|
| `md` | 113×32px | 80px | 1px | 32×32px |
| `lg` | 139×40px | 98px | 1px | 40×40px |
| `xl` | ~167×52px | ~114px | 1px | 52×52px |

### Variant (type) appearance

Driven by `variant` prop forwarded to both Button (action) and IconButton (trigger). The same type applies to both. Divider color adapts:

| Variant | Divider note |
|---|---|
| Primary | White divider at 32% opacity — correct contrast against `action/primary` fill |
| Secondary / Ghost | Divider degrades — white at 32% on white/light bg is nearly invisible. Use border-color fallback for these types (see DEC-01) |

---

## 8. Functional behavior

| Rule | Behavior |
|---|---|
| BR-01 | `disabled=true` disables both buttons — `action-button.disabled=true` AND `trigger-button.disabled=true` |
| BR-02 | Menu closes → focus returns to trigger (via `useEffect` + ref) |
| BR-03 | Down Arrow on focused trigger → opens menu (`onTrigger()`) |
| BR-04 | Escape inside menu → consumer closes menu → `menuOpen` becomes `false` → focus returns to trigger |

---

## 9. Interactions and focus

### Two-tab-stop model

| Stop | Element | Tab to | Focus ring |
|---|---|---|---|
| 1 | `action-button` | `<Button>` | Button's own focus ring |
| 2 | `trigger-button` | `<IconButton>` | Icon Button's own focus ring |

**The wrapper `<div>` never receives focus.** No `tabIndex` on root.

### Keyboard

| Key | Element | Result |
|---|---|---|
| Tab | Wrapper | Focus moves to action-button (tab stop 1) |
| Tab | action-button | Focus moves to trigger-button (tab stop 2) |
| Tab | trigger-button | Focus exits component |
| Space / Enter | action-button | Fires `onAction` |
| Space / Enter | trigger-button | Fires `onTrigger`, opens menu |
| Down Arrow | trigger-button | Fires `onTrigger`, opens menu |
| Escape | (in open menu) | Consumer closes menu; focus returns to trigger-button |

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Disable both halves together via `disabled` prop | Disable only the trigger or only the action |
| Mark divider with `aria-hidden="true"` | Let the divider be announced by screen readers |
| Return focus to trigger on menu close | Leave focus trapped in menu after close |
| Use Down Arrow to open menu on trigger | Require users to Tab to a menu item directly |
| Keep `variant` consistent across both halves | Use different types for action vs trigger |

---

## 13. Tokens

| Element | Property | Token | CSS var | VariableID |
|---|---|---|---|---|
| `action-button` | All tokens | Same as Button | See Button brief | — |
| `trigger-button` | All tokens | Same as IconButton | See IconButton brief | — |
| `divider` | `background` | `divider/default` (#FFFFFF) | `--venus-divider-default` | `664:33200` |
| `divider` | `opacity` | `visibility/divider` (32%) | `--venus-visibility-divider` | `664:33199` |
| Root | `border-radius` | `radius/4` (md/lg) / `radius/8` (xl) | `--venus-radius-4` / `--venus-radius-8` | `546:3078` / `546:3080` |

---

## 14. Accessibility

| Concern | Requirement |
|---|---|
| Wrapper | `<div>` — no role, no tabIndex |
| `action-button` | Standard Button ARIA. First tab stop. |
| `trigger-button` | `aria-haspopup="menu"` + `aria-expanded={menuOpen}`. Second tab stop. |
| `divider` | `aria-hidden="true"` |
| Focus management | Focus returns to trigger-button when menu closes |
| Disabled | When `disabled=true`: both buttons have `aria-disabled="true"`. Never only one. |

---

## 15. Storybook contract

All stories: CSF3, light + dark.

| Export | Args | Key assertion |
|---|---|---|
| `Default` | `{ actionLabel: 'Publish now', variant: 'primary', size: 'md' }` | Two tab stops, divider visible |
| `SizeLg` | `{ size: 'lg' }` | 139×40px |
| `SizeXl` | `{ size: 'xl' }` | ~167×52px |
| `Secondary` | `{ variant: 'secondary' }` | Secondary style on both halves |
| `Disabled` | `{ disabled: true }` | Both buttons aria-disabled; no interaction |
| `MenuOpen` | `{ menuOpen: true }` | `aria-expanded="true"` on trigger |
| `FocusAction` | Play: tab once | Focus ring on action-button only |
| `FocusTrigger` | Play: tab twice | Focus ring on trigger-button only |
| `DownArrowOpens` | Play: focus trigger, press Down | `onTrigger` called |

---

## 17. Decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | Divider degrades on Secondary/Ghost variants — conditional CSS override recommended | CSET description documents this known constraint: "When Type is changed to Secondary or Ghost, divider visual contrast degrades." Engineers should apply a conditional border-color or alternative divider approach for these types. The Figma bakes Primary only. |
| DEC-02 | `variant` prop applies to both halves | The CSET has only a Size variant axis — Type is controlled via nested instance props. For React, a single `variant` prop forwarded to both sub-components is the cleanest API. |
| DEC-03 | Focus returns to trigger (not action) on menu close | The trigger opened the menu, so focus returns there. This is the correct ARIA menu pattern and is documented in the CSET description. |
| DEC-04 | `overflow: hidden` on wrapper clips child border-radius | By clipping children to the wrapper's border-radius, the action's right corners and the trigger's left corners are squared without needing `!important` overrides on each child. |

### Open questions

`NONE`

---

## 18. Sign-off

| Role | Name | Status |
|---|---|---|
| Design | George Karian | PENDING |
| Engineering | Narendra | PENDING |
