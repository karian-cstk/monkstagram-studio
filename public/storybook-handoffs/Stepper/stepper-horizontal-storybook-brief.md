---
brief_schema: venus-storybook-handover/v2
component_name: "StepperHorizontal"
component_kebab_case: "stepper-horizontal"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=1687-51569"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "1687:51569"
figma_branch_or_version: "main"
figma_verified_at: "2026-07-23T00:00:00+05:30"
target_repository: "contentstack-design-system"
target_package: "@contentstack/venus-components"
target_storybook_title: "Navigation/StepperHorizontal"
brief_owner: "George Karian"
required_approvers: ["George Karian (Design)", "Accessibility Lead", "Engineering Lead"]
approval_date: "PENDING"
---

# StepperHorizontal — Storybook Engineering Handover

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/commit/date | What it establishes |
|---|---|---|---|
| Figma `get_design_context` | node `1687:51569` | 2026-07-23 | Full Figma-generated reference code, component hierarchy, all token bindings, auto-layout structure for `Stepper/Horizontal` |
| Figma `figma_get_component_for_development` | node `1689:51842` | 2026-07-23 | Complete 20-variant COMPONENT_SET data with `componentPropertyDefinitions`, all 20 variant measurements, absolute bounding boxes, all fill/stroke variable bindings verified live |
| Figma component description | node `1687:51569` and `1689:51842` | 2026-07-23 | Authoring intent, engineering props interface, ARIA structure, step setup procedure, design governance notes |
| Figma documentation link | node `1706:53362` | 2026-07-23 | Full 9-section documentation frame: Overview, When to Use, Variants, Properties, Tokens, Accessibility, Anatomy |
| Venus 2.1 RF master file | `venus-21-rf-master.md` in project knowledge | 2026-07-22 | Token values, alias chain, resolved contradictions, API gotchas |
| Project session history | Stepper build transcript 2026-07-22 | 2026-07-22 | All architectural decisions made during build, reasons for each, mistakes corrected — including label position, divider line architecture, truncation order, active-card dimensions |
| Storybook briefs (prior session) | `stepper-horizontal-storybook-brief.md` | 2026-07-22 | Baseline story coverage and CSS implementation notes — used as cross-reference, superseded by this document where conflicts exist |

### Source precedence

1. Figma live data (component description + `get_design_context`) — establishes definitive structure, token IDs, and prop interface
2. Venus 2.1 RF master file — authoritative for token values, red lines, and governance rules
3. Session build transcript — authoritative for architectural decisions and their rationale
4. Prior storybook brief — supplemental; used to cross-check stories and CSS patterns only

Where Figma-generated code and the master file disagree, the master file wins (e.g. `border/brand` stroke-weight on Active card: Figma code renders `border-2` = 2px, master file specifies 1.5px — **1.5px is correct** per master; see SC-01 in Section 17).

---

## 1. Outcome and scope

**Definition:** `StepperHorizontal` is a horizontally-oriented multi-step progress indicator that distributes steps equally across its container width, communicating a user's current position, completed progress, and any step-level errors in a sequential workflow.

**User need:** A content editor, developer, or administrator navigating a multi-step wizard (import, onboarding, setup) needs to see at a glance which steps are done, which is current, and which remain — and optionally navigate back to completed steps — without interrupting their primary workflow.

### Use cases

| ID | Use case | Context | Success outcome |
|---|---|---|---|
| UC-01 | Linear wizard flow | Multi-step modal or full-page form (import wizard, data migration, project setup) | User always knows which step is active, how many are left, and that prior steps are complete |
| UC-02 | Non-linear review | Complex form where all steps are independently revisitable after initial completion | User can jump to any step; focus lands correctly on the activated step |
| UC-03 | Step-level error feedback | Form validation reveals an error on a previously-completed step | User sees the error indicator (dot + red description) and knows which step to return to |
| UC-04 | Keyboard-only navigation | Power user navigating a wizard without a mouse | Focus ring visible on each step; arrow keys move between interactive steps; Enter/Space activates |
| UC-05 | Read-only progress display | Progress display in a header bar where no step interaction is needed | Steps rendered as non-interactive; `isNonLinear=false`; no keyboard role on individual steps |

### Scope

| In scope | Out of scope |
|---|---|
| `StepperHorizontal` root component | `StepperVertical` (separate component, separate brief) |
| `_StepperStep` internal atom (horizontal orientation) | Step content panels / accordions triggered by step activation |
| All 5 step states: Default, Active, Completed, Disabled, Error | Animated step transitions beyond CSS property transitions |
| Both indicator types: Icon and Counter | Drag-to-reorder steps |
| Linear and non-linear interaction modes | Custom step indicator content (beyond icon/counter) |
| Focus ring, keyboard navigation, screen reader support | Vertical layout |
| Dark mode parity | Responsive breakpoint changes to step layout |

### Responsibility boundary

| Component owns | Consumer owns |
|---|---|
| Rendering all step states, the divider line, equal-width distribution | Supplying `steps` array with correct `state` values |
| Focus ring visibility on keyboard navigation | Calling `onStepClick` to update `currentStep` in state |
| ARIA `nav > ol > li` structure with `aria-current` | Setting `accessibleLabel` per step ("Step N: [title] ([state])") |
| `opacity: 0.40` on disabled steps | Deciding when `isNonLinear` applies |
| Error dot + destructive description text | Providing meaningful `title` and `description` strings |

---

## 2. Existing baseline and change contract

N/A — new component.

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Compound component. `StepperHorizontal` is the shell. `_StepperStep` is an internal atom (not exported). Divider line is a single `<div>` rendered by the shell, positioned via `position: absolute`. Steps slot receives `_StepperStep` instances as `children` via JSX. |
| Existing components to reuse | `Badge` (for `dot/sm/error` on Error state indicator). Icon system (`_Internal/Icon-Wrapper` equivalent) for check/close icons in Completed/Error indicator. No other Venus components are direct children — `Icon Button` from Figma is the design-time placeholder; the indicator renders as a styled div in React. |
| Code Connect mappings | None yet. This is the first implementation. |
| Hooks/utilities/providers | None required. `currentStep` is externally controlled. |
| Existing tokens/icons/assets | All fills/strokes consume CSS custom properties from the Venus token pipeline (see Section 13). Check icon (Completed) and Close icon (Error) must be exported from the Figma file as SVGs and committed to the repository — do not use URLs from the Figma asset server in production code. |
| Genuinely new surface | `StepperHorizontal`, `_StepperStep` — both new. `stepper-divider-line` positioning pattern (ABSOLUTE behind a flex slot) is new to the codebase. |
| Prohibited reimplementation | Do not reimplement `Badge` for the error dot. Do not reimplement the Venus focus ring pattern — use CSS `outline` on `:focus-visible`. |

---

## 4. Anatomy

