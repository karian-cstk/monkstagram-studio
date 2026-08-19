<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        ProjectCard
  REACT_COMPONENT:       ProjectCard
  STORYBOOK_TITLE:       Content/ProjectCard
  FIGMA_NODE_ID:         1225:96029
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           📄 Content
  FIGMA_COMPONENT_NAME:  Card/Generic
  CSS_CLASS_PREFIX:      project-card
  FILE_NAME:             ProjectCard.tsx
  STORY_FILE_NAME:       ProjectCard.stories.tsx
  CSS_FILE_NAME:         ProjectCard.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-07-20
  STATUS:                Active
  ═══════════════════════════════════════════════════════════════════
-->

# ProjectCard — Venus 2.1 RF Storybook Brief

> **Figma source:** `Card/Generic` (node `1225:96029`) on the 📄 Content page.
> The React component is named `ProjectCard`. The Figma component set name is `Card/Generic`.
> These are the same component. When reading the Figma file, find `Card/Generic`.
> When writing React/CSS code, use `ProjectCard` / `project-card`.

---

## ⚡ ATOM PRE-FLIGHT CHECKLIST

**Before coding ProjectCard, verify these atoms are imported and available in your project.**
Every atom listed here is consumed directly inside ProjectCard. If any is missing, ProjectCard will not render correctly.

| Atom | Import path | Used for | Venus_Icons mode |
|---|---|---|---|
| `Badge` | `@venus/feedback/Badge` | `card-status-badge` — optional live/status indicator | n/a (its own tokens) |
| `IconButton` (Ghost, md) | `@venus/actions/IconButton` | `footer-fav-btn` and `footer-more-btn` | `default` (brand purple) |
| `Button` (Primary, md/sm) | `@venus/actions/Button` | `footer-primary-action` — "Open" CTA | `inverted` (white) |
| `_Internal/Icon-Wrapper` (16px) | Internal — never exported | `card-subtitle-icon` (when `hasSubtitleIcon=true`) | `default` |
| `_Internal/Icon-Wrapper` (20px) | Internal — never exported | Icon inside `footer-fav-btn`, `footer-more-btn` | `default` |

**Token collections required:**
- `Venus_Semantics` — all color tokens
- `_Primitives space/*` — all spacing (tier-bypass approved)
- `_Primitives radius/*` — all corner radii (tier-bypass approved)

**CSS custom property pattern:**
```css
/* All tokens consumed as CSS custom properties — never import token values into JS */
/* Wrong:  style={{ backgroundColor: '#6C5CE7' }} */
/* Correct: className="project-card" (class consumes var(--action-primary)) */
```

---

## FIGMA STRUCTURE → DOM TRANSLATION (This Component)

This table maps every Figma layer in ProjectCard (`Card/Generic`, node `1225:96029`) to its exact HTML/React/CSS equivalent.
No guessing required — every layer's code equivalent is specified here.

| Figma layer | Figma type | Visibility | DOM / React equivalent | CSS notes |
|---|---|---|---|---|
| `State=Default` / `State=Hover` (root) | COMPONENT variant | Always visible | `<article className="project-card">` | Root element. Not `<div>` — card represents a discrete content entity. |
| `card-header` | FRAME, VERTICAL auto-layout | Always visible | `<div className="project-card__header">` | Padding: `space/16` top/left/right, `space/12` bottom. Gap: `space/4`. |
| `card-title` | TEXT, FILL sizing, maxLines=2, truncation=ENDING | Always visible | `<h3 className="project-card__title">` | 2-line clamp. Truncates with ellipsis. See Typography section. |
| `card-subtitle-row` | FRAME, HORIZONTAL auto-layout | Always visible | `<div className="project-card__subtitle-row">` | gap: `space/8`. |
| `card-subtitle-icon` | INSTANCE (`_Internal/Icon-Wrapper` 16px) | Hidden by default — `hasSubtitleIcon` boolean | `{hasSubtitleIcon && <span className="project-card__subtitle-icon" aria-hidden="true"><Icon /></span>}` | Decorative. `aria-hidden="true"`. |
| `card-subtitle` | TEXT, FILL sizing, no truncation | Always visible | `<span className="project-card__subtitle">` | No truncation — wraps freely. See Typography section. |
| `card-status-badge` | INSTANCE (Badge component) | Hidden by default — `hasStatus` boolean | `{hasStatus && <Badge intent="success" label={statusText} />}` | Right-aligned via flex justify-content. |
| `card-divider` | FRAME, STRETCH, 1px height | Always visible | `<hr className="project-card__divider" aria-hidden="true" />` or `<div role="separator" aria-hidden="true">` | `height: 1px; background: var(--border-default); border: none`. |
| `bodySlot` | SLOT, FILL vertical, padding 16px all sides, gap 8 | Always visible | `<div className="project-card__body">{children}</div>` | **Slot → `children` prop in React.** Default children: **empty** — no default content rendered. Any ReactNode. `flex: 1` — fills remaining height. |

