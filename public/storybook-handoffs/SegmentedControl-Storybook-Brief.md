# Segmented Control — Storybook Engineering Brief

**Design system:** Venus 2.1 RF  
**Component:** Segmented Control  
**Figma file:** M6u9MVznfNDO20b0DAC1cu  
**Figma IDs:** Container `829:71472` · Atom `_Internal/Segment` `829:70442`  
**Audit status:** Conditional pass — 1 remaining item (slot wiring, Figma UI only)  
**Version:** 2.1.0  
**Last updated:** 2026-06-01  

---

## 1. Purpose

A segmented control switches between 2–5 mutually exclusive views of the **same content**. It is a `radiogroup` pattern — one option is always selected, clicking another deselects the current one.

**Use for:** list/grid/map view toggle, density switches, filter-by-type.  
**Do not use for:** page navigation (use Tabs), binary settings (use Toggle Switch), more than 5 options (use Select).

---

## 2. Component Architecture

```
<SegmentedControl>            — radiogroup container, pill track
  └── <Segment> × N          — individual radio option (2–5)
       ├── leading icon       — optional, 16px (md) / 20px (lg)
       └── label              — Button/MD or Button/LG text style
```

The container is a fixed-width pill track. Segments are equal-width, distributing the available space via `flex: 1`. Adding a segment redistributes space across all segments equally.

---

## 3. Component Props

### `SegmentedControl`

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'md' \| 'lg'` | `'lg'` | Controls container and segment height |
| `mode` | `'labeled' \| 'icon-only'` | `'labeled'` | Labeled shows text. Icon-only shows icon only |
| `defaultValue` | `string` | first segment value | Uncontrolled initial selection |
| `value` | `string` | — | Controlled selected value |
| `onChange` | `(value: string) => void` | — | Fires when selection changes |
| `disabled` | `boolean` | `false` | Disables all segments |
| `className` | `string` | — | Root element class override |
| `children` | `ReactNode` | — | `<Segment>` children only |

### `Segment`

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | required | Unique identifier for this option |
| `label` | `string` | required | Visible text label (also used as aria-label for icon-only) |
| `icon` | `ReactNode` | — | Leading icon. Required when `mode="icon-only"` |
| `disabled` | `boolean` | `false` | Disables this segment independently |

---

## 4. Sizing Specification

| Property | md | lg |
|---|---|---|
| Container height | 40px | 48px |
| Segment height | 32px | 40px |
| Container padding (all sides) | 4px (`space/4`) | 4px (`space/4`) |
| Segment padding horizontal | 12px (`space/12`) | 16px (`space/16`) |
| Gap between segments | 2px (`space/2`) | 2px (`space/2`) |
| Icon size | 16px | 20px |
| Icon–label gap | 8px (`space/8`) | 8px (`space/8`) |
| Container corner radius | 9999px (`radius/full`) | 9999px (`radius/full`) |
| Segment corner radius | 9999px (`radius/full`) | 9999px (`radius/full`) |
| Segment width | `flex: 1` — equal distribution | `flex: 1` — equal distribution |
| Container width | Fixed (designer sets). Segments redistribute on resize | |

---

## 5. Token Map

### Container

| Property | Token | CSS Variable | Resolved (Light) |
|---|---|---|---|
| Background | `surface/sunken` | `--surface-sunken` | gray/100 #F3F4F6 |
| Border color | `border/default` | `--border-default` | gray/200 #E5E7EB |
| Border width | `border-width/1` | `--border-width-1` | 1px |
| Corner radius | `radius/full` | `--radius-full` | 9999px |
| Padding | `space/4` | `--space-4` | 4px |
| Segment gap | `space/2` | `--space-2` | 2px |

### Segment — Unselected

| State | Property | Token | Resolved (Light) |
|---|---|---|---|
| Default | Background | — | transparent |
| Default | Border | — | none |
| Default | Text color | `text/subtle` | gray/600 #4B5563 |
| Default | Icon mode | Venus_Icons `neutral` | gray/700 #374151 |
| Hover | Background | `action/ghost/hover` | purple/500 at 8% opacity |
| Hover | Text color | `text/brand` | purple/600 #5D50BF |
| Hover | Icon mode | Venus_Icons `default` | purple/500 #6C5CE7 |
| Disabled | All | Inherit default + `opacity: 0.40` | WCAG 1.4.3 exempt |

### Segment — Selected

| State | Property | Token | Resolved (Light) |
|---|---|---|---|
| Default | Background | `action/secondary/hover` | purple/100 #EDE9FE |
| Default | Border color | `border/brand` | purple/500 #6C5CE7 |
| Default | Border width | `border-width/1` | 1px |
| Default | Text color | `text/brand` | purple/600 #5D50BF |
| Default | Icon mode | Venus_Icons `default` | purple/500 #6C5CE7 |
| Default | Shadow | `Elevation/Level 1 — Raised` | 3-layer drop shadow |
| Hover | Background | `action/secondary/active` | purple/200 #DDD6FE |
| Hover | Border color | `border/brand` | purple/500 #6C5CE7 |
| Hover | Text color | `text/label` | gray/700 #374151 |
| Hover | Icon mode | Venus_Icons `neutral` | gray/700 #374151 |
| Hover | Shadow | `Elevation/Level 1 — Raised` | unchanged |
| Disabled | Background | `action/secondary/hover` | purple/100 #EDE9FE |
| Disabled | Border color | `border/disabled` | gray/200 #E5E7EB |
| Disabled | Text color | `text/disabled` | gray/400 #9CA3AF |
| Disabled | Icon mode | Venus_Icons `disabled` | gray/400 #9CA3AF |
| Disabled | Shadow | — | removed |
| Disabled | Opacity | `visibility/disabled` = 0.40 | WCAG 1.4.3 exempt |

### Text Styles

| Size | Style | Font | Size | Weight | Line-height |
|---|---|---|---|---|---|
| md | `Button/MD` | Inter | 14px | Medium 500 | 1.40 |
| lg | `Button/LG` | Inter | 16px | Medium 500 | 1.50 |

### Elevation — Selected Default + Hover

`Elevation/Level 1 — Raised` — three-layer drop shadow:
```css
box-shadow:
  0 1px 3px rgba(0,0,0,0.20),
  0 2px 2px rgba(0,0,0,0.14),
  0 0px 2px rgba(0,0,0,0.12);
