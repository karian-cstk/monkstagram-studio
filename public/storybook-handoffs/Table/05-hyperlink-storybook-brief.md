# Hyperlink — Storybook Engineering Brief

```yaml
component_name: Hyperlink
figma_node_id: "644:27354"
figma_page: "🔘 Actions"
version: "1.0.0"
status: Active
mode: NEW
build_order: 5
depends_on: [IconWrapper]
used_by: [Accordion, TableDataCell, TableHeaderBar, TableFilterBar]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

Inline text link. Used inside Accordion's footer ("View more"), Table/Data-Cell's Link cell type, the table header bar's "Advanced search" link, and the filter bar's "Show all"/"Clear all" actions.

## 2. Anatomy

```
Hyperlink (variant: Size × State)
├─ leading-icon (INSTANCE, visible when hasLeadingIcon)
├─ label (TEXT)
├─ trailing-icon (INSTANCE, visible when hasTrailingIcon)
└─ focus-ring (FRAME)
```

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `label` | TEXT | `"Hyperlink"` | `children` |
| `hasLeadingIcon` | BOOLEAN | `false` | `leadingIcon?: ComponentType` |
| `hasTrailingIcon` | BOOLEAN | `false` | `trailingIcon?: ComponentType` |
| `selectLeadingIcon` / `selectTrailingIcon` | INSTANCE_SWAP | CaretRight-family | resolved via the `leadingIcon`/`trailingIcon` prop values directly, not a separate swap concept in code |
| `Size` | VARIANT | `sm` | `size: 'sm' \| 'md' \| 'lg' \| 'xl'` |
| `State` | VARIANT | `Default` | derived from native `:hover`/`:active`/`:visited`/`disabled`, not a prop — 5 variants: Default, Hover, Active, Visited, Disabled |
| `hasFocus` | BOOLEAN | `false` | native `:focus-visible` |

## 4. Token Reference

| State | Text color |
|---|---|
| Default | `action/primary` (brand purple) |
| Hover | darker step, `NEEDS_CLARIFICATION` exact token — verify live |
| Visited | `NEEDS_CLARIFICATION` — a distinct visited-state color exists in Figma; confirm exact token before implementation (native `:visited` in CSS has restricted property support — only color-related properties may safely style it) |
| Disabled | `visibility/disabled` cascading opacity |

## 5. React Implementation Sketch

```tsx
export interface HyperlinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  leadingIcon?: React.ComponentType;
  trailingIcon?: React.ComponentType;
  disabled?: boolean;
}

export function Hyperlink({ size = 'sm', leadingIcon: Leading, trailingIcon: Trailing, disabled, children, ...anchorProps }: HyperlinkProps) {
  return (
    <a
      className={`hyperlink hyperlink--${size}`}
      aria-disabled={disabled || undefined}
      onClick={disabled ? (e) => e.preventDefault() : anchorProps.onClick}
      {...anchorProps}
    >
      {Leading && <Leading aria-hidden />}
      <span className="hyperlink-label">{children}</span>
      {Trailing && <Trailing aria-hidden />}
    </a>
  );
}
```

## 6. Accessibility

- Render as a real `<a>` when it navigates, or a `<button>` styled identically when it triggers an action without navigation (e.g. "Show all" expanding a filter bar in place) — do not use `<a href="#">` for non-navigating actions, it's a common but incorrect pattern that breaks screen reader expectations.
- `disabled` on an anchor has no native effect — must be simulated via `aria-disabled` + blocking the click handler, as shown.

## 7. Storybook Stories

| Story | Args |
|---|---|
| `AllSizes` | 4 sizes |
| `WithLeadingIcon` / `WithTrailingIcon` | icon set |
| `Disabled` | disabled=true |
| `AsButton` | rendered as `<button>` variant for non-navigating usage |

## 8. Do / Don't

| Do | Don't |
|---|---|
| Use `<button>` styled as a hyperlink for non-navigating actions | Don't fake navigation with `href="#"` + `preventDefault` |

## 9. Decision Log

| Question | Resolution |
|---|---|
| Exact Hover/Visited color tokens | `NEEDS_CLARIFICATION` — not individually extracted this session, verify live before implementation. |
