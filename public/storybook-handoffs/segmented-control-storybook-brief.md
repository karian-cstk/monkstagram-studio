# Segmented Control — Storybook Engineering Brief
**Venus 2.1 RF | Component: Segmented Control | Node: 829:71472**
**Status: Active v2.1.0 | Page: 🔘 Actions | Last updated: 2026-07-06**

---

## 1. Purpose

`SegmentedControl` is a grouped set of mutually exclusive options that switch between views of the **same content**. Exactly one segment is always selected. It communicates immediate, in-place content switching — not navigation to a new page.

**Use when:**
- Switching between views of the same dataset (List / Grid / Map, Day / Week / Month)
- Filtering a dataset by a single mutually exclusive criterion
- Toggling between 2–5 compact options where each option is equally weighted

**Do not use when:**
- Navigating to distinct content sections — use `Tabs` instead
- Toggling a binary setting (on/off) — use `Toggle Switch` instead
- Choosing from more than 5 options — use `Select` instead
- Options have meaningfully different visual weight — use `Button Group` instead

**Alternatives:**
- `Tabs` — distinct content sections with their own URLs or scroll positions
- `Toggle Switch` — single binary setting
- `Select` — 6+ options or options with variable length labels
- `Radio Group` — form-context selection requiring submit

---

## 2. Anatomy

```
[Segmented Control root] ← COMPONENT, HORIZONTAL auto-layout, FIXED height, AUTO width
  ├── 4px uniform padding (container inset)
  └── [segments SLOT] ← SLOT frame, FILL × FILL
        ├── [segment-1] ← _Internal/Segment INSTANCE (Selected)
        ├── [segment-2] ← _Internal/Segment INSTANCE (Unselected)
        └── [segment-N] ← _Internal/Segment INSTANCE (Unselected), max 5
```

**`_Internal/Segment` anatomy:**
```
[Segment root] ← COMPONENT, HORIZONTAL auto-layout, FIXED height, HUG width
  ├── [Focus Ring] ← FRAME, ABSOLUTE, x=-2 y=-2, hidden by default
  ├── [Leading]    ← _Internal/Icon-Wrapper INSTANCE, hidden unless hasLeadingIcon=true
  └── [Label]      ← TEXT node, hidden in IconOnly mode but always present for a11y
```

| Layer | DOM equivalent | Role |
|---|---|---|
| Root frame | `<div role="radiogroup">` | Container. Carries background, border, radius. |
| `segments` slot | — | Slot — populated with `_Internal/Segment` instances |
| Segment root | `<button role="radio">` | Individual option. Carries fill, border, opacity. |
| `Focus Ring` | CSS `outline` | Keyboard focus indicator. ABSOLUTE, hidden by default. |
| `Leading` | `<span aria-hidden="true">` | Optional leading icon. |
| `Label` | `<span>` (or `aria-label` in IconOnly) | Visible label or accessible name source. |

---

## 3. TypeScript Props Interface

