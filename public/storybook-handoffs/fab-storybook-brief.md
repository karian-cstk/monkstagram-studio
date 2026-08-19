# FAB (Floating Action Button) — Storybook Engineering Brief
**Venus 2.1 RF | Component: FAB | Node: 1438:94302**
**Status: Active v1.0.0 | Page: 🔘 Actions | Last updated: 2026-07-16**

---

## 1. Purpose

`FAB` is a circular floating interactive button. It is the circular counterpart to `Button` — identical in token architecture, types, sizes, and states, differentiated solely by `cornerRadius=9999` and state-responsive elevation. The FAB communicates permanence and priority through its persistent circular shape and elevation above the surface.

**Use when:**
- A panel, drawer, or sidebar needs a persistent collapse/expand toggle (canonical use: NavPanel)
- A floating contextual action must be discoverable above scrolling content
- A primary page-level CTA benefits from circular shape to reinforce brand or action priority
- Any context where `Button` is correct but a pill/circle shape is required

**Do not use when:**
- The action is inline with form content — use `Button`
- The trigger is embedded inside another component (Tag dismiss, Alert close) — use `_Internal/Icon-Action`
- The action belongs in a toolbar — use `Icon Button`
- More than one primary FAB appears on the same surface — only one primary FAB per surface
- Navigation is the intent — use `Nav/Item`

**Alternatives:**
- `Button` — when a rectangular shape is appropriate and no elevation is needed
- `Icon Button` — for toolbar and inline icon triggers without elevation
- `_Internal/Icon-Action` — for dismiss/close triggers embedded inside compound components

---

## 2. Anatomy

```
[FAB root frame] ← COMPONENT node, AUTO width (HUG) × FIXED height, cornerRadius=9999
  ├── [icon/leading]  ← _Internal/Icon-Wrapper instance, FIXED size
  ├── [label]         ← TEXT node, Inter Medium, HUG × HUG
  ├── [icon/trailing] ← _Internal/Icon-Wrapper instance, FIXED size
  └── [focus-ring]    ← FRAME, ABSOLUTE, x=-4 y=-4, cornerRadius=9999, hidden by default
```

| Layer | DOM equivalent | Role |
|---|---|---|
| Root frame | `<button>` | Interactive container. Carries fill, stroke, opacity, cornerRadius=9999, elevation shadow. AUTO width (HUG), FIXED height. |
| `icon/leading` | `<span aria-hidden="true">` | Leading icon. Visible by default. _Internal/Icon-Wrapper instance. Size varies by component size. Venus_Icons mode set per type. |
| `label` | Text node inside `<button>` | Label text. Inter Medium. Hidden in icon-only usage (hasLabel=false). HUG sizing. |
| `icon/trailing` | `<span aria-hidden="true">` | Trailing icon. Hidden by default (hasTrailingIcon=false). Same spec as leading icon. |
| `focus-ring` | CSS `outline` / `box-shadow` | Keyboard focus indicator. ABSOLUTE, x=-4 y=-4, cornerRadius=9999, 2px stroke, focus/ring/color token. Hidden by default, shown when `hasFocus=true`. Never a separate DOM element. |

**Shape note:** Width HUGs content. In icon-only usage (`hasLabel=false`, `hasTrailingIcon=false`), width equals height — forming a true circle. With a label, width grows to accommodate the text, forming a pill.

**Elevation note:** The FAB always has a drop shadow. Elevation level responds to interaction state — it never disappears, even in disabled state.

---

## 3. TypeScript Props Interface

