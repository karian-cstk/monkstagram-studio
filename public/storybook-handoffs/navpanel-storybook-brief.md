# NavPanel — Storybook Engineering Brief
**Venus 2.1 RF | Component: NavPanel | Node: 1438:79784**
**Status: Active v1.0.0 | Page: 🧭 Navigation | Last updated: 2026-07-16**

---

## 1. Purpose

`NavPanel` is a collapsible vertical navigation sidebar. It sits on the left edge of the application layout, between the top navigation bar and the main content area. Its purpose is to provide persistent, structured access to navigation, content filtering, and contextual actions — without permanently consuming horizontal space.

The NavPanel is not a static element. It is a *state machine* with three distinct configurations: fully expanded, icon-only rail, and fully collapsed. Each configuration is a deliberate design contract — not just a visual toggle — because each one communicates a different relationship between the user and the available navigational depth.

**Use when:**
- The application has multiple sections requiring structured navigation (CMS modules, settings areas, content trees)
- Content filtering or view switching requires persistent sidebar access (filter chips, view toggles)
- The user needs to balance navigation access with maximum content viewport
- The product requires a panel that can be resized by the user at runtime

**Do not use when:**
- Navigation depth is shallow (1–2 levels) — use a top navigation bar only
- The page is a full-screen modal, wizard, or onboarding flow — navigation panels distract
- Mobile viewport — NavPanel is a desktop-first component; use a Drawer instead

**Alternatives:**
- `Drawer` — for temporary overlay navigation on mobile or contextual panels
- `Nav/Top-Bar` — for application-level navigation across major sections
- `Tabs` — for switching between distinct content sections within a single page

---

## 2. Anatomy

### 2.1 The Three States

```
STATE: EXPANDED
┌─────────────────────────┐◄─ border/default 1px OUTSIDE
│ Navigation           [⋯]│◄─ _NavPanelHeader (48px, optional)
├─────────────────────────┤◄─ Separator (border/subtle 1px)
│ ┌─────────────────────┐ │
│ │Option 1 │ Option 2  │ │◄─ _NavPanelTabZone (56px)
│ └─────────────────────┘ │   wraps Segmented Control md
├─────────────────────────┤
│ 🔍 Search...            │◄─ _NavPanelSearch (48px)
├─────────────────────────┤◄─ Separator (border/subtle 1px)
│                         │
│  [slot — nav items]     │◄─ _NavPanelBody (FILL, SLOT)
│                         │
├─────────────────────────┤◄─ Separator (border/subtle 1px)
│ [↗] Footer Action       │◄─ _NavPanelActionBar (44px)
└─────────────────────────┘
                          ◄─ FAB Secondary sm, ABSOLUTE, x=panelWidth−12, y=12

STATE: ICON-ONLY (48px rail)
┌────┐◄─ border/default 1px OUTSIDE
│[≡] │◄─ icon-header (48px) — panel identity icon
├────┤◄─ Separator
│[⊞] │◄─ icon-tab-zone (56px) — active segment icon
│[🔍]│◄─ icon-search (48px) — always magnifying glass
├────┤◄─ Separator
│    │◄─ icon-body-slot (FILL)
├────┤◄─ Separator
│[↗] │◄─ icon-action-bar (44px)
├────┤◄─ Separator
│    │◄─ icon-footer (48px, hidden by default)
└────┘
     ◄─ FAB Secondary sm (CaretRight), ABSOLUTE, right edge

STATE: COLLAPSED (12px edge strip)
┌──┐◄─ border/default 1px OUTSIDE
│  │
│  │◄─ surface/raised fill, no internal content
│  │
└──┘
   ◄─ FAB Secondary sm (CaretRight), ABSOLUTE, half inside/half outside
```

### 2.2 Layer Map

| Layer | Node ID | DOM element | Role |
|---|---|---|---|
| NavPanel root | 1438:79784 | `<aside>` | Component shell. VERTICAL auto-layout. `position: relative`. Carries fill + border. |
| `_NavPanelHeader` | 1438:86204 | `<div class="nav-panel-header">` | Optional title row. `hasHeader` controls visibility. Contains `panelTitle` (text) + `btn/trailing-action` (Icon Button Ghost md). |
| `separator` | 1138:8786 | `<hr>` / `<div class="separator">` | 1px horizontal rule. `border/subtle`. FILL width. |
| `_NavPanelTabZone` | 1438:79635 | `<div class="nav-panel-tab-zone">` | Houses Segmented Control md. `hasTabStrip` controls visibility. 56px fixed height. |
| `_NavPanelSearch` | 1438:79650 | `<div class="nav-panel-search">` | Houses Search Input compact. `hasSearch` controls visibility. 48px fixed height. |
| `_NavPanelBody` | 1438:79689 | `<div class="nav-panel-body">` | Pure SLOT. Fills remaining vertical space. Consumers inject Nav/Item components or any content. |
| `_NavPanelActionBar` | 1438:79691 | `<div class="nav-panel-action-bar">` | Contains a single Button Tertiary md (`btn/action`). `hasActionBar` controls visibility. 44px fixed height. |
| `_NavPanelFooter` | 1438:79703 | `<div class="nav-panel-footer">` | Pure SLOT. 48px fixed height. Hidden by default (`hasFooter=false`). |
| `btn/collapse-toggle` | Instance | `<button class="nav-panel-collapse-toggle">` | FAB Secondary sm. ABSOLUTE. Straddling right edge. Triggers collapse/expand. |
| `resize-handle` | 1438:79709 | `<div class="nav-panel-resize-handle">` | 12px wide ABSOLUTE overlay on right edge. y=0, h=640 (full panel height). Contains a 3px `border/brand` vertical line. Visible when `isDraggable=true`. z-index 0 — behind all content. **Mutually exclusive with `btn/collapse-toggle`** — never both enabled simultaneously. |

### 2.3 Icon-Only Layer Map

| Layer | DOM element | Role |
|---|---|---|
| `icon-header` | `<div class="nav-icon-header">` | 48×48px centred zone. Icon Button Ghost md. Identity icon for the panel. |
| `icon-tab-zone` | `<div class="nav-icon-tab-zone">` | 56×48px centred zone. Icon Button Ghost md. Represents the active segment. |
| `icon-search` | `<div class="nav-icon-search">` | 48×48px centred zone. Icon Button Ghost md. Always MagnifyingGlass icon. |
| `icon-body-slot` | `<div class="nav-icon-body">` | FILL. Slot for icon-only nav items. |
| `icon-action-bar` | `<div class="nav-icon-action-bar">` | 44×48px centred zone. Icon Button Ghost md. Same action as expanded action bar. |
| `icon-footer` | `<div class="nav-icon-footer">` | 48×48px. Hidden by default. |
| `btn/expand-toggle` | `<button class="nav-panel-expand-toggle">` | FAB Secondary sm. ABSOLUTE right edge. CaretRight icon. Expands to icon-only or expanded state. |

---

## 3. TypeScript Props Interface