```typescript
interface SegmentOption {
  /** Unique identifier for this option */
  value: string;

  /**
   * Visible label text.
   * In IconOnly mode, this becomes the aria-label — REQUIRED even when hidden.
   */
  label: string;

  /** Optional leading icon */
  icon?: React.ReactNode;

  /** Disables this individual segment */
  disabled?: boolean;
}

interface SegmentedControlProps {
  /** Array of segment options — minimum 2, maximum 5 */
  options: SegmentOption[];

  /** Currently selected value — controlled component */
  value: string;

  /** Callback when selection changes */
  onChange: (value: string) => void;

  /** Component size */
  size?: 'md' | 'lg';

  /**
   * Display mode.
   * 'labeled' — shows text label (with optional icon).
   * 'icon-only' — shows icon only; label becomes aria-label.
   * In icon-only mode, every option MUST have an icon.
   */
  mode?: 'labeled' | 'icon-only';

  /** Disables the entire control */
  disabled?: boolean;

  /**
   * Accessible label for the radiogroup container.
   * Required for screen reader context — describes what is being switched.
   * Example: "View mode", "Time range", "Layout"
   */
  groupLabel: string;

  /** Additional CSS class names */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | Type | React Prop | Notes |
|---|---|---|---|
| `Size` | VARIANT | `size` | `'md' \| 'lg'` |
| `Mode` | VARIANT | `mode` | `'labeled' \| 'icon-only'` |
| `segments` | SLOT | `options` | Array of SegmentOption. Min 2, max 5. |
| Segment `Type=Selected` | VARIANT (atom) | `value === option.value` | Derived from controlled `value` prop — not a direct prop |
| Segment `State=Disabled` | VARIANT (atom) | `option.disabled` or root `disabled` | Individual or group disable |
| Segment `hasFocus` | BOOLEAN (atom) | — | Storybook/demo only — handled by `:focus-visible` in production |
| Segment `hasLeadingIcon` | BOOLEAN (atom) | Presence of `option.icon` | True when icon is provided |
| Segment `showLabel` | BOOLEAN (atom) | `mode !== 'icon-only'` | False in IconOnly mode — label still exists as aria-label source |
| Segment `label` | TEXT (atom) | `option.label` | Always set — used as aria-label in IconOnly mode |

---

## 5. State Behaviour

### Container states

| State | Trigger | Visual change | Token |
|---|---|---|---|
| Default | — | Pill container, raised surface, default border | `surface/raised`, `border/default` |
| Disabled (all) | `disabled` prop | 40% opacity on each segment | `visibility/disabled` per segment root |

### Segment states

| Type | State | Fill | Border | Text | Icon mode |
|---|---|---|---|---|---|
| Unselected | Default | transparent | none | `text/subtle` | neutral (gray) |
| Unselected | Hover | `action/ghost/hover` (purple tint) | none | `text/brand` | default (purple) |
| Unselected | Disabled | transparent | none | `text/disabled` | disabled (gray) |
| Selected | Default | `action/secondary/hover` (lavender) | `border/brand` 1px | `text/brand` | default (purple) |
| Selected | Hover | `action/secondary/active` (deeper lavender) | `border/brand` 1px | `text/brand` | neutral (gray) ⚠️ |
| Selected | Disabled | `action/secondary/hover` | `border/disabled` | `text/disabled` | disabled (gray) |

> ⚠️ **Selected Hover icon mode anomaly:** Selected Hover uses neutral (564:9, gray) rather than default (564:7, purple). This is a minor optical inconsistency vs the text which remains `text/brand` (purple). Low-priority fix — does not affect token compliance or accessibility.

**Selection model:** Only one segment is Selected at a time. Clicking an Unselected segment deselects all others. The Selected state is controlled, not internal.

---

## 6. Size Specification

### Container

| Size | Height | Inner padding | Segment height | Segment H padding | Font | Icon |
|---|---|---|---|---|---|---|
| md | 40px | 4px all sides | 32px | 12px | Body/MD 14px Medium | 16px |
| lg | 48px | 4px all sides | 40px | 16px | Body/LG 16px Medium | 20px |

Container height = segment height + (4px × 2) inset padding.

### Focus ring (on Segment atom)

| Size | Ring width | Ring height | Offset | Radius | Stroke |
|---|---|---|---|---|---|
| md | 36px (32+4) | 36px | x=-2, y=-2 | 9999 | 2px |
| lg | 44px (40+4) | 44px | x=-2, y=-2 | 9999 | 2px |

---

## 7. Token Reference

All tokens are Venus_Semantics. No Venus_Components tokens.

### Container

| Layer | CSS property | Token | Light | Dark |
|---|---|---|---|---|
| Root fill | background | `surface/raised` | white #FFFFFF | gray/800 #1F2937 |
| Root border | border | `border/default` | gray/200 #E5E7EB | gray/700 #374151 |
| Root radius | border-radius | 9999px (raw — API limitation on COMPONENT nodes) | — | — |

### Segment — fills

| State | Token | Light | Dark |
|---|---|---|---|
| Unselected Default | transparent | — | — |
| Unselected Hover | `action/ghost/hover` | purple/500-a8 #6C5CE714 | purple/500-a8 |
| Selected Default | `action/secondary/hover` | purple/100 #EDE9FE | purple/800 #3B3380 |
| Selected Hover | `action/secondary/active` | purple/200 #DDD6FE | purple/700 #4C42A0 |
| Selected Disabled | `action/secondary/hover` | purple/100 #EDE9FE | purple/800 |

### Segment — borders

| State | Token | Light | Dark |
|---|---|---|---|
| Unselected (all) | none | — | — |
| Selected Default/Hover | `border/brand` | purple/500 #6C5CE7 | purple/400 #9F93FA |
| Selected Disabled | `border/disabled` | gray/200 #E5E7EB | gray/700 #374151 |

### Segment — text

| State | Token | Light | Dark |
|---|---|---|---|
| Unselected Default | `text/subtle` | gray/500 #6B7280 | gray/400 #9CA3AF |
| Unselected Hover | `text/brand` | purple/500 #6C5CE7 | purple/400 #9F93FA |
| Selected Default/Hover | `text/brand` | purple/500 #6C5CE7 | purple/400 #9F93FA |
| Disabled (all) | `text/disabled` | gray/300 #D1D5DB | gray/600 #4B5563 |

### Segment — spacing

| Property | Token | Value |
|---|---|---|
| Padding H (md) | `space/12` | 12px |
| Padding H (lg) | `space/16` | 16px |
| Gap (icon + label) | `space/8` | 8px |

### Disabled opacity

| Property | Token | Value |
|---|---|---|
| Segment root opacity | `visibility/disabled` | 0.40 |

Applied per segment. Fully disabled control = all segments at 0.40.

### Focus ring

| Property | Token | Light | Dark |
|---|---|---|---|
| Stroke color | `focus/ring/color` | purple/500 #6C5CE7 | purple/400 #9F93FA |

---

## 8. Accessibility

### ARIA

```html
<div role="radiogroup" aria-label="View mode">
  <button role="radio" aria-checked="true" tabindex="0">List</button>
  <button role="radio" aria-checked="false" tabindex="-1">Grid</button>
  <button role="radio" aria-checked="false" tabindex="-1">Map</button>
