---
title: Storybook Brief — Toggle Pill
component: Toggle Pill
node: 846:14435
page: 💬 Feedback & Status
version: v1.1.0
date: 2026-06-02
status: Active
---

# Toggle Pill — Storybook Brief
## Venus 2.1 RF · v1.1.0 · 2026-06-02

---

## 1. Purpose

Toggle Pill is a binary filter control. The entire pill is a single click target that
switches between off (inactive) and on (active) states. It is used for filter bars,
faceted search interfaces, and segmented category selections where the user activates
or deactivates a category. The off state uses a ghost brand surface to signal brand
affiliation without being active. The on state uses solid brand purple.

**Use when:** Building filter bars, faceted search UIs, or category toggles where
the user switches a single option on or off and may toggle it repeatedly.

**Do NOT use when:** The label is informational and non-interactive (use Badge or Tag).
You need exclusive single-selection (use Radio Group or Segmented Control). You need
a binary on/off setting (use Toggle Switch, not a filter control).

**Alternatives:** Tag (dismissable label), Toggle Switch (binary setting), Radio Group
(exclusive single selection), Segmented Control (2–5 mutually exclusive options).

---

## 2. Anatomy

```
┌──────────────────────────────────────────────────────┐
│  [pill-leading-icon-wrap?]   pill-label-frame        │
│                                pill-label            │
└──────────────────────────────────────────────────────┘
         ↑ root frame — entire surface is the click target

pill-leading-icon-wrap  — transparent FRAME, sized to icon height × icon height
  pill-leading-icon     — INSTANCE of _Internal/Icon-Wrapper
pill-label-frame        — FRAME with FILL horizontal sizing + 4px H padding
  pill-label            — TEXT node, FILL horizontal, CENTRE align
```

| Figma layer | DOM element | Role |
|---|---|---|
| root frame | `<button class="toggle-pill">` | Interactive — entire surface is the click target |
| `pill-leading-icon-wrap` | `<span class="toggle-pill__icon-wrap">` | Icon optical centring |
| `pill-leading-icon` | `<span class="toggle-pill__icon">` | Leading icon |
| `pill-label-frame` | `<span class="toggle-pill__label-frame">` | Label layout container |
| `pill-label` | `<span class="toggle-pill__label">` | Text content |

---

## 3. TypeScript Props Interface

```typescript
interface TogglePillProps {
  /** Text label */
  label: string;
  /** Visual size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the filter is currently active */
  isActive?: boolean;
  /** Whether the leading icon slot is shown */
  hasLeadingIcon?: boolean;
  /** Icon for the leading slot */
  leadingIcon?: React.ReactNode;
  /** Callback fired when the pill is toggled */
  onChange?: (isActive: boolean) => void;
  /** Disables the pill */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}
```

**Defaults:** `size='md'` · `isActive=false` · `hasLeadingIcon=false`

---

## 4. Figma → React Prop Mapping

| Figma Property | Figma Type | React Prop | Notes |
|---|---|---|---|
| `label` | TEXT | `label` | String content |
| `size` | VARIANT | `size` | `sm`/`md`/`lg`/`xl` |
| `isActive` | VARIANT (`off`/`on`) | `isActive` | `off`=false, `on`=true |
| `hasLeadingIcon` | VARIANT (`false`/`true`) | `hasLeadingIcon` | Boolean as variant |

Hover, focus, active states are CSS pseudo-classes — not props.
`isActive` is the only state that is a prop. The component is controlled — the parent
owns the state and passes it in.

---

## 5. State Behaviour Table

| State | Trigger | Visual change | Token | ARIA |
|---|---|---|---|---|
| Off | Render / toggle off | Ghost purple surface + inactive brand border + brand text | `surface/brand/inactive` + `border/brand/inactive` + `text/brand` | `aria-pressed="false"` |
| On | Click / toggle on | Solid brand fill + white text + brand border | `action/primary` + `text/inverse` | `aria-pressed="true"` |
| Hover — off | Mouse over off | `action/secondary/hover` fill | `action/secondary/hover` | — |
| Hover — on | Mouse over on | `action/primary/hover` fill | `action/primary/hover` | — |
| Focused | Tab | 2px focus ring `border/focus` | `border/focus` | `aria-pressed` maintained |
| Disabled | `disabled` prop | `visibility/disabled` opacity (0.40) | `visibility/disabled` | `aria-disabled="true"` |

