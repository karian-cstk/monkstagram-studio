# Tooltip — Storybook Brief
**Venus 2.1 RF · Component · v1.0.0 · 2026-06-24**
**Page:** 💬 Feedback & Status · **Node:** `993:1491`

---

## 1. Purpose

`Tooltip` displays a short, non-interactive contextual label that clarifies the purpose of a UI element — typically an icon button, a truncated label, a disabled control, or a form field with a supplemental hint. It appears on hover or keyboard focus and dismisses when focus leaves the trigger.

**Use when:**
- An icon button has no visible text label and its function is not universally obvious
- A UI element's label is truncated and the full value is needed
- A disabled control requires a brief explanation for why it is unavailable

**Do not use when:**
- The content is interactive (contains links or buttons) → use **Popover**
- The content is longer than 2–3 short lines → use **Popover**
- The information is critical and must always be visible → use **Inline Helper Text**
- The trigger is touch-only (tooltip is keyboard/hover only)

**Tooltip is never the sole means of conveying critical information.** It is supplemental.

---

## 2. Anatomy

```
┌─────────────────────────────────────────────┐  ← tooltip-body (VECTOR)
│  Tooltip label text that can wrap to         │    Boolean union: rounded rect + arrow
│  multiple lines if needed                    │    surface/inverse fill
└───────────────┬─────────────────────────────┘    Elevation/Level 2 shadow
                ▼  ← arrow (part of tooltip-body union, not a separate element)
         [trigger element]
```

**Layer → DOM mapping:**

| Figma Layer | DOM Element | Role |
|---|---|---|
| `tooltip-root` | `<div class="tooltip">` | Positioning wrapper, `role="tooltip"`, `id` for `aria-describedby` |
| `tooltip-body` | `<div class="tooltip__body">` | Visual shape — CSS `clip-path` or SVG background |
| `tooltip-content` | `<div class="tooltip__content">` | Padding wrapper for text |
| `tooltip-label` | `<p class="tooltip__label">` | Label text, `Body/MD` style |

**Arrow direction** is controlled by the `arrowPosition` prop — it determines which CSS class is applied to the root, which sets the arrow position via `clip-path` or a CSS pseudo-element triangle.

---

## 3. TypeScript Props Interface

```typescript
export interface TooltipProps {
  /** Controls which side the arrow points toward (the trigger side).
   *  'none' renders a floating bubble with no directional arrow.
   *  @default 'bottom'
   */
  arrowPosition?: 'bottom' | 'top' | 'left' | 'right' | 'none';

  /** The text content displayed inside the tooltip.
   *  Wraps at max-width (240px). Multi-line supported.
   *  @required
   */
  label: string;

  /** The ID of the trigger element. Used to wire aria-describedby.
   *  @required
   */
  triggerId: string;

  /** Additional CSS class names to apply to the root element.
   *  @optional
   */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | Type | React Prop | Notes |
|---|---|---|---|
| `arrowPosition` | Variant | `arrowPosition?: 'none' \| 'top' \| 'bottom' \| 'left' \| 'right'` | Drives CSS modifier class |
| `label` | Text | `label: string` | Direct text content |
| — | — | `triggerId: string` | Not in Figma — required for `aria-describedby` wiring |
| Visibility | — | Controlled by parent (hover/focus state on trigger) | Not a prop — managed by trigger component or Tooltip wrapper |

**CSS class convention:**
```
.tooltip                         → base
.tooltip--arrow-top              → arrowPosition='top'
.tooltip--arrow-bottom           → arrowPosition='bottom'
.tooltip--arrow-left             → arrowPosition='left'
.tooltip--arrow-right            → arrowPosition='right'
```

---

## 5. State Behaviour

Tooltip has no interactive states of its own. It is either **visible** or **hidden** — controlled entirely by its trigger.

| Trigger event | Tooltip behaviour |
|---|---|
| `mouseenter` on trigger | Show tooltip after 300ms delay (prevents flicker on pass-through) |
| `mouseleave` on trigger | Hide immediately |
| `focus` on trigger (`:focus-visible`) | Show tooltip immediately |
| `blur` on trigger | Hide immediately |
| `Escape` key | Hide tooltip, return focus to trigger |
| Touch / tap | Not shown (tooltip is hover/keyboard only) |

**Show delay:** 300ms on hover to prevent tooltip flicker when cursor passes through the trigger region. No delay on keyboard focus — screen reader users need immediate feedback.

**Animation:**
- Enter: `opacity 0 → 1`, `duration/fast` (100ms), `easing/ease-out`
- Exit: immediate (no fade-out — avoids obscuring UI during rapid interactions)
- `prefers-reduced-motion`: skip all animation, show/hide instantly

---

## 6. Size Specification

Single size. No `size` prop.

| Property | Value | Token |
|---|---|---|
| Min width | 40px | — |
| Max width | 240px | — |
| Height | HUG — content-driven | — |
| Padding horizontal | 12px | `space/12` |
| Padding vertical | 8px | `space/8` |
| Corner radius | 6px | `radius/6` |
| Arrow base | 8px | — |
| Arrow height | 6px | — |
| Arrow position | Centred on its edge | — |
| Font | Body/MD — 14px Regular | `Venus_Typography/Body/MD` |
| Line height | 150% | Set manually — never bound |

**Multi-line:** Text wraps at `max-width: 240px`. Height grows with content — there is no maximum height.

---

## 7. Token Reference

| Layer | Property | Token | Resolved value | Note |
|---|---|---|---|---|
| `tooltip-body` | Fill | `surface/overlay` | gray/800 `#1F2937` | Pinned to Dark mode via `explicitVariableModes` |
| `tooltip-body` | Stroke | `surface/overlay` | gray/800 `#1F2937` | Matches fill — border invisible, seamless edge |
| `tooltip-body` | Shadow | `Elevation/Level 2 — Dropdown` | 3-layer black shadow | Applies to full union shape including arrow |
| `tooltip-label` | Color | `text/default` | gray/50 `#F9FAFB` | Inherits Dark mode from parent layer pin |
| `tooltip-label` | Text style | `Body/MD` | 14px / Regular / 150% | Style applied manually in Figma UI |

