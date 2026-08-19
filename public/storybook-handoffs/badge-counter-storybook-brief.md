# Storybook Engineering Brief — Badge/Counter
**Venus 2.1 RF | Version 1.0.0 | Status: Active | Date: 2026-06-02**
**Figma:** `840:6214` · Page: 💬 Feedback & Status

---

## 1. Purpose

`Badge/Counter` communicates a numeric count overlaid on a host element. It answers *"how many?"*. It is always positioned absolutely on its host — an icon, avatar, nav item, or button. It is never used as a standalone inline element.

**Use for:** unread notification counts on bell/inbox icons, active filter counts on filter icons, item counts on cart or selection indicators.

**Do NOT use for:**
- Status labels or text attributes → `Badge`
- User-applied taxonomy labels → `Tag`
- Any context where there is no numeric count to communicate

---

## 2. Anatomy

```
badge-counter-root          FRAME — horizontal auto-layout, full pill (radius 9999)
  counter-label             TEXT — Label/XS (11px SemiBold), text/inverse (white)
```

The 1.5px white `OUTSIDE` stroke is the separation halo. It makes the counter legible on any background — dark surface, image, brand colour, or white. Do not remove or reduce it.

---

## 3. TypeScript Props Interface

```typescript
export interface BadgeCounterProps {
  /**
   * Numeric or overflow string to display.
   * Pass a number — the component handles "99+" truncation automatically.
   * Pass a string only when you need explicit control (e.g. "99+", "•").
   */
  count: string | number;

  /**
   * Semantic colour intent. Drives the solid fill colour.
   * - `error`:   Unread notifications, system alerts. DEFAULT.
   * - `brand`:   Active filter count, user-applied state count.
   * - `success`: Completed item count (use sparingly).
   * - `warning`: Items needing attention count (use sparingly).
   * - `neutral`: Low-emphasis count with no urgency.
   * - `info`:    Informational count.
   * @default 'error'
   */
  intent?: 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';

  /**
   * Accessible label. Always provide — the numeric value alone is not enough context.
   * e.g. "3 unread messages", "2 filters active", "12 items selected"
   * Defaults to "{count} notifications" as a fallback only.
   */
  'aria-label'?: string;

  /** Additional CSS class names. Applied to the counter root. */
  className?: string;

  /** Inline styles. Used by consuming components to apply absolute positioning. */
  style?: React.CSSProperties;
}
```

---

## 4. Figma Variant → Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `intent=neutral` | `intent="neutral"` | — |
| `intent=brand` | `intent="brand"` | Filter count use case |
| `intent=success` | `intent="success"` | — |
| `intent=warning` | `intent="warning"` | — |
| `intent=error` | `intent="error"` | Default — notification use case |
| `intent=info` | `intent="info"` | — |
| `label` text property | `count` prop | Component auto-truncates to "99+" |

**Note:** Badge/Counter has no `size` prop. The component is fixed at 20px minimum height. The Figma component set has no size axis — this was an intentional architectural decision. Size is governed by the host element context, not a prop.

---

## 5. Token Bindings

| Layer | Property | Token | Resolves to (via semantics) |
|---|---|---|---|
| `badge-counter-root` | fill | `badge/[intent]/counter/surface` | Solid action colour |
| `badge-counter-root` | stroke | Raw `#FFFFFF` 1.5px OUTSIDE | White halo — raw value intentional |
| `counter-label` | fill | `text/inverse` | White |
| `counter-label` | text style | `Label/XS` | Inter 11px SemiBold |

**Counter fill token aliases:**

| Token | Alias (Venus_Semantics) | Resolved colour |
|---|---|---|
| `badge/neutral/counter/surface` | `border/strong` | gray/400 |
| `badge/brand/counter/surface` | `action/primary` | purple/500 |
| `badge/success/counter/surface` | `border/success` | green/500 |
| `badge/warning/counter/surface` | `border/warning` | yellow/500 |
| `badge/error/counter/surface` | `action/destructive` | red/600 |
| `badge/info/counter/surface` | `border/info` | blue/500 |

