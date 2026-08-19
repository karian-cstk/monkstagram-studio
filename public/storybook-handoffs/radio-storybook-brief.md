# Radio — Storybook Engineering Brief
**Venus 2.1 RF · Contentstack Design System**
Figma node: `660:33013` · Version: 2.1.0 · Last updated: 2026-05-28

---

## 1. Purpose

`Radio` is a single-select atom for Contentstack CMS forms. It lets users choose exactly one option from a mutually exclusive set. It is a **dumb atom** — it knows only its own label and state. Supporting hint text is always a sibling atom composed by the parent form pattern, never embedded inside the radio itself.

**Use when:** the user must select exactly one option from a group of 2–5 choices where all options should be visible simultaneously.

**Do not use when:**
- Options are independent and multiple can be selected → use `Checkbox`
- There are more than 5 options → use `Select` (saves space, scales better)
- The choice is a system-level on/off with immediate effect → use `Toggle Switch`
- The option set is dynamic or unknown at build time → use `Select`

**Key distinction from Checkbox:** radio buttons within a group are mutually exclusive. Selecting one automatically deselects all others in the group. A single standalone radio is an anti-pattern — always use within a radio group.

---

## 2. Anatomy

```
┌────────────────────────────────────────────────────┐
│ [focus-ring]  ← ABSOLUTE, outside control (-2px)   │  ← box-container
│ [radio-control]  ← circular frame (cr=9999)         │    16px (sm) / 20px (md) circle
│   [selection-dot] ← ABSOLUTE white circle (Selected)│
└────────────────────────────────────────────────────┘
  Radio label                                          ← content / label-row / label
  Supporting text below label                          ← content / subtext (hasSubtext)
```

| Figma layer          | DOM element / role           | Notes                                                     |
|----------------------|------------------------------|-----------------------------------------------------------|
| Root component       | `<label>` wrapper            | Flex row; clicking anywhere selects the radio             |
| `box-container`      | `<div>` relative container   | Holds control + ABSOLUTE focus-ring and radio-control     |
| `focus-ring`         | `::after` / overlay          | ABSOLUTE, 2px outside control, circular (cr=9999)         |
| `radio-control`      | `<input type="radio">`       | Visually replaced; `cr=9999` makes it a perfect circle    |
| `selection-dot`      | `::after` CSS circle         | White filled circle, ABSOLUTE centred. Shown when Selected.|
| `content`            | `<div>` label container      | Flex column; top-aligned to control                       |
| `label-row`          | `<span>` label text row      | Hidden when `hasLabel=false`                              |
| `label`              | `<span>` or text node        | Main option label                                         |
| `subtext`            | `<span>` supporting text     | Secondary description; hidden by default                  |

**Critical layout note:** Both `radio-control` and `focus-ring` have `layoutPositioning=ABSOLUTE` inside `box-container`. The root component uses `primaryAxisSizingMode=FIXED` width — this is intentional to maintain consistent alignment in a group. The content column is top-aligned to the control.

**Sizing difference from Checkbox:** Radio uses `border-width/1` (1px) for Unselected state vs Checkbox's 1.5px. Selected Radio has no stroke — the `action/primary` fill alone defines the circle boundary.

---

## 3. TypeScript Props Interface

