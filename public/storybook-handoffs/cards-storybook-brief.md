# Cards — Storybook Brief
## Venus 2.1 RF · 📄 Content Page
**Version:** 1.0.0 · **Status:** Active · **Date:** 2026-07-07  
**Figma file:** `M6u9MVznfNDO20b0DAC1cu`

---

## 1. Purpose

The Card system is the primary navigation and entity-browsing primitive across all Contentstack product surfaces. Cards represent discrete objects — stacks, automations, assets, deployments, personalization projects — and give users the information they need to identify, assess, and enter a product context in under two seconds.

Every card type shares an identical shell architecture. Only the body slot content and default prop values differ between card types. This means a single `BaseCard` shell component powers all seven variants, with slot content injected per product context.

---

## 2. Anatomy

All cards share this fixed zone structure, top to bottom:

```
┌──────────────────────────────────────────┐
│  card-header    fixed 88px               │
│    card-title     Heading/XS, max 2 lines│
│    card-subtitle-row                      │
│      [card-subtitle-icon]  optional      │
│      card-subtitle         FILL          │
│      [card-status-badge]   optional      │
├──────────────────────────────────────────┤
│  card-divider   1px border/default       │
├──────────────────────────────────────────┤
│  card-body-slot FILL — dynamic content   │
├──────────────────────────────────────────┤
│  card-meta      33px fixed               │
│    meta-left    editable text            │
│    meta-right   editable text / timestamp│
├──────────────────────────────────────────┤
│  [card-footer]  48px, surface/card/action│
│    footer-fav-btn   (optional)           │
│    footer-spacer    FILL                 │
│    footer-more-btn  (optional)           │
│    footer-primary   (optional)           │
│  [card-hover-footer] ABSOLUTE, overlay   │
│    — same controls, surface/hover-overlay│
│    — Glass/Frosted blur effect           │
└──────────────────────────────────────────┘
```

**Zone rules:**
- `card-header` is always 88px fixed — title reserves 2-line space regardless of content length
- `card-body-slot` is FILL — grows to consume remaining vertical space
- `card-footer` and `card-hover-footer` are mutually exclusive via `hasFooter` / `hasHoverActions`
- `card-hover-footer` is ABSOLUTE positioned at card bottom — CSS `opacity: 0 → 1` on hover, no layout shift
- Card width: **296px** fixed. Card height: **272px** fixed (HUG when no footer)

---

## 3. TypeScript Props Interface

