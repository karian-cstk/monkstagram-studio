# Input — Storybook Engineering Brief
**Venus 2.1 RF · Contentstack Design System**
Figma node: `702:58081` · Version: 2.1.0 · Last updated: 2026-06-01

---

## 1. Purpose

`Input` is the primary single-line text entry control for Contentstack CMS forms. It captures free-text values — field names, slugs, URLs, search queries, metadata values — in high-volume editorial workflows.

**Use when:** collecting a single line of free-form text, a URL, an email, a number, or any value that does not require multi-line entry.

**Do not use when:**
- The user needs to enter multiple lines of text → use `Textarea`
- The user must select from a predefined list → use `Select`
- The field value must stay within a defined numeric range → use `Slider` (WithInput type)

**Alternatives:** `Textarea` (multi-line), `Select` (predefined options), `Slider` (range-bound numbers).

---

## 2. Anatomy

```
┌─────────────────────────────────────────────────────┐
│ label-text                    [Label Icon] (optional)│  ← Label Row (hidden via hasLabel=false)
│ (Required) qualifier          [Spacer]               │  ← qualifier-text (shown via isRequired=true)
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ [Leading Icon]  Placeholder text / Value  [Trailing] │  ← Trigger (the <input> container)
│                                    [focus-ring]      │  ← ABSOLUTE, outside trigger (-2px offset)
│                                    [focus-border]    │  ← ABSOLUTE, inside trigger (Default/Hover/Filled)
└─────────────────────────────────────────────────────┘
  Helper text                                            ← Below Field / hint-text
  [✕] Status message text                               ← Below Field / status-text (shown via hasStatusMessage=true)
```

| Figma layer       | DOM element / role         | Notes                                          |
|-------------------|----------------------------|------------------------------------------------|
| `Label Row`       | `<label>` wrapper          | Hidden when `hasLabel=false`                   |
| `label-text`      | `<label>` text             | Associates via `htmlFor` / `id`                |
| `qualifier-text`  | `<span>` beside label      | "(Required)" — shown when `isRequired=true`    |
| `Label Icon`      | `<span>` icon beside label | Optional info icon; shown via `hasLabelIcon`   |
| `Trigger`         | `<div>` wrapping `<input>` | Handles border, padding, focus ring            |
| `Leading Icon`    | `<span>` inside trigger    | Left-aligned icon; shown via `hasLeadingIcon`  |
| `input-text`      | `<input type="text">`      | The actual text field                          |
| `Trailing Icon`   | `<span>` inside trigger    | Right-aligned icon; shown via `hasTrailingIcon`|
| `focus-ring`      | `::after` pseudo / overlay | ABSOLUTE, outside trigger, `hasFocus`-driven   |
| `focus-border`    | `::before` pseudo / overlay| ABSOLUTE, inside trigger, Default/Hover/Filled |
| `Below Field`     | `<div>` below trigger      | Contains hint + status message                 |
| `hint-text`       | `<p>` helper text          | Always renders if `hasHintText=true`           |
| `status-text`     | `<p role="alert">`         | Validation message; shown via `hasStatusMessage`|

---

## 3. TypeScript Props Interface