| `card-meta` | FRAME, HORIZONTAL, space-between | Always visible | `<div className="project-card__meta">` | padding: `space/8` V, `space/16` H. gap: `space/24`. Top border: `border/default` 1px. |
| `meta-item` | FRAME, HORIZONTAL, FILL | Always visible | `<div className="project-card__meta-item">` | gap: `space/4`. FILL → `flex: 1`. |
| `meta-text` | TEXT, FILL, truncation=ENDING | Always visible | `<span className="project-card__meta-text">` | Truncates with ellipsis if content overflows. Single line. |
| `card-footer` | FRAME, HORIZONTAL, 48px, token fill | Visible when `hasFooter=true` | `<div className="project-card__footer">` | padding: `space/8` V, `space/12` H. gap: `space/8`. fill: `surface/card/action`. Top border: `border/default` 1px. border-radius: bottom corners only. |
| `footer-fav-btn` | INSTANCE (IconButton Ghost md) | Controlled by `showFavourite` boolean | `{showFavourite && <IconButton variant="ghost" size="md" aria-label="Add to favourites" />}` | 40×40px. Transparent fill (opacity:0). |
| `footer-spacer` | FRAME, FILL | Structural spacer | `<div className="project-card__footer-spacer" aria-hidden="true" />` | `flex: 1`. Pushes action buttons to right edge. |
| `footer-more-btn` | INSTANCE (IconButton Ghost md) | Controlled by `showMoreActions` boolean | `{showMoreActions && <IconButton variant="ghost" size="md" aria-label="More actions" />}` | 40×40px. Transparent fill. |
| `footer-primary-action` | INSTANCE (Button Primary md, 52×32px) | Controlled by `showOpenCTA` boolean | `{showOpenCTA && <Button variant="primary" size="md">Open</Button>}` | height 32px (md). |
| `card-hover-footer` | FRAME, ABSOLUTE, BOTTOM+STRETCH constraints, HIDDEN by default | Visible only on hover + `hasHoverActions=true` | Absolute-positioned `<div className="project-card__hover-footer">` revealed on `:hover` | **ABSOLUTE — not a flex child.** `position: absolute; bottom: 0; left: 0; right: 0; height: 48px`. fill: `surface/card/action` (#F9F8FF Light / #4C42A0 Dark). **Elevation/Level 2 drop shadow** — **NO `backdrop-filter`/blur** (unlike Card/CMS). border-radius: bottom corners only. |
| `card-focus-ring` | FRAME, ABSOLUTE, SCALE constraints, HIDDEN by default | Visible only when `hasFocus=true` | CSS `:focus-visible` pseudo-element — **NOT a DOM node** | `position: absolute; inset: -2px; border: 2px solid var(--focus-ring-color); border-radius: calc(var(--project-card-radius) + 2px); pointer-events: none`. |

**Critical translation notes for AI:**

1. **`bodySlot` → `children`, default is empty.** Card/Generic has no default body content — the slot is blank when no children are passed. Do not render any default content inside `project-card__body`. If you need a stat grid, pass it explicitly as children from the consuming page.

2. **`metaLeft` and `metaRight` are direct text props**, not passed inside children. They are the left and right values in `card-meta` (e.g. `"17 users"` and `"2h ago"`). Render them as `<span className="project-card__meta-text">` inside their respective `meta-item` wrappers.

3. **`card-hover-footer` fill = `surface/card/action` (#F9F8FF Light / #4C42A0 Dark). NO `backdrop-filter: blur`.** This differs from Card/CMS which used `surface/hover-overlay` + blur. ProjectCard uses a solid lavender fill with Elevation/Level 2 drop shadow instead.

4. **`card-hover-footer` is `layoutPositioning=ABSOLUTE` with `constraints: BOTTOM + LEFT_RIGHT (STRETCH)`.** In CSS: `position: absolute; bottom: 0; left: 0; right: 0`. It overlays `card-footer` — both occupy the same 48px zone. Root card must be `position: relative` and `overflow: hidden`.

5. **`card-focus-ring` is NEVER a DOM node.** Implement as `:focus-visible` CSS on the root `<article>`. The `hasFocus=true` Figma prop is a Figma demo only — never a React prop.

6. **`State=Default` and `State=Hover` are one React component**, styles switching via `:hover`. Default: `border/strong 1px OUTSIDE`. Hover: `border/brand 2px OUTSIDE` + Elevation/Level 2 shadow.

7. **`footer-fav-btn` and `footer-more-btn` fills are `opacity: 0` white** — ghost buttons with no visible background. They inherit the `surface/card/action` fill from their `card-footer` parent.

---

## SECTION 1 — PURPOSE

`ProjectCard` is the general-purpose project/entity card for displaying any non-CMS Contentstack entity in a card grid or list view. It is built on the `Card/Generic` Figma component. Unlike `Card/CMS` which has a fixed stat grid body, `ProjectCard` has a fully open body slot — any content can be passed as children, making it suitable for a wide range of entity types: spaces, environments, automations, integrations, or any future entity that does not have CMS-specific statistics.

**Use when:** Displaying a Contentstack project, space, or entity that has a title, optional context label, metadata (last activity, user count, etc.), and quick actions — but no fixed statistical body content.

**Do NOT use for:**
- CMS entries with a predefined stat breakdown (use `Card/CMS` — it has a fixed 3-column stat grid body)
- Asset items with media previews (use `Card/Assets`)
- Deployment environments with URL/branch/build info (use `Card/Launch`)
- Personalization experiences (use `Card/Personalize`)

**Alternatives:** `Card/CMS` when the entity is a content type or space with a fixed Types/Entries/Env stat grid. All other card variants for specific entity contexts.

---

## SECTION 2 — ANATOMY

```
┌─────────────────────────────────────────────────────┐  ← project-card (article, position:relative, overflow:hidden)
│                   card-header                        │  ← div, VERTICAL flex, pad:16/16/12/16, gap:4
│  ┌───────────────────────────────────────────────┐  │
│  │ card-title (h3)                               │  │  ← 2-line clamp, text/default, SemiBold 14px
│  └───────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │ card-subtitle-row (div, HORIZONTAL, gap:8)     │  │
│  │  [card-subtitle-icon?] card-subtitle  [Badge?] │  │  ← icon 16px (hidden), subtitle text/muted, badge right
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤  ← card-divider (hr, border/default, 1px)
│                   bodySlot (children)                │  ← div, FILL, pad:16 all, gap:8, flex:1
│  ┌──────────────────────────────────────────────┐    │  ← EMPTY by default — no default content
│  │ [any ReactNode passed as children prop]      │    │
│  └──────────────────────────────────────────────┘    │
├──────────────────────────────────────────────────────┤  ← card-meta (div, HORIZONTAL, space-between, pad:8/16)
│  metaLeft (prop, text/muted)  metaRight (prop, muted)│  ← meta-text: Regular 12px, ENDING truncation
├──────────────────────────────────────────────────────┤
│                   card-footer                        │  ← div, HORIZONTAL, 48px, pad:8/12, gap:8
│  [fav-btn]  ·····spacer·····  [more-btn]  [Open]   │  ← footer: surface/card/action fill
│                   card-hover-footer (ABSOLUTE)       │  ← position:absolute, bottom:0, left:0, right:0
│  [fav-btn]  ·····spacer·····  [more-btn]  [Open]   │  ← 48px, surface/card/action + Elevation/Level 2 — NO blur
└─────────────────────────────────────────────────────┘
  project-card-focus-ring (ABSOLUTE, inset:-2px, CSS only) ← :focus-visible pseudo-element, NOT a DOM node
```

**Layer-by-layer spec:**

```
project-card                   → <article className="project-card">
  Role: Root interactive container. Receives hover/focus. position:relative, overflow:hidden.
  DOM notes: <article> — card represents a discrete, self-contained content entity.
             tabIndex={0} — keyboard focusable. aria-labelledby="[instance-id]-title".

card-header                → <div className="project-card__header">
  Role: Title + subtitle zone. VERTICAL flex, fixed height derived from content.
  DOM notes: No ARIA role needed — it is a visual grouping, not a landmark.

card-title                 → <h3 className="project-card__title">
  Role: Primary label. 2-line clamp with ENDING ellipsis.
  DOM notes: h3 when card is inside a section with h1/h2 hierarchy.
             id="[instance-id]-title" — referenced by aria-labelledby on root.
  Text behaviour: maxLines=2 in Figma → CSS: display:-webkit-box; -webkit-line-clamp:2;
                  -webkit-box-orient:vertical; overflow:hidden.
                  If title is 1 line: card-header height = 68px.
                  If title is 2 lines: card-header height = 88px.
                  Title NEVER exceeds 2 lines — always truncates.

card-subtitle-row          → <div className="project-card__subtitle-row">
  Role: Subtitle + optional icon + optional badge in a horizontal row.

card-subtitle-icon         → <span className="project-card__subtitle-icon" aria-hidden="true">
  Role: Decorative icon left of subtitle. Visible only when hasSubtitleIcon=true.
  DOM notes: Always aria-hidden. The subtitle text carries the meaning.

card-subtitle              → <span className="project-card__subtitle">
  Role: Secondary context text (e.g. "Subtitle · badge" / content type name).
  Text behaviour: NO truncation in Figma (textTruncation=DISABLED). Text WRAPS freely.
                  If subtitle wraps to 2+ lines, card-header grows. Use CSS: word-break:break-word.

card-status-badge          → <Badge intent="success" label={statusText} size="sm" />
  Role: Optional inline status pill (e.g. "Live", "Draft", "Scheduled").
  DOM notes: Rendered only when hasStatus=true. Badge handles its own aria.
             Positioned at the end of card-subtitle-row via margin-left:auto on the badge wrapper.

card-divider               → <hr className="project-card__divider" aria-hidden="true" />
  Role: Visual separator between header and body.
  DOM notes: aria-hidden — decorative only. height:1px.

bodySlot                   → <div className="project-card__body">
  Role: Open content slot. Accepts any ReactNode as children.
  DOM notes: FILL vertical sizing → flex:1. Growing content pushes meta zone down.
             Default children: NONE — body is empty when no children are passed.
             Do not render any placeholder or default content.
             padding: 1rem all sides. gap: 0.5rem between children.
  FIGMA→CODE: Figma SLOT property = React children prop.
              Unlike Card/CMS, there is no default stat grid.
              Pass custom content from the consuming component/page.

card-meta                  → <div className="project-card__meta">
  Role: Metadata row — two pieces of contextual info (e.g. user count, last modified).
  DOM notes: HORIZONTAL flex with justify-content:space-between. padding: 0.5rem 1rem.
             Top border: 1px solid var(--border-default).

meta-item (left)           → <div className="project-card__meta-item">
  Role: Left metadata datum. Renders `metaLeft` prop value.
  DOM notes: flex:1. gap: 0.25rem.

meta-item (right)          → <div className="project-card__meta-item">
  Role: Right metadata datum. Renders `metaRight` prop value.
  DOM notes: flex:1. gap: 0.25rem.

meta-text                  → <span className="project-card__meta-text">
  Role: Metadata label text. Direct text prop — not passed as children.
  Text behaviour: FILL sizing with ENDING truncation. CSS: overflow:hidden;
                  text-overflow:ellipsis; white-space:nowrap. Single line only.

card-footer                → <div className="project-card__footer">
  Role: Action bar. Always shown when hasFooter=true (default).
  DOM notes: HORIZONTAL flex. 48px height. padding: 0.5rem 0.75rem. gap: 0.5rem.
             fill: var(--surface-card-action) = #F9F8FF Light / #4C42A0 Dark.
             Top border: 1px solid var(--border-default).
             border-radius: bottom corners only — border-radius:0 0 0.75rem 0.75rem.

footer-fav-btn             → <IconButton variant="ghost" size="md" aria-label="Add to favourites"
                               onClick={onFavourite} className="project-card__footer-fav" />
  Role: Favourite/bookmark toggle.
  DOM notes: 40×40px. Visible only when showFavourite=true. aria-pressed when toggle.
             Transparent background — inherits footer fill.

footer-spacer              → <div className="project-card__footer-spacer" aria-hidden="true" />
  Role: Flex spacer. Pushes action buttons to the right.
  DOM notes: flex:1. No visual presence. aria-hidden.

footer-more-btn            → <IconButton variant="ghost" size="md" aria-label="More actions"
                               onClick={onMoreActions} className="project-card__footer-more" />
  Role: Opens contextual action menu.
  DOM notes: 40×40px. Visible only when showMoreActions=true.

footer-primary-action      → <Button variant="primary" size="md" onClick={onOpen}
                               className="project-card__footer-cta">Open</Button>
  Role: Primary CTA — opens the CMS entry.
  DOM notes: 52×32px (md Button with inline padding). Visible only when showOpenCTA=true.

card-hover-footer          → ABSOLUTE <div className="project-card__hover-footer">
  Role: Action bar overlay revealed on hover. Same content as card-footer.
  DOM notes: position:absolute; bottom:0; left:0; right:0; height:48px.
             background: var(--project-card-footer-surface) = #F9F8FF Light / #4C42A0 Dark.
             fill: surface/card/action — **the same token as card-footer**.
             **Elevation/Level 2 drop shadow** (no backdrop-filter — unlike Card/CMS):
               box-shadow: 0 2px 4px -1px rgba(0,0,0,.20), 0 5px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
             border-radius: 0 0 0.75rem 0.75rem (bottom corners only).
             Hidden by default: opacity:0 or display:none. Revealed on project-card:hover.
             Visible only when hasHoverActions=true.
  FIGMA→CODE: ABSOLUTE layer with BOTTOM+STRETCH constraints → position:absolute;bottom:0;left:0;right:0.
              No backdrop-filter. No blur. This is a solid elevated surface.

card-focus-ring            → CSS :focus-visible ONLY — NO DOM NODE
  Role: 2px focus ring at 2px offset from card edge.
  Implementation:
    .project-card:focus-visible {
      outline: 2px solid var(--focus-ring-color);  /* border/focus = #6C5CE7 */
      outline-offset: 2px;
      border-radius: calc(var(--project-card-radius) + 2px);  /* 12 + 2 = 14px */
    }
  DOM notes: The Figma card-focus-ring frame is NEVER rendered as a DOM element.
             It is a Figma design annotation for developers. The ABSOLUTE frame with
             inset:-2px is exactly equivalent to outline + outline-offset:2px.
```

---

## SECTION 3 — TYPESCRIPT PROPS INTERFACE

```typescript
// ProjectCard.types.ts

import type { ReactNode } from 'react';

export interface ProjectCardProps {
  // ─── VARIANT ──────────────────────────────────────────────────────────
  // Note: State=Default/Hover is controlled by CSS :hover — NOT a prop.

  // ─── CONTENT PROPS ────────────────────────────────────────────────────
  /** Card title — the name of the CMS entry/content type.
   *  Maps to Figma text property: title (default: "Card title")
   *  Behaviour: 2-line clamp with trailing ellipsis. Never exceeds 2 lines.
   *  Wrap: NO — clamped. Truncate: YES — ENDING ellipsis after line 2.
   *  Use full entry name. Do not pre-truncate in JS — let CSS handle it. */
  title: string;

  /** Secondary context label below the title (e.g. content type name, space name,
   *  or a middle-dot separated string like "Blog · Published").
   *  Maps to Figma text property: subtitle (default: "Subtitle · badge")
   *  Behaviour: Wraps freely — NO truncation, NO max lines. Card height grows.
   *  Keep to 1 line wherever possible — long subtitles push body content down. */
  subtitle: string;

  // ─── STATUS BADGE ────────────────────────────────────────────────────
  /** Show the status badge in the subtitle row.
   *  Maps to Figma boolean: hasStatus (default: false) */
  hasStatus?: boolean;

  /** Text shown in the status badge. Only rendered when hasStatus=true.
   *  Maps to Figma text property: statusText (default: "Live")
   *  Typical values: "Live", "Draft", "Scheduled", "Unpublished" */
  statusText?: string;

  // ─── STRUCTURAL BOOLEANS ─────────────────────────────────────────────
  /** Show the decorative icon left of the subtitle.
   *  Maps to Figma boolean: hasSubtitleIcon (default: false)
   *  Use when the icon communicates context (e.g. a globe icon for a web channel). */
  hasSubtitleIcon?: boolean;

  /** Show the footer action bar (surface/card/action background zone).
   *  Maps to Figma boolean: hasFooter (default: true)
   *  Set false only for read-only/display-only card contexts. */
  hasFooter?: boolean;

  /** Show the frosted glass hover action overlay.
   *  Maps to Figma boolean: hasHoverActions (default: false)
   *  When true: the card-hover-footer (solid surface/card/action fill + elevation) overlays card-footer on :hover.
   *  When false: only card-footer is shown; hover overlay is never rendered. */
  hasHoverActions?: boolean;

  // ─── FOOTER ACTION VISIBILITY ─────────────────────────────────────────
  /** Show the favourite/bookmark icon button in the footer.
   *  Maps to Figma boolean: showFavourite (default: true) */
  showFavourite?: boolean;

  /** Show the "Open" primary CTA button in the footer.
   *  Maps to Figma boolean: showOpenCTA (default: true) */
  showOpenCTA?: boolean;

  /** Show the "More actions" icon button in the footer.
   *  Maps to Figma boolean: showMoreActions (default: true) */
  showMoreActions?: boolean;

  // ─── METADATA PROPS (from Figma text properties: metaLeft, metaRight) ──
  /** Left metadata item text (e.g. "17 users", "3 members").
   *  Maps to Figma text property: metaLeft (default: "17 users")
   *  Behaviour: Single line, ENDING truncation when content overflows.
   *  Always provide — use an empty string "" to suppress visually. */
  metaLeft?: string;

  /** Right metadata item text (e.g. "2h ago", "Yesterday").
   *  Maps to Figma text property: metaRight (default: "2h ago")
   *  Behaviour: Single line, ENDING truncation when content overflows. */
  metaRight?: string;

  // ─── BODY SLOT ────────────────────────────────────────────────────────
  /** Body content injected into the card body zone.
   *  Maps to Figma SLOT property: bodySlot
   *  SLOT → children in React. Any ReactNode is valid.
   *  Default: NONE — the body zone is empty when children are omitted.
   *  Unlike Card/CMS, there is no default stat grid.
   *  The body zone has padding:1rem and gap:0.5rem between children. */
  children?: ReactNode;

  // ─── ACTION CALLBACKS ─────────────────────────────────────────────────
  /** Called when the "Open" CTA button is clicked. */
  onOpen?: () => void;

  /** Called when the favourite icon button is clicked. */
  onFavourite?: () => void;

  /** Called when the more-actions icon button is clicked. */
  onMoreActions?: () => void;

  // ─── ACCESSIBILITY ────────────────────────────────────────────────────
  /** Accessible label. Provide when the title alone does not fully describe the card.
   *  e.g. aria-label="Blog entry: My First Post" when context is needed. */
  'aria-label'?: string;

  // ─── STANDARD HTML ────────────────────────────────────────────────────
  /** Additional CSS class names. Applied to root <article>. */
  className?: string;
  /** Test selector. */
  'data-testid'?: string;
}

export const ProjectCardDefaultProps: Partial<ProjectCardProps> = {
  hasStatus: false,
  hasSubtitleIcon: false,
  hasFooter: true,
  hasHoverActions: false,
  showFavourite: true,
  showOpenCTA: true,
  showMoreActions: true,
};
```

---

## SECTION 4 — FIGMA → REACT PROP MAPPING

| Figma property | Figma type | React prop | React type | Default | Notes |
|---|---|---|---|---|---|
| `title` | Text | `title` | `string` | `"Card title"` | Required |
| `subtitle` | Text | `subtitle` | `string` | `"Subtitle · badge"` | Required |
| `metaLeft` | Text | `metaLeft` | `string` | `"17 users"` | Left metadata item — direct prop, not in children |
| `metaRight` | Text | `metaRight` | `string` | `"2h ago"` | Right metadata item — direct prop, not in children |
| `statusText` | Text | `statusText` | `string` | `"Live"` | Only rendered when `hasStatus=true` |
| `hasStatus` | Boolean | `hasStatus` | `boolean` | `false` | Shows/hides `card-status-badge` |
| `hasSubtitleIcon` | Boolean | `hasSubtitleIcon` | `boolean` | `false` | Shows/hides `card-subtitle-icon` |
| `hasFooter` | Boolean | `hasFooter` | `boolean` | `true` | Shows/hides `card-footer` zone entirely |
| `hasHoverActions` | Boolean | `hasHoverActions` | `boolean` | `false` | Enables `card-hover-footer` on `:hover` |
| `showFavourite` | Boolean | `showFavourite` | `boolean` | `true` | Shows/hides `footer-fav-btn` |
| `showOpenCTA` | Boolean | `showOpenCTA` | `boolean` | `true` | Shows/hides `footer-primary-action` |
| `showMoreActions` | Boolean | `showMoreActions` | `boolean` | `true` | Shows/hides `footer-more-btn` |
| `bodySlot` | Slot | `children` | `React.ReactNode` | `undefined` (empty) | SLOT → children. No default content. |
| `State=Default` | Variant | — | — | Default | CSS `:hover` only — **never a prop** |
| `State=Hover` | Variant | — | — | — | CSS `:hover` only — **never a prop** |
| `hasFocus=true` | Boolean | — | — | `false` | Figma demo only. **Never a React prop.** Maps to CSS `:focus-visible` |

---

## SECTION 5 — STATE BEHAVIOUR

| State | Trigger | Visual changes | Tokens applied | ARIA change | Screen reader announces |
|---|---|---|---|---|---|
| **Default** | Component mounts | border: 1px `border/strong` OUTSIDE, no shadow, `card-hover-footer` hidden | `border/strong` = gray/400 Light | — | `"[title], article"` |
| **Hover** | CSS `:hover` | border → 2px `border/brand` OUTSIDE, Elevation/Level 2 drop shadow, `card-hover-footer` revealed (if `hasHoverActions=true`) | `border/brand` = purple/500 Light | — | Nothing — hover not announced |
| **Focused** | CSS `:focus-visible` (Tab key) | `card-focus-ring` appears: 2px solid `focus/ring/color`, 2px offset | `focus/ring/color` = purple/500 Light / purple/400 Dark | — | `"[title], article"` — same as default |
| **Focused + Hover** | Tab focus, then hover (or vice versa) | Both focus ring AND hover border/shadow visible simultaneously | Both sets of tokens | — | — |

**Elevation/Level 2 (Hover shadow) — three-layer drop shadow:**
```css
box-shadow:
  0px 2px 4px -1px rgba(0, 0, 0, 0.20),
  0px 5px 5px  0px rgba(0, 0, 0, 0.14),
  0px 1px 10px 0px rgba(0, 0, 0, 0.12);
```
These values are confirmed from the Figma component. Default state has no shadow.

**Hover footer appearance:**
- `card-hover-footer` is `position:absolute; bottom:0; left:0; right:0; height:48px`
- `background: var(--project-card-footer-surface)` = `#F9F8FF` Light / `#4C42A0` Dark (surface/card/action)
- **No `backdrop-filter`** — solid fill with Elevation/Level 2 drop shadow
- Transition: `opacity 0.15s ease` or `visibility 0.15s` — respect `prefers-reduced-motion`
- Only rendered in DOM when `hasHoverActions=true`

---

## SECTION 6 — SIZE SPECIFICATION

Card/CMS has no size variants (md/lg/xl). It uses a fixed internal sizing system.

| Zone | Property | Value | Token | REM equivalent | Why REM |
|---|---|---|---|---|---|
| Root card | border-radius | 12px | `radius/12` | `0.75rem` | Scales with user font preferences. Cards in accessible zoom contexts must not appear square. |
| Root card | border-width Default | 1px | — | `1px` | 1px borders stay 1px — REM here causes half-pixel rendering artefacts on non-retina. |
| Root card | border-width Hover | 2px | — | `2px` | Same reason — keep px. |
| card-header | padding-top / left / right | 16px | `space/16` | `1rem` | All spacing should be REM so the card scales correctly at 200% browser zoom (WCAG 1.4.4). |
| card-header | padding-bottom | 12px | `space/12` | `0.75rem` | |
| card-header | gap | 4px | `space/4` | `0.25rem` | |
| card-title | font-size | 14px | `body/md` or `label/xl` | `0.875rem` | **REM not px.** At 200% zoom, 14px becomes 7px effective — inaccessible. 0.875rem scales with browser font size. |
| card-title | font-weight | 600 / SemiBold | — | — | Unitless — no conversion |
| card-title | line-height | 140% | — | `1.4` (unitless ratio) | Use unitless ratio, not px. Inherits correctly from font-size. |
| card-title | max-lines | 2 | — | — | CSS `-webkit-line-clamp: 2` |
| card-subtitle | font-size | 12px | `label/md` or `body/sm` | `0.75rem` | REM — same reason as title |
| card-subtitle | font-weight | 400 / Regular | — | — | |
| card-subtitle | line-height | 140% | — | `1.4` | |
| card-subtitle | truncation | NONE — wraps | — | `word-break: break-word` | |
| card-status-badge | (see Badge brief) | — | — | — | |
| card-divider | height | 1px | — | `1px` | Decorative line — px intentional |
| bodySlot | padding all | 16px | `space/16` | `1rem` | |
| bodySlot | gap | 8px | `space/8` | `0.5rem` | |

| card-meta | padding V | 8px | `space/8` | `0.5rem` | |
| card-meta | padding H | 16px | `space/16` | `1rem` | |
| card-meta | gap | 24px | `space/24` | `1.5rem` | |
| meta-text | font-size | 12px | `label/md` | `0.75rem` | REM |
| meta-text | font-weight | 400 / Regular | — | — | |
| meta-text | truncation | ENDING — single line | — | `overflow:hidden; text-overflow:ellipsis; white-space:nowrap` | |
| card-footer | height | 48px | — | `3rem` | REM — footer should scale with font size |
| card-footer | padding V | 8px | `space/8` | `0.5rem` | |
| card-footer | padding H | 12px | `space/12` | `0.75rem` | |
| card-footer | gap | 8px | `space/8` | `0.5rem` | |
| card-footer | border-radius | 0 0 12px 12px | `radius/12` bottom | `0 0 0.75rem 0.75rem` | Bottom only |
| footer-fav-btn | size | 40×40px | (IconButton md) | `2.5rem × 2.5rem` | |
| footer-more-btn | size | 40×40px | (IconButton md) | `2.5rem × 2.5rem` | |
| footer-primary-action | size | 52×32px | (Button md) | `3.25rem × 2rem` | |
| card-hover-footer | height | 48px | — | `3rem` | Same as footer |
| card-focus-ring | offset | 2px from edge | `focus/ring/offset` | `outline-offset: 2px` | px intentional for focus ring offset |
| card-focus-ring | border-width | 2px | `focus/ring/width` | `2px` | px intentional |
| card-focus-ring | border-radius | 14px (12+2) | `radius/12` + 2 | `calc(0.75rem + 2px)` | Combination of REM token + px offset |

**Why REM and not px for font-sizes and spacing:**
> WCAG 1.4.4 (Resize Text) requires text to be resizable to 200% without loss of content. User-set browser font sizes (common in accessibility settings) only work when the page uses `rem` units — `px` ignores the browser font-size preference entirely. Cards in a CMS grid at 200% zoom must still be readable and correctly spaced. `16px` padding becomes `8px` effective at 200% if set in `px` — cramped, inaccessible. `1rem` becomes `32px` at 200% browser font-size — correct, intentional scaling.
>
> Exception: `1px` and `2px` borders stay in `px`. Sub-pixel rendering of `0.0625rem` borders causes inconsistent antialiasing across browsers and screens. Borders this thin should not scale.

---

## SECTION 7 — TOKEN REFERENCE

| CSS class / selector | CSS property | Token name | Light value | Dark value |
|---|---|---|---|---|
| `.project-card` | `background-color` | `surface/raised` | `#FFFFFF` | `#1F2937` |
| `.project-card` | `border-color` (Default) | `border/strong` | `#9CA3AF` | `#6B7280` |
| `.project-card` | `border-width` (Default) | — | `1px` | `1px` |
| `.project-card` | `border-style` | — | `solid` | `solid` |
| `.project-card` | `border-radius` | `radius/12` | `0.75rem` | `0.75rem` |
| `.project-card:hover` | `border-color` | `border/brand` | `#6C5CE7` | `#9F93FA` |
| `.project-card:hover` | `border-width` | — | `2px` | `2px` |
| `.project-card:hover` | `box-shadow` | `Elevation/Level 2` | see above | see above |
| `.project-card:focus-visible` | `outline-color` | `focus/ring/color` | `#6C5CE7` | `#9F93FA` |
| `.project-card:focus-visible` | `outline-width` | `focus/ring/width` | `2px` | `2px` |
| `.project-card:focus-visible` | `outline-offset` | `focus/ring/offset` | `2px` | `2px` |
| `.project-card__title` | `color` | `text/default` | `#111827` | `#F9FAFB` |
| `.project-card__title` | `font-size` | — | `0.875rem` (14px) | `0.875rem` |
| `.project-card__title` | `font-weight` | — | `600` | `600` |
| `.project-card__title` | `line-height` | — | `1.4` | `1.4` |
| `.project-card__subtitle` | `color` | `text/muted` | `#6B7280` | `#6B7280` |
| `.project-card__subtitle` | `font-size` | — | `0.75rem` (12px) | `0.75rem` |
| `.project-card__subtitle` | `font-weight` | — | `400` | `400` |
| `.project-card__divider` | `background-color` | `border/default` | `#E5E7EB` | `#374151` |
| `.project-card__body` | `padding` | `space/16` | `1rem` | `1rem` |
| `.project-card__body` | `gap` | `space/8` | `0.5rem` | `0.5rem` |

| `.project-card__meta` | `padding` | `space/8` V + `space/16` H | `0.5rem 1rem` | `0.5rem 1rem` |
| `.project-card__meta` | `border-top` | `border/default` | `1px solid #E5E7EB` | `1px solid #374151` |
| `.project-card__meta-text` | `color` | `text/muted` | `#6B7280` | `#6B7280` |
| `.project-card__meta-text` | `font-size` | — | `0.75rem` | `0.75rem` |
| `.project-card__footer` | `background-color` | `surface/card/action` | `#F9F8FF` | `#4C42A0` |
| `.project-card__footer` | `border-top` | `border/default` | `1px solid #E5E7EB` | `1px solid #374151` |
| `.project-card__footer` | `border-radius` | `radius/12` bottom | `0 0 0.75rem 0.75rem` | same |
| `.project-card__footer` | `padding` | `space/8` V + `space/12` H | `0.5rem 0.75rem` | same |
| `.project-card__hover-footer` | `background-color` | `surface/card/action` | `#F9F8FF` | `#4C42A0` |
| `.project-card__hover-footer` | `box-shadow` | `Elevation/Level 2` | see elevation values | darker values |

**CSS custom property export:**
```css
/* ── ProjectCard tokens ─────────────────────────────────────────────── */
:root[data-theme="light"] {
  --project-card-surface:             #FFFFFF;           /* surface/raised */
  --project-card-border-default:      #9CA3AF;           /* border/strong */
  --project-card-border-hover:        #6C5CE7;           /* border/brand */
  --project-card-radius:              0.75rem;           /* radius/12 */
  --project-card-footer-surface:      #F9F8FF;           /* surface/card/action */
  --project-card-divider:             #E5E7EB;           /* border/default */
  --project-card-meta-border:         #E5E7EB;           /* border/default */
  --project-card-text-primary:        #111827;           /* text/default */
  --project-card-text-secondary:      #6B7280;           /* text/muted */
  --project-card-stat-border:         #E5E7EB;           /* border/default */
  --project-card-focus-ring:          #6C5CE7;           /* focus/ring/color */
  --project-card-elevation-hover:
    0px 2px 4px -1px rgba(0,0,0,0.20),
    0px 5px 5px   0px rgba(0,0,0,0.14),
    0px 1px 10px  0px rgba(0,0,0,0.12);
}

:root[data-theme="dark"] {
  --project-card-surface:             #1F2937;           /* surface/raised dark */
  --project-card-border-default:      #6B7280;           /* border/strong dark */
  --project-card-border-hover:        #9F93FA;           /* border/brand dark */
  --project-card-footer-surface:      #4C42A0;           /* surface/card/action dark */
  --project-card-divider:             #374151;           /* border/default dark */
  --project-card-meta-border:         #374151;
  --project-card-text-primary:        #F9FAFB;           /* text/default dark */
  --project-card-text-secondary:      #6B7280;           /* text/muted dark */
  --project-card-stat-border:         #374151;
  --project-card-focus-ring:          #9F93FA;           /* focus/ring/color dark */
  --project-card-elevation-hover:
    0px 2px 4px -1px rgba(0,0,0,0.40),
    0px 5px 5px   0px rgba(0,0,0,0.28),
    0px 1px 10px  0px rgba(0,0,0,0.24);
}
```

---

## SECTION 8 — ACCESSIBILITY

This section is complete and self-contained. No external references required.

**ARIA role and root element:**
```
Root element:  <article>
ARIA role:     article (implicit from element)
Focusable:     Yes — tabIndex={0}
```

**Semantic HTML rationale:**
`<article>` is correct here — each card represents a discrete, independently reusable piece of content (a CMS entry). Screen readers announce `<article>` boundaries, giving keyboard users awareness of where one entry ends and another begins. This is preferable to `<div role="article">`.

**Required ARIA attributes:**
```html
<article
  className="project-card"
  tabIndex={0}
  aria-labelledby="[instance-id]-title"
>
  <h3 id="[instance-id]-title" className="project-card__title">{title}</h3>
  ...
</article>
```
`aria-labelledby` points to the `<h3>` title — the screen reader announces the card by its title when the user tabs to it or browses article landmarks.

**When `aria-label` is used instead:**
If the `title` prop does not fully describe the card in context, pass `aria-label="Blog entry: My First Post"` explicitly. This overrides `aria-labelledby`. Do not use both simultaneously.

**Conditional ARIA on footer buttons:**
```html
<!-- Favourite toggle — reflects pressed state -->
<button aria-label="Add to favourites" aria-pressed={isFavourited}>
  <Icon aria-hidden="true" />
</button>

<!-- More actions — reflects expanded state of any menu -->
<button aria-label="More actions" aria-expanded={isMenuOpen} aria-haspopup="menu">
  <Icon aria-hidden="true" />
</button>

<!-- Open CTA — simple action button -->
<button aria-label={`Open ${title}`}>
  Open
</button>
```
Note: The "Open" button's visible text is "Open". Its `aria-label` should be `"Open ${title}"` for unambiguous screen reader context — without this, "Open" alone is announced and screen reader users have no context for which entry they are opening.

**Keyboard interaction — complete map:**
```
Tab            → Moves focus to the card (root <article>)
Tab (again)    → Moves focus inside — to footer-fav-btn, footer-more-btn, footer-primary-action
                 (in DOM order). All three are standard <button> elements.
Shift+Tab      → Reverses focus order
Enter          → On root card: activates primary action (same as clicking "Open")
                 On a button inside footer: activates that button
Space          → On root card: same as Enter (by convention for article-level keyboard activation)
                 On footer-fav-btn: toggles favourite state (aria-pressed flips)
Escape         → No card-level behaviour. If a menu was opened via footer-more-btn, Escape
                 closes the menu and returns focus to footer-more-btn.
```

**Focus management:**
```
On card focus (Tab):    Focus ring appears on root <article> via :focus-visible.
                         card-hover-footer does NOT appear on keyboard focus — only on :hover.
                         This is intentional: keyboard users see the footer action bar (card-footer)
                         at all times (when hasFooter=true). They do not need the hover overlay.
On footer button focus: The button's own focus ring appears (IconButton/Button internal rings).
On menu open:            Focus moves to first menu item.
On menu close:           Focus returns to the footer-more-btn that opened it.
On card click:           Fire onOpen callback. If card has a natural navigation href, use <a> wrapper
                         instead of onClick for correct browser and AT behaviour.
```

**Screen reader announcements:**
```
Card receives focus:      "[title text], article"
                          e.g. "Marketing Blog, article"

Footer button — fav:      "Add to favourites, button" (default, not pressed)
                           "Add to favourites, button, pressed" (when isFavourited=true)

Footer button — more:     "More actions, button, collapsed"
                           "More actions, button, expanded" (when menu is open)

Footer CTA "Open":        "Open Marketing Blog, button"
                           (use aria-label="Open {title}" — not just "Open")

Status badge:             Badge component handles its own announcements.
                           Ensure badge text is part of the card's accessible description.
                           Use aria-describedby="[instance-id]-status" if status is critical.
```

**Contrast ratios — all pairs in this component:**

| Pair | Light mode | Dark mode | Ratio L | Ratio D | WCAG |
|---|---|---|---|---|---|
| `card-title` text/default on surface/raised | #111827 on #FFFFFF | #F9FAFB on #1F2937 | 19.6:1 | 15.3:1 | AAA ✅ |
| `card-subtitle` text/muted on surface/raised | #6B7280 on #FFFFFF | #6B7280 on #1F2937 | 5.9:1 | 4.8:1 | AA ✅ |
| `meta-text` text/muted on surface/raised | #6B7280 on #FFFFFF | #6B7280 on #1F2937 | 5.9:1 | 4.8:1 | AA ✅ |
| `badge-label` text/success on feedback/success/surface | #166534 on #F5FFFC | #34D399 on #064E45 | ~7:1 | ~5.5:1 | AAA/AA ✅ |
| Footer: icon buttons on surface/card/action | #6C5CE7 on #F9F8FF | #9F93FA on #4C42A0 | 4.1:1 | 3.8:1 | AA (UI) ✅ |
| Footer: "Open" text/on-brand on action/primary | #FFFFFF on #6C5CE7 | #FFFFFF on #9F93FA | 4.6:1 | 3.5:1 | AA ✅ |
| Focus ring border/focus on surface/raised | #6C5CE7 on #FFFFFF | #9F93FA on #1F2937 | 4.86:1 | 3.2:1 | AA ✅ |

**Touch target verification:**
```
footer-fav-btn:            40×40px → 2.5rem × 2.5rem  ✅ (WCAG 2.5.8 ≥ 24px)
footer-more-btn:           40×40px → 2.5rem × 2.5rem  ✅
footer-primary-action:     52×32px → 3.25rem × 2rem   ✅ (height ≥ 24px)
Root card (Tab focusable): Full card area             ✅
```

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-card__hover-footer,
  .project-card__footer-fav,
  .project-card__footer-more,
  .project-card__footer-cta {
    transition: none;
    animation: none;
  }
  /* Hover overlay still appears — just without transition */
  /* Do NOT disable the overlay entirely — keyboard/pointer users still need the actions */
}
```

**Icon accessibility:**
```
All icons inside ProjectCard are decorative — they reinforce the button label but carry no independent meaning.
All icon wrappers: aria-hidden="true"
All buttons with icons: accessible name via aria-label or visible text label
No icon-only communication of meaning anywhere in the card.
```

**Form association:** Not applicable — ProjectCard is not a form control.

**High contrast mode:**
```css
@media (forced-colors: active) {
  .project-card {
    border: 1px solid ButtonText;
    forced-color-adjust: none;
  }
  .project-card:hover {
    border: 2px solid Highlight;
  }
  .project-card:focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
  .project-card__divider,
  .project-card__meta,
  .project-card__footer {
    border-color: ButtonText;
  }
  .project-card__footer {
    background-color: ButtonFace;
  }
  .project-card__hover-footer {
    background-color: Highlight;
    /* no backdrop-filter on this card variant */
  }
}
```

**Heading hierarchy note:**
Card title uses `<h3>`. This assumes the page using cards has an `<h1>` (page title) and `<h2>` (section heading, e.g. "Your Spaces"). Do not use `<h3>` if the card is in a context with no `<h2>` above it — adjust the heading level to match the actual page hierarchy.

---

## SECTION 9 — STORYBOOK STORIES

File: `ProjectCard.stories.tsx`
Storybook title: `Content/ProjectCard`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { ProjectCard } from './ProjectCard';
// No default body sub-component — bodySlot is empty by default

const meta: Meta<typeof ProjectCard> = {
  title: 'Content/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Primary CMS entry card. Displays a Contentstack content type or space with title, stats, metadata, and quick actions.',
      },
    },
  },
  argTypes: {
    title:         { control: 'text' },
    subtitle:      { control: 'text' },
    hasStatus:     { control: 'boolean' },
    statusText:    { control: 'text' },
    hasSubtitleIcon:  { control: 'boolean' },
    hasFooter:     { control: 'boolean' },
    hasHoverActions: { control: 'boolean' },
    showFavourite: { control: 'boolean' },
    showOpenCTA:   { control: 'boolean' },
    showMoreActions: { control: 'boolean' },
    onOpen:        { action: 'open' },
    onFavourite:   { action: 'favourite' },
    onMoreActions: { action: 'more-actions' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '296px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

// ── REQUIRED STORIES ────────────────────────────────────────────────

export const Default: Story = {
  args: {
    title: 'Marketing Blog',
    subtitle: 'Content Type',
    hasFooter: true,
    showFavourite: true,
    showOpenCTA: true,
    showMoreActions: true,
    children: (
      <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--project-card-text-secondary)' }}>Custom body content</p>
    ),
  },
};

export const WithStatus: Story = {
  args: {
    ...Default.args,
    hasStatus: true,
    statusText: 'Live',
  },
};

export const WithSubtitleIcon: Story = {
  args: {
    ...Default.args,
    hasSubtitleIcon: true,
    subtitle: 'Global · Web channel',
  },
};

export const HoverActionsEnabled: Story = {
  name: 'With Hover Actions Overlay',
  args: {
    ...Default.args,
    hasHoverActions: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover the card to reveal the solid elevated action overlay (card-hover-footer). Uses surface/card/action fill + Elevation/Level 2 drop shadow.',
      },
    },
  },
};

export const AllPropsOn: Story = {
  name: 'All Optional Elements Visible',
  args: {
    title: 'E-Commerce Product Catalogue',
    subtitle: 'Content Type · Blog',
    hasStatus: true,
    statusText: 'Live',
    hasSubtitleIcon: true,
    hasFooter: true,
    hasHoverActions: true,
    showFavourite: true,
    showOpenCTA: true,
    showMoreActions: true,
    children: (
      <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--project-card-text-secondary)' }}>Custom body content</p>
    ),
  },
};

export const NoFooter: Story = {
  args: {
    ...Default.args,
    hasFooter: false,
  },
};

export const LongTitle: Story = {
  args: {
    ...Default.args,
    title: 'E-Commerce Product Catalogue with Extended Description That Exceeds Two Lines of Text',
    subtitle: 'Content Type',
  },
  parameters: {
    docs: {
      description: {
        story: 'Title is clamped at 2 lines with trailing ellipsis. Card height remains consistent.',
      },
    },
  },
};

export const LongSubtitle: Story = {
  args: {
    ...Default.args,
    title: 'Marketing Blog',
    subtitle: 'Content Type — Long subtitle that wraps to a second line because there is no truncation applied to the subtitle zone',
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtitle has NO line clamp and NO truncation. It wraps freely. Card-header height grows to accommodate. Avoid long subtitles — use 1 line wherever possible.',
      },
    },
  },
};

export const LongMetaText: Story = {
  args: {
    ...Default.args,
    // Meta text is passed via children/sub-components — demonstrate truncation
    title: 'Marketing Blog',
    subtitle: 'Content Type',
  },
  parameters: {
    docs: {
      description: {
        story: 'Meta text items (usage count, last modified) truncate with ENDING ellipsis when the card is narrow. Each meta-item is flex:1.',
      },
    },
  },
};

export const CustomBodyContent: Story = {
  args: {
    title: 'Custom Body Example',
    subtitle: 'Card with custom children',
    hasFooter: true,
    children: (
      <div style={{ padding: '0.5rem', background: 'var(--surface-sunken)', borderRadius: '0.25rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem' }}>Any ReactNode can be passed as children (bodySlot).</p>
      </div>
    ),
  },
};

export const Focused: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('article');
    card.focus();
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the 2px focus ring on keyboard focus. Implemented via CSS :focus-visible — not a DOM node.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: { ...AllPropsOn.args },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ width: '296px', padding: '2rem', background: '#111827' }}>
        <Story />
      </div>
    ),
  ],
};

export const InGrid: Story = {
  name: 'In Card Grid (3-up)',
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 296px)',
      gap: '1rem',
    }}>
      {['Marketing Blog', 'Product Catalogue', 'Help Centre'].map((name) => (
        <ProjectCard
          key={name}
          title={name}
          subtitle="Content Type"
          hasFooter
          showFavourite
          showOpenCTA
          showMoreActions
        >
          <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--project-card-text-secondary)' }}>Custom body content</p>
        </ProjectCard>
      ))}
    </div>
  ),
  parameters: { layout: 'padded' },
};
```

---

## SECTION 10 — IMPLEMENTATION NOTES

**Text wrapping and truncation — the full picture:**

| Text node | Wraps? | Truncates? | Max lines | CSS rule |
|---|---|---|---|---|
| `card-title` | **NO** — clamped | **YES** — ENDING ellipsis | **2** | `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;` |
| `card-subtitle` | **YES** — wraps freely | **NO** | Unlimited | `word-break: break-word; white-space: normal;` |
| `meta-text` | **NO** — single line | **YES** — ENDING ellipsis | 1 | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` |
| `badge-label` | NO | NO | 1 | Badge handles internally |

**Critical: `card-subtitle` does NOT truncate.** This is confirmed in Figma (`textTruncation=DISABLED`). Long subtitles push the header zone taller. Designers should keep subtitles to 1 line — but the component must not crop them. This is a deliberate product decision: hiding content without user control is worse than a taller card.

**The two footer zones:**

ProjectCard has two overlapping footer elements occupying the same 48px zone at the card bottom:

1. `card-footer` — always in the DOM when `hasFooter=true`. Normal flow (flex child of the card).
2. `card-hover-footer` — `position:absolute; bottom:0; left:0; right:0`. Overlays `card-footer` on hover. Only rendered when `hasHoverActions=true`.

Both contain the same set of action buttons (fav, spacer, more, open). This is intentional: the hover footer provides a frosted glass visual treatment for the hover state, while the base footer provides the always-visible action zone.

```css
.project-card {
  position: relative;
  overflow: hidden; /* Required for absolute hover footer to clip at border-radius */
}

.project-card__hover-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3rem; /* 48px */
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  background: var(--project-card-footer-surface);  /* surface/card/action — same as footer */
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,.20), 0px 5px 5px 0px rgba(0,0,0,.14), 0px 1px 10px 0px rgba(0,0,0,.12);
  border-radius: 0 0 0.75rem 0.75rem;
  /* No backdrop-filter — ProjectCard uses solid fill, unlike Card/CMS */
}