```typescript
export interface RadioProps {
  // ── Selection state ───────────────────────────────────────────────────
  /**
   * Whether this radio button is selected.
   * In a RadioGroup, only one radio is selected at a time.
   * Default: false
   */
  checked?: boolean;

  // ── Size ──────────────────────────────────────────────────────────────
  /**
   * Control size tier.
   * sm: 16px control, Body/MD label (14px)
   * md: 20px control, Body/LG label (16px)
   * Default: 'sm'
   */
  size?: 'sm' | 'md';

  // ── Disabled ──────────────────────────────────────────────────────────
  /** Disables interaction. Applies 0.40 layer opacity. */
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

  // ── Radio group integration ───────────────────────────────────────────
  /** Input name — must match all radios in the same group. */
  name?: string;
  /** Value submitted when this radio is selected. */
  value?: string;
  /** Change handler. Called when this radio is selected. */
  onChange?: (value: string) => void;

  // ── HTML / ARIA ───────────────────────────────────────────────────────
  /** Radio id. Auto-generated if not provided. */
  id?: string;
  /** ARIA label when hasLabel=false. */
  'aria-label'?: string;
  /** Associates with an external label element. */
  'aria-labelledby'?: string;
  /** Associates with an external description (hint text). */
  'aria-describedby'?: string;
  /** Additional class names on the root element. */
  className?: string;
}

// ── RadioGroup wrapper (required for correct behaviour) ──────────────────────
export interface RadioGroupProps {
  /** Name shared by all Radio buttons in this group. */
  name: string;
  /** Currently selected value (controlled). */
  value?: string;
  /** Called when a radio in the group is selected. */
  onChange?: (value: string) => void;
  /** The Radio children. */
  children: React.ReactNode;
  /** Accessible group label (uses <legend> inside <fieldset>). */
  label?: string;
  /** Orientation of the group. Default: 'vertical'. */
  orientation?: 'vertical' | 'horizontal';
  /** Additional class names. */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma property        | Figma type   | React prop    | React type              | Notes                                              |
|-----------------------|--------------|---------------|-------------------------|----------------------------------------------------|
| `Selection=Unselected`| Variant      | `checked=false`| `boolean`              | White fill, gray border                            |
| `Selection=Selected`  | Variant      | `checked=true` | `boolean`              | Brand fill, white dot, no border                   |
| `State=Default`       | Variant      | —             | CSS default             | —                                                  |
| `State=Hover`         | Variant      | —             | CSS `:hover`            | Never a prop                                       |
| `State=Focused`       | Variant      | —             | CSS `:focus-visible`    | Never a prop; use `hasFocus=true` in Storybook only|
| `State=Disabled`      | Variant      | `disabled`    | `boolean`               | 0.40 layer opacity                                 |
| `hasFocus`            | Boolean      | —             | CSS `:focus-visible`    | Storybook demo only                                |
| `isDisabled`          | Boolean      | `disabled`    | `boolean`               | Semantic flag matching `State=Disabled`            |
| `hasLabel`            | Boolean      | `hasLabel`    | `boolean`               | Default: `true`                                    |
| `hasSubtext`          | Boolean      | `hasSubtext`  | `boolean`               | Default: `false`                                   |
| `label`               | Text         | `label`       | `string`                | Default: `'Radio label'`                           |
| `Size`                | Variant      | `size`        | `'sm' \| 'md'`          | Default: `'sm'`                                    |

---

## 5. State Behaviour

| State        | Trigger                       | Visual changes                                                         | Token(s) changed                          | ARIA change                               |
|--------------|------------------------------|-------------------------------------------------------------------------|-------------------------------------------|-------------------------------------------|
| Unselected   | Default                       | White fill, 1px `border/strong` stroke, no dot                         | `surface/raised`, `border/strong`         | `aria-checked="false"`                    |
| Selected     | User click / Enter key        | `action/primary` fill, white dot centred, no border                    | `action/primary`, `text/on-brand`         | `aria-checked="true"`                     |
| Hover (any)  | Mouse enters component        | Control border → `border/brand` (purple, 1px)                          | `border/brand`                            | —                                         |
| Focused (any)| Keyboard focus                | Circular focus ring (2px `focus/ring/color`) outside control; border → `border/brand` | `focus/ring/color`, `border/brand` | `:focus-visible`                  |
| Disabled     | `disabled=true`               | Entire component at 0.40 opacity; border → `border/disabled`           | `visibility/disabled` (0.40 on root)      | `aria-disabled="true"`, `disabled`        |

### Focus ring geometry
- Shape: perfect circle. `border-radius: 9999px` (cr=9999 in Figma).
- Dimensions: control size + 4px total (sm: 20×20px, md: 24×24px).
- Position: ABSOLUTE at -2px offset. `layoutPositioning=ABSOLUTE` on focus-ring frame.
- Token: `focus/ring/color` (purple/500 Light / purple/400 Dark).
- Controlled by `:focus-visible` in production; `hasFocus=true` in Storybook demos.

### Selection dot
- `selection-dot` is a white circle, ABSOLUTE centred inside `radio-control`.
- Size: sm=6×6px, md=8×8px.
- Fill: `text/on-brand` (white on brand purple surface).
- Visible only in Selected state.

### Border width
- Unselected: 1px (vs Checkbox's 1.5px). A thinner border fits the circular form better.
- Selected: no border — `action/primary` fill defines the circle.
- Hover/Focused: `border/brand` replaces the gray border, width remains 1px.

### Disabled architecture
Same pattern as Checkbox: `visibility/disabled` (0.40) applied to the root component. Lean variant matrix: 2 selection × 2 sizes × 4 states = 16 variants total.

---

## 6. Size Specification

| Property               | sm                              | md                              |
|------------------------|---------------------------------|---------------------------------|
| Control size           | 16×16px                         | 20×20px                         |
| Control corner radius  | 9999px (circle)                 | 9999px (circle)                 |
| Focus ring size        | 20×20px (control + 4px)         | 24×24px (control + 4px)         |
| Focus ring cr          | 9999px (circle)                 | 9999px (circle)                 |
| Border width           | 1px                             | 1px                             |
| Selection dot size     | 6×6px                           | 8×8px                           |
| Component padding      | 8px all sides (`space/8`)       | 8px all sides (`space/8`)       |
| Control–label gap      | 8px (`space/8`)                 | 8px (`space/8`)                 |
| Label font             | 14px Regular (Body/MD)          | 16px Regular (Body/LG)          |
| Label line-height      | 130%                            | 130%                            |
| Subtext font           | 13px Regular (Body/SM)          | 13px Regular (Body/SM)          |
| Content gap            | 2px (`space/2`)                 | 2px (`space/2`)                 |

**Line-height note:** Radio label uses 130% line-height (Body/MD/LG at 130%), while Checkbox label uses 150%. This is intentional — radio options are typically short labels; 130% gives a tighter, more scannable list.

**Subtext note:** `Body/SM` (13px) on BOTH sizes — does not scale with the control tier.

---

## 7. Token Reference

All tokens are `Venus_Semantics` — Radio uses zero `Venus_Components` tokens by design. CSS custom property: replace `/` with `-`, prefix with `--`.

### Colour tokens

| Layer / purpose             | Token name           | State(s)                                      |
|-----------------------------|----------------------|-----------------------------------------------|
| Control fill (unselected)   | `surface/raised`     | Unselected, Unselected/Hover, Unselected/Focused |
| Control fill (selected)     | `action/primary`     | Selected, Selected/Hover, Selected/Focused    |
| Control border (default)    | `border/strong`      | Unselected/Default                            |
| Control border (hover)      | `border/brand`       | All/Hover                                     |
| Control border (focused)    | `border/brand`       | All/Focused                                   |
| Control border (disabled)   | `border/disabled`    | Unselected/Disabled                           |
| Selection dot fill          | `text/on-brand`      | Selected (all interaction states)             |
| Focus ring stroke           | `focus/ring/color`   | Focused (all selection states)                |
| Label text                  | `text/default`       | All enabled states                            |
| Subtext text                | `text/subtle`        | All enabled states                            |
| Layer opacity (disabled)    | `visibility/disabled`| Disabled (0.40 on root)                       |

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
<!-- Radio group — always use fieldset + legend -->
<fieldset>
  <legend>Content type</legend>
  <label class="radio-root">
    <div class="radio-box-container">
      <input
        type="radio"
        id="radio-article"
        name="content-type"
        value="article"
        checked
        aria-checked="true"
      />
    </div>
    <div class="radio-content">
      <span class="radio-label">Article</span>
      <span class="radio-subtext">Long-form editorial content.</span>
    </div>
  </label>
  <label class="radio-root">
    <input type="radio" id="radio-page" name="content-type" value="page" />
    <span class="radio-label">Page</span>
  </label>
</fieldset>

<!-- Disabled option within a group -->
<label class="radio-root">
  <input type="radio" disabled aria-disabled="true" name="content-type" value="template" />
  <span class="radio-label">Template (Enterprise only)</span>
</label>

<!-- No visible label (aria-label required) -->
<input type="radio" name="sort" value="asc" aria-label="Sort ascending" />
```