```typescript
interface NavPanelProps {
  /**
   * Panel visibility and layout state.
   * - 'expanded': full panel, all sections visible
   * - 'icon-only': 48px icon rail — each section represented by a single icon
   * - 'collapsed': 12px edge strip — only the expand FAB is visible
   * @default 'expanded'
   */
  state?: 'expanded' | 'icon-only' | 'collapsed';

  /**
   * Panel width when in expanded state.
   * Icon-only and Collapsed are always 48px and 12px respectively,
   * regardless of this value.
   * - 'M': 220px — standard desktop sidebar
   * - 'L': 320px — wider sidebar for content-rich nav trees
   * - 'Max': 400px — maximum width for admin/complex hierarchies
   * @default 'M'
   */
  width?: 'M' | 'L' | 'Max';

  /**
   * Show the header row containing the panel title and optional trailing action.
   * When true: 48px title bar appears at top of panel.
   * When false: first visible section is the tab zone or search.
   * @default true
   */
  hasHeader?: boolean;

  /**
   * Panel title text shown in the header row.
   * Only rendered when hasHeader=true.
   * @default 'Navigation'
   */
  panelTitle?: string;

  /**
   * Show the trailing action icon button in the header.
   * Only rendered when hasHeader=true.
   * @default true
   */
  hasTrailingAction?: boolean;

  /**
   * Show the Segmented Control tab zone below the header.
   * Use when the panel has two mutually exclusive content views
   * (e.g. "All" / "Favourites", "Entries" / "Assets").
   * @default true
   */
  hasTabStrip?: boolean;

  /**
   * The labels for the segmented control tabs.
   * Only used when hasTabStrip=true.
   * Maximum 2 items for standard usage (the Segmented Control supports up to 5).
   */
  tabLabels?: [string, string];

  /**
   * Index of the currently active tab (0-based).
   * Only used when hasTabStrip=true.
   * @default 0
   */
  activeTabIndex?: number;

  /** Callback fired when a tab is selected. */
  onTabChange?: (index: number) => void;

  /**
   * Show the search input below the tab zone.
   * When true: 48px search input zone appears.
   * In icon-only state: renders as a MagnifyingGlass icon button (always).
   * @default true
   */
  hasSearch?: boolean;

  /**
   * Placeholder text for the search input.
   * Only used when hasSearch=true in expanded state.
   * @default 'Search...'
   */
  searchPlaceholder?: string;

  /** Callback fired when search input changes. */
  onSearch?: (value: string) => void;

  /**
   * Content for the main body slot.
   * In expanded state: renders directly inside the body slot.
   * In icon-only state: renders inside the icon-body-slot.
   * Use Nav/Item components for standard navigation.
   */
  children?: React.ReactNode;

  /**
   * Show the action bar at the bottom of the panel body.
   * Contains a single Button Tertiary md (the "Footer Action" button).
   * @default true
   */
  hasActionBar?: boolean;

  /**
   * Label for the footer action button.
   * Only used when hasActionBar=true.
   * @default 'Footer Action'
   */
  actionLabel?: string;

  /**
   * Icon for the footer action button.
   * In icon-only state: this icon is used for the icon-action-bar zone.
   */
  actionIcon?: React.ReactNode;

  /** Callback fired when the action bar button is clicked. */
  onAction?: () => void;

  /**
   * Show the footer slot at the very bottom of the panel.
   * For persistent footer content: user profile, version number, etc.
   * @default false
   */
  hasFooter?: boolean;

  /**
   * Content for the footer slot.
   * Only rendered when hasFooter=true.
   */
  footer?: React.ReactNode;

  /**
   * Enable the resize handle on the right edge of the expanded panel.
   * When true: a 3px brand-purple drag line appears on the panel's right edge
   * running the full panel height. The cursor changes to `col-resize` on hover.
   *
   * **MUTUAL EXCLUSION**: When `isDraggable=true`, always set `hasCollapseToggle=false`.
   * The resize interaction and collapse toggle conflict — users cannot resize and
   * collapse simultaneously, and the FAB creates visual noise over the drag line.
   *
   * @default false
   */
  isDraggable?: boolean;

  /**
   * Callback fired continuously as the user drags the resize handle.
   * Receives the new panel width in pixels.
   * Only called when isDraggable=true.
   */
  onResize?: (width: number) => void;

  /**
   * Callback fired when the user releases the resize handle.
   * Receives the final panel width in pixels.
   */
  onResizeEnd?: (width: number) => void;

  /**
   * Show the collapse/expand toggle FAB on the right edge.
   * **MUTUAL EXCLUSION**: Always set to `false` when `isDraggable=true`.
   * @default true
   */
  hasCollapseToggle?: boolean;

  /**
   * Callback fired when the collapse/expand toggle is activated.
   * Receives the new state the panel is transitioning TO.
   */
  onToggle?: (newState: 'expanded' | 'icon-only' | 'collapsed') => void;

  /** Additional CSS class names for the panel root. */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | Figma Type | React Prop | Notes |
|---|---|---|---|
| `State` | VARIANT | `state` | `'expanded' \| 'icon-only' \| 'collapsed'`. Figma uses PascalCase (Expanded). React uses lowercase. |
| `Width` | VARIANT | `width` | `'M' \| 'L' \| 'Max'`. Drives expanded panel width only. |
| `hasHeader` | BOOLEAN | `hasHeader` | Wires to `_NavPanelHeader` visibility. |
| `hasTabStrip` | BOOLEAN | `hasTabStrip` | Wires to `_NavPanelTabZone` visibility. |
| `hasSearch` | BOOLEAN | `hasSearch` | Wires to `_NavPanelSearch` visibility. |
| `hasActionBar` | BOOLEAN | `hasActionBar` | Wires to `_NavPanelActionBar` visibility. |
| `hasFooter` | BOOLEAN | `hasFooter` | Wires to `_NavPanelFooter` visibility. |
| `isDraggable` | BOOLEAN | `isDraggable` | Wires to `resize-handle` visibility. Mutually exclusive with `hasCollapseToggle`. |
| `hasCollapseToggle` | BOOLEAN | `hasCollapseToggle` | Wires to `btn/collapse-toggle` visibility on all Expanded variants. Set `false` when `isDraggable=true`. |
| `panelTitle` | TEXT | `panelTitle` | Text on `_NavPanelHeader` title node. |
| `icon-body-slot` | SLOT | `children` | Main body content. |
| `State=Expanded > _NavPanelHeader > hasTitle` | BOOLEAN | — | Always true in production. Controlled by `_NavPanelHeader` component internally. |
| `btn/collapse-toggle` state | — | — | Icon swap (CaretLeft/CaretRight) is handled by component logic, not a prop. |
| `resize-handle` state | — | — | Idle/Hover variants are handled by CSS :hover, not a prop. |

**State/Hover/Pressed/Focus** — all handled by CSS pseudo-classes. Never manage panel hover state with React state.

**Panel width in code** — driven by the `width` prop when `state='expanded'`. In `'icon-only'` and `'collapsed'` states, the width is always 48px and 12px respectively regardless of the `width` prop.

---

## 5. State Behaviour

### 5.1 Panel State Machine

```
                    ┌─────────────────────────────────────────────┐
                    │                                             │
          ┌─────────▼──────────┐         ┌────────────────────┐  │
          │     EXPANDED       │─click──▶│    ICON-ONLY       │  │
          │   (full panel)     │◀─click──│  (48px icon rail)  │  │
          └────────────────────┘         └──────────┬─────────┘  │
                    │                               │             │
                    │ double-click / long-press      │ click       │
                    │ (skip icon-only)              ▼             │
                    └──────────────────────▶ COLLAPSED ───────────┘
                                             (12px strip)
