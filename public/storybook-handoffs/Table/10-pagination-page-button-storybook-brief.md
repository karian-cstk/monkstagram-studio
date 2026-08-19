# Pagination/Page-Button — Storybook Engineering Brief

```yaml
component_name: PaginationPageButton
figma_node_id: "1145:35616"
figma_page: "📊 Data List"
version: "1.0.0"
status: Active
mode: NEW
build_order: 10
depends_on: []
used_by: [TablePagination]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

Individual numbered page button inside the pagination control (e.g. "1", "2", "…", "24"). Not used standalone — always repeated inside Table/Pagination's page-numbers row.

## 2. Anatomy

Single button-shaped container with one centered text label. No nested instances.

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `label` | TEXT | `"1"` | `page: number` (rendered as string) |
| `State` | VARIANT | `Default` | 5 states: Default, Active, Hover, Focused, Disabled — Active means "this is the current page" |
| `Density` | VARIANT | `Default` | `density: 'Default' \| 'Compact'` |
| `hasFocus` | BOOLEAN | `false` | native `:focus-visible` |

## 4. Token Reference

| State | Background | Text |
|---|---|---|
| Default | transparent | `text/default` |
| Active (current page) | `action/primary` | `text/inverse` |
| Hover | `surface/interactive/hover` | `text/default` |

## 5. React Implementation Sketch

```tsx
export interface PageButtonProps {
  page: number;
  active?: boolean;
  density?: 'Default' | 'Compact';
  onClick: (page: number) => void;
}

export function PageButton({ page, active, density = 'Default', onClick }: PageButtonProps) {
  return (
    <button
      type="button"
      className={cx('page-button', `page-button--${density.toLowerCase()}`, active && 'is-active')}
      aria-current={active ? 'page' : undefined}
      onClick={() => onClick(page)}
    >
      {page}
    </button>
  );
}

// The "…" ellipsis seen in the table's actual pagination is NOT this component —
// it's a separate static text element (`page-ellipsis`) with no interaction. Render as plain <span>.
export function PageEllipsis() {
  return <span className="page-ellipsis" aria-hidden="true">…</span>;
}
```

## 6. Accessibility

- `aria-current="page"` on the active page button — this is the standard way to communicate "you are here" in pagination to assistive tech, don't rely on visual styling alone.
- The ellipsis is decorative only (`aria-hidden`) — it carries no page-jump interaction in the current design (confirmed structurally: `page-ellipsis` is a plain FRAME/TEXT with no button/instance wrapper).

## 7. Storybook Stories

| Story | Args |
|---|---|
| `Default` | page=1 |
| `Active` | active=true |
| `Compact` | density=Compact |
| `Disabled` | disabled |

## 8. Do / Don't

| Do | Don't |
|---|---|
| Mark the current page with `aria-current="page"` | Don't communicate "current page" through color alone |

## 9. Decision Log

None outstanding.
