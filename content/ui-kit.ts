export type UIKitComponent = {
  slug: string;
  name: string;
  category: string;
  status: "Stable" | "Beta" | "Deprecated";
  description: string;
  rationale: string;
  variants: string[];
  /** Full component-level documentation, verbatim from the Figma component's
   * own description field (via get_design_context) — always shown inline on
   * the page, below the live preview. Separate from `handoffFile`, which is
   * the Storybook handoff doc. */
  documentation: string;
  handoffFile: string;
};

// Real components scouted from the Venus 2.1 RF Figma file. The four
// mocked-up placeholders (Button, Data Table, Command Palette, Toast) that
// used to live here have been removed — none of them came from the actual
// file.
export const uiKitComponents: UIKitComponent[] = [
  {
    slug: "input",
    name: "Input",
    category: "Inputs",
    status: "Stable",
    description:
      "Single-line text input for form data entry. Supports leading and trailing icons, label, required qualifier, hint text, and status messages for all validation states.",
    rationale:
      "27 variants (9 states × 3 sizes) share one token set — input/background, input/border, input/text, input/hint — so a form never mixes two different conventions for what red or a disabled field means.",
    variants: [
      "Default",
      "Hover",
      "Active",
      "Filled",
      "Error",
      "Warning",
      "Success",
      "Disabled",
      "Readonly",
    ],
    documentation: `**Version:** 2.1.0 · **Status:** Active · **Last updated:** 2026-06-01 · **Page:** 📝 Inputs

Single-line text input for form data entry. Supports leading and trailing icons, label, required qualifier, hint text, and status messages for all validation states.

### Variants

27 variants: 9 states × 3 sizes.

- **States:** Default, Hover, Active, Filled, Error, Warning, Success, Disabled, Readonly
- **Sizes:** md (32px) · lg (40px) · xl (52px)

### Properties

- \`hasFocus\` (boolean, default \`false\`) — shows focus-ring + focus-border
- \`hasLeadingIcon\` (boolean, default \`false\`) — shows a leading icon in the trigger
- \`hasTrailingIcon\` (boolean, default \`false\`) — shows a trailing icon in the trigger
- \`hasLabel\` (boolean, default \`true\`) — shows the label row above the trigger
- \`hasLabelIcon\` (boolean, default \`false\`) — shows an icon beside the label text
- \`isRequired\` (boolean, default \`false\`) — shows a "(Required)" qualifier in the label row
- \`hasHintText\` (boolean, default \`true\`) — shows hint text below the trigger
- \`hasStatusMessage\` (boolean, default \`false\`) — shows a status icon + message below the trigger
- \`label\`, \`placeholder\`, \`value\`, \`hintText\`, \`statusMessage\` — text props
- \`State\`, \`Size\` — variant props

### Focus architecture

All states show focus-ring (outside, 2px) + focus-border (inside, 2px) together on \`hasFocus=true\`, except:

- **Error / Warning / Success** — focus-ring only (the status border is preserved; the inner focus-border is suppressed)
- **Active** — focus-ring only (the 2px brand border is always shown; an inner focus-border would be redundant)
- **Disabled / Readonly** — \`hasFocus\` is inert; no focus ring is shown regardless of the property value

### Readonly behavior

The Readonly state always shows a "(Read Only)" qualifier in the label row — this is baked into the variant, not controlled by \`isRequired\`.

### Below-field architecture

- **Default / Hover / Active / Filled:** wired to \`hasHintText\`, visible by default
- **Error / Warning / Success:** wired to \`hasStatusMessage\` (icon + message); hint text is independently controlled by \`hasHintText\` within the same container
- **Disabled / Readonly:** wired to \`hasHintText\`, visible by default

### Token bindings

\`Venus_Components → Venus_Semantics → _Primitives\`

- Trigger fill: \`input/background/*\` → \`surface/raised\` | \`surface/sunken\`
- Trigger stroke: \`input/border/*\` → \`border/default\` | \`border/brand\` | \`border/focus\` | \`border/destructive\` | \`border/warning\` | \`border/success\` | \`border/disabled\` | \`border/subtle\`
- Trigger radius: \`input/md|lg|xl/radius\` → \`radius/4\` | \`radius/8\`
- Input text fill: \`input/text/*\` → \`text/default\` | \`text/placeholder\` | \`text/subtle\` | \`text/disabled\`
- Hint/status fill: \`input/hint/*\` → \`text/subtle\` | \`text/destructive\` | \`text/warning\` | \`text/success\`
- Focus ring stroke: \`border/focus\` → \`purple/500\` (Light) | \`purple/400\` (Dark)
- Disabled opacity: \`visibility/disabled\` → \`0.40\`

### Dark mode

Component tokens use identical semantic aliases in Light and Dark modes. Mode switching is handled by \`Venus_Semantics\` — component tokens are stable semantic pointers, not mode re-expressors (IBM Carbon pattern).

**Related components:** Select, Button, Hint Text, Status Message`,
    handoffFile: "/storybook-handoffs/Input_Storybook_Brief.md",
  },
  {
    slug: "select",
    name: "Select",
    category: "Inputs",
    status: "Stable",
    description:
      "Select field component. Allows users to choose a single option from a dropdown list. Prefer over radio buttons when there are 5+ options; use Input when free-text entry is needed.",
    rationale:
      "Shares its token architecture with Input (surface/*, border/*, text/*) so the two controls read as one family, while three real differences are called out explicitly: no Hover state, a double disabled treatment (fill + opacity), and no forced \"(Read Only)\" qualifier.",
    variants: [
      "Default",
      "Active",
      "Open",
      "Filled",
      "Error",
      "Warning",
      "Success",
      "Disabled",
      "Readonly",
    ],
    documentation: `**Version:** 2.1.0 · **Status:** Active · **Last updated:** 2026-06-01 · **Page:** 📝 Inputs

Select field component. Allows users to choose a single option from a dropdown list. Use on forms where the option set is predefined and finite. Prefer over radio buttons when there are 5+ options. Use Input when free-text entry is needed.

### Variants

27 variants: 9 states × 3 sizes.

- **States:** Default, Active, Open, Filled, Error, Warning, Success, Disabled, Readonly
- **Sizes:** md (32px trigger) · lg (40px trigger) · xl (52px trigger)
- **Note:** no Hover state variant — hover affordance is handled via \`hasFocus\` + focus-border, not a separate state.

### Properties (14)

- \`isOpen\` (boolean, default \`false\`) — design-time toggle showing the Open state
- \`hasLeadingIcon\` (boolean, default \`false\`) — optional leading icon in the trigger
- \`hasLabel\` (boolean, default \`true\`) — label row visibility
- \`hasLabelIcon\` (boolean, default \`false\`) — informationCircle icon beside the label
- \`isRequired\` (boolean, default \`false\`) — shows a "(Required)" qualifier
- \`hasFocus\` (boolean, default \`false\`) — shows focus-ring + focus-border
- \`hasHintText\` (boolean, default \`true\`) — hint text below the trigger
- \`hasStatusMessage\` (boolean, default \`false\`) — status icon + message below the trigger
- \`label\`, \`placeholder\`, \`hintText\`, \`statusMessage\` — text props
- \`selectLeadingIcon\`, \`selectChevron\` — instance-swap icon props
- \`State\`, \`Size\` — variant props

### Focus architecture

- **Default / Filled / Active:** \`hasFocus=true\` → focus-border (inside, 2px) + focus-ring (outside, 2px) simultaneously
- **Open / Error / Warning / Success:** \`hasFocus=true\` → focus-ring only (the status/open border is preserved; the inner focus-border is suppressed)
- **Disabled / Readonly:** \`hasFocus\` is inert

### Differences from Input / Textarea

Layer naming differs: Label Row uses "Label"/"Required" (not "label-text"/"qualifier-text"), the trigger's text layer is "Value" (not "input-text"), and the chevron is a dedicated instance — none of which matches Input's or Textarea's internal naming.

### Disabled state — double treatment

Disabled uses \`surface/disabled\` fill **and** \`visibility/disabled\` (0.40) opacity together — intentionally, so Select reads visibly darker-disabled than Input at a glance, rather than relying on opacity alone.

### Known issue (documented in Figma, not reproduced in the current resolved tokens)

The component description carries this note verbatim: *"Status text in Warning/Success states renders red (text/destructive) — root cause in the shared Status Message atom, not in Select tokens. Separate investigation pending."* Pulling the actual resolved values for this file's Warning/Success nodes shows correct amber/teal text, so this appears to be a stale note from a since-fixed bug — flagged here rather than silently dropped, since it's still literally what Figma says.

### Token architecture

\`Venus_Components → Venus_Semantics → _Primitives\`

- Trigger fill: \`select/background/*\` → \`surface/raised\` | \`surface/disabled\` | \`surface/sunken\`
- Trigger stroke: \`select/border/*\` → \`border/default\` | \`border/brand\` | \`border/focused\` | \`border/destructive\` | \`border/warning\` | \`border/success\` | \`border/disabled\` | \`border/subtle\`
- Trigger height/padding/gap/radius/stroke-weight: \`select/md|lg|xl/*\` — fully bound per size
- Focus ring stroke: \`border/focus\` → \`purple/500\` (Light) | \`purple/400\` (Dark)
- Disabled opacity: \`visibility/disabled\` → \`0.40\`
- Icon fills: \`icon/color\` via \`Venus_Icons\` mode

**Related components:** Input, Textarea, Combobox`,
    handoffFile: "/storybook-handoffs/select-storybook-brief.md",
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "Inputs",
    status: "Stable",
    description:
      "Multi-line text input field with three height variants (compact, tall, freesize), a resize handle, optional character count, and the same validation states as Input.",
    rationale:
      "Shares Input's exact token set (input/background, input/border, input/text, input/hint) so switching a field between single-line and multi-line never changes what a color means — only the height variant changes.",
    variants: [
      "Default",
      "Hover",
      "Active",
      "Filled",
      "Error",
      "Warning",
      "Success",
      "Disabled",
      "Readonly",
    ],
    documentation: `**Version:** 2.1.0 · **Status:** Active · **Last updated:** 2026-06-01 · **Page:** 📝 Inputs

Multi-line text input field. Three height variants based on font line-height × rows.

### Heights

- **compact** — 3 rows × 21px (14px Body/MD × 150%) + 16px padding = 80px, fixed, scrolls on overflow. Dense containers: metadata panels, table cells, sidebar fields.
- **tall** — 8 rows × 24px (16px Body/LG × 150%) + 16px padding = 208px, fixed. Main CMS editorial fields: body copy, descriptions.
- **freesize** — no fixed height; the trigger hugs content and the designer stretches it. Code: \`resize: vertical\`, no height constraints.

27 variants total: 9 states × 3 heights.

- **States:** Default, Hover, Active, Filled, Error, Warning, Success, Disabled, Readonly

### Properties (16)

- \`State\`, \`Height\` (compact / tall / freesize, default \`tall\`) — variant props
- \`hasFocus\` (boolean, default \`false\`) — shows/hides the focus ring on any state
- \`hasTrailingIcon\` (boolean, default \`false\`) — icon top-right of the trigger
- \`hasLabel\` (boolean, default \`true\`) — label row visibility
- \`hasLabelIcon\` (boolean, default \`false\`) — informationCircle icon right of the label
- \`isRequired\` (boolean, default \`false\`) — shows "(Required)" qualifier
- \`hasHintText\` (boolean, default \`true\`) — helper text below the field
- \`hasStatusMessage\` (boolean, default \`false\`) — validation message below the field
- \`hasCharacterCount\` (boolean, default \`false\`) — character count, right-aligned below the field
- \`isResizable\` (boolean, default \`true\`) — shows/hides the resize handle (bottom-right corner)
- \`hasScrollbar\` (boolean, default \`false\`) — shows/hides a vertical scrollbar (right edge)
- \`label\`, \`placeholder\`, \`value\`, \`hintText\`, \`statusMessage\`, \`characterCount\` — text props

### Focus architecture

- **Group A — Default / Hover / Filled:** \`hasFocus=true\` → 2px focus-border inside + 2px focus-ring outside
- **Group B — Error / Warning / Success:** \`hasFocus=true\` → focus-ring only; the status border is unchanged
- **Active:** \`hasFocus=true\` → focus-ring only. The trigger stroke is always 2px \`border/focused\` in the Active state — an inner focus-border is intentionally absent (it would create a double border); the always-on 2px border already provides focus affordance
- **Group C — Disabled / Readonly:** \`hasFocus\` is inert

### Readonly behavior

Readonly always shows a "(Read Only)" qualifier in the label row, same as Input.

### Height & auxiliary tokens

- \`textarea/compact/height\` (80px) · \`textarea/tall/height\` (208px)
- Character count: \`textarea/character-count/default\` (text/muted) · \`textarea/character-count/limit\` (text/destructive, once over the limit)
- Resize handle: \`textarea/resize-handle/color\` (icon/subtle)

**Related components:** Input, Select, Scrollbar Vertical, Hint Text, Status Message`,
    handoffFile: "/storybook-handoffs/Textarea_Storybook_Brief.md",
  },
  {
    slug: "rich-text-editor",
    name: "Rich Text Editor",
    category: "Inputs",
    status: "Stable",
    description:
      "Rich text editor for long-form CMS content fields — a formatting toolbar (bold, italic, strikethrough, link, lists, heading, blockquote, undo/redo, expand) composed over a Textarea atom with its own border suppressed.",
    rationale:
      "Interactive states (Hover, Active, Error) are deliberately not separate RTE variants — they're inherited from the nested Textarea instance, so the editor never drifts from the plain-text field's validation behavior.",
    variants: ["Default", "Filled", "Disabled", "Readonly"],
    documentation: `**Version:** 2.1.0 · **Status:** Active · **Last updated:** 2026-06-09 · **Page:** 📝 Inputs

Rich text editor for long-form CMS content fields. Composed of: \`_Internal/RTE-Toolbar\` atom (slot-based, wrap layout) + Textarea atom (border suppressed) inside one outer border.

### Variants

The component-level spec names 3 states (Default, Disabled, Readonly); a 4th, **Filled** (showing authored content before editing), also exists in the file as its own node — flagged here rather than silently reconciled, since the two disagree on the exact count.

All interactive states (Hover, Active, Error) are **not** separate RTE variants — they're handled entirely by the nested Textarea instance.

### Properties

- \`hasFocus\` (boolean) — focus ring outside the outer wrapper. Disabled never shows it.
- \`hasToolbar\` (boolean, default \`true\`) — the toolbar is always visible, never hidden; it's disabled via opacity only, never removed
- \`hasLabel\`, \`isRequired\` — label row + "(Required)" qualifier, same pattern as Input
- \`hasCharacterCount\`, \`hasHintText\`, \`hasStatusMessage\` — same Below-Field pattern as Textarea

### State-specific behavior

- **Disabled:** \`visibility/disabled\` (0.40 opacity) on the whole root — toolbar and text field dim together
- **Readonly:** \`visibility/disabled\` on the **toolbar only**; the text field itself switches to the Textarea atom's own Readonly state (surface/sunken fill), not just dimmed opacity — a real distinction from Disabled, not the same treatment applied selectively

### Structure

- Toolbar surface: \`surface/highlight/subtle\` (#f9fafb)
- Outer border: \`border/default\` 1px, outside the whole component
- Toolbar buttons (11): Bold, Italic, Strikethrough, Link, Bullet list, Numbered list, Heading, Blockquote, Undo, Redo, Expand — each a Ghost Icon Button, lg (40px)
- Toolbar wraps on narrow widths (wrap auto-layout, not a fixed row)

### Build notes (from the component description)

Two manual steps are called out directly in Figma's own spec, not something inferred: toolbar slot conversion in the UI, and swapping each button's leading icon to the correct Venus icon via Instance Swap — meaning this component isn't fully token-driven end-to-end yet.

**Related components:** Input, Select, Textarea, Scrollbar Vertical, Hint Text, Status Message, Icon Button`,
    handoffFile: "/storybook-handoffs/rte-storybook-brief.md",
  },
  {
    slug: "slider",
    name: "Slider",
    category: "Inputs",
    status: "Stable",
    description:
      "Selects a value or range from a continuous or discrete scale — 9 types (Continuous, three Discrete step counts, Range, three RangeDiscrete step counts, WithInput) × 6 states × 3 sizes.",
    rationale:
      "The only Input-family component with zero Venus_Components tokens by design — its semantics (action/primary, border/default, surface/control/inactive) aren't ambiguous enough to need a component-token layer, per the spec's own reasoning.",
    variants: ["Default", "Hover", "Active", "Focused", "Disabled", "Readonly"],
    documentation: `**Version:** 2.1.0 · **Status:** Active · **Last updated:** 2026-06-01 · **Page:** 📝 Inputs

Sliders allow users to select a value or range from a continuous or discrete scale. Use for settings where approximate values are acceptable (continuous), or when selecting from a defined number of steps (discrete). Use Range types for filter bounds or time windows. Use WithInput when precise numeric entry is required alongside the visual control.

### Sizes & types

- **Sizes:** md (16px thumb, 4px track) · lg (20px thumb, 4px track) · xl (24px thumb, 6px track)
- **Types:** Continuous · Discrete/3 · Discrete/5 · Discrete/10 · Range · RangeDiscrete/3 · RangeDiscrete/5 · RangeDiscrete/10 · WithInput
- **States:** Default, Hover, Active, Focused, Disabled, Readonly

### Boolean properties

- \`hasValueLabel\` — shows the current value above the thumb on interaction (default off; forced off on WithInput)
- \`hasMarkers\` — segment marker dots on Discrete types (default on)
- \`hasMarkerLabels\` — text labels at each segment position (default off, requires \`hasMarkers=true\`)
- \`hasLeadingIcon\` / \`hasTrailingIcon\` — icon slots before/after the track (context icons like volume, brightness)
- \`hasFocus\` — controls the thumb's focus ring visibility; set true for the Focused state

### Token architecture — a deliberate exception

Uses **zero** \`Venus_Components\` tokens by design — every binding goes straight to \`Venus_Semantics\`. The spec states this outright: slider semantics aren't ambiguous enough to need a component-token indirection layer, unlike Input/Select/Textarea.

### States, precisely

- **Disabled:** \`visibility/disabled\` (0.40) on the root, \`cursor: not-allowed\`, no hover response
- **Readonly:** value is submitted and visible but not editable — the thumb switches to \`surface/control/inactive\`, no interaction, opacity stays at 1 (not dimmed like Disabled)
- **Focused:** keyboard navigation active; thumb-only 2px ring in \`focus/ring/color\`, 2px offset

### Focus ring — an intentional token split

The thumb's focus ring uses \`focus/ring/color\`, **not** \`border/focus\` — a different token than Input/Select/Textarea use for their rectangular borders. Both alias the same \`purple/500\`, so they render identically; the split exists because \`focus/ring/color\` is reserved for circular/thumb indicators and \`border/focus\` for rectangular ones. Functionally identical, semantically separate.

### WithInput

Instances the actual Input component (node \`702:58081\`) with \`hasLabel=false\`, \`hasHintText=false\` — the numeric field beside the track is the same Input you see elsewhere in this kit, not a bespoke field.

### Accessibility

\`role="slider"\`, \`aria-valuemin\`/\`aria-valuemax\`/\`aria-valuenow\`/\`aria-valuetext\` on each thumb. Range types carry two thumbs labeled \`aria-label="minimum"\`/\`"maximum"\`.

### Known spec/code mismatch (flagged, not silently fixed)

The component description states "Track fill: action/primary," but the actual resolved node for Default (and Focused) uses \`action/secondary/hover\` (#ede9fe, a much lighter purple) for the filled portion of the track — verified directly against the node's code, not assumed. The thumb itself does use \`action/primary\`. Documented here as-is rather than guessing which one is the "real" intent.

### Engineering note from the spec

Marker labels in Figma use placeholder values (0, 50, 100). Segment count and marker labels must be replaced with dynamic scale values driven by real \`step\`/\`min\`/\`max\` props at implementation time — Figma only shows a representative count.

**Related components:** Input (for WithInput), Scrollbar Vertical, Scrollbar Horizontal`,
    handoffFile: "/storybook-handoffs/slider-storybook-brief.md",
  },
  {
    slug: "table-entry-list-v2",
    name: "Table / Entry List v2",
    category: "Data List",
    status: "Stable",
    description:
      "Slot-based data table container — drag in Header-Row, Data-Row, and Actions-Cell instances to build any table shape, with a frozen actions column and optional scrollbar tracks.",
    rationale:
      "Column widths, cell types (9 of them — Text, TextSubtext, Status, Number, Date, Link, Actions, Editable, TagSlot), and row content are all composed per-instance rather than baked into the container, so one table component covers every table in the product instead of a bespoke one per screen.",
    variants: ["Default density", "Compact density"],
    documentation: `**Version:** 1.0.0 · **Status:** Active · **Page:** 📊 Data List

Entry List v2 — slot-based architecture. Fully configurable columns for any table variation.

### Slots

- **header-row** — drag a Table/Header-Row instance in; set Header-Cell labels, sort, filter, and badge per column
- **data-rows** — drag Table/Data-Row instances in, as many as needed; drop Table/Data-Cell instances into each row's "cells" slot
- **action-cells** — drag Table/Actions-Cell instances in, one per row, matching the data-row count

### Properties

- \`hasActions\` — show/hide the frozen right actions column
- \`hasVerticalScroll\` / \`hasHorizontalScroll\` — show/hide scrollbar tracks
- \`hasCheckbox\` — **not** a prop on the container. Toggle it on each Table/Header-Row and Table/Data-Row instance individually — a slot-based limitation, not an oversight

### Column widths

Set per-cell by resizing each Table/Data-Cell instance's width, then set a matching width on the corresponding header cell. There's no shared grid-column config — widths are kept in sync by convention, not enforced structurally.

### Table/Data-Cell — 9 types

Text, TextSubtext, Status, Number, Date, Link, Actions, Editable, TagSlot. \`hasIcon\` (default false) adds an optional trailing 16px icon on Text/TextSubtext/Status/Link types — for copy/info/link actions on high-value data like API keys, UIDs, URLs.

TagSlot's \`cellSlot\` requires a **manual Figma UI step** to wire: select the cell-slot-content inside a Type=TagSlot variant, then link the main component to the \`cellSlot\` property via the right panel — this cannot be done through the API.

### Table/Header-Row & Table/Header-Cell

Two density variants (32px Default / 28px Compact) that must always match the parent table's density. Header-Cell has 7 real variants: Alignment (Left/Right/Checkbox) × Sort (None/Ascending/Descending) — Checkbox alignment has no sort, so it's 1 + 3 + 3. \`hasFilter\` shows a filter icon; \`hasBadge\` shows an active-filter-count Badge/Counter.

### Table/Data-Row — a real platform constraint, not a bug

\`selectionControl\` (instance-swap between Checkbox and Radio, both label-less) resolves to **one shared value across all 12 variants** of the component set — the master can't bake a different default per row state. Every variant defaults to Unchecked. To show an actually-selected row's control as checked, you override \`selectionControl\` on that specific *placed* instance — which the brief notes actually matches real engineering anyway (a row's \`isSelected\` CSS class and a checkbox's \`checked={row.id === selectedId}\` prop are already separate concerns).

States: Default, Hover, Selected, **Selected-Hover** (a newer addition closing the gap where "selected + hovered" needs to read differently from "selected alone"), Focused, Disabled.

### Table/Actions-Cell

Frozen right column. Edit and Delete icons are independently hideable via \`hasEditAction\`/\`hasDeleteAction\`; the overflow (⋯) menu trigger is always visible, not optional.

### Tokens

- Header fill: \`surface/table/header\` (#f9f8ff — a faint purple tint, not plain gray)
- Header border: \`border/table/header\` (2px bottom stroke)
- Row border: \`border/subtle\`
- Body text: \`text/default\` · Header text: \`text/table/header\`
- Frozen-column elevation: a dedicated \`Elevation/Frozen Column\` effect token (drop shadow, -6px x-offset, 12px blur) — not an ad hoc box-shadow

**Related components:** Table/Header-Row, Table/Header-Cell, Table/Data-Row, Table/Data-Cell, Table/Actions-Cell, Badge, Checkbox, Radio`,
    handoffFile: "/storybook-handoffs/Table/19-table-entry-list-v2-storybook-brief.md",
  },
];