```typescript
export interface InputProps {
  // ── Size ──────────────────────────────────────────────────────────────
  /** Trigger height tier. md=32px · lg=40px · xl=52px. Default: lg */
  size?: 'md' | 'lg' | 'xl';

  // ── State (CSS pseudo-classes handle hover/focus internally) ──────────
  /** Disables the input. Applies 0.40 layer opacity. Sets aria-disabled. */
  disabled?: boolean;
  /** Makes the input non-editable. Sets readOnly attribute + aria-readonly. */
  readOnly?: boolean;
  /** Applies error visual treatment. Requires errorMessage for accessible feedback. */
  hasError?: boolean;
  /** Applies warning visual treatment. Requires statusMessage. */
  hasWarning?: boolean;
  /** Applies success visual treatment. Requires statusMessage. */
  hasSuccess?: boolean;

  // ── Label ─────────────────────────────────────────────────────────────
  /** Hides the label row entirely. Use only when label context is provided elsewhere. */
  hasLabel?: boolean;
  /** Label text. Rendered as <label> associated with the input via id. */
  label?: string;
  /** Shows an info icon at the right end of the label row. */
  hasLabelIcon?: boolean;
  /** The info icon component shown beside the label. */
  labelIcon?: React.ReactNode;
  /** Shows "(Required)" qualifier beside the label. */
  isRequired?: boolean;

  // ── Icons ─────────────────────────────────────────────────────────────
  /** Shows a leading icon inside the trigger, left of the value. */
  hasLeadingIcon?: boolean;
  /** Leading icon component. Only rendered when hasLeadingIcon=true. */
  leadingIcon?: React.ReactNode;
  /** Shows a trailing icon inside the trigger, right of the value. */
  hasTrailingIcon?: boolean;
  /** Trailing icon component. Only rendered when hasTrailingIcon=true. */
  trailingIcon?: React.ReactNode;

  // ── Content ───────────────────────────────────────────────────────────
  /** Placeholder text shown when value is empty and input is unfocused. */
  placeholder?: string;
  /** Current value of the input (controlled). */
  value?: string;
  /** Change handler for controlled usage. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // ── Below field ───────────────────────────────────────────────────────
  /** Shows hint text below the trigger. Default: true. */
  hasHintText?: boolean;
  /** Hint text content shown below the trigger in non-error states. */
  hintText?: string;
  /** Shows status message below the trigger. Overrides hint text position. */
  hasStatusMessage?: boolean;
  /** Status message text shown when hasError, hasWarning, or hasSuccess is true. */
  statusMessage?: string;

  // ── HTML passthrough ─────────────────────────────────────────────────
  /** Native input type. Defaults to "text". */
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  /** Input id — used to associate label. Auto-generated if not provided. */
  id?: string;
  /** Input name for form submission. */
  name?: string;
  /** ARIA label when hasLabel=false (required for accessibility). */
  'aria-label'?: string;
  /** Associates with an external label element. */
  'aria-labelledby'?: string;
  /** Additional class names for the root wrapper. */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma property          | Figma type     | React prop          | React type                     | Notes                                      |
|-------------------------|----------------|---------------------|--------------------------------|--------------------------------------------|
| `Size`                  | Variant        | `size`              | `'md' \| 'lg' \| 'xl'`        | Default: `'lg'`                            |
| `State=Default`         | Variant        | —                   | CSS default                    | Base state                                 |
| `State=Hover`           | Variant        | —                   | CSS `:hover`                   | Never a prop                               |
| `State=Active`          | Variant        | —                   | CSS `:focus-within` / active   | Focused + typing state                     |
| `State=Filled`          | Variant        | value !== ''        | Derived from `value`           | No explicit prop needed                    |
| `State=Error`           | Variant        | `hasError`          | `boolean`                      | Requires `statusMessage`                   |
| `State=Warning`         | Variant        | `hasWarning`        | `boolean`                      | Requires `statusMessage`                   |
| `State=Success`         | Variant        | `hasSuccess`        | `boolean`                      | Requires `statusMessage`                   |
| `State=Disabled`        | Variant        | `disabled`          | `boolean`                      | Maps to `disabled` HTML attr               |
| `State=Readonly`        | Variant        | `readOnly`          | `boolean`                      | Maps to `readOnly` HTML attr               |
| `hasFocus`              | Boolean        | —                   | CSS `:focus-visible`           | Storybook demo only; not a runtime prop    |
| `hasLeadingIcon`        | Boolean        | `hasLeadingIcon`    | `boolean`                      | Default: `false`                           |
| `hasTrailingIcon`       | Boolean        | `hasTrailingIcon`   | `boolean`                      | Default: `false`                           |
| `hasLabel`              | Boolean        | `hasLabel`          | `boolean`                      | Default: `true`                            |
| `hasLabelIcon`          | Boolean        | `hasLabelIcon`      | `boolean`                      | Default: `false`                           |
| `isRequired`            | Boolean        | `isRequired`        | `boolean`                      | Default: `false`; also sets `required` attr|
| `hasHintText`           | Boolean        | `hasHintText`       | `boolean`                      | Default: `true`                            |
| `hasStatusMessage`      | Boolean        | `hasStatusMessage`  | `boolean`                      | Default: `false`                           |
| `label`                 | Text           | `label`             | `string`                       | Default: `'Label'`                         |
| `placeholder`           | Text           | `placeholder`       | `string`                       | Default: `'Placeholder text'`              |
| `value`                 | Text           | `value`             | `string`                       | Controlled                                 |
| `hintText`              | Text           | `hintText`          | `string`                       | Default: `'Helper text'`                   |
| `statusMessage`         | Text           | `statusMessage`     | `string`                       | Default: `'This field has an error'`       |

---

## 5. State Behaviour

| State      | Trigger                        | Visual changes                                              | Token(s) changed                           | ARIA change                           |
|------------|-------------------------------|-------------------------------------------------------------|---------------------------------------------|---------------------------------------|
| Default    | Initial render                | White bg, 1px gray border, placeholder text in gray        | `input/background/default`, `input/border/default` | —                               |
| Hover      | Mouse enters trigger          | Purple border (1px), white bg unchanged                    | `input/border/hover`                        | —                                     |
| Active     | Input receives focus          | Purple border (2px), focus-ring outside (2px)              | `input/border/focused` (2px)                | —                                     |
| Filled     | Value is non-empty            | Same as Default; value text in `text/default` color        | `input/text/value`                          | —                                     |
| Error      | `hasError=true`               | Red border (2px), red status icon + message below          | `input/border/error`, `input/hint/error`    | `aria-invalid="true"`, `role="alert"` |
| Warning    | `hasWarning=true`             | Yellow border (2px), warning icon + message below          | `input/border/warning`, `input/hint/warning`| `aria-describedby` → status node      |
| Success    | `hasSuccess=true`             | Green border (2px), check icon + message below             | `input/border/success`, `input/hint/success`| `aria-describedby` → status node      |
| Disabled   | `disabled=true`               | Entire component at 0.40 opacity, `not-allowed` cursor     | `visibility/disabled` (layer opacity)       | `aria-disabled="true"`, `disabled`    |
| Readonly   | `readOnly=true`               | Gray sunken bg (`surface/sunken`), near-invisible border, "(Read Only)" qualifier visible, chevron hidden | `input/background/readonly`, `input/border/readonly` | `aria-readonly="true"`, `readOnly` |

### Focus ring behaviour (two-layer system)
- **`focus-ring`** (outer): 2px solid `border/focus` (purple/500), placed 2px outside the trigger. `border-radius = trigger-radius + 2px`. Active in ALL states when focused, except Disabled and Readonly.
- **`focus-border`** (inner): 2px solid `border/focus`, INSIDE the trigger border. Present in Default, Hover, Filled states only. In Error/Warning/Success, the status border is preserved and focus-border is suppressed to avoid colour conflict.
- Both are controlled by `:focus-visible` (not a prop). In Storybook use `hasFocus=true` variant to demonstrate.

---

## 6. Size Specification

| Property             | md                          | lg                          | xl                          |
|----------------------|-----------------------------|-----------------------------|-----------------------------|
| Trigger height       | 32px                        | 40px                        | 52px                        |
| Token (height)       | `input/md/height`           | `input/lg/height`           | `input/xl/height`           |
| Padding horizontal   | 12px                        | 16px                        | 20px                        |
| Token (padding H)    | `input/md/padding/horizontal`| `input/lg/padding/horizontal`| `input/xl/padding/horizontal`|
| Padding vertical     | 0px (auto-centred)          | 0px (auto-centred)          | 0px (auto-centred)          |
| Icon–text gap        | 8px                         | 8px                         | 8px                         |
| Token (gap)          | `input/md/gap`              | `input/lg/gap`              | `input/xl/gap`              |
| Border radius        | 4px                         | 4px                         | 8px                         |
| Token (radius)       | `input/md/radius`           | `input/lg/radius`           | `input/xl/radius`           |
| Border width default | 1px                         | 1px                         | 1px                         |
| Border width active  | 2px                         | 2px                         | 2px                         |
| Token (border width) | `input/border/width/default`| `input/border/width/default`| `input/border/width/default`|
| Icon size            | 16px                        | 20px                        | 24px                        |
| Token (icon size)    | `input/md/icon/size`        | `input/lg/icon/size`        | `input/xl/icon/size`        |
| Label font size      | 12px Medium (Label/MD)      | 13px Medium (Label/LG)      | 14px Medium (Label/XL)      |
| Value/placeholder    | 14px Regular (Body/MD)      | 16px Regular (Body/LG)      | 16px Regular (Body/LG)      |
| Hint/status font     | 12px Regular (Body/XS)      | 12px Regular (Body/XS)      | 12px Regular (Body/XS)      |
| Focus ring outset    | 4px total (2px each side)   | 4px total (2px each side)   | 4px total (2px each side)   |
| Token (ring outset)  | `input/focus/ring/outset`   | `input/focus/ring/outset`   | `input/focus/ring/outset`   |

---

## 7. Token Reference

All tokens belong to `Venus_Components` unless marked `[Semantics]`. CSS custom property format: replace `/` with `-`, prefix with `--`. Example: `input/background/default` → `--input-background-default`.

### Colour tokens

| Layer / purpose              | Token name                    | State(s)                        |
|------------------------------|-------------------------------|----------------------------------|
| Trigger fill                 | `input/background/default`    | Default, Hover, Active, Filled   |
| Trigger fill                 | `input/background/readonly`   | Readonly                         |
| Trigger fill                 | `input/background/disabled`   | Disabled                         |
| Trigger border               | `input/border/default`        | Default, Filled                  |
| Trigger border               | `input/border/hover`          | Hover                            |
| Trigger border               | `input/border/focused`        | Active (2px)                     |
| Trigger border               | `input/border/error`          | Error                            |
| Trigger border               | `input/border/warning`        | Warning                          |
| Trigger border               | `input/border/success`        | Success                          |
| Trigger border               | `input/border/disabled`       | Disabled                         |
| Trigger border               | `input/border/readonly`       | Readonly                         |
| Focus ring + focus border    | `border/focus` [Semantics]    | Focused (all focusable states)   |
| Placeholder text             | `input/text/placeholder`      | Default (no value)               |
| Value text                   | `input/text/value`            | Filled, Active                   |
| Value text (disabled)        | `input/text/disabled`         | Disabled                         |
| Value text (readonly)        | `input/text/readonly`         | Readonly                         |
| Label text                   | `input/label/default`         | All                              |
| Qualifier "(Required)" text  | `input/label/qualifier`       | All                              |
| Hint text                    | `input/hint/default`          | Default, Hover, Active, Filled   |
| Status message text          | `input/hint/error`            | Error                            |
| Status message text          | `input/hint/warning`          | Warning                          |
| Status message text          | `input/hint/success`          | Success                          |
| Leading icon fill            | `input/icon/leading`          | Enabled states                   |
| Trailing icon fill           | `input/icon/trailing`         | Enabled states                   |
| Trailing icon fill           | `input/icon/trailing/error`   | Error                            |
| Trailing icon fill           | `input/icon/trailing/warning` | Warning                          |
| Trailing icon fill           | `input/icon/trailing/success` | Success                          |
| Layer opacity (disabled)     | `visibility/disabled` [Semantics] | Disabled (0.40)              |

### Structural tokens

| Property             | Token name                        |
|----------------------|-----------------------------------|
| Trigger height       | `input/md/height` · `input/lg/height` · `input/xl/height` |
| Padding horizontal   | `input/md/padding/horizontal` · `input/lg/padding/horizontal` · `input/xl/padding/horizontal` |
| Icon–text gap        | `input/md/gap` · `input/lg/gap` · `input/xl/gap` |
| Border radius        | `input/md/radius` · `input/lg/radius` · `input/xl/radius` |
| Border width default | `input/border/width/default`      |
| Border width active  | `input/border/width/active`       |
| Focus ring width     | `input/focus/ring/width`          |
| Focus ring outset    | `input/focus/ring/outset`         |
| Icon size            | `input/md/icon/size` · `input/lg/icon/size` · `input/xl/icon/size` |
| Label–trigger gap    | `input/label/gap`                 |
| Below-field gap      | `input/below/gap`                 |

---

## 8. Accessibility

### ARIA roles and attributes

```html
<!-- Standard usage -->
<label for="input-id">Label <span>(Required)</span></label>
<div role="group" class="input-trigger">
  <input
    id="input-id"
    type="text"
    aria-required="true"
    aria-describedby="input-hint input-status"
    placeholder="Placeholder text"
  />