---

## 6. Size Specification Table

| Property | sm | md | lg | xl |
|---|---|---|---|---|
| Height | 24px | 28px | 36px | 44px |
| Padding H | 8px (`space/8`) | 8px (`space/8`) | 12px (`space/12`) | 16px (`space/16`) |
| Padding V | 0px | 0px | 0px | 0px |
| Gap | 4px (`space/4`) | 4px (`space/4`) | 4px (`space/4`) | 4px (`space/4`) |
| Font style | `Body/XS` | `Body/MD` | `Body/LG` | `Body/XL` |
| Font size | 12px | 14px | 16px | 18px |
| Font weight | Regular (400) | Regular (400) | Regular (400) | Regular (400) |
| Icon size | 12px (`icon/size/xs`) | 16px (`icon/size/sm`) | 20px (`icon/size/md`) | 24px (`icon/size/lg`) |
| Border radius | 4px (`radius/4`) | 4px (`radius/4`) | 8px (`radius/8`) | 8px (`radius/8`) |
| Stroke | 1px INSIDE (`border-width/1`) | 1px | 1px | 1px |

---

## 7. Token Reference Table

Toggle Pill binds directly to Venus_Semantics. Zero Venus_Components tokens.

| Layer | State | CSS prop | VS Token | Light hex |
|---|---|---|---|---|
| Root fill | Off | `background` | `surface/brand/inactive` | #EDE9FE (purple/100) |
| Root fill | Off hover | `background` | `action/secondary/hover` | #EDE9FE |
| Root fill | On | `background` | `action/primary` | #6C5CE7 |
| Root fill | On hover | `background` | `action/primary/hover` | #5A4CC0 |
| Root stroke | Off | `border` | `border/brand/inactive` | #C4B5FD (purple/300) |
| Root stroke | On | `border` | `action/primary` | #6C5CE7 |
| Label | Off | `color` | `text/brand` | #5D50BF |
| Label | On | `color` | `text/inverse` | #FFFFFF |
| Icon | Off | `color` | Venus_Icons neutral mode | #374151 |
| Icon | On | `color` | Venus_Icons inverted mode | #FFFFFF |
| Focus ring | Any | `outline` | `border/focus` | #6C5CE7 |
| Root (disabled) | Any | `opacity` | `visibility/disabled` | 0.40 |

---

## 8. Accessibility Checklist

| Check | Value |
|---|---|
| Element | `<button>` — entire pill is the click target |
| ARIA pressed state | `aria-pressed="true"` on, `aria-pressed="false"` off |
| Keyboard activation | Enter / Space to toggle |
| Touch target — sm | 24px ✅ WCAG 2.5.8 |
| Touch target — md/lg/xl | 28/36/44px ✅ |
| Text contrast — off | `text/brand` on `surface/brand/inactive` — 5.91:1 ✅ |
| Text contrast — on | `text/inverse` on `action/primary` — 4.86:1 ✅ |
| Focus ring | 2px solid `border/focus` (purple/500, 4.86:1) ✅ |
| Disabled | `aria-disabled="true"`, opacity 0.40, no hover response |
| State via colour alone | No — `aria-pressed` is the non-visual state channel |
| Dark mode | All VS tokens have Dark mode values |

---

## 9. Storybook Stories

