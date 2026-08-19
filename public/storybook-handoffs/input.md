# Input — Storybook Handoff

**Component:** Input · **Node ID:** 702:58081 · **Figma page:** 📝 Inputs
**Version:** 2.1.0 · **Status:** Active · **Last updated:** 2026-06-01

This documentation is pulled directly from the component's description field
in Figma (via Dev Mode / MCP), not hand-written.

## Summary

Single-line text input for form data entry. Supports leading and trailing
icons, label, required qualifier, hint text, and status messages for all
validation states.

## Variants

27 variants: 9 states × 3 sizes.

- **States:** Default, Hover, Active, Filled, Error, Warning, Success, Disabled, Readonly
- **Sizes:** md (32px) · lg (40px) · xl (52px)

## Properties

- `hasFocus` (boolean, default `false`) — shows focus-ring + focus-border
- `hasLeadingIcon` (boolean, default `false`) — shows leading icon in the trigger
- `hasTrailingIcon` (boolean, default `false`) — shows trailing icon in the trigger
- `hasLabel` (boolean, default `true`) — shows the label row above the trigger
- `hasLabelIcon` (boolean, default `false`) — shows an icon beside the label text
- `isRequired` (boolean, default `false`) — shows a "(Required)" qualifier in the label row
- `hasHintText` (boolean, default `true`) — shows hint text below the trigger
- `hasStatusMessage` (boolean, default `false`) — shows a status icon + message below the trigger
- `label` (text) — label copy
- `placeholder` (text) — placeholder copy shown in the Default state
- `value` (text) — value copy shown in Filled/Active/Error/Warning/Success/Readonly
- `hintText` (text) — helper copy below the trigger
- `statusMessage` (text) — validation message copy below the trigger
- `State` (variant) — component state
- `Size` (variant) — component size

## Focus architecture

All states show `focus-ring` (outside, 2px, `border/focus`) + `focus-border`
(inside, 2px, `border/focus`) simultaneously when `hasFocus=true`, **except**:

- **Error / Warning / Success** — focus-ring only (the status border is preserved; the inner focus-border is suppressed)
- **Active** — focus-ring only (the 2px brand border is always shown; an inner focus-border would be redundant)
- **Disabled / Readonly** — `hasFocus` is inert; no focus ring is shown regardless of the property value

Both `focus-ring` and `focus-border` are absolutely positioned, hidden by
default, and wired to the `hasFocus` boolean.

## Readonly behavior

The Readonly state always shows a "(Read Only)" qualifier in the label row.
This is **not** controlled by `isRequired` — it's baked into the Readonly
variant. `isRequired` is inert on Readonly.

## Below-field architecture

- **Default / Hover / Active / Filled:** Below Field is wired to `hasHintText`. Hint text is visible by default.
- **Error / Warning / Success:** Below Field is wired to `hasStatusMessage`. Status Message and Below Field share the same prop reference; Hint Text is independently controlled by `hasHintText` within the container.
- **Disabled / Readonly:** Below Field is wired to `hasHintText`. Hint text is visible by default.

## Token bindings

`Venus_Components → Venus_Semantics → _Primitives`

| Element | Component token | Semantic token |
|---|---|---|
| Trigger fill | `input/background/*` | `surface/raised` \| `surface/sunken` |
| Trigger stroke | `input/border/*` | `border/default` \| `border/brand` \| `border/focus` \| `border/destructive` \| `border/warning` \| `border/success` \| `border/disabled` \| `border/subtle` |
| Trigger stroke weight | `input/border/width/*` | `border-width/1` \| `border-width/2` |
| Trigger corner radius | `input/md\|lg\|xl/radius` | `radius/4` \| `radius/8` |
| Trigger padding | `input/md\|lg\|xl/padding/horizontal` | `space/12` \| `space/16` \| `space/20` |
| Input text fill | `input/text/*` | `text/default` \| `text/placeholder` \| `text/subtle` \| `text/disabled` |
| Label fill | `input/label/default` | `text/label` |
| Qualifier fill | `input/label/qualifier` | `text/subtle` |
| Hint/status fill | `input/hint/*` | `text/subtle` \| `text/destructive` \| `text/warning` \| `text/success` |
| Focus ring stroke | `border/focus` | `purple/500` (Light) \| `purple/400` (Dark) |
| Disabled opacity | `visibility/disabled` | `0.40` |

## Resolved values (Light mode, as designed)

| Token | Value |
|---|---|
| `input/background/default` | `#ffffff` |
| `input/background/readonly` | `#f3f4f6` |
| `input/border/default` | `#e5e7eb` |
| `input/border/hover` / `input/border/focused` | `#6c5ce7` |
| `input/border/error` | `#cd0200` |
| `input/border/warning` | `#a87a08` |
| `input/border/success` | `#148b7e` |
| `input/border/readonly` | `#f3f4f6` |
| `input/label/default` | `#6b7280` |
| `input/text/placeholder` | `#9ca3af` |
| `input/text/value` | `#111827` |
| `input/text/readonly` | `#4b5563` |
| `input/hint/default` | `#4b5563` |
| `input/hint/error` | `#8f0e0e` |
| `input/hint/warning` | `#6b4a07` |
| `input/hint/success` | `#107b72` |

## Dark mode

Component tokens use identical semantic aliases in Light and Dark modes.
Mode switching is handled by `Venus_Semantics` — component tokens are stable
semantic pointers, not mode re-expressors. This is intentional architecture
(IBM Carbon pattern).

## Related components

Select, Button, Hint Text, Status Message