```

---

## 6. Contrast Ratios (WCAG 2.2 AA)

| Pair | Ratio | Threshold | Status |
|---|---|---|---|
| Unselected default: `text/subtle` on white | 7.57:1 | 4.5:1 | ✅ Pass |
| Unselected hover: `text/brand` on ghost tint (on white) | 5.64:1 | 4.5:1 | ✅ Pass |
| Selected default: `text/brand` on `action/secondary/hover` | 5.25:1 | 4.5:1 | ✅ Pass |
| Selected hover: `text/label` on `action/secondary/active` | 7.42:1 | 4.5:1 | ✅ Pass |
| Disabled states (all) | N/A | Exempt | ✅ WCAG 1.4.3 |

---

## 7. Focus Ring

| Property | Value |
|---|---|
| Color | `focus/ring/color` → purple/500 #6C5CE7 (Light) / purple/400 (Dark) |
| Width | 2px |
| Offset | 2px outside segment boundary |
| Corner radius | 9999px (matches segment pill) |
| Visibility | Hidden by default. Shown on keyboard focus only (`:focus-visible`) |
| Implementation | `hasFocus` boolean prop in Figma. In code: CSS `:focus-visible` pseudo-class |

```css
.segment:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  border-radius: 9999px;
}
```

---

## 8. Selection Transition Animation

### Overview

When a user selects a different segment, two animations run simultaneously:

1. **Outgoing segment** (deselecting): fades from Selected → Unselected state
2. **Incoming segment** (selecting): fades from Unselected → Selected state
3. **Selection indicator pill**: slides from the outgoing segment position to the incoming segment position

The sliding pill is a background element that moves independently of the segment content — it gives the appearance of a physical selector gliding across the track. The text/icon cross-fades through the motion, removing the selected styling on the outgoing segment and applying it on the incoming one.

### Motion Tokens

| Property | Token | Value |
|---|---|---|
| Duration | `duration/base` | 200ms |
| Easing | `easing/ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |

