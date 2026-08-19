# Toggle Pill — Storybook Brief
**Component:** Toggle Pill  
**Node:** `846:14435`  
**Page:** 💬 Feedback  
**Status:** Active v1.0.0  
**Date:** 2026-07-06

---

## 1. Purpose

Toggle Pill is a binary filter control. The entire pill is the click target — pressing it toggles between an inactive (off) ghost state and an active (on) solid brand-purple state. It is used to filter content lists, activate view modes, or toggle feature states where the selection is immediately visible and persistent.

Toggle Pill is the interactive counterpart to Tag. Use Toggle Pill when the label controls a binary state. Use Tag when the label is static metadata.

---

## 2. Anatomy

```
[pill-container]
  [pill-leading-icon]?  — _Internal/Icon-Wrapper, conditionally visible
  [pill-label]          — TEXT node, label property
```

**Layout:** Auto-layout row, centered, vertically centered.  
**Sizing:** HUG width, fixed height per size tier.  
**Radius:** 4px — matches Tag. Pill/9999 radius is not used; consistent with Tag visual language.  
**The whole container is the interactive hit target.** No internal button element.

---

## 3. TypeScript Props Interface

```typescript
interface TogglePillProps {
  /** Display text */
  label: string;
  /** Size tier */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Active (on) or inactive (off) state */
  isActive?: boolean;
  /** Show leading icon slot */
  hasLeadingIcon?: boolean;
  /** Leading icon element — required when hasLeadingIcon is true */
  leadingIcon?: React.ReactNode;
  /** Toggle handler */
  onChange?: (isActive: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `size` (VARIANT) | `size` | sm / md / lg / xl |
| `isActive` (VARIANT) | `isActive` | off → false / on → true |
| `hasLeadingIcon` (VARIANT) | `hasLeadingIcon` | false / true |
| `label` (TEXT) | `label` | String |
| — | `onChange` | Fires on click/Enter/Space |
| — | `disabled` | Not modeled in Figma CSET — treat as opacity + pointer-events:none |

---

## 5. State Behaviour

| State | Visual |
|---|---|
| Off (default) | Ghost — `surface/subtle` fill, `border/default` stroke, `text/default` text |
| On (active) | Solid — `tag/filter/on/surface` fill (brand purple tint), `border/brand` stroke, `text/brand` text |
| Hover (off) | Slight surface tint — `surface/subtle/hover` or equivalent |
| Hover (on) | Slight surface darken |
| Focus | Focus ring — `focus/ring/color` 2px offset |
| Disabled | `visibility/disabled` opacity (0.40), pointer-events none |

**Note:** Hover and focus states are not modeled as Figma variants — handled via CSS. The Figma CSET models only the off/on axis and the icon presence axis.

---

## 6. Size Specification

| Size | Height | Padding H | Gap | Icon Size | Text Style |
|---|---|---|---|---|---|
| sm | 24px | 8px | 4px | 12px | Body/XS (12px) |
| md | 28px | 8px | 4px | 16px | Body/MD (14px) |
| lg | 36px | 12px | 6px | 20px | Body/LG (16px) |
| xl | 44px | 16px | 8px | 24px | Body/XL (18px) |

Identical size spec to Tag — they are visually interchangeable at rest. State behavior is the distinguishing factor.

---

## 7. Token Reference

| Layer | State | Token |
|---|---|---|
| pill-container fill | Off | `surface/subtle` |
| pill-container fill | On | `tag/filter/on/surface` |
| pill-container stroke | Off | `border/default` |
| pill-container stroke | On | `border/brand` |
| pill-label text | Off | `text/default` |
| pill-label text | On | `text/brand` |
| pill-leading-icon | Off | `icon/color` (default mode — neutral) |
| pill-leading-icon | On | `icon/color` (default mode — brand purple) |

**`tag/filter/on/surface`** and **`tag/filter/off/surface`** are Venus_Components tokens that alias Venus_Semantics. They exist because the active/inactive surface colors carry specific semantic intent distinct from generic `surface/selected` or `action/secondary` — the filter pill has its own activation visual language.

---

## 8. Accessibility

- `role="button"` on the pill container
- `aria-pressed={isActive}` — communicates toggle state to screen readers
- Keyboard: Enter and Space toggle the state
- Focus ring: 2px `focus/ring/color` at 2px offset, radius = component radius + 2
- Do not communicate active state by color alone — the `aria-pressed` attribute is mandatory
- Minimum contrast: text against surface must meet 4.5:1 in both off and on states

---

## 9. Storybook Stories

```typescript
// Default (off)
export const Default: Story = {
  args: { label: 'All entries', size: 'md', isActive: false }
};

// Active (on)
export const Active: Story = {
  args: { label: 'All entries', size: 'md', isActive: true }
};

// With leading icon
export const WithIcon: Story = {
  args: { label: 'Published', size: 'md', isActive: false, hasLeadingIcon: true, leadingIcon: <Icon name="checkCircle" /> }
};

// Active with icon
export const ActiveWithIcon: Story = {
  args: { label: 'Published', size: 'md', isActive: true, hasLeadingIcon: true, leadingIcon: <Icon name="checkCircle" /> }
};

// Controlled toggle
export const Controlled: Story = {
  render: () => {
    const [active, setActive] = React.useState(false);
    return <TogglePill label="Draft" size="md" isActive={active} onChange={setActive} />;
  }
};

// All sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
        <TogglePill key={size} label="Filter" size={size} isActive={false} />
      ))}
    </div>
  )
};

// Filter group — typical usage pattern
export const FilterGroup: Story = {
  render: () => {
    const [active, setActive] = React.useState<string>('all');
    const filters = ['All', 'Draft', 'Published', 'Archived'];
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        {filters.map(f => (
          <TogglePill
            key={f}
            label={f}
            size="md"
            isActive={active === f.toLowerCase()}
            onChange={() => setActive(f.toLowerCase())}
          />
        ))}
      </div>
    );
  }
};
```

---

## 10. Implementation Notes

**Whole-pill hit target:** The pill container is the button — not a label or inner span. Use `<button>` or `<div role="button" tabIndex={0}>` with full pointer and keyboard event handling.

**Icon mode on active:** When `isActive=true`, the leading icon should shift to brand purple (`text/brand` color context). In React, this is automatic if icon color inherits from `currentColor` and the text color token is applied to the container.

**Filter group pattern:** Multiple Toggle Pills in a row act as a radio-style filter group — only one active at a time. This is not enforced by the component itself (it's a single binary toggle) — the parent manages mutual exclusivity.

**Disabled:** Not modeled in the Figma CSET. In React, apply `opacity: var(--visibility-disabled)` (0.40) and `pointer-events: none`. Add `aria-disabled="true"` and remove `tabIndex`.

---

## 11. Do / Don't

**Do:**
- Use for binary filter controls — on/off, show/hide, include/exclude
- Use in filter bars, toolbar toggle groups, view mode switchers
- Implement `aria-pressed` — never omit it
- Make the whole pill the click target

**Don't:**
- Don't use as a navigation element — use tabs or links
- Don't use for destructive actions — use Button/Destructive
- Don't use more than ~6 Toggle Pills in a group without a scroll container
- Don't use Tag if the intent is toggleable — Tag is static

---

## 12. Related Components

| Component | Relationship |
|---|---|
| Tag | Static counterpart — same visual form, no interactive states |
| Chip (Filter Chip) | Data table specific — has count badge, active state, disabled state |
| Segmented Control | Mutually exclusive option group — use when options are mutually exclusive and always one selected |
| Toggle Switch | Binary on/off for settings — not for content filtering |
