# Storybook Brief — SplitActionButton
**System:** Venus 2.1 RF  
**Version:** 2.1.1  
**Figma node:** `644:27136` — 🔘 Actions page  
**Status:** Active — all audit blockers resolved 2026-05-28  
**Author:** Design Systems (Venus 2.1 RF)

---

## 1. What This Component Is

`SplitActionButton` is a compound interactive control that combines two independently clickable zones — a **primary action button** (left) and a **dropdown trigger** (right) — into a single visually unified container.

It is used when a primary action exists but secondary alternatives are needed without surfacing them upfront. The left half commits immediately; the right half opens a menu of alternatives.

**Do not use this component when:**
- There is only one action available (use `Button` instead)
- All alternatives are equal in priority (use a standalone `Button` with a `Dropdown`)
- The context is mobile-first or touch-primary (two adjacent 32px targets are too close)
- The primary action itself is destructive (destructive split buttons create dangerous UX patterns)

---

## 2. Component Architecture

The `SplitActionButton` is a **wrapper component** — it does not own any state for the nested button types, variants, or labels. Those are passed through to the underlying `Button` instances.

```
SplitActionButton
├── action-button       → <Button> left half — fires onAction
├── divider             → aria-hidden decorative separator
└── trigger-button      → <Button> right half, icon-only — opens dropdown menu
```

The wrapper's only structural responsibilities are:
1. Horizontal flex container
2. Shared border-radius clamping (via `overflow: hidden`)
3. The `role="group"` ARIA wrapper
4. Providing the `aria-label` for the group

---

## 3. Props Interface

```typescript
export interface SplitActionButtonProps {
  /**
   * The label for the primary action button.
   * Also used as the basis for the group's aria-label:
   * aria-label="`${label} options`"
   */
  label: string;

  /**
   * Size of the compound control.
   * All three sizes map directly to the underlying Button size prop.
   * @default 'lg'
   */
  size?: 'md' | 'lg' | 'xl';

  /**
   * Visual variant for both the action-button and trigger-button.
   * The divider color is baked for Primary — engineers must
   * conditionally adjust divider opacity/color for Ghost/Secondary.
   * See Section 9 — Known Constraint.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost';

  /**
   * Whether the entire compound control is disabled.
   * Disables BOTH the action-button and the trigger-button simultaneously.
   * Never disable only one half.
   */
  disabled?: boolean;

  /**
   * Optional leading icon for the action-button (left half).
   * Accepts a React node (icon component).
   */
  leadingIcon?: React.ReactNode;

  /**
   * Callback fired when the action-button (left half) is clicked.
   */
  onAction: () => void;

  /**
   * Whether the dropdown menu is currently open.
   * Controls aria-expanded on the trigger-button.
   */
  isOpen: boolean;

  /**
   * Callback fired when the trigger-button (right half) is clicked.
   * Responsible for toggling isOpen.
   */
  onTrigger: () => void;

  /**
   * Additional class names for the wrapper element.
   */
  className?: string;
}
```

---

## 4. Sizes

| Size | Wrapper height | Action button | Trigger button | Border radius | Use context |
|---|---|---|---|---|---|
| `md` | 32px | HUG width | 32×32px | 4px | Compact toolbars, sidebars, secondary actions |
| `lg` | 40px | HUG width | 40×40px | 4px | **System default.** Main forms, dialogs, primary CTAs |
| `xl` | 52px | HUG width | 52×52px | 8px | Hero sections, onboarding, empty state surfaces |

---

## 5. Anatomy & Layer Mapping

| Figma layer | DOM element | Notes |
|---|---|---|
| `SplitActionButton` wrapper | `<div role="group">` | `aria-label="{label} options"` |
| `action-button` | `<button>` | Fires `onAction()`. Tab stop 1. |
| `divider` | `<div aria-hidden="true">` | 1px wide, purely decorative. CSS: `width:1px; align-self:stretch; background: var(--divider-default); opacity: var(--visibility-divider)` |
| `trigger-button` | `<button>` | `aria-haspopup="menu"`, `aria-expanded={isOpen}`. Tab stop 2. |

---

## 6. CSS Token Mapping

