# Progress Bar — Storybook Brief
**Venus 2.1 RF | Component: `ProgressBar` | Node: `1183:300` | Page: 💬 Feedback**
**Status: Active | Version: 1.0.0 | Date: 2026-07-05**

---

## 1. Component Overview

A horizontal progress indicator showing completion of a task or time remaining. Two structural sizes: **Default** (8px) for standalone use, **Narrow** (3px) for embedded contexts. Six intents including a dedicated Indeterminate state with a gray candy stripe for pre-status activity.

---

## 2. Figma → React Prop Mapping

| Figma Property | React Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Size` (VARIANT) | `size` | `'default' \| 'narrow'` | `'default'` | |
| `Intent` (VARIANT) | `intent` | `'brand' \| 'error' \| 'success' \| 'warning' \| 'info' \| 'indeterminate'` | `'brand'` | |
| `hasLabel` (BOOL) | `hasLabel` | `boolean` | `false` | Shows label above track |
| `hasPercentage` (BOOL) | `hasPercentage` | `boolean` | `false` | Shows text below track, centered |
| `label` (TEXT) | `label` | `string` | `'Loading…'` | Shown when hasLabel=true |
| `percentage` (TEXT) | `percentageLabel` | `string` | `'0%'` | Display string — separate from `value` |
| — | `value` | `number` | `0` | 0–100, controls fill width in code |

**Note on `value` vs `percentage`:** In Figma, the designer sets the fill width manually to represent progress. In code, `value` (0–100) maps to `width: {value}%` on the fill element. `percentageLabel` is the display string only — update both independently.

---

## 3. TypeScript Interface

```typescript
interface ProgressBarProps {
  size?: 'default' | 'narrow';
  intent?: 'brand' | 'error' | 'success' | 'warning' | 'info' | 'indeterminate';
  value?: number;          // 0–100, controls fill width
  label?: string;          // shown above track when hasLabel=true
  percentageLabel?: string; // shown below track when hasPercentage=true
  hasLabel?: boolean;
  hasPercentage?: boolean;
  className?: string;
  // Accessibility
  'aria-label'?: string;   // required when no visible label
  id?: string;
}
```

---

## 4. Anatomy & Layer Reference

### Default (8px)
```
progress-root (div — role="progressbar")
├── progress-header (div — HORIZONTAL flex, hidden when hasLabel=false)
│   └── progress-label (span — Regular 13px, font-size/13)
└── progress-track (div — FILL width, 8px height, pill shape, clipsContent)
│   └── progress-fill (div — FIXED width = value%, FILL height)
│       [Indeterminate: progress-fill contains 43 stripe rectangles]
└── progress-footer (div — HORIZONTAL flex CENTER, hidden when hasPercentage=false)
    └── progress-percentage (span — Semi Bold 13px, center-aligned)
```

### Narrow (3px)
```
progress-root (div — role="progressbar", 3px height, pill shape)
└── progress-fill (div — FIXED width = value%, FILL height)
    [Indeterminate: 43 stripe rectangles inside fill]
```

---

## 5. Token Reference

| Layer | Property | CSS Custom Property |
|---|---|---|
| `progress-track` | background | `--surface-default` |
| `progress-track` (Narrow root) | background | `--surface-default` |
| `progress-fill` (Brand) | background | `--action-primary` |
| `progress-fill` (Error) | background | `--feedback-error-border` |
| `progress-fill` (Success) | background | `--feedback-success-border` |
| `progress-fill` (Warning) | background | `--feedback-warning-border` |
| `progress-fill` (Info) | background | `--feedback-info-border` |
| `progress-fill` (Indeterminate gap) | background | `--border-default` |
| `progress-fill` (Indeterminate stripes) | background | `--border-strong` |
| `progress-track` (Indeterminate) | background | `--surface-sunken` |
| `progress-label` | color | `--text-subtle` |
| `progress-label` | font-size | `--font-size-13` |
| `progress-percentage` | color | `--text-default` |
| `progress-percentage` | font-size | `--font-size-13` |
| `progress-percentage` | font-weight | `--font-weight-semibold` |
| Root `itemSpacing` | gap | `--space-8` |

---

## 6. ARIA & Accessibility

```tsx
<div
  role="progressbar"
  aria-valuenow={intent === 'indeterminate' ? undefined : value}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-busy={intent === 'indeterminate'}
  aria-label={ariaLabel || label || 'Progress'}