</div>
<p id="input-hint">Helper text</p>
<p id="input-status" role="alert" aria-live="polite"><!-- status message --></p>

<!-- Error state -->
<input aria-invalid="true" aria-describedby="input-status" />
<p id="input-status" role="alert">This field has an error</p>

<!-- Disabled -->
<input disabled aria-disabled="true" />

<!-- Readonly -->
<input readOnly aria-readonly="true" />

<!-- No visible label (aria-label required) -->
<input aria-label="Search entries" />
```

### Keyboard behaviour

| Key        | Behaviour                                       |
|------------|-------------------------------------------------|
| `Tab`      | Moves focus to input                            |
| `Shift+Tab`| Moves focus away from input                     |
| Any key    | Enters text (standard browser behaviour)        |
| `Escape`   | Does not clear value (use explicit clear button)|

### Contrast ratios (WCAG 2.2 AA)

| Pair                              | Ratio  | Pass/Fail  |
|-----------------------------------|--------|------------|
| Value text on white bg            | ~14:1  | ✅ AAA     |
| Placeholder on white bg           | ~2.5:1 | ✅ exempt (placeholder is supplementary) |
| Label text on white bg            | ~9:1   | ✅ AAA     |
| Error border on white bg          | ~4.9:1 | ✅ AA      |
| Warning border on white bg        | ~4.7:1 | ✅ AA      |
| Success border on white bg        | ~4.5:1 | ✅ AA      |
| Focus ring purple on white bg     | ~4.86:1| ✅ AA      |
| Disabled at 40% opacity           | exempt | ✅ WCAG 1.4.3 |

### Touch targets

- Trigger height: md=32px, lg=40px, xl=52px — all above 24px minimum ✅
- Icon tap areas: md=16px icons inside 32px trigger — target is the full trigger ✅

---

## 9. Storybook Stories

```typescript
// input.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { SearchIcon, AlertCircleIcon, CheckCircleIcon } from '@contentstack/icons';

