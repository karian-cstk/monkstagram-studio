# Select — Storybook Engineering Brief
**Venus 2.1 RF · Contentstack Design System**
Figma node: `682:46343` · Version: 2.1.0 · Last updated: 2026-06-01

---

## 1. Purpose

`Select` is the single-option dropdown picker for Contentstack CMS forms. It presents a closed trigger that reveals a list of predefined options when activated — used for field types, locale selectors, status pickers, and any enumerated value where free-text entry is not appropriate.

**Use when:** the option set is known, finite, and does not require user-typed input. Prefer over radio buttons when there are 5 or more options.

**Do not use when:**
- The user must type free text → use `Input`
- The user must select multiple options → use `Checkbox` group or a multi-select pattern
- The user must enter a value within a numeric range → use `Slider`
- The option set is fewer than 3 items and always visible → use `Radio`

**Alternatives:** `Input` (free text), `Radio` (2–4 options always visible), `Checkbox` (multi-select).

---

## 2. Anatomy

```
┌─────────────────────────────────────────────────────┐
│ Label                         [Label Icon] (optional)│  ← Label Row
│ (Required)                    [Spacer]               │  ← Required qualifier
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ [Leading Icon]  Select an option / Value    [▾]      │  ← Trigger
│                                    [focus-ring]      │  ← ABSOLUTE, outside trigger
│                                    [focus-border]    │  ← ABSOLUTE, inside trigger
└─────────────────────────────────────────────────────┘
  Helper text                                            ← Below Field / Hint Text atom
  [✕] Status message text                               ← Below Field / Status Message atom
```

**Layer naming note:** Select uses different layer names than Input/Textarea. These must map correctly:

| Figma layer       | DOM element / role          | Notes                                           |
|-------------------|-----------------------------|-------------------------------------------------|
| `Label Row`       | `<label>` wrapper           | Hidden when `hasLabel=false`                    |
| `Label`           | `<label>` text              | Associates with trigger via `id`                |
| `Required`        | `<span>` beside label       | "(Required)" — shown when `isRequired=true`     |
| `Label Icon`      | `<span>` info icon          | Shown when `hasLabelIcon=true`                  |
| `Trigger`         | `<button role="combobox">`  | The closed select control                       |
| `Leading Icon`    | `<span>` inside trigger     | Left-aligned; shown when `hasLeadingIcon=true`  |
| `Content`         | `<span>` text container     | Holds `Value` text node                         |
| `Value`           | `<span>` display text       | Shows placeholder or selected option            |
| `Chevron`         | `<span>` caret icon         | Rotates 180° when open; always visible          |
| `focus-ring`      | `::after` / overlay         | Outside trigger; all focusable states           |
| `focus-border`    | `::before` / overlay        | Inside trigger; Default/Filled/Active only      |
| `Below Field`     | `<div>` below trigger       | Contains Hint Text and Status Message atoms     |
| `Hint Text`       | Atom instance / `<p>`       | Helper copy; shown via `hasHintText`            |
| `Status Message`  | Atom instance / `<p role="alert">` | Validation copy; shown via `hasStatusMessage` |

---

## 3. TypeScript Props Interface