>
```

**When indeterminate:** Remove `aria-valuenow`, set `aria-busy="true"`. Screen reader will announce "Loading" or "busy" depending on the label.

---

## 7. CSS Implementation

```css
.progress-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  width: 100%;
}

/* ── HEADER ── */
.progress-bar__header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.progress-bar__label {
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-regular);
  color: var(--text-subtle);
  flex: 1;
}

/* ── TRACK ── */
.progress-bar__track {
  width: 100%;
  height: 8px;
  background: var(--surface-default);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-bar--narrow .progress-bar__track {
  height: 3px;
}

/* ── FILL ── */
.progress-bar__fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-bar--brand   .progress-bar__fill { background: var(--action-primary); }
.progress-bar--error   .progress-bar__fill { background: var(--feedback-error-border); }
.progress-bar--success .progress-bar__fill { background: var(--feedback-success-border); }
.progress-bar--warning .progress-bar__fill { background: var(--feedback-warning-border); }
.progress-bar--info    .progress-bar__fill { background: var(--feedback-info-border); }

/* ── FOOTER ── */
.progress-bar__footer {
  display: flex;
  justify-content: center;
  width: 100%;
}

.progress-bar__percentage {
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-semibold);
  color: var(--text-default);
  text-align: center;
}

/* ── INDETERMINATE ── */
.progress-bar--indeterminate .progress-bar__track {
  background: var(--surface-sunken);
}

.progress-bar--indeterminate .progress-bar__fill {
  width: 100% !important; /* override value-based width */
  background: repeating-linear-gradient(
    -45deg,
    var(--border-strong) 0px,
    var(--border-strong) 10px,
    var(--border-default) 10px,
    var(--border-default) 20px
  );
  background-size: 28px 28px; /* controls stripe density */
  animation: indeterminate-slide 0.8s linear infinite;
}

@keyframes indeterminate-slide {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 28px 0;
  }
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  .progress-bar__fill {
    transition: none;
  }
  .progress-bar--indeterminate .progress-bar__fill {
    animation: none;
  }
}
```

**Note on Indeterminate animation:** The CSS `background-position` animation slides the repeating diagonal gradient, creating the illusion of moving stripes. The `background-size` should match the stripe repeat distance (`STRIPE_W + GAP = 10 + 10 = 20px` at 45° = `~28px` diagonal). Adjust `animation-duration` to control speed — 0.8s is fast enough to feel active without being distracting for a CMS tool.

---

## 8. Storybook Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['default', 'narrow'] },
    intent: {
      control: 'select',
      options: ['brand', 'error', 'success', 'warning', 'info', 'indeterminate'],
    },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    intent: 'brand',
    value: 60,
  },
};

export const WithLabel: Story = {
  args: {
    intent: 'brand',
    value: 45,
    hasLabel: true,
    label: 'Uploading files…',
    hasPercentage: true,
    percentageLabel: '45%',
  },
};

export const Indeterminate: Story = {
  args: {
    intent: 'indeterminate',
    hasLabel: true,
    label: 'Processing…',
  },
};

export const Narrow: Story = {
  args: {
    size: 'narrow',
    intent: 'brand',
    value: 70,
  },
};

export const NarrowIndeterminate: Story = {
  args: {
    size: 'narrow',
    intent: 'indeterminate',
  },
};

export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['brand', 'error', 'success', 'warning', 'info', 'indeterminate'] as const).map(intent => (
        <ProgressBar
          key={intent}
          intent={intent}
          value={intent === 'indeterminate' ? 0 : 60}
          hasLabel
          label={`Intent: ${intent}`}
          hasPercentage={intent !== 'indeterminate'}
          percentageLabel="60%"
        />
      ))}
    </div>
  ),
};

export const LiveProgress: Story = {
  render: () => {
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
      const interval = setInterval(() => {
        setValue(v => (v >= 100 ? 0 : v + 2));
      }, 100);
      return () => clearInterval(interval);
    }, []);
    return (
      <ProgressBar
        intent="brand"
        value={value}
        hasLabel
        label="Uploading…"
        hasPercentage
        percentageLabel={`${value}%`}
      />
    );
  },
};
```