```typescript
// Shared base props — all card types
interface BaseCardProps {
  /** Visual interaction state */
  state?: 'default' | 'hover';

  /** Card title — max 2 lines, ellipsis overflow */
  title: string;

  /** Subtitle text — appears below title */
  subtitle?: string;

  /** Show decorative icon to the left of subtitle */
  hasSubtitleIcon?: boolean;

  /** Show status badge to the right of subtitle */
  hasStatus?: boolean;

  /** Status badge label — e.g. "Live", "Building", "Failed" */
  statusText?: string;

  /** Status badge visual intent */
  statusIntent?: 'success' | 'warning' | 'error' | 'neutral' | 'info';

  /** Left meta field — e.g. "17 users" */
  metaLeft?: string;

  /** Right meta field — e.g. "2h ago", "Apr 10, 2026" */
  metaRight?: string;

  /** Show persistent action footer */
  hasFooter?: boolean;

  /** Show frosted glass overlay action bar (hover-only reveal) */
  hasHoverActions?: boolean;

  /** Show favourite star button in footer */
  showFavourite?: boolean;

  /** Show primary CTA button in footer */
  showOpenCTA?: boolean;

  /** Label for primary CTA — defaults to "Open" */
  ctaLabel?: string;

  /** Show more actions (⋯) button in footer */
  showMoreActions?: boolean;

  /** Show 2px focus ring (controlled by JS, not CSS :focus) */
  hasFocus?: boolean;

  /** Body slot — inject any React node */
  children?: React.ReactNode;
}

// Card/CMS — extends base with fixed stat grid
interface CardCMSProps extends BaseCardProps {
  typeCount?: number;       // Types stat
  entryCount?: number;      // Entries stat
  envCount?: number;        // Environments stat
}

// Card/Generic — fully open slot
interface CardGenericProps extends BaseCardProps {}

// Card/Automation
interface CardAutomationProps extends BaseCardProps {
  agentCount?: number;
  automationCount?: number;
  connectedAppCount?: number;
}

// Card/Personalize
interface CardPersonalizeProps extends BaseCardProps {
  activeExperienceCount?: number;
  audienceCount?: number;
}

// Card/Launch
interface CardLaunchProps extends BaseCardProps {
  deploymentUrl?: string;
  framework?: string;
  branch?: string;
  buildTime?: string;
}

// Card/Assets
interface CardAssetsProps extends BaseCardProps {
  viewMode?: 'collage' | 'cover' | 'empty';
  images?: string[];        // Array of image URLs for collage (4) or cover (1)
  assetCount?: number;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Type | Notes |
|---|---|---|---|
| `State` | `state` | VARIANT | `default` / `hover` |
| `title` | `title` | TEXT | Max 2 lines, ellipsis |
| `subtitle` | `subtitle` | TEXT | Optional |
| `hasSubtitleIcon` | `hasSubtitleIcon` | BOOLEAN | Default varies per card |
| `hasStatus` | `hasStatus` | BOOLEAN | Default: false |
| `statusText` | `statusText` | TEXT | Default: "Live" |
| `metaLeft` | `metaLeft` | TEXT | Empty on Launch/Personalize/Assets |
| `metaRight` | `metaRight` | TEXT | Relative or static date |
| `hasFooter` | `hasFooter` | BOOLEAN | Default varies per card |
| `hasHoverActions` | `hasHoverActions` | BOOLEAN | Default varies per card |
| `showFavourite` | `showFavourite` | BOOLEAN | Default varies per card |
| `showOpenCTA` | `showOpenCTA` | BOOLEAN | Default varies per card |
| `showMoreActions` | `showMoreActions` | BOOLEAN | Default varies per card |
| `hasFocus` | `hasFocus` | BOOLEAN | Default: false |
| `bodySlot` | `children` | SLOT | React children |
| `ViewMode` (Assets only) | `viewMode` | VARIANT | `collage` / `cover` / `empty` |

---

## 5. State Behaviour

### Interaction states

| State | Border | Elevation | Notes |
|---|---|---|---|
| Default | `border/strong` 1px | none | Resting state |
| Hover | `border/brand` 2px | `Elevation/Level 2 — Dropdown` | CSS `:hover` on card root |
| Focused | `focus/ring/color` 2px focus ring | none | `hasFocus=true` |

### Footer behaviour

| `hasFooter` | `hasHoverActions` | Result |
|---|---|---|
| `true` | `false` | Persistent footer always visible |
| `false` | `true` | Frosted glass overlay rises from bottom on hover |
| `true` | `true` | Both present — persistent footer + overlay on hover |
| `false` | `false` | No footer, no overlay |

### Hover footer
- CSS `opacity: 0` at rest, `opacity: 1` on card hover
- No layout shift — ABSOLUTE positioned, does not affect card height
- Fill: `surface/hover-overlay` (`purple/500-a16` Light / `purple/500-a12` Dark)
- Effect: `Glass/Frosted` — 8px background blur

### Status badge
- Hidden by default (`hasStatus=false`)
- When visible: sits in subtitle row, right-aligned
- Uses system `Badge` component: `Type=label, leadingSlot=dot, size=sm`
- `intent` prop controls colour: `success`=Live, `warning`=Building, `error`=Failed, `neutral`=Inactive

---

## 6. Card Specifications — Per Type

### Card/CMS
- **Node:** `1225:95934` · **Variants:** 2 (State=Default/Hover)
- **Purpose:** Contentstack CMS stack navigation card
- **Body slot:** 3-column stat grid — Types / Entries / Envs
- **Defaults:** `hasFooter=true`, `showFavourite=true`, `showOpenCTA=true` (label: "Open"), `showMoreActions=true`
- **Meta:** left=users, right=relative timestamp ("2h ago")
- **Hover bar:** frosted glass (`surface/hover-overlay` + `Glass/Frosted`)

### Card/Generic
- **Node:** `1225:96029` · **Variants:** 2
- **Purpose:** Generic entity card — fully open slot for any content type
- **Body slot:** Empty — accepts any React node as `children`
- **Defaults:** `hasFooter=false`, `showFavourite=true`, `showOpenCTA=true`, `showMoreActions=true`
- **Meta:** left=`metaLeft` (editable), right=`metaRight` (editable)
- **Note:** Use this as the base for any product card not listed here

### Card/Automation
- **Node:** `1230:96225` · **Variants:** 2
- **Purpose:** Automation project navigation card
- **Body slot:** 3-column stat grid — Agents / Automations / Connected Apps
- **Defaults:** `hasFooter=true`, `showFavourite=true`, `showOpenCTA=true` (label: "Open"), `showMoreActions=true`
- **Meta:** left=users, right=static date ("Apr 10, 2026")

### Card/Personalize
- **Node:** `1230:96537` · **Variants:** 2
- **Purpose:** Personalize product navigation card — shows stack connection status
- **Body slot:** 2-column stat grid — Active Experiences / Audiences
- **Defaults:** `hasFooter=false`, `hasSubtitleIcon=true`, `showFavourite=false`, `showOpenCTA=false`, `showMoreActions=false`
- **Meta:** left="" (empty), right=static date
- **Subtitle icon:** stack layers icon — always visible, indicates stack connection context
- **Status badge:** typically shown — "Not connected" / "Connected with no access"

### Card/Launch
- **Node:** `1231:96715` · **Variants:** 2
- **Purpose:** Launch hosting deployment card
- **Body slot:** 3-row data layout — URL / Framework+Branch / Build time
- **Defaults:** `hasFooter=true`, `hasSubtitleIcon=true`, `showFavourite=false`, `showOpenCTA=true` (label: "Open Site"), `showMoreActions=true`
- **Meta:** left="" (empty), right=static date
- **Status badge:** always recommended — Live / Building / Failed / Inactive

### Card/Assets
- **Node:** `1233:99466` · **Variants:** 6 (State=Default/Hover × ViewMode=Collage/Cover/Empty)
- **Purpose:** DAM asset folder/collection browsing card
- **Body slot:** Visual — controlled by `viewMode` prop
  - `collage` — 2×2 CSS Grid of image slots
  - `cover` — single full-bleed cover image
  - `empty` — `surface/sunken` background + Tertiary "+ Add Assets" button
- **Defaults:** `hasFooter=false`, `hasHoverActions=true`, `showFavourite=false`, `showOpenCTA=false`, `showMoreActions=true`
- **Hover bar:** frosted glass overlay over image — `surface/hover-overlay` + `Glass/Frosted`
- **Meta:** left="" (empty), right=relative timestamp

---

## 7. Token Reference

### Surface tokens
| Token | Value (Light) | Value (Dark) | Usage |
|---|---|---|---|
| `surface/raised` | `gray/0` #FFFFFF | — | Card body fill |
| `surface/card/action` | `purple/50` #F9F8FF | `purple/700` | Persistent footer fill |
| `surface/hover-overlay` | `purple/500-a16` | `purple/500-a12` | Hover footer fill |
| `surface/sunken` | `gray/100` #F3F4F6 | — | Assets empty state bg |

### Border tokens
| Token | Usage |
|---|---|
| `border/strong` | Default card border (1px) |
| `border/brand` | Hover card border (2px) |
| `border/default` | card-divider, stat-grid, stat-cell dividers |

### Spacing tokens (all `space/*` primitives)
| Property | Token | Value |
|---|---|---|
| Header padding | `space/16` | 16px top/left/right, `space/12` bottom |
| Header gap (title↔subtitle) | `space/4` | 4px |
| Subtitle row gap | `space/8` | 8px |
| Body slot padding | `space/8` | 8px top/bottom (Assets: 0) |
| Body slot gap | `space/8` | 8px |
| Stat cell padding | `space/16` top/bottom, `space/8` left/right | |
| Stat cell gap | `space/4` | 4px |
| Meta padding | `space/16` left/right, `space/8` top/bottom | |
| Footer padding | `space/12` left/right, `space/8` top/bottom | |

### Radius tokens (`radius/*` primitives)
| Layer | Token | Value |
|---|---|---|
| Card root | `radius/12` | 12px |
| Stat grid | `radius/8` | 8px |
| Focus ring | 14px (hardcoded — no `radius/14` token) | card radius + 2 |

### Effect styles
| Style | Usage |
|---|---|
| `Elevation/Level 2 — Dropdown` | State=Hover card elevation |
| `Glass/Frosted` | card-hover-footer blur |

### Typography styles (all `Venus_Typography`)
| Layer | Style | Size | Weight |
|---|---|---|---|
| card-title | `Heading/XS` | 14px | Medium |
| card-subtitle | `Body/XS` | 12px | Regular |
| stat-value | `Label/LG` | 13px | Medium |
| stat-label | `Body/XS` | 12px | Regular |
| meta-text | `Body/XS` | 12px | Regular |
| Launch row-label | `Body/XS` | 12px | Regular (muted) |
| Launch row-value | `Body/XS` | 12px | Regular (default) |

---

## 8. Accessibility

### Focus management
- `hasFocus=true` shows a 2px `focus/ring/color` ring at `x=-2, y=-2`
- Focus ring radius = card radius + 2 = 14px
- Focus ring constraints: STRETCH horizontal + vertical — resizes with card
- In CSS: use `outline` on `:focus-visible`, not `box-shadow`

### Keyboard navigation
- Card root is a `<article>` with `role="article"` or `<a>` for pure navigation cards
- Footer buttons are Tab-reachable: `footer-fav-btn` → `footer-more-btn` → `footer-primary-action`
- Hover overlay must be reachable via keyboard — not opacity-gated without a JS focus handler

### ARIA
```html
<article
  aria-label="{title}"
  tabIndex="0"
  role="article"
>
  <!-- card content -->
  <footer aria-label="Card actions">
    <button aria-label="Favourite {title}">★</button>
    <button aria-label="More actions for {title}">⋯</button>
    <button>Open</button>
  </footer>
</article>
```

### Contrast
| Text pair | Ratio | Status |
|---|---|---|
| `text/default` on `surface/raised` | 15.3:1 | ✅ AAA |
| `text/subtle` on `surface/raised` | 4.7:1 | ✅ AA |
| `text/muted` on `surface/raised` | 3.1:1 | ✅ AA (large) |
| Hover bar icons on `surface/hover-overlay` | ≥ 3:1 | ✅ AA |

### Touch targets
- All footer buttons are `Icon Button/Ghost/md` — 32px touch target ✅
- Card body click target: entire card (296×272px) ✅

---

## 9. Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { CardCMS, CardGeneric, CardAutomation, CardPersonalize, CardLaunch, CardAssets } from './Cards';
import { StatGrid } from './StatGrid';

// ── CARD/CMS ──────────────────────────────────────────────
const cmsMetа: Meta<typeof CardCMS> = {
  title: 'Content/Card/CMS',
  component: CardCMS,
  argTypes: {
    state: { control: 'radio', options: ['default', 'hover'] },
    hasFooter: { control: 'boolean' },
    hasHoverActions: { control: 'boolean' },
    showFavourite: { control: 'boolean' },
    showOpenCTA: { control: 'boolean' },
    showMoreActions: { control: 'boolean' },
    hasStatus: { control: 'boolean' },
    statusText: { control: 'text' },
    statusIntent: { control: 'radio', options: ['success','warning','error','neutral','info'] },
  },
};

export const CMSDefault: StoryObj<typeof CardCMS> = {
  args: {
    title: 'Marketing Hub',
    subtitle: 'CMS stack',
    metaLeft: '42 users',
    metaRight: '2h ago',
    typeCount: 104,
    entryCount: 2400,
    envCount: 3,
    hasFooter: true,
    showFavourite: true,
    showOpenCTA: true,
    showMoreActions: true,
  },
};

export const CMSHoverState: StoryObj<typeof CardCMS> = {
  args: { ...CMSDefault.args, state: 'hover' },
};

export const CMSWithStatus: StoryObj<typeof CardCMS> = {
  args: {
    ...CMSDefault.args,
    hasStatus: true,
    statusText: 'Live',
    statusIntent: 'success',
  },
};

export const CMSLongTitle: StoryObj<typeof CardCMS> = {
  args: {
    ...CMSDefault.args,
    title: 'Global Brand Portal — North America and EMEA Territories',
    subtitle: 'CMS stack · 12 locales',
  },
};

export const CMSNoFooter: StoryObj<typeof CardCMS> = {
  args: { ...CMSDefault.args, hasFooter: false },
};

export const CMSHoverActions: StoryObj<typeof CardCMS> = {
  args: { ...CMSDefault.args, hasFooter: false, hasHoverActions: true },
};

// ── CARD/GENERIC ──────────────────────────────────────────
export const GenericEmpty: StoryObj<typeof CardGeneric> = {
  args: {
    title: 'My Project',
    subtitle: 'Custom type',
    metaLeft: '5 users',
    metaRight: 'Today',
  },
};

export const GenericWithContent: StoryObj<typeof CardGeneric> = {
  args: {
    ...GenericEmpty.args,
    hasFooter: true,
    showOpenCTA: true,
    children: <StatGrid stats={[{ value: '12', label: 'Items' }, { value: '3', label: 'Tags' }]} />,
  },
};

// ── CARD/AUTOMATION ───────────────────────────────────────
export const AutomationDefault: StoryObj<typeof CardAutomation> = {
  args: {
    title: 'AutomateAgent',
    subtitle: 'Automation',
    metaLeft: '1 User',
    metaRight: 'Apr 10, 2026',
    agentCount: 4,
    automationCount: 1,
    connectedAppCount: 1,
    hasFooter: true,
    showOpenCTA: true,
    showMoreActions: true,
  },
};

export const AutomationEmpty: StoryObj<typeof CardAutomation> = {
  args: { ...AutomationDefault.args, agentCount: 0, automationCount: 0, connectedAppCount: 0 },
};

// ── CARD/PERSONALIZE ──────────────────────────────────────
export const PersonalizeConnected: StoryObj<typeof CardPersonalize> = {
  args: {
    title: 'personalize11Aug',
    subtitle: 'Stack: Not connected',
    hasSubtitleIcon: true,
    metaRight: 'Aug 11, 2025',
    activeExperienceCount: 2,
    audienceCount: 1,
  },
};

export const PersonalizeWithStatus: StoryObj<typeof CardPersonalize> = {
  args: {
    ...PersonalizeConnected.args,
    subtitle: 'Stack: ⚠️ Connected with no access',
    hasStatus: true,
    statusText: 'Warning',
    statusIntent: 'warning',
  },
};

// ── CARD/LAUNCH ───────────────────────────────────────────
export const LaunchLive: StoryObj<typeof CardLaunch> = {
  args: {
    title: 'NotchNook-1 2 5',
    subtitle: 'Default',
    hasSubtitleIcon: true,
    hasStatus: true,
    statusText: 'Live',
    statusIntent: 'success',
    deploymentUrl: 'notchnook.contentstack.app',
    framework: 'Next.js',
    branch: 'main',
    buildTime: '45s',
    metaRight: 'Sep 22, 2025',
    hasFooter: true,
    showOpenCTA: true,
    ctaLabel: 'Open Site',
    showMoreActions: true,
  },
};

export const LaunchBuilding: StoryObj<typeof CardLaunch> = {
  args: { ...LaunchLive.args, statusText: 'Building', statusIntent: 'warning' },
};

export const LaunchFailed: StoryObj<typeof CardLaunch> = {
  args: { ...LaunchLive.args, statusText: 'Failed', statusIntent: 'error' },
};

// ── CARD/ASSETS ───────────────────────────────────────────
export const AssetsCollage: StoryObj<typeof CardAssets> = {
  args: {
    title: 'Lukky Baby',
    subtitle: '6 Assets',
    viewMode: 'collage',
    images: ['/img/asset1.jpg','/img/asset2.jpg','/img/asset3.jpg','/img/asset4.jpg'],
    metaRight: '10m ago',
    hasHoverActions: true,
    showMoreActions: true,
  },
};

export const AssetsCover: StoryObj<typeof CardAssets> = {
  args: { ...AssetsCollage.args, viewMode: 'cover', images: ['/img/asset1.jpg'] },
};

export const AssetsEmpty: StoryObj<typeof CardAssets> = {
  args: {
    title: 'Benben Partners',
    subtitle: '0 Assets',
    viewMode: 'empty',
    metaRight: '10m ago',
    hasHoverActions: true,
  },
};

// ── GRID CONTEXT ──────────────────────────────────────────
export const CMSCardGrid: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 296px)', gap: '20px', padding: '40px', background: '#F3F4F6' }}>
      <CardCMS title="Marketing Hub"     subtitle="CMS stack"             typeCount={104} entryCount={2400} envCount={3}  metaLeft="42 users" metaRight="2h ago"    hasFooter showOpenCTA showMoreActions showFavourite />
      <CardCMS title="E-Commerce APAC"   subtitle="CMS stack · 6 locales" typeCount={56}  entryCount={1200} envCount={2}  metaLeft="18 users" metaRight="Yesterday" hasFooter showOpenCTA showMoreActions showFavourite />
      <CardCMS title="Developer Docs"    subtitle="CMS stack"             typeCount={12}  entryCount={88}   envCount={1}  metaLeft="3 users"  metaRight="3 days ago"            />
      <CardCMS title="Global Brand Portal — North America and EMEA" subtitle="CMS stack · 12 locales" typeCount={210} entryCount={8700} envCount={4} metaLeft="94 users" metaRight="Just now" hasFooter showOpenCTA showMoreActions showFavourite />
      <CardCMS title="Tabs Demo"         subtitle="CMS stack"             typeCount={29}  entryCount={33}   envCount={1}  metaLeft="17 users" metaRight="5 days ago" hasFooter showOpenCTA showMoreActions showFavourite />
    </div>
  ),
  parameters: { layout: 'fullscreen' },
};
```

---

## 10. Implementation Notes

### Shell architecture
The card system uses a single `BaseCard` shell component accepting typed slot content per product:

```typescript
// BaseCard shell — shared by all card types
const BaseCard = ({
  state = 'default',
  title,
  subtitle,
  hasSubtitleIcon = false,
  hasStatus = false,
  statusText = 'Live',
  statusIntent = 'success',
  metaLeft = '',
  metaRight,
  hasFooter = false,
  hasHoverActions = false,
  showFavourite = true,
  showOpenCTA = true,
  ctaLabel = 'Open',
  showMoreActions = true,
  hasFocus = false,
  children,
}: BaseCardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <article
      className={cn('card', state === 'hover' || isHovered ? 'card--hover' : '')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={title}
      tabIndex={0}
    >
      {/* Header zone */}
      <header className="card__header">
        <h3 className="card__title">{title}</h3>
        <div className="card__subtitle-row">
          {hasSubtitleIcon && <SubtitleIcon />}
          <span className="card__subtitle">{subtitle}</span>
          {hasStatus && <Badge intent={statusIntent} label={statusText} leadingSlot="dot" size="sm" />}
        </div>
      </header>

      <hr className="card__divider" />

      {/* Body slot */}
      <div className="card__body">{children}</div>

      {/* Meta zone */}
      <div className="card__meta">
        {metaLeft && <span className="card__meta-left">{metaLeft}</span>}
        {metaRight && <span className="card__meta-right">{metaRight}</span>}
      </div>

      {/* Persistent footer */}
      {hasFooter && (
        <footer className="card__footer">
          {showFavourite  && <IconButton icon={<StarIcon />} aria-label={`Favourite ${title}`} type="ghost" size="md" />}
          <span className="card__footer-spacer" />
          {showMoreActions && <IconButton icon={<DotsThreeVerticalIcon />} aria-label={`More actions for ${title}`} type="ghost" size="md" />}
          {showOpenCTA    && <Button type="primary" size="md">{ctaLabel}</Button>}
        </footer>
      )}

      {/* Hover overlay footer */}
      {hasHoverActions && (
        <footer className={cn('card__hover-footer', isHovered ? 'card__hover-footer--visible' : '')}>
          {showFavourite  && <IconButton icon={<StarIcon />} aria-label={`Favourite ${title}`} type="ghost" size="md" />}
          <span className="card__footer-spacer" />
          {showMoreActions && <IconButton icon={<DotsThreeVerticalIcon />} aria-label={`More actions for ${title}`} type="ghost" size="md" />}
          {showOpenCTA    && <Button type="primary" size="md">{ctaLabel}</Button>}
        </footer>
      )}

      {/* Focus ring */}
      {hasFocus && <div className="card__focus-ring" aria-hidden />}
    </article>
  );
};
```

### CSS custom properties
```css
.card {
  width: 296px;
  border-radius: var(--radius-12);       /* radius/12 */
  border: 1px solid var(--border-strong);
  background: var(--surface-raised);
  position: relative;
  overflow: hidden;
}