`duration/base` (200ms) at `ease-in-out` is the correct choice for a selection control. Fast enough to feel immediate, slow enough for the spatial relationship to read. The ease-in-out curve means the pill accelerates out of its origin and decelerates into its destination — natural, physical.

### Implementation

The animation is implemented with a single absolutely-positioned **indicator pill** that slides behind the segments. Segments themselves never move — only the indicator translates.

```tsx
// Indicator pill — absolutely positioned inside the track
// Translates to the x position of the selected segment
// Width matches one segment's equal-share width

interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  size?: 'md' | 'lg';
  mode?: 'labeled' | 'icon-only';
  disabled?: boolean;
  children: React.ReactElement<SegmentProps>[];
}
```

```tsx
// Pseudocode — core animation logic
const selectedIndex = segments.findIndex(s => s.value === value);
const segmentWidth  = trackWidth / segments.length;
const indicatorX    = selectedIndex * segmentWidth;

// CSS transition on the indicator pill
// transform: translateX(indicatorX) — hardware accelerated
// transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

```css
/* Track */
.segmented-control {
  position: relative;
  display: flex;
  background: var(--surface-sunken);
  border: 1px solid var(--border-default);
  border-radius: 9999px;
  padding: 4px;
  gap: 2px;
}

/* Sliding indicator pill */
.segmented-control__indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  border-radius: 9999px;
  background: var(--action-secondary-hover);   /* purple/100 */
  border: 1px solid var(--border-brand);       /* purple/500 */
  box-shadow:
    0 1px 3px rgba(0,0,0,0.20),
    0 2px 2px rgba(0,0,0,0.14),
    0 0px 2px rgba(0,0,0,0.12);
  /* Width and transform set dynamically via JS */
  transition: transform var(--duration-base) var(--easing-ease-in-out),
              width    var(--duration-base) var(--easing-ease-in-out);
  will-change: transform;
  pointer-events: none;
}

/* Segment button */
.segment {
  flex: 1;
  position: relative;         /* sits above the indicator */
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 9999px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition:
    color     var(--duration-base) var(--easing-ease-in-out),
    opacity   var(--duration-base) var(--easing-ease-in-out);
}

/* Outgoing → Incoming: label/icon cross-fade */
.segment[aria-checked="false"] {
  color: var(--text-subtle);
  opacity: 1;
}

.segment[aria-checked="false"]:hover {
  color: var(--text-brand);
}

.segment[aria-checked="true"] {
  color: var(--text-brand);
}

/* Disable hover response during transition */
.segmented-control[data-animating] .segment {
  pointer-events: none;
}

/* Disabled */
.segmented-control[aria-disabled="true"] {
  opacity: 0.40;
  cursor: not-allowed;
  pointer-events: none;
}

.segment[aria-disabled="true"] {
  opacity: 0.40;
  cursor: not-allowed;
  pointer-events: none;
}

/* Focus ring */
.segment:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  border-radius: 9999px;
}