| element_key | Human name | Parent | Required/conditional | Condition | Source | Interactive | Figma reference | Semantic/testing requirement |
|---|---|---|---|---|---|---|---|---|
| `root` | Stepper root | N/A | Required | Always | Component | No | node `1687:51569` | `<nav aria-label="Progress">` — landmark for screen readers |
| `divider` | Divider line | `root` | Required | Always | Internal | No | node `1687:51522` (`stepper-divider-line`) | `aria-hidden="true"`. `position: absolute`, `z-index: 0`. Do not move — y position is design-maintained. CSS: `top: 50%; transform: translateY(-50%)` relative to indicator row centre |
| `steps-list` | Steps container | `root` | Required | Always | Internal / slot | No | node `1687:51523` (`steps`) | `<ol role="list">`. `display: flex; flex-direction: row; width: 100%; position: relative; z-index: 1` |
| `step` | Individual step | `steps-list` | Required (≥2) | `steps.length ≥ 2` | `_StepperStep` atom | Conditional | node `1689:51842` children | `<li role="listitem">`. `flex: 1; min-width: 0` |
| `step-focus-ring` | Focus ring | `step` | Conditional | `hasFocus=true` (keyboard only) | Internal | No | e.g. node `1687:51399` | CSS `outline: 2px solid var(--focus-ring-color); outline-offset: 2px; border-radius: var(--radius-2)`. Controlled by `:focus-visible` only — **never a DOM node in React** |
| `step-active-card` | Active card wrapper | `step` | Required | Always (transparent on non-Active) | Internal | No | e.g. node `1687:51400` (Default), `1687:51413` (Active) | `display: flex; flex-direction: column; align-items: center`. Active only: `border: 1.5px solid var(--border-brand); border-radius: var(--radius-8); background: var(--surface-raised)`. Provides the z-index above the divider line on Active steps. |
| `step-indicator-wrap` | Indicator wrapper | `step-active-card` | Required | Always | Internal | No | e.g. node `1687:51401` | `position: relative; width: 2rem; height: 2rem; flex-shrink: 0` |
| `step-indicator` | Indicator circle/square | `step-indicator-wrap` | Required | Always | Internal | No | e.g. node `1687:51402` | `display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: var(--radius-8)`. Fills and strokes vary by state (see Section 13). |
| `step-icon` | Icon inside indicator | `step-indicator` | Conditional | `type='icon'` and state is Default/Active/Completed/Error | Asset (SVG) | No | e.g. node `I1687_51402-1165_48958` | `width: 1rem; height: 1rem`. Color set via CSS `fill` or mask on SVG. `aria-hidden="true"` |
| `step-number` | Counter text | `step-indicator` | Conditional | `type='counter'` | `stepNumber` prop | No | e.g. node `1687:51469` | `font-family: var(--font-family-primary); font-size: var(--font-size-13); font-weight: var(--font-weight-medium); line-height: 1.3; white-space: nowrap` |
| `step-notif-dot` | Error notification dot | `step-indicator-wrap` | Conditional | `state='error'` | `Badge` or internal | No | node `836:5602` | `position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--border-destructive); border: 1.5px solid var(--surface-raised)`. `aria-hidden="true"` — error communicated semantically via `accessibleLabel` and `step-description` |
| `step-label-group` | Label container | `step-active-card` | Required | Always | Internal | No | e.g. node `1687:51408` | `display: flex; flex-direction: column; gap: var(--space-2); align-items: center; text-align: center; width: 100%; overflow: hidden; padding-top: var(--space-8)`. Active: `padding-top: 0` (label is beside indicator, not below) |
| `step-title` | Step title | `step-label-group` | Conditional | `hasTitle=true` | `title` prop | No | e.g. node `1687:51409` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%`. Single line only. See Section 12 for typography tokens. |
| `step-description` | Step description | `step-label-group` | Conditional | `hasDescription=true` | `description` prop | No | e.g. node `1687:51410` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%`. Single line only. |

---

## 5. Public React API

### Props

| Prop | Exact TypeScript type | Required | Default | Allowed values/range | Behavior | Controls | Validation/coercion | Storybook control | Update marker |
|---|---|---|---|---|---|---|---|---|---|
| `steps` | `StepperStepConfig[]` | Yes | — | Array, min length 2 | Each element maps to one `_StepperStep` instance. Derived `state` from `currentStep` unless overridden per-step. | `steps-list`, all `step` nodes | Warn in dev if `steps.length < 2` | object (array) | NEW |
| `currentStep` | `number` | No | `0` | `0` to `steps.length - 1` | Marks step at index as Active; all lower indices become Completed; all higher remain Default unless overridden by per-step `state` | `step-active-card`, `step-indicator` | Clamped silently to valid range; warn in dev if out of bounds | number | NEW |
| `isNonLinear` | `boolean` | No | `false` | `true \| false` | When `true`: all steps respond to click/keyboard activation; use `<button>` as the step element. When `false`: only display; use `<div>`. | `step` element type, keyboard handler | None | boolean | NEW |
| `type` | `'icon' \| 'counter'` | No | `'counter'` | `'icon'`, `'counter'` | Applied uniformly to all steps. `'icon'` renders a 16px SVG icon; `'counter'` renders the step number. | `step-indicator` contents | None | select | NEW |
| `onStepClick` | `(index: number) => void` | No | `undefined` | Function | Fires when a step is clicked or activated via keyboard. Only fires when `isNonLinear=true`. Consumer updates `currentStep` in response. | `step` event handler | Silently ignored when `isNonLinear=false` | — (action) | NEW |
| `className` | `string` | No | `undefined` | Any string | Appended to the root `<nav>` element's `className`. | `root` | None | text | NEW |
| `style` | `React.CSSProperties` | No | `undefined` | Any valid CSS | Applied to root `<nav>`. Consumer can override width. | `root` | None | object | NEW |
| `data-testid` | `string` | No | `undefined` | Any string | Applied to root `<nav>` for test selection. | `root` | None | text | NEW |

#### `StepperStepConfig` type