All tokens are CSS custom properties exported from the Venus 2.1 RF token pipeline (Style Dictionary).

### Wrapper

```css
.split-action-button {
  display: inline-flex;
  border-radius: var(--radius-4);     /* md/lg: 4px */
  overflow: hidden;                   /* clips inner button corners */
}

.split-action-button--xl {
  border-radius: var(--radius-8);     /* xl: 8px */
}
```

### Inner Buttons — radius override

The wrapper's `overflow: hidden` handles outer corner clipping. Both inner buttons get their corners zeroed where they meet each other:

```css
/* action-button */
.split-action-button__action {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* trigger-button */
.split-action-button__trigger {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
```

### Divider

```css
.split-action-button__divider {
  width: 1px;
  align-self: stretch;
  flex-shrink: 0;
  background-color: var(--divider-default);   /* gray/0 → #FFFFFF */
  opacity: var(--visibility-divider);         /* 32% */
  pointer-events: none;
}
```

> **Token note:** `--divider-default` resolves to `#FFFFFF`. `--visibility-divider` resolves to `0.32`. Both are exported from `Venus_Semantics`. Do not hardcode these values.

### Size tokens

```css
/* Inherit from Button — no additional sizing tokens on the wrapper itself */
/* Wrapper height is determined by the tallest inner button (all same size) */
```

---

## 7. Keyboard Interaction Model

This component has **two independent tab stops**. The wrapper itself is not focusable.

| Key | Context | Behaviour |
|---|---|---|
| `Tab` | Any | Focus moves to `action-button` (Tab stop 1) |
| `Tab` | action-button focused | Focus moves to `trigger-button` (Tab stop 2) |
| `Tab` | trigger-button focused | Focus leaves component entirely |
| `Shift+Tab` | trigger-button focused | Focus returns to action-button |
| `Enter` / `Space` | action-button focused | Fires `onAction()` |
| `Enter` / `Space` | trigger-button focused | Opens dropdown menu |
| `↓` (Down Arrow) | trigger-button focused | Opens dropdown menu, moves focus to first menu item |
| `Escape` | Menu open | Closes menu, returns focus to trigger-button |

---

## 8. ARIA Spec

```html
<!-- Wrapper -->
<div
  role="group"
  aria-label="{label} options"
  class="split-action-button"
>

  <!-- Action button (left) -->
  <button
    type="button"
    class="split-action-button__action btn btn--primary btn--lg"
    aria-label="{label}"
    disabled?
  >
    <!-- optional leading icon -->
    {label}
  </button>

  <!-- Divider — decorative only -->
  <div
    class="split-action-button__divider"
    aria-hidden="true"
  />

  <!-- Trigger button (right) — icon only -->
  <button
    type="button"
    class="split-action-button__trigger btn btn--primary btn--lg btn--icon-only"
    aria-label="More {label} options"
    aria-haspopup="menu"
    aria-expanded="{isOpen}"
    aria-controls="{menuId}"
    disabled?
  >
    <CaretDownIcon aria-hidden="true" />
  </button>

</div>
```

**Required:** The trigger button must always have an explicit `aria-label` — it is icon-only with no visible text. `"More {label} options"` is the recommended pattern. Do not leave it as an unlabelled icon button.

---

## 9. Disabled State

When `disabled={true}`:
- Set `disabled` attribute on **both** `action-button` and `trigger-button`
- Both buttons inherit `opacity: var(--visibility-disabled)` (40%) from the Button component's disabled state
- The divider will visually fade proportionally — this is correct and expected
- Do **not** disable only one half — this creates an incoherent interactive state and violates the compound contract

```tsx
<SplitActionButton
  label="Publish"
  disabled={true}   // disables both halves
  onAction={handlePublish}
  isOpen={false}
  onTrigger={handleTrigger}
/>
```

---

## 10. Known Constraint — Divider on Non-Primary Variants

The divider uses `--divider-default` (`#FFFFFF`) at `--visibility-divider` (32% opacity). This is designed for use on brand/action-colored surfaces (Primary variant background: `--action-primary` = `#6C5CE7`).

When `variant` is `secondary` or `ghost`, the button background is light (lavender or transparent), and a white divider at 32% opacity becomes near-invisible.

