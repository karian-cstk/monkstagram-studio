<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        Slider
  REACT_COMPONENT:       Slider
  STORYBOOK_TITLE:       Inputs/Slider
  FIGMA_NODE_ID:         716:902
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           📝 Inputs
  CSS_CLASS_PREFIX:      slider
  FILE_NAME:             Slider.tsx
  STORY_FILE_NAME:       Slider.stories.tsx
  CSS_FILE_NAME:         Slider.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-07-21
  STATUS:                Active
  VERSION:               2.1.0
  ═══════════════════════════════════════════════════════════════════
-->

# Slider — Storybook Brief

> **AI GENERATION CONTRACT**
> This brief is the sole source of truth for generating `Slider.tsx`, `Slider.css`, and
> `Slider.stories.tsx`. An AI (Claude, Cursor, Copilot) must never need to open Figma,
> ask a question, or make an assumption. Every structural, visual, behavioural, and
> accessibility decision is documented here. If something is not in this brief, it does
> not exist in the component.

---

## ⚠️ READ THIS BEFORE GENERATING — VARIANT SYSTEM EXPLAINED

The Slider has **162 Figma variants** across 3 axes. Here is what each axis means in code:

| Figma Axis | Maps to | In Code |
|---|---|---|
| `Type` | `type` prop (union) | Drives DOM structure — Range types render two thumbs |
| `Size` | `size` prop (union) | Drives CSS class + track/thumb dimensions |
| `State` | CSS pseudo-classes ONLY — **never a prop** | `hover` = `:hover`, `active` = `:active`, `focused` = `:focus-visible` |

**The State axis is never a React prop.** `Default`, `Hover`, `Active`, `Focused` are all CSS.
Only `Disabled` and `Readonly` become props because they change behaviour, not just appearance.

**The full Type union in code is:**

```typescript
type SliderType =
  | 'continuous'           // Single thumb, free value
  | 'discrete-3'           // Single thumb, 3 stops
  | 'discrete-5'           // Single thumb, 5 stops
  | 'discrete-10'          // Single thumb, 10 stops
  | 'range'                // Two thumbs, free values
  | 'range-discrete-3'     // Two thumbs, 3 stops
  | 'range-discrete-5'     // Two thumbs, 5 stops
  | 'range-discrete-10'    // Two thumbs, 10 stops
  | 'with-input';          // Single thumb + numeric Input component
```

> Note: The `/` in Figma type names (`Discrete/3`) becomes `-` in code (`discrete-3`).
> This is intentional — `/` is invalid in TypeScript union strings.

---

## BASE COMPONENT — START HERE

Before any variant, there is a base. This is the minimal, working, default-state Slider.
Every variant is this base with props applied. Build this first and verify it renders
correctly before adding any optional props.

```tsx
// Slider.tsx — minimal base (Type=continuous, Size=lg, all optionals off)
import React, { useId } from 'react';
import './Slider.css';

export const Slider = ({
  type = 'continuous',
  size = 'lg',
  label = 'Label',
  min = 0,
  max = 100,
  step,
  value,
  defaultValue = 50,
  onChange,
  disabled = false,
  readOnly = false,
  hasValueLabel = false,
  hasMarkers = false,
  hasMarkerLabels = false,
  hasLeadingIcon = false,
  hasTrailingIcon = false,
  hasHintText = false,
  leadingIcon,
  trailingIcon,
  hintText = '',
  id: externalId,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  className,
  'data-testid': testId,
}: SliderProps) => {
  const uid = useId();
  const sliderId = externalId ?? uid;
  const isRange = type.startsWith('range');
  const isDiscrete = type !== 'continuous' && type !== 'range' && type !== 'with-input';
  const computedStep = step ?? (isDiscrete ? getDiscreteStep(type, min, max) : 1);

  return (
    <div
      className={[
        'slider',
        `slider--${size}`,
        `slider--${type}`,
        disabled ? 'slider--disabled' : '',
        readOnly ? 'slider--readonly' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      data-testid={testId}
    >
      {/* Label row */}
      <div className="slider-label-row">
        <label className="slider-label" htmlFor={isRange ? undefined : sliderId}>
          {label}
        </label>
        {hasValueLabel && !isRange && (
          <span className="slider-value-output" aria-live="polite">
            {typeof value !== 'undefined' ? value : defaultValue}
          </span>
        )}
      </div>

      {/* Track row (icons + track) */}
      <div className="slider-track-row">
        {hasLeadingIcon && (
          <span className="slider-leading-icon" aria-hidden="true">{leadingIcon}</span>
        )}

        <div className="slider-track-container">
          <div className="slider-track">
            <div className="slider-track-fill" />
            {isDiscrete && hasMarkers && renderMarkers(type, min, max, computedStep)}
          </div>

          {isRange ? (
            <>
              <input
                type="range"
                id={`${sliderId}-min`}
                className="slider-thumb slider-thumb--min"
                min={min}
                max={max}
                step={computedStep}
                disabled={disabled}
                readOnly={readOnly}
                aria-label={ariaLabel ?? 'Minimum'}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={Array.isArray(value) ? value[0] : undefined}
              />
              <input
                type="range"
                id={`${sliderId}-max`}
                className="slider-thumb slider-thumb--max"
                min={min}
                max={max}
                step={computedStep}
                disabled={disabled}
                readOnly={readOnly}
                aria-label={ariaLabel ?? 'Maximum'}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={Array.isArray(value) ? value[1] : undefined}
              />
            </>
          ) : (
            <input
              type="range"
              id={sliderId}
              className="slider-thumb"
              min={min}
              max={max}
              step={computedStep}
              value={value as number | undefined}
              defaultValue={defaultValue as number}
              disabled={disabled}
              readOnly={readOnly}
              onChange={!readOnly && !disabled ? onChange : undefined}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={[ariaDescribedBy, hasHintText ? `${sliderId}-hint` : undefined]
                .filter(Boolean).join(' ') || undefined}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={typeof value === 'number' ? value : undefined}
            />
          )}
        </div>

        {hasTrailingIcon && (
          <span className="slider-trailing-icon" aria-hidden="true">{trailingIcon}</span>
        )}
      </div>

      {/* Marker labels row */}
      {isDiscrete && hasMarkers && hasMarkerLabels && (
        <div className="slider-marker-labels" aria-hidden="true">
          {renderMarkerLabels(type, min, max, computedStep)}
        </div>
      )}

      {/* Hint text */}
      {hasHintText && hintText && (
        <p id={`${sliderId}-hint`} className="slider-hint-text">
          {hintText}
        </p>
      )}
    </div>
  );
};

// Helper — derive step from discrete type
function getDiscreteStep(type: SliderType, min: number, max: number): number {
  const range = max - min;
  if (type.includes('-3')) return range / 2;   // 3 stops = 2 segments
  if (type.includes('-5')) return range / 4;   // 5 stops = 4 segments
  if (type.includes('-10')) return range / 9;  // 10 stops = 9 segments
  return 1;
}
```

