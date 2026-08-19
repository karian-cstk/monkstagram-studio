# Menu/Popover — Storybook Brief
**Component:** Menu/Popover  
**Node:** `1165:45108`  
**Page:** 🧭 Navigation  
**Status:** Active v2.1.0  
**Date:** 2026-07-06

---

## 1. Purpose

Menu/Popover is a floating surface that renders a list of actions. It is the shell for dropdown menus, context menus (three-dot, right-click), and any popover containing a list of selectable actions. It does not manage trigger state — the trigger button (Icon Button or Button) manages open/close, and Menu/Popover renders conditionally based on that state.

The shell is intentionally minimal: a surface, a border, elevation, and a single SLOT that accepts `_Internal/Menu/List-Item` and `Separator` instances. Width is set by the designer per context; height HUGs to content automatically.

---

## 2. Anatomy

```
[menu-popover]                  — COMPONENT, surface/overlay fill, Elevation/Level 2
  [menu-items]                  — SLOT frame, accepts List-Item + Separator
    [_Internal/Menu/List-Item]* — one or more list item atoms
    [Separator]*                — optional dividers between groups
```

**Shell padding:** 4px top + bottom, 0px sides — the List-Item atoms carry their own horizontal padding.  
**Width:** Designer-set fixed width. All List-Item instances FILL to container width.  
**Height:** HUG — grows with number of items.

---

## 3. TypeScript Props Interface

```typescript
interface MenuPopoverProps {
  /** Whether the menu is visible */
  isOpen: boolean;
  /** Close handler — fires on Escape, outside click, or item selection */
  onClose: () => void;
  /** Menu items configuration */
  items: MenuItemConfig[];
  /** Width override in px — defaults to 200px */
  width?: number;
  /** Anchor element ref — used for positioning */
  anchorRef?: React.RefObject<HTMLElement>;
  /** Placement relative to anchor */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

interface MenuItemConfig {
  /** Display label */
  label: string;
  /** Item type */
  type?: 'default' | 'destructive' | 'disabled';
  /** Leading icon element */
  icon?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Render as separator instead */
  isSeparator?: boolean;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `menu-items` (SLOT) | `items` | Array rendered as List-Item instances |
| — | `isOpen` | Controls render/visibility |
| — | `onClose` | Escape key + outside click |
| — | `width` | Fixed width override |
| — | `placement` | Positioning via floating-ui or equivalent |

**Note:** The Figma SLOT (`menu-items`) requires manual wiring in Figma UI — API limitation. In React this is a standard render prop / mapped children pattern.

---

## 5. State Behaviour

Menu/Popover itself has no interactive states. Its children carry states:

**`_Internal/Menu/List-Item` states:**

| State | Visual |
|---|---|
| Default | `surface/overlay` fill, `text/default` label |
| Hover | `surface/subtle` fill — subtle highlight |
| Pressed | `surface/subtle/hover` fill — deeper tint |
| Disabled | Opacity `visibility/disabled` (0.40), pointer-events none |
| Destructive | `text/destructive` label, `action/destructive` icon — in Default and Hover states |

**Open/close:** Controlled externally. Menu/Popover renders when `isOpen=true`, unmounts (or hides with `display:none`) when `isOpen=false`. Animate with CSS `opacity` + `transform: translateY(-4px)` on open.

---

## 6. Size Specification

**Menu/Popover shell:**

| Property | Value | Token |
|---|---|---|
| Width | 200px default (designer override) | None — set per context |
| Min width | 160px | Convention |
| Max width | 320px | Convention |
| Padding V | 4px | `space/4` |
| Padding H | 0px | — |
| Corner radius | 8px | `radius/8` |
| Border | 1px INSIDE | `border/default` |
| Elevation | Elevation/Level 2 | 3-layer drop shadow |

**`_Internal/Menu/List-Item`:**

| Property | Value |
|---|---|
| Height | 32px |
| Padding H | 12px |
| Gap | 8px |
| Icon size | 16px |
| Text style | Body/MD (14px) |

---

## 7. Token Reference

**Menu/Popover shell:**

| Layer | Token |
|---|---|
| Shell fill | `surface/overlay` (gray/0 Light / gray/800 Dark) |
| Shell stroke | `border/default` |
| Shell shadow | Elevation/Level 2 — Dropdown |

**`_Internal/Menu/List-Item`:**

| Layer | State | Token |
|---|---|---|
| Item fill | Default | `surface/overlay` (transparent) |
| Item fill | Hover | `surface/subtle` |
| Item fill | Pressed | `surface/subtle/hover` |
| Item label | Default | `text/default` |
| Item label | Destructive | `text/destructive` |
| Item icon | Default | `icon/color` |
| Item icon | Destructive | `icon/color` (destructive mode) |
| Item opacity | Disabled | `visibility/disabled` (0.40) |

---

## 8. Accessibility

- `role="menu"` on the popover container
- `role="menuitem"` on each List-Item
- `role="separator"` on Separator instances
- `aria-orientation="vertical"` on the menu container
- Keyboard navigation: `ArrowDown` / `ArrowUp` move focus between items; `Enter` / `Space` activate; `Escape` closes menu and returns focus to trigger
- Focus management: when menu opens, focus moves to first non-disabled item. When menu closes, focus returns to trigger element.
- Trigger button: `aria-haspopup="menu"`, `aria-expanded={isOpen}`
- Destructive items: do not differentiate by color alone — consider adding `aria-label` with "destructive action" hint for critical operations
- Disabled items: `aria-disabled="true"`, removed from tab order but remain in DOM for screen reader announcement

---

## 9. Storybook Stories

```typescript
// Default menu
export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ position: 'relative' }}>
        <IconButton aria-label="More options" onClick={() => setOpen(!open)} />
        {open && (
          <MenuPopover
            isOpen={open}
            onClose={() => setOpen(false)}
            items={[
              { label: 'Edit', onClick: () => {} },
              { label: 'Duplicate', onClick: () => {} },
              { isSeparator: true },
              { label: 'Delete', type: 'destructive', onClick: () => {} },
            ]}
          />
        )}
      </div>
    );
  }
};

