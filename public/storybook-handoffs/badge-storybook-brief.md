# Storybook Engineering Brief — Badge
**Venus 2.1 RF | Version 1.0.0 | Status: Active | Date: 2026-06-02**
**Figma:** `836:5610` · Page: 💬 Feedback & Status

---

## 1. Purpose

`Badge` communicates a system-assigned attribute or status attached to a piece of content. It answers the question *"what is this?"* or *"what state is this in?"*.

Badge is **non-interactive**. It has no hover state, no focus ring, no click handler. It renders as a `<span>` — a passive descriptor. The system owns its state. The user cannot dismiss, toggle, or remove a Badge.

**Use for:** publish status (Published, Draft, Scheduled, Archived), entity classification (Beta, New, Pro, Deprecated), system-assigned labels, feature flags.

**Do NOT use for:**
- Numeric notification counts → `Badge/Counter`
- User-applied filters or taxonomy labels → `Tag`
- Any context where the user needs to interact with the element → `Tag`

---

## 2. Anatomy

```
badge-root                        FRAME — horizontal auto-layout, full pill (radius 9999)
  badge-leading-dot-wrap          FRAME — transparent wrapper, dotSize × 13px (dot slot only)
    dot-shape                     ELLIPSE — filled circle, intent dot colour
  badge-leading-icon-wrap         FRAME — transparent wrapper, 12 × 13px (icon slot only)
    badge-leading-icon            INSTANCE — _Internal/Icon-Wrapper/Size=12px
  badge-label                     TEXT — Label/XS (sm) | Label/SM (md) | Label/MD (lg)
```

**On the wrapper frames:** `badge-leading-dot-wrap` and `badge-leading-icon-wrap` are transparent zero-stroke frames. They exist solely to correct optical cap-height alignment of the dot/icon against the text node in horizontal auto-layout. They carry no visual properties. Do not remove them — removal will cause the dot/icon to sit optically low relative to the text baseline.

---

## 3. TypeScript Props Interface

```typescript
export interface BadgeProps {
  /**
   * Structural type of the badge.
   * - `label`: Text badge with optional leading dot or icon. Default and most common.
   * - `dot`: Presence-only indicator. No text. Requires `aria-label`.
   * @default 'label'
   */
  type?: 'label' | 'dot';

  /**
   * Semantic colour intent.
   * Drives the badge/[intent]/* Venus_Components token triad: surface, border, text, dot.
   * @default 'neutral'
   */
  intent?: 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';

  /**
   * Size of the badge. Only applies when type='label'.
   * - `sm`: 20px height. Tight table rows, sidebar nav items.
   * - `md`: 24px height. Standard content areas, card footers. DEFAULT.
   * - `lg`: 28px height. Prominent status in page headers, empty states.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Leading slot content. Mutually exclusive — only one value may be active.
   * - `none`: Text only.
   * - `dot`: 5–6px filled circle in intent colour. Reinforces semantic status.
   * - `icon`: 12px icon instance. Use for contextual meaning (lock, check, sparkles).
   * Only meaningful when type='label'. Ignored for type='dot'.
   * @default 'none'
   */
  leadingSlot?: 'none' | 'dot' | 'icon';

  /**
   * Icon to render in the leading slot.
   * Only rendered when leadingSlot='icon'. Ignored otherwise.
   */
  icon?: React.ReactNode;

  /**
   * Text label. Only applies when type='label'.
   * Keep to 1–3 words maximum.
   */
  children?: string;

  /**
   * Accessible label for screen readers.
   * REQUIRED when type='dot' (no visible text).
   * Recommended for type='label' to add role context:
   * e.g. aria-label="Content status: Published"
   */
  'aria-label'?: string;

  /** Additional CSS class names. */
  className?: string;
}
```

---

## 4. Figma Variant → Prop Mapping

