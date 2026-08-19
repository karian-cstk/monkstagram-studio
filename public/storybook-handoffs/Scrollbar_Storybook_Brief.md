# Scrollbar — CSS Implementation Brief
**Venus 2.1 RF Design System**
**Type:** CSS Utility (not a React component)
**Figma reference:** `Scrollbar Vertical` (700:55428) · `Scrollbar Horizontal` (700:55483)
**Page:** `⚛️ Atoms (Unpublished)`
**Version:** 2.1.0 | **Last updated:** 2026-05-30
**Status:** Active

---

## What this is — and what it is not

The Venus scrollbar is **not a React component**. There is no `<Scrollbar />`, no props, no JSX. The browser renders scrollbars natively — Venus styles them via CSS pseudo-elements applied to any scrollable container.

**What you implement:**
- A set of CSS utility classes (`.scrollbar-sm`, `.scrollbar-md`)
- Applied directly to any element with `overflow: auto` or `overflow: scroll`
- All visual values come from Venus CSS custom properties

**What designers use in Figma:**
- `Scrollbar Vertical` and `Scrollbar Horizontal` component sets
- Dragged into mockups of sidebars, tables, modals, and textareas to communicate scroll behaviour
- These are design documentation tools — they do not generate code

---

## Sizes

| Size | Track width (vertical) | Track height (horizontal) | Use case |
|---|---|---|---|
| `sm` | 6px | 6px | Sidebar navigation, compact panels, code editors, dropdown overflow |
| `md` | 8px | 8px | Main content area, data tables, modals, textarea overflow — **system default** |

---

## Visual behaviour