```typescript
interface FABProps {
  /**
   * Visual type of the FAB — determines fill, stroke, icon color, and elevation.
   * Identical token mapping to Button.
   * @default 'primary'
   */
  type?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';

  /**
   * Component size — controls height, padding, icon size, and gap.
   * sm (24px) is FAB-exclusive — not available on Button.
   * Use sm for compact toggle triggers (e.g. NavPanel collapse).
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Leading icon — rendered before the label.
   * In icon-only usage, this is the sole visible element.
   * Must be a valid Venus icon component.
   */
  leadingIcon?: React.ReactNode;

  /**
   * Trailing icon — rendered after the label.
   * Hidden by default. Show for directional affordance (e.g. expand/collapse arrows).
   */
  trailingIcon?: React.ReactNode;

  /**
   * Label text. Hidden when hasLabel=false.
   * @default 'Button'
   */
  label?: string;

  /**
   * Show or hide the leading icon.
   * @default true
   */
  hasLeadingIcon?: boolean;

  /**
   * Show or hide the trailing icon.
   * @default false
   */
  hasTrailingIcon?: boolean;

  /**
   * Show or hide the label text.
   * Set to false for icon-only circle FAB (NavPanel collapse toggle).
   * When false, width === height → true circle.
   * @default true
   */
  hasLabel?: boolean;

  /**
   * Accessible label for the button — REQUIRED when hasLabel=false.
   * Used as aria-label on the <button> element.
   * Must describe the action: "Collapse navigation panel" not "arrow icon".
   */
  accessibleLabel?: string;

  /**
   * Disables the button and applies 40% opacity (visibility/disabled).
   * Elevation is preserved at Level 1 even when disabled.
   * @default false
   */
  disabled?: boolean;

  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Additional CSS class names. Override via CSS custom properties only. */
  className?: string;

  /** Additional HTML button attributes */
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}
```

> **Note on sm size:** `size="sm"` (24px) is FAB-exclusive. It is approved for icon-only toggle use (NavPanel collapse/expand). It should not be used with `hasLabel=true` as the label will overflow. In development, warn if `size="sm"` and `hasLabel=true` are combined.

> **Note on accessibleLabel:** Required whenever `hasLabel=false`. When `hasLabel=true`, the visible label text provides the accessible name and `accessibleLabel` can be omitted.

---

## 4. Figma → React Prop Mapping

| Figma Property | Figma Type | React Prop | Notes |
|---|---|---|---|
| `Type` | VARIANT | `type` | `'primary' \| 'secondary' \| 'tertiary' \| 'ghost' \| 'destructive'` |
| `Size` | VARIANT | `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` |
| `State=Default` | VARIANT | — | CSS default state |
| `State=Hover` | VARIANT | — | CSS `:hover` — NEVER a prop |
| `State=Pressed` | VARIANT | — | CSS `:active` — NEVER a prop |
| `State=Disabled` | VARIANT | `disabled` | HTML `disabled` attr + `aria-disabled="true"` |
| `hasLeadingIcon` | BOOLEAN | `hasLeadingIcon` | Shows/hides leading icon |
| `hasTrailingIcon` | BOOLEAN | `hasTrailingIcon` | Shows/hides trailing icon |
| `hasLabel` | BOOLEAN | `hasLabel` | Shows/hides label text |
| `hasFocus` | BOOLEAN | — | Storybook/demo only. Maps to `:focus-visible` in production. |
| `label` | TEXT | `label` | Label text content |
| `accessibleLabel` | TEXT | `accessibleLabel` | Becomes `aria-label` when `hasLabel=false` |

**Elevation is not a prop.** It is applied automatically via CSS based on interaction state:
- Default / Disabled: `box-shadow: var(--elevation-level-1)`
- Hover: `box-shadow: var(--elevation-level-2)`
- Pressed: `box-shadow: var(--elevation-level-1)` (returns to base)

---

## 5. State Behaviour

| State | Trigger | Visual change | Token / Effect | Elevation | ARIA change |
|---|---|---|---|---|---|
| Default | — | Type-dependent fill | See Token Reference | Level 1 — Raised | — |
| Hover | `mouseenter` / `:hover` | Fill steps to hover token | `action/*/hover` | Level 2 — Dropdown (lifts toward user) | — |
| Pressed | `mousedown` / `:active` | Fill steps to pressed token | `action/*/active` | Level 1 — Raised (returns to surface) | — |
| Focused | `Tab` / `:focus-visible` | Focus ring visible (2px, radius/full, 4px offset) | `focus/ring/color` | Unchanged | — |
| Disabled | `disabled` prop | 40% opacity on root, no hover response | `visibility/disabled` (0.40) | Level 1 — Raised (preserved) | `aria-disabled="true"`, `tabIndex=-1` |

**Important:** Hover and Pressed are pure CSS pseudo-classes. Do not manage with React state. `hasFocus` on the Figma component is a Storybook/demo utility only — in production, focus is handled by `:focus-visible`.

