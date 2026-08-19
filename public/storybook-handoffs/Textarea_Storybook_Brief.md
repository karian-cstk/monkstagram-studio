# Textarea — Storybook Engineering Brief
**Venus 2.1 RF · Contentstack Design System**
Figma node: `700:56263` · Version: 2.1.0 · Last updated: 2026-06-01

---

## 1. Purpose

`Textarea` is the multi-line text entry control for Contentstack CMS forms. It captures descriptions, body copy, JSON snippets, notes, and any content requiring more than one line. Three height tiers (compact / tall / freesize) cover everything from metadata panels to full editorial body fields.

**Use when:** the user needs to enter more than one line of text, or when the expected input length is unpredictable.

**Do not use when:**
- A single line is sufficient → use `Input`
- The user must select from predefined options → use `Select`
- The field requires rich text formatting → use a rich text editor component (not yet in Venus 2.1 RF)

**Alternatives:** `Input` (single line), `Select` (predefined choices).

---

## 2. Anatomy

```
┌─────────────────────────────────────────────────────┐
│ label-text                    [Label Icon] (optional)│  ← Label Row
│ (Required) qualifier          [Spacer]               │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│ Placeholder text / Value text         [Trailing Icon]│  ← Trigger (the <textarea> container)
│                                                      │
│                                                      │
│                                       [Scrollbar]    │  ← ABSOLUTE, inside right edge
│                                       [Resize Handle]│  ← ABSOLUTE, bottom-right corner
│                                    [focus-ring]      │  ← ABSOLUTE, outside trigger
│                                    [focus-border]    │  ← ABSOLUTE, inside trigger
└─────────────────────────────────────────────────────┘
  Character count (right-aligned)                       ← Character Count row (hasCharacterCount)
  [✕] Status message text                               ← Below Field / status-text
  Helper text                                           ← Below Field / hint-text
```

| Figma layer          | DOM element / role           | Notes                                              |
|----------------------|------------------------------|----------------------------------------------------|
| `Label Row`          | `<label>` wrapper            | Hidden when `hasLabel=false`                       |
| `label-text`         | `<label>` text               | Associates via `htmlFor` / `id`                    |
| `qualifier-text`     | `<span>` beside label        | "(Required)" — shown when `isRequired=true`        |
| `Label Icon`         | `<span>` info icon           | Shown when `hasLabelIcon=true`                     |
| `Trigger`            | `<div>` wrapping `<textarea>`| Handles border, padding, overflow                  |
| `Content Row`        | flex container inside Trigger | Holds input-text + Trailing Icon                  |
| `input-text`         | `<textarea>`                 | The actual textarea element                        |
| `Trailing Icon`      | `<span>` inside trigger      | Top-right aligned; shown via `hasTrailingIcon`     |
| `Scrollbar`          | Custom scrollbar instance    | ABSOLUTE, right edge; shown via `hasScrollbar`     |
| `Resize Handle`      | `<span>` resize grip         | ABSOLUTE, bottom-right; shown via `isResizable`    |
| `focus-ring`         | `::after` / overlay          | ABSOLUTE, outside trigger, focus-driven            |
| `focus-border`       | `::before` / overlay         | ABSOLUTE, inside trigger, Default/Hover/Filled     |
| `Character Count`    | `<p>` right-aligned          | Shown via `hasCharacterCount`                      |
| `Below Field`        | `<div>` below trigger        | Contains status-text + hint-text                   |
| `status-text`        | `<p role="alert">`           | Shown via `hasStatusMessage`                       |
| `hint-text`          | `<p>` helper text            | Shown via `hasHintText`                            |

---

## 3. TypeScript Props Interface

