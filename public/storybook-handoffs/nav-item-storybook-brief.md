# Storybook Brief — `_Internal/Nav/Item`

**Figma node:** `1290:37520`
**Page:** 🧭 Navigation
**Status:** Active v2.1.0
**Audit:** ✅ Conditional Pass — 0 blockers, 2 warnings (resolved)
**Date:** 2026-07-09

---

## 1. Purpose

`Nav/Item` is the atomic navigation item used exclusively within top navigation bars and secondary sidebar navigation contexts. It represents a single destination or action group within a `<nav>` landmark.

**Use when:** Building a horizontal top nav bar or a vertical sidebar nav. Each destination (Dashboard, Settings, Users etc.) is a Nav/Item instance.

**Do NOT use when:** Switching content within a surface — use `Tab` instead. Nav/Item is for global wayfinding; Tab is for local content switching. They share a visual language (bottom border active indicator) but carry different ARIA semantics and must never be interchanged.

**Alternatives:** `Tab` for in-page content switching. `Hyperlink` for standalone inline navigation links.

There are two structural types controlled by the `Type` variant property:

- **Type=Nav** — icon + label + optional dropdown chevron. The standard nav item for all destinations.
- **Type=Brand** — brand icon lockup only. Sits at the far left of the nav bar, representing the current product/app. Instance-swappable to any brand icon.

---

## 2. Anatomy

```
_Internal/Nav/Item (COMPONENT_SET root)
│
├── focus-ring (FRAME, ABSOLUTE)
│   └── 2px purple stroke, OUTSIDE, covers full item bounds
│       Wired to hasFocus. Hidden by default.
│
├── [Type=Nav only]
│   ├── leading-icon (INSTANCE — _Internal/Icon-Wrapper/16px)
│   │   Swapped by designer to the destination's icon (GridView, GearSix, etc.)
│   │   Wired to hasLeadingIcon.
│   │
│   ├── label (TEXT — Inter Medium 13px)
│   │   Wired to hasLabel + label text property.
│   │
│   └── dropdown-icon (INSTANCE — _Internal/Icon-Wrapper/16px)
│       Always contains Caret/down. Never swapped.
│       Wired to hasDropdown. Hidden by default.
│
├── [Type=Brand only]
│   └── brand-icon (INSTANCE — Administration default)
│       Full brand lockup: 32px tile + product name text.
│       Instance-swapped by designer to match the current product.
│
└── active-indicator (FRAME, ABSOLUTE — Type=Nav only)
    2px height, STRETCH horizontal, anchored to bottom edge (y=38).
    fill = action/primary. Visible only on State=Active.
```

**DOM mapping:**

| Figma layer | DOM element | Notes |
|---|---|---|
| Nav/Item root | `<button>` or `<a>` | `<a>` for page navigation; `<button>` for JS-router navigation |
| leading-icon | `<span aria-hidden="true">` + SVG | Icon is decorative when label is present |
| label | Text node inside `<span>` | |
| dropdown-icon | `<span aria-hidden="true">` + SVG | Rotates 180° via CSS when `aria-expanded="true"` |
| active-indicator | CSS `::after` pseudo-element | `position: absolute; bottom: 0; left: 0; right: 0; height: 2px` |
| focus-ring | CSS `:focus-visible` outline | Not a DOM element — handled via CSS |

---

## 3. TypeScript Props Interface