```typescript
// TogglePill.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TogglePill } from './TogglePill';

const meta: Meta<typeof TogglePill> = {
  title: 'Feedback & Status/Toggle Pill',
  component: TogglePill,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TogglePill>;

export const Default: Story = {
  args: { label: 'Filter', size: 'md', isActive: false },
};

export const Active: Story = {
  args: { label: 'Filter', size: 'md', isActive: true },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {(['sm','md','lg','xl'] as const).map(s => (
        <TogglePill key={s} label={s} size={s} />
      ))}
    </div>
  ),
};

export const OffAndOn: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <TogglePill label="Off" size="md" isActive={false} />
      <TogglePill label="On" size="md" isActive={true} />
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  args: { label: 'Filter', size: 'md', hasLeadingIcon: true, isActive: false },
};

export const WithLeadingIconActive: Story = {
  args: { label: 'Filter', size: 'md', hasLeadingIcon: true, isActive: true },
};

export const FilterBar: Story = {
  render: () => {
    const filters = ['All', 'Published', 'Draft', 'Archived', 'Scheduled'];
    return (
      <div role="group" aria-label="Content filters" style={{ display: 'flex', gap: 8 }}>
        {filters.map((f, i) => (
          <TogglePill key={f} label={f} size="md" isActive={i === 0} />
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { label: 'Disabled', size: 'md', isActive: false, disabled: true },
};

export const Focused: Story = {
  args: { label: 'Focused', size: 'md', isActive: false },
  parameters: { pseudo: { focus: true } },
};

export const DarkMode: Story = {
  args: { label: 'Dark filter', size: 'md', isActive: true },
  parameters: { backgrounds: { default: 'dark' } },
};

export const LongContent: Story = {
  args: {
    label: 'A very long filter label to test overflow',
    size: 'lg',
  },
};
```

---

## 10. Implementation Notes

```css
--toggle-pill-off-surface:  var(--surface-brand-inactive);
--toggle-pill-off-border:   var(--border-brand-inactive);
--toggle-pill-off-text:     var(--text-brand);
--toggle-pill-on-surface:   var(--action-primary);
--toggle-pill-on-border:    var(--action-primary);
--toggle-pill-on-text:      var(--text-inverse);
--toggle-pill-off-hover:    var(--action-secondary-hover);
--toggle-pill-on-hover:     var(--action-primary-hover);
--toggle-pill-focus-ring:   var(--border-focus);
--toggle-pill-disabled:     var(--visibility-disabled);
```

**Controlled component:** Toggle Pill owns no internal state. The parent owns
`isActive` and passes it in. `onChange(isActive: boolean)` fires on click,
Enter, and Space. The parent updates `isActive` and React re-renders.

**Icon mode switching:** When `isActive=false`, icon uses Venus_Icons `neutral` mode
(gray/700). When `isActive=true`, icon uses Venus_Icons `inverted` mode (white). In code,
switch a CSS class on the icon wrapper and let the design token handle the colour.

**Focus ring:** Use `outline: 2px solid var(--border-focus)` with `outline-offset: 2px`.
Never suppress `:focus-visible`.

**Reduced motion:** Background colour transition between off/on (100ms ease-in-out)
should be disabled under `prefers-reduced-motion: reduce`.

**Dark mode:** All tokens update automatically via `data-theme="dark"` on a parent.

---

## 11. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use for filter bar selections the user toggles on/off | Use for binary settings — use Toggle Switch instead |
| Group pills in `role="group"` with `aria-label` | Use Toggle Pill as a navigation element |
| Keep labels to 1–3 words | Write full sentences as pill labels |
| Use consistent size within a single filter bar | Mix `sm` and `xl` pills in the same row |
| Let the parent own `isActive` state | Build Toggle Pill with internal state in production |

---

## 12. Related Components

| Component | Relationship | When to use instead |
|---|---|---|
| Tag | Alternative | User-applied labels with optional dismiss, no toggle state |
| Badge | Alternative | System-assigned, non-interactive status labels |
| Toggle Switch | Alternative | Binary on/off setting (not a filter) |
| Radio Group | Alternative | Single exclusive selection from visible options |
| Segmented Control | Alternative | Mutually exclusive selection from 2–5 options |

---
*Venus 2.1 RF — Toggle Pill Storybook Brief — v1.1.0 — 2026-06-02*