**Engineering must handle this conditionally:**

```css
/* Secondary or Ghost variant — use a visible gray divider instead */
.split-action-button--secondary .split-action-button__divider,
.split-action-button--ghost .split-action-button__divider {
  background-color: var(--border-default);  /* gray/200 → #E5E7EB */
  opacity: 1;
}
```

Or in React via inline style / token override:

```tsx
const dividerStyle =
  variant === 'primary'
    ? { background: 'var(--divider-default)', opacity: 'var(--visibility-divider)' }
    : { background: 'var(--border-default)', opacity: '1' };
```

This cannot be resolved in Figma — the divider token is baked per variant. The CSS conditional is the correct implementation path.

---

## 11. Stories to Write

### 11.1 Default story (required)

```tsx
export const Default: Story = {
  args: {
    label: 'Publish',
    size: 'lg',
    variant: 'primary',
    disabled: false,
    isOpen: false,
    onAction: fn(),
    onTrigger: fn(),
  },
};
```

### 11.2 All Sizes

```tsx
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SplitActionButton label="Publish" size="md" variant="primary" ... />
      <SplitActionButton label="Publish" size="lg" variant="primary" ... />
      <SplitActionButton label="Publish" size="xl" variant="primary" ... />
    </div>
  ),
};
```

### 11.3 All Variants

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SplitActionButton label="Publish" variant="primary" size="lg" ... />
      <SplitActionButton label="Publish" variant="secondary" size="lg" ... />
      <SplitActionButton label="Publish" variant="ghost" size="lg" ... />
    </div>
  ),
};
```

### 11.4 Disabled

```tsx
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};
```

### 11.5 With Leading Icon

```tsx
export const WithLeadingIcon: Story = {
  args: {
    ...Default.args,
    leadingIcon: <UploadIcon />,
  },
};
```

### 11.6 Open State (menu open)

```tsx
export const MenuOpen: Story = {
  args: {
    ...Default.args,
    isOpen: true,
  },
  // Note: this story demonstrates the trigger's aria-expanded=true state.
  // The actual dropdown menu is rendered by the consuming application,
  // not by this component.
};
```

### 11.7 Dark Mode

Wrap in a theme provider or set `data-theme="dark"` on the story container. All tokens resolve from `Venus_Semantics` — both modes are token-complete. No separate dark mode story file needed; use a Storybook global theme toggle.

---

## 12. What This Component Does NOT Own

- The **dropdown menu** — `SplitActionButton` only fires `onTrigger`. The menu panel, menu items, positioning, and close-on-outside-click logic are owned by the consuming page or a separate `DropdownMenu` component.
- **Menu item content** — passed by the consumer.
- **Loading state** — if the primary action triggers an async operation, the consumer wraps `onAction` and manages the loading state on the action-button via the `Button` component's `loading` prop directly.
- **Tooltip** — if the trigger button needs a tooltip ("More options"), the consumer wraps the trigger slot with a `Tooltip` component.

---

## 13. Acceptance Criteria

Before this component is marked ready for production use:

- [ ] `role="group"` and `aria-label` are on the wrapper
- [ ] `aria-haspopup="menu"` and `aria-expanded` are on the trigger button
- [ ] `aria-hidden="true"` is on the divider element
- [ ] Trigger button has an explicit `aria-label` (not just an unlabelled icon)
- [ ] `Tab` / `Shift+Tab` / `Enter` / `Space` / `↓` / `Escape` all work per spec
- [ ] `disabled={true}` disables both buttons simultaneously
- [ ] Divider is invisible to screen readers and pointer events
- [ ] Divider uses CSS token values — no hardcoded hex or opacity
- [ ] Secondary/Ghost variant applies conditional divider override (Section 10)
- [ ] All three sizes render at correct heights (32 / 40 / 52px)
- [ ] `overflow: hidden` on wrapper clips corners correctly
- [ ] Focus rings on each inner button are visible and correctly offset (2px, `--focus-ring-color`)
- [ ] Component passes axe-core in all non-disabled states
- [ ] Snapshot tests pass for all 6 stories

---

*Venus 2.1 RF — Design Systems. Questions: open a ticket tagged `venus-ds` or ping the #design-systems Slack channel.*
