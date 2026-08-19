# Toggle Switch — Storybook Brief
**Venus 2.1 RF · Design System**
**Component:** `ToggleSwitch`
**Page:** 🔘 Actions
**Figma node:** `652:29329`
**Version:** 2.1.0
**Status:** Active
**Date:** 2026-05-28

---

## 1. Purpose

A binary on/off control for settings and preferences that take immediate effect — no form submission required. Use when the action is instant and reversible. Semantically equivalent to `<input type="checkbox" role="switch">`.

**Use Toggle Switch when:**
- The change takes effect immediately (e.g. dark mode, notifications, feature flags)
- The state is clearly binary: enabled / disabled

**Do not use Toggle Switch when:**
- The choice is part of a form submitted later → use Checkbox instead
- Multiple mutually exclusive options exist → use Radio group instead
- The action is destructive or irreversible → use a Button with confirmation

---

## 2. Component Anatomy

```
[Root variant frame]  — HORIZONTAL auto layout, counterAxisAlignItems=CENTER
├── toggle-track-container   Absolute-positioned track + thumb + focus ring
│   ├── toggle-focus-ring    Pill-shaped 2px ring (visible only when hasFocus=true)
│   ├── toggle-track         Pill rectangle — color encodes ON/OFF state
│   └── toggle-thumb         Circular indicator — position encodes ON/OFF state
└── toggle-label             Text label (position varies by labelPosition variant)
```

**Label positions:** `Right` (default) · `Left` · `Top`
For `Top`, the root frame switches to VERTICAL auto layout.

---

## 3. Props Interface