</div>
```

- **Container:** `role="radiogroup"` + `aria-label` from `groupLabel` prop — required for screen reader context.
- **Segments:** `role="radio"` + `aria-checked` — reflects Selected/Unselected state.
- **Keyboard roving tabindex:** Only the Selected segment has `tabindex="0"`. All others have `tabindex="-1"`. Arrow keys move focus within the group.
- **Disabled segments:** `aria-disabled="true"` + `tabindex="-1"`. Group disabled: all segments get `aria-disabled="true"`.
- **IconOnly mode:** `label` TEXT is always present on the Figma atom even when `showLabel=false`. In code, set `aria-label` on the segment button from `option.label`. Always pair with `Tooltip` so the label is visually surfaced on hover.
- **Icon:** `aria-hidden="true"` on all icon elements — the button's text content or `aria-label` carries meaning.

### Keyboard behaviour

| Key | Action |
|---|---|
| `Tab` | Focus enters group at selected segment |
| `Arrow Right` / `Arrow Down` | Move to and select next segment |
| `Arrow Left` / `Arrow Up` | Move to and select previous segment |
| `Home` | Move to and select first segment |
| `End` | Move to and select last segment |

> Note: Arrow keys both move focus AND select (unlike a standard radio group where Space confirms). This matches the Segmented Control pattern in Material, iOS, and Carbon — immediate selection on focus move.

### Contrast

| Pair | Ratio | WCAG |
|---|---|---|
| `text/brand` (purple/500) on `action/secondary/hover` (purple/100) | ~4.2:1 | ⚠️ Marginal — just below 4.5:1 body text threshold |
| `text/brand` (purple/500) on white | 4.60:1 | ✅ AA |
| `text/subtle` (gray/500) on white | 4.60:1 | ✅ AA |
| Focus ring purple/500 on white | 4.60:1 | ✅ WCAG 2.4.11 |
| Disabled (all, 40% opacity) | Exempt | ✅ WCAG 1.4.3 |

> ⚠️ **Selected label contrast note:** `text/brand` on `action/secondary/hover` (lavender fill) resolves to approximately 4.2:1 — marginally below the 4.5:1 body text AA threshold. This is a pre-existing token decision (brand purple on light lavender is a Venus system-wide pattern). Engineers should be aware this is a known edge case. At 16px Medium weight (lg size), the large-text threshold of 3:1 applies and the ratio passes comfortably.

### Touch targets

| Size | Target | Status |
|---|---|---|
| md | 32×32px minimum per segment | ✅ Meets WCAG 2.5.8 |
| lg | 40×40px minimum per segment | ✅ |

---

## 9. Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';
import { ListIcon, GridIcon, MapIcon, CalendarIcon, ClockIcon } from '@contentstack/icons';
import { useState } from 'react';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Actions/SegmentedControl',
  component: SegmentedControl,
  argTypes: {
    size: { control: 'radio', options: ['md', 'lg'] },
    mode: { control: 'radio', options: ['labeled', 'icon-only'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SegmentedControl>;

const defaultOptions = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map',  label: 'Map' },
];

// 1. Default
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('list');
    return (
      <SegmentedControl
        options={defaultOptions}
        value={value}
        onChange={setValue}
        size="lg"
        mode="labeled"
        groupLabel="View mode"
      />
    );
  },
};

// 2. All Sizes
export const AllSizes: Story = {
  render: () => {
    const [mdVal, setMd] = useState('list');
    const [lgVal, setLg] = useState('list');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SegmentedControl options={defaultOptions} value={mdVal} onChange={setMd} size="md" mode="labeled" groupLabel="View mode (md)" />
        <SegmentedControl options={defaultOptions} value={lgVal} onChange={setLg} size="lg" mode="labeled" groupLabel="View mode (lg)" />
      </div>
    );
  },
};

// 3. IconOnly Mode
export const IconOnly: Story = {
  render: () => {
    const [value, setValue] = useState('list');
    const iconOptions = [
      { value: 'list', label: 'List view', icon: <ListIcon /> },
      { value: 'grid', label: 'Grid view', icon: <GridIcon /> },
      { value: 'map',  label: 'Map view',  icon: <MapIcon /> },
    ];
    return (
      <SegmentedControl
        options={iconOptions}
        value={value}
        onChange={setValue}
        size="lg"
        mode="icon-only"
        groupLabel="View mode"
      />
    );
  },
};

// 4. Labeled with Icons
export const LabeledWithIcons: Story = {
  render: () => {
    const [value, setValue] = useState('day');
    const options = [
      { value: 'day',   label: 'Day',   icon: <CalendarIcon /> },
      { value: 'week',  label: 'Week',  icon: <CalendarIcon /> },
      { value: 'month', label: 'Month', icon: <ClockIcon /> },
    ];
    return (
      <SegmentedControl
        options={options}
        value={value}
        onChange={setValue}
        size="lg"
        mode="labeled"
        groupLabel="Calendar view"
      />
    );
  },
};

// 5. Segment Count Variants (2–5)
export const SegmentCounts: Story = {
  render: () => {
    const [v2, setV2] = useState('a');
    const [v3, setV3] = useState('a');
    const [v5, setV5] = useState('a');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SegmentedControl options={[{value:'a',label:'Option A'},{value:'b',label:'Option B'}]} value={v2} onChange={setV2} size="lg" mode="labeled" groupLabel="2 options" />
        <SegmentedControl options={[{value:'a',label:'Option A'},{value:'b',label:'Option B'},{value:'c',label:'Option C'}]} value={v3} onChange={setV3} size="lg" mode="labeled" groupLabel="3 options" />
        <SegmentedControl options={[{value:'a',label:'A'},{value:'b',label:'B'},{value:'c',label:'C'},{value:'d',label:'D'},{value:'e',label:'E'}]} value={v5} onChange={setV5} size="lg" mode="labeled" groupLabel="5 options (max)" />
      </div>
    );
  },
};

// 6. Disabled States
export const DisabledGroup: Story = {
  render: () => {
    const [value, setValue] = useState('list');
    return (
      <SegmentedControl
        options={defaultOptions}
        value={value}
        onChange={setValue}
        size="lg"
        mode="labeled"
        groupLabel="View mode (disabled)"
        disabled
      />
    );
  },
};

export const DisabledSegment: Story = {
  render: () => {
    const [value, setValue] = useState('list');
    const options = [
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid', disabled: true },
      { value: 'map',  label: 'Map' },
    ];
    return (
      <SegmentedControl
        options={options}
        value={value}
        onChange={setValue}
        size="lg"
        mode="labeled"
        groupLabel="View mode (one segment disabled)"
      />
    );
  },
};

// 7. Focused (focus ring demo)
export const Focused: Story = {
  render: () => {
    const [value, setValue] = useState('list');
    return (
      <SegmentedControl
        options={defaultOptions}
        value={value}
        onChange={setValue}
        size="lg"
        mode="labeled"
        groupLabel="View mode"
      />
    );
  },
  parameters: {
    pseudo: { focusVisible: true },
    docs: { description: { story: 'Focus ring shown on the selected segment.' } },
  },
};

// 8. Dark Mode
export const DarkMode: Story = {
  render: () => {
    const [value, setValue] = useState('list');
    return (
      <SegmentedControl
        options={defaultOptions}
        value={value}
        onChange={setValue}
        size="lg"
        mode="labeled"
        groupLabel="View mode"
      />
    );
  },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};
```

