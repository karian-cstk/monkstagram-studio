# Toast — Storybook Engineering Brief
**Venus 2.1 RF | Component: Toast | Node: 1208:60796**
**Status: Active v1.0.0 | Page: 💬 Feedback | Last updated: 2026-07-06**

---

## 1. Purpose

`Toast` is a transient, ambient notification that appears above all UI to communicate the result of a system action. It is floating, fixed-width, and auto-dismissing — the user does not need to interact with it to continue working.

**Use when:**
- Confirming the result of a user-initiated action (saved, published, deleted, imported)
- Communicating a non-blocking system event (session expiring, update available)
- Providing a recovery action after a failure (retry, undo)

**Do not use when:**
- The message requires immediate user action to continue — use a Modal or Dialog instead
- The message is contextually tied to a specific element on the page — use an Inline Alert instead
- The information is persistent and must remain visible — use a Banner or Inline Alert instead
- There is no user action to acknowledge — suppress the notification entirely

**Key distinctions from Inline Alert:**
- Toast is transient (auto-dismisses); Inline Alert is persistent
- Toast is fixed-width floating (360px); Inline Alert is fluid and layout-bound
- Toast has elevation (shadow); Inline Alert is flat
- Toast uses intent tints without an accent bar; Inline Alert uses a 4px left accent bar

**Alternatives:**
- `Inline Alert` — persistent, layout-bound, contextual to a specific section
- `Modal` — blocking, requires explicit user action before proceeding
- `Tooltip` — hover-triggered, no action affordance

---

## 2. Anatomy

```
[toast-root] ← COMPONENT, VERTICAL auto-layout, FIXED 360px, HUG height
  ├── [toast-focus-ring] ← FRAME, ABSOLUTE x=-2 y=-2, hidden by default
  └── [toast-body] ← HORIZONTAL auto-layout, pad t/b:16 l:16 r:48, gap:12
        ├── [toast-icon] ← Icon INSTANCE, 20×20px, FIXED, intent-matched
        ├── [toast-content] ← VERTICAL auto-layout, FILL width, gap:4
        │     ├── [toast-title] ← TEXT, Body/SM/Semi Bold, hidden by default
        │     ├── [toast-message] ← TEXT, Body/SM/Regular, always visible
        │     └── [toast-actions] ← HORIZONTAL auto-layout, paddingTop:8, gap:8
        │           ├── [toast-action-secondary] ← Ghost frame (gray) — Cancel
        │           └── [toast-action-primary] ← Ghost frame (purple) — Action
        └── [toast-dismiss] ← _Internal/Icon-Action INSTANCE, ABSOLUTE x=324 y=12
```

| Layer | DOM equivalent | Role |
|---|---|---|
| `toast-root` | `<div role="status">` or `<div role="alert">` | Root container. Carries intent fill, border, shadow, radius. |
| `toast-focus-ring` | CSS `outline` | Container-level focus ring. Shown when toast receives programmatic focus on appearance. |
| `toast-icon` | `<span aria-hidden="true">` | Intent icon. 20px. Venus_Icons mode matched to intent. |
| `toast-content` | `<div>` | Content column. FILL width — expands to fill body minus icon and padding. |
| `toast-title` | `<p>` | Optional title. Body/SM/Semi Bold. Hidden by default (`hasTitle=false`). |
| `toast-message` | `<p>` | Required message. Body/SM/Regular. Always visible. |
| `toast-actions` | `<div>` | Actions row. Inline below message — aligns naturally with content, not icon. |
| `toast-action-secondary` | `<button>` | Negative/neutral action (Cancel, Dismiss). Gray Ghost. |
| `toast-action-primary` | `<button>` | Positive/confirming action (Retry, View, Undo). Purple Ghost. |
| `toast-dismiss` | `<button aria-label="Dismiss">` | Close trigger. Absolute top-right. Always present unless `hasDismiss=false`. |

---

## 3. TypeScript Props Interface