---

## SECTION 1 — Purpose

The Slider lets users select a single numeric value (or a range) by dragging a thumb along
a track. It is appropriate when:

- The exact value is less important than relative position (volume, brightness, opacity)
- A bounded numeric range needs visual representation
- Filtering by a min/max range (price, date window, score)
- Precise entry is needed alongside visual control (`with-input` type)

**Do not use** when a specific known value is required and range context adds no meaning —
use a plain `Input` with `type="number"` instead.

**Discrete types** (`discrete-3`, `discrete-5`, `discrete-10`) snap to defined stops. Use for
settings with a meaningful step count (Low / Medium / High, 1–5 rating, 0–100% in 10% chunks).

---

## SECTION 2 — Anatomy → DOM Translation

Every Figma layer and its exact DOM/CSS equivalent. AI must use these names — not invented ones.

```
Figma Layer                    →  DOM element + className
──────────────────────────────────────────────────────────────────────
slider (root frame)            →  <div className="slider slider--{size} slider--{type}">
slider-label-row               →  <div className="slider-label-row">
slider-label                   →  <label className="slider-label" htmlFor={id}>
slider-value-output            →  <span className="slider-value-output" aria-live="polite">
slider-track-row               →  <div className="slider-track-row">
slider-leading-icon            →  <span className="slider-leading-icon" aria-hidden="true">
slider-track-container         →  <div className="slider-track-container">
slider-track                   →  <div className="slider-track">
slider-track-fill              →  <div className="slider-track-fill">
slider-marker                  →  <span className="slider-marker"> (×N, inside slider-track)
slider-thumb (single)          →  <input type="range" className="slider-thumb">
slider-thumb--min (range)      →  <input type="range" className="slider-thumb slider-thumb--min">
slider-thumb--max (range)      →  <input type="range" className="slider-thumb slider-thumb--max">
slider-trailing-icon           →  <span className="slider-trailing-icon" aria-hidden="true">
slider-marker-labels           →  <div className="slider-marker-labels" aria-hidden="true">
slider-marker-label            →  <span className="slider-marker-label">
slider-hint-text               →  <p className="slider-hint-text" id="{id}-hint">
slider-input-field             →  <Input /> instance (with-input type only)
slider-value-label-bubble      →  <div className="slider-value-label-bubble"> (above thumb on drag)
                                     Contains <span className="slider-value-label-text">
```

**Structural rules:**
- `slider-track-fill` sits inside `slider-track` and is positioned via CSS `left` + `width`
  calculated from `(value - min) / (max - min) * 100%`
- `slider-marker` elements are absolutely positioned inside `slider-track`
- `slider-thumb` uses native `<input type="range">` — CSS appearance reset, then re-styled
- Focus ring is CSS `::after` on `slider-thumb:focus-visible` — no DOM element
- `slider-value-label-bubble` is an absolutely-positioned overlay, not in normal flow

---

## SECTION 3 — TypeScript Props Interface