```

**State transitions:**
- **Expanded → Icon-only**: User clicks the collapse toggle FAB (CaretLeft). Panel animates to 48px width. Content collapses to icon representations.
- **Icon-only → Expanded**: User clicks the expand toggle FAB (CaretRight) on the icon rail. Panel animates back to its original width.
- **Icon-only → Collapsed**: User clicks the expand toggle FAB again (or application sets `state='collapsed'`). Panel collapses to 12px edge strip.
- **Collapsed → Expanded**: User clicks the expand toggle FAB (half-visible on the edge). Panel expands directly to `expanded` state (skips icon-only).

**In code**, the state machine is owned by the consuming layout component, not the NavPanel itself:

```typescript
const [panelState, setPanelState] = useState<'expanded' | 'icon-only' | 'collapsed'>('expanded');

const handleToggle = (newState: 'expanded' | 'icon-only' | 'collapsed') => {
  setPanelState(newState);
};
```

### 5.2 Section Visibility States

| Section | hasHeader=true | hasTabStrip=false | hasSearch=false | hasActionBar=false | hasFooter=true |
|---|---|---|---|---|---|
| Header row | 48px visible | — | — | — | — |
| Tab zone | — | Hidden (height=0) | — | — | — |
| Search | — | — | Hidden (height=0) | — | — |
| Body | FILL | FILL (grows) | FILL (grows) | FILL (grows) | FILL |
| Action bar | — | — | — | Hidden (height=0) | — |
| Footer | — | — | — | — | 48px visible |

Hiding any section causes the body slot to absorb the freed height. The panel's total height is always fixed (640px in Figma; 100% of viewport height in production).

### 5.3 Resize State (isDraggable=true)

When `isDraggable=true`, the panel enters resizable mode. The `btn/collapse-toggle` FAB must be hidden simultaneously — these two modes are mutually exclusive.

**In Figma:** set `isDraggable=true` and `hasCollapseToggle=false` together.
**In code:** if `isDraggable` is truthy, omit or `display:none` the collapse toggle FAB.

The resize handle has three sub-states:

| Sub-state | Trigger | Visual change |
|---|---|---|
| `idle` | `isDraggable=true`, mouse not on edge | 3px `border/brand` (purple/500) line visible from top to bottom of panel. No cursor change. |
| `hover` | Mouse within 6px of panel right edge | Same 3px purple line (unchanged visually). Cursor changes to `col-resize`. Drag activates on mousedown. |
| `dragging` | User mousedown on the handle | Line stays visible. Panel width updates in real time. Width constrained to min 160px, max 500px. |
| `released` | User mouseup | `onResizeEnd` fires with final width. Returns to `idle` sub-state. |

**The resize handle never appears when `isDraggable=false`.** Use conditional rendering — do not rely on CSS visibility or opacity alone.

**Figma representation:** Both `State=Idle` and `State=Hover` variants of `_PanelResizeHandle` are visually identical (3px purple line, full 640px height). The Idle/Hover distinction is a code concern only — Figma does not execute hover states.

---

## 6. Size Specification

### 6.1 Expanded State Widths

| Width | Panel width | Body slot width | Typical use |
|---|---|---|---|
| M | 220px | 196px (220 − 12px padding each side) | Standard desktop sidebar |
| L | 320px | 296px | Wider nav trees, longer labels |
| Max | 400px | 376px | Admin panels, deep hierarchies |

### 6.2 Fixed-Height Sections (all widths)

| Section | Height | Padding V | Padding H | Notes |
|---|---|---|---|---|
| `_NavPanelHeader` | 48px | 0 | pl=12px, pr=8px | HORIZONTAL, SPACE_BETWEEN. Title: Heading/XS (14px SemiBold). |
| Separator | 1px | 0 | 0 | FILL width. border/subtle. |
| `_NavPanelTabZone` | 56px | space/8 (8px) | space/12 (12px) | Segmented Control md fills available width. |
| `_NavPanelSearch` | 48px | space/8 (8px) | space/12 (12px) | Search Input compact fills available width. |
| `_NavPanelBody` | FILL | 0 | 0 | Slot — content sets its own padding. |
| `_NavPanelActionBar` | 44px | space/8 (8px) | space/12 (12px) | Button Tertiary md. |
| `_NavPanelFooter` | 48px | 0 | 0 | Slot. |

### 6.3 Icon-Only State Sections

| Section | Height | Width | Icon |
|---|---|---|---|
| `icon-header` | 48px | 48px | Panel identity icon (consumer-defined) |
| `icon-tab-zone` | 56px | 48px | Active segment icon (consumer-defined) |
| `icon-search` | 48px | 48px | Always MagnifyingGlass |
| `icon-body-slot` | FILL | 48px | Slot for icon-only Nav/Item |
| `icon-action-bar` | 44px | 48px | Same icon as expanded action button |
| `icon-footer` | 48px | 48px | Hidden by default |

All Icon Button instances: Ghost md (32×32px), centred in their 48×48px zone via flex.

### 6.4 Collapse Toggle FAB

| State | Position | Icon | Notes |
|---|---|---|---|
| Expanded | x = panelWidth − 12, y = 12 | CaretLeft | Half inside panel, half outside |
| Icon-only | x = 36, y = 12 | CaretRight | Half inside 48px rail, half outside |
| Collapsed | x = 0, y = 12 | CaretRight | Half inside 12px strip, half outside |

FAB: Secondary sm, 24×24px, ABSOLUTE, `right: -12px` (CSS), `top: 12px`.

---

## 7. Token Reference

All tokens are Venus_Semantics. No Venus_Components tokens are used on NavPanel itself (atoms inherit from their own token bindings).

### Panel Shell

| Property | Token | Light value | Dark value |
|---|---|---|---|
| Panel fill | `surface/raised` | white #FFFFFF | gray/800 #1F2937 |
| Panel border | `border/default` | gray/200 #E5E7EB | gray/700 #374151 |
| Separator fill | `border/subtle` | gray/100 #F3F4F6 | gray/800 #1F2937 |

### Header

| Layer | Token | Light value | Dark value |
|---|---|---|---|
| Title text | `text/default` | gray/900 #111827 | gray/50 #F9FAFB |
| Title text style | Heading/XS | 14px SemiBold | — |
| Zone fill | `surface/raised` | white | gray/800 |

### Tab Zone

| Layer | Token | Light value | Dark value |
|---|---|---|---|
| Zone fill | `surface/raised` | white | gray/800 |
| Segmented control container fill | `surface/raised` | white | gray/800 |
| Segmented control container border | `border/default` | gray/200 | gray/700 |
| Selected segment fill | `action/secondary/hover` | purple/100 #EDE9FE | purple/800 |
| Selected segment border | `border/brand` | purple/500 #6C5CE7 | purple/400 |
| Selected segment text | `text/brand` | purple/500 | purple/400 |
| Unselected segment text | `text/subtle` | gray/600 #4B5563 | gray/400 |

### Search

| Layer | Token | Light value | Dark value |
|---|---|---|---|
| Zone fill | `surface/raised` | white | gray/800 |
| Input fill | `surface/raised` | white | gray/800 |
| Input border | `border/default` | gray/200 | gray/700 |
| Placeholder text | `text/placeholder` | gray/400 | gray/600 |

### Action Bar

| Layer | Token | Light value | Dark value |
|---|---|---|---|
| Zone fill | `surface/raised` | white | gray/800 |
| Button label | `text/brand` | purple/500 | purple/400 |
| Button fill | transparent (`action/ghost`) | — | — |

### Collapse/Expand Toggle FAB

| Property | Token | Light value | Dark value |
|---|---|---|---|
| Fill | `action/secondary` | white #FFFFFF | gray/800 |
| Border | `border/brand` | purple/500 #6C5CE7 | purple/400 |
| Icon color | default mode (564:7) | brand purple | brand purple |
| Elevation Default | Elevation/Level 1 — Raised | 3-layer shadow | — |
| Elevation Hover | Elevation/Level 2 — Dropdown | deeper shadow | — |

### Resize Handle

| Property | Token | Light value | Dark value |
|---|---|---|---|
| Handle line | `border/subtle` | gray/100 #F3F4F6 | gray/800 |

---

## 8. Accessibility

### ARIA Roles and Attributes

```html
<aside
  aria-label="Navigation panel"
  aria-expanded="true|false"
  data-state="expanded|icon-only|collapsed"
