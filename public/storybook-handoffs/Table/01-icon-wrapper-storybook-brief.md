# Icon-Wrapper — Storybook Engineering Brief

```yaml
component_name: IconWrapper
figma_node_id: "214:152884"
figma_page: "⚛️ Atoms (Unpublished)"
version: "1.0.0"
status: Active
mode: NEW
build_order: 1
depends_on: []
used_by: [Checkbox, Radio, Hyperlink, IconButton, Button, TableHeaderCell, TableDataCell]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 1
```

## 1. Purpose

`_Internal/Icon-Wrapper` is the single foundational primitive every icon-bearing component in Venus 2.1 RF renders through. It is never used directly by product designers — always nested inside another component (Checkbox's leading icon, Button's leading/trailing icon, Table/Header-Cell's sort icon, etc.) which exposes the actual icon choice as its own `INSTANCE_SWAP` property pointing at this wrapper's own swap slot.

## 2. Anatomy

```
Icon-Wrapper (variant: Size)
└─ placeholder (INSTANCE, swappable)
   └─ .root-icon (INSTANCE — the actual glyph, e.g. Star, CaretRight, Check)
```

Two nested `INSTANCE_SWAP` levels exist by design: `selectIcon` (top-level swap consumers normally touch) and `selectIcon2` (a second-order swap used internally when a parent component needs to override the icon independent of size). Both point at the same underlying icon library.

## 3. Props

| Figma property | Type | Default | React prop | Notes |
|---|---|---|---|---|
| `_Internal/Icon-Wrapper/Size` | VARIANT | `12px` | `size` | Options: `12px, 16px, 20px, 24px, 28px, 32px, 40px` |
| `has-focus` | BOOLEAN | `false` | `hasFocus` | Not typically used directly — icon wrapper doesn't manage its own focus ring in normal usage; parent components manage focus. |
| `selectIcon` | INSTANCE_SWAP | Star (`39:457`) | `icon` | The glyph to render. In code this is a `React.ComponentType` or icon-name string resolved against the icon registry, not a literal swap. |
| `selectIcon2` | INSTANCE_SWAP | Star (`41:479`) | — | `NEEDS_CLARIFICATION`: purpose of the second swap slot relative to the first was not documented anywhere accessible this session — flagging rather than guessing. Likely a legacy/internal-only override point; do not expose in the public React API unless product confirms an actual dual-icon use case. |

## 4. Variants

7 sizes: 12px, 16px, 20px, 24px, 28px, 32px, 40px — each a fixed-dimension square container (e.g. `Size=20px` renders a 20×20px box), icon glyph scales to fill.

## 5. Token Reference

No color token lives on the wrapper itself — color is inherited from whichever icon-mode context the PARENT sets (Venus_Icons collection: `default` mode = brand purple, `inverted` = white, `disabled` = gray, `error`/`warning`/`success`/`info` for status icons). The wrapper is a pure sizing/swap container.

## 6. React Implementation Sketch

```tsx
import { type ComponentType, type SVGProps } from 'react';

export type IconWrapperSize = '12px' | '16px' | '20px' | '24px' | '28px' | '32px' | '40px';

export interface IconWrapperProps {
  size?: IconWrapperSize;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
}

const SIZE_PX: Record<IconWrapperSize, number> = {
  '12px': 12, '16px': 16, '20px': 20, '24px': 24, '28px': 28, '32px': 32, '40px': 40,
};

export function IconWrapper({ size = '12px', icon: Icon, className }: IconWrapperProps) {
  const px = SIZE_PX[size];
  return (
    <span className={className} style={{ width: px, height: px, display: 'inline-flex' }}>
      <Icon width={px} height={px} aria-hidden="true" focusable="false" />
    </span>
  );
}
```

## 7. Accessibility

- Always `aria-hidden="true"` — the icon itself never carries semantic meaning; the parent component supplies `accessibleLabel`/`aria-label` on the interactive element that contains it.
- No independent keyboard interaction.

## 8. Storybook Stories

| Story | Args |
|---|---|
| `AllSizes` | Renders all 7 sizes side by side with the same icon, for visual-regression baseline |
| `IconSwap` | Controls story cycling through 5–6 representative icons at a fixed size |

## 9. Do / Don't

| Do | Don't |
|---|---|
| Always pass `aria-hidden` through to the rendered SVG | Never use Icon-Wrapper as a standalone clickable element — wrap in a real button/link |
| Size the wrapper to an exact token value (12/16/20/24/28/32/40) | Don't introduce arbitrary in-between sizes |

## 10. Decision Log

| Question | Resolution |
|---|---|
| Why two INSTANCE_SWAP slots (`selectIcon`, `selectIcon2`)? | `NEEDS_CLARIFICATION` — not resolved this session. Recommend exposing only one `icon` prop in code until product/design confirms the second slot has a real, distinct purpose. |