| Figma Variant / Property | React Prop | Notes |
|---|---|---|
| `Type=label` | `type="label"` | Default |
| `Type=dot` | `type="dot"` | No text rendered |
| `size=sm` | `size="sm"` | — |
| `size=md` | `size="md"` | Default |
| `size=lg` | `size="lg"` | — |
| `leadingSlot=none` | `leadingSlot="none"` | Default |
| `leadingSlot=dot` | `leadingSlot="dot"` | — |
| `leadingSlot=icon` | `leadingSlot="icon"` + `icon={<Icon />}` | — |
| `intent=neutral` | `intent="neutral"` | Default |
| `intent=brand` | `intent="brand"` | — |
| `intent=success` | `intent="success"` | — |
| `intent=warning` | `intent="warning"` | — |
| `intent=error` | `intent="error"` | — |
| `intent=info` | `intent="info"` | — |
| `label` text property | `children` | — |

---

## 5. Token Bindings

| Layer | Property | Token | Resolves to (via semantics) |
|---|---|---|---|
| `badge-root` | fill | `badge/[intent]/surface` | `feedback/[intent]/surface` or `surface/*` |
| `badge-root` | stroke | `badge/[intent]/border` | `feedback/[intent]/border` or `border/*` |
| `dot-shape` | fill | `badge/[intent]/dot` | `border/[intent]` |
| `badge-leading-icon` | fill | `icon/color` via Venus_Icons mode | intent-matched icon mode |
| `badge-label` | fill | `badge/[intent]/text` | `text/[intent]` |
| `badge-label` | text style | `Label/XS` (sm) / `Label/SM` (md) / `Label/MD` (lg) | Inter 11–12px |

**Token alias chain:** `Venus_Components badge/*` → `Venus_Semantics` → `_Primitives color/*`

---

## 6. CSS Implementation

```css
/* ─── Badge component tokens ─────────────────────────── */
:root[data-theme="light"] {
  --badge-neutral-surface: var(--surface-default);
  --badge-neutral-border:  var(--border-default);
  --badge-neutral-text:    var(--text-subtle);
  --badge-neutral-dot:     var(--border-strong);

  --badge-brand-surface:   var(--surface-selected);
  --badge-brand-border:    var(--border-brand);
  --badge-brand-text:      var(--text-brand);
  --badge-brand-dot:       var(--border-brand);

  --badge-success-surface: var(--feedback-success-surface);
  --badge-success-border:  var(--feedback-success-border);
  --badge-success-text:    var(--text-success);
  --badge-success-dot:     var(--border-success);

  --badge-warning-surface: var(--feedback-warning-surface);
  --badge-warning-border:  var(--feedback-warning-border);
  --badge-warning-text:    var(--text-warning);
  --badge-warning-dot:     var(--border-warning);

  --badge-error-surface:   var(--feedback-error-surface);
  --badge-error-border:    var(--feedback-error-border);
  --badge-error-text:      var(--text-destructive);
  --badge-error-dot:       var(--border-destructive);

  --badge-info-surface:    var(--feedback-info-surface);
  --badge-info-border:     var(--feedback-info-border);
  --badge-info-text:       var(--text-info);
  --badge-info-dot:        var(--border-info);
}

/* ─── Base ────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 0.5px solid;
  font-family: var(--font-inter);
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
  white-space: nowrap;
  cursor: default;
  user-select: none;
}

/* sizes */
.badge--sm { height: 20px; padding: 0 8px;  font-size: 11px; gap: 4px; }
.badge--md { height: 24px; padding: 0 9px;  font-size: 12px; gap: 5px; }
.badge--lg { height: 28px; padding: 0 10px; font-size: 12px; gap: 5px; font-weight: 500; }

/* intents */
.badge--neutral { background: var(--badge-neutral-surface); border-color: var(--badge-neutral-border); color: var(--badge-neutral-text); }
.badge--brand   { background: var(--badge-brand-surface);   border-color: var(--badge-brand-border);   color: var(--badge-brand-text); }
.badge--success { background: var(--badge-success-surface); border-color: var(--badge-success-border); color: var(--badge-success-text); }
.badge--warning { background: var(--badge-warning-surface); border-color: var(--badge-warning-border); color: var(--badge-warning-text); }
.badge--error   { background: var(--badge-error-surface);   border-color: var(--badge-error-border);   color: var(--badge-error-text); }
.badge--info    { background: var(--badge-info-surface);    border-color: var(--badge-info-border);    color: var(--badge-info-text); }

/* leading dot */
.badge__dot {
  flex-shrink: 0;
  border-radius: 50%;
}
.badge--sm .badge__dot { width: 5px; height: 5px; }
.badge--md .badge__dot,
.badge--lg .badge__dot { width: 6px; height: 6px; }
.badge--neutral .badge__dot { background: var(--badge-neutral-dot); }
.badge--brand   .badge__dot { background: var(--badge-brand-dot); }
.badge--success .badge__dot { background: var(--badge-success-dot); }
.badge--warning .badge__dot { background: var(--badge-warning-dot); }
.badge--error   .badge__dot { background: var(--badge-error-dot); }
.badge--info    .badge__dot { background: var(--badge-info-dot); }

/* leading icon */
.badge__icon {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* dot-only type */
.badge--dot-only {
  width: 8px;
  height: 8px;
  min-width: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
}
.badge--dot-only.badge--neutral { background: var(--badge-neutral-dot); box-shadow: 0 0 0 2px var(--badge-neutral-surface); }
.badge--dot-only.badge--brand   { background: var(--badge-brand-dot);   box-shadow: 0 0 0 2px var(--badge-brand-surface); }
.badge--dot-only.badge--success { background: var(--badge-success-dot); box-shadow: 0 0 0 2px var(--badge-success-surface); }
.badge--dot-only.badge--warning { background: var(--badge-warning-dot); box-shadow: 0 0 0 2px var(--badge-warning-surface); }
.badge--dot-only.badge--error   { background: var(--badge-error-dot);   box-shadow: 0 0 0 2px var(--badge-error-surface); }
.badge--dot-only.badge--info    { background: var(--badge-info-dot);    box-shadow: 0 0 0 2px var(--badge-info-surface); }
```

