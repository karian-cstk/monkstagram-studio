# Checkbox — Storybook Engineering Brief

```yaml
component_name: Checkbox
figma_node_id: "652:30460"
figma_page: "🔘 Actions"
version: "1.0.0"
status: Active
mode: NEW
build_order: 2
depends_on: [IconWrapper]
used_by: [TableDataRow, TableHeaderCell, ListCascadingItem]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

Standard selection control for multi-select contexts: forms, table row selection, list filters. Supports an indeterminate state for parent/child selection hierarchies.

## 2. Anatomy

```
Checkbox (variants: Selection × State × Size)
├─ box-container
│  ├─ focus-ring (FRAME, visible when hasFocus)
│  └─ checkbox-control (FRAME — the visible box; shows check/dash glyph when Checked/Indeterminate)
└─ content (hidden entirely when hasLabel=false)
   ├─ label-row
   │  └─ label (TEXT)
   └─ subtext (TEXT, shown when hasSubtext)
```

When `hasLabel=false` the root frame's authored width does NOT auto-shrink (Figma FIXED-mode quirk, confirmed this session on multiple components) — in code this has no equivalent problem since the box and label are independently laid out; implement with a real flex row, not a fixed-width container.

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `Selection` | VARIANT | `Unchecked` | `checked: boolean \| 'indeterminate'` — options Checked/Unchecked/Indeterminate |
| `State` | VARIANT | `Default` | derived from `disabled`/`:hover`/`:focus-visible`, not a prop |
| `Size` | VARIANT | `sm` | `size: 'sm' \| 'md'` (16px / 20px box) |
| `hasFocus` | BOOLEAN | `false` | not a prop — driven by native `:focus-visible`, see §7 |
| `label` | TEXT | `"Checkbox label"` | `children` or `label` prop |
| `hasLabel` | BOOLEAN | `true` | `hideLabel?: boolean` (label still needed for a11y even when visually hidden — see §7) |
| `hasLeadingIcon` | BOOLEAN | `false` | `leadingIcon?: ComponentType` |
| `hasSubtext` | BOOLEAN | `false` | `subtext?: string` |
| `isDisabled` | BOOLEAN | `false` | `disabled: boolean` |

## 4. Token Reference

| State | Layer | Token |
|---|---|---|
| Unchecked | box border | `border/default` |
| Checked/Indeterminate | box fill | `action/primary` |
| Checked/Indeterminate | glyph | `text/inverse` (white check/dash) |
| Focused | ring | `border/focus`, 2px, `focus/ring/width` |
| Disabled | whole control | `visibility/disabled` (0.40 opacity, cascading) |

## 5. React Implementation Sketch

```tsx
export interface CheckboxProps {
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
  label?: string;
  hideLabel?: boolean;
  subtext?: string;
  leadingIcon?: React.ComponentType;
  disabled?: boolean;
  id?: string;
}

export function Checkbox({
  checked, onCheckedChange, size = 'sm', label, hideLabel, subtext, leadingIcon: Leading, disabled, id,
}: CheckboxProps) {
  const boxPx = size === 'sm' ? 16 : 20;
  return (
    <label className={cx('checkbox-root', disabled && 'is-disabled')} htmlFor={id}>
      <span className="checkbox-box" style={{ width: boxPx, height: boxPx }} data-state={checked}>
        <input
          type="checkbox"
          id={id}
          checked={checked === true}
          ref={(el) => { if (el) el.indeterminate = checked === 'indeterminate'; }}
          onChange={(e) => onCheckedChange(e.target.checked)}
          disabled={disabled}
          className="checkbox-native-input" // visually hidden, drives :focus-visible + native semantics
        />
        {checked === 'indeterminate' ? <DashIcon /> : checked === true ? <CheckIcon /> : null}
      </span>
      {Leading && <Leading aria-hidden />}
      {!hideLabel && label && (
        <span className="checkbox-content">
          <span className="checkbox-label">{label}</span>
          {subtext && <span className="checkbox-subtext">{subtext}</span>}
        </span>
      )}
      {hideLabel && label && <span className="visually-hidden">{label}</span>}
    </label>
  );
}
```

## 6. CSS Implementation Notes

- Focus ring: `.checkbox-native-input:focus-visible ~ .checkbox-box { outline: 2px solid var(--border-focus); outline-offset: 2px; }` — do not implement focus via JS state; native `:focus-visible` is correct here and avoids the "same combination shows on mouse click" bug class seen elsewhere this session.
- The real `<input type="checkbox">` is visually hidden (`opacity:0`, absolutely positioned over the visible box) — never `display:none`, which breaks tab order and screen readers.

## 7. Accessibility

- Label is REQUIRED for screen readers even when `hideLabel` is true — render as `.visually-hidden` text, never omit it entirely.
- `indeterminate` is a DOM-only property (not an HTML attribute) — must be set imperatively via ref, as shown above.
- Keyboard: Space toggles. Native `<input>` handles this for free — do not reimplement with `onKeyDown`.

## 8. Storybook Stories

| Story | Args |
|---|---|
| `Default` | Unchecked, sm |
| `Checked` | checked=true |
| `Indeterminate` | checked='indeterminate' |
| `WithSubtext` | subtext set |
| `Disabled` | disabled=true, all 3 checked states |
| `HiddenLabel` | hideLabel=true — a11y test asserts accessible name still present |

## 9. Do / Don't

| Do | Don't |
|---|---|
| Drive checked/unchecked visuals from the real `<input>`'s state via CSS `:checked`/`data-state` | Don't manage a parallel "isChecked" style state disconnected from the native input |
| Keep the native input in the DOM, visually hidden | Don't remove it and fake the interaction with a `<div onClick>` |

## 10. Decision Log

None outstanding — this component's behavior was fully confirmed via live Figma testing this session (Selection/State independent-value behavior verified).
