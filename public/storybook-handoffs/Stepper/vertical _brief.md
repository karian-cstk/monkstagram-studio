---
brief_schema: venus-storybook-handover/v2
component_name: "StepperVertical"
component_kebab_case: "stepper-vertical"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1687-51666"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "1687:51666"
figma_branch_or_version: "main"
figma_verified_at: "2026-07-23T00:00:00+05:30"
target_repository: "contentstack-design-system"
target_package: "@contentstack/venus-components"
target_storybook_title: "Navigation/StepperVertical"
brief_owner: "George Karian"
required_approvers: ["George Karian (Design)", "Accessibility Lead", "Engineering Lead"]
approval_date: "PENDING"
---

# StepperVertical — Storybook Engineering Handover

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/commit/date | What it establishes |
|---|---|---|---|
| Figma `get_design_context` | node `1687:51666` | 2026-07-23 | Full Figma-generated reference code, layout structure, token bindings, component description for `Stepper/Vertical` |
| Figma `figma_get_component_for_development` | node `1687:51666` | 2026-07-23 | Live `absoluteBoundingBox` measurements for component and all 4 child step instances — used to calculate exact divider x position, step widths, and label/indicator layout |
| Figma component description | nodes `1687:51666` and `1689:51842` | 2026-07-23 | Authoring intent, layout pattern (label LEFT, indicator RIGHT), engineering props interface, usage rules |
| Figma `_Internal/Stepper/Step` atom data | node `1689:51842` — from previous session | 2026-07-23 | All 20 variant IDs, `componentPropertyDefinitions`, fill/stroke variable bindings verified live |
| Figma documentation link | node `1706:53362` | 2026-07-23 | 9-section documentation frame — overview, anatomy, accessibility, design rationale |
| Venus 2.1 RF master file | `venus-21-rf-master.md` | 2026-07-22 | Token values, alias chain, resolved contradictions, governance rules |
| Session build transcript | Stepper build session 2026-07-22 | 2026-07-22 | All architectural decisions: label-left/indicator-right rationale, right-aligned text truncation direction, active card FILL vs HUG difference from horizontal, divider MAX constraint rationale |
| `StepperHorizontal` brief | `.ai/components/StepperHorizontal/artifacts/brief.md` | 2026-07-23 | Prior sibling brief — shared atom, shared states, shared token table. This brief describes only what differs from horizontal. |

### Source precedence

1. Figma live data (`get_design_context` + `figma_get_component_for_development`) — definitive measurements and structure
2. Venus 2.1 RF master file — authoritative for token values, red lines, governance
3. Session build transcript — authoritative for architectural decisions and rationale
4. `StepperHorizontal` brief — peer reference for shared contracts (states, tokens, ARIA base pattern)

Where Figma code and the master file disagree: master file wins. Identified conflict: same `border-2` (2px) Tailwind quantisation as horizontal — actual border is 1.5px (see SC-01, Section 17).

---

## 1. Outcome and scope

**Definition:** `StepperVertical` is a vertically-oriented multi-step progress indicator that stacks steps in a column, with labels on the left (right-aligned toward the indicator) and the indicator on the right, connected by a single continuous divider line running down the right-side indicator column.

**User need:** A content editor or developer navigating a multi-step sidebar workflow (settings configuration, guided panel flow, narrow-context wizard) needs to track their position and progress through an ordered series of steps without the visual overhead of a full-width horizontal stepper.

**Critical layout distinction from `StepperHorizontal`:** Labels are on the LEFT. Indicators are on the RIGHT. Text is right-aligned. The divider line runs vertically down the RIGHT side of the component (indicator column), not through the centre. This is the defining visual characteristic of this component and is non-negotiable.

### Use cases