```typescript
interface StepperStepConfig {
  /** Primary label. Single line; truncates with ellipsis if overflowing. */
  title: string;
  /** Secondary label. Single line; truncates. Shown when hasDescription=true (default). */
  description?: string;
  /** Explicit state override. If omitted, state is derived from currentStep. */
  state?: 'default' | 'active' | 'completed' | 'disabled' | 'error';
  /** Counter type only. Auto-incremented (index+1) when omitted. */
  stepNumber?: string;
  /**
   * Full screen reader label. Required for accessibility.
   * Format: "Step N: [title] ([state])".
   * Example: "Step 2: Map fields (current step)"
   * Default auto-generated as "Step [N+1]" — always supply explicit value for full context.
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
| `onStepClick` | User clicks an interactive step (button), or presses Enter/Space on a focused step button | `(index: number) => void` | `index`: 0-based step index | Once per user interaction; no debounce required | `isNonLinear=false`; `state='disabled'`; `state='active'` (already current) |

### API mechanics

| Concern | Contract |
|---|---|
| Controlled/uncontrolled state | Fully controlled. `currentStep` must be managed externally. Component derives display state from it. There is no internal `useState` for step position. |
| Internal state and initialization | No internal state for step position. Internal state limited to: focus tracking for keyboard interaction (managed entirely via CSS `:focus-visible`). |
| Prop changes after mount | Changing `currentStep` updates the displayed Active step immediately. Changing `steps` length or content re-renders all steps. |
| Ref forwarding | `React.forwardRef` — forwards `ref` to the root `<nav>` element. |
| Native DOM props | `className`, `style`, `data-testid` are spread onto the root `<nav>` only. No other native props are spread to inner elements. |
| `className`, `style`, `id`, `data-*` | `className` and `style` apply to root `<nav>`. `id` and `data-*` passed as-is to root. |
| Form integration | N/A — not a form control. |

### Invalid combinations

| Combination | Valid | Required result | Warning/error |
|---|---|---|---|
| `steps.length < 2` | No | Component renders with a single step (degenerate state) | `console.warn` in dev: "StepperHorizontal requires at least 2 steps." |
| `currentStep` out of bounds | No | Clamp to `[0, steps.length - 1]` | `console.warn` in dev |
| `onStepClick` without `isNonLinear=true` | No | Callback silently ignored | `console.warn` in dev: "onStepClick has no effect when isNonLinear=false" |
| `type='icon'` with no icon asset available | No | Render placeholder (empty indicator) | `console.warn` in dev: "Icon assets not provided for step N" |
| `state='active'` on more than one step | No | Only the first active step in array order renders as Active; subsequent ones fall back to `'default'` | `console.warn` in dev |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop(s) | Mapping rule | React default | Transformation/notes |
|---|---|---|---|---|---|
| `steps` (SLOT) | `_Internal/Stepper/Step` instances | `steps: StepperStepConfig[]` | direct | `[]` (required) | In Figma: a slot frame. In React: the steps array is mapped to `_StepperStep` instances rendered as `<li>` children |
| `isNonLinear` (BOOLEAN) | `false \| true` | `isNonLinear: boolean` | direct | `false` | 1:1 mapping |
| `Orientation` (VARIANT on atom) | `Horizontal \| Vertical` | N/A on `StepperHorizontal` | N/A — fixed to Horizontal | `'horizontal'` (implicit) | `StepperHorizontal` only ever uses `Orientation=Horizontal` atom variants |
| `Type` (VARIANT on atom) | `Icon \| Counter` | `type: 'icon' \| 'counter'` | case/format transform | `'counter'` | PascalCase → lowercase |
| `State` (VARIANT on atom) | `Default \| Active \| Completed \| Disabled \| Error` | `steps[n].state` + `currentStep` | case/format transform + default fallback | `'default'` (derived) | PascalCase → lowercase; if `state` is omitted from a step config, it's derived from `currentStep` |
| `hasFocus` (BOOLEAN on atom) | `false \| true` | N/A — maps to CSS `:focus-visible` | N/A | `false` (implicit) | **Never a real prop.** In Figma: a boolean to demo the focus ring. In React: `outline` applied via `:focus-visible` on the step button |
| `hasTitle` (BOOLEAN on atom) | `false \| true` | `steps[n].hasTitle` | direct | `true` | Controls visibility of `step-title` |
| `hasDescription` (BOOLEAN on atom) | `false \| true` | `steps[n].hasDescription` | direct | `true` | Controls visibility of `step-description` |
| `stepNumber` (TEXT on atom) | `"1"`, `"2"`, etc. | `steps[n].stepNumber` | direct | Auto-incremented (`String(index + 1)`) | Counter type only |
| `title` (TEXT on atom) | `"Step title"` | `steps[n].title` | direct | Required | Primary step label; required in `StepperStepConfig` |
| `description` (TEXT on atom) | `"Optional description"` | `steps[n].description` | direct | `undefined` | Secondary line; omit entirely to hide description |
| `accessibleLabel` (TEXT on atom) | `"Step 1"` | `steps[n].accessibleLabel` | direct | Auto-generated `"Step [N+1]"` | Full value e.g. `"Step 2: Map fields (current step)"` expected; auto-generated default is minimal |

### Unmapped design properties

| Property/variation | Reason | Resolution |
|---|---|---|
| `stepper-divider-line` y position | Designer-maintained in Figma; not a configurable prop | Fixed in CSS via `top: 50%` on the divider element; consumer cannot override |
| `accessibleLabel` on `Stepper/Horizontal` root | Figma description uses `aria-label="Progress"` on the `<nav>` | Hardcoded as `"Progress"` by default; expose as `aria-label` prop if consumer needs to localise or override |

### Unmapped code properties

| Prop/behavior | Still used in consuming code? | Resolution |
|---|---|---|
| N/A | N/A — new component with no prior code | N/A |

---

## 7. Variants, states, and precedence

| State/variant | Category | Trigger/prop | Valid with | Invalid with | Visual difference/reference | Behavior/DOM difference | Required story |
|---|---|---|---|---|---|---|---|
| `default` | Base | `steps[n].state='default'` or derived from `currentStep` | All types | — | White indicator + `border/default` 1px. Title: `text/default`. node `1687:51510`/`1687:51515` | `<div>` (linear) or `<button>` (non-linear). `aria-disabled="true"` when `isNonLinear=false` on future steps | `Default` |
| `active` | Public interaction | `steps[n].state='active'` or `currentStep` index | All types | Cannot co-exist with another `active` step | Active card visible (`border/brand` 1.5px, `surface/raised` bg, `radius/8`). Title: `text/brand`, Semi Bold. Indicator: `surface/brand/inactive` fill + `border/brand` stroke. nodes `1687:51511`/`1687:51516` | `<div role="presentation">` — not a button. `aria-current="step"` on the `<li>`. | `ActiveStep` |
| `completed` | Public interaction | `steps[n].state='completed'` or derived (index < `currentStep`) | All types | — | Indicator: `action/primary` fill (purple). White check icon (Icon type) or white number (Counter). Title: `text/default`. nodes `1687:51512`/`1687:51517` | `<button>` only if `isNonLinear=true`. | `CompletedSteps` |
| `disabled` | Validation | `steps[n].state='disabled'` | All types | Cannot be the `active` step | Full root `opacity: 0.40`. All fills and text muted. nodes `1687:51513`/`1687:51518` | `<div aria-disabled="true">` regardless of `isNonLinear`. `pointer-events: none`. | `DisabledStep` |
| `error` | Validation | `steps[n].state='error'` | All types | — | Indicator unchanged (white + `border/default`) + red dot (Badge/dot/sm/error) at top-right (-3, -3). Description text: `text/destructive`. nodes `1687:51514`/`1687:51519` | Same interactivity as `default`. Error must also be communicated via `accessibleLabel` and `description`. | `ErrorStep` |
| `type='icon'` | Base variant | `type` prop | All states | — | 16px icon rendered in indicator. Figma uses `_Internal/Icon-Wrapper/16px`. | No behavioral difference. | `IconType` |
| `type='counter'` | Base variant | `type` prop | All states | — | Step number text rendered in indicator with Label/LG typography. | No behavioral difference. | `Default` (default type) |
| `isNonLinear=true` | Interaction mode | `isNonLinear` prop | All states except `disabled` | — | No visual change. | All non-disabled steps rendered as `<button>`. `onStepClick` fires on click/Enter/Space. Arrow keys navigate between steps. | `NonLinear` |

### State precedence

| Higher state | Lower state | Result |
|---|---|---|
| `disabled` | Any other state | `disabled` wins — step always renders at 40% opacity, never interactive |
| Per-step `state` override | Derived from `currentStep` | Explicit `state` in `StepperStepConfig` takes precedence over `currentStep` derivation |
| `active` (first in array) | `active` (second in array — invalid) | First active wins; subsequent active steps fall back to `default`; dev warning emitted |

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure/fallback |
|---|---|---|---|---|
| BR-01 | `isNonLinear=false`, `currentStep=1` | Component mounts | Steps 0 is `completed`, step 1 is `active`, steps 2+ are `default`. Steps 2+ render as `<div aria-disabled="true">` | — |
| BR-02 | `isNonLinear=true` | User clicks step at index 2 | `onStepClick(2)` fires. Consumer updates `currentStep=2`. Component re-renders. | If `onStepClick` is not provided, click is a no-op with no error |
| BR-03 | Any step | `state='disabled'` | Step is `pointer-events: none`. No keyboard focus. `aria-disabled="true"`. `opacity: 0.40`. | — |
| BR-04 | `type='counter'` step | `stepNumber` is omitted | Auto-assigned as `String(index + 1)` | — |
| BR-05 | Any step title | Title text overflows step cell | Title truncates with ellipsis at the right edge. Never wraps to a second line. | `min-width: 0` on the step cell is required to enable truncation inside a flex container |
| BR-06 | `state='error'` step | Component renders | Red notification dot positioned at top-right of indicator (`top: -3px; right: -3px`). Description text set to `text/destructive`. Both channels required. | If `description` is omitted and state is `error`, render with dot only; do not suppress the dot |
| BR-07 | Any configuration | `steps.length > 6` | Component renders all steps (no hard cap). Labels truncate aggressively. | Emit `console.warn` in dev: "StepperHorizontal: more than 6 steps — labels may be unreadable. Consider StepperVertical." |
| BR-08 | `isNonLinear=true` | User presses ArrowRight on a focused step | Focus moves to the next non-disabled step | If at last step, focus wraps to first step |
| BR-09 | `isNonLinear=true` | User presses ArrowLeft on a focused step | Focus moves to the previous non-disabled step | If at first step, focus wraps to last step |
| BR-10 | Any step | `accessibleLabel` omitted | Auto-generate as `"Step ${index + 1}"`. This is a minimal fallback — always supply full label in production. | Dev warning: "accessibleLabel not provided for step N. Screen reader context will be incomplete." |

### Input and data validation

| Input | Rule | Dev warning | User-visible effect |
|---|---|---|---|
| `steps.length` | Must be ≥ 2 | `console.warn` | Single step renders; divider line may be invisible |
| `currentStep` | Must be 0 to `steps.length - 1` | `console.warn` | Clamped silently |
| Multiple `state='active'` entries | Only one allowed | `console.warn` | First active wins; rest fall back to `default` |
| `onStepClick` without `isNonLinear=true` | No-op | `console.warn` | No effect on interaction |

---

## 9. Interactions and focus

### Mouse / touch

| Interaction | `isNonLinear=false` | `isNonLinear=true` |
|---|---|---|
| Click on any non-disabled step | No-op | Calls `onStepClick(index)` |
| Click on `disabled` step | No-op | No-op (pointer-events: none) |
| Click on `active` step | No-op | No-op (already current) |
| Hover on interactive step | No visual change (no hover state defined in Figma for `isNonLinear=true`) | Cursor: `pointer`. No fill change. |

### Keyboard

| Context | Key | Result | Focus after | Prevent default |
|---|---|---|---|---|
| Any — focus on stepper | `Tab` | Focus enters stepper at first interactive step | First non-disabled step button | No |
| Step button focused | `Enter` / `Space` | Activates step; calls `onStepClick(index)` | Stays on current button | Yes (Space — prevent scroll) |
| Step button focused | `ArrowRight` | Focus moves to next non-disabled step | Next step button | Yes |
| Step button focused | `ArrowLeft` | Focus moves to previous non-disabled step | Previous step button | Yes |
| Step button focused | `Home` | Focus moves to first non-disabled step | First step button | Yes |
| Step button focused | `End` | Focus moves to last non-disabled step | Last step button | Yes |
| Any — focus on stepper | `Tab` (again) | Focus exits stepper | Next focusable element after stepper | No |
| `isNonLinear=false` | Any arrow key | No-op (no interactive steps) | — | No |

**Focus ring:** Implemented entirely via CSS `:focus-visible`. The Figma `hasFocus=true` boolean is a design-time demo only — it has no React prop equivalent. Never show focus ring on mouse click; only on keyboard tab/arrow.

---

## 10. Dynamic positioning and synchronization

| Breakpoint / container | Behavior |
|---|---|
| Any width | Component fills its container 100% (`width: 100%`). Steps share equal width via `flex: 1; min-width: 0`. |
| Narrow container (< 320px) | Labels truncate aggressively. Indicator remains 32×32px. Component does not collapse or stack. |
| Width below practical minimum (~4 steps × 80px = 320px) | Labels may be completely hidden. No special behavior — consumer is responsible for choosing the right container width. |
| Container wider than 800px | Steps spread further apart. No maximum step width is enforced. |
| Height | Fixed at 6rem (96px). Never changes. |

### Overflow

- Step labels: `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` — always single-line
- Step cell: `flex: 1; min-width: 0` — mandatory to enable truncation inside flex
- Active card: `inline-flex` (HUG width, not full step width) — sits above divider line

---

## 11. Responsive behavior

| Breakpoint / container | Behavior |
|---|---|
| Any width | Component fills its container 100% (`width: 100%`). Steps share equal width via `flex: 1; min-width: 0`. |
| Narrow container (< 320px) | Labels truncate aggressively. Indicator remains 32×32px. Component does not collapse or stack. |
| Width below practical minimum (~4 steps × 80px = 320px) | Labels may be completely hidden. No special behavior — consumer is responsible for choosing the right container width. |
| Container wider than 800px | Steps spread further apart. No maximum step width is enforced. |
| Height | Fixed at 6rem (96px). Never changes. |

### Overflow

- Step labels: `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` — always single-line
- Step cell: `flex: 1; min-width: 0` — mandatory to enable truncation inside flex
- Active card: `inline-flex` (HUG width, not full step width) — sits above divider line

---

## 12. Content, localization, and edge cases

### Localization

| Concern | Requirement |
|---|---|
| `aria-label` on root `<nav>` | Defaults to `"Progress"`. Expose as optional `aria-label` prop for localization. |
| `accessibleLabel` per step | Consumer-provided; must be in the UI language. Format: "Step N: [title] ([state])". |
| Step titles | Short strings (1–4 words recommended). Long strings truncate with ellipsis — visible characters depend on container width. |
| RTL support | LTR only in this release. RTL (Hebrew, Arabic) requires a separate pass — flex direction reversal and text-align changes are non-trivial. Out of scope. |
| Numeric step counter | `stepNumber` is a string prop — consumer can pass localized numerals (e.g. Arabic-Indic `"١"`) if needed. |

### Edge cases

| Edge | Expected behavior |
|---|---|
| `steps.length === 1` | Single step renders; divider line invisible (zero span between steps). Dev warning emitted. |
| `steps.length === 0` | Component renders empty; no steps visible. Dev warning emitted. |
| All steps `state='disabled'` | All steps at 40% opacity; no step is interactive. No `aria-current` set. |
| Step title is empty string `""` | Step-title element still renders (empty). No ellipsis. |
| Step description is empty string `""` | Description renders as empty line if `hasDescription=true`. Consumer should omit `description` to hide the line. |
| `currentStep` changes rapidly | Each change is synchronous; only the final render state matters. No debounce needed. |
| `steps` array replaced entirely | All step elements re-render. Focus is not managed by the component — consumer must manage focus if programmatic step change occurs. |

---

## 13. Tokens, typography, and assets

### Divider line dynamic geometry

The divider line is not dynamically repositioned at runtime. Its y-position is baked into CSS as `top: 50%` with a transform. The indicator is centred within the 96px step height.

**Exact implementation:**

```css
.stepper-horizontal__divider {
  position: absolute;
  /* top = vertical centre of the 96px component.
     Confirmed: Figma absoluteBoundingBox y=798 vs component y=800.
     Divider 1px at midpoint ≈ 48px from top of 96px frame.
     Using top: 50% + translateY(-50%) aligns to indicator row centre. */
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--border-default);
  pointer-events: none;
  z-index: 0;
}