```typescript
export interface TextareaProps {
  // ── Height tier ───────────────────────────────────────────────────────
  /**
   * Height behaviour of the textarea.
   * - compact: fixed 80px (3 rows × 21px line-height + 16px padding). Scrolls on overflow.
   * - tall: fixed 208px (8 rows × 24px line-height + 16px padding). Scrolls on overflow.
   * - freesize: unconstrained height; user can drag to resize. Code: resize:vertical.
   * Default: tall
   */
  height?: 'compact' | 'tall' | 'freesize';

  // ── State ──────────────────────────────────────────────────────────────
  /** Disables the textarea. Applies 0.40 layer opacity. */
  disabled?: boolean;
  /** Makes the textarea non-editable. Sets readOnly attribute. */
  readOnly?: boolean;
  /** Applies error visual treatment. Requires statusMessage. */
  hasError?: boolean;
  /** Applies warning visual treatment. Requires statusMessage. */
  hasWarning?: boolean;
  /** Applies success visual treatment. Requires statusMessage. */
  hasSuccess?: boolean;

  // ── Label ─────────────────────────────────────────────────────────────
  /** Hides the label row. Provide aria-label when false. */
  hasLabel?: boolean;
  /** Label text. */
  label?: string;
  /** Shows an info icon at the right end of the label row. */
  hasLabelIcon?: boolean;
  /** Info icon component beside the label. */
  labelIcon?: React.ReactNode;
  /** Shows "(Required)" qualifier beside the label. */
  isRequired?: boolean;

  // ── Icon ──────────────────────────────────────────────────────────────
  /** Shows a trailing icon inside the trigger, top-right. */
  hasTrailingIcon?: boolean;
  /** Trailing icon component. */
  trailingIcon?: React.ReactNode;

  // ── Content ───────────────────────────────────────────────────────────
  /** Placeholder text shown when value is empty and textarea is unfocused. */
  placeholder?: string;
  /** Current value (controlled). */
  value?: string;
  /** Change handler for controlled usage. */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  // ── Below field ───────────────────────────────────────────────────────
  /** Shows hint text below the trigger. Default: true. */
  hasHintText?: boolean;
  /** Hint text content. */
  hintText?: string;
  /** Shows status message below the trigger. */
  hasStatusMessage?: boolean;
  /** Status message text for error/warning/success states. */
  statusMessage?: string;
  /**
   * Shows a character count below the trigger (right-aligned).
   * Format: "currentLength / maxLength".
   * Changes colour to text/destructive when limit is reached (textarea/character-count/limit).
   */
  hasCharacterCount?: boolean;
  /** Maximum character count. Required when hasCharacterCount=true. */
  maxLength?: number;

  // ── Behaviour ─────────────────────────────────────────────────────────
  /**
   * Shows the resize handle in the bottom-right corner. Default: true.
   * Only functional when height="freesize". Shown in all heights for design parity
   * but only affects layout in freesize.
   */
  isResizable?: boolean;
  /**
   * Shows a custom scrollbar on the right edge of the trigger.
   * Default: false. Enable when the textarea is fixed-height and content may overflow.
   */
  hasScrollbar?: boolean;

  // ── HTML passthrough ─────────────────────────────────────────────────
  /** Textarea id. Auto-generated if not provided. */
  id?: string;
  /** Textarea name for form submission. */
  name?: string;
  /** ARIA label when hasLabel=false. */
  'aria-label'?: string;
  /** Additional class names for the root wrapper. */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma property         | Figma type     | React prop          | React type                         | Notes                                              |
|------------------------|----------------|---------------------|------------------------------------|----------------------------------------------------|
| `Height`               | Variant        | `height`            | `'compact' \| 'tall' \| 'freesize'`| Default: `'tall'`                                  |
| `State=Default`        | Variant        | —                   | CSS default                        | Base state                                         |
| `State=Hover`          | Variant        | —                   | CSS `:hover`                       | Never a prop                                       |
| `State=Active`         | Variant        | —                   | CSS `:focus-within`                | Focused state                                      |
| `State=Filled`         | Variant        | `value !== ''`      | Derived                            | No explicit prop                                   |
| `State=Error`          | Variant        | `hasError`          | `boolean`                          |                                                    |
| `State=Warning`        | Variant        | `hasWarning`        | `boolean`                          |                                                    |
| `State=Success`        | Variant        | `hasSuccess`        | `boolean`                          |                                                    |
| `State=Disabled`       | Variant        | `disabled`          | `boolean`                          |                                                    |
| `State=Readonly`       | Variant        | `readOnly`          | `boolean`                          |                                                    |
| `hasFocus`             | Boolean        | —                   | CSS `:focus-visible`               | Storybook demo only                                |
| `hasTrailingIcon`      | Boolean        | `hasTrailingIcon`   | `boolean`                          | Default: `false`                                   |
| `hasLabel`             | Boolean        | `hasLabel`          | `boolean`                          | Default: `true`                                    |
| `hasLabelIcon`         | Boolean        | `hasLabelIcon`      | `boolean`                          | Default: `false`                                   |
| `isRequired`           | Boolean        | `isRequired`        | `boolean`                          | Default: `false`                                   |
| `hasHintText`          | Boolean        | `hasHintText`       | `boolean`                          | Default: `true`                                    |
| `hasStatusMessage`     | Boolean        | `hasStatusMessage`  | `boolean`                          | Default: `false`                                   |
| `hasCharacterCount`    | Boolean        | `hasCharacterCount` | `boolean`                          | Default: `false`                                   |
| `isResizable`          | Boolean        | `isResizable`       | `boolean`                          | Default: `true`                                    |
| `hasScrollbar`         | Boolean        | `hasScrollbar`      | `boolean`                          | Default: `false`                                   |
| `label`                | Text           | `label`             | `string`                           |                                                    |
| `placeholder`          | Text           | `placeholder`       | `string`                           |                                                    |
| `value`                | Text           | `value`             | `string`                           | Controlled                                         |
| `hintText`             | Text           | `hintText`          | `string`                           |                                                    |
| `statusMessage`        | Text           | `statusMessage`     | `string`                           |                                                    |
| `characterCount`       | Text           | Derived from value  | Internal                           | Rendered as `${value.length} / ${maxLength}`       |

---

## 5. State Behaviour

| State    | Trigger                          | Visual changes                                                    | Token(s) changed                                           | ARIA change                                  |
|----------|----------------------------------|-------------------------------------------------------------------|------------------------------------------------------------|----------------------------------------------|
| Default  | Initial render                   | White bg, 1px gray border, placeholder text                       | `input/background/default`, `input/border/default`         | —                                            |
| Hover    | Mouse enters trigger             | Purple 1px border                                                 | `input/border/hover`                                       | —                                            |
| Active   | Textarea receives focus          | 2px purple border + focus-ring outside                            | `input/border/focused` (2px)                               | —                                            |
| Filled   | Value is non-empty               | Same as Default; value text in `text/default`                     | `input/text/value`                                         | —                                            |
| Error    | `hasError=true`                  | 2px red border, status icon + message below, focus-ring only      | `input/border/error`                                       | `aria-invalid="true"`, `role="alert"`        |
| Warning  | `hasWarning=true`                | 2px yellow border, warning message below                          | `input/border/warning`                                     | `aria-describedby` → status node             |
| Success  | `hasSuccess=true`                | 2px green border, success message below                           | `input/border/success`                                     | `aria-describedby` → status node             |
| Disabled | `disabled=true`                  | Full component at 0.40 opacity, `not-allowed` cursor              | `visibility/disabled` (layer opacity)                      | `aria-disabled="true"`, `disabled`           |
| Readonly | `readOnly=true`                  | Gray sunken bg, near-invisible border, "(Read Only)" in label row | `input/background/readonly`, `input/border/readonly`       | `aria-readonly="true"`, `readOnly`           |

### Focus ring behaviour (two-layer system)
- **`focus-ring`** (outer): 2px `border/focus` (purple/500), 2px outside the trigger. Active in all focusable states except Disabled/Readonly.
- **`focus-border`** (inner): 2px `border/focus`, inside the trigger. Present only in Default, Hover, Filled states. Suppressed in Error/Warning/Success to preserve status border.
- Active state: `focus-ring` only — the 2px focused border on the trigger IS the inner focus indicator. A separate `focus-border` frame would create a double border.

### Character count colour change
When `value.length >= maxLength`, the character count text switches from `textarea/character-count/default` (text/muted, gray) to `textarea/character-count/limit` (text/destructive, red). This is the only visual feedback for reaching the limit. Optionally also set `aria-live="polite"` on the character count element.

---

## 6. Height Specification

| Property                  | compact                              | tall                                 | freesize                          |
|---------------------------|--------------------------------------|--------------------------------------|-----------------------------------|
| Trigger height            | 80px fixed                           | 208px fixed                          | Unconstrained (user-resizable)    |
| Token (height)            | `textarea/compact/height`            | `textarea/tall/height`               | None — CSS `height: auto`         |
| Calculation               | 3 rows × 21px + 16px padding         | 8 rows × 24px + 16px padding         | N/A                               |
| Overflow behaviour        | `overflow-y: scroll` (scrolls)       | `overflow-y: scroll` (scrolls)       | `resize: vertical` (user drags)   |
| Padding top / bottom      | 8px                                  | 8px                                  | 8px                               |
| Padding left / right      | 12px                                 | 16px                                 | 20px                              |
| Token (padding H)         | `input/md/padding/horizontal`        | `input/lg/padding/horizontal`        | `input/xl/padding/horizontal`     |
| Border radius             | 4px                                  | 4px                                  | 8px                               |
| Token (radius)            | `input/md/radius`                    | `input/lg/radius`                    | `input/xl/radius`                 |
| Label font size           | 12px Medium (Label/MD)               | 13px Medium (Label/LG)               | 14px Medium (Label/XL)            |
| Value/placeholder         | 14px Regular (Body/MD)               | 16px Regular (Body/LG)               | 16px Regular (Body/LG)            |
| Line height (value)       | 150% (21px per row)                  | 150% (24px per row)                  | 150%                              |
| Trailing icon size        | 16px                                 | 20px                                 | 24px                              |
| Token (icon size)         | `input/md/icon/size`                 | `input/lg/icon/size`                 | `input/xl/icon/size`              |
| Focus ring outset         | 4px total (2px each side)            | 4px total (2px each side)            | 4px total (2px each side)         |

**Usage context:**
- `compact` (80px) — metadata panels, table cells, sidebar annotations, any dense container
- `tall` (208px) — primary editorial fields, descriptions, body copy — **system default**
- `freesize` — advanced editor surfaces where the user controls layout

---

## 7. Token Reference

All tokens in `Venus_Components` unless marked `[Semantics]`. CSS custom property: replace `/` with `-`, prefix with `--`.

### Colour tokens

| Layer / purpose              | Token name                    | State(s)                                |
|------------------------------|-------------------------------|------------------------------------------|
| Trigger fill                 | `input/background/default`    | Default, Hover, Active, Filled           |
| Trigger fill                 | `input/background/readonly`   | Readonly                                 |
| Trigger fill                 | `input/background/disabled`   | Disabled                                 |
| Trigger border               | `input/border/default`        | Default, Filled                          |
| Trigger border               | `input/border/hover`          | Hover                                    |
| Trigger border               | `input/border/focused`        | Active (2px)                             |
| Trigger border               | `input/border/error`          | Error                                    |
| Trigger border               | `input/border/warning`        | Warning                                  |
| Trigger border               | `input/border/success`        | Success                                  |
| Trigger border               | `input/border/disabled`       | Disabled                                 |
| Trigger border               | `input/border/readonly`       | Readonly                                 |
| Focus ring + focus border    | `border/focus` [Semantics]    | Focused                                  |
| Placeholder text             | `input/text/placeholder`      | Default (no value)                       |
| Value text                   | `input/text/value`            | Filled, Active                           |
| Value text (disabled)        | `input/text/disabled`         | Disabled                                 |
| Value text (readonly)        | `input/text/readonly`         | Readonly                                 |
| Label text                   | `input/label/default`         | All                                      |
| Qualifier "(Required)" text  | `input/label/qualifier`       | All                                      |
| Hint text                    | `input/hint/default`          | Non-status states                        |
| Status message text          | `input/hint/error`            | Error                                    |
| Status message text          | `input/hint/warning`          | Warning                                  |
| Status message text          | `input/hint/success`          | Success                                  |
| Trailing icon                | `input/icon/trailing`         | Enabled states                           |
| Character count (default)    | `textarea/character-count/default` | Below limit                         |
| Character count (at limit)   | `textarea/character-count/limit`   | At or over maxLength                |
| Resize handle                | `textarea/resize-handle/color`| All (when isResizable=true)              |
| Scrollbar track              | `scrollbar/track/default`     | Default                                  |
| Scrollbar track (hover)      | `scrollbar/track/hover`       | Hover                                    |
| Scrollbar thumb              | `scrollbar/thumb/default`     | Default                                  |
| Scrollbar thumb (hover)      | `scrollbar/thumb/hover`       | Hover                                    |
| Scrollbar thumb (active)     | `scrollbar/thumb/active`      | Dragging                                 |
| Layer opacity (disabled)     | `visibility/disabled` [Semantics] | Disabled (0.40)                     |

### Structural tokens

| Property              | Token name                                                      |
|-----------------------|-----------------------------------------------------------------|
| Trigger height (fixed)| `textarea/compact/height` · `textarea/tall/height`             |
| Padding horizontal    | `input/md/padding/horizontal` · `input/lg/padding/horizontal` · `input/xl/padding/horizontal` |
| Border radius         | `input/md/radius` · `input/lg/radius` · `input/xl/radius`     |
| Border width default  | `input/border/width/default`                                    |
| Border width active   | `input/border/width/active`                                     |
| Focus ring width      | `input/focus/ring/width`                                        |
| Focus ring outset     | `input/focus/ring/outset`                                       |
| Icon size             | `input/md/icon/size` · `input/lg/icon/size` · `input/xl/icon/size` |
| Scrollbar width       | `scrollbar/sm/width` (8px) · `scrollbar/md/width`              |
| Scrollbar radius      | `scrollbar/sm/radius` · `scrollbar/md/radius`                  |
| Scrollbar thumb min   | `scrollbar/thumb/min-length`                                    |

---

## 8. Accessibility

### ARIA roles and attributes

```html
<!-- Standard usage -->
<label for="textarea-id">
  Label <span class="qualifier">(Required)</span>