| ID | Use case | Context | Success outcome |
|---|---|---|---|
| UC-01 | Sidebar configuration flow | 280px-wide settings drawer or side panel; 3–10 steps | User tracks progress in a narrow column; labels truncate cleanly; indicator column stays fixed on right |
| UC-02 | Many-step workflow | Import or onboarding with 7+ steps (exceeds horizontal's practical 6-step limit) | All steps visible without count cap; component scrolls naturally as height grows |
| UC-03 | Non-linear sidebar review | Review/edit panel where any step can be revisited | All non-disabled steps are button-interactive; focus ring visible on keyboard navigation |
| UC-04 | Narrow container usage | Container as narrow as 160px | Labels still truncate correctly; indicator never disappears; minimum width is enforced |
| UC-05 | Error feedback in sidebar | Validation error on a step while inside a drawer | Error dot + destructive description visible; three-channel error pattern maintained |

### Scope

| In scope | Out of scope |
|---|---|
| `StepperVertical` root component | `StepperHorizontal` (separate component, separate brief) |
| `_StepperStep` internal atom (vertical orientation) | Animated expand/collapse of step content panels |
| All 5 step states: Default, Active, Completed, Disabled, Error | Drag-to-reorder steps |
| Both indicator types: Icon and Counter | Custom step content beyond label/description |
| Linear and non-linear interaction modes | Horizontal layout |
| Full height-auto growth with unlimited steps | Responsive breakpoint switching to horizontal |

### Responsibility boundary

| Component owns | Consumer owns |
|---|---|
| Vertical stacking, equal-height steps, label/indicator column layout | Supplying `steps` array with correct `state` values |
| Divider line x-position (right-side indicator centre) | Calling `onStepClick` to update `currentStep` |
| ARIA `nav > ol > li` structure | Setting `accessibleLabel` per step ("Step N: [title] ([state])") |
| `opacity: 0.40` on disabled steps | Deciding when `isNonLinear` applies |
| Active card full-width border treatment | Providing meaningful `title` and `description` strings |
| Right-aligned text truncation with ellipsis at the LEFT edge | Choosing container width (min 160px recommended) |

---

## 2. Existing baseline and change contract

N/A — new component.

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Shell + internal atom. `StepperVertical` is the shell. `_StepperStep` is the internal atom (vertical orientation, not exported). Divider line is a single absolutely-positioned `<div>` in the shell. Steps slot renders `_StepperStep` instances as `<li>` children in a vertical flex column. |
| Shared atom with `StepperHorizontal` | Both components use the same `_StepperStep` atom — horizontal variants for `StepperHorizontal`, vertical variants for `StepperVertical`. The atom is one COMPONENT_SET (`1689:51842`) with an `Orientation` variant property. |
| Existing components to reuse | `Badge` (for `dot/sm/error` on Error state). Icon SVGs (check, close-noborder, circle-filled) from Venus icon set. |
| Code Connect mappings | None yet. |
| Hooks/utilities/providers | None. `currentStep` is externally controlled. |
| Existing tokens/icons/assets | All fills/strokes from Venus token pipeline. Icon SVGs committed to repository (see Section 13 for exact Figma source nodes). |
| Genuinely new surface | `StepperVertical` shell, `_StepperStep` vertical orientation, divider right-column positioning pattern. |
| Prohibited reimplementation | Do not reimplement `Badge`. Do not use `position: fixed` for the divider line — it must be `position: absolute` within the component. |

---

## 4. Anatomy

| element_key | Human name | Parent | Required/conditional | Condition | Source | Interactive | Figma reference | Semantic/testing requirement |
|---|---|---|---|---|---|---|---|---|
| `root` | Stepper root | N/A | Required | Always | Component | No | node `1687:51666` | `<nav aria-label="Progress">`. VERTICAL flex column. `width: var(--stepper-vertical-width, 17.5rem)`. `height: auto`. |
| `divider` | Divider line | `root` | Required | Always | Internal | No | node `1687:51619` | `aria-hidden="true"`. `position: absolute`. `z-index: 0`. 1px wide. Full height. x = `calc(100% - var(--stepper-indicator-size) / 2)` — tracks indicator centre on right edge. See Section 10 for exact CSS. |
| `steps-list` | Steps container | `root` | Required | Always | Internal / slot | No | node `1687:51620` (`steps`) | `<ol role="list">`. `display: flex; flex-direction: column; width: 100%; position: relative; z-index: 1`. |
| `step` | Individual step | `steps-list` | Required (≥2) | `steps.length ≥ 2` | `_StepperStep` atom | Conditional | nodes `1689:51832`–`1689:51841` | `<li role="listitem">`. `width: 100%; height: 5rem; min-height: 5rem; display: flex; flex-direction: row; align-items: center`. |
| `step-focus-ring` | Focus ring | `step` | Conditional | Keyboard focus only | CSS | No | e.g. node `1689:51721` | `outline: 2px solid var(--focus-ring-color); outline-offset: 2px; border-radius: var(--radius-2)`. `:focus-visible` only — **never a DOM node**. |
| `step-active-card` | Active card wrapper | `step` | Required | Always (transparent on non-Active) | Internal | No | e.g. node `1689:51722` (Default), `1689:51735` (Active) | HORIZONTAL flex. Active only: `width: 100%; border: 1.5px solid var(--border-brand); border-radius: var(--radius-8); background: var(--surface-raised)`. See DEC-04 — Active card is FILL width (full step width), unlike horizontal variant which is HUG. |
| `step-label-group` | Label container | `step-active-card` | Required | Always | Internal | No | e.g. node `1689:51736` | `display: flex; flex-direction: column; gap: var(--space-2); flex: 1; min-width: 0; text-align: right; overflow: hidden; padding-right: var(--space-12)`. RIGHT-aligned text. Sits on the LEFT of indicator. |
| `step-indicator-wrap` | Indicator wrapper | `step-active-card` | Required | Always | Internal | No | e.g. node `1689:51739` | `position: relative; width: 2rem; height: 2rem; flex-shrink: 0`. Sits on the RIGHT of label group. |
| `step-indicator` | Indicator circle | `step-indicator-wrap` | Required | Always | Internal | No | e.g. node `1689:51740` | `display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: var(--radius-8)`. Fills and strokes vary by state. |
| `step-icon` | Icon inside indicator | `step-indicator` | Conditional | `type='icon'` and state is Default/Active/Completed/Error | Asset (SVG) | No | e.g. node `I1689_51740-1165_49120` | `width: 1rem; height: 1rem; aria-hidden="true"` |
| `step-number` | Counter text | `step-indicator` | Conditional | `type='counter'` | `stepNumber` prop | No | e.g. node `1689:51794` | Label/LG typography. Right-to-left reading toward indicator. `white-space: nowrap` |
| `step-notif-dot` | Error notification dot | `step-indicator-wrap` | Conditional | `state='error'` | `Badge` or internal | No | node `836:5602` | `position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--border-destructive); border: 1.5px solid var(--surface-raised); aria-hidden="true"` |
| `step-title` | Step title | `step-label-group` | Conditional | `hasTitle=true` | `title` prop | No | e.g. node `1689:51750` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; text-align: right`. Ellipsis appears at LEFT edge (text is right-aligned — ellipsis at the far end from indicator). |
| `step-description` | Step description | `step-label-group` | Conditional | `hasDescription=true` | `description` prop | No | e.g. node `1689:51751` | Same truncation as title. Right-aligned. |

---

## 5. Public React API

### Props

| Prop | Exact TypeScript type | Required | Default | Allowed values/range | Behavior | Controls | Validation/coercion | Storybook control | Update marker |
|---|---|---|---|---|---|---|---|---|---|
| `steps` | `StepperStepConfig[]` | Yes | — | Array, min length 2 | Each element maps to one `_StepperStep` vertical instance. State derived from `currentStep` unless overridden per-step. | `steps-list`, all `step` nodes | Warn in dev if `steps.length < 2` | object (array) | NEW |
| `currentStep` | `number` | No | `0` | `0` to `steps.length - 1` | Marks step at index as Active; lower = Completed; higher = Default unless overridden | `step-active-card`, `step-indicator` | Clamp silently; warn in dev if out of bounds | number | NEW |
| `isNonLinear` | `boolean` | No | `false` | `true \| false` | When true: all steps are `<button>`. When false: display-only `<div>`. | `step` element type | None | boolean | NEW |
| `type` | `'icon' \| 'counter'` | No | `'counter'` | `'icon'`, `'counter'` | Applied uniformly. `'icon'` = 16px SVG icon; `'counter'` = step number. | `step-indicator` contents | None | select | NEW |
| `width` | `number \| string` | No | `'17.5rem'` | Any valid CSS width value; `number` treated as px | Sets the component's CSS `width`. Height is always `auto`. Min recommended: `10rem` (160px). | `root` `style` | None | number / text | NEW |
| `onStepClick` | `(index: number) => void` | No | `undefined` | Function | Fires when a step is clicked (non-linear only). Consumer updates `currentStep`. | `step` event handler | Silently ignored when `isNonLinear=false` | — (action) | NEW |
| `className` | `string` | No | `undefined` | Any string | Appended to root `<nav>` className. | `root` | None | text | NEW |
| `style` | `React.CSSProperties` | No | `undefined` | Any valid CSS | Applied to root `<nav>`. Consumer can override width. | `root` | None | object | NEW |
| `data-testid` | `string` | No | `undefined` | Any string | Applied to root `<nav>` for test selection. | `root` | None | text | NEW |

#### `StepperStepConfig` type (shared with `StepperHorizontal`)

```typescript
interface StepperStepConfig {
  /** Primary label — single line, right-aligned, truncates at left edge. */
  title: string;
  /** Secondary label — single line, right-aligned, truncates at left edge. */
  description?: string;
  /** Explicit state override. Derived from currentStep if omitted. */
  state?: 'default' | 'active' | 'completed' | 'disabled' | 'error';
  /** Counter type only. Auto-incremented (index+1) if omitted. */
  stepNumber?: string;
  /**
   * Full screen reader label. Required for accessibility.
   * Format: "Step N: [title] ([state])".
   * Example: "Step 2: Map fields (current step)"
   */
  accessibleLabel?: string;
  /** Whether to render the title. Default: true. */
  hasTitle?: boolean;
  /** Whether to render the description. Default: true. */
  hasDescription?: boolean;
}
```

### Callbacks

| Callback | Trigger | Exact signature | Arguments | Firing order/frequency | Must not fire when |
|---|---|---|---|---|---|
| `onStepClick` | User clicks or presses Enter/Space on an interactive step button | `(index: number) => void` | `index`: 0-based step index | Once per user interaction | `isNonLinear=false`; `state='disabled'`; `state='active'` (already current) |

### API mechanics

| Concern | Contract |
|---|---|
| Controlled/uncontrolled state | Fully controlled. `currentStep` managed externally. No internal `useState` for step position. |
| Internal state | None for step position. Focus tracking managed entirely via CSS `:focus-visible`. |
| Prop changes after mount | Changing `currentStep` re-renders immediately. Changing `steps` array replaces all step elements. |
| Ref forwarding | `React.forwardRef` — forwards `ref` to root `<nav>`. |
| Native DOM props | `className`, `style`, `data-testid` on root `<nav>` only. |
| `className`, `style`, `id`, `data-*` | Spread to root `<nav>` only. |
| Form integration | N/A — not a form control. |

### Invalid combinations

| Combination | Valid | Required result | Warning/error |
|---|---|---|---|
| `steps.length < 2` | No | Single step renders | `console.warn`: "StepperVertical requires at least 2 steps." |
| `currentStep` out of bounds | No | Clamp silently | `console.warn` in dev |
| `onStepClick` without `isNonLinear=true` | No | Silently ignored | `console.warn` in dev |
| `width` less than `10rem` (160px) | No | Renders but labels heavily truncated | `console.warn` in dev: "StepperVertical: width below 160px — labels may be unreadable." |
| Multiple `state='active'` steps | No | First active wins; rest fall back to `'default'` | `console.warn` in dev |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop(s) | Mapping rule | React default | Transformation/notes |
|---|---|---|---|---|---|
| `steps` (SLOT) | `_Internal/Stepper/Step` Vertical instances | `steps: StepperStepConfig[]` | direct | `[]` (required) | In Figma: a slot frame. In React: mapped to `_StepperStep` vertical instances as `<li>` children |
| `isNonLinear` (BOOLEAN) | `false \| true` | `isNonLinear: boolean` | direct | `false` | 1:1 |
| `Orientation` (VARIANT on atom) | `Vertical \| Horizontal` | N/A on `StepperVertical` | N/A — fixed to Vertical | `'vertical'` (implicit) | `StepperVertical` only ever uses `Orientation=Vertical` atom variants |
| `Type` (VARIANT on atom) | `Icon \| Counter` | `type: 'icon' \| 'counter'` | case/format transform | `'counter'` | PascalCase → lowercase |
| `State` (VARIANT on atom) | `Default \| Active \| Completed \| Disabled \| Error` | `steps[n].state` + `currentStep` | case/format transform + default fallback | `'default'` (derived) | PascalCase → lowercase |
| `hasFocus` (BOOLEAN on atom) | `false \| true` | N/A → CSS `:focus-visible` | N/A | implicit | **Never a real prop.** Focus ring via CSS only. |
| `hasTitle` (BOOLEAN on atom) | `false \| true` | `steps[n].hasTitle` | direct | `true` | Controls step-title visibility |
| `hasDescription` (BOOLEAN on atom) | `false \| true` | `steps[n].hasDescription` | direct | `true` | Controls step-description visibility |
| `stepNumber` (TEXT on atom) | `"1"`, etc. | `steps[n].stepNumber` | direct | Auto-incremented `String(index + 1)` | Counter type only |
| `title` (TEXT on atom) | `"Step title"` | `steps[n].title` | direct | Required | Right-aligned; truncates at LEFT edge |
| `description` (TEXT on atom) | `"Optional description"` | `steps[n].description` | direct | `undefined` | Right-aligned; truncates at LEFT edge |
| `accessibleLabel` (TEXT on atom) | `"Step 1"` | `steps[n].accessibleLabel` | direct | Auto-generated `"Step [N+1]"` | Always supply explicit value for full state context |

### Unmapped design properties

| Property/variation | Reason | Resolution |
|---|---|---|
| `stepper-divider-line` x position | Designer-maintained in Figma via `CENTER+STRETCH` constraints on the right indicator column | Fixed in CSS via `right: calc(var(--stepper-indicator-size) / 2)` — see Section 10 for exact implementation. Consumer cannot override. |
| `width` / `height` on `Stepper/Vertical` root | In Figma root is FIXED 235×522px (demo snapshot). Actual usage: FIXED width, AUTO height. | `width` exposed as prop with `17.5rem` default. `height: auto` is non-negotiable — it grows with steps. |
| `aria-label` on `<nav>` | Figma description uses `"Progress"` hardcoded | Hardcoded English default; expose as optional `aria-label` prop for localization. |

### Unmapped code properties

| Prop/behavior | Still used in consuming code? | Resolution |
|---|---|---|
| N/A | N/A — new component | N/A |

---

## 7. Variants, states, and precedence

| State/variant | Category | Trigger/prop | Valid with | Invalid with | Visual difference/reference | Behavior/DOM difference | Required story |
|---|---|---|---|---|---|---|---|
| `default` | Base | `steps[n].state='default'` or derived | All types | — | White indicator + `border/default` 1px. Title: `text/default`. node `1689:51832`/`1689:51837` | `<div>` (linear) or `<button>` (non-linear). `aria-disabled="true"` on future steps (linear) | `Default` |
| `active` | Public interaction | `steps[n].state='active'` or `currentStep` index | All types | Cannot co-exist with another `active` | Active card: `border/brand` 1.5px OUTSIDE, `surface/raised` fill, `radius/8`, **FULL width**. Title: `text/brand`, Semi Bold. node `1689:51833`/`1689:51838` | `<div aria-current="step">` — not a button. | `ActiveStep` |
| `completed` | Public interaction | Derived (index < `currentStep`) or explicit | All types | — | Indicator: `action/primary` fill. White check (Icon) or white number (Counter). Title: `text/default`. node `1689:51834`/`1689:51839` | `<button>` only if `isNonLinear=true` | `CompletedSteps` |
| `disabled` | Validation | `steps[n].state='disabled'` | All types | Cannot be `active` | Root `opacity: 0.40`. node `1689:51835`/`1689:51840` | `<div aria-disabled="true">`. `pointer-events: none` regardless of `isNonLinear`. | `DisabledStep` |
| `error` | Validation | `steps[n].state='error'` | All types | — | Indicator unchanged (white + `border/default`). Red dot at top-right (-3, -3). Description: `text/destructive`. node `1689:51836`/`1689:51841` | Same interactivity as `default` | `ErrorStep` |
| `type='icon'` | Base variant | `type` prop | All states | — | 16px icon in indicator | No behavioral difference | `IconType` |
| `type='counter'` | Base variant | `type` prop | All states | — | Step number text in indicator | No behavioral difference | `Default` (default type) |
| `isNonLinear=true` | Interaction mode | `isNonLinear` prop | All states except `disabled` | — | No visual difference | Non-disabled steps are `<button>` | `NonLinear` |

### State precedence

| Higher state | Lower state | Result |
|---|---|---|
| `disabled` | Any other | `disabled` always wins — opacity 0.40, never interactive |
| Explicit per-step `state` | Derived from `currentStep` | Explicit override wins |
| `active` (first in array) | `active` (duplicate — invalid) | First wins; subsequent fall back to `default` with dev warning |

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure/fallback |
|---|---|---|---|---|
| BR-01 | `isNonLinear=false`, `currentStep=1` | Component mounts | Step 0 = `completed`, step 1 = `active`, steps 2+ = `default`. Divider runs full height behind all steps. | — |
| BR-02 | `isNonLinear=true` | User clicks step at index 2 | `onStepClick(2)` fires. Consumer updates `currentStep=2`. | If `onStepClick` absent, click is no-op |
| BR-03 | Any step | `state='disabled'` | `pointer-events: none`, `aria-disabled="true"`, `opacity: 0.40`. | — |
| BR-04 | `type='counter'`, `stepNumber` omitted | Component renders | Auto-assigned `String(index + 1)` | — |
| BR-05 | Any step title | Title text overflows label column | Truncates with ellipsis **at the LEFT edge** (right-aligned text). The characters nearest the indicator — on the right — are preserved. This is intentional: those characters establish step identity near the indicator. | `min-width: 0` on the label group is required for truncation to activate |
| BR-06 | `state='error'` | Component renders | Red dot at top-right of indicator. Description in `text/destructive`. Both channels required (color + text). `accessibleLabel` must include error context. | If `description` absent, dot still renders |
| BR-07 | Any width | `width < 10rem` (160px) | Labels truncate severely. Dev warning emitted. Component still renders. | — |
| BR-08 | `isNonLinear=true`, step button focused | `ArrowDown` pressed | Focus moves to next non-disabled step | If at last step, wraps to first |
| BR-09 | `isNonLinear=true`, step button focused | `ArrowUp` pressed | Focus moves to previous non-disabled step | If at first step, wraps to last |
| BR-10 | `accessibleLabel` omitted | Component renders | Auto-generate `"Step ${index + 1}"`. Dev warning. Full state context missing. | — |
| BR-11 | Steps array changes length | Consumer adds/removes steps | Component height adjusts automatically (`height: auto`). Divider height follows (`height: 100%`). | — |

### Input and data validation

| Input | Rule | Dev warning | User-visible effect |
|---|---|---|---|
| `steps.length < 2` | Must be ≥ 2 | `console.warn` | Single step renders; component usable but semantically degenerate |
| `currentStep` out of bounds | Clamp to [0, steps.length - 1] | `console.warn` | Clamped silently |
| Multiple `state='active'` | Only one allowed | `console.warn` | First active wins; rest default |
| `width < 10rem` | Allowed but inadvisable | `console.warn` | Labels truncate to 2–3 chars |

---

## 9. Interactions and focus

### Mouse / touch

| Interaction | `isNonLinear=false` | `isNonLinear=true` |
|---|---|---|
| Click on non-disabled step | No-op | Calls `onStepClick(index)` |
| Click on `disabled` step | No-op | No-op (`pointer-events: none`) |
| Click on `active` step | No-op | No-op (already current) |
| Hover | No visual change | `cursor: pointer`. No fill change. |

### Keyboard

| Context | Key | Result | Focus after | Prevent default |
|---|---|---|---|---|
| Any — focus on stepper | `Tab` | Focus enters stepper at first interactive step | First non-disabled step | No |
| Step button focused | `Enter` / `Space` | Activates step; calls `onStepClick(index)` | Stays on current button | Yes (Space) |
| Step button focused | `ArrowDown` | Move focus to next non-disabled step | Next step button | Yes |
| Step button focused | `ArrowUp` | Move focus to previous non-disabled step | Previous step button | Yes |
| Step button focused | `ArrowRight` | Same as `ArrowDown` (optional enhancement) | Next step button | Yes |
| Step button focused | `ArrowLeft` | Same as `ArrowUp` (optional enhancement) | Previous step button | Yes |
| Step button focused | `Home` | Focus first non-disabled step | First step | Yes |
| Step button focused | `End` | Focus last non-disabled step | Last step | Yes |
| Any — focus in stepper | `Tab` (again) | Exit stepper | Next element outside stepper | No |
| `isNonLinear=false` | Arrow keys | No-op | — | No |

**Focus ring:** CSS `:focus-visible` only. Never on mouse click. 2px `outline: var(--focus-ring-color)`, 2px `outline-offset`, `border-radius: var(--radius-2)`. Wraps the full step row (80px height × 100% width).

**Arrow key preference:** `ArrowDown`/`ArrowUp` are primary for vertical orientation. `ArrowRight`/`ArrowLeft` are secondary (optional enhancement for consistency with horizontal stepper keyboard behaviour).

---

## 10. Dynamic positioning and synchronization

The divider line is not repositioned at runtime. Its position is entirely CSS-driven and dynamically correct at any component width.

**The critical difference from `StepperHorizontal`:** The vertical divider line must track the **right-side indicator column**, not the geometric centre of the component. As the component width changes, the line must stay over the indicator centres — which are at a fixed distance from the RIGHT edge (not the centre).

**Live Figma measurement confirmation:**
- Component `absoluteBoundingBox.x = 200`, `width = 235px`
- `stepper-divider-line.absoluteBoundingBox.x = 377`
- Line x from left = `377 - 200 = 177px`
- Line x from right = `235 - 177 = 58px`
- Indicator is 32px wide → right edge is at the step's right edge → indicator centre from right = `32 / 2 = 16px`
- Figma uses `CENTER` horizontal constraint (tracks geometric centre as width changes). But the geometric centre is not the right position — the indicator column is on the right. **In CSS, use `right: calc(var(--stepper-indicator-size) / 2)` to always track the indicator right-column centre regardless of component width.**

**Exact CSS:**

```css
.stepper-vertical {
  position: relative;
  width: var(--stepper-vertical-width, 17.5rem); /* 280px default */
  height: auto;
  min-width: var(--stepper-vertical-min-width, 10rem); /* 160px */
}

.stepper-vertical__divider {
  position: absolute;
  /* Track the horizontal centre of the right-side indicator column.
     Indicator is --stepper-indicator-size (2rem = 32px) wide.
     Indicator sits at the far right of each step row.
     Its horizontal centre = component right edge minus half indicator width. */
  right: calc(var(--stepper-indicator-size) / 2);
  transform: translateX(50%); /* centres the 1px line on the indicator centre */
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: var(--border-default);
  pointer-events: none;
  z-index: 0;
}

.stepper-vertical__steps {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
```

**Why not `right: 0` or `right: 1rem`?** `right: 0` would place the line at the extreme right edge, not the indicator centre. `right: 1rem` is a hardcoded value that breaks when the indicator size changes. `calc(var(--stepper-indicator-size) / 2)` is the correct dynamic formula: it always equals "half an indicator width from the right edge", which is the indicator horizontal centre.

The Active card's white `background-color` covers the divider line behind it — the gap-stopped visual effect — requiring no JavaScript.

N/A — no JS-driven position tracking required.

---

## 11. Responsive behavior

| Width / container | Behavior |
|---|---|
| Default `17.5rem` (280px) | Comfortable label reading. 4-step flow: each step 80px tall × 280px wide. |
| `10rem` (160px) minimum | Labels truncate to roughly 60% of default length. Still readable for short titles. |
| `< 10rem` | Severe truncation. Dev warning. Component renders but labels may be meaningless. |
| Width increase | Label column expands (it uses `flex: 1`). Indicator stays right-anchored. Divider tracks indicator via CSS `right` rule. |
| Height | Always `auto`. Grows with step count. No maximum. Use in a scrollable container for very long step lists. |
| Step count | No practical cap. Each step is `5rem` (80px) tall. 10 steps = `50rem` (800px). Consumer must ensure scrollability if the container has a fixed height. |

### Overflow

- Step title and description: `overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right` — truncation at the LEFT edge
- Step cell label group: `flex: 1; min-width: 0` — mandatory to enable truncation in flex
- Divider line: `height: 100%` of `steps` container — spans all steps automatically

**Text direction note:** `text-overflow: ellipsis` on a `text-align: right` element produces an ellipsis at the LEFT edge. The rightmost characters — nearest the indicator — remain visible. This is intentional per DEC-02 in Section 17: the characters at the right end of the label are closest to the indicator and establish step identity.

---

## 12. Content, localization, and edge cases

### Localization

| Concern | Requirement |
|---|---|
| `aria-label` on root `<nav>` | Defaults to `"Progress"`. Expose as optional `aria-label` prop. |
| `accessibleLabel` per step | Consumer-provided in UI language. Format: "Step N: [title] ([state])". |
| Step titles | Right-aligned. Truncation exposes the rightmost characters. Short titles (1–4 words) work best. Longer titles truncate, losing the beginning — consumers should use concise labels. |
| RTL support | LTR only in this release. RTL (Hebrew, Arabic) would require reversing the layout: label RIGHT, indicator LEFT, divider on LEFT. Out of scope. |
| Numeric counter | `stepNumber` is a string — consumer can pass any numeral system. |

### Edge cases

| Edge | Expected behavior |
|---|---|
| `steps.length === 1` | One step renders; divider may be invisible (zero height content above/below). Dev warning. |
| `steps.length === 0` | Empty render. Dev warning. |
| All steps `state='disabled'` | All steps at 40% opacity. No `aria-current`. No interactive step. |
| Title is empty string `""` | `step-title` renders empty. No ellipsis. |
| Description is empty string `""` | Description renders as empty when `hasDescription=true`. Omit `description` to hide. |
| Very long `accessibleLabel` | Not truncated — screen reader reads the full value. Component renders only `title`/`description` visually. |
| `width: 100%` in a narrow sidebar | Component fills its container. Divider tracks correctly via CSS. Steps may become very narrow — at `< 10rem`, dev warning fires. |
| Steps array replaced dynamically | Component re-renders entirely. Focus must be managed by consumer. |

---

## 13. Tokens, typography, and assets

All tokens identical to `StepperHorizontal` — this section documents them fully for standalone reference. See also SC-01 (border-width conflict) in Section 17.

### Color tokens

| element_key | State | CSS custom property | Venus_Semantics token | Resolved (Light) | Resolved (Dark) |
|---|---|---|---|---|---|
| `step-indicator` | Default | `--surface-raised` (fill), `--border-default` (stroke 1px) | `surface/raised`, `border/default` | `#FFFFFF`, `#E5E7EB` | `#1F2937`, `#374151` |
| `step-indicator` | Active | `--surface-brand-inactive` (fill), `--border-brand` (stroke 1.5px) | `surface/brand/inactive`, `border/brand` | `#EDE9FE`, `#A78BFA` | `#2D1B69`, `#7C3AED` |
| `step-indicator` | Completed | `--action-primary` (fill) | `action/primary` | `#6C5CE7` | `#7C3AED` |
| `step-indicator` | Disabled | Same as Default; root `opacity: 0.40` | `visibility/disabled` | 0.40 | 0.40 |
| `step-indicator` | Error | Same as Default (fill/stroke unchanged) | `surface/raised`, `border/default` | `#FFFFFF`, `#E5E7EB` | — |
| `step-active-card` | Active only | `--surface-raised` (fill), `--border-brand` (stroke 1.5px OUTSIDE) | `surface/raised`, `border/brand` | `#FFFFFF`, `#A78BFA` | — |
| `step-active-card` | All others | transparent | — | — | — |
| `divider` | All | `--border-default` | `border/default` | `#E5E7EB` | `#374151` |
| `step-notif-dot` | Error only | `--border-destructive` (fill) | `border/destructive` | `#CD0200` | — |
| `step-focus-ring` | Focused | `--focus-ring-color` | `focus/ring/color` | `#6C5CE7` (purple/500) | `#8B5CF6` (purple/400) |
| `root` | Disabled step | `opacity: 0.40` | `visibility/disabled` | 0.40 | 0.40 |

### Sizing and spacing

| Element | Property | Value | CSS token | Unit |
|---|---|---|---|---|
| Root | width (default) | 280px | `--stepper-vertical-width: 17.5rem` | rem |
| Root | min-width | 160px | `--stepper-vertical-min-width: 10rem` | rem |
| Root | height | auto | `height: auto` | — |
| Step | height | 80px | `--stepper-step-height: 5rem` | rem |
| Step | width | 100% | `width: 100%` | % |
| Indicator | width × height | 32 × 32px | `--stepper-indicator-size: 2rem` | rem |
| Indicator | border-radius | 8px | `var(--radius-8)` = `0.5rem` | rem |
| Active card | padding top/bottom | 12px | `var(--space-12)` = `0.75rem` | rem |
| Active card | padding left/right | 16px | `var(--space-16)` = `1rem` | rem |
| Active card | border-width | 1.5px | `1.5px` | px |
| Active card | border-radius | 8px | `var(--radius-8)` = `0.5rem` | rem |
| Active card | width | 100% (FILL) | `width: 100%` | % — **differs from horizontal (HUG)** |
| Label group | padding-right | 12px | `var(--space-12)` = `0.75rem` | rem |
| Label group | gap | 2px | `var(--space-2)` = `0.125rem` | rem |
| Error dot | top | -3px | `-3px` | px |
| Error dot | right | -3px | `-3px` | px |
| Error dot | size | 8×8px | `8px` | px |
| Divider | width | 1px | `1px` | px |
| Divider right offset | right | `calc(indicator / 2)` | `calc(var(--stepper-indicator-size) / 2)` | calc |
| Focus ring | offset | 2px | `2px` | px |
| Focus ring | stroke | 2px | `2px` | px |
| Focus ring | border-radius | 2px | `var(--radius-2)` = `0.125rem` | rem |

**rem vs px decisions:**
- `rem` for all heights, widths, font sizes, padding, gap — scales with browser text preferences
- `px` for border widths (1px, 1.5px), focus ring offset (2px), divider width (1px), error dot offsets (-3px) — sub-pixel rendering requires absolute values
- `calc()` for divider position — derived dynamically from indicator size token

### Typography

| element_key | State | Token/style | Family | Weight | Size | Line height | Letter spacing | Text align |
|---|---|---|---|---|---|---|---|---|
| `step-title` | Default / Completed / Error | `Body/SM` | Inter | Regular (400) | 13px = `0.8125rem` | 1.4 | 0 | right |
| `step-title` | Active | `Body/SM/Semi Bold` | Inter | Semi Bold (600) | 13px = `0.8125rem` | 1.3 | 0 | right |
| `step-title` | Disabled | `Body/SM` | Inter | Regular (400) | 13px = `0.8125rem` | 1.4 | 0 | right |
| `step-description` | All | `Body/XXS` | Inter | Medium (500) | 11px = `0.6875rem` | 1.3 | 0.02px | right |
| `step-number` | All | `Label/LG` | Inter | Medium (500) | 13px = `0.8125rem` | 1.3 | 0 | center (in indicator) |

**Text fill tokens by state:**

| element_key | State | CSS custom property | Token | Resolved (Light) |
|---|---|---|---|---|
| `step-title` | Default / Completed / Error | `--text-default` | `text/default` | `#111827` |
| `step-title` | Active | `--text-brand` | `text/brand` | `#6C5CE7` |
| `step-title` | Disabled | `--text-disabled` | `text/disabled` | `#9CA3AF` |
| `step-description` | Default / Active / Completed | `--text-subtle` | `text/subtle` | `#6B7280` |
| `step-description` | Error | `--text-destructive` | `text/destructive` | `#CD0200` |
| `step-description` | Disabled | `--text-disabled` | `text/disabled` | `#9CA3AF` |
| `step-number` | Default | `--text-subtle` | `text/subtle` | `#6B7280` |
| `step-number` | Active | `--text-brand` | `text/brand` | `#6C5CE7` |
| `step-number` | Disabled | `--text-disabled` | `text/disabled` | `#9CA3AF` |

### Assets

| Asset key | element_key | Exact source | Format | Width × height | Color behavior | Durable delivery | Alt behavior |
|---|---|---|---|---|---|---|---|
| `icon-check` | `step-icon` (Completed, Icon type) | Figma node `1282:35852` (Check) | SVG | 16 × 16px | `fill: white` (inverted; indicator bg = `action/primary`) | Export at 1×; commit as `check.svg` | `aria-hidden="true"` |
| `icon-close` | `step-icon` (Error, Icon type) | Figma node `1282:35806` (Close-Noborder) | SVG | 16 × 16px | `fill: var(--text-default)` (white indicator bg) | Export; commit as `close-noborder.svg` | `aria-hidden="true"` |
| `icon-circle-filled` | `step-icon` (Default/Active, Icon type) | Figma node `1282:35938` (Circle-Filled) | SVG | 16 × 16px | Default: `fill: var(--text-subtle)`. Active: `fill: var(--text-brand)` | Export; commit as `circle-filled.svg` | `aria-hidden="true"` |

---

## 14. Accessibility contract

### Semantics and naming

| Concern | Requirement |
|---|---|
| Root semantic element/role | `<nav aria-label="Progress">` — landmark region. Expose `aria-label` as optional prop for localization. |
| Accessible-name per step | `aria-label` on `<li>` or `<button>` from `accessibleLabel` prop. Format: `"Step N: [title] ([human-readable state])"`. Examples: `"Step 1: Configure source (completed)"`, `"Step 2: Map fields (current step)"`, `"Step 4: Publish (error — see error message)"`. |
| Description and error | Error state: include error context in `accessibleLabel`. If using `aria-describedby`, point to a visible description element. |
| Required ARIA | `<ol role="list">` on steps container. `<li role="listitem">` per step. Active `<li>`: `aria-current="step"`. Disabled: `aria-disabled="true"`. All icons and the error dot: `aria-hidden="true"`. |
| List structure | Ordered list `<ol>` — order is meaningful. |

### Keyboard

| Context | Key | Result | Focus after | Prevent default |
|---|---|---|---|---|
| `isNonLinear=true` — step focused | `Enter` / `Space` | Activates; fires `onStepClick(index)` | Stays on current button | Yes (Space) |
| `isNonLinear=true` — step focused | `ArrowDown` | Next non-disabled step | Next step | Yes |
| `isNonLinear=true` — step focused | `ArrowUp` | Previous non-disabled step | Previous step | Yes |
| `isNonLinear=true` — step focused | `ArrowRight` | Same as ArrowDown (optional) | Next step | Yes |
| `isNonLinear=true` — step focused | `ArrowLeft` | Same as ArrowUp (optional) | Previous step | Yes |
| `isNonLinear=true` — step focused | `Home` | First non-disabled step | First step | Yes |
| `isNonLinear=true` — step focused | `End` | Last non-disabled step | Last step | Yes |
| Any | `Tab` | Enter/exit stepper | First interactive step / next outer element | No |
| `isNonLinear=false` | Arrow keys | No-op | — | No |

### Announcements

| Event/state | Announcement | Live region | Timing |
|---|---|---|---|
| Step focused (keyboard) | Screen reader reads step's `aria-label` (from `accessibleLabel`) | None required | On focus |
| Active step (`aria-current="step"`) | "current step" appended to step announcement | None — `aria-current` is read on focus | On focus |
| `currentStep` change (programmatic) | Consumer manages focus after state change. If focus not moved, nothing announced. | None — consumer responsibility | Consumer manages |

### Acceptance

| Area | Requirement |
|---|---|
| Focus visible/order/restoration | `:focus-visible` CSS only. 2px `outline: var(--focus-ring-color)`, 2px offset, `border-radius: var(--radius-2)`. Focus ring wraps the full 80px step row. Tab order follows DOM order (step 1 → step N, top to bottom). After activation, focus stays on activated step. |
| Contrast | `text/default` (#111827) on white: 16.75:1 ✅ AAA. `text/brand` (#6C5CE7) on white: 4.61:1 ✅ AA. `text/subtle` (#6B7280) on white: 4.62:1 ✅ AA. `text/destructive` (#CD0200) on white: 5.44:1 ✅ AA. White icon on `action/primary` (#6C5CE7): 4.61:1 ✅ AA. Focus ring (#6C5CE7) on white: 4.61:1 ✅ AA. Disabled: exempt (WCAG 1.4.3). |
| Target size | Step row: `5rem` (80px) height × `100%` width — well above 24×24px (WCAG 2.5.8). |
| Zoom/reflow | `rem` units throughout. At 200% browser zoom fully functional. `height: auto` — grows with content. |
| Reduced motion | `@media (prefers-reduced-motion: reduce)`: `transition: none; animation: none`. Active card slide-in animation disabled. |
| Forced colors | `@media (forced-colors: active)`: Active card `border: 2px solid Highlight`. Completed indicator `background-color: Highlight; forced-color-adjust: none`. Focus ring `outline: 3px solid Highlight`. |

---

## 15. Storybook contract

### Environment

| Field | Requirement/evidence |
|---|---|
| Story title and format | `Navigation/StepperVertical` — CSF3 format |
| Autodocs/docs | `tags: ['autodocs']` |
| Layout/background | `layout: 'padded'`. Component has fixed width (not full-container) — `layout: 'centered'` also acceptable. |
| Decorators/providers | Default story: no decorator needed. `InSidebar` story: wrap in `<div style="width: 280px; height: 600px; overflow: auto; border: 1px solid var(--border-default)">`. |
| Globals: theme/locale/direction | `theme: 'light'` default; `theme: 'dark'` for `DarkMode` story. LTR only. |
| Router/data/form context | None |
| Network mocks/loaders | None |
| Viewports | Desktop (1280×720) default. Use explicit width via `width` prop for narrow tests — not viewport change. |
| Pseudo-state mechanism | CSS `:focus-visible` — `play` function to call `element.focus()` for `Focused` story. |
| Font/image/async readiness | Inter font and SVG icons must be loaded before visual snapshot. |
| Snapshot motion policy | Disable CSS transitions via `prefers-reduced-motion: reduce` global. |

### Controls

| Prop | Control | Options/range | Default shown | Conditional behavior |
|---|---|---|---|---|
| `steps` | object (array) | — | 4-step default array | Required; ≥ 2 items |
| `currentStep` | number | 0 to `steps.length - 1` | `1` | — |
| `type` | radio | `'counter'`, `'icon'` | `'counter'` | — |
| `isNonLinear` | boolean | — | `false` | When true, steps are `<button>` |
| `width` | text | Any CSS value | `'17.5rem'` | — |
| `onStepClick` | action | — | — | Only fires when `isNonLinear=true` |

### Required stories

| Export | Expected Storybook ID | Purpose | Exact args/fixture | State/interaction | Viewport | Theme | Assertions | Visual baseline | A11y |
|---|---|---|---|---|---|---|---|---|---|
| `Default` | `navigation-steppervertical--default` | Canonical 4-step render, Counter type, step 2 active | `steps: 4 steps, currentStep: 1, type: 'counter', width: '17.5rem'` | Default (step 2 active) | Desktop | Light | Divider line visible on right; step 2 has full-width active card; labels right-aligned | Yes | Yes |
| `IconType` | `navigation-steppervertical--icon-type` | Icon indicator variant | `steps: 4, currentStep: 1, type: 'icon'` | Step 2 active | Desktop | Light | Check in step 0; circle in active step; counter numbers absent | Yes | Yes |
| `AllStates` | `navigation-steppervertical--all-states` | All 5 states | `steps: [completed, active, default, error, disabled], type: 'icon'` | Explicit per step | Desktop | Light | Error dot on step 4; disabled at 40%; active card full-width | Yes | Yes |
| `NonLinear` | `navigation-steppervertical--non-linear` | Interactive mode | `steps: 4, currentStep: 1, isNonLinear: true, onStepClick: action` | All steps clickable | Desktop | Light | Steps render as `<button>`; `onStepClick` action logs on click | Yes | Yes |
| `LongLabels` | `navigation-steppervertical--long-labels` | Right-side truncation | `steps: 4 with 30+ char titles, currentStep: 1, width: '17.5rem'` | Default | Desktop | Light | Titles truncate at LEFT edge; rightmost chars near indicator visible; no overflow | Yes | No |
| `ManySteps` | `navigation-steppervertical--many-steps` | Height growth, no cap | `steps: 10, currentStep: 3` | 3 completed, 1 active, 6 default | Desktop | Light | Component height = 10 × 5rem = 50rem; divider spans full height; all steps visible | Yes | Yes |
| `ErrorState` | `navigation-steppervertical--error-state` | Error feedback | `steps: 4, step 3 state='error' with description='API failed'` | Error on step 3 | Desktop | Light | Red dot on step 3 indicator; description in destructive color | Yes | Yes |
| `Focused` | `navigation-steppervertical--focused` | Focus ring visible | `steps: 4, isNonLinear: true, currentStep: 1`; `play: focus stepButton[1]` | Step 2 focused | Desktop | Light | 2px purple outline wraps full step row; no ring on adjacent steps | Yes | Yes |
| `NarrowWidth` | `navigation-steppervertical--narrow-width` | Minimum useful width | `steps: 4, currentStep: 1, width: '10rem'` | Default | Desktop | Light | Labels truncate aggressively; indicator visible; no overflow; component renders | Yes | No |
| `InSidebar` | `navigation-steppervertical--in-sidebar` | Real-world sidebar context | `steps: 4, currentStep: 1`; decorator: 280px panel div | Default | Desktop | Light | Component fits within 280px panel; divider right-aligned; labels readable | Yes | Yes |
| `DarkMode` | `navigation-steppervertical--dark-mode` | Dark theme | `steps: 4, currentStep: 1`; `theme: 'dark'` | Default | Desktop | Dark | All tokens resolve to dark values; no broken fills | Yes | Yes |
| `DisabledStep` | `navigation-steppervertical--disabled-step` | Disabled state | `steps: 4, step 2 state='disabled'` | One disabled | Desktop | Light | Disabled step at 40% opacity; `aria-disabled` set; not focusable | Yes | Yes |
| `AllCompleted` | `navigation-steppervertical--all-completed` | Edge: all completed | `steps: 4, all state='completed'` | All done | Desktop | Light | All indicators purple; no active card | Yes | No |

### Story documentation

| Item | Required content |
|---|---|
| Description | "A vertical multi-step progress indicator for sidebar flows, drawers, and narrow containers. Labels on the left (right-aligned), indicators on the right. Height grows automatically with step count — no maximum. Default width 280px; minimum useful width 160px. For top-of-page wizard flows with ≤6 steps, use `StepperHorizontal` instead." |
| Composition | `<StepperVertical steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />` |
| Accessibility | "Set `accessibleLabel` on every step: 'Step N: [title] ([state])'. Active step: `aria-current='step'`. Nav landmark: `<nav aria-label='Progress'>`. Keyboard: Tab enters stepper, ArrowDown/Up moves between steps, Enter/Space activates (non-linear mode)." |
| Design/content guidance | "Keep titles to 1–4 words — labels truncate from the left, preserving the rightmost characters near the indicator. Use counter type for clearly numbered sequences. No step-count limit. Set `accessibleLabel` explicitly — the auto-generated default ('Step 1') lacks state context." |
| Migration | N/A — new component |

---

## 16. Test and visual-verification contract

### Environment

| Field | Requirement/evidence |
|---|---|
| Component/unit runner | Jest + React Testing Library (`npm test -- --testPathPattern StepperVertical`) |
| Story interaction runner | Storybook Test (`npx storybook test --story navigation-steppervertical--*`) |
| Accessibility runner | axe-core via `@storybook/addon-a11y` (`npx storybook test --a11y`) |
| Visual-regression system | Chromatic or Percy (`npx chromatic`) |
| Browsers | Chrome (primary), Firefox, Safari |
| Device-pixel ratio | 1× and 2× |
| Global visual tolerance | 0.1% pixel diff |
| Console policy | No unexpected errors or warnings |

### Per-prop verification

| Prop | Allowed values | Invalid/edge values | Omission/default test | Conditional assertion |
|---|---|---|---|---|
| `steps` | Array `StepperStepConfig[]` (min 2) | Empty array, single item | N/A (required) | Dev warning on < 2 steps |
| `currentStep` | `0` to `steps.length - 1` | `-1`, `steps.length`, `NaN` | Default `0` → first step Active | Clamp + dev warning |
| `isNonLinear` | `true`, `false` | — | Default `false` → no buttons | Steps are `<button>` when true |
| `type` | `'counter'`, `'icon'` | — | Default `'counter'` | Icon SVGs when `'icon'` |
| `width` | Any CSS value | `'5rem'` (too narrow) | Default `'17.5rem'` | Dev warning < `10rem` |
| `onStepClick` | Function | — | Omitted → no-op | Never fires when `isNonLinear=false` |

### Conditional element inventory

| element_key | Controlling prop/state | Presence test | Absence test |
|---|---|---|---|
| `step-active-card` (with border, full-width) | `state='active'` | `getByTestId('step-active-card').style.border` includes `border-brand` | Non-active steps: no border |
| `step-notif-dot` | `state='error'` | `getByTestId('step-notif-dot')` present | Non-error: query returns null |
| `step-title` | `hasTitle=true` | `getByText(step.title)` present | `hasTitle=false`: absent from DOM |
| `step-description` | `hasDescription=true` + `description` provided | `getByText(step.description)` present | `hasDescription=false` or absent: not in DOM |
| Focus ring | `:focus-visible` via `userEvent.tab()` | After Tab: `outline` style on focused step | After mouse click: no outline |
| `step` as `<button>` | `isNonLinear=true` | `getAllByRole('button')` returns step elements | `isNonLinear=false`: `queryAllByRole('button')` on steps empty |
| `aria-current="step"` | `state='active'` | `getByRole('listitem', {current: 'step'})` present | Non-active: `aria-current` absent |
| Right-aligned text | Always (vertical orientation) | `getComputedStyle(stepTitle).textAlign === 'right'` | — |

### Interaction verification

| Interaction | Story | Drive | Callback assertion | DOM assertion | Keyboard assertion |
|---|---|---|---|---|---|
| INT-01 | `NonLinear` | `userEvent.click(stepButton[2])` | `onStepClick` called with `2` | Step 2 gets `aria-current="step"` after re-render | — |
| INT-02 | `Focused` | `play: stepButton[1].focus()` | — | `document.activeElement === stepButton[1]` | Focus ring visible via snapshot |
| INT-03 | `NonLinear` | `userEvent.keyboard('{ArrowDown}')` from step 0 | — | `document.activeElement === stepButton[1]` | Focus moved down |
| INT-04 | `NonLinear` | `userEvent.keyboard('{Home}')` from step 3 | — | `document.activeElement === stepButton[0]` | Focus to first |
| INT-05 | `DisabledStep` | `userEvent.click(disabledStep)` | `onStepClick` not called | No state change | `pointer-events: none` |
| INT-06 | `NonLinear` | `userEvent.keyboard('{Enter}')` on step 2 | `onStepClick(2)` | — | `preventDefault` called |

### Visual matrix

| Story | Viewport | Browser/DPR | Theme | Figma reference | Compared scope | Tolerance | Readiness |
|---|---|---|---|---|---|---|---|
| `Default` | 1280×720 | Chrome/1× | Light | node `1687:51666` | Full component | None | Inter font loaded |
| `Default` | 1280×720 | Chrome/2× | Light | node `1687:51666` | Full component | None | Inter font loaded |
| `AllStates` | 1280×720 | Chrome/1× | Light | nodes `1689:51832–51841` | Full component | None | SVG icons loaded |
| `DarkMode` | 1280×720 | Chrome/1× | Dark | node `1687:51666` | Full component | None | Inter font loaded |
| `Focused` | 1280×720 | Chrome/1× | Light | node `1689:51721` (focus ring) | Step 2 focus ring | None | After `play` settles |
| `LongLabels` | 1280×720 | Chrome/1× | Light | — | Title truncation at left edge | None | Inter font loaded |
| `NarrowWidth` | 1280×720 | Chrome/1× | Light | — | Truncation + layout | None | Inter font loaded |

### Verification commands

```text
# Unit tests
npm test -- --testPathPattern StepperVertical

# Storybook interaction tests
npx storybook test --story "navigation-steppervertical--*"

# Accessibility
npx storybook test --a11y --story "navigation-steppervertical--*"

# Visual regression
npx chromatic --only-story-names "Navigation/StepperVertical/*"
```

---

## 17. Decisions, conflicts, exceptions, and questions

### Confirmed decisions

| ID | Context | Decision | Owner | Date | Sections affected |
|---|---|---|---|---|---|
| DEC-01 | Label LEFT, indicator RIGHT | Labels on the left (right-aligned text), indicators on the right. This places the divider line on the RIGHT side of the component, not the centre. The divider runs down the indicator column. Rationale: clean two-column layout — text on one side, dots + line on the other — highly legible in narrow sidebar contexts. | George Karian | 2026-07-22 | §1, §4, §10, §13 |
| DEC-02 | Right-aligned text truncation — ellipsis at LEFT edge | `text-align: right` + `text-overflow: ellipsis` produces an ellipsis at the LEFT edge. The rightmost characters (nearest the indicator) remain visible. This is intentional: those characters — the end of the label string — are closest to the indicator and establish step identity. | George Karian | 2026-07-22 | §8, §11, §13 |
| DEC-03 | Active card is FILL width (not HUG like horizontal) | In `StepperVertical`, the Active card fills the full step width (`width: 100%`). In `StepperHorizontal`, the Active card HUGs its content. Rationale: in a fixed-width panel, full-width Active card creates clear visual banding that is easier to scan when scrolling. HUG card would be lost in a narrow column. | George Karian | 2026-07-22 | §4, §7, §13 |
| DEC-04 | Focus ring wraps full 80px step row | Focus ring covers the entire step row (80px height × 100% width) rather than just the indicator. Rationale: the full step row is the interactive target — the focus indicator must match the click/tap target size. Wrapping only the indicator would misrepresent the touch target. | George Karian | 2026-07-22 | §9, §14 |
| DEC-05 | Divider at `right: calc(indicator/2)` not `right: 0` | The divider line must track the indicator horizontal centre, not the component's right edge. `right: calc(var(--stepper-indicator-size) / 2)` achieves this dynamically as component width changes. Hardcoding a pixel value would break at non-default widths. | Build session | 2026-07-22 | §10 |
| DEC-06 | Step height 5rem (80px) vs horizontal 6rem (96px) | Vertical steps are 16px shorter than horizontal. Rationale: vertical steps stack in a column — taller steps in a sidebar consume significant vertical space, especially with many steps. 80px gives sufficient touch target while allowing more steps visible without scrolling. | George Karian | 2026-07-22 | §13 |
| DEC-07 | `opacity: 0.40` for disabled | Venus 2.1 RF governance rule. The value `0.50` is wrong. `visibility/disabled` token = 0.40 exactly. | George Karian | 2026-05-28 | §13 |
| DEC-08 | ArrowDown/Up primary for vertical orientation | Vertical stepper uses ArrowDown/ArrowUp as primary keyboard navigation (matching the visual orientation). ArrowRight/ArrowLeft are optional secondary keys. Horizontal stepper uses ArrowRight/ArrowLeft as primary. | Build session | 2026-07-22 | §9, §14 |
| DEC-09 | `text/default` for non-Active titles | Step titles in Default, Completed, Error states use `text/default` (#111827), NOT `text/subtle`. This creates clear title/description hierarchy. An earlier build used `text/subtle` and was corrected. | George Karian | 2026-07-22 | §13 |
| DEC-10 | No step-count cap | `StepperVertical` has no maximum step count. Height grows with steps. Consumer is responsible for putting the component in a scrollable container. `StepperHorizontal` has a soft 6-step recommendation; `StepperVertical` has none. | George Karian | 2026-07-22 | §1, §11 |

### Approved exceptions

| ID | Normal source/rule | Override | Reason | Approver | Acceptance impact |
|---|---|---|---|---|---|
| EX-01 | 4pt grid spacing | Error dot offset: `-3px` (not on 4pt grid) | Dot must visually overlap indicator corner. -3px is the designed position per Figma `absoluteBoundingBox`. | George Karian | Purely cosmetic offset |
| EX-02 | Standard divider position (centre of component) | Divider on the RIGHT side at `right: calc(indicator/2)` | Label-left/indicator-right layout means the divider must track the right indicator column, not the component centre. This is a vertical-stepper-specific exception. | George Karian | No accessibility or engineering impact |

### Source conflicts

| ID | Subject | Source A | Source B | Resolution |
|---|---|---|---|---|
| SC-01 | Active card border width | Figma-generated Tailwind code: `border-[length:var(--border-width\/2,2px)]` = 2px | Live Figma `strokeWeight` + Venus master file: 1.5px | **1.5px wins.** Figma generates Tailwind `border-width/2` because `border-width/2` is a Venus token variable (not Tailwind border-2). The token resolves to 2px, but the live `strokeWeight` data and master file specify 1.5px. Use `border-width: 1.5px` in CSS. |
| SC-02 | `text/brand` hex | Figma code: `#5d50bf` | Venus master file: `#6C5CE7` (purple/500) | **Master file wins.** `#6C5CE7` confirmed via `border/brand` variable binding in live read. |
| SC-03 | Figma demo dimensions | `absoluteBoundingBox` shows `235×522px` with 4 steps | Component description says `280px` default width, `auto` height | **Description wins.** The 235×522 measurement is a design-canvas demo instance at a specific size. Production default is 280px wide, auto height. The CSS `width` prop defaults to `17.5rem`. |

### Open questions

NONE — all requirements are decision-complete.

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma URL contains the final component `node-id` (`1687-51666`).
- [x] Design context read via `Figma:get_design_context` before supplemental extraction.
- [x] Live structural data read via `figma_get_component_for_development` — absolute coordinates used to calculate exact divider position.
- [x] Component descriptions read for both `Stepper/Vertical` and `_Internal/Stepper/Step`.
- [x] Documentation frame (`1706:53362`) referenced.
- [x] Mode (NEW) and scope explicit.
- [x] Anatomy, API, Figma→React mapping (incl. unmapped design and code properties), states, behavior, interactions, responsiveness, tokens, assets, accessibility, stories, and tests complete.
- [x] Stable element keys used throughout.
- [x] Every conditional element has presence and absence test coverage (Section 16).
- [x] Every story has exact args, environment, assertions, and visual/a11y decisions.
- [x] Dynamic geometry: divider CSS formula derived from live measurements — `right: calc(var(--stepper-indicator-size) / 2)` with `translateX(50%)`. JS tracking not required.
- [x] SC-01, SC-02, SC-03 source conflicts recorded and resolved.
- [x] `unresolved_question_count: 0` matches Section 17.
- [ ] Validator not run in this context — run `python3 <skill-path>/scripts/validate_handover.py` before engineering hand-off.

### Sign-off

| Role | Name | Status | Date | Notes |
|---|---|---|---|---|
| Design | George Karian | PENDING | — | Author of Venus 2.1 RF. All decisions trace to build session 2026-07-22. |
| Product | N/A | N/A | — | Design system component |
| Accessibility | Accessibility Lead | PENDING | — | Review Section 14 keyboard contract (ArrowDown/Up primary), contrast ratios, focus ring scope |
| Engineering | Engineering Lead | PENDING | — | Review Section 10 (divider CSS formula), Section 13 (active card FILL vs HUG), SC-01 (1.5px border) |