```typescript
export interface SelectProps {
  // ── Size ──────────────────────────────────────────────────────────────
  /** Trigger height tier. md=32px · lg=40px · xl=52px. Default: lg */
  size?: 'md' | 'lg' | 'xl';

  // ── Open state ─────────────────────────────────────────────────────────
  /** Controls whether the dropdown listbox is open. */
  isOpen?: boolean;
  /** Callback when the trigger is clicked to open/close. */
  onOpenChange?: (open: boolean) => void;

  // ── State ──────────────────────────────────────────────────────────────
  /** Disables the control. Applies 0.40 layer opacity + surface/disabled fill. */
  disabled?: boolean;
  /** Makes the control non-interactive. No dropdown opens. */
  readOnly?: boolean;
  /** Applies error visual treatment. */
  hasError?: boolean;
  /** Applies warning visual treatment. */
  hasWarning?: boolean;
  /** Applies success visual treatment. */
  hasSuccess?: boolean;

  // ── Label ─────────────────────────────────────────────────────────────
  /** Hides the label row. Provide aria-label when false. */
  hasLabel?: boolean;
  /** Label text content. */
  label?: string;
  /** Shows an info icon at the right end of the label row. */
  hasLabelIcon?: boolean;
  /** The info icon component shown beside the label. */
  labelIcon?: React.ReactNode;
  /** Shows "(Required)" qualifier beside the label. */
  isRequired?: boolean;

  // ── Icon ──────────────────────────────────────────────────────────────
  /** Shows a leading icon inside the trigger. */
  hasLeadingIcon?: boolean;
  /** Leading icon component. Only rendered when hasLeadingIcon=true. */
  leadingIcon?: React.ReactNode;

  // ── Options ───────────────────────────────────────────────────────────
  /** Options to render inside the dropdown listbox. */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  /** Currently selected value (controlled). */
  value?: string;
  /** Placeholder text shown when no option is selected. */
  placeholder?: string;
  /** Change handler. Called with the newly selected option value. */
  onChange?: (value: string) => void;

  // ── Below field ───────────────────────────────────────────────────────
  /** Shows hint text below the trigger. Default: true. */
  hasHintText?: boolean;
  /** Hint text content. */
  hintText?: string;
  /** Shows status message below the trigger. */
  hasStatusMessage?: boolean;
  /** Status message text for error/warning/success states. */
  statusMessage?: string;

  // ── HTML / ARIA ───────────────────────────────────────────────────────
  /** Select id. Auto-generated if not provided. */
  id?: string;
  /** ARIA label when hasLabel=false. */
  'aria-label'?: string;
  /** Associates with an external label element. */
  'aria-labelledby'?: string;
  /** Additional class names for the root wrapper. */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma property         | Figma type     | React prop         | React type                        | Notes                                          |
|------------------------|----------------|--------------------|-----------------------------------|------------------------------------------------|
| `Size`                 | Variant        | `size`             | `'md' \| 'lg' \| 'xl'`           | Default: `'lg'`                                |
| `State=Default`        | Variant        | —                  | Default render                    | No value selected                              |
| `State=Filled`         | Variant        | `value !== ''`     | Derived from `value`              | Option selected, closed                        |
| `State=Open`           | Variant        | `isOpen=true`      | `boolean`                         | Dropdown visible; `border/brand` 2px           |
| `State=Active`         | Variant        | CSS `:focus-visible`| —                                | Keyboard-focused closed state                  |
| `State=Error`          | Variant        | `hasError`         | `boolean`                         | Requires `statusMessage`                       |
| `State=Warning`        | Variant        | `hasWarning`       | `boolean`                         | Requires `statusMessage`                       |
| `State=Success`        | Variant        | `hasSuccess`       | `boolean`                         | Requires `statusMessage`                       |
| `State=Disabled`       | Variant        | `disabled`         | `boolean`                         | Gray fill + 0.40 opacity                       |
| `State=Readonly`       | Variant        | `readOnly`         | `boolean`                         | Sunken fill, no interaction                    |
| `isOpen`               | Boolean        | `isOpen`           | `boolean`                         | Design-time toggle; matches `State=Open`       |
| `hasLeadingIcon`       | Boolean        | `hasLeadingIcon`   | `boolean`                         | Default: `false`                               |
| `hasLabel`             | Boolean        | `hasLabel`         | `boolean`                         | Default: `true`                                |
| `hasLabelIcon`         | Boolean        | `hasLabelIcon`     | `boolean`                         | Default: `false`                               |
| `isRequired`           | Boolean        | `isRequired`       | `boolean`                         | Default: `false`                               |
| `hasFocus`             | Boolean        | —                  | CSS `:focus-visible`              | Storybook demo only                            |
| `hasHintText`          | Boolean        | `hasHintText`      | `boolean`                         | Default: `true`                                |
| `hasStatusMessage`     | Boolean        | `hasStatusMessage` | `boolean`                         | Default: `false`                               |
| `label`                | Text           | `label`            | `string`                          | Default: `'Label'`                             |
| `placeholder`          | Text           | `placeholder`      | `string`                          | Default: `'Select an option'`                  |
| `hintText`             | Text           | `hintText`         | `string`                          | Default: `'Helper text'`                       |
| `statusMessage`        | Text           | `statusMessage`    | `string`                          | Default: `'Status message'`                    |
| `selectChevron`        | Instance Swap  | Internal           | —                                 | Chevron icon; internal, not a prop             |
| `selectLeadingIcon`    | Instance Swap  | `leadingIcon`      | `React.ReactNode`                 | User-provided icon component                   |

---

## 5. State Behaviour

| State    | Trigger                        | Visual changes                                                         | Token(s) changed                                            | ARIA change                                              |
|----------|-------------------------------|-------------------------------------------------------------------------|-------------------------------------------------------------|----------------------------------------------------------|
| Default  | Initial, no selection          | White bg, 1px gray border, placeholder text in `text/placeholder`      | `select/background/default`, `select/border/default`        | `aria-expanded="false"`                                  |
| Filled   | Option selected, closed        | White bg, 1px gray border, value text in `text/default`                | `select/text/value`                                         | `aria-expanded="false"`, `aria-selected` on option       |
| Open     | Trigger clicked / Enter key    | 2px brand purple border, chevron rotates 180°, listbox renders         | `select/border/open` (`border/brand`)                       | `aria-expanded="true"`, `aria-haspopup="listbox"`        |
| Active   | Keyboard focus, closed         | 2px `select/border/focused`, focus-ring outside                        | `select/border/focused`                                     | Focus visible indicator                                  |
| Error    | `hasError=true`                | 2px red border, status icon + message below, no focus-border in status | `select/border/error`                                       | `aria-invalid="true"`, `role="alert"` on status          |
| Warning  | `hasWarning=true`              | 2px yellow border, warning icon + message below                        | `select/border/warning`                                     | `aria-describedby` → status node                         |
| Success  | `hasSuccess=true`              | 2px green border, check icon + message below                           | `select/border/success`                                     | `aria-describedby` → status node                         |
| Disabled | `disabled=true`                | `surface/disabled` fill + 0.40 opacity, `not-allowed` cursor           | `select/background/disabled`, `visibility/disabled`         | `aria-disabled="true"`, `disabled`                       |
| Readonly | `readOnly=true`                | `surface/sunken` fill, near-invisible `border/subtle` border, no hover | `select/background/readonly`, `select/border/readonly`      | `aria-readonly="true"`                                   |

### Disabled state — double treatment
Select applies BOTH `surface/disabled` fill (gray background) AND `visibility/disabled` (0.40 opacity) on the Disabled state. This is intentional — it makes Select's disabled state visually distinct from Input's (which only uses opacity). Do not change to single-treatment without a design review.

### Focus ring behaviour (two-layer system)
- **`focus-ring`** (outer): 2px `border/focus` (purple/500), 2px outside the trigger. Active in all focusable states (Default, Filled, Active, Error, Warning, Success). NOT active on Disabled/Readonly.
- **`focus-border`** (inner): 2px `border/focus`, inside the trigger. Active in Default, Filled, Active only. Suppressed in Error/Warning/Success to preserve status border colour.
- Hover has no separate Figma variant — it is handled entirely by CSS `:hover` with `select/border/hover`.

### Open state — chevron rotation
The chevron (CaretDown icon) rotates 180° when `isOpen=true`. Implement via CSS transform:
```css
.select-chevron { transition: transform 200ms ease-out; }
.select-trigger[aria-expanded="true"] .select-chevron { transform: rotate(180deg); }
```

---

## 6. Size Specification

| Property              | md                               | lg                               | xl                               |
|-----------------------|----------------------------------|----------------------------------|----------------------------------|
| Trigger height        | 32px                             | 40px                             | 52px                             |
| Token (height)        | `select/md/height`               | `select/lg/height`               | `select/xl/height`               |
| Padding horizontal    | 12px                             | 16px                             | 20px                             |
| Token (padding H)     | `select/md/padding/horizontal`   | `select/lg/padding/horizontal`   | `select/xl/padding/horizontal`   |
| Icon–content gap      | 8px                              | 8px                              | 8px                              |
| Token (gap)           | `select/md/gap`                  | `select/lg/gap`                  | `select/xl/gap`                  |
| Border radius         | 4px                              | 4px                              | 8px                              |
| Token (radius)        | `select/md/radius`               | `select/lg/radius`               | `select/xl/radius`               |
| Border width default  | 1px                              | 1px                              | 1px                              |
| Border width focused  | 2px                              | 2px                              | 2px                              |
| Token (border width)  | `select/border/width/default`    | `select/border/width/default`    | `select/border/width/default`    |
| Leading icon size     | 16px                             | 20px                             | 28px                             |
| Token (icon size)     | `select/md/icon/size`            | `select/lg/icon/size`            | `select/xl/icon/size`            |
| Chevron size          | 16px                             | 20px                             | 28px                             |
| Label font size       | 12px Medium (Label/MD)           | 13px Medium (Label/LG)           | 14px Medium (Label/XL)           |
| Value/placeholder     | 14px Regular (Body/MD)           | 16px Regular (Body/LG)           | 18px Regular (Body/XL)           |
| Hint/status font      | 12px Regular (Body/XS)           | 12px Regular (Body/XS)           | 12px Regular (Body/XS)           |
| Focus ring outset     | 4px total (2px each side)        | 4px total (2px each side)        | 4px total (2px each side)        |
| Token (ring outset)   | `select/focus/ring/offset`       | `select/focus/ring/offset`       | `select/focus/ring/offset`       |

---

## 7. Token Reference

All tokens in `Venus_Components` unless marked `[Semantics]`. CSS custom property: replace `/` with `-`, prefix with `--`. Example: `select/background/default` → `--select-background-default`.

### Colour tokens

| Layer / purpose              | Token name                       | State(s)                              |
|------------------------------|----------------------------------|---------------------------------------|
| Trigger fill                 | `select/background/default`      | Default, Filled, Active               |
| Trigger fill (hover)         | `select/background/hover`        | Hover (CSS :hover)                    |
| Trigger fill (open)          | `select/background/open`         | Open                                  |
| Trigger fill (disabled)      | `select/background/disabled`     | Disabled                              |
| Trigger fill (readonly)      | `select/background/readonly`     | Readonly                              |
| Trigger fill (error)         | `select/background/error`        | Error                                 |
| Trigger fill (warning)       | `select/background/warning`      | Warning                               |
| Trigger fill (success)       | `select/background/success`      | Success                               |
| Trigger border               | `select/border/default`          | Default, Filled                       |
| Trigger border               | `select/border/hover`            | Hover                                 |
| Trigger border               | `select/border/focused`          | Active (keyboard focus)               |
| Trigger border               | `select/border/open`             | Open                                  |
| Trigger border               | `select/border/error`            | Error                                 |
| Trigger border               | `select/border/warning`          | Warning                               |
| Trigger border               | `select/border/success`          | Success                               |
| Trigger border               | `select/border/disabled`         | Disabled                              |
| Trigger border               | `select/border/readonly`         | Readonly                              |
| Focus ring + focus border    | `border/focus` [Semantics]       | Focused (Active state)                |
| Placeholder text             | `select/text/placeholder`        | Default (no selection)                |
| Value text                   | `select/text/value`              | Filled, Open, Active                  |
| Value text (disabled)        | `select/text/disabled`           | Disabled                              |
| Value text (readonly)        | `select/text/readonly`           | Readonly                              |
| Label text                   | `select/label/default`           | All                                   |
| Hint text                    | `select/hint/default`            | Default, Hover, Filled, Active        |
| Status message text          | `select/hint/error`              | Error                                 |
| Status message text          | `select/hint/warning`            | Warning                               |
| Status message text          | `select/hint/success`            | Success                               |
| Leading icon fill            | `select/icon/default`            | Enabled states                        |
| Leading icon fill            | `select/icon/active`             | Open/Active                           |
| Leading icon fill            | `select/icon/disabled`           | Disabled                              |
| Leading icon fill            | `select/icon/error`              | Error                                 |
| Chevron fill                 | `select/icon/default`            | Default, Filled                       |
| Chevron fill (open)          | `select/icon/active`             | Open                                  |
| Layer opacity (disabled)     | `visibility/disabled` [Semantics]| Disabled (0.40)                       |

### Structural tokens

| Property              | Token name                                                     |
|-----------------------|----------------------------------------------------------------|
| Trigger height        | `select/md/height` · `select/lg/height` · `select/xl/height`  |
| Padding horizontal    | `select/md/padding/horizontal` · `select/lg/padding/horizontal` · `select/xl/padding/horizontal` |
| Gap                   | `select/md/gap` · `select/lg/gap` · `select/xl/gap`           |
| Border radius         | `select/md/radius` · `select/lg/radius` · `select/xl/radius`  |
| Border width default  | `select/border/width/default`                                  |
| Border width focused  | `select/border/width/focused`                                  |
| Border width error    | `select/border/width/error`                                    |
| Border width warning  | `select/border/width/warning`                                  |
| Border width success  | `select/border/width/success`                                  |
| Focus ring width      | `select/focus/ring/width`                                      |
| Focus ring outset     | `select/focus/ring/offset`                                     |
| Icon size             | `select/md/icon/size` · `select/lg/icon/size` · `select/xl/icon/size` |
| Label–trigger gap     | `select/label/gap`                                             |
| Hint gap              | `select/hint/gap`                                              |

---

## 8. Accessibility

### ARIA roles and attributes

```html
<!-- Closed state -->
<div class="select-root">
  <label id="select-label-id" for="select-trigger-id">
    Field label <span class="qualifier">(Required)</span>
  </label>
  <button
    id="select-trigger-id"
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-required="true"
    aria-labelledby="select-label-id"
    aria-describedby="select-hint-id"
  >
    <span class="select-value">Select an option</span>
    <span class="select-chevron" aria-hidden="true">▾</span>
  </button>
  <p id="select-hint-id">Helper text</p>