.stepper-horizontal__steps {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: center;
}
```

The Active card's white `background-color` creates a visual gap-stop over the divider line — intentional, requires no JavaScript. No runtime position tracking via JS is required.

### Sizing and spacing

All dimensions verified against live Figma `absoluteBoundingBox` data.

| Element | Property | Value | CSS token | Unit preference |
|---|---|---|---|---|
| Root | height | 96px | `--stepper-height: 6rem` | rem (scales with browser text size) |
| Root | width | 100% of container | `width: 100%` | % |
| Step | flex | `flex: 1; min-width: 0` | — | — |
| Step indicator | width × height | 32 × 32px | `--stepper-indicator-size: 2rem` | rem |
| Step indicator | border-radius | 8px | `var(--radius-8)` = `0.5rem` | rem |
| Active card | padding top/bottom | 12px | `var(--space-12)` = `0.75rem` | rem |
| Active card | padding left/right | 16px | `var(--space-16)` = `1rem` | rem |
| Active card | border-width | 1.5px | `1.5px` | px (sub-pixel; rem would cause rendering inconsistency) |
| Active card | border-radius | 8px | `var(--radius-8)` = `0.5rem` | rem |
| Step label group | gap (title→desc) | 2px | `var(--space-2)` = `0.125rem` | rem |
| Step label group | padding-top (non-Active) | 8px | `var(--space-8)` = `0.5rem` | rem |
| Error dot | top | -3px | `-3px` | px |
| Error dot | right | -3px | `-3px` | px |
| Error dot | size | 8×8px | `8px` | px |
| Error dot | border (separator ring) | 1.5px solid `surface/raised` | `1.5px` | px |
| Focus ring | offset | 2px | `2px` | px (structural; not scaled with text) |
| Focus ring | stroke | 2px | `2px` | px |
| Focus ring | border-radius | 2px | `var(--radius-2)` = `0.125rem` | rem |
| Divider line | height | 1px | `1px` | px (sub-pixel) |
| Icon in indicator | size | 16×16px | `1rem` | rem |

### Color tokens

| element_key | State | CSS custom property | Venus_Semantics token | Resolved (Light) | Resolved (Dark) |
|---|---|---|---|---|---|
| `step-indicator` | Default | `--surface-raised` (fill), `--border-default` (stroke 1px) | `surface/raised`, `border/default` | `#FFFFFF`, `#E5E7EB` | `#1F2937`, `#374151` |
| `step-indicator` | Active | `--surface-brand-inactive` (fill), `--border-brand` (stroke 1.5px) | `surface/brand/inactive`, `border/brand` | `#EDE9FE`, `#A78BFA` | `#2D1B69`, `#7C3AED` |
| `step-indicator` | Completed | `--action-primary` (fill) | `action/primary` | `#6C5CE7` | `#7C3AED` |
| `step-indicator` | Disabled | Same as Default, root `opacity: 0.40` | — | — | — |
| `step-indicator` | Error | Same as Default (fill unchanged) | `surface/raised`, `border/default` | `#FFFFFF`, `#E5E7EB` | — |
| `step-active-card` | Active only | `--surface-raised` (fill), `--border-brand` (stroke 1.5px OUTSIDE) | `surface/raised`, `border/brand` | `#FFFFFF`, `#A78BFA` | — |
| `step-active-card` | All others | transparent | — | — | — |
| `divider` | All | `--border-default` | `border/default` | `#E5E7EB` | `#374151` |
| `step-notif-dot` | Error only | `--border-destructive` (fill) | `border/destructive` | `#CD0200` | — |
| `step-focus-ring` | Focused | `--focus-ring-color` | `focus/ring/color` | `#6C5CE7` (purple/500) | `#8B5CF6` (purple/400) |
| `root` | Disabled step | `opacity: 0.40` | `visibility/disabled` | 0.40 | 0.40 |

