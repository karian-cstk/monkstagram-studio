# Button — Storybook Brief
**Venus 2.1 RF · Design System**
**Component:** `Button`
**Page:** 🔘 Actions
**Figma node:** `633:12411`
**Version:** 2.1.0
**Status:** Active
**Date:** 2026-05-28

---

## 1. Purpose

The primary interactive control for triggering actions. Communicates the importance and intent of an action through its type. Use the correct type to establish visual hierarchy — never mix Primary buttons on the same surface.

**Type selection guide:**

| Type | Intent | When to use |
|---|---|---|
| Primary | Highest emphasis | One per surface — the main CTA |
| Secondary | Supporting action | Alongside a Primary, or as default when no strong hierarchy needed |
| Tertiary | Low emphasis | Optional/secondary actions that don't compete with a Primary |
| Ghost | Minimal | Inline actions, toolbars, dense UI — where a border would add visual noise |
| Destructive | Irreversible danger | Delete, remove, revoke — always confirm before executing |

---

## 2. Component Anatomy

```
[Root variant frame]  — HORIZONTAL auto layout, counterAxisAlignItems=CENTER
├── _Internal/Icon-Wrapper (leading)   Optional leading icon slot (hasLeadingIcon)
│   └── placeholder                    Icon instance — swap via leadingIcon prop
├── label                              Button text — bound to label property
├── _Internal/Icon-Wrapper (trailing)  Optional trailing icon slot (hasTrailingIcon)
│   └── placeholder                    Icon instance
└── focus-ring                         ABSOLUTE 2px ring — controlled by hasFocus
```

**Note:** `_Internal/Icon-Wrapper` is an internal component, not exposed to consumers. Icon sizes per wrapper size: 16px (md), 20px (lg — Size=24px wrapper), 28px (xl — Size=28px wrapper).

---

## 3. Props Interface