</div>

<!-- Open state -->
<button aria-expanded="true" aria-activedescendant="option-id-2">...</button>
<ul role="listbox" aria-labelledby="select-label-id">
  <li role="option" id="option-id-1" aria-selected="false">Option 1</li>
  <li role="option" id="option-id-2" aria-selected="true">Option 2</li>
  <li role="option" id="option-id-3" aria-selected="false" aria-disabled="true">Disabled option</li>
</ul>

<!-- Error state -->
<button aria-invalid="true" aria-describedby="select-status-id">...</button>
<p id="select-status-id" role="alert">Please select a valid option.</p>

<!-- No visible label -->
<button aria-label="Sort order" ...>...</button>
```

### Keyboard behaviour

| Key              | Behaviour                                                                   |
|------------------|-----------------------------------------------------------------------------|
| `Tab`            | Moves focus to trigger                                                      |
| `Space` / `Enter`| Opens dropdown if closed; selects focused option if open                   |
| `↓` / `↑`        | Navigates options when open; opens dropdown when closed                     |
| `Home` / `End`   | Jumps to first / last option when open                                      |
| `Escape`         | Closes dropdown without selection; returns focus to trigger                 |
| `Tab` (when open)| Closes dropdown and moves focus to next focusable element                   |
| Type-ahead       | Jumps to first option matching typed character(s)                           |

### Contrast ratios (WCAG 2.2 AA)

| Pair                              | Ratio   | Pass/Fail  |
|-----------------------------------|---------|------------|
| Value text on white bg            | ~14:1   | ✅ AAA     |
| Placeholder text on white bg      | ~2.5:1  | ✅ exempt  |
| Label text on white bg            | ~9:1    | ✅ AAA     |
| Error border (red/600) on white   | ~4.9:1  | ✅ AA      |
| Warning border (yellow/700) on white | ~4.7:1 | ✅ AA    |
| Success border (green/700) on white  | ~4.5:1 | ✅ AA    |
| Focus ring purple on white        | ~4.86:1 | ✅ AA      |
| Open border (brand purple) on white | ~4.86:1 | ✅ AA    |
| Disabled at 40% opacity           | exempt  | ✅ WCAG 1.4.3 |

---

## 9. Storybook Stories

```typescript
// select.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { GlobeIcon, FolderIcon } from '@contentstack/icons';