// With icons
export const WithIcons: Story = {
  render: () => (
    <MenuPopover
      isOpen={true}
      onClose={() => {}}
      items={[
        { label: 'Edit', icon: <Icon name="edit" />, onClick: () => {} },
        { label: 'Duplicate', icon: <Icon name="copy" />, onClick: () => {} },
        { isSeparator: true },
        { label: 'Delete', type: 'destructive', icon: <Icon name="trash" />, onClick: () => {} },
      ]}
    />
  )
};

// With disabled item
export const WithDisabled: Story = {
  render: () => (
    <MenuPopover
      isOpen={true}
      onClose={() => {}}
      items={[
        { label: 'Edit', onClick: () => {} },
        { label: 'Publish', type: 'disabled' },
        { label: 'Delete', type: 'destructive', onClick: () => {} },
      ]}
    />
  )
};

// Context menu pattern
export const ContextMenu: Story = {
  args: {
    isOpen: true,
    width: 180,
    items: [
      { label: 'Open', onClick: () => {} },
      { label: 'Open in new tab', onClick: () => {} },
      { isSeparator: true },
      { label: 'Copy link', onClick: () => {} },
      { isSeparator: true },
      { label: 'Delete', type: 'destructive', onClick: () => {} },
    ]
  }
};
```

---

## 10. Implementation Notes

**Positioning:** Use `floating-ui` (or Popper.js) for anchor-relative positioning. Menu/Popover does not manage its own position — it is positioned absolutely relative to its trigger. The `placement` prop controls which side of the trigger the menu appears on.

**Slot wiring (Figma):** The `menu-items` SLOT requires manual conversion in Figma UI — select the `menu-items` frame → right-click → "Create slot". Set Preferred Instances to `_Internal/Menu/List-Item` and `Separator`. This is a known API limitation.

**Animation:** On open, animate with `opacity: 0 → 1` and `transform: translateY(-4px) → translateY(0)`. Duration: 120ms ease-out. On close: reverse, 80ms ease-in.

**Outside click:** Attach a `mousedown` listener to `document` when menu is open. If the click target is outside the menu popover and its trigger, call `onClose()`.

**Scroll behavior:** If item count exceeds visible area (>8–10 items), add `max-height` and `overflow-y: auto` to the menu-items container. This is not modeled in Figma — implement in CSS.

**Separator:** Use the existing `Separator` atom (1138:8786) — 1px horizontal rule, `border/subtle` token. Do not create custom dividers.

---

## 11. Do / Don't

**Do:**
- Use for dropdown menus, three-dot context menus, and right-click context menus
- Always include keyboard navigation (ArrowUp/Down, Enter, Escape)
- Return focus to trigger on close
- Use Separator to group related actions

**Don't:**
- Don't use Menu/Popover for navigation menus (use a nav pattern)
- Don't exceed 10 items without adding scroll — menus should be scannable at a glance
- Don't nest menus — Venus 2.1 RF does not support multi-level menus in this component
- Don't use Chip or Tag inside a Menu — items are List-Item only

---

## 12. Related Components

| Component | Relationship |
|---|---|
| `_Internal/Menu/List-Item` | Direct child atom — the interactive item inside the shell |
| `Separator` | Optional child atom — 1px divider between item groups |
| `Icon Button` | Typical trigger — three-dot / kebab button opens the menu |
| `Button` | Alternative trigger for labeled dropdown buttons |
| `Select` | Alternative for option selection — use Select when a value is being set, Menu when actions are being triggered |