.card--hover {
  border: 2px solid var(--border-brand);
  box-shadow: var(--elevation-level-2-dropdown);
}

.card:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
  border-radius: calc(var(--radius-12) + 2px);
}

.card__header      { padding: 16px 16px 12px; display: flex; flex-direction: column; gap: 4px; height: 88px; }
.card__title       { font: var(--typography-heading-xs); color: var(--text-default); -webkit-line-clamp: 2; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; }
.card__subtitle-row{ display: flex; align-items: center; gap: 8px; }
.card__subtitle    { font: var(--typography-body-xs); color: var(--text-subtle); flex: 1; }
.card__divider     { border: none; border-top: 1px solid var(--border-default); margin: 0; }
.card__body        { flex: 1; padding: 8px; }
.card__meta        { height: 33px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; font: var(--typography-body-xs); color: var(--text-subtle); }

.card__footer,
.card__hover-footer {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: var(--surface-card-action);  /* card__footer */
}

.card__hover-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface-hover-overlay); /* purple/500-a16 */
  backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 150ms ease;
}

.card:hover .card__hover-footer,
.card__hover-footer--visible {
  opacity: 1;
}

.card__footer-spacer { flex: 1; }
```

### Assets card — image grid
```css
.card__collage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  height: 100%;
}

.card__image-slot {
  background: var(--surface-sunken);
  object-fit: cover;
  width: 100%;
  height: 100%;
}