.project-card:hover .project-card__hover-footer {
  opacity: 1;
  pointer-events: auto;
}
```

**Border behaviour on hover — 1px → 2px shift:**
When border increases from 1px to 2px on hover, the card shifts 1px inward in OUTSIDE stroke mode. To prevent content jumping, use a wrapper technique:
```css
/* Option A: Use outline for hover (doesn't affect layout) */
.project-card { border: 1px solid var(--project-card-border-default); }
.project-card:hover { border-color: var(--project-card-border-hover); border-width: 2px; }
/* This will shift content 1px — acceptable for enterprise cards */

/* Option B: Pad with transparent 1px border + switch color on hover (no shift) */
.project-card { border: 2px solid transparent; box-shadow: inset 0 0 0 1px var(--project-card-border-default); }
.project-card:hover { box-shadow: none; border-color: var(--project-card-border-hover); }
/* Achieves no layout shift but adds complexity */
```
Option A matches the Figma exactly. Option B is preferred for zero-shift grid layouts.

**Dark mode:**
```tsx
// Theme applied via data-theme attribute on a parent element or <html>
<html data-theme="dark">
  <ProjectCard ... />
</html>
```


**Footer spacer:**
`footer-spacer` is a `flex:1` spacer with no visual presence. It pushes fav + more + open to the right edge. Do not omit it — without the spacer, buttons cluster to the left.

**`bodySlot` → `children` mapping:**
The Figma `bodySlot` SLOT property maps directly to React `children`. Unlike Card/CMS, there is NO default body content — the body is empty when children are omitted. In React:
```tsx
function ProjectCard({ children, ...props }) {
  // ...
  return (
    <article ...>
      <div className="project-card__body">{children}</div>
    </article>
  );
}
```

**ID pattern for accessible labelling:**
Since multiple ProjectCard instances appear on the same page, each needs a unique ID for `aria-labelledby`:
```tsx
import { useId } from 'react';

