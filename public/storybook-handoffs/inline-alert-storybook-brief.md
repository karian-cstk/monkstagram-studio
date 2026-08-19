# Inline Alert — Storybook Brief
**Venus 2.1 RF | Component: `InlineAlert` | Node: `1176:6062` | Page: 💬 Feedback**
**Status: Active | Version: 1.0.0 | Date: 2026-07-05**

---

## 1. Component Overview

A full-width contextual feedback strip placed inline within page layout. Communicates system state, validation results, or important notices without interrupting the user's workflow. Width fills its container. Height is content-driven (HUG).

**Not to be confused with:**
- Toast — floats above content, auto-dismisses
- Modal — overlays and blocks interaction
- Status Message — field-level, lives below a single form input

---

## 2. Figma → React Prop Mapping

| Figma Property | React Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Intent` (VARIANT) | `intent` | `'warning' \| 'error' \| 'success' \| 'info'` | `'warning'` | Drives all visual changes |
| `hasTitle` (BOOL) | `hasTitle` | `boolean` | `false` | Shows bold title above body |
| `hasAction1` (BOOL) | `hasAction1` | `boolean` | `false` | Shows primary action row + action1 link |
| `hasAction2` (BOOL) | `hasAction2` | `boolean` | `false` | Shows secondary action link independently |
| `hasDismiss` (BOOL) | `hasDismiss` | `boolean` | `true` | Shows dismiss X button |
| `hasFocus` (BOOL) | — | internal | `false` | CSS `:focus-visible` in code |
| `hasProgressBar` (BOOL) | `hasProgressBar` | `boolean` | `false` | Shows narrow progress bar at bottom |
| `title` (TEXT) | `title` | `string` | `'Alert title'` | Shown when `hasTitle=true` |
| `body` (TEXT) | `body` \| `children` | `string \| ReactNode` | — | Always required |
| `action1Label` (TEXT) | `action1Label` | `string` | `'Action'` | Primary CTA text |
| `action2Label` (TEXT) | `action2Label` | `string` | `'Action'` | Secondary CTA text |

---

## 3. TypeScript Interface

```typescript
interface InlineAlertProps {
  intent: 'warning' | 'error' | 'success' | 'info';
  body: string | React.ReactNode;
  title?: string;
  hasTitle?: boolean;
  hasAction1?: boolean;
  hasAction2?: boolean;
  hasDismiss?: boolean;
  hasProgressBar?: boolean;
  action1Label?: string;
  action2Label?: string;
  onDismiss?: () => void;
  onAction1?: () => void;
  onAction2?: () => void;
  progressValue?: number; // 0–100, only relevant when hasProgressBar=true
  className?: string;
}
```

---

## 4. Anatomy & Layer Reference

```
alert-root (div — role="alert" or role="status")
├── alert-accent          (div — 4px wide left stripe, intent color)
└── alert-body            (div — VERTICAL flex, FILL width, HUG height)
    ├── alert-content-row (div — HORIZONTAL flex, CENTER aligned)
    │   ├── alert-icon    (Icon — 20px, intent-specific)
    │   ├── alert-text-stack (div — VERTICAL flex)
    │   │   ├── alert-title   (p — Semi Bold 14px, hidden when hasTitle=false)
    │   │   └── alert-body-text (p — Regular 14px, always visible)
    │   └── alert-dismiss (button — Close-Noborder icon, hidden when hasDismiss=false)
    ├── alert-actions     (div — HORIZONTAL flex, hidden when hasAction1=false)
    │   ├── alert-action-1 (Hyperlink — hidden when hasAction1=false)
    │   └── alert-action-2 (Hyperlink — hidden when hasAction2=false)
    └── alert-progress-bar (ProgressBar/Narrow — ABSOLUTE bottom, hidden when hasProgressBar=false)
```

---

## 5. Token Reference

| Layer | Property | CSS Custom Property |
|---|---|---|
| `alert-root` | background | `--feedback-{intent}-surface` |
| `alert-root` | border | `1px solid var(--feedback-{intent}-border)` |
| `alert-root` | border-radius | `--radius-4` |
| `alert-accent` | background | `--feedback-{intent}-border` |
| `alert-accent` | width | `4px` |
| `alert-icon` | color | intent mode via Venus_Icons |
| `alert-title` | color | `--text-default` |
| `alert-title` | font-weight | `--font-weight-semibold` |
| `alert-body-text` | color | `--text-subtle` |
| `alert-dismiss` | color | `--icon-neutral` (gray/700) |
| `alert-actions` | padding-left | `28px` (icon 20 + gap 8) |
| `alert-actions` | gap | `24px` |
| `focus-ring` | outline | `2px solid var(--border-focus)` at `-2px` offset |

**Intent→token mapping:**
```
warning  → --feedback-warning-surface  / --feedback-warning-border
error    → --feedback-error-surface    / --feedback-error-border   (#8f0e0e)
success  → --feedback-success-surface  / --feedback-success-border
info     → --feedback-info-surface     / --feedback-info-border
```

---

## 6. ARIA & Accessibility

```tsx
// Error and Warning: assertive live region
<div role="alert" aria-live="assertive">

// Info and Success: polite live region
<div role="status" aria-live="polite">

// Dismiss button
<button aria-label="Dismiss alert" onClick={onDismiss}>
  <CloseIcon aria-hidden="true" />
</button>

// Icon
<Icon aria-hidden="true" />
```

**Keyboard:**
- `Tab` → dismiss button → action links
- `Enter` / `Space` → activates focused element
- `Escape` → dismisses alert (when `hasDismiss=true`)

---

## 7. CSS Implementation

```css
.inline-alert {
  display: flex;
  flex-direction: row;
  width: 100%;
  border-radius: var(--radius-4);
  border: 1px solid;
  overflow: hidden;
  position: relative;
}

.inline-alert--warning {
  background: var(--feedback-warning-surface);
  border-color: var(--feedback-warning-border);
}
.inline-alert--error {
  background: var(--feedback-error-surface);
  border-color: var(--feedback-error-border);
}
.inline-alert--success {
  background: var(--feedback-success-surface);
  border-color: var(--feedback-success-border);
}
.inline-alert--info {
  background: var(--feedback-info-surface);
  border-color: var(--feedback-info-border);
}

.inline-alert__accent {
  width: 4px;
  flex-shrink: 0;
  align-self: stretch;
}
.inline-alert--warning .inline-alert__accent  { background: var(--feedback-warning-border); }
.inline-alert--error .inline-alert__accent    { background: var(--feedback-error-border); }
.inline-alert--success .inline-alert__accent  { background: var(--feedback-success-border); }
.inline-alert--info .inline-alert__accent     { background: var(--feedback-info-border); }

.inline-alert__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: 12px;
  flex: 1;
  min-width: 0;
}