const meta: Meta<typeof Input> = {
  title: 'Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['md', 'lg', 'xl'] },
    hasError: { control: 'boolean' },
    hasWarning: { control: 'boolean' },
    hasSuccess: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    hasLeadingIcon: { control: 'boolean' },
    hasTrailingIcon: { control: 'boolean' },
    hasLabel: { control: 'boolean' },
    hasLabelIcon: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    hasHintText: { control: 'boolean' },
    hasStatusMessage: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

// ── Core stories ─────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 'lg',
    label: 'Field label',
    placeholder: 'Enter a value',
    hintText: 'Helper text for this field',
    hasHintText: true,
    hasLabel: true,
  },
};

export const Filled: Story = {
  args: {
    ...Default.args,
    value: 'my-content-type-uid',
  },
};

export const WithLeadingIcon: Story = {
  args: {
    ...Default.args,
    hasLeadingIcon: true,
    leadingIcon: <SearchIcon />,
    placeholder: 'Search entries...',
  },
};

export const WithTrailingIcon: Story = {
  args: {
    ...Default.args,
    hasTrailingIcon: true,
    trailingIcon: <AlertCircleIcon />,
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
    value: 'invalid-uid!!',
    hasError: true,
    hasStatusMessage: true,
    statusMessage: 'UIDs can only contain lowercase letters, numbers, and hyphens.',
  },
};