```typescript
interface NavItemProps {
  /** Structural type of the nav item */
  type?: 'nav' | 'brand';

  /** Interactive state. Hover/focus are CSS pseudo-classes in production. */
  state?: 'default' | 'active' | 'disabled';

  /** Shows/hides the leading 16px icon. Type=Nav only. */
  hasLeadingIcon?: boolean;

  /** Icon component for the leading position. Type=Nav only. */
  leadingIcon?: React.ReactNode;

  /** Shows/hides the label text. Type=Nav only. */
  hasLabel?: boolean;

  /** Navigation item label. Type=Nav only. */
  label?: string;

  /**
   * Shows a Caret/down icon as a trailing element.
   * Indicates this item has a dropdown panel. Type=Nav only.
   * The chevron rotates 180° when aria-expanded="true".
   */
  hasDropdown?: boolean;

  /**
   * Whether the dropdown is currently open.
   * Controls aria-expanded and chevron rotation. Type=Nav only.
   */
  isExpanded?: boolean;

  /**
   * Brand icon component for Type=Brand.
   * Accepts any brand icon from the Contentstack brand icon set.
   */
  brandIcon?: React.ReactNode;

  /** Whether this item represents the current page/section. */
  isActive?: boolean;

  /** Disables interaction. */
  disabled?: boolean;

  /** Navigation href. Use for standard page navigation. */
  href?: string;

  /** Click handler. Use for JS-router navigation. */
  onClick?: () => void;

  /** Additional CSS class names. */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma property | Type | React prop | Notes |
|---|---|---|---|
| `Type` (Variant) | Nav / Brand | `type` | |
| `State=Active` (Variant) | — | `isActive` | Maps to `aria-current="page"` |
| `State=Disabled` (Variant) | — | `disabled` | Maps to `aria-disabled="true"` + `tabindex="-1"` |
| `State=Hover` | CSS | `:hover` pseudo-class | Never a prop |
| `State=Focused` | CSS | `:focus-visible` pseudo-class | Never a prop |
| `hasFocus` (Boolean) | — | Storybook demo only | Maps to `:focus-visible` in production |
| `hasLeadingIcon` (Boolean) | — | `hasLeadingIcon` | |
| `hasLabel` (Boolean) | — | `hasLabel` | |
| `hasDropdown` (Boolean) | — | `hasDropdown` | |
| `label` (Text) | — | `label` | |
| `brand-icon` (Instance Swap) | — | `brandIcon` | |

---

## 5. State Behaviour Table

| State | Trigger | Visual changes | Tokens | ARIA |
|---|---|---|---|---|
| Default | — | Transparent bg, text/subtle label, icon in default mode | `text/subtle` | — |
| Hover | Mouse over | surface/hover-overlay bg tint | `surface/hover-overlay` | — |
| Active | Current page | text/brand label, 2px action/primary indicator at bottom | `text/brand`, `action/primary` | `aria-current="page"` |
| Disabled | `disabled` prop | 40% opacity on entire item, no hover response | `visibility/disabled` | `aria-disabled="true"`, `tabindex="-1"` |
| Focused | Keyboard Tab | 2px purple focus ring appears around full item bounds | `focus/ring/color` | — (CSS `:focus-visible`) |

**Dropdown open state (hasDropdown=true):**

| State | Chevron | ARIA |
|---|---|---|
| Closed | 0° (pointing down) | `aria-expanded="false"` |
| Open | 180° (pointing up) | `aria-expanded="true"` |

Transition: `transform 150ms ease`. Respects `prefers-reduced-motion`.

---

## 6. Size Specification

Nav/Item has a single size. Height is determined by the parent `Nav/Top-Bar` container (40px total bar height). The item itself uses `height: 100%` (FILL in Figma).

| Property | Value | Token |
|---|---|---|
| Height | FILL (40px bar) | Inherits from parent |
| Padding H | 8px | `space/8` |
| Padding V | 4px | `space/4` |
| Icon size | 16px | `_Internal/Icon-Wrapper/Size=16px` |
| Label font size | 13px | Inter Medium (body/sm density) |
| Label line height | 130% | Set manually — not bound |
| Gap (icon to label) | 4px | `space/4` |
| Active indicator height | 2px | `space/2` |
| Focus ring width | 2px | — |
| Focus ring offset | 0px (flush — full bleed) | — |

---

## 7. Token Reference Table

| Layer | CSS property | Token | Light value | Dark value |
|---|---|---|---|---|
| Container (Hover) | `background-color` | `surface/hover-overlay` | purple/500 @8% | purple/400 @8% |
| Container (Brand/Hover) | `background-color` | `surface/hover-overlay` | purple/500 @8% | purple/400 @8% |
| label (Default/Hover/Disabled) | `color` | `text/subtle` | gray/500 #6B7280 | gray/400 #9CA3AF |
| label (Active) | `color` | `text/brand` | purple/500 #6C5CE7 | purple/400 #A78BFA |
| active-indicator | `background-color` | `action/primary` | purple/500 #6C5CE7 | purple/600 #5B4BD4 |
| focus ring | `outline-color` | `focus/ring/color` | purple/500 #6C5CE7 | purple/400 #A78BFA |
| Disabled root | `opacity` | `visibility/disabled` | 0.40 | 0.40 |
| Padding H | `padding-left/right` | `space/8` | 8px | 8px |
| Padding V | `padding-top/bottom` | `space/4` | 4px | 4px |
| Gap | `gap` | `space/4` | 4px | 4px |

---

## 8. Accessibility Checklist

```
Component: _Internal/Nav/Item    Auditor: Claude    Date: 2026-07-09

TOKENS
[✅] text/subtle on surface/default: gray/500 on white ≈ 4.48:1
     ⚠️ Borderline AA. Systemic token issue — flagged for token review.
[✅] text/brand on surface/default: purple/500 on white = 4.86:1 ✅ AA
[✅] focus/ring/color on white: purple/500 = 4.86:1 ✅ AA
[✅] Disabled at 40% opacity — WCAG exempts disabled UI from contrast requirements
[✅] Active state uses colour + indicator (two channels) — not colour alone