```typescript
export interface ButtonProps {
  // ─── Visual type ──────────────────────────────────────────────
  /**
   * Visual style and semantic weight.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';

  // ─── Size ─────────────────────────────────────────────────────
  /**
   * md — 32px height. Sidebar, compact toolbars, secondary controls.
   * lg — 40px height. Main body forms, dialogs, primary CTAs. System default.
   * xl — 52px height. Hero sections, onboarding, empty-state actions.
   * @default 'lg'
   */
  size?: 'md' | 'lg' | 'xl';

  // ─── Content ──────────────────────────────────────────────────
  /** Button label text. Required unless icon-only (provide aria-label instead). */
  children?: React.ReactNode;

  /** Leading icon element (left of label). */
  leadingIcon?: React.ReactNode;

  /** Trailing icon element (right of label). */
  trailingIcon?: React.ReactNode;

  // ─── State ────────────────────────────────────────────────────
  /**
   * Disables the button. Renders at 40% opacity, removed from tab order,
   * aria-disabled="true", no hover/press response.
   */
  disabled?: boolean;

  /**
   * Loading state. Shows spinner, makes non-interactive.
   * Not yet modelled as a Figma variant — implement in code.
   */
  loading?: boolean;

  // ─── HTML/ARIA ────────────────────────────────────────────────
  /** HTML button type. @default 'button' */
  type?: 'button' | 'submit' | 'reset';

  /** Accessible name when no visible label (icon-only). Required in that case. */
  'aria-label'?: string;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | Type | React Prop | Notes |
|---|---|---|---|
| `Type=Primary` | VARIANT | `variant="primary"` | Default |
| `Type=Secondary` | VARIANT | `variant="secondary"` | |
| `Type=Tertiary` | VARIANT | `variant="tertiary"` | |
| `Type=Ghost` | VARIANT | `variant="ghost"` | |
| `Type=Destructive` | VARIANT | `variant="destructive"` | |
| `Size=md` | VARIANT | `size="md"` | |
| `Size=lg` | VARIANT | `size="lg"` | Default |
| `Size=xl` | VARIANT | `size="xl"` | |
| `State=Default` | VARIANT | CSS `:default` | Internal — never a prop |
| `State=Hover` | VARIANT | CSS `:hover` | Internal — never a prop |
| `State=Pressed` | VARIANT | CSS `:active` | Internal — never a prop |
| `State=Disabled` | VARIANT | `disabled={true}` | Consumer prop |
| `hasLeadingIcon` | BOOLEAN | `leadingIcon={<Icon />}` | Default: true in Figma (show slot); controlled by icon presence in React |
| `hasTrailingIcon` | BOOLEAN | `trailingIcon={<Icon />}` | |
| `hasLabel` | BOOLEAN | `children` presence | Default: true |
| `hasFocus` | BOOLEAN | Internal only | Design-time toggle for focus ring preview — never a consumer prop |
| `label` | TEXT | `children="Button"` | |
| `leadingIcon` | INSTANCE_SWAP | `leadingIcon={<CustomIcon />}` | |

---

## 5. State Behaviour

| State | Trigger | Visual changes |
|---|---|---|
| Default | At rest | Base fill per type |
| Hover | Mouse over | Fill darkens one stop. Secondary/Tertiary/Ghost: subtle lavender overlay |
| Pressed | Mouse down / `:active` | Fill darkens further. Tertiary/Ghost show solid pressed fill |
| Disabled | `disabled` prop | 40% opacity on root. No hover, no press, `cursor: not-allowed` |
| Focused | `:focus-visible` (keyboard) | 2px tulip-purple ring, 2px offset, radius = button-radius + 2 |

**Type-specific pressed fills:**
- Primary / Destructive → `action/primary/active` / `action/destructive/active`
- Secondary → `action/secondary/active`
- Tertiary → `action/tertiary/pressed` (purple/100) + `border/brand` 2px
- Ghost → `action/ghost/pressed` (purple/200) + `border/strong` 2px

---

## 6. Sizing Specification

| Size | Height | pLeft/Right | Gap | Corner radius | Font | Focus ring |
|---|---|---|---|---|---|---|
| `md` | 32px | 8px | 4px | 4px | Button/MD · 14px · Medium | 105×36px · radius 6px |
| `lg` | 40px | 8px | 8px | 4px | Button/LG · 16px · Medium | 135×44px · radius 6px |
| `xl` | 52px | 12px | 8px | 8px | Button/XL · 18px · Medium | 158×56px · radius 10px |

**Icon sizes:** md=16px · lg=20px · xl=28px
**Form row rule:** every interactive component in the same row shares the same size. A lg button (40px) pairs with a lg input (40px) and lg dropdown (40px).

---

## 7. Token Reference

### Background fills

| Type | Default | Hover | Pressed | Disabled |
|---|---|---|---|---|
| Primary | `action/primary` #6C5CE7 | `action/primary/hover` #5D50BF | `action/primary/active` #4C42A0 | — (40% opacity) |
| Secondary | `action/secondary` #F9F8FF | `action/secondary/hover` #EDE9FE | `action/secondary/active` #DDD6FE | — |
| Tertiary | transparent | `action/secondary/hover` | `action/tertiary/pressed` #EDE9FE | — |
| Ghost | transparent | `action/secondary/hover` | `action/ghost/pressed` #DDD6FE | — |
| Destructive | `action/destructive` #E53935 | `action/destructive/hover` #D32F2F | `action/destructive/active` #C62828 | — |

### Text fills

| Type | Default | Hover | Pressed |
|---|---|---|---|
| Primary | `text/on-brand` #FFFFFF | `text/on-brand` | `text/on-brand` |
| Secondary | `text/default` #111827 | `text/default` | `text/default` |
| Tertiary | `text/default` | `text/default` | `text/default` |
| Ghost | `text/brand` #5D50BF | `text/brand` | `text/brand` |
| Destructive | `text/on-brand` #FFFFFF | `text/on-brand` | `text/on-brand` |

### Borders

| Type | Default | Hover | Pressed |
|---|---|---|---|
| Secondary | `border/default` 1px | `border/default` | `border/default` |
| Tertiary | `border/brand` 1px | `border/brand` | `border/brand` 2px |
| Ghost | none | none | `border/strong` 2px |
| Primary / Destructive | none | none | none |

### Disabled (root layer)

| Token | Value | Applied to |
|---|---|---|
| `visibility/disabled` | 40 (→ 40% opacity) | Root variant frame — all Disabled variants |

### Focus ring

| Property | Value |
|---|---|
| Stroke token | `border/focus` → `focus/ring/color` → #B6AEF3 Light / #9F93FA Dark |
| Stroke weight | 2px |
| Offset from button edge | 2px each side |
| Corner radius | button-radius + 2px (md/lg=6px · xl=10px) |

### CSS Custom Properties

```css
/* Primary */
--action-primary:           #6C5CE7;
--action-primary-hover:     #5D50BF;
--action-primary-active:    #4C42A0;
/* Secondary */
--action-secondary:         #F9F8FF;
--action-secondary-hover:   #EDE9FE;
--action-secondary-active:  #DDD6FE;
/* Tertiary / Ghost */
--action-tertiary-pressed:  #EDE9FE;
--action-ghost-pressed:     #DDD6FE;
/* Destructive */
--action-destructive:       #E53935;
--action-destructive-hover: #D32F2F;
--action-destructive-active:#C62828;
/* Text */
--text-on-brand:            #FFFFFF;
--text-default:             #111827;
--text-brand:               #5D50BF;
/* Borders */
--border-default:           #E5E7EB;
--border-brand:             #6C5CE7;
--border-strong:            #374151;
/* Focus */
--focus-ring-color:         #B6AEF3;
/* Disabled */
--visibility-disabled:      0.4;
```

---

## 8. Accessibility Requirements

### Semantic HTML

```html
<!-- Standard button -->
<button type="button" class="btn btn--primary btn--lg">
  Save changes