**Elevation behaviour:** The FAB always has a shadow. Unlike Material Design, the FAB does not lose its shadow when disabled — the shadow at Level 1 is always present to communicate the floating nature of the component.

---

## 6. Size Specification

| Size | Height | Padding | Gap | Icon | Label style | Corner radius | Min touch target | Exclusive |
|---|---|---|---|---|---|---|---|---|
| sm | 24px | 4px (layout/padding/2xs) | 4px (layout/gap/2xs) | 12px | Label/MD 12px | radius/full | ✅ 24px | FAB only |
| md | 32px | 8px (layout/padding/xs) | 4px (layout/gap/2xs) | 16px | Label/LG 13px | radius/full | ✅ 32px | — |
| lg | 40px | 8px (layout/padding/xs) | 8px (layout/gap/xs) | 20px | Label/LG 13px | radius/full | ✅ 40px | — |
| xl | 52px | 12px (layout/padding/sm) | 8px (layout/gap/xs) | 24px | Label/XL 14px | radius/full | ✅ 52px | — |

**Width:** Always HUG (primaryAxisSizingMode=AUTO). In icon-only usage, width equals height.
**Height:** Always FIXED (counterAxisSizingMode=FIXED).
**Icon-only circle:** sm=24×24px, md=32×32px, lg=40×40px, xl=52×52px.

**Focus ring offsets:** 4px offset on all sizes (focus ring extends 4px beyond the component boundary on each side). Focus ring uses `cornerRadius=radius/full` to maintain the pill/circle shape.

**sm size note:** sm is FAB-exclusive and approved for icon-only toggle use only (NavPanel collapse, panel toggles). Do not use sm with a visible label — the 24px height constrains the text.

---

## 7. Token Reference

All tokens are Venus_Semantics unless noted. No Venus_Components tokens are used.

### Root frame fills

| Type | State | Token | Light value | Dark value |
|---|---|---|---|---|
| Primary | Default | `action/primary` | purple/500 #6C5CE7 | purple/400 |
| Primary | Hover | `action/primary/hover` | purple/600 #5D50BF | purple/500 |
| Primary | Pressed | `action/primary/active` | purple/700 #4C42A0 | purple/200 |
| Secondary | Default | `action/secondary` | white #FFFFFF | gray/800 |
| Secondary | Hover | `action/secondary/hover` | purple/100 #EDE9FE | purple/800 |
| Secondary | Pressed | `action/secondary/active` | purple/200 #DDD6FE | purple/700 |
| Tertiary | Default | — (no fill) | — | — |
| Tertiary | Hover | `action/secondary/hover` | purple/100 | purple/800 |
| Tertiary | Pressed | `action/ghost/pressed` | purple/200 | purple/700 |
| Ghost | Default | `action/ghost` | transparent | transparent |
| Ghost | Hover | `action/secondary/hover` | purple/100 | purple/800 |
| Ghost | Pressed | `action/ghost/pressed` | purple/200 | purple/700 |
| Destructive | Default | `action/destructive` | red/600 #CD0200 | red/500 |
| Destructive | Hover | `action/destructive/hover` | red/700 #9B0000 | red/400 |
| Destructive | Pressed | `action/destructive` | red/600 | red/500 |

### Root frame strokes

| Type | Token | Light | Dark |
|---|---|---|---|
| Primary | — (none) | — | — |
| Secondary | `border/brand` | purple/500 | purple/400 |
| Tertiary | `border/default` | gray/200 | gray/700 |
| Ghost | — (none) | — | — |
| Destructive | — (none) | — | — |

### Label fills

| Type | Token | Light | Dark |
|---|---|---|---|
| Primary | `text/inverse` | white #FFFFFF | white |
| Secondary | `text/brand` | purple/500 | purple/400 |
| Tertiary | `text/brand` | purple/500 | purple/400 |
| Ghost | `text/subtle` | gray/600 | gray/400 |
| Destructive | `text/inverse` | white #FFFFFF | white |

### Icon modes (Venus_Icons collection)

| Type | Mode | Icon color |
|---|---|---|
| Primary | inverted (564:8) | white |
| Secondary | default (564:7) | brand purple |
| Tertiary | default (564:7) | brand purple |
| Ghost | default (564:7) | brand purple |
| Destructive | inverted (564:8) | white ← NOT error mode |