### Keyboard behaviour

| Key            | Behaviour                                                           |
|----------------|---------------------------------------------------------------------|
| `Tab`          | Moves focus into the radio group (to the selected or first radio)   |
| `Shift+Tab`    | Moves focus out of the group                                        |
| `→` / `↓`      | Selects the next radio in the group (wraps to first)               |
| `←` / `↑`      | Selects the previous radio in the group (wraps to last)            |
| `Space`        | Selects the focused radio (if not already selected)                 |

**Arrow key navigation is required.** The native `<input type="radio">` within a `<fieldset>` handles this automatically. Custom implementations must replicate this roving tabindex pattern.

### Contrast ratios (WCAG 2.2 AA)

| Pair                                     | Ratio   | Pass/Fail   |
|------------------------------------------|---------|-------------|
| Label text (`text/default`) on white     | ~14:1   | ✅ AAA      |
| Subtext (`text/subtle`) on white         | ~7:1    | ✅ AAA      |
| Unselected border (`border/strong`) on white | ~4.6:1 | ✅ AA    |
| Selected fill (`action/primary`) on white| ~4.86:1 | ✅ AA       |
| Dot white on `action/primary`            | ~4.86:1 | ✅ AA       |
| Focus ring (purple/500) on white         | ~4.86:1 | ✅ AA       |
| Disabled at 40% opacity                  | exempt  | ✅ WCAG 1.4.3 |