</button>

<!-- With leading icon -->
<button type="button" class="btn btn--primary btn--lg">
  <span aria-hidden="true"><SaveIcon /></span>
  Save changes
</button>

<!-- Icon-only — aria-label required -->
<button type="button" class="btn btn--ghost btn--md" aria-label="Delete item">
  <span aria-hidden="true"><TrashIcon /></span>
</button>

<!-- Disabled -->
<button type="button" disabled aria-disabled="true" class="btn btn--primary btn--lg">
  Processing…
</button>

<!-- Destructive — always confirm -->
<button type="button" class="btn btn--destructive btn--lg"
        aria-describedby="delete-warning">
  Delete account
</button>
<p id="delete-warning" class="sr-only">
  This action is permanent and cannot be undone.
</p>
```

### Keyboard behaviour

| Key | Behaviour |
|---|---|
| `Tab` | Move focus to button |
| `Enter` | Activate button |
| `Space` | Activate button |
| `Shift+Tab` | Move focus backward |

Disabled buttons are removed from the tab order (`disabled` attribute). Do not use `tabIndex="-1"` alone — use the native `disabled` attribute.

### Focus ring

```css
.btn:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  border-radius: calc(var(--btn-radius) + 2px);
}
.btn:focus:not(:focus-visible) {
  outline: none; /* suppress for mouse users */
}
```

### Contrast

| Type | Foreground | Background | Ratio | Pass |
|---|---|---|---|---|
| Primary | white #FFFFFF | #6C5CE7 | 4.7:1 | AA ✅ |
| Secondary | #111827 | #F9F8FF | 17.9:1 | AAA ✅ |
| Tertiary | #111827 | white | 19.1:1 | AAA ✅ |
| Ghost | #5D50BF | white | 7.2:1 | AAA ✅ |
| Destructive | white #FFFFFF | #E53935 | 4.6:1 | AA ✅ |

---

## 9. Implementation Notes

### Never use `<div>` or `<a>` for actions

```tsx
// ❌ Wrong — not keyboard accessible, no native semantics
<div onClick={handleClick} className="btn">Save</div>

// ✅ Correct
<button type="button" onClick={handleClick}>Save</button>

// ✅ Correct for navigation
<a href="/dashboard" className="btn btn--secondary">Go to Dashboard</a>
```

### Destructive pattern — always confirm

```tsx
// Never execute destructive actions on single click
<Button
  variant="destructive"
  onClick={() => setConfirmDialogOpen(true)}
>
  Delete account
</Button>

// Confirmation dialog handles the actual delete
<ConfirmDialog
  open={confirmDialogOpen}
  title="Delete account?"
  description="This action is permanent and cannot be undone."
  confirmLabel="Yes, delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  onCancel={() => setConfirmDialogOpen(false)}