### Spacing tokens

| Size | Padding token | Padding value | Gap token | Gap value |
|---|---|---|---|---|
| sm | `layout/padding/2xs` | 4px | `layout/gap/2xs` | 4px |
| md | `layout/padding/xs` | 8px | `layout/gap/2xs` | 4px |
| lg | `layout/padding/xs` | 8px | `layout/gap/xs` | 8px |
| xl | `layout/padding/sm` | 12px | `layout/gap/xs` | 8px |

### Shape tokens

| Property | Token | Value |
|---|---|---|
| cornerRadius (component) | `radius/full` | 9999 |
| cornerRadius (focus ring) | `radius/full` | 9999 |
| focus ring strokeWeight | `border-width/2` | 2px |
| focus ring stroke | `focus/ring/color` | purple/500 (Light) / purple/400 (Dark) |

### Disabled state

| Layer | Token | Value |
|---|---|---|
| Root frame opacity | `visibility/disabled` | 0.40 |

### Elevation (via Venus effect styles)

| State | Effect style | Style ID |
|---|---|---|
| Default | Elevation/Level 1 — Raised | S:2af0ee2f829ac1852d6bc1d86ef334ff42f3e149, |
| Hover | Elevation/Level 2 — Dropdown | S:b25a21de1110e6eab73611ec948e266de3c55944, |
| Pressed | Elevation/Level 1 — Raised | S:2af0ee2f829ac1852d6bc1d86ef334ff42f3e149, |
| Disabled | Elevation/Level 1 — Raised | S:2af0ee2f829ac1852d6bc1d86ef334ff42f3e149, |

---

## 8. Accessibility

### ARIA

- `role="button"` (native `<button>` element — do not use `role="button"` on a `<div>`)
- `aria-label={accessibleLabel}` — required when `hasLabel=false`
- `aria-disabled="true"` — required when disabled (in addition to HTML `disabled` attribute)
- `aria-pressed` — required for toggle actions (e.g. NavPanel collapse: `aria-pressed={!isExpanded}`)

### Keyboard

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to FAB |
| `Space` | Activates the FAB |
| `Enter` | Activates the FAB |

### Contrast ratios (Light mode, all pass WCAG AA ≥ 4.5:1)