### Touch targets

- sm: 16px control + 8px padding = 32px total. ✅ Meets 24px minimum.
- md: 20px control + 8px padding = 36px total. ✅

---

## 9. Storybook Stories

```typescript
// radio.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Actions/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    hasLabel: { control: 'boolean' },
    hasSubtext: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Radio>;

// ── Core states ───────────────────────────────────────────────────────────────

export const Unselected: Story = {
  args: {
    checked: false,
    size: 'sm',
    label: 'Single line text',
    name: 'field-type',
    value: 'text',
  },
};

export const Selected: Story = {
  args: {
    checked: true,
    size: 'sm',
    label: 'Single line text',
    name: 'field-type',
    value: 'text',
  },
};

// ── With subtext ──────────────────────────────────────────────────────────────

export const UnselectedWithSubtext: Story = {
  args: {
    checked: false,
    size: 'sm',
    label: 'Reference field',
    hasSubtext: true,
    subtext: 'Links to another content type entry.',
    name: 'field-type',
    value: 'reference',
  },
};

export const SelectedWithSubtext: Story = {
  args: {
    checked: true,
    size: 'sm',
    label: 'Reference field',
    hasSubtext: true,
    subtext: 'Links to another content type entry.',
    name: 'field-type',
    value: 'reference',
  },
};

// ── Interaction states ────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    size: 'sm',
    label: 'JSON Rich Text Editor',
    hasSubtext: true,
    subtext: 'Available on Enterprise plans only.',
    name: 'field-type',
    value: 'json-rte',
  },
};

export const DisabledSelected: Story = {
  args: {
    checked: true,
    disabled: true,
    size: 'sm',
    label: 'Auto-assigned role',
    hasSubtext: true,
    subtext: 'Set by your organisation administrator.',
  },
};

export const Focused: Story = {
  args: {
    checked: false,
    size: 'sm',
    label: 'Single line text',
    autoFocus: true,
  },
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Radio
        checked={true}
        size="sm"
        label="Small (sm — 16px control, Body/MD label)"
        name="size-demo"
        value="sm"
        hasSubtext
        subtext="Dense forms, sidebars, filter panels."
      />
      <Radio
        checked={false}
        size="md"
        label="Medium (md — 20px control, Body/LG label)"
        name="size-demo"
        value="md"
        hasSubtext
        subtext="Primary forms, dialogs, onboarding."
      />
    </div>
  ),
};

// ── Group usage (the primary pattern) ────────────────────────────────────────

export const RadioGroupVertical: Story = {
  render: () => (
    <RadioGroup name="field-type" label="Field type" orientation="vertical">
      <Radio value="text" label="Single line text" hasSubtext subtext="Short text up to 255 characters." />
      <Radio value="textarea" label="Multi-line text" hasSubtext subtext="Long-form content without formatting." />
      <Radio value="number" label="Number" hasSubtext subtext="Integer or decimal values." />
      <Radio value="boolean" label="Boolean" hasSubtext subtext="True / false toggle." />
      <Radio value="json-rte" label="JSON Rich Text" disabled hasSubtext subtext="Enterprise only." />
    </RadioGroup>
  ),
};

export const RadioGroupHorizontal: Story = {
  render: () => (
    <RadioGroup name="sort-order" label="Sort order" orientation="horizontal">
      <Radio value="asc" label="Ascending" />
      <Radio value="desc" label="Descending" />
      <Radio value="manual" label="Manual" />
    </RadioGroup>
  ),
};

export const RadioGroupWithDefault: Story = {
  render: () => {
    const [value, setValue] = React.useState('lg');
    return (
      <RadioGroup name="size" label="Density" value={value} onChange={setValue}>
        <Radio value="sm" label="Compact" hasSubtext subtext="32px row height." />
        <Radio value="lg" label="Default" hasSubtext subtext="40px row height." />
        <Radio value="xl" label="Spacious" hasSubtext subtext="52px row height." />
      </RadioGroup>
    );
  },
};

// ── Dark mode ─────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  args: { ...Selected.args },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

export const DarkModeGroup: Story = {
  render: () => (
    <RadioGroup name="theme" label="Theme" defaultValue="dark">
      <Radio value="light" label="Light" />
      <Radio value="dark" label="Dark" />
      <Radio value="system" label="System default" />
    </RadioGroup>
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
    label: 'Allow editors to publish entries to all environments without requiring a review step',
    name: 'permission',
    value: 'publish-all',
  },
};

export const LongSubtext: Story = {
  args: {
    checked: false,
    size: 'sm',
    label: 'Workflow mode',
    hasSubtext: true,
    subtext: 'In workflow mode, entries move through defined stages before publishing. Each stage can require specific roles to approve before advancing. Enabling this affects all entries in this content type.',
    name: 'mode',
    value: 'workflow',
  },
};

export const NoLabel: Story = {
  args: {
    checked: true,
    hasLabel: false,
    'aria-label': 'Select row 3',
    name: 'table-select',
    value: 'row-3',
  },
};
```