```typescript
// Slider.types.ts

export type SliderType =
  | 'continuous'
  | 'discrete-3'
  | 'discrete-5'
  | 'discrete-10'
  | 'range'
  | 'range-discrete-3'
  | 'range-discrete-5'
  | 'range-discrete-10'
  | 'with-input';

export type SliderSize = 'md' | 'lg' | 'xl';

export type SliderValue = number | [number, number]; // number for single, tuple for range

export interface SliderProps {
  // ─── VARIANT PROPS (Figma variant axes → React props) ──────────────────

  /** Slider behaviour type. Controls DOM structure and snap behaviour.
   *  Maps to Figma variant axis: Type
   *  Default: 'continuous' */
  type?: SliderType;

  /** Visual and touch-target size.
   *  Maps to Figma variant axis: Size
   *  md = 16px thumb / 4px track | lg = 20px thumb / 4px track | xl = 24px thumb / 6px track
   *  Default: 'lg' */
  size?: SliderSize;

  // ─── VALUE PROPS ────────────────────────────────────────────────────────

  /** Controlled value. number for single-thumb; [min, max] tuple for range types. */
  value?: SliderValue;

  /** Uncontrolled initial value. number for single; [min, max] tuple for range. Default: 50 */
  defaultValue?: SliderValue;

  /** Minimum value. Default: 0 */
  min?: number;

  /** Maximum value. Default: 100 */
  max?: number;

  /** Step size. If omitted: auto-derived for discrete types from step count; 1 for continuous. */
  step?: number;

  /** Change handler. Receives number for single-thumb, [number, number] for range.
   *  Not called when disabled or readOnly. */
  onChange?: (value: SliderValue) => void;

  // ─── CONTENT PROPS ──────────────────────────────────────────────────────

  /** Visible label above the track. Maps to Figma text property: label. Default: 'Label' */
  label?: string;

  /** Hint text shown below the track. Only visible when hasHintText=true. Default: '' */
  hintText?: string;

  // ─── BOOLEAN DISPLAY PROPS (Figma boolean properties) ───────────────────

  /** Shows current value above the thumb during interaction.
   *  Maps to Figma boolean property: hasValueLabel. Default: false.
   *  Force-disabled on WithInput type — Input already shows the value. */
  hasValueLabel?: boolean;

  /** Shows dot markers at each stop on discrete types.
   *  Maps to Figma boolean property: hasMarkers. Default: false.
   *  Meaningless on continuous/range/with-input — ignored. */
  hasMarkers?: boolean;

  /** Shows numeric labels below each marker. Requires hasMarkers=true.
   *  Maps to Figma boolean property: hasMarkerLabels. Default: false.
   *  Auto-suppresses when segmentWidth < labelWidth + 4px. */
  hasMarkerLabels?: boolean;

  /** Shows an icon slot before the track.
   *  Maps to Figma boolean property: hasLeadingIcon. Default: false. */
  hasLeadingIcon?: boolean;

  /** Shows an icon slot after the track.
   *  Maps to Figma boolean property: hasTrailingIcon. Default: false. */
  hasTrailingIcon?: boolean;

  /** Shows hint text below the track.
   *  Maps to Figma boolean property: hasHintText. Default: false. */
  hasHintText?: boolean;

  // ─── ICON SLOT PROPS (Figma instance swap properties) ───────────────────

  /** Icon element rendered in the leading slot. Requires hasLeadingIcon=true.
   *  Maps to Figma instance swap property: leadingIcon. */
  leadingIcon?: React.ReactNode;

  /** Icon element rendered in the trailing slot. Requires hasTrailingIcon=true.
   *  Maps to Figma instance swap property: trailingIcon. */
  trailingIcon?: React.ReactNode;

  // ─── INTERACTION STATE PROPS ─────────────────────────────────────────────

  /** Disables interaction. No hover/active response. cursor: not-allowed.
   *  Sets aria-disabled="true". Applies visibility/disabled opacity (0.40) to root.
   *  ⚠️ Uses aria-disabled, not HTML disabled — preserves focus for screen readers.
   *  Default: false */
  disabled?: boolean;

  /** Makes value read-only. Value is submitted. Thumb becomes non-interactive.
   *  Thumb, track, fill, markers → surface/control/inactive token.
   *  opacity = 1 (not dimmed — value is valid, just locked).
   *  Default: false */
  readOnly?: boolean;

  // ─── ACCESSIBILITY PROPS ────────────────────────────────────────────────

  /** Accessible label. Required when the visible label is insufficient for screen readers. */
  'aria-label'?: string;

  /** ID of element labelling this slider. Use instead of aria-label when a visible label exists. */
  'aria-labelledby'?: string;

  /** ID of element describing this slider. Automatically includes hint text ID when present. */
  'aria-describedby'?: string;

  // ─── HTML / UTILITY PROPS ───────────────────────────────────────────────

  /** HTML id. Auto-generated via useId() if not provided. */
  id?: string;

  /** Additional CSS class names. */
  className?: string;

  /** Test selector. */
  'data-testid'?: string;
}

export const SliderDefaultProps: Partial<SliderProps> = {
  type: 'continuous',
  size: 'lg',
  label: 'Label',
  min: 0,
  max: 100,
  defaultValue: 50,
  disabled: false,
  readOnly: false,
  hasValueLabel: false,
  hasMarkers: false,
  hasMarkerLabels: false,
  hasLeadingIcon: false,
  hasTrailingIcon: false,
  hasHintText: false,
};
```

