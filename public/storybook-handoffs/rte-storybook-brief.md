# Rich Text Editor — Storybook Brief
**Component:** Rich Text Editor  
**Node:** `929:24878`  
**Page:** 📝 Inputs  
**Status:** Active v2.1.0  
**Date:** 2026-07-06

---

## 1. Purpose

Rich Text Editor (RTE) is the primary long-form content authoring control for CMS content fields. It combines a formatting toolbar with a freesize textarea inside a single shared outer border — presenting as one unified editing surface. It is used wherever structured rich text is required: entry body fields, description fields, blog content, marketing copy, and any multi-format text field.

The RTE is a composition, not a monolith. The toolbar is `_Internal/RTE-Toolbar` (slot-based, wraps Icon Buttons). The content area is a `Textarea` atom with its border suppressed. The outer wrapper provides the shared border and focus ring. This architecture allows the toolbar to be customised per context without rebuilding the component.

---

## 2. Anatomy

```
[rte-root]                          — auto-layout column
  [rte-label-row]                   — label + optional required indicator
    [rte-label]                     — TEXT, label property
    [rte-required-indicator]        — TEXT "(Required)", visible via isRequired
  [rte-outer-wrapper]               — auto-layout column, surface/raised fill, border/default 1px OUTSIDE
    [rte-toolbar]                   — _Internal/RTE-Toolbar instance
      [toolbarButtons]              — SLOT — 11 × Icon Button/Ghost/lg
    [rte-toolbar-separator]         — 1px FRAME, border/default fill
    [rte-textarea]                  — Textarea atom (border suppressed)
  [rte-focus-ring]                  — absolute FRAME, border/focus stroke, wired to hasFocus
  [rte-counter-row]                 — character count row, visible via hasCharacterCount
    [rte-character-count]           — TEXT, characterCount property
  [rte-status-message]              — Status Message atom, visible via hasStatusMessage
  [rte-hint-text]                   — Hint Text atom, visible via hasHintText
```

**Toolbar:** Always visible across all states. Disabled via `visibility/disabled` opacity on the root in Disabled state — never hidden.  
**Textarea border:** Suppressed on the Textarea atom. The outer wrapper owns the single shared border.  
**Focus ring:** On `rte-outer-wrapper`, not on the Textarea. 2px `border/focus` stroke, absolute positioning, wired to `hasFocus` boolean.

---

## 3. TypeScript Props Interface