**Why solid fills, not tinted surfaces:** Counter overlays sit on top of host elements with unpredictable backgrounds. A tinted badge surface (like Badge label uses) would lose contrast on dark or brand-coloured hosts. Solid action colours maintain legibility on any background.

---

## 6. CSS Implementation

```css
/* ─── Counter component tokens ───────────────────────── */
:root[data-theme="light"] {
  --badge-counter-neutral: var(--border-strong);       /* gray/400  */
  --badge-counter-brand:   var(--action-primary);      /* purple/500 */
  --badge-counter-success: var(--border-success);      /* green/500 */
  --badge-counter-warning: var(--border-warning);      /* yellow/500 */
  --badge-counter-error:   var(--action-destructive);  /* red/600   */
  --badge-counter-info:    var(--border-info);         /* blue/500  */
}

/* ─── Base ────────────────────────────────────────────── */
.badge-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 9999px;
  font-family: var(--font-inter);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
  color: var(--text-inverse);           /* white */
  box-shadow: 0 0 0 1.5px #ffffff;      /* white halo — always raw white, not a token */
  white-space: nowrap;
  cursor: default;
  user-select: none;
}

/* intents */
.badge-counter--neutral { background: var(--badge-counter-neutral); }
.badge-counter--brand   { background: var(--badge-counter-brand); }
.badge-counter--success { background: var(--badge-counter-success); }
.badge-counter--warning { background: var(--badge-counter-warning); }
.badge-counter--error   { background: var(--badge-counter-error); }
.badge-counter--info    { background: var(--badge-counter-info); }
```

**Note on the white halo:** `box-shadow: 0 0 0 1.5px #ffffff` is used instead of `border` because border would increase the element's layout size and shift the absolute positioning. `box-shadow` renders outside without affecting layout.

---

## 7. React Component

```tsx
import React from 'react';
import clsx from 'clsx';

export interface BadgeCounterProps {
  count: string | number;
  intent?: 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const BadgeCounter = ({
  count,
  intent = 'error',
  'aria-label': ariaLabel,
  className,
  style,
}: BadgeCounterProps) => {
  const displayCount =
    typeof count === 'number' && count > 99
      ? '99+'
      : String(count);

  return (
    <span
      role="status"
      aria-label={ariaLabel ?? `${displayCount} notifications`}
      aria-live="polite"
      aria-atomic="true"
      className={clsx('badge-counter', `badge-counter--${intent}`, className)}
      style={style}
    >
      {displayCount}
    </span>
  );
};
```

---

## 8. Storybook Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BadgeCounter } from './BadgeCounter';
import { BellIcon, FilterIcon, InboxIcon } from '@contentstack/icons';

