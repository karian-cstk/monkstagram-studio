# Checkbox — Storybook Engineering Brief
**Venus 2.1 RF · Contentstack Design System**
Figma node: `652:30460` · Version: 2.1.1 · Last updated: 2026-05-28

---

## 1. Purpose

`Checkbox` is a binary selection atom for Contentstack CMS forms. It lets users independently toggle one or more options on or off. It is a **dumb atom** — it knows only its own label and state. Supporting hint text is always a sibling atom composed by the parent form pattern, never embedded inside the checkbox itself.

**Use when:** the user needs to select zero, one, or multiple independent options from a list. Each checkbox is self-contained and does not affect other checkboxes in the group.

**Do not use when:**
- Options are mutually exclusive → use `Radio`
- The choice is a system-level on/off toggle with immediate effect → use `Toggle Switch`
- The user must select exactly one item from a list → use `Select` or `Radio`

**Key distinction from Radio:** checkboxes are independent. Selecting one does not deselect another. Radio buttons are mutually exclusive within a group.

---

## 2. Anatomy

```
┌────────────────────────────────────────────────────┐
│ [focus-ring]  ← ABSOLUTE, outside control (-2px)   │  ← box-container
│ [checkbox-control]                                  │    16px (sm) / 20px (md) square
│   [checkmark-icon] ← VECTOR stroke (Checked)        │
│   [dash-icon]      ← RECTANGLE fill (Indeterminate) │
└────────────────────────────────────────────────────┘
  Checkbox label                                        ← content / label-row / label
  Supporting text below label                           ← content / subtext (hasSubtext)
```

| Figma layer          | DOM element / role           | Notes                                                  |
|----------------------|------------------------------|--------------------------------------------------------|
| Root component       | `<label>` wrapper            | Flex row; clicking anywhere toggles the checkbox      |
| `box-container`      | `<div>` relative container   | Holds control + ABSOLUTE focus-ring                    |
| `focus-ring`         | `::after` / overlay          | ABSOLUTE, 2px outside control; `hasFocus`-driven       |
| `checkbox-control`   | `<input type="checkbox">`    | The actual control; visually replaced by the styled box|
| `checkmark-icon`     | SVG `<path>` / `::after`     | White checkmark stroke. Shown when Checked.            |
| `dash-icon`          | `<span>` or `::after`        | White horizontal dash fill. Shown when Indeterminate.  |
| `content`            | `<div>` label container      | Flex column; top-aligned to control                    |
| `label-row`          | `<span>` label text row      | Hidden when `hasLabel=false`                           |
| `label`              | `<span>` or `<label>` text   | Main option label                                      |
| `subtext`            | `<span>` supporting text     | Secondary descriptive text; hidden by default          |

**Critical layout note:** The `content` column is top-aligned to the `box-container` — the control aligns to the first line of the label, not the vertical centre of the full content block. This is intentional and must be preserved when `hasSubtext=true` causes the content to grow taller.

---

## 3. TypeScript Props Interface