---

## SECTION 4 — Figma → React Prop Mapping

**Complete, exhaustive mapping. Every Figma property. No gaps.**

| Figma Property | Figma Type | React Prop | React Type | Default | Notes |
|---|---|---|---|---|---|
| `Type` | VARIANT | `type` | `SliderType` | `'continuous'` | `/` in Figma → `-` in code |
| `Size` | VARIANT | `size` | `SliderSize` | `'lg'` | Drives CSS class + dimensions |
| `State=Default` | VARIANT | — (CSS) | — | — | No prop needed |
| `State=Hover` | VARIANT | — (CSS) | — | — | `:hover` pseudo-class |
| `State=Active` | VARIANT | — (CSS) | — | — | `:active` pseudo-class |
| `State=Focused` | VARIANT | — (CSS) | — | — | `:focus-visible` pseudo-class |
| `State=Disabled` | VARIANT | `disabled` | `boolean` | `false` | Behaviour change — needs prop |
| `State=Readonly` | VARIANT | `readOnly` | `boolean` | `false` | Behaviour change — needs prop |
| `hasValueLabel` | BOOLEAN | `hasValueLabel` | `boolean` | `false` | Force-off on `with-input` |
| `hasMarkers` | BOOLEAN | `hasMarkers` | `boolean` | `false` | Only effective on discrete types |
| `hasMarkerLabels` | BOOLEAN | `hasMarkerLabels` | `boolean` | `false` | Requires `hasMarkers=true` |
| `hasLeadingIcon` | BOOLEAN | `hasLeadingIcon` | `boolean` | `false` | Controls leading slot visibility |
| `hasTrailingIcon` | BOOLEAN | `hasTrailingIcon` | `boolean` | `false` | Controls trailing slot visibility |
| `hasFocus` | BOOLEAN | — (CSS) | — | — | Storybook demo only; maps to `:focus-visible` |
| `hasHintText` | BOOLEAN | `hasHintText` | `boolean` | `false` | Controls hint text visibility |
| `leadingIcon` | INSTANCE_SWAP | `leadingIcon` | `React.ReactNode` | — | Slot content |
| `trailingIcon` | INSTANCE_SWAP | `trailingIcon` | `React.ReactNode` | — | Slot content |

**What `hasFocus` is in Figma vs code:**
- In Figma: a boolean that shows/hides the `slider-focus-ring` layer for visual documentation
- In code: not a prop. The focus ring appears via `input[type=range]:focus-visible::after` CSS
- In Storybook: use `play: async ({ canvasElement }) => { getByRole('slider').focus() }` to demonstrate it

---

## SECTION 5 — State Behaviour

### State matrix — what changes visually

| State | Track | Fill | Thumb | Markers | How achieved in code |
|---|---|---|---|---|---|
| Default | `border/default` | `action/secondary/hover` (Continuous) | `surface/default` + `border/default` | `border/strong` stroke | No class / default CSS |
| Hover | `border/default` | `action/secondary/active` (Continuous) | `border/brand` | `action/primary` stroke | `:hover` on root |
| Active (dragging) | `border/default` | `action/primary` (Continuous) | `action/primary` fill | `action/primary` stroke | `:active` on root |
| Focused | Same as Default | Same as Default | `border/focus` ring (2px, 2px offset) | Unchanged | `:focus-visible` on `<input>` |
| Disabled | `border/disabled` | `border/disabled` | `surface/control/inactive` | `border/disabled` | `disabled` prop → `.slider--disabled` |
| Readonly | `surface/control/inactive` | `surface/control/inactive` | `surface/control/inactive` | `surface/control/inactive` | `readOnly` prop → `.slider--readonly` |

**Discrete fill rule — always `action/primary`:**
Discrete types always use `action/primary` for the fill, across all interactive states.
The continuous graduation (default → hover → active) only applies to `continuous`, `range`, and `with-input`.

**Discrete marker fill/stroke:**
- Marker fill: always `surface/default` (white)
- Active zone stroke: `action/primary` 2px INSIDE
- Inactive zone stroke: `border/strong` 2px INSIDE
- Readonly: all markers → `surface/control/inactive`
- Disabled: all markers → `border/disabled`

### Disabled vs Readonly — critical distinction

```
disabled  → aria-disabled="true" | cursor: not-allowed | opacity: var(--visibility-disabled, 0.40) on root
            No hover or active response. Value not submitted. Visually dimmed.

readOnly  → No pointer events on thumb | cursor: default | opacity: 1
            Value IS submitted. Visually unchanged (no dimming). Uses inactive token for colour.
```

### State combinations that must work

```
readOnly + hasValueLabel   → Shows value, thumb non-interactive
readOnly + hasMarkers      → Markers show, all in surface/control/inactive
disabled + hasLeadingIcon  → Icon renders in disabled (gray) mode
```

---