export const Warning: Story = {
  args: {
    ...Default.args,
    value: 'my-uid',
    hasWarning: true,
    hasStatusMessage: true,
    statusMessage: 'This UID already exists in another content type.',
  },
};

export const Success: Story = {
  args: {
    ...Default.args,
    value: 'article-body',
    hasSuccess: true,
    hasStatusMessage: true,
    statusMessage: 'UID is available.',
  },
};

// ── Interaction states ────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    ...Default.args,
    value: 'inherited-value',
    disabled: true,
    hintText: 'This field is managed by the parent content type.',
  },
};

export const Readonly: Story = {
  args: {
    ...Default.args,
    value: 'auto-generated-uid-abc123',
    readOnly: true,
    hintText: 'Auto-generated. Cannot be edited after creation.',
  },
};

export const Focused: Story = {
  // Use the hasFocus=true Figma variant in the Figma file for design reference.
  // In Storybook, simulate focus state via autoFocus for demo purposes.
  args: {
    ...Default.args,
    autoFocus: true,
  },
};

// ── Size variants ─────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Input size="md" label="Compact (md — 32px)" placeholder="Sidebar, dense forms" hintText="Used in sidebar panels and compact toolbars" />
      <Input size="lg" label="Default (lg — 40px)" placeholder="Main body forms" hintText="System default — use in dialogs and primary forms" />
      <Input size="xl" label="Large (xl — 52px)" placeholder="Hero, onboarding" hintText="Used in onboarding flows and empty states" />
    </div>
  ),
};