```typescript
interface RichTextEditorProps {
  /** Interaction state */
  state?: 'default' | 'disabled' | 'readonly' | 'error' | 'filled';
  /** Show field label */
  hasLabel?: boolean;
  /** Label text */
  label?: string;
  /** Show required indicator */
  isRequired?: boolean;
  /** Show label icon */
  hasLabelIcon?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Show character count */
  hasCharacterCount?: boolean;
  /** Character count display string */
  characterCount?: string;
  /** Show status message (validation) */
  hasStatusMessage?: boolean;
  /** Status message text */
  statusMessage?: string;
  /** Show hint text */
  hasHintText?: boolean;
  /** Hint text content */
  hintText?: string;
  /** Show formatting toolbar */
  hasToolbar?: boolean;
  /** Allow vertical resize */
  isResizable?: boolean;
  /** Show expand button in toolbar */
  canExpand?: boolean;
  /** Focus ring visible */
  hasFocus?: boolean;
  /** Current HTML/markdown content */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Custom toolbar slot — overrides default Icon Buttons */
  toolbarSlot?: React.ReactNode;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `State` (VARIANT) | `state` | Default / Disabled / Readonly / Error / Filled |
| `hasLabel` (BOOLEAN) | `hasLabel` | Default: true |
| `isRequired` (BOOLEAN) | `isRequired` | Shows "(Required)" text |
| `hasLabelIcon` (BOOLEAN) | `hasLabelIcon` | Default: false |
| `hasCharacterCount` (BOOLEAN) | `hasCharacterCount` | Default: false |
| `hasStatusMessage` (BOOLEAN) | `hasStatusMessage` | Default: false |
| `hasHintText` (BOOLEAN) | `hasHintText` | Default: false |
| `hasToolbar` (BOOLEAN) | `hasToolbar` | Default: true |
| `isResizable` (BOOLEAN) | `isResizable` | Default: true |
| `canExpand` (BOOLEAN) | `canExpand` | Shows expand button |
| `hasFocus` (BOOLEAN) | `hasFocus` | Default: false |
| `label` (TEXT) | `label` | Field label string |
| `placeholder` (TEXT) | `placeholder` | Textarea placeholder |
| `hintText` (TEXT) | `hintText` | Hint text content |
| `statusMessage` (TEXT) | `statusMessage` | Validation message |
| `characterCount` (TEXT) | `characterCount` | e.g. "247 / 500" |
| `toolbarSlot` (SLOT) | `toolbarSlot` | Custom toolbar override |

---

## 5. State Behaviour

| State | Outer border | Toolbar | Textarea | Focus ring |
|---|---|---|---|---|
| Default | `border/default` | Active | Editable | `hasFocus` controls |
| Disabled | `border/default` | Opacity 0.40 | Opacity 0.40 | Never visible |
| Readonly | `border/default` | Opacity 0.40 (toolbar) | `State=Readonly` | `hasFocus` controls |
| Error | `feedback/error/border` | Active | `State=Error` | `hasFocus` controls |
| Filled | `border/default` | Active | `State=Filled` | `hasFocus` controls |

**Disabled:** `visibility/disabled` (0.40) applied to `rte-root`. Entire component — toolbar + textarea — becomes non-interactive simultaneously. Focus ring never shown in Disabled state.

**Readonly:** Toolbar opacity 0.40 only — toolbar is visually muted but the structure remains. Textarea switches to `State=Readonly` internally (thumb inactive, no cursor). Content is selectable and copyable.

**Error:** Outer border switches to `feedback/error/border` (red/700). Status message should always be visible in Error state — set `hasStatusMessage=true` with an actionable message.

---

## 6. Size Specification

RTE is a single-size component. Width is designer/consumer-set (default 740px). Height HUGs to content.

| Layer | Dimension | Notes |
|---|---|---|
| Toolbar height | 48px | Fixed — 40px Icon Buttons + 4px padding each side |
| Toolbar separator | 1px | `border/default` fill |
| Textarea min height | 320px | freesize — grows with content |
| Focus ring offset | 2px outside outer wrapper | absolute, -2/-2 position |
| Label text style | Label/LG | 13px Inter Medium |
| Counter text style | Body/XS | 12px |
| Status message | via Status Message atom | Body/XS |
| Hint text | via Hint Text atom | Body/XS |

**Resize:** When `isResizable=true`, a resize handle (bottom-right) allows vertical drag to expand the textarea. Width is always fixed by the consumer.

---

## 7. Token Reference

Zero Venus_Components tokens. All bindings direct to Venus_Semantics.

| Layer | Token |
|---|---|
| `rte-outer-wrapper` fill | `surface/raised` |
| `rte-outer-wrapper` stroke | `border/default` |
| `rte-outer-wrapper` stroke (Error) | `feedback/error/border` |
| `rte-toolbar-separator` fill | `border/default` |
| `rte-focus-ring` stroke | `border/focus` |
| `rte-root` opacity (Disabled) | `visibility/disabled` (0.40) |
| Toolbar surface | `surface/highlight/subtle` (via `_Internal/RTE-Toolbar`) |
| Toolbar Icon Buttons | `Icon Button/Ghost/lg` — `icon/color` default mode |
| Textarea surface | `surface/default` (via Textarea atom) |

**`border/focus` vs `focus/ring/color`:** RTE uses `border/focus` for its rectangular outer wrapper ring — consistent with Input, Select, and Textarea. `focus/ring/color` is used for circular/thumb rings (Slider thumb, Button). Both alias `purple/500` — functionally identical, semantically distinct.

**Toolbar tokens:** `surface/highlight/subtle`, `surface/highlight`, `surface/highlight/strong` are three approved Venus_Semantics tokens created specifically for the RTE toolbar surface hierarchy.

---

## 8. Accessibility

- Outer wrapper: `role="group"`, `aria-labelledby` pointing to the label element
- Textarea: `role="textbox"`, `aria-multiline="true"`, `aria-label` or `aria-labelledby`
- `aria-required={isRequired}` on the textarea
- `aria-disabled={state === 'disabled'}` on outer wrapper and textarea
- `aria-readonly={state === 'readonly'}` on textarea
- `aria-describedby` pointing to hint text and/or status message when visible
- Error state: `aria-invalid="true"` on textarea, `role="alert"` on status message
- Toolbar: `role="toolbar"`, `aria-label="Text formatting"`, `aria-controls` pointing to textarea id
- Each toolbar Icon Button: `aria-label` set via `accessibleLabel` prop (Bold, Italic, etc.)
- Keyboard — toolbar: `Tab` enters toolbar; `ArrowLeft`/`ArrowRight` moves between buttons; `Tab` exits to textarea
- Character count: `aria-live="polite"` — announces count on pause after typing
- Focus management: clicking toolbar button applies formatting and returns focus to textarea

---

## 9. Storybook Stories

```typescript
// Default
export const Default: Story = {
  args: { state: 'default', label: 'Body content', placeholder: 'Start writing...' }
};

