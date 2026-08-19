# Button — Storybook Engineering Brief

```yaml
component_name: Button
figma_node_id: "1489:30020"
figma_page: "🔘 Actions"
version: "1.0.0"
status: Active
mode: NEW
build_order: 7
depends_on: [IconWrapper]
used_by: [TableHeaderBar]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

Primary labeled call-to-action button. In the table system, used specifically for the header bar's "Search" button.

## 2. Anatomy

```
Button (variants: Type × Size × State)
├─ leading-icon (INSTANCE, visible when hasLeadingIcon)
├─ label (TEXT, visible when hasLabel)
├─ trailing-icon (INSTANCE, visible when hasTrailingIcon)
└─ focus-ring (FRAME)
```

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `Type` | VARIANT | `Primary` | `variant: 'Primary' \| 'Secondary' \| 'Tertiary' \| 'Ghost' \| 'Destructive'` |
| `Size` | VARIANT | `md` | `size: 'sm' \| 'md' \| 'lg' \| 'xl'` |
| `State` | VARIANT | `Default` | derived, not a prop |
| `hasLeadingIcon` / `hasTrailingIcon` | BOOLEAN | `true`/`true` | `leadingIcon?` / `trailingIcon?: ComponentType` |
| `hasLabel` | BOOLEAN | `true` | if `false`, button becomes icon-only — in code this is a genuinely different use case; consider directing icon-only needs to Icon Button instead unless a Button-specific icon-only treatment is confirmed intentional |
| `label` | TEXT | `"Button"` | `children` |
| `hasFocus` | BOOLEAN | `false` | native `:focus-visible` |

76 total variants (5 types × 4 sizes × ~4 states, minus invalid combinations).

## 4. Token Reference

md/Primary/Default confirmed live this session: fill = `action/primary`, 4px corner radius, 8px padding all sides, 4px icon-label gap, 32px height (md).

Other Type × State combinations follow the same family pattern established elsewhere this session (Secondary/Tertiary/Ghost/Destructive each have their own `action/{type}`, `action/{type}/hover`, `action/{type}/pressed` token triads) — verify each specific combination live before hardcoding, rather than assuming perfect symmetry across all 5 types.

## 5. React Implementation Sketch

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'Primary' | 'Secondary' | 'Tertiary' | 'Ghost' | 'Destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  leadingIcon?: React.ComponentType;
  trailingIcon?: React.ComponentType;
}

export function Button({
  variant = 'Primary', size = 'md', leadingIcon: Leading, trailingIcon: Trailing, children, className, ...btnProps
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cx('btn', `btn--${variant.toLowerCase()}`, `btn--${size}`, className)}
      {...btnProps}
    >
      {Leading && <Leading aria-hidden />}
      {children && <span className="btn-label">{children}</span>}
      {Trailing && <Trailing aria-hidden />}
    </button>
  );
}
```

## 6. Accessibility

- If `hasLabel=false` is ever genuinely used, the accessible name must come from an explicit `aria-label` prop — flag this combination for review; it may indicate the design intended Icon Button instead.
- Icon color mode follows the same Type-based rule as Icon Button (§4 of that brief).

## 7. Storybook Stories

| Story | Args |
|---|---|
| `AllVariants` | 5 types at md |
| `AllSizes` | 4 sizes at Primary |
| `WithIcons` | leading + trailing both set |
| `Disabled` | disabled=true |

## 8. Do / Don't

| Do | Don't |
|---|---|
| Reach for Icon Button when there's no label | Don't set `hasLabel=false` on Button as a substitute for Icon Button |

## 9. Decision Log

| Question | Resolution |
|---|---|
| Full token set for Secondary/Tertiary/Ghost/Destructive × Hover/Pressed | `NEEDS_CLARIFICATION` — only Primary/md/Default was directly verified this session; pull the rest live before implementation. |