>
  <!-- header -->
  <div role="banner" aria-label="Navigation panel header">
    <h2 class="nav-panel-title">Navigation</h2>
    <button aria-label="Panel options"><!-- icon --></button>
  </div>

  <!-- tab zone -->
  <div role="radiogroup" aria-label="View switcher">
    <button role="radio" aria-checked="true">Option 1</button>
    <button role="radio" aria-checked="false">Option 2</button>
  </div>

  <!-- search -->
  <div role="search">
    <input type="search" aria-label="Search navigation" placeholder="Search..." />
  </div>

  <!-- body -->
  <nav aria-label="Navigation items">
    <!-- Nav/Item components -->
  </nav>

  <!-- action bar -->
  <div role="toolbar" aria-label="Panel actions">
    <button>Footer Action</button>
  </div>

  <!-- collapse toggle -->
  <button
    aria-label="Collapse navigation panel"
    aria-expanded="true"
    aria-controls="nav-panel"
    class="nav-panel-collapse-toggle"
  >
    <!-- CaretLeft icon -->
  </button>
</aside>
```

**In icon-only state**, the `<aside>` receives `aria-label="Navigation panel (icon only)"` and each icon zone button must carry its own `aria-label` matching the expanded label:

```html
<button aria-label="Search"><!-- MagnifyingGlass --></button>
<button aria-label="Footer Action"><!-- Action icon --></button>
```

### Keyboard Navigation

| Key | Context | Behaviour |
|---|---|---|
| `Tab` | Panel visible | Moves focus through interactive elements in DOM order |
| `Enter` / `Space` | Collapse toggle focused | Toggles panel between expanded / icon-only / collapsed |
| `Escape` | Focus inside panel, panel is expanded | Collapses panel to icon-only (optional — implement if panel obscures content) |
| `Arrow Left/Right` | Segmented control focused | Moves between segments |
| `Enter` / `Space` | Segment focused | Selects the segment |

### Collapse Toggle Accessibility

The collapse toggle FAB must communicate its purpose AND the resulting state:

```typescript
// Expanded state — will collapse
<button
  aria-label="Collapse navigation panel"
  aria-expanded={true}
  aria-controls="nav-panel"
>

// Icon-only state — will expand
<button
  aria-label="Expand navigation panel"
  aria-expanded={false}
  aria-controls="nav-panel"
>

// Collapsed state — will expand
<button
  aria-label="Expand navigation panel"
  aria-expanded={false}
  aria-controls="nav-panel"
>
```

When the panel collapses, focus must not be lost. If focus was inside the panel when it collapsed, move focus to the collapse toggle FAB.

### Resize Handle Accessibility

```html
<div
  role="separator"
  aria-label="Resize navigation panel"
  aria-valuenow={currentWidth}
  aria-valuemin={160}
  aria-valuemax={500}
  aria-orientation="vertical"
  tabindex="0"
  class="nav-panel-resize-handle"