```typescript
export interface CheckboxProps {
  // ── Selection state ───────────────────────────────────────────────────
  /**
   * Selection state of the checkbox.
   * - unchecked: no fill, no checkmark
   * - checked: brand fill, white checkmark
   * - indeterminate: brand fill, white dash (used for parent "select all" controls)
   * Default: 'unchecked'
   */
  checked?: boolean | 'indeterminate';

  // ── Size ──────────────────────────────────────────────────────────────
  /**
   * Control size tier.
   * sm: 16px control, Body/MD label (14px)
   * md: 20px control, Body/LG label (16px)
   * Default: 'sm'
   */
  size?: 'sm' | 'md';

  // ── Disabled ──────────────────────────────────────────────────────────
  /** Disables interaction. Applies 0.40 layer opacity. Sets aria-disabled. */
  disabled?: boolean;

  // ── Label ─────────────────────────────────────────────────────────────
  /** Shows the label text. Default: true. */
  hasLabel?: boolean;
  /** Main label text for this option. */
  label?: string;
  /** Shows supporting text below the label. Default: false. */
  hasSubtext?: boolean;
  /** Supporting descriptive text shown below the label when hasSubtext=true. */
  subtext?: string;

  // ── Change handler ────────────────────────────────────────────────────
  /** Called when the checkbox is toggled. */
  onChange?: (checked: boolean | 'indeterminate') => void;

  // ── HTML / ARIA ───────────────────────────────────────────────────────
  /** Checkbox id. Auto-generated if not provided. */
  id?: string;
  /** Input name for form submission. */
  name?: string;
  /** Input value for form submission. */
  value?: string;
  /** ARIA label when hasLabel=false. */
  'aria-label'?: string;
  /** Associates with an external label element. */
  'aria-labelledby'?: string;
  /** Associates with an external description (hint text, subtext). */
  'aria-describedby'?: string;
  /** Additional class names on the root element. */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma property       | Figma type   | React prop   | React type                          | Notes                                            |
|----------------------|--------------|--------------|-------------------------------------|--------------------------------------------------|
| `Selection=Unchecked`| Variant      | `checked=false` | `boolean \| 'indeterminate'`     | Default state                                    |
| `Selection=Checked`  | Variant      | `checked=true`  | `boolean`                        | Brand fill + white checkmark                     |
| `Selection=Indeterminate` | Variant | `checked='indeterminate'` | `'indeterminate'`      | Brand fill + white dash; maps to `aria-checked="mixed"` |
| `State=Default`      | Variant      | —            | CSS default                         | Base state                                       |
| `State=Hover`        | Variant      | —            | CSS `:hover`                        | Never a prop                                     |
| `State=Focused`      | Variant      | —            | CSS `:focus-visible`                | Never a prop; use `hasFocus=true` in Storybook only |
| `State=Disabled`     | Variant      | `disabled`   | `boolean`                           | 0.40 layer opacity + `border/disabled` stroke    |
| `hasFocus`           | Boolean      | —            | CSS `:focus-visible`                | Storybook demo only; not a runtime prop          |
| `isDisabled`         | Boolean      | `disabled`   | `boolean`                           | Semantic flag matching `State=Disabled` variant  |
| `hasLabel`           | Boolean      | `hasLabel`   | `boolean`                           | Default: `true`                                  |
| `hasSubtext`         | Boolean      | `hasSubtext` | `boolean`                           | Default: `false`                                 |
| `label`              | Text         | `label`      | `string`                            | Default: `'Checkbox label'`                      |
| `Size`               | Variant      | `size`       | `'sm' \| 'md'`                      | Default: `'sm'`                                  |

---

## 5. State Behaviour

| State          | Trigger                       | Visual changes                                                      | Token(s) changed                               | ARIA change                              |
|----------------|------------------------------|----------------------------------------------------------------------|------------------------------------------------|------------------------------------------|
| Unchecked      | Default                       | White fill, `border/strong` stroke (1.5px), no checkmark            | `surface/raised`, `border/strong`              | `aria-checked="false"`                   |
| Checked        | User clicks / Space key       | `action/primary` fill, white checkmark stroke, no border            | `action/primary`, `text/on-brand`              | `aria-checked="true"`                    |
| Indeterminate  | Parent sets programmatically  | `action/primary` fill, white dash fill, no border                   | `action/primary`, `text/on-brand`              | `aria-checked="mixed"`                   |
| Hover (any)    | Mouse enters component        | Checkbox control border → `border/brand` (purple, 1.5px)            | `border/brand`                                 | —                                        |
| Focused (any)  | Keyboard focus                | Focus ring (2px `focus/ring/color`) appears outside control; control border → `border/brand` | `focus/ring/color`, `border/brand` | `:focus-visible` |
| Disabled       | `disabled=true`               | Entire component at 0.40 opacity; unchecked border → `border/disabled`; no hover response | `visibility/disabled` (0.40 layer opacity) | `aria-disabled="true"`, `disabled` |

### Focus ring geometry
- Shape: rounded square, not a circle. Corner radius = control radius + 2px (sm: cr=5, md: cr=6).
- Dimensions: control size + 4px total (sm: 20×20px, md: 24×24px).
- Position: ABSOLUTE at -2px offset. `clipsContent=false` on `box-container`.
- Token: `focus/ring/color` (purple/500 Light / purple/400 Dark).
- Controlled by `:focus-visible` in production; `hasFocus=true` in Storybook demos.

### Disabled architecture
Disabled is applied as `visibility/disabled` (0.40) opacity on the **root component**, not via separate token values per layer. This is intentional — it keeps the variant matrix lean (3 selection × 2 sizes × 3 interaction states = 18 variants, plus 6 disabled = 24 total). Do not replicate disabled by overriding individual layer tokens.

### Indeterminate state
Indeterminate is not a user-reachable state by direct interaction. It is set programmatically — typically by a parent "Select all" checkbox when some but not all children are checked. Implement via:
```typescript
// Setting indeterminate on a native checkbox requires the DOM property directly
const ref = useRef<HTMLInputElement>(null);
useEffect(() => {
  if (ref.current) ref.current.indeterminate = checked === 'indeterminate';
}, [checked]);
```

---

## 6. Size Specification

| Property               | sm                              | md                              |
|------------------------|---------------------------------|---------------------------------|
| Control size           | 16×16px                         | 20×20px                         |
| Control corner radius  | 3px                             | 4px                             |
| Focus ring size        | 20×20px (control + 4px)         | 24×24px (control + 4px)         |
| Focus ring cr          | 5px (control cr + 2px)          | 6px (control cr + 2px)          |
| Border width           | 1.5px                           | 1.5px                           |
| Checkmark size         | 9×7px                           | 11×8px                          |
| Dash size (indet.)     | 8×2px                           | 10×2px                          |
| Component padding      | 8px all sides (`space/8`)       | 8px all sides (`space/8`)       |
| Control–label gap      | 8px (`space/8`)                 | 8px (`space/8`)                 |
| Label font             | 14px Regular (Body/MD)          | 16px Regular (Body/LG)          |
| Label line-height      | 150%                            | 150%                            |
| Subtext font           | 13px Regular (Body/SM)          | 13px Regular (Body/SM)          |
| Subtext line-height    | 140%                            | 140%                            |
| Content gap            | 2px (`space/2`)                 | 2px (`space/2`)                 |
| Selection dot (radio)  | N/A                             | N/A                             |

**Subtext note:** Subtext uses `Body/SM` (13px) on BOTH sizes — it does not scale with the control. This is intentional: subtext is secondary information and should be visually subordinate regardless of the control tier.

---

## 7. Token Reference

All tokens are `Venus_Semantics` — Checkbox uses zero `Venus_Components` tokens by design. CSS custom property: replace `/` with `-`, prefix with `--`.

### Colour tokens

| Layer / purpose             | Token name           | State(s)                                  |
|-----------------------------|----------------------|-------------------------------------------|
| Control fill (unchecked)    | `surface/raised`     | Unchecked, Unchecked/Hover, Unchecked/Focused |
| Control fill (checked)      | `action/primary`     | Checked, Checked/Hover, Checked/Focused   |
| Control fill (indeterminate)| `action/primary`     | Indeterminate all interaction states      |
| Control border (default)    | `border/strong`      | Unchecked/Default                         |
| Control border (hover)      | `border/brand`       | All/Hover (any selection state)           |
| Control border (focused)    | `border/brand`       | All/Focused (any selection state)         |
| Control border (disabled)   | `border/disabled`    | Unchecked/Disabled                        |
| Checkmark stroke            | `text/on-brand`      | Checked (all interaction states)          |
| Dash fill (indeterminate)   | `text/on-brand`      | Indeterminate (all interaction states)    |
| Focus ring stroke           | `focus/ring/color`   | Focused (all selection states)            |
| Label text                  | `text/default`       | All enabled states                        |
| Subtext text                | `text/subtle`        | All enabled states                        |
| Layer opacity (disabled)    | `visibility/disabled`| Disabled (0.40 on root)                   |

### Structural tokens (spacing)

| Property          | Token name   | Value |
|-------------------|--------------|-------|
| Component padding | `space/8`    | 8px   |
| Control–label gap | `space/8`    | 8px   |
| Label–subtext gap | `space/2`    | 2px   |

---

## 8. Accessibility

### ARIA roles and attributes

```html
<!-- Standard checkbox -->
<label class="checkbox-root">
  <div class="checkbox-box-container">
    <input
      type="checkbox"
      id="checkbox-id"
      checked
      aria-checked="true"
      aria-describedby="checkbox-subtext-id"
    />
    <!-- Visual control rendered via CSS -->
  </div>
  <div class="checkbox-content">
    <span class="checkbox-label">Enable notifications</span>
    <span id="checkbox-subtext-id" class="checkbox-subtext">
      You will receive email notifications for new entries.
    </span>
  </div>
