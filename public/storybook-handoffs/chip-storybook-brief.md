# Chip (Filter Chip) — Storybook Brief
**Component:** Chip  
**Node:** `1066:9389`  
**Page:** 📊 Data List  
**Status:** Active v2.1.0  
**Date:** 2026-07-06

---

## 1. Purpose

Chip is an interactive filter control used in data table filter bars and inline filter toolbars. It represents a single filter dimension — a column, a tag, a category — and signals whether that filter is active. Clicking a chip opens a dropdown to configure the filter value; an active chip shows a counter and allows clearing via the close action.

Chip is purpose-built for the Data Table ecosystem. It is not a general-purpose badge or tag. For static metadata labels, use Tag. For simple binary toggles, use Toggle Pill.

---

## 2. Anatomy

```
[chip-container]                    — auto-layout row, 32px fixed height, radius=9999 (pill)
  [chip-leading-icon-slot]?         — _Internal/Icon-Wrapper/16px, conditionally visible
  [chip-label]                      — Label/MD, text/default → text/inverse (Active)
  [chip-counter-slot]?              — Badge/Counter, conditionally visible
  [chip-chevron-slot]               — _Internal/Icon-Wrapper/16px (CaretDown), conditionally visible
  [chip-close-slot]                 — _Internal/Icon-Action sm, conditionally visible
  [chip-focus-ring]                 — absolute frame, wired to hasFocus boolean
```

**Chevron:** Signals a dropdown will open. Deferred — Dropdown List not yet built.  
**Close action:** `_Internal/Icon-Action sm` — handles its own hover/focus/pressed states independently.  
**Focus ring:** Absolute, radius=9999 (matches pill), wired to `hasFocus` boolean. Baked visible on Focused variant.

---

## 3. TypeScript Props Interface

```typescript
interface ChipProps {
  /** Filter dimension label */
  label: string;
  /** Show leading icon */
  hasLeadingIcon?: boolean;
  /** Leading icon element */
  leadingIcon?: React.ReactNode;
  /** Show active filter counter badge */
  hasCounter?: boolean;
  /** Active filter count value */
  counterValue?: number;
  /** Show dropdown chevron */
  hasDropdown?: boolean;
  /** Show close/clear action */
  hasClose?: boolean;
  /** Current interaction state */
  state?: 'default' | 'hover' | 'selected' | 'disabled';
  /** Focus ring visible (controlled by keyboard navigation) */
  hasFocus?: boolean;
  /** Click handler — opens filter dropdown */
  onClick?: () => void;
  /** Clear handler — removes active filter */
  onClear?: () => void;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `State` (VARIANT) | `state` | Default / Hover / Selected / Disabled |
| `label` (TEXT) | `label` | Filter dimension name |
| `hasLeadingIcon` (BOOLEAN) | `hasLeadingIcon` | Default: false |
| `hasCounter` (BOOLEAN) | `hasCounter` | Default: false |
| `hasDropdown` (BOOLEAN) | `hasDropdown` | Default: true — deferred |
| `hasClose` (BOOLEAN) | `hasClose` | Default: true |
| `hasFocus` (BOOLEAN) | `hasFocus` | Default: false |
| — | `counterValue` | Number to display in Badge/Counter |
| — | `onClick` | Opens dropdown |
| — | `onClear` | Fires on close action |

---

## 5. State Behaviour

| State | Surface | Border | Label | Icons |
|---|---|---|---|---|
| Default | `surface/interactive/default` | `border/subtle` | `text/default` | neutral mode |
| Hover | `surface/interactive/hover` | `border/subtle` | `text/default` | neutral mode |
| Selected (Active) | `action/primary` (brand purple) | `action/primary` | `text/inverse` (white) | inverted mode |
| Disabled | Default surface + `visibility/disabled` (0.40 opacity) | `border/subtle` | `text/default` + opacity | disabled mode |
| Focused | Default surface + focus ring visible | `action/primary` | `text/default` | neutral mode |

**Close action states:** The `_Internal/Icon-Action sm` inside chip-close-slot carries its own hover/focus/pressed states. These are independent of the chip's own state.

---

## 6. Size Specification

Chip is a single-size component: **32px height** (md equivalent).

| Property | Value | Token |
|---|---|---|
| Height | 32px | Fixed |
| Padding H | 12px | `space/12` |
| Gap | 4px | `space/4` |
| Radius | 9999px | Pill — unbound (API limitation, value correct) |
| Icon size | 16px | `_Internal/Icon-Wrapper/Size=16px` |
| Text style | Label/MD | 12px Inter Medium |

Chip is always 32px. There is no size axis. Filter bars use uniform chip density.

---

## 7. Token Reference

| Layer | State | Token |
|---|---|---|
| chip-container fill | Default/Hover | `surface/interactive/default` / `surface/interactive/hover` |
| chip-container fill | Selected | `action/primary` |
| chip-container stroke | All | `border/subtle` → `action/primary` (Selected/Focused) |
| chip-label text | Default/Hover | `text/default` |
| chip-label text | Selected | `text/inverse` |
| chip-leading-icon | Default | `icon/color` (Venus_Icons neutral) |
| chip-leading-icon | Selected | `icon/color` (Venus_Icons inverted) |
| chip-leading-icon | Disabled | `icon/color` (Venus_Icons disabled) |
| chip-focus-ring stroke | — | `focus/ring/color` |
| chip-container opacity | Disabled | `visibility/disabled` (0.40) |

---

## 8. Accessibility

- `role="button"` on chip container
- `aria-expanded` when dropdown is attached — `true` when open, `false` when closed
- `aria-pressed` is NOT used — chip is not a binary toggle, it opens a dropdown
- Close action: `aria-label="Clear [label] filter"` — e.g. `aria-label="Clear Status filter"`
- Keyboard: Enter/Space opens dropdown; Tab moves to close action; Escape closes dropdown
- Counter badge: `aria-label` on chip should include count — e.g. `aria-label="Status filter, 2 active"`
- Disabled: `aria-disabled="true"`, remove from tab order

---

## 9. Storybook Stories

```typescript
// Default
export const Default: Story = {
  args: { label: 'Status', state: 'default' }
};