function ProjectCard({ title, ... }) {
  const id = useId();
  return (
    <article aria-labelledby={`${id}-title`} tabIndex={0}>
      <h3 id={`${id}-title`}>{title}</h3>
    </article>
  );
}
```

---

## SECTION 11 — DO / DON'T

| ✅ Do | ❌ Don't |
|---|---|
| Use `<article>` as the root element — each card is a self-contained CMS entity | Use `<div>` as the root — screen readers cannot identify article boundaries |
| Clamp `card-title` at 2 lines with `-webkit-line-clamp: 2` | Apply single-line `white-space: nowrap` to the title — it must wrap before truncating |
| Let `card-subtitle` wrap freely — apply no truncation | Truncate the subtitle — the component intentionally shows full context |
| Apply `aria-label="Open ${title}"` to the "Open" CTA button | Leave the "Open" button with only its visible text — "Open" is ambiguous when multiple cards are on screen |
| Render `card-hover-footer` as `position:absolute` overlaying `card-footer` | Render it as a flex sibling of `card-footer` — it will push card height up instead of overlaying |
| Use `outline` + `outline-offset: 2px` for the focus ring | Create a DOM node for the focus ring — it is a CSS concern only |
| Pass stat data as `children` (`bodySlot`) | Hardcode the stat grid inside ProjectCard — the body is a slot, not a fixed template |
| Set `overflow: hidden` on the root card | Forget it — the absolute `card-hover-footer` will overflow the border-radius without it |
| Use rem for all spacing and font-size | Use px for font-size — browser zoom (WCAG 1.4.4) requires rem for text to scale correctly |

---

## SECTION 12 — RELATED COMPONENTS

| Component | Relationship | Use ProjectCard when | Use the other when |
|---|---|---|---|
| `Card/Generic` | Sibling — same zone architecture | Entity is a Contentstack CMS entry/content type with stats | Entity is a non-CMS data entity with arbitrary metadata fields |
| `Card/Assets` | Sibling — different visual treatment | Entity has no primary media thumbnail | Entity is a media file (image, video, document) that benefits from a visual preview |
| `Card/Launch` | Sibling — environment context | Entity is a CMS entry/space | Entity is a deployment environment with URL, branch, and build time |
| `Card/Personalize` | Sibling — experience context | Standard CMS entry display | Entity is a personalization experience with active experience + audience counts |
| `Card/Automation` | Sibling — workflow context | Standard CMS entry display | Entity is an automation workflow with trigger/action metadata |
| `Badge` | Child atom | Always — Badge is consumed inside ProjectCard for `hasStatus` | As a standalone status indicator outside of a card |
| `IconButton` | Child atom | Always — used for footer-fav-btn and footer-more-btn | As a standalone action button outside of a card |
| `Button` | Child atom | Always — used for footer-primary-action "Open" | As a standalone primary action outside of a card |