</label>

<!-- Indeterminate (must use JS ref) -->
<input type="checkbox" aria-checked="mixed" ref={checkboxRef} />

<!-- Disabled -->
<input type="checkbox" disabled aria-disabled="true" />

<!-- No visible label (aria-label required) -->
<input type="checkbox" aria-label="Select all entries" />

<!-- In a group -->
<fieldset>
  <legend>Notification preferences</legend>
  <label><!-- checkbox 1 --></label>
  <label><!-- checkbox 2 --></label>
</fieldset>
```

### Keyboard behaviour

| Key          | Behaviour                                                        |
|--------------|------------------------------------------------------------------|
| `Tab`        | Moves focus to checkbox                                          |
| `Shift+Tab`  | Moves focus away                                                 |
| `Space`      | Toggles checked ↔ unchecked; does not toggle indeterminate directly |
| Arrow keys   | Navigate between checkboxes in a group (if group is managed)     |

### Contrast ratios (WCAG 2.2 AA)

| Pair                                     | Ratio   | Pass/Fail   |
|------------------------------------------|---------|-------------|
| Label text (`text/default`) on white     | ~14:1   | ✅ AAA      |
| Subtext (`text/subtle`) on white         | ~7:1    | ✅ AAA      |
| Unchecked border (`border/strong`) on white | ~4.6:1 | ✅ AA      |
| Checked fill (`action/primary`) on white | ~4.86:1 | ✅ AA       |
| Checkmark white on `action/primary`      | ~4.86:1 | ✅ AA       |
| Focus ring (purple/500) on white         | ~4.86:1 | ✅ AA       |
| Disabled at 40% opacity                  | exempt  | ✅ WCAG 1.4.3 |

### Touch targets

- sm: 16px control inside 8px all-round padding → 32px total touch area. ✅ Meets 24px minimum.
- md: 20px control inside 8px all-round padding → 36px total touch area. ✅

---

## 9. Storybook Stories

```typescript
// checkbox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Actions/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'select',
      options: [false, true, 'indeterminate'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    hasLabel: { control: 'boolean' },
    hasSubtext: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

// ── Core states ───────────────────────────────────────────────────────────────

export const Unchecked: Story = {
  args: {
    checked: false,
    size: 'sm',
    label: 'Enable feature',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    size: 'sm',
    label: 'Enable feature',
  },
};

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
    size: 'sm',
    label: 'Select all',
  },
};