// With icon
export const WithIcon: Story = {
  args: { label: 'Status', state: 'default', hasLeadingIcon: true }
};

// Selected with counter
export const Selected: Story = {
  args: { label: 'Status', state: 'selected', hasCounter: true, counterValue: 2 }
};

// Disabled
export const Disabled: Story = {
  args: { label: 'Status', state: 'disabled' }
};

// All states
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['default', 'hover', 'selected', 'disabled'] as const).map(state => (
        <Chip key={state} label="Status" state={state} />
      ))}
    </div>
  )
};

// Filter bar pattern
export const FilterBar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4 }}>
      <Chip label="Status" state="selected" hasCounter={true} counterValue={2} hasClose={true} />
      <Chip label="Author" state="default" />
      <Chip label="Date" state="default" />
    </div>
  )
};
```

---

## 10. Implementation Notes

**Dropdown deferred:** `hasDropdown` prop exists and the chevron renders, but the dropdown behavior is not yet implemented — Dropdown List component is not built. Stub the onClick handler for now.

**Counter value:** The `counterValue` prop feeds into the nested Badge/Counter instance. In Figma this is a manual text override — in React, pass it as a prop and render it into the Badge/Counter component.

**Close vs chip click:** The chip container click should open/configure the filter. The close action click should clear/remove the filter. These are two distinct handlers on two distinct interactive elements. Do not merge them.

**Icon mode switching:** On the Selected state, all icons must switch to Venus_Icons `inverted` mode (white). In React, this is handled by the token — `icon/color` resolves to white when the surface is `action/primary`. Ensure your icon implementation uses `currentColor` or the `icon/color` CSS custom property.

**Known Figma limitation:** `cornerRadius` binding silently fails on COMPONENT nodes — the 9999px radius value is hardcoded at variant level. Value is correct; this is a Figma API constraint, not a token governance violation.

---

## 11. Do / Don't

**Do:**
- Use Chip in filter bars only — it is purpose-built for the Data Table filter pattern
- Always pair with a clear/close action when the filter is active
- Show counter badge when multiple values are selected for that filter dimension

**Don't:**
- Don't use Chip as a general-purpose tag or badge — use Tag or Badge
- Don't use Chip outside of a filter bar context
- Don't use Chip for navigation
- Don't make Chip multi-size — it is always 32px

---

## 12. Related Components

| Component | Relationship |
|---|---|
| Table/Filter-Bar | Parent organism — contains a row of Chips |
| Tag | Static metadata label — no states, no dropdown |
| Toggle Pill | Binary filter toggle — simpler than Chip, no dropdown or counter |
| Badge/Counter | Used inside Chip to show active filter count |
| Table/Data-Table-v2 | Grandparent — Filter-Bar lives inside Data-Table |