## SECTION 6 — Size Specification

| Property | md | lg (default) | xl |
|---|---|---|---|
| Thumb diameter | 16px | 20px | 24px |
| Track height (continuous) | 4px | 4px | 6px |
| Track height (range) | 4px | 4px | 6px |
| Icon size | 16px | 20px | 24px |
| Label font | `Label/SM` (13px) | `Label/SM` (13px) | `Label/SM` (13px) |
| Hint font | `Body/XS` (12px) | `Body/XS` (12px) | `Body/XS` (12px) |
| Marker dot diameter | 6px | 8px | 10px |

**Label font size note:** `slider-label` uses `Label/LG` (13px) across **all** sizes.
The label sits above the track, not inside the control — it does not scale with component density. This is intentional.

**Track height in Figma:** `slider-track` height is set per size. The fill rail sits
centered inside the track via `top: 50%; transform: translateY(-50%)`.

---

## SECTION 7 — Token Reference

> Token names only. Never resolve to hex. Always use CSS custom properties.
> Token chain: Component layers → Venus_Semantics → _Primitives
> **Slider uses 0 Venus_Components tokens.** All bindings → Venus_Semantics directly.

### Track tokens

| Layer | State | Token | CSS Custom Property |
|---|---|---|---|
| `slider-track` | All | `border/default` | `--border-default` |
| `slider-track-fill` | Default (Continuous) | `action/secondary/hover` | `--action-secondary-hover` |
| `slider-track-fill` | Hover (Continuous) | `action/secondary/active` | `--action-secondary-active` |
| `slider-track-fill` | Active (Continuous) | `action/primary` | `--action-primary` |
| `slider-track-fill` | All states (Discrete) | `action/primary` | `--action-primary` |
| `slider-track-fill` | Readonly (all types) | `surface/control/inactive` | `--surface-control-inactive` |
| `slider-track-fill` | Disabled (all types) | `border/disabled` | `--border-disabled` |
| `slider-track` | Disabled | `border/disabled` | `--border-disabled` |
| `slider-track` | Readonly | `surface/control/inactive` | `--surface-control-inactive` |

### Thumb tokens

| Layer | State | Token | CSS Custom Property |
|---|---|---|---|
| `slider-thumb` fill | Default | `surface/default` | `--surface-default` |
| `slider-thumb` stroke | Default | `border/default` | `--border-default` |
| `slider-thumb` stroke | Hover | `border/brand` | `--border-brand` |
| `slider-thumb` fill | Active | `action/primary` | `--action-primary` |
| `slider-thumb` focus ring | Focused | `focus/ring/color` | `--focus-ring-color` |
| `slider-thumb` | Readonly | `surface/control/inactive` | `--surface-control-inactive` |
| `slider-thumb` | Disabled | `surface/control/inactive` | `--surface-control-inactive` |

### Marker tokens

| Layer | State | Token | CSS Custom Property |
|---|---|---|---|
| `slider-marker` fill | All interactive | `surface/default` | `--surface-default` |
| `slider-marker` stroke (active zone) | Default/Hover/Active | `action/primary` | `--action-primary` |
| `slider-marker` stroke (inactive zone) | Default/Hover/Active | `border/strong` | `--border-strong` |
| `slider-marker` | Readonly | `surface/control/inactive` | `--surface-control-inactive` |
| `slider-marker` stroke | Disabled | `border/disabled` | `--border-disabled` |

### Typography + utility tokens

| Layer | Token | CSS Custom Property |
|---|---|---|
| `slider-label` | `text/default` | `--text-default` |
| `slider-label` font style | `Label/LG` (13px Medium) | `--font-label-lg` |
| `slider-value-output` | `text/subtle` | `--text-subtle` |
| `slider-hint-text` | `text/muted` | `--text-muted` |
| `slider-hint-text` font style | `Body/XS` (12px) | `--font-body-xs` |
| `slider-marker-label` | `text/muted` | `--text-muted` |
| `slider-value-label-bubble` fill | `surface/inverse` | `--surface-inverse` |
| `slider-value-label-text` | `text/inverse` | `--text-inverse` |

### Disabled root opacity

```css
.slider--disabled {
  opacity: var(--visibility-disabled, 0.40);
  cursor: not-allowed;
  pointer-events: none;
}
```

Token: `visibility/disabled` → opacity primitive `0.40`

### Focus ring specification

```css
.slider-thumb:focus-visible {
  outline: none; /* Remove native */
}

.slider-thumb:focus-visible::after {
  content: '';
  position: absolute;
  inset: -4px; /* 2px thumb border + 2px offset */
  border-radius: 50%;
  border: 2px solid var(--focus-ring-color); /* focus/ring/color = purple/500 */
  pointer-events: none;
}
```

Token: `focus/ring/color` (VariableID:564:3227) → `purple/500` Light / `purple/400` Dark

Note: Slider uses `focus/ring/color`, not `border/focus`. Both resolve to `purple/500`. The distinction is intentional — `focus/ring/color` is for circular/thumb focus indicators; `border/focus` is for rectangular trigger borders.