```typescript
export type ToastIntent = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface ToastProps {
  /** Semantic intent — controls surface tint, border, and icon */
  intent?: ToastIntent;

  /**
   * Required message text. Always visible.
   * Keep under 2 lines at 360px width for optimal readability.
   */
  message: string;

  /** Optional title. Body/SM/Semi Bold. Use when message needs a subject line. */
  title?: string;

  /** Label for the primary (positive) action button */
  actionLabel?: string;

  /** Handler for the primary action */
  onAction?: () => void;

  /** Label for the secondary (negative/neutral) action button */
  action2Label?: string;

  /** Handler for the secondary action */
  onAction2?: () => void;

  /** Show dismiss button. Default: true. Set false only for non-dismissible toasts. */
  hasDismiss?: boolean;

  /** Handler for dismiss button and auto-dismiss */
  onDismiss?: () => void;

  /**
   * Auto-dismiss delay in milliseconds.
   * Default: 5000 (5s). Set to 0 to disable auto-dismiss.
   * Error toasts should ALWAYS set duration=0 — errors must be explicitly dismissed.
   */
  duration?: number;

  /** Additional CSS class names */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | Type | React Prop | Notes |
|---|---|---|---|
| `Intent` | VARIANT | `intent` | `'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` |
| `hasTitle` | BOOLEAN | Presence of `title` prop | `title` prop undefined → title hidden |
| `hasAction` | BOOLEAN | Presence of `actionLabel` + `onAction` | Both required together |
| `hasAction2` | BOOLEAN | Presence of `action2Label` + `onAction2` | Both required together |
| `hasDismiss` | BOOLEAN | `hasDismiss` | Default true |
| `hasFocus` | BOOLEAN | — | Storybook/demo only. Maps to programmatic focus in production |
| `title` | TEXT | `title` | Optional string |
| `message` | TEXT | `message` | Required string |
| `actionLabel` | TEXT | `actionLabel` | Label for primary action |
| `action2Label` | TEXT | `action2Label` | Label for secondary action. Default: "Cancel" |

---

## 5. State Behaviour

### Intent states

| Intent | Surface token | Border token | Icon | Icon mode | ARIA role | Auto-dismiss |
|---|---|---|---|---|---|---|
| Neutral | `surface/overlay` | `border/default` | informationCircle | neutral (gray) | `status` | ✅ 5s |
| Success | `feedback/success/surface` | `feedback/success/border` | CheckCircle | success (green) | `status` | ✅ 5s |
| Warning | `feedback/warning/surface` | `feedback/warning/border` | Warning | warning (amber) | `alert` | ✅ 5s |
| Error | `feedback/error/surface` | `feedback/error/border` | Close-Border | error (red) | `alert` | ❌ Never |
| Info | `feedback/info/surface` | `feedback/info/border` | informationCircle | default (purple) | `status` | ✅ 5s |

**Error toasts must never auto-dismiss.** The user must explicitly acknowledge an error.

### Interactive states

| Element | State | Trigger | Visual |
|---|---|---|---|
| `toast-action-primary` | Hover | `:hover` | `action/ghost/hover` fill |
| `toast-action-primary` | Pressed | `:active` | `action/ghost/pressed` fill |
| `toast-action-primary` | Focused | `:focus-visible` | `focus/ring/color` outline |
| `toast-action-secondary` | Hover | `:hover` | `surface/interactive/hover` fill |
| `toast-dismiss` | Hover | `:hover` | `surface/interactive/hover` fill (from Icon-Action) |

---

## 6. Size Specification

| Property | Value | Token |
|---|---|---|
| Width | 360px fixed | — |
| Height | HUG (driven by content) | — |
| Min height | ~56px (message only) | — |
| Corner radius | 8px | `radius/8` |
| Body padding | t/b: 16px, l: 16px, r: 48px | `space/16` |
| Body gap | 12px | `space/12` |
| Content gap | 4px | `space/4` |
| Actions padding-top | 8px | `space/8` |
| Actions gap | 8px | `space/8` |
| Icon size | 20px | `icon/context/toast` |
| Dismiss position | x=324, y=12 | ABSOLUTE, MAX/MIN constraints |
| Shadow | Elevation/Level 3 — Sticky | Effect style |