.inline-alert__content-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-8);
}

.inline-alert__text-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
  min-width: 0;
}

.inline-alert__title {
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-semibold);
  color: var(--text-default);
  margin: 0;
}

.inline-alert__body-text {
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-regular);
  color: var(--text-subtle);
  margin: 0;
  line-height: 1.5;
}

.inline-alert__dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-subtle);
  padding: 0;
  align-self: flex-start;
}
.inline-alert__dismiss:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-4);
}

.inline-alert__actions {
  display: flex;
  flex-direction: row;
  gap: var(--space-24);
  padding-left: 28px; /* aligns with body text after icon + gap */
}

.inline-alert__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
}
```

---

## 8. Storybook Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { InlineAlert } from './InlineAlert';

const meta: Meta<typeof InlineAlert> = {
  title: 'Feedback/InlineAlert',
  component: InlineAlert,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['warning', 'error', 'success', 'info'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof InlineAlert>;

export const Default: Story = {
  args: {
    intent: 'warning',
    body: 'This is the message for the alert notification.',
  },
};

export const WithTitle: Story = {
  args: {
    intent: 'error',
    hasTitle: true,
    title: 'Form validation failed',
    body: '3 required fields are missing. Please complete them before saving.',
  },
};

export const WithActions: Story = {
  args: {
    intent: 'info',
    body: 'A new version of this entry is available.',
    hasAction1: true,
    hasAction2: true,
    action1Label: 'View changes',
    action2Label: 'Dismiss',
  },
};

export const WithProgressBar: Story = {
  args: {
    intent: 'success',
    body: 'Publishing your changes. This dialog will close automatically.',
    hasDismiss: false,
    hasProgressBar: true,
  },
};

export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['warning', 'error', 'success', 'info'] as const).map(intent => (
        <InlineAlert
          key={intent}
          intent={intent}
          hasTitle
          title={`${intent.charAt(0).toUpperCase() + intent.slice(1)} alert`}
          body="This is an example inline alert message."
        />
      ))}
    </div>
  ),
};

export const NoDismiss: Story = {
  args: {
    intent: 'error',
    hasDismiss: false,
    body: 'Your account has been suspended. Contact support to restore access.',
  },
};
```

---

## 9. Auto-Close / Progress Bar Integration

When using `hasProgressBar=true` for auto-close alerts:

```tsx
const [progress, setProgress] = React.useState(100);
const [visible, setVisible] = React.useState(true);
const DURATION = 5000; // ms

React.useEffect(() => {
  if (!visible) return;
  const interval = setInterval(() => {
    setProgress(p => {
      if (p <= 0) {
        clearInterval(interval);
        setVisible(false);
        return 0;
      }
      return p - (100 / (DURATION / 100));
    });
  }, 100);
  return () => clearInterval(interval);
}, [visible]);

// In render:
// Set the progress bar fill width to `${progress}%`
// The narrow bar at the bottom drains left-to-right
```

**CSS for the draining animation:**
```css
.inline-alert__progress-fill {
  height: 100%;
  background: var(--feedback-{intent}-border);
  border-radius: 9999px;
  transition: width 0.1s linear;
}
```

---

## 10. Variant Matrix

| Variant | Node | Intent | Notes |
|---|---|---|---|
| Intent=Warning | 1176:205 | warning | Default variant |
| Intent=Error | 1176:5933 | error | Uses #8f0e0e (red/700) |
| Intent=Success | 1176:5976 | success | |
| Intent=Info | 1176:6019 | info | |

---

## 11. Engineering Notes

- Width is always `100%` of container — never set a fixed width
- Height grows with content — do not constrain height
- The `alert-actions` row only renders when `hasAction1=true`. If only a secondary action is needed, set `hasAction1=true` and hide the first link label or make it a spacer
- `hasFocus` is internal in code — driven by CSS `:focus-visible` on the dismiss/action elements, not a prop
- `progressValue` (0–100) controls the `progress-fill` width. The percentage text is separate — update both independently
- `feedback/error/border` = `red/700` = `#8f0e0e` — do not use the old `#f43f5e` value

---

## 12. Migration from Venus 2.0

| Venus 2.0 | Venus 2.1 RF | Change |
|---|---|---|
| `Banner / Type=Alert` | `InlineAlert intent="warning"` | Rename |
| `Banner / Type=Critical` | `InlineAlert intent="error"` | Rename + new red |
| `Banner / Type=Success` | `InlineAlert intent="success"` | Token-bound |
| `Banner / Type=Info` | `InlineAlert intent="info"` | Token-bound |
| `Size=Large` | Default (no size axis) | Simplified |
| `Size=Small` | `hasTitle=false, hasAction1=false, hasDismiss=false` | Decomposed |