---

## 7. React Component

```tsx
import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  type?: 'label' | 'dot';
  intent?: 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  leadingSlot?: 'none' | 'dot' | 'icon';
  icon?: React.ReactNode;
  children?: string;
  'aria-label'?: string;
  className?: string;
}

export const Badge = ({
  type = 'label',
  intent = 'neutral',
  size = 'md',
  leadingSlot = 'none',
  icon,
  children,
  'aria-label': ariaLabel,
  className,
}: BadgeProps) => {
  if (type === 'dot') {
    return (
      <span
        role="status"
        aria-label={ariaLabel}
        className={clsx('badge badge--dot-only', `badge--${intent}`, className)}
      />
    );
  }

  return (
    <span
      className={clsx('badge', `badge--${size}`, `badge--${intent}`, className)}
      aria-label={ariaLabel}
    >
      {leadingSlot === 'dot' && (
        <span className="badge__dot" aria-hidden="true" />
      )}
      {leadingSlot === 'icon' && icon && (
        <span className="badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};
```

---

## 8. Storybook Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { CheckIcon, LockIcon, SparklesIcon } from '@contentstack/icons';

const meta: Meta<typeof Badge> = {
  title: 'Feedback & Status/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    type:        { control: 'select', options: ['label', 'dot'] },
    intent:      { control: 'select', options: ['neutral','brand','success','warning','error','info'] },
    size:        { control: 'select', options: ['sm','md','lg'] },
    leadingSlot: { control: 'select', options: ['none','dot','icon'] },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Published', intent: 'success', leadingSlot: 'dot' },
};

export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge intent="neutral">Draft</Badge>
      <Badge intent="brand">Beta</Badge>
      <Badge intent="success" leadingSlot="dot">Published</Badge>
      <Badge intent="warning" leadingSlot="dot">Scheduled</Badge>
      <Badge intent="error"   leadingSlot="dot">Failed</Badge>
      <Badge intent="info">Processing</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge intent="success" size="sm" leadingSlot="dot">Published</Badge>
      <Badge intent="success" size="md" leadingSlot="dot">Published</Badge>
      <Badge intent="success" size="lg" leadingSlot="dot">Published</Badge>
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge intent="success" leadingSlot="icon" icon={<CheckIcon />}>Verified</Badge>
      <Badge intent="brand"   leadingSlot="icon" icon={<SparklesIcon />}>New</Badge>
      <Badge intent="neutral" leadingSlot="icon" icon={<LockIcon />}>Locked</Badge>
    </div>
  ),
};