</label>
<div class="textarea-trigger">
  <textarea
    id="textarea-id"
    aria-required="true"
    aria-describedby="textarea-hint textarea-status"
    placeholder="Placeholder text"
    rows="3"
  ></textarea>
</div>
<p id="textarea-hint">Helper text</p>
<p id="textarea-status" role="alert" aria-live="polite"></p>

<!-- Error state -->
<textarea aria-invalid="true" aria-describedby="textarea-status"></textarea>
<p id="textarea-status" role="alert">This field is required.</p>

<!-- Character count -->
<p aria-live="polite" aria-atomic="true">
  <span class="char-count">42 / 500</span>
</p>
```

### Keyboard behaviour

| Key            | Behaviour                                              |
|----------------|--------------------------------------------------------|
| `Tab`          | Moves focus to textarea                                |
| `Shift+Tab`    | Moves focus away                                       |
| All printable  | Enters text (standard browser behaviour)               |
| `Enter`        | Inserts newline — does NOT submit the form             |

### Contrast ratios (WCAG 2.2 AA)

| Pair                              | Ratio   | Pass/Fail  |
|-----------------------------------|---------|------------|
| Value text on white bg            | ~14:1   | ✅ AAA     |
| Label text on white bg            | ~9:1    | ✅ AAA     |
| Error border on white bg          | ~4.9:1  | ✅ AA      |
| Warning border on white bg        | ~4.7:1  | ✅ AA      |
| Success border on white bg        | ~4.5:1  | ✅ AA      |
| Focus ring on white bg            | ~4.86:1 | ✅ AA      |
| Scrollbar thumb on white bg       | ~4.6:1  | ✅ AA      |
| Disabled at 40% opacity           | exempt  | ✅ WCAG 1.4.3 |

---

## 9. Storybook Stories

```typescript
// textarea.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';
import { AlertCircleIcon } from '@contentstack/icons';