### with-input Input configuration

When `type === 'with-input'`, render an `<Input>` component instance alongside the track.
Pass these props to suppress all Input chrome:

```tsx
<Input
  size={size}
  hasLabel={false}
  hasHintText={false}
  hasStatusMessage={false}
  hasLabelIcon={false}
  isRequired={false}
  type="number"
  min={min}
  max={max}
  step={computedStep}
  value={typeof value === 'number' ? String(value) : undefined}
  onChange={(e) => onChange?.(Number(e.target.value))}
  disabled={disabled}
  readOnly={readOnly}
  className="slider-input-field"
/>
```

The Input's `layoutSizingVertical` is FILL — it matches track height. Do not set a fixed height.

---

## SECTION 8 — Accessibility

### ARIA role and attributes

**Single-thumb slider:**
```html
<input
  type="range"
  role="slider"
  id="{id}"
  aria-label="{label or aria-label prop}"
  aria-labelledby="{aria-labelledby prop if provided}"
  aria-describedby="{id}-hint {aria-describedby prop}"
  aria-valuemin="{min}"
  aria-valuemax="{max}"
  aria-valuenow="{currentValue}"
  aria-valuetext="{humanReadableValue}"
  aria-disabled="{disabled ? 'true' : undefined}"
  aria-readonly="{readOnly ? 'true' : undefined}"
/>
```

**Range slider (two thumbs):**
```html
<!-- Min thumb -->
<input type="range" id="{id}-min"
  aria-label="Minimum"
  aria-valuemin="{min}" aria-valuemax="{max}" aria-valuenow="{value[0]}"
  aria-disabled="{disabled ? 'true' : undefined}"
/>
<!-- Max thumb -->
<input type="range" id="{id}-max"
  aria-label="Maximum"
  aria-valuemin="{min}" aria-valuemax="{max}" aria-valuenow="{value[1]}"
  aria-disabled="{disabled ? 'true' : undefined}"
/>
```

### Keyboard navigation

| Key | Action |
|---|---|
| `ArrowRight` / `ArrowUp` | Increase value by one step |
| `ArrowLeft` / `ArrowDown` | Decrease value by one step |
| `Home` | Set to minimum |
| `End` | Set to maximum |
| `PageUp` | Increase by 10% of range |
| `PageDown` | Decrease by 10% of range |

For range sliders: `Tab` moves between min and max thumbs.

### Screen reader announcements

| State | Announcement |
|---|---|
| Focus acquired | "[label]: [value] of [max]. Slider." |
| Value changes | "[new value]" (via aria-valuenow update) |
| Discrete with labels | aria-valuetext = step label text (e.g. "Medium") |
| Disabled | "[label]: [value]. Slider. Dimmed." |
| Readonly | "[label]: [value]. Slider. Read only." |

### Contrast ratios

| Pair | Light mode | Passes |
|---|---|---|
| `slider-label` text on `surface/default` | text/default (#111827) on white = 19.1:1 | ✅ AAA |
| `slider-hint-text` on `surface/default` | text/muted (#6B7280) on white = 4.6:1 | ✅ AA |
| Thumb fill on surface/default background | white on white — contrast via 1px border | ✅ (border provides separation) |
| Focus ring on white | purple/500 (#6C5CE7) on white = 4.5:1 | ✅ AA |
| Disabled text (0.40 opacity) | Exempt — WCAG 1.4.3 exception for disabled components | ✅ Exempt |

### Touch target

Minimum touch target: 24×24px. All sizes pass:
- `md`: 16px thumb — rendered at 24px touch area via CSS padding
- `lg`: 20px thumb — rendered at 28px touch area
- `xl`: 24px thumb — at minimum; add `min-height: 44px` to slider-track-row for mobile

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .slider-track-fill,
  .slider-value-label-bubble {
    transition: none;
  }
}
```

### High contrast mode

```css
@media (forced-colors: active) {
  .slider-track { border: 2px solid ButtonText; }
  .slider-thumb { border: 2px solid ButtonText; }
  .slider-thumb:focus-visible::after { outline: 3px solid Highlight; outline-offset: 2px; }
}
```

---

## SECTION 9 — Storybook Stories

```typescript
// Slider.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { Slider } from './Slider';
import { VolumeIcon, BrightnessIcon } from '@contentstack/venus-icons';

const meta: Meta<typeof Slider> = {
  title: 'Inputs/Slider',
  component: Slider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Allows users to select a numeric value or range by dragging a thumb along a track. Use for settings where approximate values are acceptable or when filtering by a bounded range.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: [
        'continuous', 'discrete-3', 'discrete-5', 'discrete-10',
        'range', 'range-discrete-3', 'range-discrete-5', 'range-discrete-10',
        'with-input',
      ],
      description: 'Slider behaviour type. Drives DOM structure and snap behaviour.',
      table: { defaultValue: { summary: 'continuous' } },
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg', 'xl'],
      description: 'Visual and touch-target size.',
      table: { defaultValue: { summary: 'lg' } },
    },
    label: {
      control: 'text',
      description: 'Visible label above the track.',
    },
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number' } },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    hasValueLabel: { control: 'boolean' },
    hasMarkers: { control: 'boolean' },
    hasMarkerLabels: { control: 'boolean' },
    hasLeadingIcon: { control: 'boolean' },
    hasTrailingIcon: { control: 'boolean' },
    hasHintText: { control: 'boolean' },
    hintText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

// ── 1. Default ─────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    type: 'continuous',
    size: 'lg',
    label: 'Volume',
    min: 0,
    max: 100,
    defaultValue: 50,
  },
};