>
```

When focused via keyboard:
- `Arrow Left` — decreases panel width by 8px
- `Arrow Right` — increases panel width by 8px
- `Home` — sets panel to minimum width (160px)
- `End` — sets panel to maximum width (500px)

### Touch Targets

| Element | Size | WCAG 2.5.5 |
|---|---|---|
| Collapse/expand FAB | 24×24px | ✅ Meets minimum |
| Icon zone buttons | 32×32px (Icon Button md in 48px zone) | ✅ |
| Segmented control segments | 32px height, full width | ✅ |
| Search input | 32px height | ✅ |
| Resize handle | 12px wide × full height | ⚠️ Hover zone should be at least 8px (CSS `padding` trick — see Implementation Notes) |

---

## 9. Interaction Design — The Full Thought Process

This section documents the reasoning behind every interaction decision. It exists so engineers implement exactly the right behaviour without design ambiguity.

### 9.1 Why Three States?

The three-state model (Expanded → Icon-only → Collapsed) reflects a progressive disclosure principle: the user can choose how much navigation real estate they surrender to the content area.

- **Expanded** is the default for first-time users. Navigation labels are visible. The user understands where they are.
- **Icon-only** is the power user mode. The panel is still *present* — it hasn't disappeared — but it consumes minimal space. Users who know the icons prefer this.
- **Collapsed** is maximum content mode. The panel is out of view. The expand FAB remains just barely visible — half a circle on the edge — so the user always knows how to get back.

This three-step progression is intentional. Jumping directly from expanded to fully collapsed would be jarring — the user loses orientation. The icon-only step provides a visual bridge.

### 9.2 The Collapse Toggle FAB — Design Rationale

The FAB is placed straddling the right edge of the panel (`right: -12px`). This position is deliberate:

1. **Spatial continuity**: The FAB sits exactly where the panel boundary is. Its physical position communicates "this button controls this edge."
2. **Always accessible**: Even when the panel is at its narrowest (12px collapsed), the FAB protrudes into the content area. The user never has to search for the toggle.
3. **Secondary type**: The Secondary FAB (white fill, purple border) is used — not Primary (solid purple). The collapse toggle is not the most important action on the screen. It is always available but should not compete visually with page content.
4. **Size sm (24px)**: The smallest FAB size. Large enough to hit (meets WCAG minimum), small enough not to be obtrusive.

### 9.3 Collapse/Expand Animation

The panel transition must be animated. A hard jump between states feels broken.

**Recommended animation:**

```css
.nav-panel {
  transition:
    width 200ms cubic-bezier(0.4, 0, 0.2, 1),
    min-width 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Content inside the panel (labels, etc.) fades out faster than width collapses */
.nav-panel-content {
  transition: opacity 120ms ease-out;
}

/* When collapsing: hide content first, then shrink panel */
.nav-panel[data-state="icon-only"] .nav-panel-content,
.nav-panel[data-state="collapsed"] .nav-panel-content {
  opacity: 0;
}

/* When expanding: grow panel first, then show content */
.nav-panel[data-state="expanded"] .nav-panel-content {
  transition-delay: 80ms; /* wait for panel to start expanding */
  opacity: 1;
}
```

**Timing rationale:**
- 200ms for the width transition — fast enough to feel responsive, slow enough to track visually
- 120ms for content opacity — content disappears *before* the panel finishes shrinking, so there is no period where text is visible but too small to read
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` — Material Design standard ease-in-out. Starts slow, peaks fast, ends slow. Feels physical.

**Icon rotation on FAB:**

The CaretLeft/CaretRight swap is a static icon change, not a rotation animation. However, if the product design allows it, a smooth rotation creates a more polished feel:

```css
.nav-panel-collapse-toggle .caret-icon {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Expanded: CaretLeft = pointing left (0°) */
.nav-panel[data-state="expanded"] .caret-icon {
  transform: rotate(0deg);
}

/* Icon-only or Collapsed: pointing right (180°) */
.nav-panel[data-state="icon-only"] .caret-icon,
.nav-panel[data-state="collapsed"] .caret-icon {
  transform: rotate(180deg);
}
```

This avoids the icon swap entirely and uses a single CaretLeft icon rotated 180°. Simpler, smoother.

**Reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
  .nav-panel,
  .nav-panel-content,
  .nav-panel-collapse-toggle .caret-icon {
    transition: none;
  }
}
```

### 9.4 The Resize Handle — Full Interaction Specification

The resize handle enables the user to continuously adjust the expanded panel width between 160px and 500px.

**Visual design:**

When `isDraggable=true` — at rest and on hover — a 3px `border/brand` (purple/500) vertical line runs the full height of the panel, from top edge to bottom edge. The line is always visible when dragging is enabled. There is no hidden/revealed transition — the affordance is persistent and unmistakable.

The Idle and Hover states of `_PanelResizeHandle` are intentionally identical in appearance. The only difference between them is behaviour: Idle has a default cursor, Hover changes it to `col-resize` and activates drag on mousedown.

```css
.nav-panel-resize-handle {
  position: absolute;
  top: 0;
  right: -6px; /* extends 6px into content area for easier grabbing */
  width: 12px; /* 6px into panel + 6px into content */
  height: 100%;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0; /* behind all panel content — FAB renders on top */
}

.nav-panel-resize-handle::after {
  content: '';
  width: 3px;
  height: 100%;
  background: var(--border-brand); /* purple/500 */
}

.nav-panel-resize-handle:hover {
  cursor: col-resize;
}

.nav-panel-resize-handle.dragging {
  cursor: col-resize;
}
```

**Mutual exclusion — the collapse toggle FAB:**

When `isDraggable=true`, the collapse toggle FAB (`btn/collapse-toggle`) must be hidden. The FAB straddles the right edge at y=12 — precisely where the drag line starts. Showing both simultaneously creates visual noise and implies two conflicting interactions at the same edge.

```typescript
// In the consuming layout component:
const showCollapseToggle = !isDraggable;

// Enforce in JSX:
{showCollapseToggle && (
  <button className="nav-panel-collapse-toggle" onClick={handleToggle}>
    <CaretLeftIcon />
  </button>
)}
{isDraggable && (
  <div className="nav-panel-resize-handle" onMouseDown={handleMouseDown} />
)}
```

This is a **design system governance rule**, not an implementation suggestion. Never render both simultaneously.

**Drag behaviour:**

```typescript
const handleMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  const startX = e.clientX;
  const startWidth = currentPanelWidth;
  
  const handleMouseMove = (e: MouseEvent) => {
    const delta = e.clientX - startX;
    const newWidth = Math.min(500, Math.max(160, startWidth + delta));
    onResize?.(newWidth);
  };
  
  const handleMouseUp = (e: MouseEvent) => {
    const delta = e.clientX - startX;
    const finalWidth = Math.min(500, Math.max(160, startWidth + delta));
    onResizeEnd?.(finalWidth);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};
```

**Width snapping (recommended):**

Consider snapping to the three canonical widths (220px, 320px, 400px) when the user releases within 20px of any canonical width:

```typescript
const CANONICAL_WIDTHS = [220, 320, 400];
const SNAP_THRESHOLD = 20;

const snapWidth = (width: number): number => {
  for (const canonical of CANONICAL_WIDTHS) {
    if (Math.abs(width - canonical) <= SNAP_THRESHOLD) return canonical;
  }
  return width;
};
```

**Touch support:**

Replace `mousedown/mousemove/mouseup` with `touchstart/touchmove/touchend` for mobile (though NavPanel is desktop-primary):

```typescript
const touch = e.touches[0];
const startX = touch.clientX;
```

### 9.5 Icon-Only State — Section-to-Section Correspondence

Every zone in the icon-only rail corresponds exactly to a section in the expanded panel. This is not just a visual convention — it is a functional contract. Engineers must preserve this correspondence so that:

1. Tooltips on icon-only buttons communicate the expanded section label
2. Click on icon-only search always opens the expanded panel with focus on the search input
3. Active state on the icon-only tab zone matches the active segment in expanded

```typescript
// When user clicks icon-only search button:
const handleIconSearchClick = () => {
  setPanelState('expanded');
  // After expand animation completes:
  setTimeout(() => {
    document.querySelector('.nav-panel-search input')?.focus();
  }, 200); // match animation duration
};
```

### 9.6 Tooltip Requirements on Icon-Only State

Every icon-only zone button MUST show a tooltip on hover. Without it, icon-only is inaccessible to users who don't know the icon set.

```tsx
<Tooltip content="Search" placement="right" delay={500}>
  <IconButton
    type="ghost"
    size="md"
    icon={<MagnifyingGlassIcon />}
    accessibleLabel="Search"
    onClick={handleIconSearchClick}
  />