// ── Combinations ──────────────────────────────────────────────────────────────

export const WithAllOptionalElements: Story = {
  args: {
    size: 'lg',
    label: 'Content type UID',
    hasLabelIcon: true,
    labelIcon: <AlertCircleIcon />,
    isRequired: true,
    hasLeadingIcon: true,
    leadingIcon: <SearchIcon />,
    hasTrailingIcon: true,
    trailingIcon: <AlertCircleIcon />,
    placeholder: 'e.g. article',
    value: '',
    hasHintText: true,
    hintText: 'Used as a unique identifier. Cannot be changed after creation.',
  },
};

export const ErrorWithIcon: Story = {
  args: {
    size: 'lg',
    label: 'Email address',
    isRequired: true,
    value: 'not-an-email',
    hasError: true,
    hasTrailingIcon: true,
    trailingIcon: <AlertCircleIcon />,
    hasStatusMessage: true,
    statusMessage: 'Please enter a valid email address.',
  },
};

// ── Form row context ──────────────────────────────────────────────────────────

export const AsFormRow: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <Input size="lg" label="Display name" isRequired placeholder="e.g. Article" hintText="The human-readable name shown in the UI." />
      <Input size="lg" label="UID" isRequired placeholder="e.g. article" hintText="Auto-populated from display name. Editable." />
      <Input size="lg" label="Description" placeholder="Describe this content type..." hasHintText={false} />
    </form>
  ),
};

// ── Dark mode ─────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  args: { ...Default.args },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark', // Contentstack Storybook theme toggle
  },
};