export const DotOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['neutral','brand','success','warning','error','info'] as const).map(intent => (
        <Badge
          key={intent}
          type="dot"
          intent={intent}
          aria-label={`Status: ${intent}`}
        />
      ))}
    </div>
  ),
};

export const InTableRow: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 480 }}>
      {[
        { label: 'Homepage hero banner',    intent: 'success' as const, status: 'Published' },
        { label: 'Q4 campaign landing',     intent: 'warning' as const, status: 'Scheduled' },
        { label: 'Legacy redirect rules',   intent: 'neutral' as const, status: 'Archived' },
        { label: 'AI content enrichment',   intent: 'brand'   as const, status: 'Beta' },
        { label: 'Media upload pipeline',   intent: 'error'   as const, status: 'Failed' },
      ].map(row => (
        <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}>
          <span style={{ fontSize: 13 }}>{row.label}</span>
          <Badge intent={row.intent} leadingSlot="dot">{row.status}</Badge>
        </div>
      ))}
    </div>
  ),
};
```

---

## 9. Accessibility Specification

| Requirement | Implementation |
|---|---|
| Non-interactive element | Renders as `<span>`. No `role`, no `tabIndex`, no event handlers. |
| Colour is never the sole signal | Text label always accompanies colour. Dot reinforces, never replaces, the label. |
| `type="dot"` — no visible text | **Required:** `aria-label` on the element. e.g. `aria-label="Status: Published"`. Enforce as a required prop at the TypeScript level when `type="dot"`. |
| Screen reader context for label badges | Optional `aria-label` adds semantic role context: `aria-label="Content status: Published"` is clearer than just "Published". |
| No focus ring | Correct — Badge is non-interactive. Focus belongs to the host. |
| Text contrast | All intents meet WCAG AA 4.5:1. Verified: `text/success`, `text/warning`, `text/destructive`, `text/info`, `text/brand`, `text/subtle` against their respective surfaces. |
| Dot contrast on surface | All intent dots (border token values) meet 3:1 UI component minimum against their surfaces. |

---

## 10. Usage Guidelines

```
✓ Use sm for tight table cells, sidebar nav labels, compact toolbars
✓ Use md as the default for all content-area badges
✓ Use lg for prominent status in page headers and empty states
✓ Use leadingSlot=dot for publish-state status (Published / Draft / Scheduled / Failed)
✓ Use leadingSlot=icon for contextual meaning beyond colour (Lock, Sparkles, Check)
✓ Keep label text to 1–3 words maximum
✓ Always provide aria-label when type=dot

✗ Do NOT make Badge interactive — use Tag for interactive labels
✗ Do NOT use Badge for numeric counts — use Badge/Counter
✗ Do NOT set both leadingSlot=dot and leadingSlot=icon — they are mutually exclusive
✗ Do NOT suppress the border on neutral badges — it provides the visual boundary on white surfaces
✗ Do NOT use type=dot without an aria-label
```

---

## 11. Known Constraints

| Constraint | Detail |
|---|---|
| `selectIcon` INSTANCE_SWAP | Requires one manual Figma UI step: select any `leadingSlot=icon` variant → select `badge-leading-icon` instance → right panel "Create component property → Instance swap". API limitation. |
| `leadingSlot` mutual exclusivity | Enforced structurally — single variant property with three values. Cannot have dot and icon simultaneously by design. |
| `type=dot` has no size axis | Fixed at 8×8px. Size is determined by host context, not a Badge prop. |
| 0.5px border on neutral | Sub-pixel stroke renders correctly on HiDPI. May appear faint on 1x displays. Intentional — neutral Badge is low-contrast by design on white surfaces. |

---

## 12. Component Relationship Map

```
Badge (this component)    — system-assigned, non-interactive, no dismiss
Badge/Counter             — numeric overlay on a host element
Tag [PENDING]             — user-applied, interactive, optional dismiss
  ├── variant=label       — static taxonomy/classification tag
  └── variant=filter      — toggleable filter pill (active / inactive)

Decision rule:
  User can interact with it   → Tag
  System assigned the state   → Badge
  It is a number on an icon   → Badge/Counter
```

---

*Brief: 2026-06-02 | Venus 2.1 RF v1.0.0 | Figma node: 836:5610*
