# Table/Pagination — Storybook Engineering Brief

```yaml
component_name: TablePagination
figma_node_id: "1145:35789"
figma_page: "📊 Data List"
version: "1.0.0"
status: Active
mode: NEW
build_order: 18
depends_on: [IconButton, PaginationPageButton, Select]
used_by: [TableDataTableV2]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 1
```

## 1. Purpose

The bottom bar of a data table: results summary text, page number controls, and a per-page count selector.

## 2. Anatomy

```
Pagination (variants: Density × State)
├─ results-info → results-text (TEXT, e.g. "Showing 26–50 of 1,247 entries")
├─ page-controls
│  ├─ btn-prev (Icon Button)
│  ├─ page-numbers (repeating Pagination/Page-Button + page-ellipsis, see 10-pagination-page-button brief)
│  └─ btn-next (Icon Button)
└─ per-page-control (Select instance — "Showing X per page")
```

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `currentPage` | TEXT | `"1"` | `currentPage: number` |
| `totalPages` | TEXT | `"50"` | `totalPages: number` |
| `totalEntries` | TEXT | `"1,247"` | `totalEntries: number` |
| `Density` | VARIANT | `Default` | `density: 'Default' \| 'Compact'` |
| `State` | VARIANT | `FirstPage` | derived from `currentPage`/`totalPages`, not a direct prop — 4 variants: FirstPage (prev disabled), MiddlePage, LastPage (next disabled), Disabled (whole control) |
| per-page count | — | — | `pageSize: number; pageSizeOptions: number[]; onPageSizeChange: (size: number) => void` |

## 4. React Implementation Sketch

```tsx
export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  density?: 'Default' | 'Compact';
  disabled?: boolean;
}

export function TablePagination({
  currentPage, totalPages, totalEntries, pageSize, pageSizeOptions = [10, 25, 50, 100],
  onPageChange, onPageSizeChange, density = 'Default', disabled,
}: TablePaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalEntries);
  const pages = computeVisiblePages(currentPage, totalPages); // returns (number | 'ellipsis')[]

  return (
    <div className={cx('table-pagination', `density-${density.toLowerCase()}`, disabled && 'is-disabled')}>
      <span className="results-info">Showing {start}–{end} of {totalEntries.toLocaleString()} entries</span>
      <nav aria-label="Pagination" className="page-controls">
        <IconButton icon={ChevronLeftIcon} aria-label="Previous page" disabled={disabled || currentPage === 1} onClick={() => onPageChange(currentPage - 1)} />
        {pages.map((p, i) => p === 'ellipsis'
          ? <PageEllipsis key={`e${i}`} />
          : <PageButton key={p} page={p} active={p === currentPage} density={density} onClick={onPageChange} />
        )}
        <IconButton icon={ChevronRightIcon} aria-label="Next page" disabled={disabled || currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} />
      </nav>
      <Select
        options={pageSizeOptions.map((n) => ({ value: String(n), label: `${n} per page` }))}
        value={String(pageSize)}
        onChange={(v) => onPageSizeChange(Number(v))}
        size="md"
      />
    </div>
  );
}
```

## 5. Accessibility

- Wrap page controls in `<nav aria-label="Pagination">` for landmark navigation.
- Prev/Next buttons disable natively at the boundaries (`disabled` attribute) rather than being clickable-but-no-op.
- Results summary text should update in a way that's announced on page change if the table content updates without a full page reload — consider `aria-live="polite"` on `results-info`.

## 6. Storybook Stories

| Story | Args |
|---|---|
| `FirstPage` / `MiddlePage` / `LastPage` | boundary states |
| `Compact` | density='Compact' |
| `Disabled` | disabled=true |
| `KeyboardNav` | interaction test tabbing through prev/page-numbers/next/select |

## 7. Do / Don't

| Do | Don't |
|---|---|
| Disable prev/next natively at boundaries | Don't leave boundary buttons clickable with a silent no-op |

## 8. Decision Log

| Question | Resolution |
|---|---|
| Exact ellipsis-insertion algorithm (how many page numbers show before collapsing to "…") | `NEEDS_CLARIFICATION` — Figma shows only static example states (e.g. "1 … 24 25 26 … 50"), not the underlying rule for different `totalPages` counts. Implement a standard windowed-pagination algorithm (e.g. always show first, last, current ±1) and confirm the exact window size against more Figma examples if available. |