---

## 7. Token Reference

### Surface and border

| Variant | Fill token | Stroke token |
|---|---|---|
| Neutral | `surface/overlay` | `border/default` |
| Success | `feedback/success/surface` | `feedback/success/border` |
| Warning | `feedback/warning/surface` | `feedback/warning/border` |
| Error | `feedback/error/surface` | `feedback/error/border` |
| Info | `feedback/info/surface` | `feedback/info/border` |

### Typography

| Layer | Text style | Font size token | Font weight token | Fill token |
|---|---|---|---|---|
| `toast-title` | `Body/SM/Semi Bold` | `font-size/13` | `font-weight/semibold` | `text/default` |
| `toast-message` | `Body/SM` | `font-size/13` | `font-weight/regular` | `text/default` |
| Action labels | `Label/MD` | `font-size/12` | `font-weight/medium` | `text/default` |

> **Note:** `Body/SM/Semi Bold` (13px, Semi Bold) was created 2026-07-06 specifically for this component. It is now available system-wide for component titles requiring emphasis at body/SM scale.

### Actions

| Layer | Fill | Stroke token |
|---|---|---|
| `toast-action-primary` | transparent | `focus/ring/color` (brand purple) |
| `toast-action-secondary` | transparent | `border/default` (gray) |

### Focus ring

| Property | Token / Value |
|---|---|
| Stroke | `focus/ring/color` |
| Stroke weight | 2px |
| Position | x=-2, y=-2 |
| Corner radius | 10px (8+2) |
| Constraints | STRETCH both axes |

### Elevation

| Property | Value |
|---|---|
| Effect style | `Elevation/Level 3 — Sticky` |
| Description | Sticky headers, floating toolbars, persistent floating UI |

---

## 8. Accessibility

### ARIA

```html
<!-- Success / Neutral / Info — polite announcement -->
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  <p class="toast-title">Entry published</p>
  <p class="toast-message">Your entry is now live.</p>
  <button>View</button>
  <button>Cancel</button>
  <button aria-label="Dismiss notification">×</button>
</div>

<!-- Error / Warning — assertive announcement -->
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  <p class="toast-title">Import failed</p>
  <p class="toast-message">3 entries could not be processed.</p>
  <button>Retry</button>
  <button>Cancel</button>
  <button aria-label="Dismiss notification">×</button>
</div>
```

### Role assignment by intent

| Intent | `role` | `aria-live` | Rationale |
|---|---|---|---|
| Neutral | `status` | `polite` | Non-urgent confirmation |
| Success | `status` | `polite` | Positive confirmation, not urgent |
| Info | `status` | `polite` | Informational, not urgent |
| Warning | `alert` | `assertive` | Requires awareness |
| Error | `alert` | `assertive` | Requires immediate attention |

### Keyboard behaviour

| Key | Action |
|---|---|
| `Tab` | Focus dismiss button, then action buttons |
| `Enter` / `Space` | Activate focused button |
| `Escape` | Dismiss toast (if hasDismiss=true) |

### Contrast

| Pair | Ratio | WCAG |
|---|---|---|
| `text/default` on `surface/overlay` | 17.74:1 | ✅ AAA |
| `text/default` on `feedback/success/surface` | 17.40:1 | ✅ AAA |
| `text/default` on `feedback/warning/surface` | 16.79:1 | ✅ AAA |
| `text/default` on `feedback/error/surface` | 16.15:1 | ✅ AAA |
| `text/default` on `feedback/info/surface` | 15.99:1 | ✅ AAA |
| Action purple on `surface/overlay` | 4.86:1 | ✅ AA |
| Focus ring on white | 4.86:1 | ✅ WCAG 2.4.11 |

### Touch targets