| Type | Foreground | Background | Ratio |
|---|---|---|---|
| Primary | text/inverse (#FFFFFF) | action/primary (#6C5CE7) | 4.86:1 ✅ |
| Secondary | text/brand (#6C5CE7) | action/secondary (#FFFFFF) | 5.91:1 ✅ |
| Tertiary | text/brand (#6C5CE7) | surface/default (#F9FAFB) | 5.97:1 ✅ |
| Ghost | text/subtle (#4B5563) | surface/default (#F9FAFB) | 7.23:1 ✅ |
| Destructive | text/inverse (#FFFFFF) | action/destructive (#CD0200) | 5.84:1 ✅ |
| Disabled | All types | — | Exempt (WCAG 1.4.3 — disabled states are exempt) |

### Touch targets

| Size | Dimensions | WCAG 2.5.5 status |
|---|---|---|
| sm | 24×24px | ✅ Meets minimum 24×24px |
| md | 32×32px | ✅ |
| lg | 40×40px | ✅ |
| xl | 52×52px | ✅ |

### Screen reader announcement

When `hasLabel=false`: screen reader announces `accessibleLabel` + "button".
When `hasLabel=true`: screen reader announces visible label text + "button".
On activation: the action result must be announced via `aria-live` at the application level (not the FAB's responsibility).
For toggle use: screen reader announces `accessibleLabel` + "button" + pressed state (`aria-pressed`).

---

## 9. Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { FAB } from './FAB';
import {
  CaretLeftIcon, CaretRightIcon, PlusIcon, SearchIcon,
  DotsThreeVerticalIcon, ArrowsOutIcon, XIcon
} from '@contentstack/icons';

const meta: Meta<typeof FAB> = {
  title: 'Actions/FAB',
  component: FAB,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'destructive'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    hasLabel: { control: 'boolean' },
    hasLeadingIcon: { control: 'boolean' },
    hasTrailingIcon: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof FAB>;

// 1. Default — icon-only circle (most common usage)
export const Default: Story = {
  args: {
    type: 'primary',
    size: 'md',
    hasLabel: false,
    hasLeadingIcon: true,
    hasTrailingIcon: false,
    leadingIcon: <PlusIcon />,
    accessibleLabel: 'Add item',
  },
};

// 2. WithLabel — pill shape
export const WithLabel: Story = {
  args: {
    type: 'primary',
    size: 'md',
    hasLabel: true,
    hasLeadingIcon: true,
    hasTrailingIcon: false,
    leadingIcon: <PlusIcon />,
    label: 'Add item',
  },
};

// 3. AllTypes — icon-only at md
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <FAB type="primary"     size="md" hasLabel={false} leadingIcon={<PlusIcon />}     accessibleLabel="Primary" />
      <FAB type="secondary"   size="md" hasLabel={false} leadingIcon={<PlusIcon />}     accessibleLabel="Secondary" />
      <FAB type="tertiary"    size="md" hasLabel={false} leadingIcon={<PlusIcon />}     accessibleLabel="Tertiary" />
      <FAB type="ghost"       size="md" hasLabel={false} leadingIcon={<PlusIcon />}     accessibleLabel="Ghost" />
      <FAB type="destructive" size="md" hasLabel={false} leadingIcon={<XIcon />}        accessibleLabel="Destructive" />
    </div>
  ),
};

// 4. AllSizes — Primary icon-only to show size ladder
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <FAB type="primary" size="sm" hasLabel={false} leadingIcon={<PlusIcon />} accessibleLabel="Add (sm)" />
      <FAB type="primary" size="md" hasLabel={false} leadingIcon={<PlusIcon />} accessibleLabel="Add (md)" />
      <FAB type="primary" size="lg" hasLabel={false} leadingIcon={<PlusIcon />} accessibleLabel="Add (lg)" />
      <FAB type="primary" size="xl" hasLabel={false} leadingIcon={<PlusIcon />} accessibleLabel="Add (xl)" />
    </div>
  ),
};

// 5. ElevationStates — Show elevation ladder visually
export const ElevationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', padding: '24px', background: 'var(--surface-sunken)' }}>
      <div style={{ textAlign: 'center' }}>
        <FAB type="primary" size="md" hasLabel={false} leadingIcon={<PlusIcon />} accessibleLabel="Default" />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-subtle)' }}>Default<br/>Level 1</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        {/* Hover state — use Storybook pseudo addon */}
        <FAB type="primary" size="md" hasLabel={false} leadingIcon={<PlusIcon />} accessibleLabel="Hover" className="pseudo-hover" />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-subtle)' }}>Hover<br/>Level 2</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <FAB type="primary" size="md" hasLabel={false} leadingIcon={<PlusIcon />} accessibleLabel="Pressed" className="pseudo-active" />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-subtle)' }}>Pressed<br/>Level 1</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Elevation responds to interaction state. Hover lifts the FAB (Level 2 — Dropdown). Pressed and Default return to Level 1 — Raised. Disabled also preserves Level 1.',
      },
    },
  },
};

// 6. NavPanelToggle — canonical sm icon-only use case
export const NavPanelToggle: Story = {
  render: () => {
    const [expanded, setExpanded] = React.useState(true);
    return (
      <div style={{ position: 'relative', width: '280px', height: '200px', background: 'var(--surface-sunken)', border: '1px solid var(--border-default)' }}>
        <FAB
          type="primary"
          size="sm"
          hasLabel={false}
          hasTrailingIcon={false}
          leadingIcon={expanded ? <CaretLeftIcon /> : <CaretRightIcon />}
          accessibleLabel={expanded ? 'Collapse navigation panel' : 'Expand navigation panel'}
          aria-pressed={!expanded}
          onClick={() => setExpanded(!expanded)}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '16px',
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Canonical NavPanel usage. Size=sm, type=primary, icon-only. Positioned absolute on the right edge of the panel, straddling the border. Icon swaps between CaretLeft and CaretRight based on expanded state.',
      },
    },
  },
};