| State | Track | Thumb | Trigger |
|---|---|---|---|
| Default | Transparent — invisible | gray/500 (#6B7280) | At rest |
| Hover | gray/100 (#F3F4F6) — appears | gray/600 (#4B5563) — darkens | `:hover` on the scrollable container |
| Active | gray/100 — remains visible | gray/900 (#111827) — full opacity | `:active` on the thumb (user dragging) |

**Track behaviour:** macOS overlay style. The track is invisible at rest and appears when the user hovers over the scrollable container. This keeps the UI clean and uncluttered when the user is not interacting.

**Thumb shape:** Rounded pill. `border-radius` = half of track width (3px for sm, 4px for md).

**Minimum thumb length:** 32px. Prevents the thumb from becoming too small to grab on very long scroll areas.

---

## Token → CSS variable mapping

| Venus token | CSS custom property | Resolved value (Light) | Resolved value (Dark) |
|---|---|---|---|
| `scrollbar/thumb/default` | `--scrollbar-thumb-default` | #6B7280 (gray/500) | #6B7280 (gray/500) |
| `scrollbar/thumb/hover` | `--scrollbar-thumb-hover` | #4B5563 (gray/600) | #9CA3AF (gray/400) |
| `scrollbar/thumb/active` | `--scrollbar-thumb-active` | #111827 (gray/900) | #F9FAFB (gray/50) |
| `scrollbar/track/default` | `--scrollbar-track-default` | transparent | transparent |
| `scrollbar/track/hover` | `--scrollbar-track-hover` | #F3F4F6 (gray/100) | #1F2937 (gray/800) |
| `scrollbar/sm/width` | `--scrollbar-sm-width` | 6px | 6px |
| `scrollbar/md/width` | `--scrollbar-md-width` | 8px | 8px |
| `scrollbar/sm/radius` | `--scrollbar-sm-radius` | 3px | 3px |
| `scrollbar/md/radius` | `--scrollbar-md-radius` | 4px | 4px |
| `scrollbar/thumb/min-length` | `--scrollbar-thumb-min-length` | 32px | 32px |

Add these to your root CSS custom properties alongside other Venus tokens:

```css
:root {
  --scrollbar-thumb-default:    #6B7280;
  --scrollbar-thumb-hover:      #4B5563;
  --scrollbar-thumb-active:     #111827;
  --scrollbar-track-default:    transparent;
  --scrollbar-track-hover:      #F3F4F6;
  --scrollbar-sm-width:         6px;
  --scrollbar-md-width:         8px;
  --scrollbar-sm-radius:        3px;
  --scrollbar-md-radius:        4px;
  --scrollbar-thumb-min-length: 32px;
}

[data-theme="dark"] {
  --scrollbar-thumb-default:    #6B7280;
  --scrollbar-thumb-hover:      #9CA3AF;
  --scrollbar-thumb-active:     #F9FAFB;
  --scrollbar-track-default:    transparent;
  --scrollbar-track-hover:      #1F2937;
}
```

---

## CSS Implementation

### The utility classes

```css
/* ─── BASE MIXIN (shared rules) ─────────────────────────────────────────── */

/* sm — sidebar, panels, compact containers */
.scrollbar-sm {
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb-default) var(--scrollbar-track-default);
}

/* md — main content, tables, modals, textarea */
.scrollbar-md {
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb-default) var(--scrollbar-track-default);
}

/* ─── WEBKIT (Chrome, Safari, Edge) ────────────────────────────────────── */

/* Track container */
.scrollbar-sm::-webkit-scrollbar {
  width:  var(--scrollbar-sm-width);   /* vertical */
  height: var(--scrollbar-sm-width);   /* horizontal */
}
.scrollbar-md::-webkit-scrollbar {
  width:  var(--scrollbar-md-width);
  height: var(--scrollbar-md-width);
}

/* Track — invisible at rest */
.scrollbar-sm::-webkit-scrollbar-track,
.scrollbar-md::-webkit-scrollbar-track {
  background:    var(--scrollbar-track-default);
  border-radius: var(--scrollbar-md-radius);
}

/* Track — appears on container hover */
.scrollbar-sm:hover::-webkit-scrollbar-track {
  background:    var(--scrollbar-track-hover);
  border-radius: var(--scrollbar-sm-radius);
}
.scrollbar-md:hover::-webkit-scrollbar-track {
  background:    var(--scrollbar-track-hover);
  border-radius: var(--scrollbar-md-radius);
}

/* Thumb — default */
.scrollbar-sm::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-default);
  border-radius:    var(--scrollbar-sm-radius);
  min-height:       var(--scrollbar-thumb-min-length);
  min-width:        var(--scrollbar-thumb-min-length);
}
.scrollbar-md::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-default);
  border-radius:    var(--scrollbar-md-radius);
  min-height:       var(--scrollbar-thumb-min-length);
  min-width:        var(--scrollbar-thumb-min-length);
}

/* Thumb — hover (triggered by hovering the scrollable container) */
.scrollbar-sm:hover::-webkit-scrollbar-thumb,
.scrollbar-md:hover::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-hover);
}

/* Thumb — active (user is dragging) */
.scrollbar-sm::-webkit-scrollbar-thumb:active,
.scrollbar-md::-webkit-scrollbar-thumb:active {
  background-color: var(--scrollbar-thumb-active);
}

/* Corner — where vertical and horizontal scrollbars meet */
.scrollbar-sm::-webkit-scrollbar-corner,
.scrollbar-md::-webkit-scrollbar-corner {
  background: transparent;
}
```

---

## Usage

### Basic usage

```html
<!-- Vertical scroll, md size (main content) -->
<div class="scrollbar-md" style="height: 400px; overflow-y: auto;">
  <!-- content -->
</div>

<!-- Vertical scroll, sm size (sidebar) -->
<nav class="scrollbar-sm" style="height: 100vh; overflow-y: auto;">
  <!-- nav items -->
</nav>

<!-- Horizontal scroll (data table) -->
<div class="scrollbar-md" style="overflow-x: auto;">
  <table>...</table>
</div>

<!-- Both axes (code editor, large data grid) -->
<div class="scrollbar-sm" style="overflow: auto; max-height: 600px;">
  <!-- wide + tall content -->
</div>
```

### In React

No component needed. Apply the class to any scrollable container:

```tsx
// Sidebar — sm
<nav className="scrollbar-sm h-screen overflow-y-auto">
  {navItems}
</nav>

// Main content panel — md
<main className="scrollbar-md flex-1 overflow-y-auto">
  {pageContent}
</main>

// Data table wrapper — md
<div className="scrollbar-md overflow-x-auto">
  <DataTable />
</div>

// Textarea (the Venus Textarea component applies this internally)
// Engineers do not apply scrollbar classes manually to Textarea —
// the Textarea component handles it via the hasScrollbar prop
```

### In Tailwind (with CSS variable integration)

If using Tailwind, add the scrollbar utilities as a plugin:

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-sm': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'var(--scrollbar-thumb-default) var(--scrollbar-track-default)',
          '&::-webkit-scrollbar': { width: 'var(--scrollbar-sm-width)', height: 'var(--scrollbar-sm-width)' },
          '&::-webkit-scrollbar-track': { background: 'var(--scrollbar-track-default)', 'border-radius': 'var(--scrollbar-sm-radius)' },
          '&::-webkit-scrollbar-thumb': { 'background-color': 'var(--scrollbar-thumb-default)', 'border-radius': 'var(--scrollbar-sm-radius)', 'min-height': 'var(--scrollbar-thumb-min-length)' },
          '&:hover::-webkit-scrollbar-track': { background: 'var(--scrollbar-track-hover)' },
          '&:hover::-webkit-scrollbar-thumb': { 'background-color': 'var(--scrollbar-thumb-hover)' },
          '&::-webkit-scrollbar-thumb:active': { 'background-color': 'var(--scrollbar-thumb-active)' },
        },
        '.scrollbar-md': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'var(--scrollbar-thumb-default) var(--scrollbar-track-default)',
          '&::-webkit-scrollbar': { width: 'var(--scrollbar-md-width)', height: 'var(--scrollbar-md-width)' },
          '&::-webkit-scrollbar-track': { background: 'var(--scrollbar-track-default)', 'border-radius': 'var(--scrollbar-md-radius)' },
          '&::-webkit-scrollbar-thumb': { 'background-color': 'var(--scrollbar-thumb-default)', 'border-radius': 'var(--scrollbar-md-radius)', 'min-height': 'var(--scrollbar-thumb-min-length)' },
          '&:hover::-webkit-scrollbar-track': { background: 'var(--scrollbar-track-hover)' },
          '&:hover::-webkit-scrollbar-thumb': { 'background-color': 'var(--scrollbar-thumb-hover)' },
          '&::-webkit-scrollbar-thumb:active': { 'background-color': 'var(--scrollbar-thumb-active)' },
        },
      });
    }),
  ],
};
```

---

## Storybook demo story

Unlike other Venus components, the scrollbar story is a **visual reference** — not an interactive prop explorer. It shows the scrollbar in context.

```tsx
// Scrollbar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Atoms / Scrollbar',
  parameters: {
    docs: {
      description: {
        component: `
The Venus scrollbar is a **CSS utility**, not a React component.
Apply \`.scrollbar-sm\` or \`.scrollbar-md\` to any scrollable container.

- \`.scrollbar-sm\` — 6px — sidebar, panels, compact containers
- \`.scrollbar-md\` — 8px — main content, tables, modals, textarea

Hover over the scrollable area to see the track appear.
Drag the thumb to see the active state.
        `,
      },
    },
  },
};
export default meta;