// ── 2. All Sizes ────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '320px' }}>
      <Slider size="md" label="Size md (16px thumb)" defaultValue={40} />
      <Slider size="lg" label="Size lg (20px thumb)" defaultValue={60} />
      <Slider size="xl" label="Size xl (24px thumb)" defaultValue={80} />
    </div>
  ),
};

// ── 3. All Types ────────────────────────────────────────────────────────────
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '360px' }}>
      <Slider type="continuous"       label="Continuous"        defaultValue={50} />
      <Slider type="discrete-3"       label="Discrete / 3"      defaultValue={50} hasMarkers />
      <Slider type="discrete-5"       label="Discrete / 5"      defaultValue={50} hasMarkers />
      <Slider type="discrete-10"      label="Discrete / 10"     defaultValue={50} hasMarkers />
      <Slider type="range"            label="Range"             defaultValue={[20, 80]} />
      <Slider type="range-discrete-3" label="Range Discrete / 3" defaultValue={[25, 75]} hasMarkers />
      <Slider type="range-discrete-5" label="Range Discrete / 5" defaultValue={[20, 80]} hasMarkers />
      <Slider type="range-discrete-10" label="Range Discrete / 10" defaultValue={[10, 90]} hasMarkers />
      <Slider type="with-input"       label="With Input"        defaultValue={42} />
    </div>
  ),
};

// ── 4. WithMarkers ──────────────────────────────────────────────────────────
export const WithMarkers: Story = {
  args: {
    type: 'discrete-5',
    label: 'Quality',
    defaultValue: 50,
    hasMarkers: true,
    hasMarkerLabels: true,
  },
};

// ── 5. WithIcons ────────────────────────────────────────────────────────────
export const WithIcons: Story = {
  args: {
    label: 'Brightness',
    defaultValue: 65,
    hasLeadingIcon: true,
    hasTrailingIcon: true,
    leadingIcon: <BrightnessIcon size={20} />,
    trailingIcon: <BrightnessIcon size={20} />,
  },
};

// ── 6. WithValueLabel ───────────────────────────────────────────────────────
export const WithValueLabel: Story = {
  args: {
    label: 'Opacity',
    defaultValue: 75,
    hasValueLabel: true,
  },
};

// ── 7. WithHintText ─────────────────────────────────────────────────────────
export const WithHintText: Story = {
  args: {
    label: 'Volume',
    defaultValue: 40,
    hasHintText: true,
    hintText: 'Affects all system sounds.',
  },
};

// ── 8. Range ────────────────────────────────────────────────────────────────
export const Range: Story = {
  args: {
    type: 'range',
    label: 'Price range',
    defaultValue: [20, 80],
    min: 0,
    max: 200,
  },
};

// ── 9. States ───────────────────────────────────────────────────────────────
// Note: Default / Hover / Active / Focused are CSS only — no prop needed.
// Only Disabled and Readonly are props.
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '320px' }}>
      <Slider label="Default" defaultValue={50} />
      <Slider label="Disabled" defaultValue={50} disabled />
      <Slider label="ReadOnly" defaultValue={50} readOnly />
    </div>
  ),
};

// ── 10. Focused ─────────────────────────────────────────────────────────────
export const Focused: Story = {
  args: {
    label: 'Volume',
    defaultValue: 50,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider');
    thumb.focus();
  },
};

// ── 11. DarkMode ────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '32px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Volume',
    defaultValue: 60,
    hasMarkers: false,
  },
};

// ── 12. FullyLoaded ─────────────────────────────────────────────────────────
// All optional elements enabled — used for visual regression
export const FullyLoaded: Story = {
  args: {
    type: 'discrete-5',
    size: 'lg',
    label: 'Compression',
    min: 0,
    max: 100,
    defaultValue: 60,
    hasValueLabel: true,
    hasMarkers: true,
    hasMarkerLabels: true,
    hasLeadingIcon: true,
    hasTrailingIcon: true,
    hasHintText: true,
    hintText: 'Higher values reduce file size at the cost of quality.',
    leadingIcon: <VolumeIcon size={20} />,
    trailingIcon: <VolumeIcon size={20} />,
  },
};

// ── 13. AsFormField ─────────────────────────────────────────────────────────
// Slider in a realistic form context with surrounding fields
export const AsFormField: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '360px' }}>
      <Slider
        label="Image quality"
        defaultValue={80}
        min={0}
        max={100}
        hasValueLabel
        hasHintText
        hintText="Higher quality = larger file size."
      />
      <Slider
        type="discrete-3"
        label="Compression level"
        defaultValue={50}
        hasMarkers
        hasMarkerLabels
      />
    </form>
  ),
};
```

---

## SECTION 10 — Implementation Notes

### 1. CSS `<input type="range">` appearance reset

The thumb is a native `<input type="range">`. Reset all browser styles before applying tokens:

```css
.slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* Track area — thumb pointer-events below */
}