const meta: Meta<typeof Textarea> = {
  title: 'Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'select', options: ['compact', 'tall', 'freesize'] },
    hasError: { control: 'boolean' },
    hasWarning: { control: 'boolean' },
    hasSuccess: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    hasTrailingIcon: { control: 'boolean' },
    hasLabel: { control: 'boolean' },
    hasLabelIcon: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    hasHintText: { control: 'boolean' },
    hasStatusMessage: { control: 'boolean' },
    hasCharacterCount: { control: 'boolean' },
    isResizable: { control: 'boolean' },
    hasScrollbar: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

// ── Core stories ─────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    height: 'tall',
    label: 'Description',
    placeholder: 'Enter a description…',
    hintText: 'A short description shown in the content list.',
    hasHintText: true,
    isResizable: true,
  },
};

export const Filled: Story = {
  args: {
    ...Default.args,
    value: 'This content type stores blog articles including title, body copy, featured image, and publication metadata.',
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    isRequired: true,
  },
};

export const WithCharacterCount: Story = {
  args: {
    ...Default.args,
    hasCharacterCount: true,
    maxLength: 500,
    value: 'This content type stores blog articles.',
    hintText: 'Maximum 500 characters.',
  },
};

export const CharacterLimitReached: Story = {
  args: {
    ...WithCharacterCount.args,
    value: 'A'.repeat(500),
  },
};