</Tooltip>
```

`delay={500}` — tooltip appears after 500ms hover, not immediately. This prevents tooltip flicker as the user moves the mouse through the rail.

### 9.7 Section Collapse Behaviour

When `hasTabStrip=false`, `hasSearch=false`, or any section is hidden:

- The section collapses to zero height
- The body slot absorbs the freed space
- Separators adjacent to hidden sections should also be hidden to avoid double-line artefacts

```typescript
// Adjacent separator logic — hide separator if adjacent section is hidden
const showHeaderSeparator = hasHeader && (hasTabStrip || hasSearch || true); // body always present
const showSearchSeparator = hasSearch || hasTabStrip; // separator below search/tab zone
```

---

## 10. Implementation Notes

### 10.1 CSS Custom Properties

```css
/* Panel widths */
--nav-panel-width-m:    220px;
--nav-panel-width-l:    320px;
--nav-panel-width-max:  400px;
--nav-panel-width-icon: 48px;
--nav-panel-width-collapsed: 12px;

/* Panel heights (sections) */
--nav-panel-header-h:     48px;
--nav-panel-tab-zone-h:   56px;
--nav-panel-search-h:     48px;
--nav-panel-action-bar-h: 44px;
--nav-panel-footer-h:     48px;

/* Spacing */
--nav-panel-section-padding-v:  var(--space-8,  8px);
--nav-panel-section-padding-h:  var(--space-12, 12px);
--nav-panel-header-padding-l:   var(--space-12, 12px);
--nav-panel-header-padding-r:   var(--space-8,  8px);
--nav-panel-header-gap:         var(--space-8,  8px);

/* Collapse toggle position */
--nav-panel-toggle-offset: -12px; /* right: var(--nav-panel-toggle-offset) */
--nav-panel-toggle-top:    12px;

/* Animation */
--nav-panel-transition-duration: 200ms;
--nav-panel-transition-easing:   cubic-bezier(0.4, 0, 0.2, 1);
--nav-panel-content-fade-duration: 120ms;

/* Resize */
--nav-panel-resize-handle-width: 12px;
--nav-panel-resize-line-width:   3px;
--nav-panel-resize-line-color:   var(--border-brand); /* purple/500 */
--nav-panel-min-width:  160px;
--nav-panel-max-width:  500px;
```

### 10.2 Root CSS

```css
.nav-panel {
  /* Layout */
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: visible; /* critical — allows FAB to protrude */
  flex-shrink: 0;

  /* Surface */
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  border-radius: 0; /* panels are flush with viewport edges */

  /* Width transition */
  transition:
    width var(--nav-panel-transition-duration) var(--nav-panel-transition-easing),
    min-width var(--nav-panel-transition-duration) var(--nav-panel-transition-easing);
}

.nav-panel[data-state="expanded"][data-width="M"]   { width: var(--nav-panel-width-m); }
.nav-panel[data-state="expanded"][data-width="L"]   { width: var(--nav-panel-width-l); }
.nav-panel[data-state="expanded"][data-width="Max"] { width: var(--nav-panel-width-max); }
.nav-panel[data-state="icon-only"]                  { width: var(--nav-panel-width-icon); }
.nav-panel[data-state="collapsed"]                  { width: var(--nav-panel-width-collapsed); }
```

### 10.3 The `overflow: visible` Rule

The panel must have `overflow: visible` (not `overflow: hidden`) at the root level. This is what allows the collapse/expand FAB to visually protrude outside the panel boundary. Without it, the FAB is clipped.

This is one of the most common implementation mistakes. If you see the FAB being clipped by the panel edge, check for `overflow: hidden` anywhere in the parent chain.

```css
/* ❌ Wrong — clips the FAB */
.nav-panel { overflow: hidden; }

/* ✅ Correct */
.nav-panel { overflow: visible; }

/* If the body slot needs scroll, apply overflow only to the body slot */
.nav-panel-body { overflow-y: auto; }
```

### 10.4 Body Slot Scroll

The `_NavPanelBody` slot should scroll independently when nav items overflow:

```css
.nav-panel-body {
  flex: 1 0 0;
  min-height: 0; /* critical for flex children to scroll */
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--border-default) transparent;
}
```

Without `min-height: 0` on a flex child, `overflow-y: auto` does not activate — the flex item grows to fit its content instead of scrolling.

### 10.5 Dark Mode

Toggle `data-theme="dark"` on the root `<html>` or a theme provider wrapper. All Venus semantic tokens resolve to their dark-mode values automatically. No component-level dark mode logic is required.

```typescript
// Using CSS class:
document.documentElement.setAttribute('data-theme', 'dark');

// Or CSS media query (if supporting system preference):
@media (prefers-color-scheme: dark) {
  :root { /* dark token values */ }
}
```

### 10.6 Layout Integration

NavPanel is designed to live inside a CSS Grid or Flex layout shell:

```css
/* Recommended layout shell */
.app-layout {
  display: grid;
  grid-template-columns: auto 1fr; /* NavPanel | Content */
  grid-template-rows: auto 1fr;   /* TopBar | Body */
  height: 100vh;
}

.app-top-bar    { grid-column: 1 / -1; grid-row: 1; }
.app-nav-panel  { grid-column: 1; grid-row: 2; }
.app-content    { grid-column: 2; grid-row: 2; overflow: auto; }
```

When the panel resizes, the grid column auto-adjusts. When the panel collapses, the content area expands to fill the freed space via the `1fr` column track.

### 10.7 Width Persistence

The user's chosen panel width should persist across sessions:

```typescript
const STORAGE_KEY = 'nav-panel-state';

// Save
localStorage.setItem(STORAGE_KEY, JSON.stringify({
  state: panelState,
  width: panelWidth,
}));

// Restore
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
  const { state, width } = JSON.parse(saved);
  setPanelState(state);
  setPanelWidth(width);
}
```

### 10.8 Known Figma API Limitations (Informational)

These are Figma-side limitations that are NOT engineer concerns but are documented for completeness:

- `icon-body-slot` SLOT property requires manual wiring in Figma UI
- `hasHeader` boolean wiring to `_NavPanelHeader` visibility requires manual Figma UI step
- Icon swaps on all FABs and icon zone Icon Buttons require manual Figma UI
- `_PanelResizeHandle` Idle/Hover visual treatment not yet applied in Figma

---

## 11. Do / Don't

**✅ Do — Preserve the overflow: visible on the panel root**
The collapse toggle FAB protrudes outside the panel boundary. Any `overflow: hidden` in the parent chain will clip it.
```css
.nav-panel { overflow: visible; } /* ✅ */
.nav-panel-body { overflow-y: auto; } /* Scroll only on body slot */
```
**❌ Don't — Apply overflow: hidden to the panel root**
```css
.nav-panel { overflow: hidden; } /* ❌ Clips the FAB */
```

---

**✅ Do — Animate the collapse/expand with a width transition**
The three-state transition must be animated. A hard jump breaks spatial continuity.
```css
.nav-panel { transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1); }
```
**❌ Don't — Toggle visibility or display instead of animating width**
```css
.nav-panel[data-state="collapsed"] { display: none; } /* ❌ User loses orientation */
.nav-panel[data-state="collapsed"] { visibility: hidden; } /* ❌ Same problem */
```

---

**✅ Do — Show tooltips on all icon-only zone buttons**
Icon-only mode is inaccessible without tooltips. Every icon button must reveal its label on hover.
```tsx
<Tooltip content="Search" placement="right" delay={500}>
  <IconButton icon={<MagnifyingGlassIcon />} accessibleLabel="Search" />