### Typography

| element_key | State | Token/style | Family | Weight | Size | Line height | Letter spacing | Transform |
|---|---|---|---|---|---|---|---|---|
| `step-title` | Default / Completed / Error | `Body/SM` | Inter | Regular (400) | 13px = `0.8125rem` | 1.4 | 0 | none |
| `step-title` | Active | `Body/SM/Semi Bold` | Inter | Semi Bold (600) | 13px = `0.8125rem` | 1.3 | 0 | none |
| `step-title` | Disabled | `Body/SM` | Inter | Regular (400) | 13px = `0.8125rem` | 1.4 | 0 | none |
| `step-description` | All | `Body/XXS` | Inter | Medium (500) | 11px = `0.6875rem` | 1.3 | 0.02px | none |
| `step-number` | All | `Label/LG` | Inter | Medium (500) | 13px = `0.8125rem` | 1.3 | 0 | none |

**Text fill tokens:**

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

| Asset key | element_key | Exact source | Format | Width × height | Color behavior | Durable delivery | Alt/name behavior |
|---|---|---|---|---|---|---|---|
| `icon-check` | `step-icon` (Completed, Icon type) | Figma node `1282:35852` (Check icon) | SVG | 16 × 16px | `fill: white` (inverted mode; indicator bg is `action/primary` purple) | Export from Figma at 1×; commit to repo as `check.svg` | `aria-hidden="true"` |
| `icon-close` | `step-icon` (Error, Icon type) | Figma node `1282:35806` (Close-Noborder) | SVG | 16 × 16px | `fill: var(--text-default)` — white indicator bg | Export; commit as `close-noborder.svg` | `aria-hidden="true"` |
| `icon-circle-filled` | `step-icon` (Default/Active, Icon type) | Figma node `1282:35938` (Circle-Filled) | SVG | 16 × 16px | Default: `fill: var(--text-subtle)`. Active: `fill: var(--text-brand)` | Export; commit as `circle-filled.svg` | `aria-hidden="true"` |

