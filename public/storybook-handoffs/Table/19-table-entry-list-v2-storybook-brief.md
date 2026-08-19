# Table/Entry-List-v2 — Storybook Engineering Brief

```yaml
component_name: TableEntryListV2
figma_node_id: "1146:63354"
figma_page: "📊 Data List"
version: "1.0.0"
status: Active
mode: NEW
build_order: 19
depends_on: [TableHeaderRow, TableDataRow, TableHeaderCell, TableActionsCell]
used_by: [TableDataTableV2]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

The scrollable table body: composes one Header-Row, N Data-Row instances, and a separately-tracked "actions" column that scrolls independently alongside the main columns (its own header cell + its own column of Actions-Cells, structurally parallel to the main table-body rather than nested inside each Data-Row).

## 2. Anatomy

```
Entry-List-v2 (variant: Density)
├─ table-body (FRAME)
│  ├─ header-row (SLOT) → Table/Header-Row instance
│  └─ data-rows (SLOT) → Table/Data-Row instances (N, repeated)
├─ actions-column (FRAME — a SEPARATE parallel column, not nested per-row)
│  ├─ actions-header-cell (INSTANCE — its own header cell: label, badge, sort icon, filter icon)
│  └─ action-cells (SLOT) → Table/Actions-Cell instances (N, one per data row, must stay in sync)
├─ scrollbar-v (FRAME + thumb)
└─ scrollbar-h (FRAME + thumb)
```

**Architectural note carried into code:** the actions column is NOT a cell inside each Data-Row's own `cells` slot — it's a structurally separate, parallel column rendered alongside the main scrollable body. In a real HTML `<table>` this constraint doesn't naturally exist (a `<td>` for actions can simply be the last cell in each `<tr>`, scrolling with the row). Recommend NOT replicating Figma's separate-column architecture literally in code — implement actions as a normal trailing `<td>` inside each row's own `<tr>` via `TableActionsCell`, sticky-positioned via CSS `position: sticky; right: 0` if it needs to stay visible during horizontal scroll. Flagging this as a deliberate deviation from the literal Figma structure, not an oversight — the Figma structure exists for design-tool convenience (independent editing of the actions column), and does not represent an actual UX requirement to implement two structurally separate scroll regions.

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `Density` | VARIANT | `Default` | `density: 'Default' \| 'Compact'` |
| header row | — | — | `columns: TableColumnDef[]` (drives both Header-Row and each Data-Row's cells) |
| data rows | — | — | `rows: RowData[]` |
| actions column | — | — | `rowActions?: (row: RowData) => { onEdit?: () => void; onDelete?: () => void }` |
| selection | — | — | `selectionMode?: 'checkbox' \| 'radio' \| 'none'`, `selectedIds: Set<string>`, `onSelectionChange` |

## 4. React Implementation Sketch

```tsx
export interface TableColumnDef<Row = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render: (row: Row) => React.ReactNode; // returns a TableDataCell element
}

export interface TableEntryListV2Props<Row extends { id: string }> {
  columns: TableColumnDef<Row>[];
  rows: Row[];
  density?: 'Default' | 'Compact';
  selectionMode?: 'checkbox' | 'radio' | 'none';
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  rowActions?: (row: Row) => { onEdit?: () => void; onDelete?: () => void };
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;
}

export function TableEntryListV2<Row extends { id: string }>({
  columns, rows, density = 'Default', selectionMode = 'none', selectedIds, onSelectionChange,
  rowActions, sortColumn, sortDirection, onSort,
}: TableEntryListV2Props<Row>) {
  const allSelected = selectionMode === 'checkbox' && rows.length > 0 && rows.every((r) => selectedIds?.has(r.id));
  const someSelected = selectionMode === 'checkbox' && rows.some((r) => selectedIds?.has(r.id));

  return (
    <div className="table-entry-list" role="table">
      <table>
        <TableHeaderRow
          density={density}
          showSelectAllColumn={selectionMode === 'checkbox'}
          selectAllState={allSelected ? true : someSelected ? 'indeterminate' : false}
          onSelectAll={(checked) => onSelectionChange?.(checked ? new Set(rows.map((r) => r.id)) : new Set())}
        >
          {columns.map((col) => (
            <TableHeaderCell
              key={col.key}
              label={col.label}
              sortDirection={sortColumn === col.key ? sortDirection : null}
              onSort={col.sortable ? () => onSort?.(col.key) : undefined}
              filterable={col.filterable}
            />
          ))}
          {rowActions && <TableHeaderCell label="Actions" />}
        </TableHeaderRow>
        <tbody>
          {rows.map((row) => {
            const actions = rowActions?.(row);
            return (
              <TableDataRow
                key={row.id}
                rowId={row.id}
                density={density}
                showSelectionColumn={selectionMode !== 'none'}
                selectionMode={selectionMode === 'radio' ? 'radio' : 'checkbox'}
                groupName={selectionMode === 'radio' ? 'table-selection' : undefined}
                selected={selectedIds?.has(row.id)}
                onSelectChange={(checked) => {
                  if (selectionMode === 'radio') { onSelectionChange?.(new Set([row.id])); return; }
                  const next = new Set(selectedIds);
                  checked ? next.add(row.id) : next.delete(row.id);
                  onSelectionChange?.(next);
                }}
              >
                {columns.map((col) => <React.Fragment key={col.key}>{col.render(row)}</React.Fragment>)}
                {actions && <TableActionsCell rowLabel={row.id} density={density} {...actions} />}
              </TableDataRow>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

## 5. Accessibility

- Real `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>` throughout — never a `<div>`-grid table impersonation. This is what makes native screen reader table navigation work at all.
- `Select all` checkbox state (`true`/`false`/`'indeterminate'`) must be computed from actual row selection, not tracked as separate disconnected state — shown correctly above via `allSelected`/`someSelected` derivation.
- Sticky actions column (if implemented per §2's recommendation) must not break horizontal scroll keyboard access — test with keyboard-only horizontal scrolling.

## 6. Storybook Stories

| Story | Args |
|---|---|
| `CheckboxSelection` | multi-select interaction test: select 2 rows, verify select-all indeterminate → checked |
| `RadioSelection` | single-select interaction test |
| `NoSelection` | selectionMode='none' |
| `Sortable` | onSort wired, interaction test clicking header |
| `WithRowActions` | rowActions set, per-row Edit/Delete |
| `EmptyRows` | rows=[] — verify empty-state rendering (cross-reference Accordion's empty-state pattern for visual consistency if applicable) |
| `Compact` | density='Compact' |

## 7. Do / Don't

| Do | Don't |
|---|---|
| Implement actions as a normal trailing `<td>` per row | Don't replicate Figma's separate-scroll-region actions column literally — it's a design-tool artifact, not a UX requirement |
| Derive select-all state from actual row selection | Don't track a separate disconnected "all selected" boolean |

## 8. Decision Log

| Question / Alternative considered | Resolution |
|---|---|
| Replicate Figma's structurally separate actions column (independent scroll region) | Rejected for code — implement as a normal trailing cell per row instead; the Figma structure is a design-tool convenience, not an intended UX behavior. Flagging explicitly so this isn't silently "fixed" back to matching Figma structure in a later revision without someone making that call again knowingly. |