// 7. DisabledAllTypes
export const DisabledAllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <FAB type="primary"     size="md" hasLabel={false} leadingIcon={<PlusIcon />}     accessibleLabel="Primary disabled"     disabled />
      <FAB type="secondary"   size="md" hasLabel={false} leadingIcon={<PlusIcon />}     accessibleLabel="Secondary disabled"   disabled />
      <FAB type="tertiary"    size="md" hasLabel={false} leadingIcon={<PlusIcon />}     accessibleLabel="Tertiary disabled"    disabled />
      <FAB type="ghost"       size="md" hasLabel={false} leadingIcon={<PlusIcon />}     accessibleLabel="Ghost disabled"       disabled />
      <FAB type="destructive" size="md" hasLabel={false} leadingIcon={<XIcon />}        accessibleLabel="Destructive disabled" disabled />
    </div>
  ),
};

// 8. FocusVisible
export const FocusVisible: Story = {
  args: {
    type: 'primary',
    size: 'md',
    hasLabel: false,
    leadingIcon: <SearchIcon />,
    accessibleLabel: 'Search',
  },
  parameters: {
    pseudo: { focusVisible: true },
  },
};

// 9. AllTypesWithLabel — pill form
export const AllTypesWithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <FAB type="primary"     size="md" hasLabel={true} leadingIcon={<PlusIcon />}  label="Primary" />
      <FAB type="secondary"   size="md" hasLabel={true} leadingIcon={<PlusIcon />}  label="Secondary" />
      <FAB type="tertiary"    size="md" hasLabel={true} leadingIcon={<PlusIcon />}  label="Tertiary" />
      <FAB type="ghost"       size="md" hasLabel={true} leadingIcon={<PlusIcon />}  label="Ghost" />
      <FAB type="destructive" size="md" hasLabel={true} leadingIcon={<XIcon />}     label="Destructive" />
    </div>
  ),
};

// 10. DarkMode
export const DarkMode: Story = {
  args: {
    type: 'primary',
    size: 'md',
    hasLabel: false,
    leadingIcon: <PlusIcon />,
    accessibleLabel: 'Add item',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};
```

---

## 10. Implementation Notes

### CSS custom properties

```css
/* Shape */
--fab-radius: var(--radius-full);           /* 9999px */

/* Spacing — sm */
--fab-sm-padding: var(--layout-padding-2xs); /* 4px */
--fab-sm-gap: var(--layout-gap-2xs);         /* 4px */
--fab-sm-icon-size: 12px;

/* Spacing — md */
--fab-md-padding: var(--layout-padding-xs);  /* 8px */
--fab-md-gap: var(--layout-gap-2xs);         /* 4px */
--fab-md-icon-size: 16px;

/* Spacing — lg */
--fab-lg-padding: var(--layout-padding-xs);  /* 8px */
--fab-lg-gap: var(--layout-gap-xs);          /* 8px */
--fab-lg-icon-size: 20px;

/* Spacing — xl */
--fab-xl-padding: var(--layout-padding-sm);  /* 12px */
--fab-xl-gap: var(--layout-gap-xs);          /* 8px */
--fab-xl-icon-size: 24px;

/* Elevation */
--fab-elevation-default: var(--elevation-level-1);
--fab-elevation-hover:   var(--elevation-level-2);
--fab-elevation-pressed: var(--elevation-level-1);

/* Elevation Level 1 — Raised (CSS) */
--elevation-level-1: 0 1px 3px rgba(0,0,0,0.20),
                     0 2px 2px rgba(0,0,0,0.14),
                     0 0 2px rgba(0,0,0,0.12);

/* Elevation Level 2 — Dropdown (CSS) */
--elevation-level-2: 0 2px 4px -1px rgba(0,0,0,0.20),
                     0 5px 5px rgba(0,0,0,0.14),
                     0 1px 10px rgba(0,0,0,0.12);
```

### Elevation implementation

```css
.fab {
  box-shadow: var(--fab-elevation-default);
  transition: box-shadow 150ms ease-in-out;
}
.fab:hover:not(:disabled) {
  box-shadow: var(--fab-elevation-hover);
}
.fab:active:not(:disabled) {
  box-shadow: var(--fab-elevation-pressed);
}
.fab:disabled {
  box-shadow: var(--fab-elevation-default); /* preserved at Level 1 */
}
```

### Focus ring implementation

```css
.fab:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 4px;
  border-radius: 9999px; /* pill/circle shape maintained */
}
```

### Icon color via CSS custom properties

Use Venus_Icons CSS modes to switch icon color automatically. Do not hardcode icon fill colors.

### Dark mode

Toggle `data-theme="dark"` on the root `<html>` or theme provider. All semantic tokens automatically switch. No component-level logic required.

### sm + label development guard

```typescript
if (process.env.NODE_ENV === 'development') {
  if (size === 'sm' && hasLabel) {
    console.warn(
      '[FAB] size="sm" is designed for icon-only use. ' +
      'Combining size="sm" with hasLabel=true will overflow the 24px height. ' +
      'Use size="md" or set hasLabel=false.'
    );
  }
  if (!hasLabel && !accessibleLabel) {
    console.warn(
      '[FAB] Icon-only FAB requires accessibleLabel for screen reader support.'
    );
  }
}
```

### Reduced motion

The elevation transition uses `transition: box-shadow 150ms`. Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .fab {
    transition: none;
  }
}
```