**CSS custom properties:**
```css
.tooltip {
  background-color: var(--surface-overlay); /* #1F2937 — dark mode pinned */
  color: var(--text-default);               /* #F9FAFB in dark context */
  font: var(--body-md-font-size) / var(--body-md-line-height) var(--font-family-ui);
  font-weight: var(--body-md-font-weight);
  padding: var(--space-8) var(--space-12);
  border-radius: var(--radius-6);
  min-width: 40px;
  max-width: 240px;
  box-shadow: var(--elevation-level-2);
  z-index: var(--z-index-tooltip); /* 600 */
}
```

**Elevation/Level 2 — Dropdown** shadow composition:
```css
box-shadow:
  0 2px 4px -1px rgba(0,0,0,0.20),   /* umbra — key directional */
  0 5px 5px  0px rgba(0,0,0,0.14),   /* penumbra — soft spread */
  0 1px 10px 0px rgba(0,0,0,0.12);   /* ambient — surround */
```

**Contrast:** `text/default` Dark (gray/50 `#F9FAFB`) on `surface/overlay` Dark (gray/800 `#1F2937`) = **13.8:1** WCAG AAA ✅

**No Venus_Components tokens.** Both token bindings go directly to `Venus_Semantics`. Dark mode is pinned on `tooltip-body` via `explicitVariableModes` — `tooltip-label` inherits the same mode context automatically.

---

## 8. Accessibility

| Criterion | Requirement | Implementation |
|---|---|---|
| ARIA role | `role="tooltip"` | On the tooltip root element |
| Trigger association | `aria-describedby="[tooltip-id]"` | Set on the trigger element, references tooltip `id` |
| Keyboard trigger | `:focus-visible` on trigger shows tooltip | CSS + JS event listener on `focus` |
| Keyboard dismiss | `Escape` key dismisses tooltip | `keydown` handler on `document` |
| Mouse trigger | `mouseenter` / `mouseleave` on trigger | JS event listeners |
| Not focusable | Tooltip itself never receives focus | No `tabindex`. `role="tooltip"` implies non-interactive |
| Screen reader | Content announced when trigger is focused | `aria-describedby` wires the tooltip text to the trigger |
| Contrast | 13.8:1 — AAA | `text/default` Dark on `surface/overlay` Dark |
| Reduced motion | No animation | `@media (prefers-reduced-motion: reduce)` removes transition |
| Touch | Not required to appear | Tooltip is hover/keyboard only — acceptable for desktop SaaS |
| Critical info | Never sole means | Tooltip content must always be supplemental, not the only label |

**WCAG success criteria covered:**
- 1.4.3 Contrast (Minimum) — **AAA**
- 1.4.11 Non-text Contrast — shadow provides sufficient separation
- 2.1.1 Keyboard — fully operable via focus
- 2.4.7 Focus Visible — trigger must have visible focus ring (handled by trigger component)
- 4.1.3 Status Messages — tooltip content is announced via `aria-describedby`

---