const LOCALE_OPTIONS = [
  { value: 'en-us', label: 'English (US)' },
  { value: 'en-gb', label: 'English (UK)' },
  { value: 'fr-fr', label: 'French (France)' },
  { value: 'de-de', label: 'German (Germany)' },
  { value: 'ja-jp', label: 'Japanese (Japan)' },
];

const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Single line text' },
  { value: 'textarea', label: 'Multi-line text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'file', label: 'File' },
  { value: 'reference', label: 'Reference', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['md', 'lg', 'xl'] },
    isOpen: { control: 'boolean' },
    hasError: { control: 'boolean' },
    hasWarning: { control: 'boolean' },
    hasSuccess: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    hasLeadingIcon: { control: 'boolean' },
    hasLabel: { control: 'boolean' },
    hasLabelIcon: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    hasHintText: { control: 'boolean' },
    hasStatusMessage: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Select>;

// ── Core stories ─────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 'lg',
    label: 'Field type',
    placeholder: 'Select a field type',
    options: FIELD_TYPE_OPTIONS,
    hintText: 'Choose the data type for this field.',
    hasHintText: true,
  },
};

export const Filled: Story = {
  args: {
    ...Default.args,
    value: 'text',
  },
};

export const Open: Story = {
  args: {
    ...Default.args,
    isOpen: true,
    value: 'text',
  },
};