---

## 11. Do / Don't

**✅ Do — Use icon-only sm FAB for panel toggles**
```tsx
<FAB
  type="primary"
  size="sm"
  hasLabel={false}
  leadingIcon={<CaretLeftIcon />}
  accessibleLabel="Collapse navigation panel"
  aria-pressed={!isExpanded}
  onClick={handleCollapse}
/>
```
**❌ Don't — Use Icon Button for panel toggles**
`Icon Button` has no elevation and no pill radius — it reads as a flat toolbar action, not a floating toggle. FAB communicates persistence and elevation through its shape and shadow.

---

**✅ Do — Preserve elevation on disabled FAB**
The shadow should always be present. A FAB without a shadow looks broken, even when disabled.
**❌ Don't — Remove the shadow on disabled state**
```css
.fab:disabled { box-shadow: none; } /* ❌ wrong */
```

---

**✅ Do — Provide accessibleLabel when hasLabel=false**
```tsx
<FAB hasLabel={false} leadingIcon={<PlusIcon />} accessibleLabel="Add entry" />
```
**❌ Don't — Leave accessibleLabel empty on icon-only FAB**
```tsx
<FAB hasLabel={false} leadingIcon={<PlusIcon />} /> /* ❌ no accessible name */
```
Screen readers will announce "button" with no context. WCAG 4.1.2 failure.

---

**✅ Do — Use Destructive with inverted (white) icon**
Destructive has a red fill — the icon must be white to maintain contrast.
**❌ Don't — Use error mode icons on Destructive FAB**
The `error` Venus_Icons mode is for status feedback contexts (alerts, validation). Destructive is an action type — its icon uses `inverted` mode (white), not `error` mode (red on red).

---

**✅ Do — Let CSS handle elevation transitions**
```css
.fab { transition: box-shadow 150ms ease-in-out; }
.fab:hover { box-shadow: var(--elevation-level-2); }
```
**❌ Don't — Manage elevation with React state**
```tsx
const [isHovered, setIsHovered] = useState(false);
// ❌ Unnecessary. CSS handles this.
```

---

**✅ Do — Position sm FAB straddling the panel edge**
```tsx
style={{ position: 'absolute', right: '-12px', top: '16px' }}
// right: -(half of 24px) = -12px centres the circle on the edge
```
**❌ Don't — Position sm FAB entirely inside the panel**
The straddling position communicates "toggle this panel" — placing it inside makes it read as a regular panel action.

---

## 12. Related Components

| Component | Relationship | When to use instead |
|---|---|---|
| `Button` | Rectangular counterpart. Same tokens, types, sizes, states. | Use Button in inline form contexts, CTAs without elevation, anywhere a rectangular shape is appropriate. |
| `Icon Button` | Flat icon trigger — no elevation, no pill shape, no sm size. | Use Icon Button in toolbars, table headers, inline editors where elevation would be visually disruptive. |
| `_Internal/Icon-Action` | Embedded dismiss/close trigger. Internal atom, not published. | Use inside Tag, Alert, Toast, Modal close — embedded inside another component's footprint. |
| `Split Action Button` | Compound primary + dropdown trigger. No elevation. | Use when the icon trigger must pair with a labelled primary action in a form or dialog context. |
| `Nav/Item` | Navigation trigger — flat, no elevation. | Use for sidebar navigation items. FAB is a floating action trigger, not a navigation element. |
