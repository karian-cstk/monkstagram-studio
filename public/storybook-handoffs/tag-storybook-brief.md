# Tag — Storybook Brief
**Component:** Tag  
**Node:** `846:14302`  
**Page:** 💬 Feedback  
**Status:** Active v1.0.0  
**Date:** 2026-07-06

---

## 1. Purpose

Tag is a non-interactive metadata label applied to content items. It communicates user-assigned or system-assigned categorisation — entry type, taxonomy term, content status, or any freeform label. Tags are visually neutral by default; fill, stroke, and text color can be overridden at instance level for custom color semantics (e.g. a "Draft" tag in amber, a "Published" tag in green).

Tag is the static counterpart to Toggle Pill. Use Tag when the label is read-only or non-toggleable. Use Toggle Pill when the label is a binary filter control.

---

## 2. Anatomy

```
[tag-container]
  [tag-leading-icon]?   — _Internal/Icon-Wrapper, conditionally visible
  [tag-label]           — TEXT node, label property
  [tag-trailing-action]? — _Internal/Icon-Action sm, conditionally visible (close/X)
```

**Layout:** Auto-layout row, SPACE_BETWEEN, vertically centered.  
**Sizing:** HUG width, fixed height per size tier.  
**Radius:** 4px (cornerRadius) — pill radius is NOT used; Tag is rectangular.

---

## 3. TypeScript Props Interface

```typescript
interface TagProps {
  /** Display text */
  label: string;
  /** Size tier */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show leading icon slot */
  hasLeadingIcon?: boolean;
  /** Leading icon element — required when hasLeadingIcon is true */
  leadingIcon?: React.ReactNode;
  /** Show trailing dismiss action */
  hasTrailingAction?: boolean;
  /** Callback when trailing X is clicked */
  onDismiss?: () => void;
  /** Override surface fill (CSS custom property or token value) */
  surfaceColor?: string;
  /** Override border color */
  borderColor?: string;
  /** Override text color */
  textColor?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `size` (VARIANT) | `size` | sm / md / lg / xl |
| `hasLeadingIcon` (VARIANT) | `hasLeadingIcon` | false / true |
| `hasTrailingAction` (VARIANT) | `hasTrailingAction` | false / true |
| `label` (TEXT) | `label` | String |
| — | `onDismiss` | Fires on trailing X click |
| Instance fill override | `surfaceColor` | CSS custom property |
| Instance stroke override | `borderColor` | CSS custom property |
| Instance text override | `textColor` | CSS custom property |

---

## 5. State Behaviour

Tag has no interactive states (hover, focus, active, disabled). It is a static display element.

The trailing action (`_Internal/Icon-Action`) carries its own interactive states internally — hover and focus are handled by the Icon-Action atom, not by Tag itself.

When `onDismiss` is provided, the trailing X is keyboard-focusable and activatable via Enter/Space. The Tag container itself is not focusable.

---

## 6. Size Specification

| Size | Height | Padding H | Gap | Icon Size | Text Style | Use |
|---|---|---|---|---|---|---|
| sm | 24px | 8px | 4px | 12px (`Icon-Wrapper/Size=12px`) | Body/XS (12px) | Inside input fields, dense UI |
| md | 28px | 8px | 4px | 16px (`Icon-Wrapper/Size=16px`) | Body/MD (14px) | Inside input fields, lists |
| lg | 36px | 12px | 6px | 20px (`Icon-Wrapper/Size=20px`) | Body/LG (16px) | Standalone, card metadata |
| xl | 44px | 16px | 8px | 24px (`Icon-Wrapper/Size=24px`) | Body/XL (18px) | Hero, onboarding, empty states |

**Usage rule:** sm and md only inside input fields or other constrained containers. lg and xl standalone only.

---

## 7. Token Reference

Tag binds directly to Venus_Semantics. No Venus_Components tokens. Default color scheme:

| Layer | Token | Notes |
|---|---|---|
| tag-container fill | `surface/subtle` | Near-white tint |
| tag-container stroke | `border/default` | 1px INSIDE |
| tag-label text fill | `text/default` | Primary text |
| tag-leading-icon fill | `icon/color` | via Icon-Wrapper |

**Color customisation:** At instance level, override `tag-container` fill and stroke variables, and `tag-label` text fill variable. This is the intended mechanism — no prop needed, done directly in Figma at instance level or via inline style in React.

---

## 8. Accessibility

- Tag container: `role="status"` or no role if purely decorative — depends on context
- If `hasTrailingAction=true`: trailing X must have `aria-label="Remove [label]"` — e.g. `aria-label="Remove Draft"`
- Trailing X is a focusable button: `role="button"`, keyboard: Enter/Space to activate
- Tag label text: minimum 4.5:1 contrast against surface — designer responsibility when overriding colors
- Icon-only leading icon: decorative — `aria-hidden="true"`
- Do not rely on color alone to communicate tag meaning — always include text label

---

## 9. Storybook Stories

```typescript
// Default
export const Default: Story = {
  args: { label: 'Draft', size: 'md' }
};

// With leading icon
export const WithLeadingIcon: Story = {
  args: { label: 'Draft', size: 'md', hasLeadingIcon: true, leadingIcon: <Icon name="edit" /> }
};

// With dismiss
export const WithDismiss: Story = {
  args: { label: 'Draft', size: 'md', hasTrailingAction: true, onDismiss: () => {} }
};

// Full — icon + dismiss
export const Full: Story = {
  args: { label: 'Draft', size: 'lg', hasLeadingIcon: true, hasTrailingAction: true, onDismiss: () => {} }
};

// All sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
        <Tag key={size} label="Draft" size={size} />
      ))}
    </div>
  )
};

// Custom color (Published state)
export const CustomColor: Story = {
  args: {
    label: 'Published',
    size: 'md',
    surfaceColor: 'var(--feedback-success-surface)',
    borderColor: 'var(--feedback-success-border)',
    textColor: 'var(--text-success)'
  }
};
```

---

## 10. Implementation Notes

**Color overrides:** The Figma component intentionally has no color variant axis. Color customisation is done at instance level in Figma (override fills/stroke/text color) and via inline CSS custom properties or className in React. Do not add color props to the component interface — it becomes a maintenance burden and duplicates token work.

**Trailing action accessibility:** The `onDismiss` callback must construct the accessible label dynamically: `aria-label={\`Remove ${label}\`}`. Never use a static "Remove" or "X" alone.

**sm/md in inputs:** When Tag is used inside a multi-value input (e.g. tag input field), size sm or md only. The Tag's `hasTrailingAction` handles removal from the input's value array.

**Corner radius:** 4px rectangular — intentionally not a pill. Pill shape belongs to Toggle Pill, which signals toggleability. Tag's rectangular form signals static metadata.

---

## 11. Do / Don't

**Do:**
- Use Tag for static read-only metadata labels
- Override color at instance level for semantic categories (draft=amber, published=green)
- Always include text — never icon-only Tag
- Use sm/md inside input fields, lg/xl standalone

**Don't:**
- Don't use Tag as a toggle control — use Toggle Pill
- Don't use Tag for navigation or links — use Hyperlink or Button
- Don't add a Hover or Selected state to Tag — it has none by design
- Don't use xl Tag inside a table cell

---

## 12. Related Components

| Component | Relationship |
|---|---|
| Toggle Pill | The toggleable counterpart — same visual shape, binary on/off state |
| Chip (Filter Chip) | Data table filter variant — pre-wired to filter state, has active/disabled states |
| Badge | System-assigned status indicator — not user-applied, no dismiss action |
| Input | Tag sm/md used inside multi-value tag input patterns |
