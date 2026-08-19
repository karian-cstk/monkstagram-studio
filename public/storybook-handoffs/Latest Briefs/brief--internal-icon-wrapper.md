---
brief_schema: venus-storybook-handover/v2
component_name: "_Internal/Icon-Wrapper"
component_kebab_case: "icon-wrapper"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=214-152884"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "214:152884"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Internal/IconWrapper"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        _Internal/Icon-Wrapper
  REACT_COMPONENT:       IconWrapper
  STORYBOOK_TITLE:       Internal/IconWrapper
  FIGMA_NODE_ID:         214:152884
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           ⚛️ Atoms (Unpublished)
  CSS_CLASS_PREFIX:      icon-wrapper
  FILE_NAME:             IconWrapper.tsx
  STORY_FILE_NAME:       IconWrapper.stories.tsx
  CSS_FILE_NAME:         IconWrapper.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
  STATUS:                Active
  ═══════════════════════════════════════════════════════════════════
-->

# _Internal/Icon-Wrapper — Storybook Engineering Handover

> **Internal component.** Not exported from the public package API. Used exclusively by Venus system components: Button, Icon Button, FAB, Hyperlink, Checkbox, Split Action Button. Do not use directly in product code.

---

## ⚠️ Absolute Requirements

These are non-negotiable. Every item must be implemented exactly as stated. Deviation breaks downstream components.

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | Wrapper dimensions must equal the `size` prop exactly — no padding, no margin, no border on the root element | 6 components size their icons by wrapping an Icon-Wrapper instance — any dimension deviation cascades |
| 2 | The icon child must fill 100% of the wrapper width and height — never shrink, never clip | Icon-Wrapper is the sole sizing mechanism in the system. The icon has no independent size |
| 3 | Root element must always carry `aria-hidden="true"` — no exceptions | Icon-Wrapper is always decorative. The parent interactive element carries the accessible name |
| 4 | Icon color must never be hardcoded — always inherit via `--venus-icon-color` CSS custom property set by the parent | Color mode is a parent-frame concern (Venus_Icons mode). Icon-Wrapper is color-agnostic |
| 5 | Focus ring must be present for all 7 size variants via CSS `:focus-visible` — not via a React prop in production | 4 of 7 Figma variants are missing the ring layer (oversight). CSS covers all sizes universally |
| 6 | `size` is the only valid way to change wrapper dimensions — `style` width/height overrides are prohibited | Prevents drift between Figma size variant and rendered dimensions |
| 7 | Component must never receive direct keyboard focus — it is non-interactive | All keyboard interaction belongs to the parent component |
| 8 | Component must not be exported from the public `@contentstack/venus-ui` package API | Internal system primitive only |

---

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/date | What it establishes |
|---|---|---|---|
| Figma design context (live read) | Node `214:152884`, ⚛️ Atoms (Unpublished) | 2026-08-11 | CSET structure, 7 size variants, component properties, children, token bindings |
| Figma design context (live read) | `placeholdder` CSET `41:490`, 7 variants | 2026-08-11 | Icon instance structure, `icon/color` fill binding (`VariableID:564:3332`) |
| Figma design context (live read) | `60px` standalone node `233:336399` | 2026-08-11 | Hero/empty-state size — outside CSET scope, not in this brief |
| `10-token-reference_skill.md` | Icon fill fix 2026-05-26 | Project knowledge | `icon/color` = `VariableID:564:3332`; stale `VariableID:60:3906` corrected system-wide |
| `04-type-and-icon_skill.md` | Icon mode table, size-to-context mapping | Project knowledge | 8 Venus_Icons modes, size-per-context |
| `venus-21-rf-master.md` | Button icon sizes, icon mode rules | Project knowledge | md=16px, lg=20px, xl=28px; mode assignments per type |
| `06-component-and-handoff_skill.md` | Icon Mode Map, Venus pre-flight | Project knowledge | All 8 mode IDs, focus ring spec |

### Source precedence

Live Figma (2026-08-11) is authoritative for structure, dimensions, and bindings. `venus-21-rf-master.md` is authoritative for token values. All code decisions in this brief are the engineer's discretion per market standards — no design approval needed on code-only decisions.