// Reusable content block
const LoremContent = () => (
  <>
    {Array.from({ length: 20 }, (_, i) => (
      <p key={i} style={{ margin: '0 0 12px', lineHeight: 1.6, color: '#374151' }}>
        Paragraph {i + 1} — Contentstack helps teams manage structured content at scale.
      </p>
    ))}
  </>
);

// ── MD — Main content ─────────────────────────────────────────────────────
export const DefaultMd: StoryObj = {
  name: 'md — main content',
  render: () => (
    <div
      className="scrollbar-md"
      style={{
        height: 320,
        overflowY: 'auto',
        padding: 24,
        border: '1px solid #E5E7EB',
        borderRadius: 4,
        background: '#FFFFFF',
      }}
    >
      <LoremContent />
    </div>
  ),
};

// ── SM — Sidebar ──────────────────────────────────────────────────────────
export const CompactSm: StoryObj = {
  name: 'sm — sidebar / compact',
  render: () => (
    <div style={{ width: 240 }}>
      <div
        className="scrollbar-sm"
        style={{
          height: 320,
          overflowY: 'auto',
          padding: '8px 0',
          background: '#F9FAFB',
          borderRadius: 4,
          border: '1px solid #E5E7EB',
        }}
      >
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            Nav item {i + 1}
          </div>
        ))}
      </div>
    </div>
  ),
};