export const WithLeadingIcon: Story = {
  args: {
    ...Default.args,
    hasLeadingIcon: true,
    leadingIcon: <GlobeIcon />,
    label: 'Default locale',
    placeholder: 'Select a locale',
    options: LOCALE_OPTIONS,
    hintText: 'The locale used when no locale is specified.',
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    isRequired: true,
  },
};

// ── Status states ─────────────────────────────────────────────────────────────

export const Error: Story = {
  args: {
    ...Default.args,
    hasError: true,
    hasStatusMessage: true,
    statusMessage: 'A field type is required before you can save.',
  },
};

export const Warning: Story = {
  args: {
    ...Filled.args,
    hasWarning: true,
    hasStatusMessage: true,
    statusMessage: 'Changing the field type will delete existing content.',
  },
};

export const Success: Story = {
  args: {
    ...Filled.args,
    hasSuccess: true,
    hasStatusMessage: true,
    statusMessage: 'Field type saved.',
  },
};

// ── Interaction states ────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    ...Filled.args,
    disabled: true,
    hintText: 'Field type cannot be changed after creation.',
  },
};

export const Readonly: Story = {
  args: {
    ...Filled.args,
    readOnly: true,
    hintText: 'Inherited from parent schema.',
  },
};

// ── Size variants ─────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Select size="md" label="Compact (md — 32px)" placeholder="Sidebar filters" options={LOCALE_OPTIONS} hintText="Dense contexts" />
      <Select size="lg" label="Default (lg — 40px)" placeholder="Main body forms" options={LOCALE_OPTIONS} hintText="System default" />
      <Select size="xl" label="Large (xl — 52px)" placeholder="Onboarding" options={LOCALE_OPTIONS} hintText="Hero and onboarding flows" />
    </div>
  ),
};