.slider-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  width: var(--slider-thumb-size);
  height: var(--slider-thumb-size);
  border-radius: 50%;
  background: var(--surface-default);
  border: 1px solid var(--border-default);
  cursor: grab;
}

.slider-thumb:active::-webkit-slider-thumb {
  cursor: grabbing;
  background: var(--action-primary);
  border-color: var(--action-primary);
}
```

### 2. Track fill via CSS custom properties + JS

The fill layer cannot be done with pure CSS on a native range input across all browsers.
Use a JS-driven approach:

```tsx
const fillPercent = ((currentValue - min) / (max - min)) * 100;
// Apply via inline style or CSS custom property:
<div className="slider-track-fill"
  style={{ width: `${fillPercent}%` }}
/>
```

For range type, fill is the zone between the two thumbs:
```tsx
const fillLeft = ((values[0] - min) / (max - min)) * 100;
const fillWidth = ((values[1] - values[0]) / (max - min)) * 100;
<div className="slider-track-fill"
  style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
/>
```

### 3. Discrete snap

Discrete types use the HTML `step` attribute for native snapping. The `getDiscreteStep`
helper converts the Figma type name to the correct step value:

```typescript
// Type=Discrete/3 → 3 stops → 2 segments → step = range / 2
// Type=Discrete/5 → 5 stops → 4 segments → step = range / 4
// Type=Discrete/10 → 10 stops → 9 segments → step = range / 9
```

The Figma component shows representative values (0, 50, 100). Engineering must replace
with dynamic scale values. Marker label positions are percentages, not hardcoded pixels.

### 4. Marker label collision suppression

When the distance between markers is less than the label width + 4px, hide labels:

```typescript
const segmentWidth = trackWidth / (markerCount - 1);
const shouldShowLabels = segmentWidth >= (estimatedLabelWidth + 4);
```

### 5. value-label bubble positioning

The value label bubble (`_Internal/Slider-Value-Label`) sits above the thumb.
Position it absolutely relative to `slider-track-container`:

```css
.slider-value-label-bubble {
  position: absolute;
  bottom: calc(100% + 8px); /* 8px above thumb */
  transform: translateX(-50%);
  left: var(--thumb-position-percent);
  background: var(--surface-inverse);
  color: var(--text-inverse);
  /* Drop shadow: shadow/opacity/key token */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
  pointer-events: none;
}
```

Update `--thumb-position-percent` via JS on input change.

### 6. with-input type — no hasValueLabel

When `type === 'with-input'`, `hasValueLabel` is force-disabled. The Input component
already displays the numeric value. Setting both simultaneously creates duplicate feedback.
Enforce in code:

```typescript
const effectiveHasValueLabel = type === 'with-input' ? false : hasValueLabel;
```

### 7. Range thumb z-index collision

When both range thumbs occupy the same position, the max thumb must sit above the min:

```css
.slider-thumb--min { z-index: 3; }
.slider-thumb--max { z-index: 4; }
.slider-thumb--min:focus-visible { z-index: 5; } /* Focused thumb above sibling */
```

---

## SECTION 11 — Do / Don't

### Do

- Use `continuous` for settings where any value is valid (volume, opacity, zoom)
- Use `discrete-N` when there are meaningful named stops (Low/Medium/High)
- Use `range` for filtering bounds where both endpoints matter
- Use `with-input` when users may need to type a precise value
- Pair `hasMarkers` with `hasMarkerLabels` for accessibility — unlabelled dots alone are not descriptive
- Provide `aria-valuetext` when raw numbers are not meaningful (e.g. "Low", "Medium", "High")
- Use `readOnly` (not `disabled`) when a value exists and should be visible but not editable

### Don't

- Don't use a Slider when there are fewer than 3 meaningful options — use a `SegmentedControl` or `Select` instead
- Don't use `continuous` with a very large range without also providing `with-input` — users cannot reliably hit small target values
- Don't suppress `hasMarkers` on discrete types in production — unlabelled snap points are confusing
- Don't show marker labels without markers (`hasMarkerLabels=true, hasMarkers=false`) — the labels will float without anchor
- Don't use `hasValueLabel` and `with-input` simultaneously — handled as force-off in component
- Don't hardcode marker label text in CSS — always derive from `min`, `max`, `step` at runtime

---

## SECTION 12 — Related Components

| Component | When to use instead |
|---|---|
| `Input` (type="number") | When the user knows the exact value they want |
| `SegmentedControl` | When there are 2–5 named options with equal status |
| `Select` | When there are many discrete options that don't benefit from position context |
| `RangeFilter` (pattern) | When Slider is combined with date pickers or other range inputs in a filter panel |
| `Toggle Switch` | When the setting is binary (on/off), not a range |