</Tooltip>
```
**❌ Don't — Ship icon-only without tooltips**
A user who doesn't recognise an icon has no way to discover what the action does.

---

**✅ Do — Move focus to the collapse toggle when the panel collapses**
If focus is inside the panel body when it collapses, move it to the collapse/expand toggle FAB.
```typescript
if (panelWasExpandedAndFocusWasInside) {
  collapseToggleRef.current?.focus();
}
```
**❌ Don't — Let focus disappear into the void**
A keyboard user collapses the panel. Their focus lands nowhere. They have no idea where they are.

---

**✅ Do — Apply min-height: 0 to the body slot**
Without it, `overflow-y: auto` does not activate on a flex child.
```css
.nav-panel-body { flex: 1 0 0; min-height: 0; overflow-y: auto; }
```
**❌ Don't — Forget min-height: 0**
```css
.nav-panel-body { flex: 1; overflow-y: auto; } /* ❌ Flex item grows, never scrolls */
```

---

**✅ Do — Persist panel state and width to localStorage**
The user spent effort getting the panel to their preferred size. Don't reset it on refresh.
```typescript
localStorage.setItem('nav-panel-state', JSON.stringify({ state, width }));
```
**❌ Don't — Reset panel to 'expanded' / 220px on every page load**
```typescript
const [state] = useState('expanded'); /* ❌ Ignores user preference */
```

---

**✅ Do — Set hasCollapseToggle=false when isDraggable=true**
These props are mutually exclusive. The collapse FAB straddles the exact same right edge as the drag line — showing both creates conflicting interactions and visual noise.
```tsx
<NavPanel isDraggable hasCollapseToggle={false} ... />
```
**❌ Don't — Show both the drag handle and the collapse toggle simultaneously**
```tsx
<NavPanel isDraggable hasCollapseToggle ... /> {/* ❌ FAB overlaps drag line */}
```

---

**✅ Do — Snap to canonical widths on resize release**
Snapping to 220/320/400px within a 20px threshold makes the resize feel intentional and design-system-aligned.
**❌ Don't — Allow arbitrary pixel widths without snapping**
A 237px panel is technically valid but breaks the design intent. Engineers should work within the three canonical widths.

---

**✅ Do — Respect prefers-reduced-motion**
```css
@media (prefers-reduced-motion: reduce) {
  .nav-panel, .nav-panel-content { transition: none; }
}
```
**❌ Don't — Force animations on users who have requested reduced motion**

---

## 12. Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { NavPanel } from './NavPanel';
import { NavItem } from '../NavItem';
import {
  MagnifyingGlassIcon, GearIcon, HomeIcon, FilesIcon,
  UsersIcon, ChartBarIcon, BellIcon
} from '@contentstack/icons';

const meta: Meta<typeof NavPanel> = {
  title: 'Navigation/NavPanel',
  component: NavPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    state:  { control: 'radio', options: ['expanded', 'icon-only', 'collapsed'] },
    width:  { control: 'radio', options: ['M', 'L', 'Max'] },
    hasHeader:       { control: 'boolean' },
    hasTabStrip:     { control: 'boolean' },
    hasSearch:       { control: 'boolean' },
    hasActionBar:    { control: 'boolean' },
    hasFooter:       { control: 'boolean' },
    isDraggable:     { control: 'boolean' },
    hasCollapseToggle: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof NavPanel>;

// Sample nav content
const SampleNavItems = () => (
  <>
    <NavItem icon={<HomeIcon />} label="Dashboard" isActive />
    <NavItem icon={<FilesIcon />} label="Content" />
    <NavItem icon={<UsersIcon />} label="Users" />
    <NavItem icon={<ChartBarIcon />} label="Analytics" />
    <NavItem icon={<GearIcon />} label="Settings" />
  </>
);

// 1. Default — Expanded Width=M with all sections
export const Default: Story = {
  args: {
    state: 'expanded',
    width: 'M',
    hasHeader: true,
    panelTitle: 'Navigation',
    hasTabStrip: true,
    tabLabels: ['All', 'Favourites'],
    hasSearch: true,
    hasActionBar: true,
    actionLabel: 'Manage filters',
    isDraggable: false,
    hasCollapseToggle: true,
    children: <SampleNavItems />,
  },
};

// 2. AllStates — Three states side by side
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '48px', padding: '24px', background: 'var(--surface-sunken)', minHeight: '640px' }}>
      <NavPanel state="expanded" width="M" hasHeader panelTitle="Navigation" hasTabStrip hasSearch hasActionBar isDraggable={false}>
        <SampleNavItems />
      </NavPanel>
      <NavPanel state="icon-only" width="M" hasHeader hasTabStrip hasSearch hasActionBar isDraggable={false}>
        <SampleNavItems />
      </NavPanel>
      <NavPanel state="collapsed" width="M" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The three panel states side by side. Expanded shows all content. Icon-only collapses to a 48px icon rail. Collapsed shows only the 12px edge strip with the expand FAB.',
      },
    },
  },
};

// 3. AllWidths — Three widths of expanded state
export const AllWidths: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '48px', padding: '24px', background: 'var(--surface-sunken)', minHeight: '640px' }}>
      <NavPanel state="expanded" width="M" hasHeader panelTitle="M (220px)" hasTabStrip hasSearch hasActionBar>
        <SampleNavItems />
      </NavPanel>
      <NavPanel state="expanded" width="L" hasHeader panelTitle="L (320px)" hasTabStrip hasSearch hasActionBar>
        <SampleNavItems />
      </NavPanel>
      <NavPanel state="expanded" width="Max" hasHeader panelTitle="Max (400px)" hasTabStrip hasSearch hasActionBar>
        <SampleNavItems />
      </NavPanel>
    </div>
  ),
};

// 4. StateMachine — Interactive collapse/expand
export const StateMachine: Story = {
  render: () => {
    const [state, setState] = React.useState<'expanded' | 'icon-only' | 'collapsed'>('expanded');
    const cycle = () => {
      setState(s => s === 'expanded' ? 'icon-only' : s === 'icon-only' ? 'collapsed' : 'expanded');
    };
    return (
      <div style={{ display: 'flex', height: '640px', background: 'var(--surface-sunken)' }}>
        <NavPanel
          state={state}
          width="M"
          hasHeader
          panelTitle="Navigation"
          hasTabStrip
          hasSearch
          hasActionBar
          hasCollapseToggle
          onToggle={setState}
        >
          <SampleNavItems />
        </NavPanel>
        <div style={{ flex: 1, padding: '24px', background: 'var(--surface-default)' }}>
          <p style={{ color: 'var(--text-subtle)', fontSize: '14px' }}>
            Current state: <strong>{state}</strong>
          </p>
          <button onClick={cycle}>Cycle state manually</button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Live state machine demo. Click the collapse toggle FAB on the panel edge, or use the cycle button. Observe the animated transition between expanded → icon-only → collapsed → expanded.',
      },
    },
  },
};

// 5. WithResizeHandle — isDraggable=true, hasCollapseToggle=false (mutually exclusive)
export const WithResizeHandle: Story = {
  render: () => {
    const [width, setWidth] = React.useState(220);
    return (
      <div style={{ display: 'flex', height: '640px', background: 'var(--surface-sunken)' }}>
        <NavPanel
          state="expanded"
          width="M"
          isDraggable
          hasCollapseToggle={false} // ← REQUIRED: mutually exclusive with isDraggable
          hasHeader
          panelTitle="Drag my edge"
          hasTabStrip
          hasSearch
          hasActionBar
          onResize={setWidth}
          onResizeEnd={setWidth}
          style={{ width }}
        >
          <SampleNavItems />
        </NavPanel>
        <div style={{ flex: 1, padding: '24px', background: 'var(--surface-default)' }}>
          <p>Panel width: {width}px</p>
          <p style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '8px' }}>
            The 3px purple drag line runs the full panel height when isDraggable=true.
            The collapse toggle FAB is hidden — these two props are mutually exclusive.
            Drag the right edge to resize. Releases snap to 220/320/400px within 20px.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '**isDraggable and hasCollapseToggle are mutually exclusive.** When isDraggable=true, always set hasCollapseToggle=false. A 3px brand-purple line runs the full panel height as a persistent drag affordance — no hover reveal required.',
      },
    },
  },
};

// 6. NoHeader — hasHeader=false
export const NoHeader: Story = {
  args: {
    state: 'expanded',
    width: 'M',
    hasHeader: false,
    hasTabStrip: true,
    tabLabels: ['Entries', 'Assets'],
    hasSearch: true,
    hasActionBar: true,
    children: <SampleNavItems />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel without a header. The tab zone becomes the first visible element. Use when the panel context is self-evident from the page layout.',
      },
    },
  },
};

// 7. SearchOnly — hasTabStrip=false, hasSearch=true
export const SearchOnly: Story = {
  args: {
    state: 'expanded',
    width: 'M',
    hasHeader: true,
    panelTitle: 'Assets',
    hasTabStrip: false,
    hasSearch: true,
    hasActionBar: false,
    children: <SampleNavItems />,
  },
};

// 8. Minimal — only body slot, no chrome
export const Minimal: Story = {
  args: {
    state: 'expanded',
    width: 'M',
    hasHeader: false,
    hasTabStrip: false,
    hasSearch: false,
    hasActionBar: false,
    hasFooter: false,
    hasCollapseToggle: true,
    children: <SampleNavItems />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal configuration — only nav items and the collapse toggle. Use when the panel needs to be invisible chrome and the content is self-descriptive.',
      },
    },
  },
};

// 9. WithFooter — hasFooter=true
export const WithFooter: Story = {
  args: {
    state: 'expanded',
    width: 'M',
    hasHeader: true,
    panelTitle: 'Navigation',
    hasTabStrip: true,
    hasSearch: true,
    hasActionBar: true,
    hasFooter: true,
    footer: (
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-sunken)' }} />
        <div>
          <p style={{ fontSize: '13px', fontWeight: 500 }}>George Karian</p>
          <p style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Admin</p>
        </div>
      </div>
    ),
    children: <SampleNavItems />,
  },
};

// 10. DarkMode
export const DarkMode: Story = {
  args: {
    state: 'expanded',
    width: 'M',
    hasHeader: true,
    panelTitle: 'Navigation',
    hasTabStrip: true,
    hasSearch: true,
    hasActionBar: true,
    children: <SampleNavItems />,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

// 11. InLayoutContext — NavPanel in a realistic app shell
export const InLayoutContext: Story = {
  render: () => {
    const [state, setState] = React.useState<'expanded' | 'icon-only' | 'collapsed'>('expanded');
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridTemplateRows: '56px 1fr',
        height: '100vh',
        background: 'var(--surface-sunken)',
      }}>
        {/* Top Bar */}
        <div style={{
          gridColumn: '1 / -1', gridRow: 1,
          background: 'var(--surface-raised)',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', padding: '0 24px',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-default)' }}>Contentstack</span>
        </div>
        {/* Nav Panel */}
        <div style={{ gridColumn: 1, gridRow: 2, height: '100%' }}>
          <NavPanel
            state={state}
            width="M"
            hasHeader
            panelTitle="Navigation"
            hasTabStrip
            tabLabels={['All', 'Favourites']}
            hasSearch
            hasActionBar
            actionLabel="Manage filters"
            hasCollapseToggle
            onToggle={setState}
          >
            <SampleNavItems />
          </NavPanel>
        </div>
        {/* Content */}
        <div style={{ gridColumn: 2, gridRow: 2, padding: '32px', overflow: 'auto' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-default)' }}>Content Area</h1>
          <p style={{ color: 'var(--text-subtle)', marginTop: '8px' }}>
            Panel state: <strong>{state}</strong>. Use the collapse toggle on the panel edge.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'NavPanel in a realistic CSS Grid application layout. Shows the grid auto-adjustment as the panel expands and collapses.',
      },
    },
  },
};
```