// ── Horizontal — Data table ───────────────────────────────────────────────
export const HorizontalMd: StoryObj = {
  name: 'md — horizontal (data table)',
  render: () => (
    <div
      className="scrollbar-md"
      style={{
        width: 600,
        overflowX: 'auto',
        border: '1px solid #E5E7EB',
        borderRadius: 4,
      }}
    >
      <table style={{ minWidth: 1200, borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            {['Entry title', 'Content type', 'Status', 'Author', 'Last modified', 'UID', 'Locale', 'Tags'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#374151', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }, (_, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
              {['My blog post ' + (i+1), 'Article', 'Published', 'Jane Smith', '2 hours ago', 'blt4f8e2a3b9c1d' + i, 'en-US', 'blog, featured'].map((v, j) => (
                <td key={j} style={{ padding: '12px 16px', color: '#111827', whiteSpace: 'nowrap' }}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

// ── Both axes ─────────────────────────────────────────────────────────────
export const BothAxes: StoryObj = {
  name: 'sm — both axes (code editor)',
  render: () => (
    <div
      className="scrollbar-sm"
      style={{
        width: 480,
        height: 240,
        overflow: 'auto',
        background: '#111827',
        borderRadius: 4,
        padding: 16,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13,
        color: '#F9FAFB',
        lineHeight: 1.7,
      }}
    >
      <pre style={{ margin: 0, minWidth: 800 }}>
        {`import { createEntry } from '@contentstack/management';

const entry = await createEntry({
  contentType: 'article',
  locale: 'en-US',
  fields: {
    title: 'My first entry',
    body: 'Content goes here...',
    tags: ['featured', 'blog'],
    metadata: {
      author: 'Jane Smith',
      publishedAt: new Date().toISOString(),
    },
  },
});

console.log('Created:', entry.uid);`}
      </pre>
    </div>
  ),
};

// ── Dark mode ─────────────────────────────────────────────────────────────
export const DarkMode: StoryObj = {
  name: 'md — dark mode',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <div data-theme="dark">
      <div
        className="scrollbar-md"
        style={{
          height: 320,
          overflowY: 'auto',
          padding: 24,
          border: '1px solid #374151',
          borderRadius: 4,
          background: '#1F2937',
        }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 12px', lineHeight: 1.6, color: '#D1D5DB' }}>
            Paragraph {i + 1} — Dark mode content. Thumb uses gray/400, hover gray/300.
          </p>
        ))}
      </div>
    </div>
  ),
};
```

---

## Browser support

| Browser | Approach | Support |
|---|---|---|
| Chrome 88+ | `::-webkit-scrollbar` pseudo-elements | ✅ Full — hover, active, track, thumb all controllable |
| Safari 14+ | `::-webkit-scrollbar` pseudo-elements | ✅ Full |
| Edge 88+ (Chromium) | `::-webkit-scrollbar` pseudo-elements | ✅ Full |
| Firefox 64+ | `scrollbar-width` + `scrollbar-color` | ⚠️ Partial — width and default colour only. No hover/active/track control. Thumb shows at `--scrollbar-thumb-default` (gray/500) permanently. |
| Firefox 128+ | W3C `scrollbar-color` with `:hover` | 🔜 Emerging — track hover support coming in newer Firefox versions |

**Firefox fallback behaviour:** The scrollbar will show as a thin gray/500 thumb on a transparent track. No hover darkening, no track appearance. Functionally correct; visually simplified. Acceptable for Contentstack's user base (predominantly Chrome on desktop).

**Do not use `scrollbar-width: none` or `display: none` on `::-webkit-scrollbar`** unless you are deliberately hiding the scrollbar (e.g. touch-scroll carousels). Hiding scrollbars removes a key affordance for keyboard and mouse users.

---

## Accessibility

| Requirement | Implementation |
|---|---|
| WCAG 1.4.11 Non-text contrast | Thumb/Default (gray/500): 4.83:1 on white ✅. Thumb/Hover (gray/600): 7.56:1 ✅. Thumb/Active (gray/900): 17.74:1 ✅. All pass 3:1 minimum. |
| Keyboard scrollable regions | Any element with `overflow: auto/scroll` is keyboard-scrollable via Tab focus + arrow keys. Ensure scrollable containers are in the tab order (`tabindex="0"` if not natively focusable). |
| Screen readers | Scrollbars are transparent to assistive technology — they communicate scroll position visually only. Ensure scrollable regions have `aria-label` or `aria-labelledby` to give context. |
| Minimum thumb size | `min-height: 32px` / `min-width: 32px` on thumb prevents the handle from becoming too small to grab on very long pages. |
| Reduced motion | Scrollbars have no transitions or animations — no `prefers-reduced-motion` handling needed. |

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Apply `.scrollbar-md` to main content panels, tables, modals | Apply both `.scrollbar-sm` and `.scrollbar-md` to the same element |
| Apply `.scrollbar-sm` to sidebars, nav panels, compact dropdowns | Hardcode scrollbar colours in component CSS — always use CSS custom properties |
| Let the Venus Textarea component handle its own scrollbar internally | Apply `.scrollbar-*` directly to `<textarea>` elements — Textarea handles this |
| Use `overflow-y: auto` (scrollbar appears only when needed) | Use `overflow-y: scroll` unless you always want the scrollbar visible |
| Ensure scrollable regions have `tabindex="0"` if not natively focusable | Use `resize: none` on textareas without providing an alternative way to see overflow content |
| Test scrollbar appearance in Chrome and Firefox | Assume Firefox will show the same hover behaviour as Chrome — it won't |

---

## Changelog

| Date | Change |
|---|---|
| 2026-05-30 | Initial implementation. sm (6px) and md (8px) utilities. macOS overlay track style. All 5 tokens wired to CSS custom properties. |
| 2026-05-30 | Thumb/Default changed from gray/400 (2.54:1) to gray/500 (4.83:1) after WCAG audit. |