---

## 10. Implementation Notes

### Native `<input type="radio">` — required

Always use `<input type="radio">` for keyboard navigation, form participation, and `name`-based mutual exclusion. The visual replacement is CSS-only — the native input is visually hidden but present in the DOM.

```css
/* Visually hide native input — keep accessible */
.radio-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
}
```

### RadioGroup wraps radios in fieldset

```tsx
export function RadioGroup({ name, label, value, onChange, children, orientation = 'vertical' }: RadioGroupProps) {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      {label && <legend>{label}</legend>}
      <div
        role="radiogroup"
        aria-labelledby={label ? undefined : undefined}
        style={{ display: 'flex', flexDirection: orientation === 'horizontal' ? 'row' : 'column', gap: 4 }}
      >
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<RadioProps>, {
                name,
                checked: child.props.value === value,
                onChange: () => onChange?.(child.props.value),
              })
            : child
        )}
      </div>
    </fieldset>
  );
}
```

### CSS custom properties

```css
.radio-root {
  display: flex;
  align-items: flex-start; /* TOP align — same as Checkbox */
  gap: var(--space-8);
  padding: var(--space-8);
  cursor: pointer;
}

.radio-box-container {
  position: relative;
  flex-shrink: 0;
}

.radio-control {
  width: 16px; /* 20px for md */
  height: 16px;
  border-radius: 9999px; /* perfect circle */
  border: 1px solid var(--border-strong);
  background: var(--surface-raised);
  position: relative;
}

/* Selection dot */
.radio-control::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px; /* 8px for md */
  height: 6px;
  border-radius: 9999px;
  background: var(--text-on-brand);
  opacity: 0;
}

/* Selected */
.radio-root:has(input:checked) .radio-control {
  background: var(--action-primary);
  border-color: transparent;
}
.radio-root:has(input:checked) .radio-control::after {
  opacity: 1;
}

/* Hover */
.radio-root:hover:not(:has(input:disabled)) .radio-control {
  border-color: var(--border-brand);
}

/* Focus ring */
.radio-box-container::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 9999px; /* matches control's circular shape */
  border: 2px solid var(--focus-ring-color);
  pointer-events: none;
  opacity: 0;
}

.radio-root:has(input:focus-visible) .radio-box-container::after {
  opacity: 1;
}

/* Disabled */
.radio-root:has(input:disabled) {
  opacity: var(--visibility-disabled); /* 0.40 on root */
  cursor: not-allowed;
  pointer-events: none;
}
```