---

## 1. Outcome and scope

**Definition:** A fixed-dimension square container that sizes an icon instance and exposes it to Venus_Icons color mode switching for use inside Venus 2.1 RF system components.

**User need:** Venus system components need a single, consistent mechanism to size icons and apply the correct color mode without duplicating sizing or token logic in every component that contains an icon.

### Use cases

| ID | Use case | Context | Success outcome |
|---|---|---|---|
| UC-01 | Icon in a Button | Button sets size via variant; parent frame sets Venus_Icons mode | Icon renders at exact size with correct color for button type and state |
| UC-02 | Icon in Icon Button / FAB | Icon-only components — Icon-Wrapper is the sole content | Correct size and color at all variants |
| UC-03 | Leading/trailing icon in Hyperlink | Optional leading/trailing icons wrapped in instances | Correct Hyperlink icon size rendered |
| UC-04 | Checkbox indicator icon | Check/minus icons in Checkbox variants | Correct size and color in all checked states |

### Scope

| In scope | Out of scope |
|---|---|
| 7 CSET variants: 12 / 16 / 20 / 24 / 28 / 32 / 40px | 60px standalone (`233:336399`) — hero/empty state, separate component |
| Icon color via Venus_Icons mode (parent-driven) | Color as a direct prop on Icon-Wrapper |
| `selectIcon2` instance swap (live property) | `selectIcon` (legacy, unwired — see DEC-03) |
| `has-focus` boolean + focus ring layer | Direct keyboard focus on the wrapper |

### Responsibility boundary

| IconWrapper owns | Consumer component owns |
|---|---|
| Wrapper dimensions (width = height = size) | Setting Venus_Icons mode on parent frame |
| `aria-hidden="true"` on root | Accessible name of the interactive control |
| Rendering icon at FILL dimensions | Choosing which icon to display |
| Focus ring visibility (CSS `:focus-visible`) | Triggering the focused state |

---

## 2. Existing baseline and change contract

`N/A — new component. No prior Storybook implementation.`

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Standalone atomic wrapper — a `<span>` containing an SVG icon. No compound pattern. |
| Existing components to reuse | None — lowest-level icon primitive in the system |
| Code Connect mappings | None currently |
| Hooks/utilities/providers | None — color mode is pure CSS via custom property cascade |
| Existing tokens | `icon/color` (`VariableID:564:3332`, Venus_Icons collection); `border/focus` (`VariableID:564:3210`, Venus_Semantics) |
| Genuinely new surface | `IconWrapper.tsx`, `IconWrapper.module.css`, `IconWrapper.stories.tsx` |
| Prohibited reimplementation | Never re-implement icon color logic — always use `--venus-icon-color` cascade from parent |

### Dependency tree

| Direction | Component | Must exist before build? | Breaking if API changes |
|---|---|---|---|
| Upstream (consumes) | None | — | — |
| Downstream (consumed by) | Button, Icon Button, FAB, Hyperlink, Checkbox, Split Action Button | N/A | Any size or prop rename is a breaking change across all 6 |

---

## 4. Anatomy

`REQUIRED` = always rendered · `OPTIONAL` = prop-controlled · `INTERNAL` = never a prop

| element_key | Layer name | Visibility | Condition | RTL mirrors | Figma ref | Semantic/testing requirement |
|---|---|---|---|---|---|---|
| `root` | `icon-wrapper` | REQUIRED | Always | no | Variant frame (e.g. `214:152860`) | `<span aria-hidden="true">`, `data-testid="icon-wrapper"` |
| `icon` | `icon` (canonical — see DEC-01) | REQUIRED | Always | no | `placeholdder` / `placeholder` child INSTANCE, FILL×FILL | SVG child, `aria-hidden` inherited from root |
| `focus-ring` | `icon-wrapper__focus-ring` | INTERNAL | `:focus-visible` on parent (production) / `hasFocus=true` (Storybook) | no | Child FRAME, FIXED, size+4px | `aria-hidden="true"`, `position: absolute`, inset -2px |