// ── Status states ─────────────────────────────────────────────────────────────

export const Error: Story = {
  args: {
    ...Default.args,
    hasError: true,
    hasStatusMessage: true,
    statusMessage: 'Description is required and must be at least 10 characters.',
    value: 'Too short',
  },
};

export const Warning: Story = {
  args: {
    ...Filled.args,
    hasWarning: true,
    hasStatusMessage: true,
    statusMessage: 'Description exceeds the recommended length for content previews.',
  },
};

export const Success: Story = {
  args: {
    ...Filled.args,
    hasSuccess: true,
    hasStatusMessage: true,
    statusMessage: 'Description looks good.',
  },
};

// ── Interaction states ────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    ...Filled.args,
    disabled: true,
    hintText: 'This description is inherited and cannot be edited.',
  },
};

export const Readonly: Story = {
  args: {
    ...Filled.args,
    readOnly: true,
    hintText: 'System-generated description. Contact an admin to update.',
  },
};

// ── Height variants ───────────────────────────────────────────────────────────

export const AllHeights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Textarea
        height="compact"
        label="Compact (80px — 3 rows)"
        placeholder="Sidebar notes, metadata annotations"
        hintText="Use in dense containers: sidebar panels, table cells."
        isResizable={false}
      />
      <Textarea
        height="tall"
        label="Tall (208px — 8 rows)"
        placeholder="Main body descriptions, article summaries"
        hintText="System default — use for primary editorial fields."
      />
      <Textarea
        height="freesize"
        label="Freesize (drag to resize)"
        placeholder="Advanced editor, JSON snippets, custom content"
        hintText="User controls the height. Drag the resize handle."
      />
    </div>
  ),
};