All interactive elements (dismiss, action buttons) meet 24×24px minimum. Action buttons are HUG width with `paddingLeft/Right: 12px` minimum.

---

## 9. Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { useState } from 'react';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  argTypes: {
    intent: {
      control: 'radio',
      options: ['neutral', 'success', 'warning', 'error', 'info'],
    },
    duration: { control: 'number' },
    hasDismiss: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Toast>;

// 1. Default — message only
export const Default: Story = {
  args: {
    intent: 'neutral',
    message: 'Draft saved automatically.',
    hasDismiss: true,
    duration: 5000,
  },
};

// 2. All intents
export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Toast intent="neutral" message="Draft saved automatically." />
      <Toast intent="success" message="Entry published successfully." />
      <Toast intent="warning" message="Session expires in 5 minutes." />
      <Toast intent="error" message="Import failed. Please try again." duration={0} />
      <Toast intent="info" message="Venus 2.2 is ready to install." />
    </div>
  ),
};

// 3. With title
export const WithTitle: Story = {
  args: {
    intent: 'error',
    title: 'Import failed',
    message: '3 entries could not be processed due to schema errors.',
    actionLabel: 'Retry',
    onAction: () => console.log('retry'),
    action2Label: 'Cancel',
    onAction2: () => console.log('cancel'),
    duration: 0,
  },
};

// 4. With single action
export const WithAction: Story = {
  args: {
    intent: 'success',
    message: 'Entry published successfully.',
    actionLabel: 'View',
    onAction: () => console.log('view'),
  },
};

// 5. With two actions
export const WithTwoActions: Story = {
  args: {
    intent: 'warning',
    title: 'Session expiring',
    message: "You'll be logged out in 5 minutes.",
    actionLabel: 'Stay logged in',
    onAction: () => console.log('stay'),
    action2Label: 'Log out',
    onAction2: () => console.log('logout'),
    duration: 0,
  },
};

// 6. No dismiss
export const NoDismiss: Story = {
  args: {
    intent: 'info',
    message: 'Syncing your changes in the background.',
    hasDismiss: false,
    duration: 3000,
  },
};

// 7. Toast stack (viewport context)
export const ToastStack: Story = {
  render: () => (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 500,
      }}
    >
      <Toast intent="success" message="Draft autosaved." />
      <Toast intent="warning" message="Storage 90% full." actionLabel="Manage" />
      <Toast
        intent="error"
        title="Import failed"
        message="3 entries could not be processed."
        actionLabel="Retry"
        action2Label="Cancel"
        duration={0}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Multiple toasts stack top-right, newest at top, 8px gap between.',
      },
    },
  },
};

// 8. Dark mode
export const DarkMode: Story = {
  args: {
    intent: 'error',
    title: 'Import failed',
    message: '3 entries could not be processed.',
    actionLabel: 'Retry',
    action2Label: 'Cancel',
    duration: 0,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};

// 9. Focused
export const Focused: Story = {
  args: {
    intent: 'neutral',
    message: 'Draft saved automatically.',
  },
  parameters: {
    pseudo: { focusVisible: true },
  },
};
```

---

## 10. Implementation Notes

### CSS

```css
.toast {
  position: fixed;
  width: 360px;
  border-radius: var(--radius-8);
  border: 1px solid var(--border-default);
  background: var(--surface-overlay);
  box-shadow: var(--elevation-level-3);
  overflow: visible; /* focus ring and shadow must overflow */
}

/* Intent variants */
.toast--success { background: var(--feedback-success-surface); border-color: var(--feedback-success-border); }
.toast--warning { background: var(--feedback-warning-surface); border-color: var(--feedback-warning-border); }
.toast--error   { background: var(--feedback-error-surface);   border-color: var(--feedback-error-border); }
.toast--info    { background: var(--feedback-info-surface);     border-color: var(--feedback-info-border); }

.toast__body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 48px 16px 16px; /* r:48 leaves room for absolute dismiss */
}

