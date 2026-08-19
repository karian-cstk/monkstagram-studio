# Icon Button — Storybook Engineering Brief

```yaml
component_name: IconButton
figma_node_id: "1165:49200"
figma_page: "🔘 Actions"
version: "1.0.0"
status: Active
mode: NEW
build_order: 6
depends_on: [IconWrapper]
used_by: [TableHeaderBar, TableFilterBar, TablePagination, TableHeaderCell]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

Icon-only button for toolbar actions: search, settings, views, density toggle, filter toggle, pagination prev/next, sort. The single most reused interactive atom in the table system.

## 2. Anatomy

```
Icon Button (variants: Type × Size × State)
├─ _Internal/Icon-Wrapper (INSTANCE, swappable — see 01-icon-wrapper brief)
└─ icon-button-focus-ring (FRAME)
```

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `Type` | VARIANT | `Ghost` | `type: 'Ghost' \| 'Primary' \| 'Secondary'` |
| `Size` | VARIANT | `xs` | `size: 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |
| `State` | VARIANT | `Default` | derived, not a prop |
| `hasFocus` | BOOLEAN | `false` | native `:focus-visible` |
| `accessibleLabel` | TEXT | `"Icon button"` | `'aria-label': string` — **required** prop, no visual label exists on an icon-only button |
| `icon` | INSTANCE_SWAP | Star | `icon: ComponentType` — 9 preferred icon options configured in Figma (Star, Kebab, DotsThreeVertical, Tag, View, Preferences, Sliders, Image, FlowArrow); code accepts any icon component, not restricted to these 9 |

44 total variants (Type × Size × State cross product).

## 4. Token Reference

| Type | Default bg | Hover bg | Pressed bg |
|---|---|---|---|
| Ghost | transparent | `surface/interactive/hover` | `surface/interactive/active` |
| Secondary | `action/secondary` | `action/secondary/hover` | darker step |
| Primary | `action/primary` | `action/primary/hover` | darker step |

Icon color follows the system-wide icon-mode rule: Ghost/Secondary → `default` mode (brand purple), Primary → `inverted` (white), Disabled → `disabled` mode (gray).

## 5. React Implementation Sketch

```tsx
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType;
  'aria-label': string; // required, not optional — TS should enforce this
  type?: 'Ghost' | 'Primary' | 'Secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function IconButton({ icon: Icon, type = 'Ghost', size = 'xs', className, ...btnProps }: IconButtonProps) {
  return (
    <button type="button" className={cx('icon-button', `icon-button--${type.toLowerCase()}`, `icon-button--${size}`, className)} {...btnProps}>
      <Icon aria-hidden="true" />
    </button>
  );
}
```

## 6. Accessibility

- `aria-label` is mandatory — enforce at the TypeScript level (make it a required prop, not `aria-label?: string`), since this is the ONLY accessible name source for an icon-only control.
- Focus ring must never be suppressed — confirmed system-wide red line this session (hasFocus wiring hardening).

## 7. Storybook Stories

| Story | Args |
|---|---|
| `AllTypes` | 3 types side by side |
| `AllSizes` | 5 sizes |
| `Disabled` | disabled=true |
| `MissingLabelWarning` | a11y test story asserting the TS type errors / lint rule fires without `aria-label` |

## 8. Do / Don't

| Do | Don't |
|---|---|
| Require `aria-label` at the type level | Don't ship an icon button with only a `title` attribute — insufficient for screen readers |

## 9. Decision Log

None outstanding.