---

## 10. Implementation Notes

### CSS Custom Properties

```css
--segmented-control-height-md: 40px;
--segmented-control-height-lg: 48px;
--segmented-control-padding: 4px;
--segmented-control-radius: 9999px;

--segment-height-md: 32px;
--segment-height-lg: 40px;
--segment-padding-md: 12px;
--segment-padding-lg: 16px;
--segment-gap: 8px;
--segment-radius: 9999px;

--segment-font-md: var(--body-md-size);   /* 14px */
--segment-font-lg: var(--body-lg-size);   /* 16px */
--segment-font-weight: var(--font-weight-medium); /* 500 */
```

### Base CSS

```css
.segmented-control {
  display: inline-flex;
  align-items: center;
  padding: var(--segmented-control-padding);
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--segmented-control-radius);
  gap: 0;
}

.segment {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--segment-gap);
  border: 1px solid transparent;
  border-radius: var(--segment-radius);
  background: transparent;
  color: var(--text-subtle);
  cursor: pointer;
  white-space: nowrap;
  font-weight: var(--segment-font-weight);
  outline: none;
}

.segment:hover {
  background: var(--action-ghost-hover);
  color: var(--text-brand);
}

.segment[aria-checked="true"] {
  background: var(--action-secondary-hover);
  border-color: var(--border-brand);
  color: var(--text-brand);
}

.segment[aria-checked="true"]:hover {
  background: var(--action-secondary-active);
}

.segment:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}

.segment[aria-disabled="true"] {
  opacity: var(--visibility-disabled); /* 0.40 */
  cursor: not-allowed;
  pointer-events: none;
}
```