---

## 14. Accessibility contract

All dimensions are verified against live Figma `absoluteBoundingBox` data.

| Element | Property | Value | CSS token | Unit preference |
|---|---|---|---|---|
| Root | height | 96px | `--stepper-height: 6rem` | rem (scales with browser text size) |
| Root | width | 100% of container | `width: 100%` | % |
| Step | flex | `flex: 1; min-width: 0` | — | — |
| Step indicator | width × height | 32 × 32px | `--stepper-indicator-size: 2rem` | rem |
| Step indicator | border-radius | 8px | `var(--radius-8)` = `0.5rem` | rem |
| Active card | padding top/bottom | 12px | `var(--space-12)` = `0.75rem` | rem |
| Active card | padding left/right | 16px | `var(--space-16)` = `1rem` | rem |
| Active card | border-width | 1.5px | `1.5px` | px (sub-pixel; rem would cause rendering inconsistency) |
| Active card | border-radius | 8px | `var(--radius-8)` = `0.5rem` | rem |
| Step label group | gap (title→desc) | 2px | `var(--space-2)` = `0.125rem` | rem |
| Step label group | padding-top (non-Active) | 8px | `var(--space-8)` = `0.5rem` | rem |
| Error dot | top | -3px | `-3px` | px |
| Error dot | right | -3px | `-3px` | px |
| Error dot | size | 8×8px | `8px` | px |
| Error dot | border (separator ring) | 1.5px solid `surface/raised` | `1.5px` | px |
| Focus ring | offset | 2px | `2px` | px (structural; not scaled with text) |
| Focus ring | stroke | 2px | `2px` | px |
| Focus ring | border-radius | 2px | `var(--radius-2)` = `0.125rem` | rem |
| Divider line | height | 1px | `1px` | px (sub-pixel) |
| Icon in indicator | size | 16×16px | `1rem` | rem |

## 15. Storybook contract

### Environment

| Field | Requirement/evidence |
|---|---|
| Story title and format | `Navigation/StepperHorizontal` — CSF3 format |
| Autodocs/docs | `tags: ['autodocs']` on the `meta` object |
| Layout/background | `layout: 'padded'` (component fills its container; centered layout would constrain width) |
| Decorators/providers | Wrap with a `div` at `width: 800px` in stories that need a fixed width reference. For narrow container tests, override to `width: 480px`. Example: `(Story) => (<div style={widthStyle}><Story /></div>)` |
| Globals: theme/locale/direction | `theme: 'light'` (default), `theme: 'dark'` for DarkMode story. LTR only. |
| Router/data/form context | None |
| Network mocks/loaders | None |
| Viewports | Desktop (1280×720) as default. Narrow (480×720) for `NarrowContainer` story. |
| Pseudo-state mechanism | CSS `:focus-visible` — use Storybook `play` function to call `element.focus()` for the `Focused` story. |
| Font/image/async readiness | Wait for Inter font and SVG icon assets to load before taking visual snapshots. |
| Snapshot motion policy | Disable all CSS transitions in snapshot mode via `@media (prefers-reduced-motion: reduce)` global in Storybook config. |

### Controls

| Prop | Control | Options/range | Default shown | Conditional behavior |
|---|---|---|---|---|
| `steps` | object (array) | — | 4-step default array | Required; must have ≥ 2 items |
| `currentStep` | number | 0 to `steps.length - 1` | `1` | — |
| `type` | radio | `'counter'`, `'icon'` | `'counter'` | — |
| `isNonLinear` | boolean | — | `false` | When `true`, enables step click interaction |
| `onStepClick` | action | — | — | Only fires when `isNonLinear=true` |
| `className` | text | — | `''` | — |

### Required stories