### Arrow key navigation

Native `<input type="radio">` inside a `<fieldset>` provides arrow key navigation automatically. The browser moves focus between radios with the same `name` attribute using `→`/`↓` and `←`/`↑`. Do not implement custom roving tabindex unless rendering a non-native replacement.

### Top-align is intentional

`align-items: flex-start` is required on the root. When `hasSubtext=true` adds height, the control stays aligned to the first line of the label. This is consistent with Checkbox behaviour.

### Dark mode

Tokens switch via `[data-theme="dark"]`. No component changes needed. Focus ring: `focus/ring/color` = purple/400 in dark mode (same as Checkbox).

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .radio-control,
  .radio-control::after,
  .radio-box-container::after { transition: none; }
}
```

---

## 11. Do / Don't

| ✅ Do                                                                          | ❌ Don't                                                                      |
|-------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| Always use Radio within a `RadioGroup` — never as a standalone control        | Render a single radio button with no siblings — it can never be deselected    |
| Wrap the group in `<fieldset>` + `<legend>` for accessible group context      | Rely on visual proximity alone to communicate the group relationship           |
| Use for 2–5 mutually exclusive options that are always visible                | Use for more than 5 options — use `Select` instead                            |
| Use `sm` for dense lists, filter sidebars, and settings panels                | Use `md` in compact contexts — it is for primary forms and dialogs            |
| Provide `subtext` for options that need a brief explanation                   | Write subtext longer than one sentence — keep it scannable                    |
| Use `disabled` on individual options that aren't available (e.g. plan tier)  | Disable the entire group — disable individual options only                    |
| Match `name` across all radios in the group for native mutual exclusion       | Use different `name` values within the same logical group                     |
| Provide `aria-label` when `hasLabel=false` (e.g. table row selectors)        | Render a radio with no accessible name                                        |

---

## 12. Related Components

| Component        | Relationship                | When to use instead of Radio                                                |
|------------------|-----------------------------|-----------------------------------------------------------------------------|
| `Checkbox`        | Sibling (multi-select)      | When multiple options can be selected independently                        |
| `Toggle Switch`   | Sibling (binary, immediate) | When the action takes immediate effect (system on/off setting)             |
| `Select`          | Sibling (large option set)  | When there are more than 5 options, or the set is dynamic                  |
| `RadioGroup`      | Required wrapper            | Always wrap Radio buttons — the Group manages name, value, and arrow keys  |
| `Checkbox Group`  | Complementary pattern       | Same structural pattern with Checkbox semantics for multi-select           |

---

*Brief generated: 2026-06-01 · Venus 2.1 RF v2.1.0 · Figma node 660:33013*