// ── With subtext ──────────────────────────────────────────────────────────────

export const UncheckedWithSubtext: Story = {
  args: {
    checked: false,
    size: 'sm',
    label: 'Allow public API access',
    hasSubtext: true,
    subtext: 'External clients will be able to query this environment.',
  },
};

export const CheckedWithSubtext: Story = {
  args: {
    checked: true,
    size: 'sm',
    label: 'Allow public API access',
    hasSubtext: true,
    subtext: 'External clients will be able to query this environment.',
  },
};

// ── Interaction states ────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    size: 'sm',
    label: 'Enable webhooks',
    hasSubtext: true,
    subtext: 'Available on Enterprise plans only.',
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    size: 'sm',
    label: 'Mandatory field',
    hasSubtext: true,
    subtext: 'This option is required and cannot be changed.',
  },
};

export const Focused: Story = {
  // hasFocus=true Figma variant: demonstrates focus ring.
  // In Storybook use autoFocus to trigger :focus-visible.
  args: {
    checked: false,
    size: 'sm',
    label: 'Enable feature',
    autoFocus: true,
  },
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox
        checked={true}
        size="sm"
        label="Small (sm — 16px control, Body/MD label)"
        hasSubtext
        subtext="Used in dense forms, sidebars, and compact lists."
      />
      <Checkbox
        checked={true}
        size="md"
        label="Medium (md — 20px control, Body/LG label)"
        hasSubtext
        subtext="Used in primary forms and dialogs."
      />
    </div>
  ),
};