---

## 5. Public React API

> **Internal component** — props are for system use only. Not in public API docs.

### Props

| Prop | TypeScript type | Required | Default | Behavior | Storybook control |
|---|---|---|---|---|---|
| `size` | `12 \| 16 \| 20 \| 24 \| 28 \| 32 \| 40` | Yes | `16` | Sets `width` and `height` of the wrapper to exactly this pixel value | select |
| `icon` | `React.ReactNode` | Yes | — | Icon SVG or icon component rendered inside wrapper at FILL dimensions | — |
| `hasFocus` | `boolean` | No | `false` | **Storybook demo only.** Shows focus ring. In production, ring is driven by CSS `:focus-visible` on the parent. Never pass as a runtime prop. | boolean |
| `className` | `string` | No | `''` | Forwarded to root `<span>` | — |

### Callbacks

`N/A — non-interactive. No callbacks.`

### API mechanics

| Concern | Contract |
|---|---|
| Controlled/uncontrolled | Stateless — no internal state |
| Prop changes after mount | `size` and `icon` changes re-render cleanly |
| Ref forwarding | `React.forwardRef` to root `<span>` |
| Native DOM props | `...rest` spread to root `<span>`. Consumers must not pass `aria-*` or `role` — always decorative |
| `className` / `style` | `className` accepted and merged. `style` **NOT** accepted — dimensions are token-driven only |
| Form integration | N/A |

### TypeScript interface

```typescript
/**
 * Internal wrapper that standardises icon dimensions and colour-mode
 * inheritance within Venus 2.1 RF system components.
 *
 * @internal — Do not use in product code. Use Button, IconButton, FAB, etc.
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=214-152884
 */
export interface IconWrapperProps {
  /** Icon size in px. Determines exact wrapper width and height. */
  size: 12 | 16 | 20 | 24 | 28 | 32 | 40;
  /** The icon SVG or icon component to render. Must be intrinsically square. */
  icon: React.ReactNode;
  /**
   * Shows the focus ring. Storybook demo only.
   * In production the ring is driven by CSS :focus-visible on the parent
   * interactive element — never pass as a runtime prop.
   * @default false
   */
  hasFocus?: boolean;
  /** Additional class forwarded to the root span. */
  className?: string;
}
```

### JSX base component

```tsx
import React from 'react';
import type { IconWrapperProps } from './IconWrapper';
import styles from './IconWrapper.module.css';

export const IconWrapper = React.forwardRef<HTMLSpanElement, IconWrapperProps>(
  ({ size = 16, icon, hasFocus = false, className, ...rest }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      data-testid="icon-wrapper"
      className={[
        styles['icon-wrapper'],
        styles[`icon-wrapper--${size}`],
        hasFocus ? styles['icon-wrapper--focused'] : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {icon}
      <span className={styles['icon-wrapper__focus-ring']} aria-hidden="true" />
    </span>
  )
);
IconWrapper.displayName = 'IconWrapper';
```

**IconWrapper.module.css:**

```css
/* Root — square, zero padding, transparent */
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
}

/* Size variants — wrapper = exact icon size, no additions */
.icon-wrapper--12  { width: 12px;  height: 12px; }
.icon-wrapper--16  { width: 16px;  height: 16px; }
.icon-wrapper--20  { width: 20px;  height: 20px; }
.icon-wrapper--24  { width: 24px;  height: 24px; }
.icon-wrapper--28  { width: 28px;  height: 28px; }
.icon-wrapper--32  { width: 32px;  height: 32px; }
.icon-wrapper--40  { width: 40px;  height: 40px; }

/* Icon child — always fills wrapper, always inherits colour */
.icon-wrapper > svg,
.icon-wrapper > img {
  display: block;
  width: 100%;
  height: 100%;
  color: var(--venus-icon-color, currentColor);
  flex-shrink: 0;
}

/* Focus ring — INTERNAL, always present in DOM, hidden by default */
.icon-wrapper__focus-ring {
  display: none;
  position: absolute;
  inset: -2px;
  border: 2px solid var(--venus-border-focus);
  border-radius: calc(var(--venus-radius-icon-wrapper, 4px) + 2px);
  pointer-events: none;
}

/* Show ring: Storybook demo (hasFocus prop → CSS class) */
.icon-wrapper--focused .icon-wrapper__focus-ring {
  display: block;
}

/* Show ring: production (parent receives :focus-visible) */
:focus-visible .icon-wrapper__focus-ring {
  display: block;
}
```