---

## 9. Variant Matrix

| Variant | Node | Size | Intent |
|---|---|---|---|
| Size=Default, Intent=Brand | 1183:260 | default | brand |
| Size=Default, Intent=Error | 1183:266 | default | error |
| Size=Default, Intent=Success | 1183:272 | default | success |
| Size=Default, Intent=Warning | 1183:278 | default | warning |
| Size=Default, Intent=Info | 1183:284 | default | info |
| Size=Narrow, Intent=Brand | 1183:290 | narrow | brand |
| Size=Narrow, Intent=Error | 1183:292 | narrow | error |
| Size=Narrow, Intent=Success | 1183:294 | narrow | success |
| Size=Narrow, Intent=Warning | 1183:296 | narrow | warning |
| Size=Narrow, Intent=Info | 1183:298 | narrow | info |
| Size=Default, Intent=Indeterminate | 1191:237 | default | indeterminate |
| Size=Narrow, Intent=Indeterminate | 1191:287 | narrow | indeterminate |

---

## 10. Indeterminate State — Figma vs Code

**In Figma:** The Indeterminate variants show a static snapshot of the candy stripe pattern — gray diagonal stripes (border/strong) alternating with the gap color (border/default) on a surface/sunken track. This is a frozen moment; the animation lives in code.

**In code:** The CSS `repeating-linear-gradient` with `animation: indeterminate-slide` slides the background-position to create moving stripes.

**Figma designer notes:**
- Use `Size=Default, Intent=Indeterminate` or `Size=Narrow, Intent=Indeterminate` for the static representation
- Do not set `hasPercentage=true` — there is no completion percentage to show
- For label, use "Loading…", "Processing…", or similar open-ended copy

---

## 11. Inline Alert Integration

When using Progress Bar inside Inline Alert (auto-close timer):

1. Enable `hasProgressBar=true` on the Inline Alert instance
2. The correct intent Narrow variant is automatically placed at the bottom of the alert
3. In code, control the `progress-fill` width via the `value` prop on the embedded ProgressBar
4. Set `hasDismiss=false` on the Inline Alert to prevent manual dismissal during auto-close
5. The progress bar drains from 100% to 0% over the auto-close duration

```tsx
// Auto-close Inline Alert with progress bar
<InlineAlert
  intent="success"
  body="Published successfully. This will close in 5 seconds."
  hasDismiss={false}
  hasProgressBar
>
  <ProgressBar
    slot="progress"
    size="narrow"
    intent="success"
    value={remainingPercent}
  />
</InlineAlert>
```

---

## 12. Engineering Notes

- `progress-fill` width must be set as a percentage (`width: ${value}%`) — not a pixel value
- Add `transition: width 0.3s ease` for smooth updates
- For `prefers-reduced-motion`, remove the transition and indeterminate animation
- `Narrow` variant has no auto-layout — its root IS the track. Set `width: 100%` and `height: 3px` directly
- The `progress-fill` inside the Indeterminate variant contains 43 rotated rectangle children in Figma. In code this is replaced by a single `repeating-linear-gradient`
- `value=0` renders as an invisible fill (correct) — the track still shows via `surface/default` background
- When `intent='indeterminate'`: override `value` to 100 (fill is full width), apply the candy stripe gradient, start the animation