// ── Combinations ──────────────────────────────────────────────────────────────

export const WithAllOptionalElements: Story = {
  args: {
    size: 'lg',
    label: 'Default locale',
    hasLabelIcon: true,
    labelIcon: <GlobeIcon />,
    isRequired: true,
    hasLeadingIcon: true,
    leadingIcon: <GlobeIcon />,
    placeholder: 'Select a locale',
    options: LOCALE_OPTIONS,
    hasHintText: true,
    hintText: 'The default locale for new entries.',
  },
};

// ── Form row context ──────────────────────────────────────────────────────────

export const AsFormRow: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <Select
        size="lg"
        label="Field type"
        isRequired
        placeholder="Select a field type"
        options={FIELD_TYPE_OPTIONS}
        hintText="Determines what kind of data this field stores."
      />
      <Select
        size="lg"
        label="Default locale"
        placeholder="Select a locale"
        options={LOCALE_OPTIONS}
        hintText="Locale used when no locale is explicitly set."
        hasLeadingIcon
        leadingIcon={<GlobeIcon />}
      />
    </form>
  ),
};

// ── Dark mode ─────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  args: { ...Default.args },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

export const DarkModeOpen: Story = {
  args: { ...Open.args },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

// ── Edge cases ────────────────────────────────────────────────────────────────

export const ManyOptions: Story = {
  args: {
    ...Default.args,
    options: Array.from({ length: 50 }, (_, i) => ({
      value: `option-${i}`,
      label: `Option ${i + 1}`,
    })),
    hintText: 'Dropdown should be scrollable when options exceed viewport height.',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    ...Default.args,
    options: FIELD_TYPE_OPTIONS, // includes disabled: true on Reference
    hintText: 'Disabled options are non-interactive and shown at reduced opacity.',
  },
};

export const NoLabel: Story = {
  args: {
    hasLabel: false,
    'aria-label': 'Sort order',
    placeholder: 'Sort by…',
    options: [
      { value: 'updated', label: 'Last updated' },
      { value: 'created', label: 'Date created' },
      { value: 'alpha', label: 'Alphabetical' },
    ],
    hasHintText: false,
    size: 'md',
  },
};

export const LongOptionLabels: Story = {
  args: {
    ...Default.args,
    options: [
      { value: '1', label: 'A very long option label that tests text truncation within the trigger' },
      { value: '2', label: 'Another long label to verify consistent truncation behaviour' },
    ],
    value: '1',
  },
};
```

---

## 10. Implementation Notes

### CSS custom properties

```css
.select-trigger {
  background-color: var(--select-background-default);
  border: var(--select-border-width-default) solid var(--select-border-default);
  border-radius: var(--select-md-radius);
  padding-left: var(--select-md-padding-horizontal);
  padding-right: var(--select-md-padding-horizontal);
  height: var(--select-md-height);
  gap: var(--select-md-gap);
  cursor: pointer;
}

.select-trigger:hover:not([disabled]):not([aria-readonly="true"]) {
  border-color: var(--select-border-hover);
}

.select-trigger:focus-visible:not([disabled]) {
  border-width: var(--select-border-width-focused);
  border-color: var(--select-border-focused);
  outline: var(--select-focus-ring-width) solid var(--border-focus);
  outline-offset: 2px;
}

.select-trigger[aria-expanded="true"] {
  border-width: var(--select-border-width-focused);
  border-color: var(--select-border-open);
}

.select-trigger[aria-invalid="true"] {
  border-width: var(--select-border-width-error);
  border-color: var(--select-border-error);
}

/* Disabled — double treatment */
.select-root[data-disabled="true"] {
  background-color: var(--select-background-disabled);
  opacity: var(--visibility-disabled); /* 0.40 */
  cursor: not-allowed;
  pointer-events: none;
}
```

### Dropdown listbox positioning

The listbox renders as an absolutely positioned element below the trigger. Use a portal (`ReactDOM.createPortal`) to prevent clipping inside overflow-hidden containers. Position with `top = triggerBottom + 4px`, align leading edge with trigger leading edge, min-width matches trigger width.

### Status state priority

Only one status active at a time. Priority: `hasError` > `hasWarning` > `hasSuccess`.

### Dark mode

Tokens switch automatically via `[data-theme="dark"]` on a parent container. No component changes needed.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .select-chevron { transition: none; }
  .select-listbox { animation: none; }
}
```

### Form row consistency rule

Every component in the same horizontal form row must use the same `size` tier. A `lg` Select (40px) must sit alongside `lg` Input (40px) and `lg` Button (40px).

---

## 11. Do / Don't

| ✅ Do                                                                   | ❌ Don't                                                                  |
|------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Use `lg` as the default size in main body forms                        | Mix `md` and `lg` selects in the same horizontal form row                 |
| Always provide an `options` array — never render Select empty          | Leave `options` as an empty array on a published form                     |
| Rotate the chevron 180° when `isOpen=true`                             | Use a separate open/close icon — the rotating chevron is the system pattern |
| Provide `statusMessage` whenever a status state is active              | Apply error state without a message — color alone does not communicate state |
| Use `readOnly` for inherited or system-managed values                  | Use `disabled` for fields that are merely display-only                    |
| Provide `aria-label` when `hasLabel=false`                             | Hide the label without an alternative accessible name                     |
| Apply `isRequired` AND `aria-required="true"` together                 | Mark required visually only                                               |
| Keep option labels short and scannable (under 40 characters)           | Use long sentences as option labels — the trigger has limited width        |
| Implement type-ahead keyboard navigation in the listbox                | Omit type-ahead — it is required by ARIA combobox pattern                 |

---

## 12. Related Components

| Component   | Relationship           | When to use instead of Select                                             |
|-------------|------------------------|---------------------------------------------------------------------------|
| `Input`      | Sibling (free text)    | When the user needs to type a value not in a predefined list             |
| `Radio`      | Sibling (always visible)| When there are 2–4 options and always-visible comparison helps           |
| `Checkbox`   | Sibling (multi-select) | When the user must select more than one option                           |
| `Textarea`   | Sibling (multi-line)   | When the field value is long-form text, not an enumerated choice         |
| `Slider`     | Sibling (range)        | When the value is numeric and bounded by a range                         |

---

*Brief generated: 2026-06-01 · Venus 2.1 RF v2.1.0 · Figma node 682:46343*
