# Table/Data-Table-v2 — Storybook Engineering Brief

```yaml
component_name: TableDataTableV2
figma_node_id: "1149:42784"
figma_page: "📊 Data List"
version: "1.0.0"
status: Active
mode: NEW
build_order: 20
depends_on: [TableHeaderBar, TableFilterBar, TableEntryListV2, TablePagination]
used_by: []
handover_status: NEEDS_CLARIFICATION
unresolved_question_count: 2
```

## 0. Documentation cross-reference

Table/Data-Row (a direct dependency, via Entry-List-v2) has a full documentation frame on the 📖 Documentation page (Section `2124:62061`) with 11 blocks including a Decision Log and an Updates section — read in full while building this brief; its documented `selectionControl` platform-constraint finding is carried into this brief's dependency chain (§4 of the Table/Data-Row brief, 15). Table/Header-Cell's CSET-level Figma description was found empty (a real, pre-existing documentation gap, not something this session introduced) — flagged in that component's own brief (11) rather than silently filled in here.

## 1. Purpose

The complete data table: header toolbar (search + actions), filter summary bar, scrollable entry list (header row + data rows + actions column), and pagination footer. This is the full assembly a product screen actually consumes.

## 2. Anatomy

```
Data-Table-v2 (variant: Density)
├─ table-header-bar (INSTANCE of Table/Header-Bar — brief 16)
├─ table-filter-bar (INSTANCE of Table/Filter-Bar — brief 17, only rendered when filters are active)
├─ table-entry-list (INSTANCE of Table/Entry-List-v2 — brief 19)
└─ table-pagination (INSTANCE of Table/Pagination — brief 18)
```

Single variant axis: `Density` (Default / Compact) — cascades to every child instance's own `density` prop; there is no independent per-child density override in the current design.

## 3. Props

```tsx
export interface TableDataTableV2Props<Row extends { id: string }> {
  // Header bar
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearch: () => void;
  searchScopeOptions?: SelectOption[];
  onAdvancedSearch?: () => void;
  onSettingsClick?: () => void;
  onViewsClick?: () => void;
  onFiltersClick?: () => void;
  onViewToggle?: (view: 'list' | 'grid') => void;

  // Filter bar
  activeFilters?: { id: string; label: string }[];
  onFilterRemove?: (id: string) => void;
  onShowAllFilters?: () => void;
  onClearAllFilters?: () => void;

  // Entry list
  columns: TableColumnDef<Row>[];
  rows: Row[];
  selectionMode?: 'checkbox' | 'radio' | 'none';
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  rowActions?: (row: Row) => { onEdit?: () => void; onDelete?: () => void };
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;

  // Pagination
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  density?: 'Default' | 'Compact';
}
```

## 4. React Implementation Sketch

```tsx
export function TableDataTableV2<Row extends { id: string }>(props: TableDataTableV2Props<Row>) {
  const { density = 'Default', activeFilters, ...rest } = props;

  return (
    <div className={cx('table-data-table-v2', `density-${density.toLowerCase()}`)}>
      <TableHeaderBar
        searchValue={props.searchValue}
        onSearchChange={props.onSearchChange}
        onSearch={props.onSearch}
        searchScopeOptions={props.searchScopeOptions}
        onAdvancedSearch={props.onAdvancedSearch}
        onSettingsClick={props.onSettingsClick}
        onViewsClick={props.onViewsClick}
        onFiltersClick={props.onFiltersClick}
        onViewToggle={props.onViewToggle}
      />
      {activeFilters && activeFilters.length > 0 && (
        <TableFilterBar
          filterCount={activeFilters.length}
          onShowAll={props.onShowAllFilters}
          onClearAll={props.onClearAllFilters}
        >
          {activeFilters.map((f) => <FilterChip key={f.id} label={f.label} onRemove={() => props.onFilterRemove?.(f.id)} />)}
        </TableFilterBar>
      )}
      <TableEntryListV2
        columns={props.columns}
        rows={props.rows}
        density={density}
        selectionMode={props.selectionMode}
        selectedIds={props.selectedIds}
        onSelectionChange={props.onSelectionChange}
        rowActions={props.rowActions}
        sortColumn={props.sortColumn}
        sortDirection={props.sortDirection}
        onSort={props.onSort}
      />
      <TablePagination
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        totalEntries={props.totalEntries}
        pageSize={props.pageSize}
        pageSizeOptions={props.pageSizeOptions}
        onPageChange={props.onPageChange}
        onPageSizeChange={props.onPageSizeChange}
        density={density}
      />
    </div>
  );
}
```

## 5. Accessibility

- The whole assembly should carry `aria-busy="true"` during async data loading (e.g. page change, filter change, sort change) so screen readers know content is updating — not directly visible in the static Figma frame, listed here as a standard requirement for any async data table.
- See each child brief (16–19) for component-specific accessibility requirements — this brief does not repeat them, per the "no cross-referencing for required content" rule; the props/JSX above are fully self-contained even though rationale detail lives in the child briefs.
- Focus management on page/filter/sort change: focus should not silently jump or get lost. Recommend moving focus to a live region announcing "Showing X of Y results" after any data-changing action, rather than leaving focus on a now-stale element.

## 6. Storybook Stories

| Story | Args |
|---|---|
| `FullFeatured` | every optional prop populated — header bar, filter bar, sortable columns, row actions, checkbox selection, pagination |
| `MinimalTable` | only required props — no filters, no actions, no selection |
| `RadioSelectionTable` | selectionMode='radio' end-to-end |
| `Compact` | density='Compact' |
| `LoadingState` | `aria-busy` interaction test during a simulated async page change |
| `EmptyState` | rows=[] |

## 7. Do / Don't

| Do | Don't |
|---|---|
| Manage `aria-busy` and focus explicitly during async data changes | Don't let focus silently disappear when the row it was on is removed by a filter/sort change |
| Treat this component as a thin composition of briefs 16–19 | Don't duplicate child-component logic (selection state, sort state) at this level — pass it straight through |

## 8. Decision Log

| Question | Resolution |
|---|---|
| Actions-column architecture (separate scroll region in Figma vs. normal trailing cell in code) | See Table/Entry-List-v2 brief (19) §8 — deliberate deviation from literal Figma structure, carried forward here since Data-Table-v2 has no additional say in it. |
| Async loading / `aria-busy` behavior | `NEEDS_CLARIFICATION` — Figma has no loading-state frame for this component; the requirement above is a standard accessibility baseline being added by this brief, not something extracted from Figma. Confirm with design whether a dedicated loading-state visual exists or needs to be designed before implementation. |
| Focus retention across data-changing actions (sort/filter/page change) | `NEEDS_CLARIFICATION` — same reasoning; no Figma frame shows this. Needs an explicit interaction-design decision, not an inferred one. |