/* 3-image layout — span first image across full width */
.card__collage--3 .card__image-slot:first-child {
  grid-column: span 2;
}
```

### Dark mode
All tokens have verified Dark mode aliases in Venus_Semantics. Toggle `data-theme="dark"` on root `<html>`.

---

## 11. Do / Don't

### ✅ Do
- Use the correct card type for its product context — don't use `Card/Generic` where `Card/CMS` exists
- Set `hasFooter=false` and `hasHoverActions=true` for browsing/navigation contexts (Assets)
- Set `hasFooter=true` with a named CTA for task-oriented contexts (Automation, Launch)
- Use relative timestamps ("2h ago") for CMS/Assets cards; static dates for Automation/Launch/Personalize
- Show `hasStatus` badge whenever the entity has a meaningful operational state (Launch, Personalize)
- Use `metaLeft` for user context ("42 users"), leave empty when not applicable
- Keep titles to 1-2 lines in production data — the 2-line reserve is for long names, not the default
- Inject slot content via `children` — never override individual stat values via CSS

### ❌ Don't
- Don't use `Card/CMS` for non-CMS stack entities — use the correct typed card
- Don't hardcode colours, spacing, or radius outside the token system
- Don't add new card types without a matching CSET in the Figma file and an entry in the constitution
- Don't use `hasFooter=true` AND `hasHoverActions=true` simultaneously unless you have a specific interaction reason — this creates two competing action surfaces
- Don't show `showFavourite` on cards that don't support favouriting in the product
- Don't truncate stat values to single digits for display — use "2.4k", "8.7k" etc.
- Don't bypass the `BaseCard` shell — all cards must share the same zone structure

---

## 12. Related Components

| Component | Relationship |
|---|---|
| `Badge` | Used for `card-status-badge` — `intent` prop controls status colour |
| `Button/Primary` | Used for `footer-primary-action` — "Open" / "Open Site" CTA |
| `Icon Button/Ghost/md` | Used for `footer-fav-btn` and `footer-more-btn` |
| `_Internal/Icon-Wrapper` | Icon placeholder inside footer icon buttons |
| `surface/hover-overlay` | Venus_Semantics token — `purple/500-a16` Light, `purple/500-a12` Dark |
| `surface/card/action` | Venus_Semantics token — `purple/50` Light, `purple/700` Dark |
| `Glass/Frosted` | Effect style — 8px background blur — paired with hover bar |
| `Elevation/Level 2 — Dropdown` | Effect style — card hover elevation |
| `Table/Data-Table` | Alternative list view for the same entity data |
| `Pagination` | Used in grid context when cards exceed one viewport |

---

*Brief complete. Version 1.0.0. Built 2026-07-07.*