**Venus_Icons color mode → CSS (set on parent, not on Icon-Wrapper):**

```css
/* Applied to the PARENT component's root element, never to Icon-Wrapper */
[data-icon-mode="default"]   { --venus-icon-color: var(--venus-action-primary); }
[data-icon-mode="inverted"]  { --venus-icon-color: var(--venus-text-on-brand); }
[data-icon-mode="neutral"]   { --venus-icon-color: var(--venus-text-default); }
[data-icon-mode="disabled"]  { --venus-icon-color: var(--venus-text-disabled); }
[data-icon-mode="error"]     { --venus-icon-color: var(--venus-feedback-error-text); }
[data-icon-mode="success"]   { --venus-icon-color: var(--venus-feedback-success-text); }
[data-icon-mode="warning"]   { --venus-icon-color: var(--venus-feedback-warning-text); }
```

### Invalid combinations

| Combination | Valid | Required result |
|---|---|---|
| `size` not in allowed union | No | TypeScript compile error (TS2322) |
| `icon` is `null` / `undefined` | No | Render empty wrapper; `console.warn` in dev |
| `aria-hidden`, `role`, or `aria-label` via `rest` | No | Drop the prop and warn in dev |
| `style` prop with width/height | No | Drop width/height from style; warn in dev |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop | Mapping rule | React default |
|---|---|---|---|---|
| `_Internal/Icon-Wrapper/Size` (VARIANT) | `12px \| 16px \| 20px \| 24px \| 28px \| 32px \| 40px` | `size: 12 \| 16 \| 20 \| 24 \| 28 \| 32 \| 40` | Strip `px` suffix, parse to number | `16` |
| `selectIcon2#612:0` (INSTANCE_SWAP) | Any Venus icon component | `icon: React.ReactNode` | Consumer passes icon element | — |
| `has-focus#278:1556` (BOOLEAN) | `true \| false` | `hasFocus?: boolean` | Direct | `false` |
| Venus_Icons mode (set on parent frame) | 7 mode names | `data-icon-mode` attribute on parent element | N/A — parent responsibility | `default` |

### Unmapped design properties

| Property | Reason | Resolution |
|---|---|---|
| `selectIcon#610:0` (INSTANCE_SWAP) | Defined on CSET but zero references in any variant's `componentPropertyRefs` — live-verified | **DEC-03:** Legacy property, superseded by `selectIcon2`. Implement `selectIcon2` only. |
| `60px` standalone (`233:336399`) | Outside the CSET | Out of scope. Implement as a separate size extension if hero/empty-state contexts need it. |

### Unmapped code properties

`N/A — no prior implementation.`

---

## 7. Variants, states, and precedence

### Size contract (Absolute Requirement #1 — exact pixel dimensions, no exceptions)

| Size | Width × Height | Primary context in Venus |
|---|---|---|
| 12px | 12 × 12px | Badge, tag, form label sm |
| 16px | 16 × 16px | **Default.** Button md, input, list item sm, table row |
| 20px | 20 × 20px | Button lg, list item md, inline alert |
| 24px | 24 × 24px | Button xl (FAB sm), navigation primary |
| 28px | 28 × 28px | Button xl (standard) |
| 32px | 32 × 32px | Card feature |
| 40px | 40 × 40px | Empty state, hero |

### Variant cross-matrix

Single axis (Size). No multi-axis matrix.

### State table

| State | Trigger | CSS mechanism | Visual difference | Required story |
|---|---|---|---|---|
| default | Initial render | — | Transparent wrapper; icon at colour driven by `--venus-icon-color` | `Default` |
| focused | `:focus-visible` on parent (production) / `hasFocus=true` (Storybook) | Focus ring `display: block` | 2px `border/focus` ring, inset −2px | `Focused` |