```typescript
export interface ToggleSwitchProps {
  // ─── State ────────────────────────────────────────────────────
  /** Whether the toggle is currently on. */
  checked?: boolean;

  /** Default value for uncontrolled usage. */
  defaultChecked?: boolean;

  /** Callback fired on toggle. Receives the new checked value. */
  onChange?: (checked: boolean) => void;

  // ─── Label ────────────────────────────────────────────────────
  /** Label text displayed alongside the toggle. */
  label?: string;

  /**
   * Position of the label relative to the track.
   * @default 'right'
   */
  labelPosition?: 'right' | 'left' | 'top';

  // ─── Size ─────────────────────────────────────────────────────
  /**
   * lg — 36×20px track, 20×20px thumb. Component height 40px. Label: 16px.
   * md — 28×16px track, 16×16px thumb. Component height 32px. Label: 14px.
   * @default 'lg'
   */
  size?: 'lg' | 'md';

  // ─── Interaction mode ─────────────────────────────────────────
  /** Disables the toggle entirely. aria-disabled="true", no interaction. */
  disabled?: boolean;

  /**
   * Makes the toggle read-only — visible and meaningful but locked.
   * aria-readonly="true", no interaction. Visually identical to disabled.
   */
  readOnly?: boolean;

  // ─── Accessibility ────────────────────────────────────────────
  /**
   * Accessible name when no visible label is provided.
   * Required if label is empty or undefined.
   */
  'aria-label'?: string;

  /** Associates the toggle with an external description element. */
  'aria-describedby'?: string;

  /** Unique id for the underlying input element. */
  id?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | Type | React Prop | Notes |
|---|---|---|---|
| `isActive=True` | VARIANT | `checked={true}` | |
| `isActive=False` | VARIANT | `checked={false}` | Default |
| `State=Default` | VARIANT | CSS `:default` | Internal — never a prop |
| `State=Hover` | VARIANT | CSS `:hover` | Internal — never a prop |
| `State=Disabled` | VARIANT | `disabled={true}` | Consumer prop |
| `State=ReadOnly` | VARIANT | `readOnly={true}` | Consumer prop |
| `labelPosition=Right` | VARIANT | `labelPosition="right"` | Default |
| `labelPosition=Left` | VARIANT | `labelPosition="left"` | |
| `labelPosition=Top` | VARIANT | `labelPosition="top"` | |
| `Size=lg` | VARIANT | `size="lg"` | Default |
| `Size=md` | VARIANT | `size="md"` | |
| `label` | TEXT | `label="..."` | |
| `hasFocus` | BOOLEAN | Internal only | Design-time toggle — maps to CSS `:focus-visible`. Never a consumer prop. |

---

## 5. State Behaviour

| State | Trigger | Visual changes | Token changes |
|---|---|---|---|
| OFF Default | At rest, unchecked | Gray track, thumb at left (x=4px) | `toggle/track/off/default` fill |
| OFF Hover | Mouse over, unchecked | Darker gray track, brand label | `toggle/track/off/hover` fill · `toggle/label/hover` text |
| ON Default | At rest, checked | Brand purple track, thumb at right | `toggle/track/on/default` fill |
| ON Hover | Mouse over, checked | Deeper purple track, brand label | `toggle/track/on/hover` fill · `toggle/label/hover` text |
| Focused | `:focus-visible` (keyboard) | 2px tulip-purple pill ring appears 6px outside track | `toggle/border/focus` on `toggle-focus-ring` |
| Disabled | `disabled` prop | 40% opacity on entire component. No hover. Cursor: not-allowed. | `visibility/disabled` on root |
| ReadOnly | `readOnly` prop | 40% opacity on entire component. No hover. Cursor: not-allowed. | `visibility/disabled` on root |

**Disabled vs ReadOnly:** Visually identical at 40% opacity. Semantically different:
- `disabled` → `aria-disabled="true"` — the control is not applicable in this context
- `readOnly` → `aria-readonly="true"` — the value is meaningful but locked

**Focused + ON or OFF:** The focus ring appears regardless of checked state. It surrounds the track at all times when keyboard-focused.

**Hover is suppressed on Disabled and ReadOnly.**

---

## 6. Sizing Specification

| Size | Track | Thumb | Thumb OFF x | Thumb ON x | Padding | Label | Touch target |
|---|---|---|---|---|---|---|---|
| `lg` | 36×20px | 20×20px | x=4px | x=20px | 8px all sides | body/lg · 16px · Regular | 40px |
| `md` | 28×16px | 16×16px | x=4px | x=16px | 8px all sides | body/md · 14px · Regular | 32px |

Focus ring: `lg` = 48×32px (track+12px, 6px each side) · `md` = 40×26px
Track corner radius: 100 (full pill) · Thumb: ELLIPSE (inherently circular)

---

## 7. Token Reference

### Track

| State | Condition | Token | Light | Dark |
|---|---|---|---|---|
| `toggle-track` | OFF, default | `toggle/track/off/default` → `surface/control/inactive` | gray/500 #6B7280 | gray/500 #6B7280 |
| `toggle-track` | OFF, hover | `toggle/track/off/hover` → `surface/control/inactive/hover` | gray/600 #4B5563 | gray/400 #9CA3AF |
| `toggle-track` | ON, default | `toggle/track/on/default` → `action/primary` | purple/500 #6C5CE7 | purple/400 #9F93FA |
| `toggle-track` | ON, hover | `toggle/track/on/hover` → `action/primary/hover` | purple/600 #5D50BF | purple/300 #C4B5FD |

### Thumb

| Layer | Token | Light | Dark |
|---|---|---|---|
| `toggle-thumb` | `toggle/thumb/default` → `surface/control/thumb` | #FFFFFF | #FFFFFF |

### Label

| State | Token | Light | Dark |
|---|---|---|---|
| Default / Focused / Disabled / ReadOnly | `toggle/label/default` → `text/default` | gray/900 #111827 | gray/50 #F9FAFB |
| Hover | `toggle/label/hover` → `text/brand` | purple/600 #5D50BF | purple/400 #9F93FA |

### Focus ring

| Layer | Token | Light | Dark |
|---|---|---|---|
| `toggle-focus-ring` stroke | `toggle/border/focus` → `border/focus` → `focus/ring/color` | #B6AEF3 | #9F93FA |
| Stroke weight | 2px | — | — |
| Offset from track edge | 6px each side | — | — |

### Disabled / ReadOnly (root layer)

| Token | Value | Applied to |
|---|---|---|
| `visibility/disabled` | 40 (→ 40% opacity) | Root component frame |

### CSS Custom Properties

```css
/* Token → CSS variable (1:1, no nesting) */
--toggle-track-off:          #6B7280;    /* Light: surface/control/inactive */
--toggle-track-off-hover:    #4B5563;    /* Light: surface/control/inactive/hover */
--toggle-track-on:           #6C5CE7;    /* Light: action/primary */
--toggle-track-on-hover:     #5D50BF;    /* Light: action/primary/hover */
--toggle-thumb:              #FFFFFF;    /* surface/control/thumb — both modes */
--toggle-label-default:      #111827;    /* Light: text/default */
--toggle-label-hover:        #5D50BF;    /* Light: text/brand */
--toggle-focus-ring:         #B6AEF3;    /* Light: border/focus */
--visibility-disabled:       0.4;
```

---

## 8. Accessibility Requirements

### Semantic HTML

```html
<!-- Standalone toggle with visible label -->
<label class="toggle-wrapper">
  <input
    type="checkbox"
    role="switch"
    id="notifications"
    aria-checked="true"
    aria-describedby="notifications-desc"
  />
  <span class="toggle-track" aria-hidden="true">
    <span class="toggle-thumb"></span>
  </span>
  <span class="toggle-label">Enable notifications</span>
  <span id="notifications-desc" class="toggle-subtext">
    You'll receive alerts for new entries.
  </span>