export const DarkModeError: Story = {
  args: { ...Error.args },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

// ── Edge cases ────────────────────────────────────────────────────────────────

export const LongLabel: Story = {
  args: {
    ...Default.args,
    label: 'This is an unusually long field label that should truncate gracefully',
    isRequired: true,
    hasLabelIcon: true,
  },
};

export const LongValue: Story = {
  args: {
    ...Default.args,
    value: 'https://cdn.contentstack.com/v3/assets/blt1234567890abcdef/bltabcdef1234567890/some-very-long-asset-path.jpg',
  },
};

export const NoLabel: Story = {
  args: {
    hasLabel: false,
    placeholder: 'Search…',
    'aria-label': 'Search entries',
    hasHintText: false,
    hasLeadingIcon: true,
    leadingIcon: <SearchIcon />,
  },
};
```

---

## 10. Implementation Notes

### CSS custom properties

Map tokens to CSS variables in your token pipeline. Convention: `input/background/default` → `--input-background-default`.

```css
.input-trigger {
  background-color: var(--input-background-default);
  border: var(--input-border-width-default) solid var(--input-border-default);
  border-radius: var(--input-md-radius); /* swap per size */
  padding-left: var(--input-md-padding-horizontal); /* swap per size */
  padding-right: var(--input-md-padding-horizontal);
  height: var(--input-md-height); /* swap per size */
  gap: var(--input-md-gap);

  /* Focus ring — outer */
  position: relative;
  outline: none; /* suppress default */
}

.input-trigger:hover {
  border-color: var(--input-border-hover);
}

.input-trigger:focus-within {
  border-width: var(--input-border-width-active);
  border-color: var(--input-border-focused);
  /* Focus ring rendered via ::after pseudo or sibling overlay */
}

/* Focus ring outer — 2px outside trigger */
.input-trigger::after {
  content: '';
  position: absolute;
  inset: calc(-1 * var(--input-focus-ring-width) - 2px); /* 2px offset */
  border: var(--input-focus-ring-width) solid var(--border-focus);
  border-radius: calc(var(--input-md-radius) + 2px);
  pointer-events: none;
  opacity: 0;
}

.input-trigger:focus-within::after {
  opacity: 1;
}

/* Error state */
.input-trigger[data-state="error"] {
  border-color: var(--input-border-error);
  border-width: var(--input-border-width-active);
  /* No inner focus-border in error state — only outer focus-ring */
}
```

### Dark mode

Dark mode is activated by adding a `data-theme="dark"` attribute to the `<html>` or a parent container. All `Venus_Semantics` tokens switch automatically via CSS custom property overrides — no component-level changes needed.

```css
[data-theme="dark"] {
  --input-background-default: /* surface/raised dark value */;
  --input-border-default: /* border/default dark value */;
  /* etc. — generated by Style Dictionary from Venus_Semantics Dark mode */
}
```

### Controlled vs uncontrolled

Always implement as a **controlled component** in Storybook stories. Contentstack forms use controlled patterns throughout.

```typescript
// Controlled (correct)
const [value, setValue] = useState('');
<Input value={value} onChange={e => setValue(e.target.value)} />

// Uncontrolled (acceptable for simple demos only)
<Input defaultValue="initial" />
```

### Status state priority

Only one status can be active at a time. Priority order when multiple are set: `hasError` > `hasWarning` > `hasSuccess`. Implement this in the component:

```typescript
const status = hasError ? 'error' : hasWarning ? 'warning' : hasSuccess ? 'success' : 'default';
```

### Readonly "(Read Only)" qualifier

The Readonly state always renders "(Read Only)" in the label row regardless of the `isRequired` prop. This is baked visual behaviour, not a toggleable property.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .input-trigger::after,
  .input-trigger::before {
    transition: none;
  }
}
```

### Form row consistency rule

Every component in the same horizontal form row must use the same size tier. A `lg` Input (40px) must sit alongside a `lg` Select (40px) and a `lg` Button (40px). Never mix sizes within a row.

---

## 11. Do / Don't

| ✅ Do                                                                 | ❌ Don't                                                               |
|----------------------------------------------------------------------|------------------------------------------------------------------------|
| Use `lg` as the default size in main body forms and dialogs          | Mix `md` and `lg` inputs in the same horizontal form row               |
| Always associate a `<label>` with the input via `htmlFor` / `id`     | Rely on `placeholder` as a substitute for a visible label              |
| Provide `statusMessage` whenever `hasError`, `hasWarning`, or `hasSuccess` is set | Apply error state without an error message — color alone is insufficient |
| Use `readOnly` for auto-generated or system-managed values           | Use `disabled` when the field is merely non-editable — `readOnly` is semantically correct |
| Use `md` size in sidebar panels and compact toolbars                 | Use `xl` in dense forms — it is for hero, onboarding, and empty state contexts only |
| Pass `aria-label` when `hasLabel=false`                              | Hide the label without providing an alternative accessible name        |
| Apply `isRequired` and the native `required` attribute together      | Mark a field required visually without also setting `required` on the `<input>` |
| Use the trailing icon for contextual status indicators (error, clear)| Use the trailing icon for navigation or primary actions                |

---

## 12. Related Components

| Component  | Relationship          | When to use instead of Input                                               |
|------------|-----------------------|----------------------------------------------------------------------------|
| `Textarea`  | Sibling (multi-line)  | When the user needs to enter more than one line of text                    |
| `Select`    | Sibling (predefined)  | When options are known and finite — free text is not needed                |
| `Slider`    | Sibling (range input) | When the value must stay within a numeric range and a visual track helps   |
| `Checkbox`  | Complementary         | For boolean fields within a form that contains Inputs                      |
| `Button`    | Complementary         | Paired with Input in search bars and inline edit patterns                  |

---

*Brief generated: 2026-06-01 · Venus 2.1 RF v2.1.0 · Figma node 702:58081*