| Export | Expected Storybook ID | Purpose | Exact args/fixture | State/interaction | Viewport | Theme | Assertions | Visual baseline | A11y |
|---|---|---|---|---|---|---|---|---|---|
| `Default` | `navigation-stepperhorizontal--default` | Canonical 4-step render, step 2 active, Counter type | `steps: 4 steps, currentStep: 1, type: 'counter'` | Default (step 2 active) | Desktop | Light | Divider line visible; step 2 has active card border; steps 0-1 show completed style; steps 2-3 show default style | Yes | Yes |
| `IconType` | `navigation-stepperhorizontal--icon-type` | Icon indicator variant | `steps: 4 steps, currentStep: 1, type: 'icon'` | Default (step 2 active) | Desktop | Light | Check icon in step 0 (completed); circle-filled in active step; step number absent | Yes | Yes |
| `AllStates` | `navigation-stepperhorizontal--all-states` | One step per state | `steps: [completed, active, default, error, disabled], type: 'icon'` — explicit `state` per step | All 5 states in one stepper | Desktop | Light | Error dot visible on step 4; disabled step at 40% opacity; active card on step 2 | Yes | Yes |
| `NonLinear` | `navigation-stepperhorizontal--non-linear` | Interactive mode | `steps: 4, currentStep: 1, isNonLinear: true, onStepClick: action` | Non-linear; all steps clickable | Desktop | Light | Step elements render as `<button>`; `onStepClick` action logs index on click | Yes | Yes |
| `LongLabels` | `navigation-stepperhorizontal--long-labels` | Truncation boundary | `steps: 4 with 30+ char titles, currentStep: 1` | Default | Desktop | Light | Titles truncate with ellipsis; no overflow; indicator visible in all cells | Yes | No |
| `SixSteps` | `navigation-stepperhorizontal--six-steps` | Max recommended step count | `steps: 6, currentStep: 2` | 2 completed, 1 active, 3 default | Desktop | Light | All 6 indicators and labels visible | Yes | Yes |
| `ErrorState` | `navigation-stepperhorizontal--error-state` | Error feedback | `steps: 4, step 3 has state='error' with description='API connection failed'` | Error on last step | Desktop | Light | Red dot on step 3 indicator; description in `text/destructive`; no label of step changes | Yes | Yes |
| `Focused` | `navigation-stepperhorizontal--focused` | Focus ring visible | `steps: 4, currentStep: 1, isNonLinear: true`; `play: focus step-button[1]` | Step 2 focused via keyboard | Desktop | Light | Focus ring visible (2px purple outline, 2px offset); no ring on non-keyboard-focused steps | Yes | Yes |
| `NarrowContainer` | `navigation-stepperhorizontal--narrow-container` | Aggressive truncation | `steps: 4, currentStep: 1`; container `width: 480px` | Default | Narrow | Light | Labels truncate; no overflow; component height unchanged | Yes | No |
| `DarkMode` | `navigation-stepperhorizontal--dark-mode` | Dark theme parity | `steps: 4, currentStep: 1`; `theme: 'dark'` | Default | Desktop | Dark | All tokens resolve to dark mode values; no broken fills | Yes | Yes |
| `FirstStepActive` | `navigation-stepperhorizontal--first-step-active` | Edge: no completed steps | `steps: 4, currentStep: 0` | Step 1 active, steps 2-4 default | Desktop | Light | No completed indicators; divider line full width | Yes | No |
| `AllCompleted` | `navigation-stepperhorizontal--all-completed` | Edge: all completed | `steps: 4, all state='completed'` | All completed | Desktop | Light | All indicators purple with check; no active card | Yes | No |
| `DisabledStep` | `navigation-stepperhorizontal--disabled-step` | Disabled step | `steps: 4, step 2 state='disabled'` | One disabled step | Desktop | Light | Disabled step at 40% opacity; `aria-disabled` set; not focusable | Yes | Yes |

### Story documentation

| Item | Required content |
|---|---|
| Description | "A horizontal multi-step progress indicator for sequential workflows. Steps share equal width. Labels truncate on overflow. Use for wizard flows, onboarding, and multi-step forms with 2–6 steps. For more than 6 steps or sidebar contexts, use `StepperVertical`." |
| Composition | `<StepperHorizontal steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />` |
| Accessibility | "Set `accessibleLabel` on every step: 'Step N: [title] ([state])'. Active step renders `aria-current='step'`. The stepper root is a `<nav>` landmark. In non-linear mode, Tab enters the stepper; arrow keys navigate between interactive steps." |
| Design/content guidance | "Keep step titles to 1–4 words. Use counter type for numbered processes. Cap at 6 steps horizontally. Always provide `accessibleLabel` — the auto-generated fallback ('Step 1') lacks state context." |
| Migration | N/A — new component |

---

## 16. Test and visual-verification contract

### Environment

| Field | Requirement/evidence |
|---|---|
| Component/unit runner | Jest + React Testing Library (`npm test -- --testPathPattern StepperHorizontal`) |
| Story interaction runner | Storybook Test (`npx storybook test --story navigation-stepperhorizontal--*`) |
| Accessibility runner | axe-core via `@storybook/addon-a11y` (`npx storybook test --a11y`) |
| Visual-regression system | Chromatic or Percy (`npx chromatic`) |
| Browsers | Chrome (primary), Firefox, Safari |
| Device-pixel ratio | 1× and 2× |
| Global visual tolerance | 0.1% pixel diff |
| Console policy | No unexpected errors or warnings in any story |

### Per-prop verification

| Prop | Allowed values | Invalid/edge values | Omission/default test | Conditional assertion |
|---|---|---|---|---|
| `steps` | Array of `StepperStepConfig` (min 2) | Empty array, single item, items with invalid `state` | N/A (required) | Dev warning emitted on < 2 steps |
| `currentStep` | `0` to `steps.length - 1` | `-1`, `steps.length`, `NaN` | Default `0` → first step Active | Clamped silently; dev warning emitted |
| `isNonLinear` | `true`, `false` | — | Default `false` → no interactive steps | Steps render as `<button>` when `true` |
| `type` | `'counter'`, `'icon'` | — | Default `'counter'` → step numbers shown | Icon assets render when `'icon'` |
| `onStepClick` | Function | — | Omitted → no-op on click | Never fires when `isNonLinear=false` |

### Conditional element inventory

| element_key | Controlling prop/state | Presence test | Absence test |
|---|---|---|---|
| `step-active-card` (with border) | `state='active'` | `getByTestId('step-active-card').classList.contains('border-brand')` | Non-active steps: no border class |
| `step-notif-dot` | `state='error'` | `getByTestId('step-notif-dot')` present | Non-error steps: query returns null |
| `step-title` | `hasTitle=true` | `getByText('Step title')` present | `hasTitle=false`: text not in DOM |
| `step-description` | `hasDescription=true` and `description` provided | `getByText('description text')` present | `hasDescription=false` or no description: text not in DOM |
| Focus ring | CSS `:focus-visible` | After `userEvent.tab()`: `document.activeElement` matches step button; `outline` style set | After `userEvent.click()`: no visible outline on step |
| `step` as `<button>` | `isNonLinear=true` | `getAllByRole('button')` returns step elements | `isNonLinear=false`: `queryAllByRole('button')` on steps returns empty |
| `aria-current="step"` | `state='active'` | `getByRole('listitem', { current: 'step' })` | Non-active steps: `aria-current` absent or false |

### Interaction verification

| Interaction | Story | Drive | Callback assertion | DOM/state assertion | Keyboard assertion |
|---|---|---|---|---|---|
| INT-01 | `NonLinear` | `userEvent.click(stepButton[2])` | `onStepClick` called with `2` | Step at index 2 receives `aria-current="step"` after `currentStep` update | — |
| INT-02 | `Focused` | `play: stepButton[1].focus()` | — | `document.activeElement === stepButton[1]`; `:focus-visible` CSS class applied | Focus ring visible via visual snapshot |
| INT-03 | `NonLinear` | `userEvent.keyboard('{ArrowRight}')` from step 0 | — | `document.activeElement === stepButton[1]` | Focus moved |
| INT-04 | `NonLinear` | `userEvent.keyboard('{Home}')` from step 3 | — | `document.activeElement === stepButton[0]` | Focus moved to first |
| INT-05 | `DisabledStep` | `userEvent.click(disabledStep)` | `onStepClick` not called | No state change | `pointer-events: none` applied |
| INT-06 | `NonLinear` | `userEvent.keyboard('{Enter}')` on step 2 | `onStepClick` called with `2` | — | `preventDefault` called |

### Visual matrix