</label>

<!-- Disabled -->
<input type="checkbox" role="switch" disabled aria-disabled="true" />

<!-- ReadOnly -->
<input type="checkbox" role="switch" aria-readonly="true"
       onKeyDown={(e) => e.preventDefault()}
       onClick={(e) => e.preventDefault()} />

<!-- No visible label — aria-label required -->
<input type="checkbox" role="switch" aria-label="Dark mode" />
```

### Keyboard behaviour

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to the toggle |
| `Space` | Toggles the checked state (if not disabled or readOnly) |
| `Enter` | Toggles the checked state (if not disabled or readOnly) |

Unlike radio buttons, toggles do **not** respond to arrow keys. Each toggle is independently focusable via Tab.

### Focus ring

```css
input[type="checkbox"][role="switch"]:focus-visible + .toggle-track::before {
  content: '';
  position: absolute;
  inset: -6px;            /* 6px offset — wider than standard 2px for pill legibility */
  border-radius: 999px;   /* pill shape */
  border: 2px solid var(--toggle-focus-ring);
  pointer-events: none;
}
```

### ARIA

```html
<!-- Correct: role="switch" + aria-checked -->
<input type="checkbox" role="switch" aria-checked="true" />

<!-- Wrong: checkbox without role="switch" reads as "checkbox", not "switch" -->
<input type="checkbox" checked />

<!-- Disabled state -->
<input type="checkbox" role="switch" disabled aria-disabled="true" />
<!-- Note: HTML `disabled` removes the element from tab order.
     If tab-reachability is required for read-through, use aria-disabled without
     the native disabled attribute and block interaction in JS instead. -->

<!-- ReadOnly state -->
<input type="checkbox" role="switch"
       aria-checked="true"
       aria-readonly="true"
       tabIndex={0} />
```

---

## 9. Implementation Notes

### Thumb animation

```css
.toggle-thumb {
  position: absolute;
  transition: left 150ms var(--easing-ease-in-out);
  /* OFF: */  left: 4px;
  /* ON lg: */ left: 20px;   /* track width (36) - thumb width (20) + 4px padding = 20 */
  /* ON md: */ left: 16px;   /* track width (28) - thumb width (16) + 4px padding = 16 */
}

@media (prefers-reduced-motion: reduce) {
  .toggle-thumb {
    transition: none;
  }
}
```

### Controlled vs uncontrolled

```tsx
// Controlled
const [checked, setChecked] = useState(false);
<ToggleSwitch checked={checked} onChange={setChecked} label="Dark mode" />

// Uncontrolled
<ToggleSwitch defaultChecked={false} onChange={console.log} label="Dark mode" />
```

### Disabled vs ReadOnly implementation

```tsx
// Disabled — remove from tab order, aria-disabled
<ToggleSwitch disabled label="Feature unavailable" />
// → tabIndex={-1}, aria-disabled="true", cursor: not-allowed, opacity: 0.4