No hover, active, or disabled states exist on Icon-Wrapper. All interaction states belong to the parent component.

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure mode |
|---|---|---|---|---|
| BR-01 | Any `size` prop value | Component mounts | Root `<span>` is exactly that width and height in px | `offsetWidth !== size` → layout bug in parent |
| BR-02 | `icon` is an SVG element | Component mounts | SVG fills wrapper at 100% × 100%, no overflow, no cropping | SVG retains explicit width/height attributes → breaks fill |
| BR-03 | Parent sets `data-icon-mode="inverted"` | Component renders inside parent | `--venus-icon-color` resolves to white (`var(--venus-text-on-brand)`) | Icon appears wrong colour in button |
| BR-04 | `hasFocus=true` in Storybook | Story renders | Focus ring `<span>` has `display: block`, 2px border, inset −2px | Focus ring not visible in design review |
| BR-05 | `:focus-visible` on parent in production | User keyboards to parent | Focus ring `<span>` has `display: block` via CSS cascade | Keyboard users cannot see focus state |

---

## 9. Interactions and focus

`N/A — non-interactive. Never receives direct keyboard focus.`

**Focus ring contract (Absolute Requirement #5):**

| Property | Value |
|---|---|
| CSS trigger (production) | `:focus-visible` on the nearest interactive ancestor |
| CSS trigger (Storybook) | `.icon-wrapper--focused` class (driven by `hasFocus` prop) |
| Ring element | `.icon-wrapper__focus-ring`, `aria-hidden="true"`, `position: absolute` |
| Inset | `−2px` all sides |
| Border | `2px solid var(--venus-border-focus)` → `purple/500` Light / `purple/400` Dark |
| Border radius | `component corner radius + 2px` |
| Applies to | **All 7 size variants** — CSS applies universally (Figma has the ring missing on 16/24/28px variants — that is a Figma oversight; this brief corrects it in code) |

---

## 10. Dynamic positioning

`N/A — no dynamically repositioned elements.`

---

## 11. Responsive behavior

| Constraint | Rule |
|---|---|
| Min width/height | 12px (smallest size variant) |
| Max width/height | 40px (CSET max; 60px standalone is separate) |
| Intrinsic shape | Always square — width always equals height |
| Inside auto-layout | Always `flex-shrink: 0` so it never compresses |
| Zoom | Square constraint maintained at all zoom levels |

---

## 12. Content, localization, and edge cases

| Case | Required behavior | Story |
|---|---|---|
| SVG with multiple paths | Fills wrapper, all paths inherit `--venus-icon-color` | `WithComplexIcon` |
| `icon` is null / undefined | Empty wrapper renders; `console.warn` in dev | N/A |
| RTL layout | Icon-Wrapper does not mirror. Directional icons handle mirroring on their own SVG paths | N/A |
| High contrast mode | `currentColor` on SVG fill inherits from forced-colors cascade — no override needed | N/A |

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't | Rationale |
|---|---|---|
| Pass icon size exclusively via the `size` prop | Hard-code `width` or `height` in a `style` prop | Dimensions must stay in sync with the Venus size system |
| Let the parent component set `data-icon-mode` | Pass a color prop to Icon-Wrapper | Color mode is a parent-frame concern; wrapper is colour-agnostic |
| Use CSS `:focus-visible` on the parent to show the ring | Pass `hasFocus={true}` in production code | `hasFocus` is Storybook-only; production ring is always CSS-driven |
| Pass `icon={<HomeIcon />}` without width/height attributes | Pass an SVG with explicit `width="16" height="16"` attributes | Explicit attributes override the `100%` fill and break size inheritance |
| Always apply `aria-hidden="true"` on the root | Add `role` or `aria-label` | Wrapper is always decorative; parent label carries accessible meaning |
| Use `flex-shrink: 0` when placing inside flex containers | Allow the wrapper to shrink | A compressed Icon-Wrapper clips its icon |

---

## 13. Tokens, typography, and assets

**Token chain:** `_Primitives → Venus_Semantics → Venus_Icons → component layer`. No tier skipping. No hardcoded values.

### Tokens

| element_key | Property | Token (full chain) | CSS custom property | Light value | Dark value | Opacity system |
|---|---|---|---|---|---|---|
| `icon` (SVG fill) | `color` / `fill` | `[VI] icon/color` (`VariableID:564:3332`) ← mode-resolved by Venus_Icons collection | `--venus-icon-color` (set on parent via `data-icon-mode`) | Varies by mode — see Icon mode map | Varies by mode | N/A |
| `focus-ring` | `border-color` | `[VS] border/focus` (`VariableID:564:3210`) ← `[P] purple/500` | `--venus-border-focus` | `#6C5CE7` (purple/500) | `#8B83EC` (purple/400) | N/A |

### Icon mode map (set on parent element — never on Icon-Wrapper)

| Mode name | Figma collection mode ID | `--venus-icon-color` resolves to | `data-icon-mode` value on parent |
|---|---|---|---|
| default | `564:7` | `purple/500` → `#6C5CE7` | `default` |
| inverted | `564:8` | `gray/0` → `#FFFFFF` | `inverted` |
| neutral | `564:9` | `gray/700` → `#5F5E5A` | `neutral` |
| disabled | `564:10` | `gray/400` → `#B4B2A9` | `disabled` |
| error | `564:11` | `red/600` → `#CD0200` (L) | `error` |
| success | `564:12` | `green/900` (L) | `success` |
| warning | `564:13` | `yellow/450` (L) | `warning` |

### Parent usage pattern (required in every consuming component)

```tsx
// In Button.tsx — parent sets the mode, Icon-Wrapper inherits
<button
  data-icon-mode={disabled ? 'disabled' : variant === 'primary' ? 'inverted' : 'default'}
  className={styles['button']}
>
  {hasLeadingIcon && (
    <IconWrapper size={iconSize} icon={leadingIcon} />
  )}
  {label}
</button>
```

---

## 14. Accessibility contract

| Concern | Requirement |
|---|---|
| Root element | `<span aria-hidden="true">` — always decorative |
| Accessible name | None on wrapper. Accessible name lives on the parent interactive element |
| Prohibited ARIA | `role`, `aria-label`, `aria-labelledby` must not be applied |
| Required ARIA | `aria-hidden="true"` — always present, no exceptions |
| Keyboard | Never receives focus directly — non-interactive |
| Contrast | N/A — wrapper is transparent; parent component's token contract governs icon color contrast |
| Forced colors | `currentColor` on SVG inherits from forced-colors cascade |
| Screen reader | Completely hidden from all assistive technology |

---

## 15. Storybook contract

### Environment

| Field | Requirement |
|---|---|
| Story format | CSF3 |
| Layout | `layout: 'centered'` |
| Globals | Light + Dark both required for every story |
| Decorators | None required |
| Viewports | Default (fixed-dimension component — no responsive variation) |

### Controls

| Prop | Control | Options | Default |
|---|---|---|---|
| `size` | select | `12, 16, 20, 24, 28, 32, 40` | `16` |
| `hasFocus` | boolean | `true, false` | `false` |

### Required stories

| Export | Storybook ID | Args | Theme | Key assertion |
|---|---|---|---|---|
| `Default` | `internal-iconwrapper--default` | `{ size: 16, icon: <HomeIcon /> }` | light + dark | Wrapper is exactly 16 × 16px |
| `AllSizes` | `internal-iconwrapper--all-sizes` | One wrapper per size, same icon | light + dark | Each wrapper matches its declared pixel size |
| `AllModes` | `internal-iconwrapper--all-modes` | `size: 20`, 7 parent decorators each setting `data-icon-mode` | light + dark | Icon colour matches expected token value per mode |
| `Focused` | `internal-iconwrapper--focused` | `{ size: 16, icon: <HomeIcon />, hasFocus: true }` | light + dark | Focus ring visible, 2px `border/focus` colour, inset −2px |
| `Size12` | `internal-iconwrapper--size-12` | `{ size: 12 }` | light + dark | 12 × 12px — visual regression baseline |
| `Size40` | `internal-iconwrapper--size-40` | `{ size: 40 }` | light + dark | 40 × 40px — visual regression baseline |

---

## 16. Test and visual-verification contract

### Per-prop verification

| Prop | Valid values | Invalid/edge values | Default test | Key assertion |
|---|---|---|---|---|
| `size` | `12,16,20,24,28,32,40` | Any other number | Renders at 16px | `offsetWidth === size && offsetHeight === size` |
| `icon` | Valid ReactNode | `null` | — | SVG child present, fills 100% |
| `hasFocus` | `true, false` | — | `false` → ring hidden | `true` → ring `display: block` |

### Conditional element inventory

| element_key | Controlling condition | Presence test | Absence test |
|---|---|---|---|
| `focus-ring` | `hasFocus=true` OR `:focus-visible` on parent | `display: block` | `display: none` |

### Interaction verification

`N/A — non-interactive component.`

### Visual matrix

| Story | Viewport | Theme | Figma reference | Tolerance |
|---|---|---|---|---|
| `Default` | 800 × 600 | light + dark | Node `214:152864` (16px variant) | 0.2% |
| `AllSizes` | 800 × 600 | light + dark | All 7 size variant nodes | 0.2% |
| `AllModes` | 800 × 600 | light + dark | Mode comparison | 0.2% |
| `Focused` | 800 × 600 | light + dark | Node `214:152860` (has focus ring) | 0.2% |

---

## 17. Decisions, conflicts, and resolved questions

### Confirmed decisions

| ID | Decision | Rationale | Sections affected |
|---|---|---|---|
| DEC-01 | Canonical element_key for icon child: `icon` | Figma has inconsistent layer names (`placeholdder` double-d vs `placeholder` single-d across variants). Code uses clean semantic name. Figma layer names are not authoritative for element_key. | §4, §6 |
| DEC-02 | Focus ring implemented for all 7 size variants via CSS | Figma variants 16/24/28px are missing the focus ring layer — this is an oversight. CSS `:focus-visible` applies universally. No size-specific exclusion in code. | §9, Req #5 |
| DEC-03 | `selectIcon#610:0` is a legacy property — not implemented | Live Figma read confirms zero references in any variant's `componentPropertyRefs`. `selectIcon2#612:0` is the live property in all variants. Implement `selectIcon2` only. | §6 |
| DEC-04 | `IconWrapper` not exported from public package API | Marked `🔒 Internal` in Figma description. Used only by system components. | §1, §5 |
| DEC-05 | Color mode driven by `data-icon-mode` on parent, not by Icon-Wrapper prop | Venus_Icons mode is a parent-frame concern in Figma. CSS custom property cascade replicates this pattern correctly in code. | §5, §13 |

### Rejected approaches

| ID | Approach | Why rejected | Chosen instead |
|---|---|---|---|
| REJ-01 | `colorMode` prop on Icon-Wrapper | Couples color to the wrapper — every instance would need the prop set, and the value changes per parent context | CSS custom property `--venus-icon-color` cascades from parent `data-icon-mode` attribute |
| REJ-02 | Separate component per color mode | N components × 7 modes = unsustainable | Single component, mode inherited via CSS cascade |
| REJ-03 | `style` prop for dimensions | Allows arbitrary sizing, breaks Figma/code parity | `size` prop with TypeScript union type enforces exact allowed values |

### Source conflicts

`None remaining — all resolved above.`

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma URL contains final `node-id` (214:152884)
- [x] Live design context read (2026-08-11)
- [x] Mode (NEW) and scope explicit
- [x] All absolute requirements documented and numbered
- [x] Anatomy, API, token chain, states, accessibility, stories, tests complete
- [x] Stable element keys used throughout
- [x] Every conditional element has presence and absence coverage
- [x] All stories have exact args, environment, and assertions
- [x] Dynamic geometry: N/A — confirmed
- [x] `unresolved_question_count: 0` — all decisions resolved
- [x] No hardcoded values anywhere in the brief

### Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Design | George Karian | PENDING | — |
| Engineering | Narendra | PENDING | — |