// ── Group usage ───────────────────────────────────────────────────────────────

export const CheckboxGroup: Story = {
  render: () => (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: '#374151' }}>
        Entry permissions
      </legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Checkbox checked={true} size="sm" label="Create entries" />
        <Checkbox checked={true} size="sm" label="Edit entries" />
        <Checkbox checked={false} size="sm" label="Delete entries" />
        <Checkbox
          checked={false}
          size="sm"
          label="Publish entries"
          hasSubtext
          subtext="Requires Editor role or above."
          disabled
        />
      </div>
    </fieldset>
  ),
};

export const SelectAllPattern: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Checkbox
        checked="indeterminate"
        size="sm"
        label="Select all content types"
        hasSubtext
        subtext="2 of 5 selected"
      />
      <div style={{ paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Checkbox checked={true} size="sm" label="Article" />
        <Checkbox checked={true} size="sm" label="Author" />
        <Checkbox checked={false} size="sm" label="Category" />
        <Checkbox checked={false} size="sm" label="Tag" />
        <Checkbox checked={false} size="sm" label="Media" />
      </div>
    </div>
  ),
};

// ── Dark mode ─────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  args: { ...Checked.args },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

export const DarkModeGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Checkbox checked={true} size="sm" label="Enable feature A" />
      <Checkbox checked="indeterminate" size="sm" label="Enable feature B" />
      <Checkbox checked={false} size="sm" label="Enable feature C" disabled />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

// ── Edge cases ────────────────────────────────────────────────────────────────

export const LongLabel: Story = {
  args: {
    checked: false,
    size: 'sm',
    label: 'Allow this environment to receive webhooks from external services when entries are published or unpublished',
  },
};

export const LongSubtext: Story = {
  args: {
    checked: false,
    size: 'sm',
    label: 'Enable advanced search',
    hasSubtext: true,
    subtext: 'Enabling advanced search allows users to filter entries using complex query expressions. This may affect performance on environments with more than 100,000 entries.',
  },
};

export const NoLabel: Story = {
  args: {
    checked: false,
    hasLabel: false,
    'aria-label': 'Select entry row 42',
  },
};
```

---

## 10. Implementation Notes

### CSS custom properties

```css
.checkbox-root {
  display: flex;
  align-items: flex-start; /* TOP align — not center */
  gap: var(--space-8);
  padding: var(--space-8);
  cursor: pointer;
}

.checkbox-box-container {
  position: relative;
  flex-shrink: 0; /* Never shrink — always 16px or 20px */
}

/* Native input — visually hidden, but kept for accessibility */
.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
}