| Story | Viewport | Browser/DPR | Theme | Figma reference | Compared scope | Tolerance exception | Readiness |
|---|---|---|---|---|---|---|---|
| `Default` | 1280×720 | Chrome/1× | Light | node `1687:51569` | Full component | None | Inter font loaded |
| `Default` | 1280×720 | Chrome/2× | Light | node `1687:51569` | Full component | None | Inter font loaded |
| `AllStates` | 1280×720 | Chrome/1× | Light | nodes `1687:51510–51519` | Full component | None | SVG icons loaded |
| `DarkMode` | 1280×720 | Chrome/1× | Dark | node `1687:51569` | Full component | None | Inter font loaded |
| `Focused` | 1280×720 | Chrome/1× | Light | node `1687:51399` (focus-ring) | Step 2 focus ring | None | After `play` settles |
| `LongLabels` | 1280×720 | Chrome/1× | Light | — | Title truncation ellipsis | None | Inter font loaded |

### Verification commands

```text
# Unit tests
npm test -- --testPathPattern StepperHorizontal

# Storybook interaction tests
npx storybook test --story "navigation-stepperhorizontal--*"

# Accessibility
npx storybook test --a11y --story "navigation-stepperhorizontal--*"

# Visual regression
npx chromatic --only-story-names "Navigation/StepperHorizontal/*"
```

---

## 17. Decisions, conflicts, exceptions, and questions

### Confirmed decisions

| ID | Context | Decision | Owner | Date | Sections affected |
|---|---|---|---|---|---|
| DEC-01 | Active card width | Active card HUGs its content (indicator + label), NOT the full step width. The divider line covers the remainder. This creates the "gap-stopped" visual where the card floats on the line. | George Karian | 2026-07-22 | §4, §11, §13 |
| DEC-02 | Focus ring implementation | `hasFocus` Figma boolean has NO React prop equivalent. Focus ring is 100% CSS `:focus-visible`. This prevents focus ring showing on mouse click. | George Karian | 2026-07-22 | §5, §6, §14 |
| DEC-03 | `text/default` for non-Active titles | `step-title` in Default, Completed, and Error states uses `text/default` (#111827), NOT `text/subtle` (#6B7280). This creates clear title/description hierarchy. Earlier builds used `text/subtle` and were corrected mid-session. | George Karian | 2026-07-22 | §13 |
| DEC-04 | `min-width: 0` on step flex child | Required to enable text truncation inside a flex container. Without this, flex children cannot shrink below intrinsic content width. | Build session | 2026-07-22 | §10, §12 |
| DEC-05 | Divider line z-index | Divider line `z-index: 0`; steps container `z-index: 1`. Active card's white background covers the line (gap-stopped) — no JS required. | Build session | 2026-07-22 | §11 |
| DEC-06 | `opacity: 0.40` for disabled | Value is exactly 0.40 — NOT 0.5. This is a Venus 2.1 RF governance rule (`visibility/disabled` token). | George Karian | 2026-05-28 | §13 |
| DEC-07 | `aria-label="Progress"` on nav | Hardcoded English default; expose as optional prop for localisation. | Build session | 2026-07-22 | §14 |
| DEC-08 | Error indicator — colour unchanged | The step indicator fill/stroke does NOT change in Error state. Error is communicated by: (1) Badge dot (colour), (2) `accessibleLabel` (text), (3) `description` in `text/destructive` (visual). This is the Venus "3-channel error" pattern. | George Karian | 2026-07-22 | §7, §13 |
| DEC-09 | Active card border is `border/brand` not `border/emphasis` | `border/brand` (`#A78BFA` Light) is the Active indicator stroke AND the Active card stroke. Both use the same token. | Live Figma read | 2026-07-23 | §13 |
| DEC-10 | Step height `6rem` not `96px` | Step height set in `rem` to respect browser text-size preferences. `6rem = 96px` at default browser font size. | Brief authoring | 2026-07-22 | §12 |

### Approved exceptions

| ID | Normal source/rule | Override | Reason | Approver | Acceptance impact |
|---|---|---|---|---|---|
| EX-01 | All sizes must be on the 4pt grid | Error notification dot uses -3px offset (top/right) | The dot must visually overlap the indicator corner. -3px is not a 4pt grid value but it is the designed position per Figma `absoluteBoundingBox` confirmation. | George Karian | None — purely cosmetic offset |

### Source conflicts

| ID | Subject | Source A | Source B | Resolution |
|---|---|---|---|---|
| SC-01 | Active card border width | Figma-generated Tailwind code: `border-2` (2px) | Venus master file and Figma stroke data (VariableID lookup): 1.5px | **1.5px wins.** Figma API generates Tailwind `border-2` because Tailwind has no `border-[1.5px]` standard class. The live `strokeWeight` read confirms 1.5px. Use CSS `border-width: 1.5px` or a custom property. |
| SC-02 | `text/brand` resolved hex | Figma code: `#5d50bf` | Venus master file: `#6C5CE7` | **Master file wins** (`#6C5CE7` is `purple/500` Light). The Figma code appears to use an older version of the brand purple. Confirmed via `border/brand` variable binding in live read. |

### Open questions

NONE — all requirements are decision-complete.

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma URL contains the final component `node-id` (`1687-51569`).
- [x] Design context was read via `Figma:get_design_context` before supplemental extraction.
- [x] Atom component (`1689:51842`) was read via `figma_get_component_for_development` — all 20 variants verified.
- [x] Component descriptions were read from both `Stepper/Horizontal` and `_Internal/Stepper/Step`.
- [x] Documentation frame (`1706:53362`) referenced; 9 sections confirmed in context.
- [x] Mode (NEW) and scope are explicit.
- [x] Anatomy, API, Figma→React mapping (incl. unmapped design and code properties), states, behavior, interactions, responsiveness, tokens, assets, accessibility, stories, and tests are complete.
- [x] Stable element keys used throughout all sections.
- [x] Every conditional element has presence and absence test coverage (Section 16).
- [x] Every story has exact args, environment, assertions, and visual/a11y decisions.
- [x] Dynamic geometry specified (divider line: CSS-only, no JS tracking required — Section 11).
- [x] Browser, viewport, DPR, readiness, and visual tolerance are measurable (Section 16).
- [x] SC-01 and SC-02 source conflicts recorded and resolved.
- [x] `unresolved_question_count: 0` matches Section 17.
- [ ] Validator has not been run (no local repository path available in this context — run `python3 <skill-path>/scripts/validate_handover.py` before engineering hand-off).

### Sign-off

| Role | Name | Status | Date | Notes |
|---|---|---|---|---|
| Design | George Karian | PENDING | — | Author of Venus 2.1 RF; all decisions trace to session history |
| Product | N/A | N/A | — | Design system component |
| Accessibility | Accessibility Lead | PENDING | — | Review Section 14 contrast ratios and keyboard contract |
| Engineering | Engineering Lead | PENDING | — | Review Section 5 (API), Section 11 (divider CSS), SC-01 (1.5px border) |