/>
```

### Loading state

```tsx
// Loading: disable interaction, show spinner, preserve width
<Button variant="primary" disabled loading aria-label="Saving…">
  {loading ? <Spinner size={16} /> : null}
  {loading ? 'Saving…' : 'Save changes'}
</Button>
```

### Icon-only button

```tsx
// Must have aria-label — no visible text
<Button variant="ghost" size="md" aria-label="Delete item">
  <TrashIcon />
</Button>
```

### Transition spec

```css
.btn {
  transition:
    background-color 100ms var(--easing-ease-in-out),
    border-color     100ms var(--easing-ease-in-out),
    color            100ms var(--easing-ease-in-out),
    opacity          100ms var(--easing-ease-in-out);
}
@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
}
```

---

## 10. Stories to Implement

```tsx
export default {
  title: 'Components/Actions/Button',
  component: Button,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu?node-id=633:12411',
    },
  },
  argTypes: {
    variant:      { control: 'select',  options: ['primary','secondary','tertiary','ghost','destructive'] },
    size:         { control: 'radio',   options: ['md','lg','xl'] },
    children:     { control: 'text',    description: 'Button label text.' },
    disabled:     { control: 'boolean' },
    loading:      { control: 'boolean' },
    onClick:      { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

// ── Core states ───────────────────────────────────────────────
export const Default: Story = {
  args: { children: 'Button', variant: 'primary', size: 'lg', disabled: false },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

// ── With icons ────────────────────────────────────────────────
export const WithLeadingIcon: Story = {
  args: { children: 'Save changes', leadingIcon: <SaveIcon />, variant: 'primary', size: 'lg' },
};

export const WithTrailingIcon: Story = {
  args: { children: 'Continue', trailingIcon: <ArrowRightIcon />, variant: 'primary', size: 'lg' },
};

export const IconOnly: Story = {
  args: { leadingIcon: <TrashIcon />, 'aria-label': 'Delete item', variant: 'ghost', size: 'md' },
};

// ── States ────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {(['primary','secondary','tertiary','ghost','destructive'] as const).map(v => (
        <Button key={v} variant={v} disabled>{v}</Button>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { children: 'Saving…', variant: 'primary', size: 'lg', loading: true, disabled: true },
};

// ── All states reference (visual QA) ─────────────────────────
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['primary','secondary','tertiary','ghost','destructive'] as const).map(v => (
        <div key={v} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button variant={v}>Default</Button>
          <Button variant={v} disabled>Disabled</Button>
        </div>
      ))}
    </div>
  ),
};

// ── Form row consistency ──────────────────────────────────────
export const FormRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Input placeholder="Enter value" size="lg" />
      <Button variant="primary" size="lg">Submit</Button>
      <Button variant="secondary" size="lg">Cancel</Button>
    </div>
  ),
};

// ── Destructive pattern ───────────────────────────────────────
export const DestructiveWithConfirmation: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete account
        </Button>
        {open && (
          <div role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <h2 id="confirm-title">Delete account?</h2>
            <p>This action is permanent and cannot be undone.</p>
            <Button variant="destructive" onClick={() => setOpen(false)}>Yes, delete</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        )}
      </>
    );
  },
};
```

---

## 11. Anti-Patterns

| ❌ Don't | ✅ Do |
|---|---|
| Use multiple Primary buttons on the same surface | One Primary per surface — use Secondary/Tertiary for others |
| Use `<div>` or `<a>` for non-navigation actions | Use `<button>` |
| Execute destructive actions on single click | Always show confirmation dialog first |
| Use Ghost for the most important action on a surface | Reserve Ghost for low-emphasis inline actions |
| Set icon-only button without `aria-label` | Always provide `aria-label` when there's no visible text |
| Mix button sizes within the same form row | All controls in a row share the same size |
| Suppress `:focus-visible` | Always show the 2px tulip-purple ring |
| Use Destructive for risky-but-reversible actions | Destructive = permanent, irreversible actions only |

---

## 12. Related Components

| Component | Relationship |
|---|---|
| `IconButton` | Icon-only variant — a future dedicated component for cleaner icon-only semantics |
| `Split Action Button` | Compound: Primary + dropdown chevron for multi-action patterns |
| `Hyperlink` | Use when navigating to a URL — not for triggering actions |
| `Toggle Switch` | Use for immediate binary settings — not for form submission |