// With all optional fields
export const Full: Story = {
  args: {
    state: 'default',
    label: 'Body content',
    isRequired: true,
    hasHintText: true,
    hintText: 'Supports bold, italic, links, and lists.',
    hasCharacterCount: true,
    characterCount: '0 / 2000',
    placeholder: 'Start writing...'
  }
};

// Error state
export const Error: Story = {
  args: {
    state: 'error',
    label: 'Body content',
    hasStatusMessage: true,
    statusMessage: 'Content is required.',
    isRequired: true
  }
};

// Filled state
export const Filled: Story = {
  args: {
    state: 'filled',
    label: 'Body content',
    hasCharacterCount: true,
    characterCount: '247 / 2000',
    value: '<p>The quick brown fox jumps over the lazy dog.</p>'
  }
};

// Disabled
export const Disabled: Story = {
  args: { state: 'disabled', label: 'Body content', hasHintText: true, hintText: 'Editing is disabled.' }
};

// Readonly
export const Readonly: Story = {
  args: { state: 'readonly', label: 'Body content', value: '<p>Published content. Read only.</p>' }
};

// Without toolbar
export const NoToolbar: Story = {
  args: { state: 'default', label: 'Notes', hasToolbar: false, placeholder: 'Add notes...' }
};

// All states
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {(['default', 'error', 'filled', 'disabled', 'readonly'] as const).map(state => (
        <RichTextEditor key={state} state={state} label={`State: ${state}`} />
      ))}
    </div>
  )
};
```

---

## 10. Implementation Notes

**Toolbar slot architecture:** The toolbar is a SLOT in Figma — in React, use `toolbarSlot` prop to inject custom toolbar content. The default 11 Icon Buttons (Bold, Italic, Strikethrough, Insert link, Bullet list, Numbered list, Heading, Blockquote, Undo, Redo, Expand) are the default slot content. Consumers can override with a subset or custom toolbar.

**Toolbar Icon Button migration:** All 11 toolbar buttons were migrated from `Button/Ghost/lg` to `Icon Button/Ghost/lg` on 2026-07-06. The RTE CSET inherited this migration automatically via the `_Internal/RTE-Toolbar` nested instance — no direct RTE edits were required.

**Border suppression on Textarea:** The Textarea atom's own border is suppressed inside the RTE — the outer wrapper owns the single shared border. In React, pass a `suppressBorder` or `variant="embedded"` prop to Textarea to disable its own border rendering.

**WYSIWYG vs markdown:** The Figma component is agnostic to the underlying editor implementation (Tiptap, Quill, Slate, ProseMirror, etc.). The toolbar slot architecture supports any editor library — the Icon Buttons trigger editor commands, the content area renders the editor's DOM.

**Character count:** The `characterCount` prop is a pre-formatted string (e.g. "247 / 2000"). The component does not compute it — the consumer counts characters from `value` and passes the formatted string. This keeps the component implementation-agnostic.

**Expand button:** `canExpand=true` shows a fullscreen/expand Icon Button at the trailing end of the toolbar. This button triggers a modal or drawer with a larger editing surface — the modal is not part of this component.

**Manual Figma steps outstanding:** (1) Toolbar SLOT conversion in Figma UI; (2) Icon Button `leadingIcon` swaps per button (Bold, Italic etc.) require manual swap in Figma UI — API limitation on INSTANCE_SWAP preferred values.

---

## 11. Do / Don't

**Do:**
- Use for long-form rich text content fields in CMS entry forms
- Always show a status message in Error state — never error state alone
- Implement `aria-live="polite"` on character count
- Return focus to textarea after toolbar button activation

**Don't:**
- Don't use RTE for short single-line text — use Input
- Don't use RTE for plain unformatted text — use Textarea
- Don't hide the toolbar in the Disabled state — mute it with opacity
- Don't suppress the label unless space is genuinely unavailable and `aria-label` is provided on the textarea

---

## 12. Related Components

| Component | Relationship |
|---|---|
| `_Internal/RTE-Toolbar` | Internal toolbar atom — slot-based, wraps Icon Buttons |
| Textarea | Content area atom — embedded with border suppressed |
| Input | Single-line sibling — use for short text fields |
| `Icon Button` | Toolbar action buttons — Ghost/lg, 11 per default toolbar |
| Status Message | Validation feedback atom — shown below RTE in Error state |
| Hint Text | Guidance atom — shown below RTE in all non-error states |
| Modal | Expand target — fullscreen editing surface triggered by canExpand |