.toast__icon { flex-shrink: 0; width: 20px; height: 20px; }

.toast__content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }

.toast__title   { font-size: var(--font-size-13); font-weight: var(--font-weight-semibold); color: var(--text-default); line-height: 130%; }
.toast__message { font-size: var(--font-size-13); font-weight: var(--font-weight-regular);  color: var(--text-default); line-height: 130%; }

.toast__actions { display: flex; gap: 8px; padding-top: 8px; }

.toast__action-primary {
  border: 1px solid var(--focus-ring-color);
  color: var(--focus-ring-color);
  background: transparent;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}
.toast__action-primary:hover  { background: var(--action-ghost-hover); }
.toast__action-primary:active { background: var(--action-ghost-pressed); }

.toast__action-secondary {
  border: 1px solid var(--border-default);
  color: var(--text-subtle);
  background: transparent;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

.toast__dismiss {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: transparent;
  border: none;
}

/* Focus ring */
.toast:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}
```

### ToastStack positioning

```css
.toast-stack {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 500;
  pointer-events: none; /* stack itself is not interactive */
}
.toast-stack .toast {
  pointer-events: all; /* individual toasts are interactive */
}
```

### Auto-dismiss

```typescript
useEffect(() => {
  if (duration === 0) return; // Error toasts — never auto-dismiss
  const timer = setTimeout(onDismiss, duration ?? 5000);
  return () => clearTimeout(timer);
}, [duration, onDismiss]);
```

### Error toast — never auto-dismiss

```typescript
const effectiveDuration = intent === 'error' ? 0 : (duration ?? 5000);
```

### New text style

`Body/SM/Semi Bold` (13px, Inter Semi Bold, lineHeight 130%) was created 2026-07-06. It is available in Venus_Typography for use in any component requiring title-level emphasis at the body/SM scale.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .toast { transition: none; animation: none; }
}
```

---

## 11. Do / Don't

**✅ Do — Use role="alert" for error and warning**
```tsx
<Toast intent="error" message="Import failed." duration={0} />
// renders: <div role="alert" aria-live="assertive">
```
**❌ Don't — Use role="alert" for success or info**
Assertive live regions interrupt screen readers immediately. Success confirmations are polite — they should not interrupt.

---

**✅ Do — Set duration=0 for error toasts**
```tsx
<Toast intent="error" message="Export failed." duration={0} actionLabel="Retry" />
```
**❌ Don't — Auto-dismiss errors**
An error that disappears before the user reads it is invisible feedback. Errors must always be explicitly acknowledged.

---

**✅ Do — Negative action left, positive action right**
```tsx
<Toast actionLabel="Retry" action2Label="Cancel" />
// Renders: [Cancel] [Retry]
```
**❌ Don't — Put the primary action on the left**
This violates the Venus action order principle (Rule 11). Positive right, negative left — always.

---

**✅ Do — Keep messages under 2 lines**
```tsx
<Toast message="Entry published successfully." />
```
**❌ Don't — Use Toast for long explanatory text**
If you need more than 2 lines, the information warrants an Inline Alert or Modal, not a Toast.

---

**✅ Do — Use ToastStack for multiple simultaneous toasts**
Stack at most 3 toasts. Oldest auto-dismiss first.
**❌ Don't — Show more than 3 toasts simultaneously**
Beyond 3, dismiss the oldest before showing a new one.

---

## 12. Related Components

| Component | Relationship | When to use instead |
|---|---|---|
| `Inline Alert` | Persistent equivalent | When the message is tied to a specific section or form, or must remain visible until resolved |
| `Modal` | Blocking equivalent | When the user must take explicit action before continuing |
| `_Internal/Icon-Action` | Used internally | The dismiss button — do not replace with a custom implementation |
| `Button/Ghost` | Architectural reference | Action buttons follow Ghost button token pattern (not Button instances) |
| `Progress Bar` | Companion | Can be embedded inside an Inline Alert for multi-step operations; not used inside Toast |