---

## 13. Related Components

| Component | Relationship | When to use instead |
|---|---|---|
| `Nav/Top-Bar` | Sibling — horizontal navigation bar at the top of the layout. NavPanel and Nav/Top-Bar are designed to coexist. | Use Nav/Top-Bar for top-level application navigation (switching between CMS modules). Use NavPanel for secondary/contextual navigation within a module. |
| `Nav/Item` | Child — individual navigation item. Goes inside the NavPanel body slot. | Nav/Item is always a child of NavPanel, never standalone on a content surface. |
| `Drawer` | Overlay variant — temporarily covers content. | Use Drawer for mobile navigation, contextual panels triggered by user action, and temporary content overlays. NavPanel is always persistent. |
| `Tabs` | Inline content switcher. | Use Tabs when switching between distinct, full-page content sections. Use NavPanel's Segmented Control for view switching within the same page. |
| `FAB` | Used as collapse/expand trigger. | FAB Secondary sm is the collapse toggle. Do not replace it with an Icon Button — the circular shape and elevation communicate the floating nature of the trigger. |
| `Segmented Control` | Housed inside the tab zone. | Use Segmented Control directly (outside NavPanel) for view switching in toolbars, headers, or inline contexts. |
| `Search Input` | Housed inside the search zone. | Use Search Input directly in toolbars, page headers, or any inline search context outside of a NavPanel. |
| `Filter-Bar` | Alternative to NavPanel for filter contexts. | Use Filter-Bar when filters are the primary content of a toolbar row and do not need to live in a persistent sidebar. |