// ── Combinations ──────────────────────────────────────────────────────────────

export const WithAllOptionalElements: Story = {
  args: {
    height: 'tall',
    label: 'Body copy',
    hasLabelIcon: true,
    labelIcon: <AlertCircleIcon />,
    isRequired: true,
    hasTrailingIcon: true,
    trailingIcon: <AlertCircleIcon />,
    placeholder: 'Enter the article body…',
    hasHintText: true,
    hintText: 'Markdown is supported.',
    hasCharacterCount: true,
    maxLength: 5000,
    isResizable: true,
    hasScrollbar: true,
  },
};

// ── Form row context ──────────────────────────────────────────────────────────

export const AsFormRow: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
      <Textarea
        height="tall"
        label="Description"
        isRequired
        placeholder="Enter a short description…"
        hintText="Shown in the entry list. Keep under 150 characters."
        hasCharacterCount
        maxLength={150}
      />
      <Textarea
        height="compact"
        label="Notes"
        placeholder="Internal notes for the editorial team…"
        hasHintText={false}
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

export const DarkModeError: Story = {
  args: { ...Error.args },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

// ── Edge cases ────────────────────────────────────────────────────────────────

export const LongPlaceholder: Story = {
  args: {
    ...Default.args,
    placeholder: 'Enter a detailed description including the content type purpose, the fields it contains, and any usage guidelines for your editorial team.',
  },
};

export const WithScrollbar: Story = {
  args: {
    height: 'compact',
    label: 'JSON override',
    value: '{\n  "key": "value",\n  "nested": {\n    "a": 1,\n    "b": 2,\n    "c": 3\n  },\n  "array": [1, 2, 3, 4, 5]\n}',
    hasScrollbar: true,
    isResizable: false,
    hintText: 'Raw JSON configuration. Overrides default settings.',
  },
};

export const NoLabel: Story = {
  args: {
    hasLabel: false,
    'aria-label': 'Entry notes',
    placeholder: 'Add notes…',
    hasHintText: false,
    height: 'compact',
  },
};
```

---

## 10. Implementation Notes

### CSS custom properties

```css
.textarea-trigger {
  background-color: var(--input-background-default);
  border: var(--input-border-width-default) solid var(--input-border-default);
  border-radius: var(--input-md-radius); /* swap per height */
  padding: 8px var(--input-md-padding-horizontal); /* swap per height */
  position: relative;
  overflow: hidden; /* clip scrollbar */
}

.textarea-trigger:hover:not(:has(textarea:disabled)) {
  border-color: var(--input-border-hover);
}

.textarea-trigger:focus-within:not(:has(textarea:disabled)) {
  border-width: var(--input-border-width-active);
  border-color: var(--input-border-focused);
}

/* Focus ring */
.textarea-trigger::after {
  content: '';
  position: absolute;
  inset: calc(-1 * var(--input-focus-ring-width) - 2px);
  border: var(--input-focus-ring-width) solid var(--border-focus);
  border-radius: calc(var(--input-md-radius) + 2px);
  pointer-events: none;
  opacity: 0;
}
.textarea-trigger:focus-within::after { opacity: 1; }

/* Height tiers */
.textarea-trigger[data-height="compact"] textarea {
  height: var(--textarea-compact-height);
  overflow-y: scroll;
  resize: none;
}
.textarea-trigger[data-height="tall"] textarea {
  height: var(--textarea-tall-height);
  overflow-y: scroll;
  resize: none;
}
.textarea-trigger[data-height="freesize"] textarea {
  height: auto;
  min-height: var(--textarea-compact-height);
  resize: vertical;
}

/* Custom scrollbar */
.textarea-trigger[data-scrollbar="true"] textarea::-webkit-scrollbar {
  width: var(--scrollbar-sm-width);
}
.textarea-trigger[data-scrollbar="true"] textarea::-webkit-scrollbar-track {
  background: var(--scrollbar-track-default);
  border-radius: var(--scrollbar-sm-radius);
}
.textarea-trigger[data-scrollbar="true"] textarea::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb-default);
  border-radius: var(--scrollbar-sm-radius);
  min-height: var(--scrollbar-thumb-min-length);
}
```

### Resize handle

The native browser resize handle is overridden by the `Resize Handle` element — a custom icon instance positioned absolutely at the bottom-right corner of the trigger. Set `resize: none` on the `<textarea>` when `isResizable=false`. When `isResizable=true` and `height=freesize`, allow both the custom handle and native resize to work.

### Character count tracking

```typescript
const charCount = value?.length ?? 0;
const isAtLimit = maxLength !== undefined && charCount >= maxLength;
// Apply textarea/character-count/limit token when isAtLimit=true
```

### Dark mode

Same pattern as Input — tokens switch automatically via `[data-theme="dark"]`. No component changes needed.

### Status state priority

`hasError` > `hasWarning` > `hasSuccess`. Apply exactly one status at a time.

### `Enter` key behaviour

`Enter` inside a `<textarea>` inserts a newline. It must NOT trigger form submission. Ensure the surrounding form's submit is on a `<button type="submit">`, not on `Enter` alone.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .textarea-trigger::after,
  .textarea-trigger::before { transition: none; }
}
```