## 9. Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Non-interactive overlay that surfaces a short contextual label on hover or keyboard focus.',
      },
    },
  },
  argTypes: {
    arrowPosition: {
      control: 'select',
      options: ['bottom', 'top', 'left', 'right', 'none'],
      description: 'Which side the arrow points toward (the trigger side). bottom is the most common usage.',
    },
    label: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

// Default — most common usage: bubble above trigger, arrow pointing down
export const Default: Story = {
  args: {
    arrowPosition: 'bottom',
    label: 'Edit entry',
    triggerId: 'trigger-default',
  },
};

// No arrow — floating bubble, position computed at runtime
export const NoArrow: Story = {
  args: {
    arrowPosition: 'none',
    label: 'No directional arrow',
    triggerId: 'trigger-none',
  },
};

// Arrow pointing up — bubble sits below trigger
export const ArrowTop: Story = {
  args: {
    arrowPosition: 'top',
    label: 'Tooltip below the trigger',
    triggerId: 'trigger-top',
  },
};

// Arrow pointing left — bubble sits to the right of trigger
export const ArrowLeft: Story = {
  args: {
    arrowPosition: 'left',
    label: 'Tooltip to the right',
    triggerId: 'trigger-left',
  },
};

// Arrow pointing right — bubble sits to the left of trigger
export const ArrowRight: Story = {
  args: {
    arrowPosition: 'right',
    label: 'Tooltip to the left',
    triggerId: 'trigger-right',
  },
};

// Multi-line — content exceeds one line
export const MultiLine: Story = {
  args: {
    arrowPosition: 'bottom',
    label: 'This tooltip contains a longer description that wraps onto multiple lines within the 240px max-width constraint.',
    triggerId: 'trigger-multiline',
  },
};

// Dark mode — token values invert correctly
export const DarkMode: Story = {
  args: {
    arrowPosition: 'bottom',
    label: 'Dark mode tooltip',
    triggerId: 'trigger-dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
```

---

## 10. Implementation Notes

**Arrow implementation — two valid approaches:**

*Option A — CSS clip-path (recommended for simplicity):*
```css
.tooltip { position: relative; }
.tooltip::after {
  content: '';
  position: absolute;
  width: 0; height: 0;
  border: 4px solid transparent; /* half of ARR_W */
}
/* Arrow pointing down (bubble above trigger): */
.tooltip--arrow-bottom::after {
  border-top-color: var(--surface-inverse);
  bottom: -8px; /* ARR_H + border thickness */
  left: 50%;
  transform: translateX(-50%);
}
/* Repeat for top, left, right with equivalent adjustments */
```

*Option B — SVG background (matches Figma union exactly):*
Use an inline SVG as the component background. The rounded rect + triangle are a single `<path>` element, matching the Figma boolean union. Shadow applied via CSS `filter: drop-shadow()` rather than `box-shadow` — this is essential as `box-shadow` does not follow the path of an SVG shape.

```css
/* For SVG approach, use filter instead of box-shadow */
.tooltip {
  filter:
    drop-shadow(0 2px 4px rgba(0,0,0,0.20))
    drop-shadow(0 5px 5px rgba(0,0,0,0.14))
    drop-shadow(0 1px 10px rgba(0,0,0,0.12));
}
```

**Positioning:** Tooltip is `position: absolute` within a `position: relative` wrapper. The consuming component (e.g. `IconButton`) manages show/hide and positions the tooltip relative to its trigger. Recommend a lightweight positioning utility (e.g. Floating UI / Popper.js) for viewport-aware placement in production.

**Show delay:** Implement a 300ms delay on `mouseenter` using `setTimeout`. Clear the timeout on `mouseleave` before it fires to prevent tooltip appearing after the cursor has moved away.

**z-index:** Use `--z-index-tooltip` (600). This sits above modals (400), toasts (500), and sticky headers (200).

**Dark mode:** Token values (`surface/inverse`, `text/inverse`) automatically invert in Dark mode via CSS custom property swaps. No implementation change needed.

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .tooltip { transition: none; }
}
```

---

## 11. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use for icon buttons with no visible label — "Delete", "Copy", "Edit" | Use for actions with a visible text label — tooltip adds no value |
| Keep label to 1–2 short lines maximum for clarity | Write paragraph-length content in a tooltip — use Popover |
| Always pair with `aria-describedby` on the trigger | Use tooltip as the only label for a critical action |
| Use `arrowPosition` to point toward the trigger element | Point the arrow away from the trigger — it will confuse users |
| Let the tooltip dismiss on `mouseleave` / `blur` immediately | Keep the tooltip open after the trigger loses focus |
| Apply tooltip to a disabled control to explain why it is disabled | Assume users will discover why a control is disabled without a tooltip |
| Use `arrowPosition='none'` when position is computed dynamically | Force a directional arrow when placement direction is unknown at design time |
| Respect `prefers-reduced-motion` — disable animation | Animate tooltip entry on reduced-motion devices |

---

## 12. Related Components

| Component | Relationship | When to use instead |
|---|---|---|
| **Popover** | Superset — interactive overlay | When tooltip content contains links, buttons, or formatted content |
| **Inline Helper Text** | Persistent sibling — always visible | When information must always be visible, not on-demand |
| **Modal** | Heavyweight overlay | When the user must respond before continuing |
| **Badge** | Non-interactive label | When status information should be permanently visible on a surface |
| **Tag** | Interactive label | When the label represents a user-applied attribute that can be removed |