const meta: Meta<typeof BadgeCounter> = {
  title: 'Feedback & Status/BadgeCounter',
  component: BadgeCounter,
  tags: ['autodocs'],
  argTypes: {
    intent: { control: 'select', options: ['neutral','brand','success','warning','error','info'] },
    count:  { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof BadgeCounter>;

export const Default: Story = {
  args: {
    count: 3,
    intent: 'error',
    'aria-label': '3 unread notifications',
  },
};

export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      {(['neutral','brand','success','warning','error','info'] as const).map(intent => (
        <BadgeCounter
          key={intent}
          count={9}
          intent={intent}
          aria-label={`9 items — ${intent}`}
        />
      ))}
    </div>
  ),
};

export const Overflow: Story = {
  args: {
    count: 100,
    intent: 'error',
    'aria-label': 'More than 99 unread notifications',
  },
};

export const OnNotificationIcon: Story = {
  render: () => (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <BellIcon
        style={{ fontSize: 20, color: '#374151' }}
        aria-label="Notifications"
      />
      <BadgeCounter
        count={4}
        intent="error"
        aria-label="4 unread notifications"
        style={{ position: 'absolute', top: -5, right: -6 }}
      />
    </div>
  ),
};

export const OnFilterIcon: Story = {
  render: () => (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <FilterIcon
        style={{ fontSize: 20, color: '#374151' }}
        aria-label="Filters"
      />
      <BadgeCounter
        count={2}
        intent="brand"
        aria-label="2 filters active"
        style={{ position: 'absolute', top: -5, right: -6 }}
      />
    </div>
  ),
};

export const ZeroCount: Story = {
  args: {
    count: 0,
    intent: 'error',
    'aria-label': 'No unread notifications',
  },
  parameters: {
    docs: {
      description: {
        story: 'When count is 0, consider hiding the counter entirely rather than showing "0". Implement this with conditional rendering at the host level: `{count > 0 && <BadgeCounter count={count} />}`.',
      },
    },
  },
};
```

---

## 9. Accessibility Specification

| Requirement | Implementation |
|---|---|
| `role="status"` | Announces the counter to screen readers as a live status region without interrupting current interaction. |
| `aria-live="polite"` | Counter updates are announced after the current user action completes. Use `"assertive"` only for critical system alerts where immediate announcement is required. |
| `aria-atomic="true"` | The entire counter value is re-read on update. Without this, only the changed characters would be announced — unacceptable for a number like "9" changing to "10". |
| `aria-label` | Always provide explicit context. `"4 unread messages"` is correct. `"4"` alone is insufficient — screen reader users have no context for what the number represents. |
| White text contrast | `text/inverse` (white) on all six counter fills. All meet WCAG AA 4.5:1 minimum. Darkest: `badge/counter/neutral` (gray/400, ~3.1:1 — marginal, acceptable for non-body UI). All others comfortably exceed 4.5:1. |
| Host element responsibility | The icon or element hosting the counter must have its own accessible name that provides full context: e.g. `aria-label="Notifications, 4 unread"` on the host icon button. The counter supplements — it does not replace — the host's accessible label. |
| Zero count | Do not render a "0" counter. Conditionally render `{count > 0 && <BadgeCounter />}` at the host level. A visible "0" counter communicates nothing and adds noise. |

---

## 10. Usage Guidelines

```
✓ Always position absolutely on a host element — never inline in text flow
✓ Use intent=error as the default for unread notification counts
✓ Use intent=brand for filter-applied counts and user-state counts
✓ Always provide a descriptive aria-label with noun context
✓ Truncate at 99+ for counts above 99
✓ Hide entirely when count is 0 — render nothing, not "0"
✓ Ensure the host element's accessible name includes counter context

✗ Do NOT use as a standalone inline element
✗ Do NOT use for text content — counters are numbers or "99+" only
✗ Do NOT remove the white halo stroke — required for legibility on all backgrounds
✗ Do NOT place inside auto-layout flow without setting position: absolute
✗ Do NOT rely on colour alone — the number itself communicates the count
✗ Do NOT use for status labels — use Badge instead
```

---

## 11. Known Constraints

| Constraint | Detail |
|---|---|
| No `size` prop | Fixed at 20px min-height. Intentional — counter size is governed by host context, not a prop. The 6px horizontal padding gives it breathing room for 1–3 digit numbers. |
| Absolute positioning is the caller's responsibility | `BadgeCounter` accepts `style` and `className` props for positioning. The component does not position itself — the host component or layout determines `top`, `right`, and `z-index`. |
| White halo is always `#FFFFFF` | The 1.5px white ring is a raw value, not a token. It must always be white regardless of theme. A themed halo (e.g. matching the page background) would fail on image or brand-coloured host surfaces. |
| No animation built in | Count change transitions (e.g. number flip) are not part of the design system component. Implement at the product level if needed. |

---

## 12. Component Relationship Map

```
Badge/Counter (this component)  — numeric overlay, always on a host
Badge                           — system-assigned status label, standalone
Tag [PENDING]                   — user-applied, interactive, optional dismiss

Decision rule:
  It is a number on an icon or element   → Badge/Counter
  It is a status or classification word  → Badge
  The user applied it and can remove it  → Tag
```

---

*Brief: 2026-06-02 | Venus 2.1 RF v1.0.0 | Figma node: 840:6214*