---

## 11. Do / Don't

| ✅ Do                                                                    | ❌ Don't                                                                  |
|-------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Use `tall` as the default height for primary editorial fields           | Default to `compact` for body content — it is too small for meaningful text |
| Use `compact` in sidebar panels, table cells, and dense annotation areas| Use `compact` in main form layouts where users write more than 2–3 sentences |
| Use `freesize` when the user should control the canvas height           | Use `freesize` in modal dialogs where height overflow is a problem         |
| Show character count whenever there is a meaningful limit               | Set `hasCharacterCount=true` without providing `maxLength`                |
| Always provide `statusMessage` when setting error/warning/success       | Apply status state without a message — color alone fails accessibility    |
| Use `readOnly` for system-generated or inherited content                | Use `disabled` for content the user just cannot currently edit            |
| Allow `isResizable=true` by default on `freesize` height                | Force a fixed height on `freesize` — it defeats the purpose               |
| Set `aria-label` when `hasLabel=false`                                  | Render a textarea with no accessible name                                 |

---

## 12. Related Components

| Component  | Relationship           | When to use instead of Textarea                                           |
|------------|------------------------|---------------------------------------------------------------------------|
| `Input`     | Sibling (single-line)  | When a single line of text is sufficient                                  |
| `Select`    | Sibling (predefined)   | When options are enumerated — free text is not needed                     |
| `Slider`    | Sibling (range)        | When the value is numeric and bounded                                     |
| Rich Text   | Enhancement            | When markdown/HTML formatting is required (not yet in Venus 2.1 RF)       |

---

*Brief generated: 2026-06-01 · Venus 2.1 RF v2.1.0 · Figma node 700:56263*