/* Visual control */
.checkbox-control {
  width: 16px; /* swap to 20px for md */
  height: 16px;
  border-radius: 3px; /* swap to 4px for md */
  border: 1.5px solid var(--border-strong);
  background: var(--surface-raised);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Checked */
.checkbox-root:has(input:checked) .checkbox-control {
  background: var(--action-primary);
  border-color: transparent;
}

/* Hover */
.checkbox-root:hover:not(:has(input:disabled)) .checkbox-control {
  border-color: var(--border-brand);
}

/* Focus ring */
.checkbox-box-container::after {
  content: '';
  position: absolute;
  inset: -4px; /* 2px offset × 2 sides */
  border-radius: 5px; /* control-cr + 2px; swap to 6px for md */
  border: 2px solid var(--focus-ring-color);
  pointer-events: none;
  opacity: 0;
}

.checkbox-root:has(input:focus-visible) .checkbox-box-container::after {
  opacity: 1;
}

/* Disabled */
.checkbox-root:has(input:disabled) {
  opacity: var(--visibility-disabled); /* 0.40 on root */
  cursor: not-allowed;
  pointer-events: none;
}
```

### Indeterminate state via ref

```typescript
const checkboxRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (checkboxRef.current) {
    checkboxRef.current.indeterminate = checked === 'indeterminate';
  }
}, [checked]);

<input
  ref={checkboxRef}
  type="checkbox"
  checked={checked === true}
  aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
  onChange={...}
/>
```

### Controlled vs uncontrolled

Always use controlled in Contentstack forms:
```typescript
const [checked, setChecked] = useState(false);
<Checkbox checked={checked} onChange={setChecked} label="Option" />
```

### Top-align is intentional

The `align-items: flex-start` on the root is required. When `hasSubtext=true` makes the content block taller, the control stays aligned to the first line of the label, not the vertical midpoint. Never change this to `center`.

### Dark mode

Tokens switch via `[data-theme="dark"]` on a parent. No component changes needed.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .checkbox-control,
  .checkbox-box-container::after { transition: none; }
}
```

---

## 11. Do / Don't

| ✅ Do                                                                         | ❌ Don't                                                                     |
|------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Use for independent multi-select — selecting one does not affect others      | Use for mutually exclusive options — use `Radio` instead                      |
| Wrap a group in `<fieldset>` + `<legend>` for screen reader group context    | Float checkboxes without a group label when they relate to a shared concept   |
| Use `checked='indeterminate'` for parent "select all" when partially selected| Set indeterminate as a permanent/stable state — it is a transitional state    |
| Always top-align the control to the label (not vertically centred to block)  | Centre the control to the full content block height — it misaligns with text  |
| Use `sm` for dense lists, table rows, sidebar filters                        | Use `md` in compact contexts — it is for primary forms and dialogs            |
| Provide `aria-label` when `hasLabel=false` (table row select, etc.)         | Render a checkbox with no accessible name                                     |
| Keep subtext concise — one sentence                                          | Use subtext as a second label — it is secondary description only              |
| Always pair with a `<fieldset>` + `<legend>` when the group has a shared topic | Omit the group label and rely on proximity alone                           |

---

## 12. Related Components

| Component        | Relationship              | When to use instead of Checkbox                                              |
|------------------|---------------------------|------------------------------------------------------------------------------|
| `Radio`           | Sibling (mutually exclusive) | When only one option can be selected at a time                           |
| `Toggle Switch`   | Sibling (binary, immediate) | When the action takes immediate effect (on/off system setting)           |
| `Select`          | Sibling (single choice)   | When there are many options and space is constrained                        |
| `Checkbox Group`  | Composed pattern          | A group of Checkboxes with a shared `<fieldset>` + `<legend>`               |
| `Select All`      | Composed pattern          | An Indeterminate Checkbox controlling a list of child Checkboxes            |

---

*Brief generated: 2026-06-01 · Venus 2.1 RF v2.1.1 · Figma node 652:30460*