// ReadOnly — keep in tab order, block interaction in JS
<ToggleSwitch readOnly checked={true} label="SSO enforced by admin" />
// → tabIndex={0}, aria-readonly="true", aria-checked="true",
//   onKeyDown + onClick prevented, cursor: not-allowed, opacity: 0.4
```

### Label position layout

```tsx
// Right (default) — HORIZONTAL, label after track
// Left — HORIZONTAL, label before track  
// Top — VERTICAL, label above track

<ToggleSwitch labelPosition="top" label="Enable beta features" />
```

---

## 10. Stories to Implement

### Default (canvas entry point)

```tsx
export const Default: Story = {
  args: {
    label: 'Enable feature',
    checked: false,
    size: 'lg',
    labelPosition: 'right',
    disabled: false,
    readOnly: false,
  },
};
```

### Checked

```tsx
export const Checked: Story = {
  args: { ...Default.args, checked: true },
};
```

### Sizes

```tsx
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ToggleSwitch size="lg" label="Large (lg) — default" />
      <ToggleSwitch size="md" label="Medium (md)" />
    </div>
  ),
};
```

### Label Positions

```tsx
export const LabelPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ToggleSwitch labelPosition="right" label="Label right (default)" checked />
      <ToggleSwitch labelPosition="left"  label="Label left" checked />
      <ToggleSwitch labelPosition="top"   label="Label top" checked />
    </div>
  ),
};
```

### Disabled

```tsx
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ToggleSwitch disabled label="Disabled unchecked" />
      <ToggleSwitch disabled checked label="Disabled checked" />
    </div>
  ),
};
```

### ReadOnly

```tsx
export const ReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ToggleSwitch readOnly label="Read-only unchecked" />
      <ToggleSwitch readOnly checked label="Read-only checked (e.g. enforced by admin)" />
    </div>
  ),
};
```

### All States — Visual Reference

```tsx
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ToggleSwitch label="OFF — default"  />
      <ToggleSwitch label="ON — default"   checked />
      <ToggleSwitch label="OFF — disabled" disabled />
      <ToggleSwitch label="ON — disabled"  disabled checked />
      <ToggleSwitch label="OFF — readOnly" readOnly />
      <ToggleSwitch label="ON — readOnly"  readOnly checked />
    </div>
  ),
};
```

### Controlled Interactive Demo

```tsx
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <ToggleSwitch
        checked={checked}
        onChange={setChecked}
        label={checked ? 'Dark mode on' : 'Dark mode off'}
        size="lg"
      />
    );
  },
};
```

### Argstable Controls

```tsx
export default {
  title: 'Components/Actions/Toggle Switch',
  component: ToggleSwitch,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu?node-id=652:29329',
    },
  },
  argTypes: {
    label:         { control: 'text',    description: 'Label text.' },
    labelPosition: { control: 'radio',   options: ['right', 'left', 'top'], description: 'Label position relative to track.' },
    size:          { control: 'radio',   options: ['lg', 'md'], description: 'Track size.' },
    checked:       { control: 'boolean', description: 'ON/OFF state (controlled).' },
    disabled:      { control: 'boolean', description: 'Disabled — removes from interaction and tab order.' },
    readOnly:      { control: 'boolean', description: 'ReadOnly — locked but tab-reachable.' },
    onChange:      { action: 'changed' },
  },
} satisfies Meta<typeof ToggleSwitch>;
```

---

## 11. Anti-Patterns

| ❌ Don't | ✅ Do |
|---|---|
| Use Toggle for choices in a submitted form | Use Checkbox for form fields |
| Use Toggle for one of several options | Use Radio group for mutually exclusive choices |
| Use Toggle for destructive/irreversible actions | Use Button + confirmation dialog |
| Apply Enter key toggle without Space | Implement both Space and Enter |
| Suppress `:focus-visible` | Always show 2px tulip-purple focus ring |
| Set `disabled` when the field is locked by an admin | Use `readOnly` — it stays tab-reachable and announces its state |
| Omit `aria-label` when there is no visible label | Always provide an accessible name |
| Forget `prefers-reduced-motion` on the thumb transition | Respect it — transition: none |

---

## 12. Related Components

| Component | Relationship |
|---|---|
| `Checkbox` | Use for form fields with explicit submit action; supports indeterminate state |
| `Radio` | Use for mutually exclusive options within a group |
| `Button` | Use when action is not immediately reversible or requires confirmation |

