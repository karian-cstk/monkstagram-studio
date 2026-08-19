# Table/Header-Row — Storybook Engineering Brief

```yaml
component_name: TableHeaderRow
figma_node_id: "1210:78716"
figma_page: "📊 Data List"
version: "1.0.0"
status: Active
mode: NEW
build_order: 14
depends_on: [TableHeaderCell]
used_by: [TableEntryListV2]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

The single header row for a table — composes N `Table/Header-Cell` instances via a slot, plus an optional dedicated select-all checkbox column.

## 2. Anatomy

```
Header-Row (variant: Density)
├─ header-cells (SLOT — accepts Table/Header-Cell instances)
└─ hasCheckbox (BOOLEAN) — when true, a 48px checkbox-alignment column renders via Table/Header-Cell's own Alignment=Checkbox variant, not a separate structure
```

**Important semantic note (established this session while fixing Table/Data-Row):** when the table body uses `selectionControl=Radio` (single-select), `hasCheckbox` on Header-Row should be set to `false` — a "select all" control is meaningless for single-select tables. This is a usage/assembly decision the consumer makes; Header-Row itself has no awareness of the row-level selection mode.

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `hasCheckbox` | BOOLEAN | `true` | `showSelectAllColumn?: boolean` |
| `Density` | VARIANT | `Default` | `density: 'Default' \| 'Compact'` |
| `header-cells` | SLOT | — | `children: ReactNode` (array of `TableHeaderCell` elements) |

## 4. React Implementation Sketch

```tsx
export interface TableHeaderRowProps {
  showSelectAllColumn?: boolean;
  selectAllState?: boolean | 'indeterminate';
  onSelectAll?: (checked: boolean) => void;
  density?: 'Default' | 'Compact';
  children: React.ReactNode; // TableHeaderCell elements
}

export function TableHeaderRow({ showSelectAllColumn, selectAllState, onSelectAll, density = 'Default', children }: TableHeaderRowProps) {
  return (
    <thead>
      <tr className={cx('table-header-row', `density-${density.toLowerCase()}`)}>
        {showSelectAllColumn && (
          <TableHeaderCell align="checkbox" selectAllState={selectAllState} onSelectAll={onSelectAll} />
        )}
        {children}
      </tr>
    </thead>
  );
}
```

## 5. Accessibility

- Renders as `<thead><tr>` with real `<th>` children (from Table/Header-Cell) — never a `<div>`-based fake table, so screen readers get real table navigation (Ctrl+Alt+Arrow in common screen readers).

## 6. Storybook Stories

| Story | Args |
|---|---|
| `Default` | 4 header cells, no checkbox column |
| `WithSelectAll` | showSelectAllColumn=true |
| `Compact` | density=Compact |

## 7. Do / Don't

| Do | Don't |
|---|---|
| Turn off the select-all column when the table body uses radio (single-select) | Don't show a select-all checkbox above a single-select table |

## 8. Decision Log

None outstanding — this exact rule was established and documented this session while building Table/Data-Row's Checkbox/Radio swap.