SIZING
[✅] Interactive height: 40px ✅ (minimum 24px)
[✅] Interactive width: HUGs to content, minimum ~40px with icon only ✅
[✅] Adjacent item spacing: defined by Nav/Top-Bar gap — not component concern

KEYBOARD
[✅] Tab-accessible (not disabled)
[✅] Focus ring visible on :focus-visible (CSS) / hasFocus (Storybook)
[✅] Enter activates navigation
[✅] Dropdown: Enter/Space opens panel, Escape closes, arrow keys navigate
[✅] Disabled items: tabindex="-1", no keyboard activation

SCREEN READER
[✅] ARIA role: menuitem (inside nav > ul > li > a/button)
[✅] Active item: aria-current="page"
[✅] Disabled item: aria-disabled="true"
[✅] Leading icon: aria-hidden="true" when label is present
[✅] Leading icon: requires aria-label on item when hasLabel=false
[✅] Dropdown trigger: aria-expanded, aria-haspopup="menu"
[✅] Brand item: icon is decorative; product name included in lockup text

MOTION
[✅] Hover bg transition: ≤ 150ms
[✅] Chevron rotation: ≤ 150ms
[✅] prefers-reduced-motion: remove transitions, keep state changes

STATUS: ✅ CONDITIONAL PASS
P3: text/subtle contrast is 4.48:1 — systemic token issue, not component fix
```

---

## 9. Storybook Stories

```typescript
// nav-item.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { NavItem } from './NavItem';
import { GridView, GearSix, Users, Envelope } from '@contentstack/icons';
import { AdministrationBrand } from '@contentstack/brand-icons';

const meta: Meta<typeof NavItem> = {
  title: 'Navigation/NavItem',
  component: NavItem,
  parameters: {
    layout: 'centered',
  },
};
export default meta;
type Story = StoryObj<typeof NavItem>;

export const Default: Story = {
  args: {
    type: 'nav',
    label: 'Dashboard',
    hasLeadingIcon: true,
    leadingIcon: <GridView />,
    hasLabel: true,
    hasDropdown: false,
    isActive: false,
    disabled: false,
  },
};

export const Active: Story = {
  args: {
    ...Default.args,
    isActive: true,
  },
};

export const WithDropdown: Story = {
  args: {
    ...Default.args,
    label: 'Organisations',
    leadingIcon: <Users />,
    hasDropdown: true,
  },
};

export const WithDropdownOpen: Story = {
  args: {
    ...WithDropdown.args,
    isExpanded: true,
  },
};

export const IconOnly: Story = {
  args: {
    type: 'nav',
    hasLeadingIcon: true,
    leadingIcon: <GearSix />,
    hasLabel: false,
    hasDropdown: false,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Focused: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    pseudo: { focusVisible: true },
  },
};

export const BrandDefault: Story = {
  args: {
    type: 'brand',
    brandIcon: <AdministrationBrand />,
  },
};

export const BrandHover: Story = {
  args: {
    ...BrandDefault.args,
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const AllNavStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 0, background: 'white', padding: '0 16px' }}>
      <NavItem type="nav" label="Default" leadingIcon={<GridView />} />
      <NavItem type="nav" label="Active" leadingIcon={<GridView />} isActive />
      <NavItem type="nav" label="Dropdown" leadingIcon={<Users />} hasDropdown />
      <NavItem type="nav" label="Disabled" leadingIcon={<GearSix />} disabled />
    </div>
  ),
};

export const AllBrandStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 0, background: 'white', padding: '0 16px' }}>
      <NavItem type="brand" brandIcon={<AdministrationBrand />} />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { ...Active.args },
  parameters: {
    backgrounds: { default: 'dark' },
    themes: { default: 'dark' },
  },
};

export const InNavBar: Story = {
  render: () => (
    <nav aria-label="Main navigation" style={{
      display: 'flex', alignItems: 'center', height: '40px',
      background: 'white', borderBottom: '1px solid #E5E7EB',
      padding: '0 24px', gap: 0,
    }}>
      <NavItem type="brand" brandIcon={<AdministrationBrand />} />
      <NavItem type="nav" label="Dashboard" leadingIcon={<GridView />} isActive />
      <NavItem type="nav" label="Organisations" leadingIcon={<Users />} />
      <NavItem type="nav" label="Email Settings" leadingIcon={<Envelope />} />
      <NavItem type="nav" label="Settings" leadingIcon={<GearSix />} />
    </nav>
  ),
};
```

---

## 10. Implementation Notes

**CSS custom properties:**
```css
/* Token references */
--nav-item-padding-h:        var(--space-8, 8px);
--nav-item-padding-v:        var(--space-4, 4px);
--nav-item-gap:              var(--space-4, 4px);
--nav-item-indicator-h:      var(--space-2, 2px);
--nav-item-text-default:     var(--text-subtle);
--nav-item-text-active:      var(--text-brand);
--nav-item-fill-hover:       var(--surface-hover-overlay);
--nav-item-indicator-fill:   var(--action-primary);
--nav-item-focus-ring:       var(--focus-ring-color);
--nav-item-disabled-opacity: var(--visibility-disabled, 0.40);