/* Reduced motion — respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .segmented-control__indicator,
  .segment {
    transition: none;
  }
}
```

### Reduced Motion

When `prefers-reduced-motion: reduce` is active, all transitions are removed. The indicator jumps instantly to the new position. The cross-fade is also removed — states switch immediately. No exceptions.

---

## 9. ARIA & Keyboard

### ARIA Roles

```html
<div
  role="radiogroup"
  aria-label="View mode"           <!-- required — describes the group -->
  aria-disabled="false"
>
  <button
    role="radio"
    aria-checked="true"            <!-- selected segment -->
    aria-label="List"              <!-- always present — used by icon-only for screen reader -->
    tabindex="0"
  >
    List
  </button>
  <button
    role="radio"
    aria-checked="false"
    aria-label="Grid"
    tabindex="-1"                  <!-- roving tabindex: only selected is tab-stoppable -->
  >
    Grid
  </button>
</div>
```

### Keyboard Navigation

| Key | Behaviour |
|---|---|
| `Tab` | Enters the group at the selected segment |
| `ArrowRight` / `ArrowDown` | Moves selection to next segment (wraps) |
| `ArrowLeft` / `ArrowUp` | Moves selection to previous segment (wraps) |
| `Space` / `Enter` | Selects focused segment |
| `Tab` (from within group) | Exits group — moves to next focusable element |

Use **roving tabindex**: only the selected segment has `tabindex="0"`, all others have `tabindex="-1"`. Arrow keys handle in-group navigation.

---

## 10. Dark Mode

All tokens have Dark mode values set in `Venus_Semantics`. The component requires no code changes for Dark mode — token resolution handles the switch automatically via `data-theme="dark"` on the root element.

Key Dark mode shifts:
- `surface/sunken` → gray/800 (dark track)
- `action/secondary/hover` → purple/800 (dark selected fill)
- `border/brand` → purple/400
- `focus/ring/color` → purple/400
- `text/subtle` → gray/400
- `text/brand` → purple/300

---

## 11. Storybook Stories

```tsx
// SegmentedControl.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl, Segment } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title:     'Actions/SegmentedControl',
  component:  SegmentedControl,
  parameters: { layout: 'centered' },
  argTypes: {
    size:     { control: 'radio',   options: ['md', 'lg'] },
    mode:     { control: 'radio',   options: ['labeled', 'icon-only'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof SegmentedControl>;

// Default — 3 labeled segments, lg
export const Default: Story = {
  args: { size: 'lg', mode: 'labeled', defaultValue: 'list' },
  render: (args) => (
    <SegmentedControl {...args}>
      <Segment value="list"  label="List"  />
      <Segment value="grid"  label="Grid"  />
      <Segment value="board" label="Board" />
    </SegmentedControl>
  ),
};

// MD size
export const Medium: Story = {
  args: { size: 'md', mode: 'labeled', defaultValue: 'list' },
  render: (args) => (
    <SegmentedControl {...args}>
      <Segment value="list"  label="List"  />
      <Segment value="grid"  label="Grid"  />
      <Segment value="board" label="Board" />
    </SegmentedControl>
  ),
};

// 2 segments
export const TwoOptions: Story = {
  args: { size: 'lg', mode: 'labeled', defaultValue: 'on' },
  render: (args) => (
    <SegmentedControl {...args}>
      <Segment value="on"  label="On"  />
      <Segment value="off" label="Off" />
    </SegmentedControl>
  ),
};

// 5 segments — maximum
export const FiveOptions: Story = {
  args: { size: 'lg', mode: 'labeled', defaultValue: 'a' },
  render: (args) => (
    <SegmentedControl {...args}>
      <Segment value="a" label="Alpha"   />
      <Segment value="b" label="Beta"    />
      <Segment value="c" label="Gamma"   />
      <Segment value="d" label="Delta"   />
      <Segment value="e" label="Epsilon" />
    </SegmentedControl>
  ),
};

// Icon only
export const IconOnly: Story = {
  args: { size: 'lg', mode: 'icon-only', defaultValue: 'list' },
  render: (args) => (
    <SegmentedControl {...args}>
      <Segment value="list"  label="List"  icon={<ListIcon />}  />
      <Segment value="grid"  label="Grid"  icon={<GridIcon />}  />
      <Segment value="board" label="Board" icon={<BoardIcon />} />
    </SegmentedControl>
  ),
};

// Fully disabled
export const Disabled: Story = {
  args: { size: 'lg', mode: 'labeled', defaultValue: 'list', disabled: true },
  render: (args) => (
    <SegmentedControl {...args}>
      <Segment value="list"  label="List"  />
      <Segment value="grid"  label="Grid"  />
      <Segment value="board" label="Board" />
    </SegmentedControl>
  ),
};

// Individual segment disabled
export const PartialDisabled: Story = {
  args: { size: 'lg', mode: 'labeled', defaultValue: 'list' },
  render: (args) => (
    <SegmentedControl {...args}>
      <Segment value="list"  label="List"  />
      <Segment value="grid"  label="Grid"  disabled />
      <Segment value="board" label="Board" />
    </SegmentedControl>
  ),
};

// Controlled
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('list');
    return (
      <SegmentedControl value={value} onChange={setValue} size="lg">
        <Segment value="list"  label="List"  />
        <Segment value="grid"  label="Grid"  />
        <Segment value="board" label="Board" />
      </SegmentedControl>
    );
  },
};
```

---

## 12. CSS Custom Properties Reference

```css
:root {
  /* Spacing */
  --space-2:  2px;
  --space-4:  4px;
  --space-8:  8px;
  --space-12: 12px;
  --space-16: 16px;

  /* Radius */
  --radius-full: 9999px;

  /* Border widths */
  --border-width-1: 1px;

  /* Motion */
  --duration-base:      200ms;
  --easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Surfaces */
  --surface-sunken: var(--color-gray-100);  /* #F3F4F6 */

  /* Borders */
  --border-default:  var(--color-gray-200);  /* #E5E7EB */
  --border-brand:    var(--color-purple-500); /* #6C5CE7 */
  --border-disabled: var(--color-gray-200);  /* #E5E7EB */

  /* Action */
  --action-secondary-hover:  var(--color-purple-100); /* #EDE9FE */
  --action-secondary-active: var(--color-purple-200); /* #DDD6FE */
  --action-ghost-hover:      rgba(108, 92, 231, 0.08);

  /* Text */
  --text-subtle:   var(--color-gray-600);   /* #4B5563 */
  --text-brand:    var(--color-purple-600); /* #5D50BF */
  --text-label:    var(--color-gray-700);   /* #374151 */
  --text-disabled: var(--color-gray-400);   /* #9CA3AF */

  /* Focus */
  --focus-ring-color: var(--color-purple-500); /* #6C5CE7 */

  /* Visibility */
  --visibility-disabled: 0.40;
}
```

---

## 13. Known Figma-Only Limitations

These are Figma Plugin API constraints — they have no impact on the React implementation:

| Item | Status | Action |
|---|---|---|
| `segments` SLOT not wired to frame | Manual Figma UI step | Select component set → right panel → slot picker → link to `segments` frame |
| `cornerRadius` shorthand silently fails on COMPONENT nodes | Fixed via individual corner properties (`topLeftRadius` etc.) | No action needed |
| `strokeWeight` shorthand silently fails on COMPONENT nodes | Fixed via individual side properties (`strokeTopWeight` etc.) | No action needed |
| FILL sizing reverts to FIXED on hidden instances | Known Figma behaviour | Set `layoutSizingHorizontal: 'FILL'` after making segment visible |

---

## 14. Audit Sign-off

| Category | Result |
|---|---|
| Token compliance | ✅ 0 hardcoded fills/strokes/borders/radii |
| Variant completeness | ✅ 12/12 atom variants · 4/4 container variants |
| Contrast (non-exempt pairs) | ✅ All pairs ≥ 4.5:1 |
| Focus ring | ✅ 2px, purple/500, ABSOLUTE, wired on all variants |
| Layer naming | ✅ 0 auto-generated names |
| Corner radius token-bound | ✅ Individual corner properties |
| Stroke weight token-bound | ✅ Individual side properties |
| Descriptions | ✅ Both components |
| Slot wiring | ⚠️ Manual Figma UI step required |
| Dark mode tokens | ✅ All semantics have Light + Dark values |
| Reduced motion | ✅ Documented — transitions disabled |
| ARIA | ✅ radiogroup + roving tabindex pattern |