### Corner radius — Figma API note

`cornerRadius=9999` is unbound on both the CSET and atom COMPONENT nodes — known Figma API limitation (`setBoundVariable` silently fails on COMPONENT nodes for `cornerRadius`). The raw value is correct. Use `--segment-radius: 9999px` in CSS, which references the intent of `radius/full` from the primitive scale.

### Roving tabindex implementation

```typescript
const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
  const enabledOptions = options.filter(o => !o.disabled);
  const currentIndex = enabledOptions.findIndex(o => o.value === options[index].value);

  let nextIndex: number | null = null;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % enabledOptions.length;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
  } else if (e.key === 'Home') {
    nextIndex = 0;
  } else if (e.key === 'End') {
    nextIndex = enabledOptions.length - 1;
  }

  if (nextIndex !== null) {
    e.preventDefault();
    onChange(enabledOptions[nextIndex].value);
    segmentRefs[nextIndex]?.current?.focus();
  }
};
```

### IconOnly + Tooltip requirement

In IconOnly mode, the visible label is hidden but `option.label` must always be provided — it becomes the `aria-label` on the segment button. Additionally, pair every IconOnly Segmented Control with a `Tooltip` component set to trigger on hover, surfacing the label text visually. This is not optional — users without screen readers also need label discovery.

### Reduced motion

No animation on state change by default. If a sliding indicator animation is added, it must respect `prefers-reduced-motion: reduce`.

---

## 11. Do / Don't

**✅ Do — Use for in-place view switching**
```tsx
<SegmentedControl
  options={[{value:'list',label:'List'},{value:'grid',label:'Grid'}]}
  value={view} onChange={setView} groupLabel="Content view"
/>
```
**❌ Don't — Use for page navigation**
Segmented Control changes the view of content already on screen. It does not navigate to a new route. Use `Tabs` for distinct content sections.

---

**✅ Do — Always provide `groupLabel`**
```tsx
<SegmentedControl groupLabel="Calendar view" ... />
// Renders: <div role="radiogroup" aria-label="Calendar view">
```
**❌ Don't — Leave `groupLabel` empty**
Without an aria-label on the radiogroup, screen readers announce "group" with no context. Users cannot understand what is being switched.

---

**✅ Do — Keep segments 2–5**
Three segments is the ideal count — clear choice without cognitive overhead.
**❌ Don't — Use more than 5 segments**
Beyond 5, use `Select`. Cramped segments with truncated labels are harder to read and tap accurately.

---

**✅ Do — In IconOnly mode, always pair with Tooltip**
```tsx
<Tooltip content={option.label}>
  <SegmentedControl mode="icon-only" ... />
</Tooltip>
```
**❌ Don't — Use IconOnly without Tooltip**
Users without screen readers have no way to discover what each icon does on first encounter.

---

**✅ Do — Use md size in toolbars and sidebars**
md (40px container, 32px segments) fits the compact density of toolbar contexts.
**❌ Don't — Mix sizes in the same form row**
A lg Segmented Control (48px) next to an md Input (32px) breaks the form row rule. All controls in the same row must share the same height.

---

## 12. Related Components

| Component | Relationship | When to use instead |
|---|---|---|
| `_Internal/Segment` | Internal atom | Never use directly — always compose inside Segmented Control |
| `Tabs` | Navigational equivalent | When options represent distinct content sections or page routes |
| `Toggle Switch` | Binary equivalent | When switching a single on/off setting |
| `Select` | Overflow equivalent | When 6+ options or labels are too long for a segmented layout |
| `Button Group` | Visual sibling | When options are actions, not view selections; or when weights differ |
| `Radio Group` | Form equivalent | When selection requires explicit submit via a form |
| `Tooltip` | Required companion for IconOnly | Always pair in IconOnly mode to surface label text on hover |