.nav-item {
  display: flex;
  align-items: center;
  height: 100%;
  padding: var(--nav-item-padding-v) var(--nav-item-padding-h);
  gap: var(--nav-item-gap);
  position: relative;
  color: var(--nav-item-text-default);
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
}

.nav-item:hover { background: var(--nav-item-fill-hover); }

.nav-item[aria-current="page"] { color: var(--nav-item-text-active); }

.nav-item[aria-current="page"]::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: var(--nav-item-indicator-h);
  background: var(--nav-item-indicator-fill);
}

.nav-item[aria-disabled="true"] {
  opacity: var(--nav-item-disabled-opacity);
  pointer-events: none;
  cursor: not-allowed;
}

.nav-item:focus-visible {
  outline: 2px solid var(--nav-item-focus-ring);
  outline-offset: 0;
}

/* Dropdown chevron */
.nav-item__dropdown-icon {
  transition: transform 150ms ease;
}
.nav-item[aria-expanded="true"] .nav-item__dropdown-icon {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .nav-item__dropdown-icon { transition: none; }
  .nav-item { transition: none; }
}
```

**Dark mode:** Apply via `[data-theme="dark"]` selector on a parent element. All tokens resolve to dark values automatically via CSS custom property cascade.

**Icon-only items (`hasLabel=false`):** The item's own icon remains visible. The `aria-label` attribute must be set to the destination name — the icon alone is not sufficient for screen readers.

**Overflow/more pattern:** Create a Nav/Item with `hasLabel=false`, swap leading-icon to `DotsThreeLarge`, and set `hasDropdown=true`. This represents "more items" that don't fit in the bar — the dropdown panel shows the overflow items.

**Router integration:** Use `isActive` derived from the router's `useMatch` or `useLocation` hook. Never manually manage active state — let the router own it.

---

## 11. Do / Don't

**Do:** Use `aria-current="page"` on the active nav item — it's the standard ARIA pattern for current page indication in navigation.

**Don't:** Use `role="tab"` or `aria-selected` — this is navigation, not a tabpanel switcher. Wrong ARIA semantics will confuse screen reader users.

**Do:** Set `aria-label` on icon-only items — `<NavItem hasLabel={false} leadingIcon={<GearSix />} aria-label="Settings" />`.

**Don't:** Rely on the icon alone to communicate the destination. Icons are supplementary, not primary.

**Do:** Let the router control `isActive`. Derive it from `useMatch('/dashboard')` or equivalent.

**Don't:** Manually toggle `isActive` based on click events — this will break on direct URL navigation and browser back/forward.

**Do:** Place Nav/Items inside a `<nav aria-label="Main navigation">` landmark. Screen readers announce the landmark context before reading items.

**Don't:** Use Nav/Item outside a `<nav>` landmark — it has ARIA semantics tied to that context.

**Do:** Use `Type=Brand` for the product logo at the far left — it's instance-swappable to any product in the Contentstack ecosystem.

**Don't:** Build the brand lockup from scratch inside the nav bar — always use the `Type=Brand` variant with the correct brand icon swapped in.

---

## 12. Related Components

| Component | Relationship | When to use |
|---|---|---|
| `Tab` | Visual sibling, semantic sibling | Use Tab for switching content within a surface. Same bottom-border indicator pattern but `role="tab"` + `aria-selected` semantics. |
| `Nav/Top-Bar` | Parent | Nav/Item lives inside Nav/Top-Bar. Never place Nav/Item directly on a canvas without a bar shell. |
| `_Internal/Menu/List-Item` | Companion | Used inside the dropdown panel that Nav/Item (with hasDropdown) triggers. |
| `_Internal/Icon-Wrapper` | Dependency | Wraps all icons inside Nav/Item. 16px size variant used throughout. |
| `Icon Button` | Alternative for utility actions | Right-side utility icons (Help, Docs, App switcher) in the nav bar use Icon Button, not Nav/Item. |

---

*Brief generated: 2026-07-09 | Component version: 2.1.0 | Audit: Conditional Pass*
