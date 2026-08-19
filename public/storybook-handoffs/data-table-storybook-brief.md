# Venus 2.1 RF — Storybook Brief
# Data Table Component System
**Version:** 2.1.0  
**Status:** Active  
**Last updated:** 2026-07-04  
**Figma file:** `M6u9MVznfNDO20b0DAC1cu`  
**Page:** 📊 Data List

---

## Component Hierarchy

```
DataTable                          ← Top-level assembly (Table/Data-Table-v2)
├── TableHeaderBar                 ← Search + toolbar actions (_Internal/Table/Header-Bar)
│   ├── SearchInput                ← Search field + optional scope + advanced link
├── TableFilterBar                 ← Active filter chips row (Table/Filter-Bar)
├── TableEntryList                 ← Scrollable data grid (Table/Entry-List-v2)
│   ├── TableHeaderRow             ← Column headers (Table/Header-Row)
│   │   └── TableHeaderCell ×n    ← Individual header cell (Table/Header-Cell)
│   ├── TableDataRow ×n            ← Data rows (Table/Data-Row)
│   │   └── TableDataCell ×n      ← Individual data cell (Table/Data-Cell)
│   └── TableActionsCell ×n       ← Frozen actions column (Table/Actions-Cell)
└── Pagination                     ← Footer navigation (Pagination)
    └── PageButton                 ← Individual page number (Pagination/Page-Button)
```

Each sub-component is independently usable. The assembly composes them.

---
---

# COMPONENT 1 — DataTable

**Figma node:** `1149:42784` | `Table/Data-Table-v2`

---

## 1. Purpose

`DataTable` is the top-level assembly for all list/table views in the Contentstack CMS. It composes a toolbar (header bar), filter bar, scrollable data grid, and pagination footer into a single cohesive unit. It is the primary way users browse, search, filter, sort, and act on collections of content entries.

**Use when:** Displaying a list of structured records that users need to browse, search, filter, sort, and perform actions on.

**Do not use when:** Displaying fewer than 5 items (use a simple list), showing a single item's details (use a detail panel), or showing unstructured content (use a feed or card grid).

---

## 2. Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ table-header-bar    [Search...]  [Search]  [⚙][↕][⊞][≡]        │  ← TableHeaderBar
├─────────────────────────────────────────────────────────────────┤
│ table-filter-bar    ▼ 3 filters applied · Show all | Clear all  │  ← TableFilterBar
├─────────────────────────────────────────────────────────────────┤
│ table-entry-list                                                 │
│  ┌───┬──────────────────────────┬───────────┬──────────────┐   │
│  │ ☐ │ Title ↑↓                 │ Status ↕  │ Actions      │   │  ← TableHeaderRow
│  ├───┼──────────────────────────┼───────────┼──────────────┤   │
│  │ ☐ │ Homepage Hero Banner     │ [Label]   │ ✎ 🗑 ···     │   │  ← TableDataRow
│  │ ☐ │ Homepage Hero Banner     │ [Label]   │ ✎ 🗑 ···     │   │
│  └───┴──────────────────────────┴───────────┴──────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ table-pagination    Showing 1–25 of 1,247  [ 1  2  3 … 50 ]    │  ← Pagination
└─────────────────────────────────────────────────────────────────┘

Outer container: 1px OUTSIDE stroke, border/default (#E5E7EB), cornerRadius=4px
```

**Layer map:**
- `table-header-bar` → `<TableHeaderBar>` — search + toolbar
- `table-filter-bar` → `<TableFilterBar>` — active filter summary/chips
- `table-entry-list` → `<TableEntryList>` — the scrollable grid body
- `table-pagination` → `<Pagination>` — page navigation footer

---

## 3. TypeScript Props Interface

```typescript
interface DataTableProps {
  /** Row density — Default (36px rows) or Compact (28px rows) */
  density?: 'default' | 'compact';

  /** Show or hide the entire header bar (search + toolbar) */
  showHeader?: boolean;

  /** Show or hide the filter bar below the header */
  showFilterBar?: boolean;

  /** Show or hide the pagination footer */
  showPagination?: boolean;

  /** Props passed through to the TableHeaderBar sub-component */
  headerBarProps?: TableHeaderBarProps;

  /** Props passed through to the TableFilterBar sub-component */
  filterBarProps?: TableFilterBarProps;

  /** Column definitions — drives header cells and data cell types */
  columns: ColumnDef[];

  /** Data rows to render */
  rows: RowData[];

  /** Total number of entries (for pagination display) */
  totalEntries?: number;

  /** Current page number — controlled */
  currentPage?: number;

  /** Total number of pages */
  totalPages?: number;

  /** Callback when page changes */
  onPageChange?: (page: number) => void;

  /** Show checkbox column for row selection */
  hasCheckbox?: boolean;

  /** Show frozen actions column */
  hasActions?: boolean;

  /** Show vertical scrollbar when content overflows */
  hasVerticalScroll?: boolean;

  /** Show horizontal scrollbar when content overflows */
  hasHorizontalScroll?: boolean;

  /** Currently selected row IDs */
  selectedRows?: string[];

  /** Callback when row selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;

  /** Disabled state — entire table non-interactive at 40% opacity */
  disabled?: boolean;

  /** Additional className for the root container */
  className?: string;
}

interface ColumnDef {
  /** Unique column identifier */
  id: string;

  /** Column header label */
  label: string;

  /** Data type — drives which TableDataCell variant to render */
  type: 'text' | 'text-subtext' | 'status' | 'number' | 'date' | 'link' | 'actions';

  /** Column width in pixels */
  width?: number;

  /** Text alignment — left (default) or right (numbers/dates) */
  alignment?: 'left' | 'right';

  /** Whether this column is sortable */
  sortable?: boolean;

  /** Whether this column has a filter affordance */
  filterable?: boolean;

  /** Whether this column shows a badge (e.g. filter count indicator) */
  hasBadge?: boolean;

  /** Current sort direction for this column */
  sortDirection?: 'none' | 'ascending' | 'descending';

  /** Sort change callback */
  onSort?: (columnId: string, direction: 'ascending' | 'descending' | 'none') => void;
}

interface RowData {
  /** Unique row identifier */
  id: string;

  /** Whether this row is disabled */
  disabled?: boolean;

  /** Cell values keyed by column ID */
  cells: Record<string, CellValue>;
}

type CellValue =
  | string                              // text, number, date
  | { primary: string; subtext: string } // text-subtext
  | { label: string; intent: 'default' | 'success' | 'warning' | 'error' } // status
  | { href: string; label: string }     // link
  | { actions: RowAction[] };           // actions

interface RowAction {
  id: string;
  icon: React.ReactNode;
  label: string; // accessible name
  onClick: (rowId: string) => void;
  disabled?: boolean;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | Type | React Prop | Notes |
|---|---|---|---|
| `Density` | VARIANT | `density` | `'default'` \| `'compact'` |
| `showHeader#1160:0` | BOOLEAN | `showHeader` | Default: `true` |
| `showFilterBar#1160:3` | BOOLEAN | `showFilterBar` | Default: `true` |
| `showPagination#1160:6` | BOOLEAN | `showPagination` | Default: `true` |
| n/a (assembly) | — | `columns` | Drives column structure |
| n/a (assembly) | — | `rows` | Data array |
| n/a (via entry-list) | — | `hasCheckbox` | Prop on EntryList |
| n/a (via entry-list) | — | `hasActions` | Prop on EntryList |
| n/a (via entry-list) | — | `hasVerticalScroll` | Prop on EntryList |
| n/a (via entry-list) | — | `hasHorizontalScroll` | Prop on EntryList |
| Disabled state (Header-Bar + Pagination) | — | `disabled` | Applies 40% opacity to header + pagination |

**CSS pseudo-states (not props):**
- Row hover → `:hover` on `<tr>` or row wrapper
- Row focus → `:focus-visible` on `<tr>` or row wrapper

---

## 5. State Behaviour

| State | Trigger | Visual Change | Token | ARIA Change |
|---|---|---|---|---|
| Default | Initial render | Full opacity, all zones visible | `surface/default` | — |
| Header hidden | `showHeader=false` | Header bar not rendered | — | `aria-label` on table sufficient |
| Filter bar hidden | `showFilterBar=false` | Filter row not rendered | — | — |
| Pagination hidden | `showPagination=false` | Footer not rendered | — | `aria-label` count in table |
| Row selected | Checkbox click | `surface/selected` fill on row | `surface/table/row/selected` | `aria-selected="true"` |
| Row hover | Mouse over row | Subtle fill change | `surface/table/row/hover` | — |
| Row disabled | `disabled=true` on RowData | Row at 40% opacity, `not-allowed` cursor | `visibility/disabled` | `aria-disabled="true"` |
| Table disabled | `disabled=true` | Header + pagination at 40% opacity | `visibility/disabled` | `aria-disabled="true"` on container |
| Compact density | `density='compact'` | 28px rows, 40px pagination | density tokens | — |

---

## 6. Size Specification

| Dimension | Default Density | Compact Density | Token |
|---|---|---|---|
| Data row height | 36px | 28px | `space/9` / `space/7` |
| Header row height | 32px | 32px | fixed |
| Header bar height | 48px | 48px | fixed |
| Filter bar height (collapsed) | 36px | 36px | fixed |
| Pagination height | 48px | 40px | fixed |
| Cell padding H | 12px | 12px | `space/3` |
| Cell padding V (Default) | 10px top / 9px bottom | 6px top / 5px bottom | `space/2.5` |
| Actions cell padding H | 8px | 8px | `space/2` |
| Outer border radius | 4px | 4px | `radius/1` |
| Outer border width | 1px | 1px | fixed |

---

## 7. Token Reference

| Layer | CSS Property | Token | Light Value | Dark Value |
|---|---|---|---|---|
| Root container border | `border` | `border/default` | `#E5E7EB` | `#374151` |
| Root container radius | `border-radius` | — | `4px` | `4px` |
| Table surface | `background` | `surface/default` | `#FFFFFF` | `#1F2937` |
| Header row fill | `background` | `surface/table/header` | `#F9FAFB` | `#111827` |
| Data row default | `background` | `surface/table/row/default` | transparent | transparent |
| Data row hover | `background` | `surface/table/row/hover` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.04)` |
| Data row selected | `background` | `surface/table/row/selected` | `#F9F8FF` | `#2D2666` |
| Row divider | `border-bottom` | `border/table/row` | `#F3F4F6` | `#374151` |
| Header bottom border | `border-bottom` | `border/table/header` | `#E5E7EB` | `#374151` |
| Header text | `color` | `text/table/header` | `#6B7280` | `#9CA3AF` |
| Cell text | `color` | `text/default` | `#111827` | `#F9FAFB` |
| Disabled opacity | `opacity` | `visibility/disabled` | `0.40` | `0.40` |
| Focus ring | `outline` | `focus/ring/color` | `#6C5CE7` | `#9F93FA` |

---

## 8. Accessibility

```
Role:           role="region" aria-label="[Table name]" on root container
Table element:  role="table" or native <table> inside entry list
Row:            role="row"
Header cell:    role="columnheader" aria-sort="none|ascending|descending"
Data cell:      role="cell"
Row selection:  aria-selected="true|false" on row
Select-all:     aria-label="Select all rows" on header checkbox
Disabled row:   aria-disabled="true" on row element

Keyboard navigation:
  Tab           → moves between interactive elements (checkboxes, sort buttons, actions)
  Enter/Space   → activates focused element (checkbox toggle, sort, action button)
  Arrow keys    → navigate within pagination page buttons
  Escape        → collapses filter bar if expanded

Contrast:
  Header text on header bg:    text/table/header (#6B7280) on surface/table/header (#F9FAFB) = 4.63:1 ✅ AA
  Cell text on white:          text/default (#111827) on white = 19.5:1 ✅ AAA
  Selected row text:           text/default on surface/selected = verified >4.5:1 ✅
  Disabled (40% opacity):      WCAG 1.4.3 exempts disabled components from contrast requirements ✅

Touch targets:
  Checkboxes:   24×24px minimum ✅ (actual 16×16px checkbox inside 36px row — meets 24px via row height)
  Action icons: 32×32px ✅ 
  Page buttons: 32×32px Default / 28×28px Compact — Compact is below 32px recommended, meets 24px minimum ✅

Screen reader announcements:
  Sort change:  "Title column, sorted ascending"
  Row select:   "Row selected" / "Row deselected"
  Page change:  "Page 3 of 50"
  Filter apply: "3 filters applied"
```

---

## 9. Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'Data Display/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof DataTable>;

const sampleColumns: ColumnDef[] = [
  { id: 'title', label: 'Title', type: 'text', sortable: true, filterable: true, width: 400 },
  { id: 'status', label: 'Status', type: 'status', width: 160 },
  { id: 'date', label: 'Updated', type: 'date', alignment: 'right', sortable: true, width: 160 },
];

const sampleRows: RowData[] = Array.from({ length: 10 }, (_, i) => ({
  id: `row-${i}`,
  cells: {
    title: 'Homepage Hero Banner',
    status: { label: 'Published', intent: 'success' },
    date: 'Jan 12, 2024',
  },
}));

// Default — clean baseline
export const Default: Story = {
  args: {
    density: 'default',
    columns: sampleColumns,
    rows: sampleRows,
    totalEntries: 1247,
    currentPage: 1,
    totalPages: 50,
    showHeader: true,
    showFilterBar: true,
    showPagination: true,
    hasCheckbox: true,
    hasActions: true,
  },
};

// Compact density
export const Compact: Story = {
  args: { ...Default.args, density: 'compact' },
};

// No header bar — minimal table
export const WithoutHeader: Story = {
  args: { ...Default.args, showHeader: false },
};

// No filter bar
export const WithoutFilterBar: Story = {
  args: { ...Default.args, showFilterBar: false },
};

// No pagination — all records visible
export const WithoutPagination: Story = {
  args: { ...Default.args, showPagination: false },
};

// With scope selector in search
export const WithScopeSearch: Story = {
  args: {
    ...Default.args,
    headerBarProps: { hasScope: true },
  },
};

// With advanced search link
export const WithAdvancedSearch: Story = {
  args: {
    ...Default.args,
    headerBarProps: { hasScope: true, hasAdvancedSearch: true },
  },
};

// Filters expanded — showing filter chips
export const FiltersExpanded: Story = {
  args: {
    ...Default.args,
    filterBarProps: { state: 'expanded', activeFilterCount: '3' },
  },
};

// Row selected state
export const WithSelectedRows: Story = {
  args: {
    ...Default.args,
    selectedRows: ['row-0', 'row-2', 'row-4'],
  },
};

// Disabled rows
export const WithDisabledRows: Story = {
  args: {
    ...Default.args,
    rows: sampleRows.map((r, i) => ({ ...r, disabled: i === 2 || i === 5 })),
  },
};

// Full disabled table
export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};

// No checkbox column
export const WithoutCheckbox: Story = {
  args: { ...Default.args, hasCheckbox: false },
};

// No actions column
export const WithoutActions: Story = {
  args: { ...Default.args, hasActions: false },
};

// Middle page — pagination in middle state
export const MiddlePage: Story = {
  args: { ...Default.args, currentPage: 25, totalPages: 50 },
};

// Last page
export const LastPage: Story = {
  args: { ...Default.args, currentPage: 50, totalPages: 50 },
};

// Sorted column
export const WithSortedColumn: Story = {
  args: {
    ...Default.args,
    columns: sampleColumns.map(c =>
      c.id === 'title' ? { ...c, sortDirection: 'ascending' } : c
    ),
  },
};

// Empty state
export const Empty: Story = {
  args: { ...Default.args, rows: [], totalEntries: 0 },
};

// Compact + all features
export const CompactFullFeatured: Story = {
  args: {
    ...Default.args,
    density: 'compact',
    headerBarProps: { hasScope: true, hasAdvancedSearch: true },
    selectedRows: ['row-1'],
  },
};
```

---

## 10. Implementation Notes

### CSS Custom Properties

```css
/* Spacing */
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;

/* Surface tokens */
--surface-default: var(--venus-surface-default);
--surface-table-header: var(--venus-surface-table-header);
--surface-table-row-hover: var(--venus-surface-table-row-hover);
--surface-table-row-selected: var(--venus-surface-table-row-selected);

/* Border tokens */
--border-default: var(--venus-border-default);
--border-table-row: var(--venus-border-table-row);
--border-table-header: var(--venus-border-table-header);

/* Text tokens */
--text-default: var(--venus-text-default);
--text-table-header: var(--venus-text-table-header);

/* Opacity */
--visibility-disabled: 0.40;

/* Focus */
--focus-ring-color: var(--venus-focus-ring-color);
```

### Component Architecture (React)

```tsx
// DataTable is a controlled component — all state lives in the parent
const DataTable: React.FC<DataTableProps> = ({
  density = 'default',
  showHeader = true,
  showFilterBar = true,
  showPagination = true,
  columns,
  rows,
  hasCheckbox = true,
  hasActions = true,
  ...
}) => (
  <div
    className={cn('venus-data-table', `venus-data-table--${density}`)}
    role="region"
    aria-label="Data table"
    style={{
      border: '1px solid var(--border-default)',
      borderRadius: '4px',
      overflow: 'visible', // IMPORTANT: OUTSIDE stroke requires overflow visible
    }}
  >
    {showHeader && <TableHeaderBar density={density} {...headerBarProps} />}
    {showFilterBar && <TableFilterBar {...filterBarProps} />}
    <TableEntryList
      density={density}
      columns={columns}
      rows={rows}
      hasCheckbox={hasCheckbox}
      hasActions={hasActions}
    />
    {showPagination && (
      <Pagination
        density={density}
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={totalEntries}
        onPageChange={onPageChange}
      />
    )}
  </div>
);
```

### Critical Implementation Rules

1. **Border must be on the outer wrapper div** — not a child overlay frame. Use `border: 1px solid var(--border-default)`. Never use `outline` or `box-shadow` for this.
2. **`overflow: visible` on root** — border-radius with overflow:hidden clips child focus rings. Apply `border-radius` + `overflow:hidden` only on the inner scroll container.
3. **`density` cascades via CSS class or React context** — all child components read density from the same source. Never pass density as a prop to every individual cell.
4. **Row heights are driven by CSS, not JavaScript** — Default rows: `min-height: 36px`. Compact rows: `min-height: 28px`. TextSubtext cells naturally expand their row — this is intentional.
5. **`showHeader/showFilterBar/showPagination` = conditional render, not CSS hide** — unmount the component entirely so DOM and ARIA tree are clean.
6. **Checkbox column width = 48px fixed** — never resizable.
7. **Actions column width = 80px fixed** — frozen (sticky right).
8. **Data columns** — all resizable by user, minimum width 80px recommended.

### Dark Mode

Apply via `data-theme="dark"` attribute on root or body. All `--venus-*` tokens resolve to dark values automatically via CSS custom property scoping.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .venus-data-table * {
    transition: none !important;
    animation: none !important;
  }
}
```

---

## 11. Do / Don't

**Do** use `density='compact'` for admin panels, log viewers, or any surface where the user is scanning large numbers of rows.  
**Don't** mix compact rows with default-size form controls in the same row — all interactive elements in a row must share the same height.

**Do** set `showHeader=false` when the table is embedded inside a section that already has its own heading and search.  
**Don't** hide the header but keep `showFilterBar=true` — a filter bar with no way to add/remove filters confuses users.

**Do** use `hasCheckbox=false` for read-only tables where the user cannot act on rows.  
**Don't** show checkboxes if there are no bulk actions available — remove them if there's nothing to do with a selection.

**Do** show the `Disabled` state on a row when the entry exists but cannot be edited (e.g. locked by another user or insufficient permissions).  
**Don't** hide disabled rows — they communicate the full scope of the dataset even when some items are inaccessible.

**Do** pass `totalEntries` to the pagination component even when `showPagination=false` — it can be used in an `aria-label` on the table.  
**Don't** hardcode page counts — always derive `totalPages` from `Math.ceil(totalEntries / pageSize)`.

---

## 12. Related Components

| Component | Relationship | When to use instead |
|---|---|---|
| `TableEntryList` | Sub-component | When you need just the data grid without header/filter/pagination |
| `TableHeaderBar` | Sub-component | Standalone search + toolbar, e.g. in a panel without a full table |
| `Pagination` | Sub-component | Any paginated list that is not a table |
| `FilterBar` | Sub-component | Filter chip row for any filterable view |
| `Select` | Related | Column-level filter dropdowns within header cells |
| `Badge` | Related | Appears in header cells as filter count indicators |
| `Chip` | Related | Appears in expanded filter bar as individual filter pills |

---
---
---

# COMPONENT 2 — TableHeaderBar

**Figma node:** `1050:7119` | `_Internal/Table/Header-Bar`

---

## 1. Purpose

`TableHeaderBar` is the toolbar that sits above the data grid. It combines a search field with a row of contextual action icons (settings, view toggle, filters, density, grid view, extra options). It is an internal component — it is not published to the library for direct use outside of `DataTable`.

**Use via:** `DataTable` — do not render standalone in product screens.

---

## 2. Anatomy

```
┌────────────────────────────────────────────────────────────────────┐
│ [SearchInput ←FILL→]         [⚙][↕][▽][⊞][≡][···]                │
│  search-slot                  table-actions                         │
└────────────────────────────────────────────────────────────────────┘
Height: 48px = 32px atoms + 8px padding top + 8px padding bottom
Padding H: 16px left + 16px right
```

**Layout:** `justify-content: space-between` — search fills remaining space, actions hug right.

---

## 3. TypeScript Props Interface

```typescript
interface TableHeaderBarProps {
  /** Show/hide settings icon button */
  hasSettings?: boolean;

  /** Show/hide views icon button */
  hasViews?: boolean;

  /** Show/hide filters icon button */
  hasFilters?: boolean;

  /** Show/hide grid view icon button */
  hasGridView?: boolean;

  /** Show/hide view toggle icon button */
  hasViewToggle?: boolean;

  /** Show/hide extra options (overflow) icon button */
  hasExtraOptions?: boolean;

  /** Disabled state — entire bar at 40% opacity, non-interactive */
  disabled?: boolean;

  /** SearchInput: show scope selector dropdown before search field */
  hasScope?: boolean;

  /** SearchInput: show Advanced Search hyperlink after search button */
  hasAdvancedSearch?: boolean;

  /** SearchInput: placeholder text */
  searchPlaceholder?: string;

  /** Search submit callback */
  onSearch?: (query: string) => void;

  /** Scope change callback */
  onScopeChange?: (scope: string) => void;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | Type | React Prop | Default |
|---|---|---|---|
| `State` | VARIANT | `disabled` (boolean) | `false` |
| `hasSettings#1050:32` | BOOLEAN | `hasSettings` | `true` |
| `hasViews#1050:34` | BOOLEAN | `hasViews` | `true` |
| `hasFilters#1050:36` | BOOLEAN | `hasFilters` | `true` |
| `hasGridView#1050:38` | BOOLEAN | `hasGridView` | `true` |
| `hasViewToggle#1050:40` | BOOLEAN | `hasViewToggle` | `true` |
| `hasExtraOptions#1050:42` | BOOLEAN | `hasExtraOptions` | `false` |
| n/a (via SearchInput) | — | `hasScope` | `false` |
| n/a (via SearchInput) | — | `hasAdvancedSearch` | `false` |

**State=Disabled maps to** `disabled` prop — renders at `opacity: 0.40`, `pointer-events: none`.

---

## 5. State Behaviour

| State | Visual | Token |
|---|---|---|
| Default | Full opacity, all enabled icons interactive | `surface/raised` background |
| Disabled | 40% opacity, entire bar non-interactive | `visibility/disabled` = 0.40 |

---

## 6. Size Specification

| Dimension | Value | Token |
|---|---|---|
| Height | 48px | fixed |
| Padding H | 16px | `space/4` |
| Search input height | 32px | atom |
| Icon button size | 32×32px | atom (Ghost Button md) |
| Gap (icon buttons) | 4px | `space/1` |

---

## 7. Token Reference

| Layer | Token | Light | Dark |
|---|---|---|---|
| Container background | `surface/raised` | `#FFFFFF` | `#1F2937` |
| Container bottom border | `border/table/header` | `#E5E7EB` | `#374151` |
| Disabled opacity | `visibility/disabled` | `0.40` | `0.40` |

---

## 8. Accessibility

```
Role:           role="toolbar" aria-label="Table toolbar"
Children:       All icon buttons require aria-label
Keyboard:       Tab moves between toolbar items
Disabled:       aria-disabled="true" on toolbar element; no individual focus
```

---

## 9. Storybook Stories

```typescript
export const Default: Story = {
  args: {
    hasSettings: true, hasViews: true, hasFilters: true,
    hasGridView: true, hasViewToggle: true, hasExtraOptions: false,
    hasScope: false, hasAdvancedSearch: false,
  },
};
export const WithScopeAndAdvancedSearch: Story = {
  args: { ...Default.args, hasScope: true, hasAdvancedSearch: true },
};
export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};
export const MinimalActions: Story = {
  args: { hasSettings: false, hasViews: false, hasFilters: true,
          hasGridView: false, hasViewToggle: false, hasExtraOptions: false },
};
```

---

## 10. Implementation Notes

The disabled state uses `opacity: 0.40` on the entire component root. In React, implement as:
```tsx
<div
  role="toolbar"
  aria-label="Table toolbar"
  aria-disabled={disabled}
  style={{ opacity: disabled ? 'var(--visibility-disabled)' : 1,
           pointerEvents: disabled ? 'none' : 'auto' }}
>
```
Do not pass `disabled` to individual child atoms — the wrapper handles it entirely.

---
---

# COMPONENT 3 — SearchInput

**Figma node:** `1050:2231` | `Search Input`

---

## 1. Purpose

`SearchInput` is a composite search field. It combines an Input atom with an optional Search button, optional scope selector (pre-search filter), and optional Advanced Search link. Used in the `TableHeaderBar` and anywhere a primary search action is needed.

---

## 2. Anatomy

```
compact:  [Input ←FILL→ 🔍]
default:  [scope-select?] [Input ←FILL→] [Search Button] [> Advanced Search?]
```

---

## 3. TypeScript Props Interface

```typescript
interface SearchInputProps {
  /** Layout size — compact (input+icon only) or default (input+button+optionals) */
  size?: 'compact' | 'default';

  /** Placeholder text for the search input */
  placeholder?: string;

  /** Show scope selector dropdown before search field (default only) */
  hasScope?: boolean;

  /** Scope options for the selector */
  scopeOptions?: Array<{ value: string; label: string }>;

  /** Currently selected scope value */
  scopeValue?: string;

  /** Scope change callback */
  onScopeChange?: (value: string) => void;

  /** Show Advanced Search hyperlink after the search button (default only) */
  hasAdvancedSearch?: boolean;

  /** Advanced Search click callback */
  onAdvancedSearch?: () => void;

  /** Search submit callback */
  onSearch?: (query: string, scope?: string) => void;

  /** Controlled search value */
  value?: string;

  /** Value change callback */
  onChange?: (value: string) => void;

  /** Disabled state */
  disabled?: boolean;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `Size` VARIANT (`compact`\|`default`) | `size` | Drives layout structure |
| `hasScope#1159:6` BOOLEAN (default: `false`) | `hasScope` | Only applies to `size='default'` |
| `hasAdvancedSearch#1159:9` BOOLEAN (default: `false`) | `hasAdvancedSearch` | Only applies to `size='default'` |

**Important:** `hasScope` and `hasAdvancedSearch` default to `false`. They are opt-in features.

---

## 5. State Behaviour

| Element | Condition | Behaviour |
|---|---|---|
| `scope-select` | `hasScope=true` | Renders as HUG-width select before input. Hidden when `false`. |
| `advanced-search-link` | `hasAdvancedSearch=true` | Renders as Hyperlink md after Search button. Hidden when `false`. |
| Input | Always | FILL width, takes all remaining horizontal space |
| Search Button | `size='default'` only | Always visible in default size |
| Search icon | `size='compact'` only | Trailing icon inside the Input field |

---

## 6. Size Specification

| Size | Height | Layout | Input width |
|---|---|---|---|
| compact | 32px | Input only | FILL (parent-controlled, default 240px) |
| default | 32px | Scope? + Input + Button + AdvSearch? | FILL |

---

## 9. Storybook Stories

```typescript
export const CompactDefault: Story = { args: { size: 'compact' } };
export const DefaultSize: Story = { args: { size: 'default' } };
export const WithScope: Story = { args: { size: 'default', hasScope: true,
  scopeOptions: [{ value: 'all', label: 'All' }, { value: 'entries', label: 'Entries' }] } };
export const WithAdvancedSearch: Story = { args: { size: 'default', hasAdvancedSearch: true } };
export const FullFeatured: Story = { args: { size: 'default', hasScope: true, hasAdvancedSearch: true } };
export const Disabled: Story = { args: { size: 'default', disabled: true } };
```

---
---

# COMPONENT 4 — TableFilterBar

**Figma node:** `1109:398` | `Table/Filter-Bar`

---

## 1. Purpose

`TableFilterBar` shows the active filter state below the header bar. In Collapsed state it shows a summary ("3 filters applied"). In Expanded state it shows individual filter chips that can be removed. The toggle between states is controlled by the expand/collapse icon button.

---

## 3. TypeScript Props Interface

```typescript
interface TableFilterBarProps {
  /** Expanded or collapsed state */
  state?: 'collapsed' | 'expanded';

  /** Number shown in collapsed summary (e.g. "3") */
  activeFilterCount?: number;

  /** Callback when "Show all" is clicked (collapsed) */
  onShowAll?: () => void;

  /** Callback when "Hide all" is clicked (expanded) */
  onHideAll?: () => void;

  /** Callback when "Clear all" is clicked */
  onClearAll?: () => void;

  /** Callback when toggle (expand/collapse) icon is clicked */
  onToggle?: () => void;

  /** Filter chip data — renders as Chip atoms in expanded state */
  filters?: FilterChip[];
}

interface FilterChip {
  id: string;
  label: string;
  value: string;
  /** Count badge on the chip */
  count?: number;
  /** Remove callback */
  onRemove: (id: string) => void;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `State` VARIANT (`Collapsed`\|`Expanded`) | `state` | Drives structure — different layout mode |
| `activeFilterCount#1109:0` TEXT | `activeFilterCount` | Shown in collapsed summary label |
| `filter-bar-chips` SLOT | `filters` (array) | Chip atoms rendered in expanded state |

---

## 5. State Behaviour

| State | Trigger | Layout | Height |
|---|---|---|---|
| Collapsed | Initial / toggle click | Horizontal — summary text + icon | 36px |
| Expanded | Toggle click | Vertical — chip row + hide/clear row | 83px (scales with chip count) |

**Collapsed layout:**
```
[▼ icon] [N filters applied] · [Show all] | [Clear all]
```
**Expanded layout (2 rows):**
```
Row 1: [Chip] [Chip] [Chip] ...
Row 2: [Hide all] | [Clear all]
```

---

## 9. Storybook Stories

```typescript
export const Collapsed: Story = { args: { state: 'collapsed', activeFilterCount: 3 } };
export const Expanded: Story = {
  args: {
    state: 'expanded',
    filters: [
      { id: '1', label: 'Status', value: 'Published', count: 14, onRemove: fn() },
      { id: '2', label: 'Author', value: 'John Doe', onRemove: fn() },
      { id: '3', label: 'Date', value: 'Last 7 days', onRemove: fn() },
    ],
  },
};
export const NoFilters: Story = { args: { state: 'collapsed', activeFilterCount: 0 } };
```

---
---

# COMPONENT 5 — TableEntryList

**Figma node:** `1146:63354` | `Table/Entry-List-v2`

---

## 1. Purpose

`TableEntryList` is the scrollable data grid. It renders a header row and variable-count data rows in a vertical stack. The actions column is frozen (sticky right). Horizontal and vertical scrollbars are optional. Columns and row count are entirely defined by the consumer via slots/props.

---

## 3. TypeScript Props Interface

```typescript
interface TableEntryListProps {
  /** Density mode — drives row heights */
  density?: 'default' | 'compact';

  /** Show checkbox column for row selection */
  hasCheckbox?: boolean;

  /** Show frozen right actions column */
  hasActions?: boolean;

  /** Show vertical scrollbar */
  hasVerticalScroll?: boolean;

  /** Show horizontal scrollbar */
  hasHorizontalScroll?: boolean;

  /** Column definitions */
  columns: ColumnDef[];

  /** Row data */
  rows: RowData[];

  /** Selected row IDs */
  selectedRows?: string[];

  /** Select all state */
  allSelected?: boolean;
  someSelected?: boolean;

  /** Callbacks */
  onRowSelect?: (rowId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  onRowClick?: (rowId: string) => void;
  onRowFocus?: (rowId: string) => void;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `Density` VARIANT | `density` | Drives all child row heights |
| `hasActions#1146:259` BOOLEAN | `hasActions` | Shows/hides actions column |
| `hasCheckbox#1146:262` BOOLEAN | `hasCheckbox` | Shows/hides checkbox column |
| `hasVerticalScroll#1146:265` BOOLEAN | `hasVerticalScroll` | Shows vertical scrollbar track |
| `hasHorizontalScroll#1146:268` BOOLEAN | `hasHorizontalScroll` | Shows horizontal scrollbar track |
| `header-row` SLOT | renders `<TableHeaderRow>` | Populated from `columns` prop |
| `data-rows` SLOT | renders `<TableDataRow>[]` | Populated from `rows` prop |
| `action-cells` SLOT | renders `<TableActionsCell>[]` | Frozen right column |

---

## 5. State Behaviour

| Condition | Behaviour |
|---|---|
| `hasVerticalScroll=true` | Scrollbar track shown with Glass/Frosted backdrop effect |
| `hasHorizontalScroll=true` | Horizontal scrollbar track shown |
| `hasActions=true` | Right column frozen (sticky) with `Elevation/Frozen Column` shadow |
| `allSelected=true` | Header checkbox shows checked state |
| `someSelected=true` | Header checkbox shows indeterminate state |

---

## 6. Size Specification

| Dimension | Default | Compact |
|---|---|---|
| Row height | 36px | 28px |
| Header row height | 32px | 32px |
| Checkbox column width | 48px | 48px |
| Actions column width | 80px | 80px |

---

## 9. Storybook Stories

```typescript
export const Default: Story = { args: { density: 'default', hasCheckbox: true,
  hasActions: true, columns: sampleColumns, rows: sampleRows } };
export const Compact: Story = { args: { ...Default.args, density: 'compact' } };
export const WithVerticalScroll: Story = { args: { ...Default.args, hasVerticalScroll: true } };
export const WithHorizontalScroll: Story = { args: { ...Default.args, hasHorizontalScroll: true } };
export const WithSelectedRows: Story = { args: { ...Default.args,
  selectedRows: ['row-0', 'row-2'], someSelected: true } };
export const AllSelected: Story = { args: { ...Default.args,
  selectedRows: sampleRows.map(r => r.id), allSelected: true } };
export const NoCheckboxNoActions: Story = { args: { ...Default.args,
  hasCheckbox: false, hasActions: false } };
```

---
---

# COMPONENT 6 — TableHeaderRow

**Figma node:** `1146:62611` | `Table/Header-Row`

---

## 1. Purpose

`TableHeaderRow` is the sticky header row above data rows. It renders the select-all checkbox cell and a slot of `TableHeaderCell` instances, one per column.

**Note:** Currently a single COMPONENT (no Compact variant). A future update will add `Density=Compact`. For now, height is fixed at 32px for both densities.

---

## 3. TypeScript Props Interface

```typescript
interface TableHeaderRowProps {
  /** Show select-all checkbox */
  hasCheckbox?: boolean;

  /** All rows selected — drives checkbox state */
  allSelected?: boolean;

  /** Some (not all) rows selected — drives indeterminate */
  someSelected?: boolean;

  /** Select-all callback */
  onSelectAll?: (selected: boolean) => void;

  /** Column definitions — one TableHeaderCell per column */
  columns: ColumnDef[];
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `hasCheckbox#1146:258` BOOLEAN | `hasCheckbox` | Shows/hides checkbox column |
| `header-cells` SLOT | `columns` array | Renders one `TableHeaderCell` per column |

---

## 5. State Behaviour

The header row itself is stateless. State is managed by individual `TableHeaderCell` instances (sort direction) and the checkbox cell (all/some/none selected).

---

## 9. Storybook Stories

```typescript
export const Default: Story = { args: { hasCheckbox: true, columns: sampleColumns } };
export const NoCheckbox: Story = { args: { hasCheckbox: false, columns: sampleColumns } };
export const AllSelected: Story = { args: { ...Default.args, allSelected: true } };
export const SomeSelected: Story = { args: { ...Default.args, someSelected: true } };
export const WithSortedColumn: Story = {
  args: { ...Default.args,
    columns: sampleColumns.map(c => c.id === 'title' ? { ...c, sortDirection: 'ascending' } : c) },
};
```

---
---

# COMPONENT 7 — TableHeaderCell

**Figma node:** `1146:121332` | `Table/Header-Cell`

---

## 1. Purpose

`TableHeaderCell` is an individual column header. It displays the column label with optional sort indicators, filter affordance, and badge. It triggers sort on click.

---

## 2. Anatomy

```
Left aligned:   [label text] [↑↓ sort icon?] [▽ filter icon?] [badge?]
Right aligned:  [badge?] [▽ filter icon?] [↑↓ sort icon?] [label text]
Checkbox:       [☐ select-all checkbox]
```

**Dimensions:** 32px height, 12px H padding, 8px gap between elements.

---

## 3. TypeScript Props Interface

```typescript
interface TableHeaderCellProps {
  /** Column label */
  label?: string;

  /** Text and icon alignment */
  alignment?: 'left' | 'right' | 'checkbox';

  /** Current sort direction */
  sortDirection?: 'none' | 'ascending' | 'descending';

  /** Show sort affordance icon */
  hasSort?: boolean;

  /** Show filter affordance icon */
  hasFilter?: boolean;

  /** Show badge (e.g. active filter count) */
  hasBadge?: boolean;

  /** Badge component — defaults to Badge atom */
  badge?: React.ReactNode;

  /** Focus state — shows focus ring */
  hasFocus?: boolean;

  /** Sort click callback */
  onSort?: (direction: 'ascending' | 'descending' | 'none') => void;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `Alignment` VARIANT (`Left`\|`Right`\|`Checkbox`) | `alignment` | Drives text + icon order |
| `Sort` VARIANT (`None`\|`Ascending`\|`Descending`) | `sortDirection` | Visual sort state |
| `label#1146:280` TEXT | `label` | Column header text |
| `hasFilter#1146:281` BOOLEAN | `hasFilter` | Shows filter chevron icon |
| `hasFocus#1146:282` BOOLEAN | `hasFocus` | Shows focus ring (Storybook only) |
| `hasSort#1146:283` BOOLEAN | `hasSort` | Shows sort arrows icon |
| `hasBadge#1146:284` BOOLEAN | `hasBadge` | Shows badge instance |
| `badge#1146:285` INSTANCE_SWAP | `badge` ReactNode | Badge component |

**CSS pseudo-states:**
- Sort toggle on click → cycles None → Ascending → Descending → None
- Hover → subtle header fill change via `:hover`

---

## 5. State Behaviour

| State | Visual | ARIA |
|---|---|---|
| Sort=None + hover | Cursor: pointer, subtle bg tint | — |
| Sort=Ascending | ↑ icon visible | `aria-sort="ascending"` |
| Sort=Descending | ↓ icon visible | `aria-sort="descending"` |
| Sort=None (reset) | No sort icon | `aria-sort="none"` |
| hasFocus=true | 2px focus ring, `focus/ring/color` | `:focus-visible` |

---

## 6. Size Specification

| Dimension | Value | Token |
|---|---|---|
| Height | 32px | fixed |
| Padding H | 12px | `space/3` |
| Padding V | 8px | `space/2` |
| Gap | 8px | `space/2` |
| Width | HUG (auto) | — |
| Checkbox variant width | 48px | fixed |

---

## 9. Storybook Stories

```typescript
export const LeftDefault: Story = { args: { label: 'Title', alignment: 'left',
  hasSort: true, hasFilter: true, sortDirection: 'none' } };
export const Ascending: Story = { args: { ...LeftDefault.args, sortDirection: 'ascending' } };
export const Descending: Story = { args: { ...LeftDefault.args, sortDirection: 'descending' } };
export const RightAligned: Story = { args: { label: 'Revenue', alignment: 'right',
  hasSort: true, sortDirection: 'none' } };
export const WithBadge: Story = { args: { ...LeftDefault.args, hasBadge: true } };
export const CheckboxVariant: Story = { args: { alignment: 'checkbox' } };
export const Focused: Story = { args: { ...LeftDefault.args, hasFocus: true } };
```

---
---

# COMPONENT 8 — TableDataRow

**Figma node:** `1146:62610` | `Table/Data-Row`

---

## 1. Purpose

`TableDataRow` is a single data row. It renders a checkbox, a slot for data cells, and connects to the frozen actions column. It carries all interactive states: Default, Hover, Selected, Focused, Disabled.

---

## 3. TypeScript Props Interface

```typescript
interface TableDataRowProps {
  /** Unique row identifier */
  id: string;

  /** Row density */
  density?: 'default' | 'compact';

  /** Show checkbox */
  hasCheckbox?: boolean;

  /** Currently selected */
  selected?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Focus state (Storybook / programmatic) */
  hasFocus?: boolean;

  /** Cell data — renders TableDataCell per column */
  cells: CellData[];

  /** Row click callback (e.g. open detail panel) */
  onClick?: (id: string) => void;

  /** Row checkbox change callback */
  onSelect?: (id: string, selected: boolean) => void;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `Density` VARIANT | `density` | `'default'` = 36px \| `'compact'` = 28px |
| `State` VARIANT | Derived — see table below | Maps to CSS + aria |
| `hasCheckbox#1146:235` BOOLEAN | `hasCheckbox` | Shows/hides checkbox cell |
| `hasFocus#1146:224` BOOLEAN | `hasFocus` | Storybook only; production uses `:focus-visible` |
| `cells` SLOT | `cells` array | Renders TableDataCell per column |

**State → Implementation mapping:**

| Figma State | React/CSS Equivalent | Notes |
|---|---|---|
| Default | No class | Base appearance |
| Hover | `:hover` CSS | `surface/table/row/hover` fill |
| Selected | `selected=true` prop | `surface/table/row/selected` fill + `aria-selected` |
| Focused | `:focus-visible` CSS | `focus/ring/color` ring |
| Disabled | `disabled=true` prop | `opacity: 0.40`, `pointer-events: none`, `aria-disabled` |

---

## 5. State Behaviour

| State | Trigger | Token | ARIA |
|---|---|---|---|
| Default | Idle | transparent bg | — |
| Hover | Mouse over | `surface/table/row/hover` | — |
| Selected | Checkbox checked | `surface/table/row/selected` | `aria-selected="true"` |
| Focused | Keyboard Tab to row | `focus/ring/color` ring | `:focus-visible` |
| Disabled | `disabled=true` | `visibility/disabled` 40% | `aria-disabled="true"` |

---

## 6. Size Specification

| Dimension | Default | Compact | Token |
|---|---|---|---|
| Row height | 36px | 28px | `counterAxisSizingMode=AUTO` — grows with TextSubtext cells |
| Checkbox cell | 48px wide | 48px wide | fixed |
| Border bottom | 1px | 1px | `border/table/row` |

**Note on row height:** `counterAxisSizingMode=AUTO` means row height is driven by the tallest cell. A `TextSubtext` cell (48px Default / 40px Compact) will expand the row. This is intentional — consistent with enterprise table behaviour. Build rows with `min-height` not `height`.

---

## 9. Storybook Stories

```typescript
export const Default: Story = { args: { density: 'default', hasCheckbox: true, cells: sampleCells } };
export const Compact: Story = { args: { ...Default.args, density: 'compact' } };
export const Selected: Story = { args: { ...Default.args, selected: true } };
export const Disabled: Story = { args: { ...Default.args, disabled: true } };
export const Focused: Story = { args: { ...Default.args, hasFocus: true } };
export const AllCellTypes: Story = { args: { ...Default.args, cells: allTypeCells } };
```

---
---

# COMPONENT 9 — TableDataCell

**Figma node:** `1131:1679` | `Table/Data-Cell`

---

## 1. Purpose

`TableDataCell` renders a single data cell in a table row. It has 7 type variants covering all common content patterns in a CMS: plain text, text+subtext, status badge, number, date, hyperlink, and inline action buttons.

**⚠️ Known issue:** The Figma component set has an API error on property definitions. The component is visually complete. This note is for engineering awareness — it does not affect production implementation.

---

## 2. Anatomy

```
Text:        [cell-text]                           — 36px/28px H layout
TextSubtext: [cell-text]                           — 48px/40px V layout
             [cell-subtext]
Status:      [● status-badge]                      — H layout, Badge atom
Number:      [cell-text right-aligned]             — H layout, text/subtle
Date:        [cell-text]                           — H layout, text/subtle
Link:        [hyperlink-text]                      — H layout, Hyperlink atom
Actions:     [icon-btn] [icon-btn] [icon-btn]      — H layout, action atoms
```

---

## 3. TypeScript Props Interface

```typescript
interface TableDataCellProps {
  /** Content type — drives which subcomponent renders */
  type: 'text' | 'text-subtext' | 'status' | 'number' | 'date' | 'link' | 'actions';

  /** Row density */
  density?: 'default' | 'compact';

  // type='text'
  text?: string;

  // type='text-subtext'
  primaryText?: string;
  subtext?: string;
  hasSubtext?: boolean;

  // type='status'
  statusLabel?: string;
  statusIntent?: 'default' | 'success' | 'warning' | 'error';

  // type='number'
  value?: string | number;

  // type='date'
  date?: string;

  // type='link'
  href?: string;
  linkLabel?: string;

  // type='actions'
  actions?: RowAction[];
}
```

---

## 4. Figma → React Prop Mapping

| Figma Variant | React `type` prop | Height Default | Height Compact |
|---|---|---|---|
| `Type=Text` | `'text'` | 36px | 28px |
| `Type=TextSubtext` | `'text-subtext'` | 48px | 40px |
| `Type=Status` | `'status'` | 36px | 28px |
| `Type=Number` | `'number'` | 36px | 28px |
| `Type=Date` | `'date'` | 36px | 28px |
| `Type=Link` | `'link'` | 36px | **29px** ⚠️ (off-grid, fix pending) |
| `Type=Actions` | `'actions'` | 36px | 28px |

---

## 6. Size Specification

| Type | Padding H | Padding V (Default) | Padding V (Compact) |
|---|---|---|---|
| Text, Number, Date | 12px | 10px / 9px | 6px / 5px |
| TextSubtext | 12px | 8px / 8px | 4px / 4px |
| Status | 12px | 8px / 8px | 4px / 4px |
| Link | 12px | 4px / 3px | 0px (fix needed) |
| Actions | 8px | 10px / 10px | 6px / 6px |

---

## 9. Storybook Stories

```typescript
export const Text: Story = { args: { type: 'text', density: 'default', text: 'Homepage Hero Banner' } };
export const TextSubtext: Story = { args: { type: 'text-subtext', density: 'default',
  primaryText: 'Homepage Hero Banner', subtext: 'More information text' } };
export const Status: Story = { args: { type: 'status', density: 'default',
  statusLabel: 'Published', statusIntent: 'success' } };
export const NumberCell: Story = { args: { type: 'number', density: 'default', value: '24,512' } };
export const DateCell: Story = { args: { type: 'date', density: 'default', date: '12 Jan 2024' } };
export const LinkCell: Story = { args: { type: 'link', density: 'default',
  href: '#', linkLabel: 'Hyperlink' } };
export const Actions: Story = { args: { type: 'actions', density: 'default', actions: sampleActions } };
export const AllTypesCompact: Story = { /* renders all types at compact */ };
```

---
---

# COMPONENT 10 — TableActionsCell

**Figma node:** `1146:62438` | `Table/Actions-Cell`

---

## 1. Purpose

`TableActionsCell` is the frozen right column of each row. It renders Edit and Delete icon buttons (independently hideable) plus a permanent overflow (⋯) button. The column is always 80px wide and always visible.

---

## 3. TypeScript Props Interface

```typescript
interface TableActionsCellProps {
  /** Row density */
  density?: 'default' | 'compact';

  /** Show edit action icon */
  hasEditAction?: boolean;

  /** Show delete action icon */
  hasDeleteAction?: boolean;

  /** Focus state */
  hasFocus?: boolean;

  /** Edit click callback */
  onEdit?: (rowId: string) => void;

  /** Delete click callback */
  onDelete?: (rowId: string) => void;

  /** Overflow (⋯) click callback — always rendered */
  onOverflow?: (rowId: string) => void;

  /** The row ID this cell belongs to */
  rowId?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Default |
|---|---|---|
| `Density` VARIANT | `density` | `'default'` |
| `hasEditAction#1146:215` BOOLEAN | `hasEditAction` | `true` |
| `hasDeleteAction#1146:218` BOOLEAN | `hasDeleteAction` | `true` |
| `hasFocus#1146:221` BOOLEAN | `hasFocus` | `false` |

---

## 6. Size Specification

| Dimension | Default | Compact | Token |
|---|---|---|---|
| Width | 80px | 80px | fixed |
| Height | 36px | 28px | matches row height |
| Padding H | 8px | 8px | `space/2` |
| Gap between icons | 4px | 4px | `space/1` |

---

## 9. Storybook Stories

```typescript
export const Default: Story = { args: { density: 'default', hasEditAction: true, hasDeleteAction: true } };
export const Compact: Story = { args: { ...Default.args, density: 'compact' } };
export const EditOnly: Story = { args: { ...Default.args, hasDeleteAction: false } };
export const OverflowOnly: Story = { args: { ...Default.args, hasEditAction: false, hasDeleteAction: false } };
export const Focused: Story = { args: { ...Default.args, hasFocus: true } };
```

---

## 10. Implementation Notes

```tsx
// Always sticky right — never scroll with table content
<td
  role="cell"
  style={{
    position: 'sticky',
    right: 0,
    width: '80px',
    boxShadow: 'var(--elevation-frozen-column)', // left-side shadow only
    background: 'var(--surface-default)',        // must match row bg to hide content scroll
  }}
>
```

---
---

# COMPONENT 11 — Pagination

**Figma node:** `1145:35789` | `Pagination`

---

## 1. Purpose

`Pagination` is the table footer that lets users navigate between pages of results. It shows the current result range, page navigation controls, and a per-page selector. It has three structural states (FirstPage, MiddlePage, LastPage) that document the three rendering cases for engineers — in production, a single controlled component handles all three.

---

## 2. Anatomy

```
[Showing 26–50 of 1,247 entries]     [< 1 … 24 [25] 26 … 50 >]     [Select… ∨]
  results-text (left)                   page-controls (center)        per-page (right)
```

**Height:** 48px Default / 40px Compact. Padding H: 16px.

---

## 3. TypeScript Props Interface

```typescript
interface PaginationProps {
  /** Density mode */
  density?: 'default' | 'compact';

  /** Current page (1-indexed) */
  currentPage: number;

  /** Total number of pages */
  totalPages: number;

  /** Total number of entries */
  totalEntries: number;

  /** Page size options for the per-page selector */
  pageSizeOptions?: number[];

  /** Currently selected page size */
  pageSize?: number;

  /** Page change callback */
  onPageChange: (page: number) => void;

  /** Page size change callback */
  onPageSizeChange?: (size: number) => void;

  /** Disabled state — entire pagination non-interactive at 40% opacity */
  disabled?: boolean;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `Density` VARIANT | `density` | `'default'` = 48px \| `'compact'` = 40px |
| `State` VARIANT | Derived from `currentPage` + `totalPages` | `FirstPage` when `currentPage=1`, `LastPage` when equal to `totalPages`, `MiddlePage` otherwise |
| `currentPage#1145:112` TEXT | `currentPage` | Controlled |
| `totalPages#1145:119` TEXT | `totalPages` | Computed |
| `totalEntries#1145:126` TEXT | `totalEntries` | Displayed in results text |
| `State=Disabled` | `disabled=true` | 40% opacity, non-interactive |

**The 3 Figma state variants are documentation aids only.** In React, a single `<Pagination>` component derives its appearance from `currentPage` and `totalPages`. No `state` prop needed.

---

## 5. State Behaviour

| Condition | Previous button | Next button | Ellipsis |
|---|---|---|---|
| First page (`currentPage=1`) | Disabled (40% opacity) | Enabled | After current window |
| Middle page | Enabled | Enabled | Both sides |
| Last page (`currentPage=totalPages`) | Enabled | Disabled (40% opacity) | Before current window |
| Disabled (`disabled=true`) | Entire component 40% opacity | — | — |

**Page window logic:** Show 2 pages before and after current. Show first and last always. Show ellipsis (…) when gap >1.

---

## 6. Size Specification

| Dimension | Default | Compact |
|---|---|---|
| Height | 48px | 40px |
| Page button size | 32×32px | 28×28px |
| Padding H | 16px | 16px |
| Results text | Body/SM | Body/SM |
| Page number | Body/XS | Body/XS |

---

## 7. Token Reference

| Layer | Token | Light | Dark |
|---|---|---|---|
| Container bg | `surface/default` | `#FFFFFF` | `#1F2937` |
| Container top border | `border/table/row` | `#F3F4F6` | `#374151` |
| Results text | `text/subtle` | `#6B7280` | `#9CA3AF` |
| Page btn default | transparent | — | — |
| Page btn hover | `surface/brand/inactive` | `#F9F8FF` | `#2D2666` |
| Page btn active | `action/primary` | `#6C5CE7` | `#9F93FA` |
| Page btn active text | `text/inverse` | `#FFFFFF` | `#111827` |
| Focus ring | `focus/ring/color` | `#6C5CE7` | `#9F93FA` |
| Disabled opacity | `visibility/disabled` | `0.40` | `0.40` |

---

## 8. Accessibility

```
Role:         <nav aria-label="Pagination">
Page buttons: <button aria-label="Page 1" aria-current="page"> for active page
Prev button:  <button aria-label="Previous page" disabled> when on first page
Next button:  <button aria-label="Next page" disabled> when on last page
Ellipsis:     <span aria-hidden="true">…</span>
Results text: not interactive — <p> or <span>
```

---

## 9. Storybook Stories

```typescript
export const FirstPage: Story = { args: { density: 'default', currentPage: 1, totalPages: 50, totalEntries: 1247 } };
export const MiddlePage: Story = { args: { ...FirstPage.args, currentPage: 25 } };
export const LastPage: Story = { args: { ...FirstPage.args, currentPage: 50 } };
export const Compact: Story = { args: { ...FirstPage.args, density: 'compact' } };
export const Disabled: Story = { args: { ...FirstPage.args, disabled: true } };
export const FewPages: Story = { args: { ...FirstPage.args, totalPages: 3, totalEntries: 75 } };
export const OnePage: Story = { args: { ...FirstPage.args, totalPages: 1, totalEntries: 12 } };
export const CompactMiddle: Story = { args: { ...FirstPage.args, density: 'compact', currentPage: 25 } };
```

---
---

# COMPONENT 12 — PageButton

**Figma node:** `1145:35616` | `Pagination/Page-Button`

---

## 1. Purpose

`PageButton` is an individual page number button inside `Pagination`. It renders a page number label and handles all interactive states. It is a sub-component of `Pagination` and should not be used standalone.

---

## 3. TypeScript Props Interface

```typescript
interface PageButtonProps {
  /** Page number to display */
  label: string;

  /** Density */
  density?: 'default' | 'compact';

  /** Interactive state */
  state?: 'default' | 'hover' | 'active' | 'focused' | 'disabled';

  /** Whether this is the current page */
  isActive?: boolean;

  /** Whether this button is disabled */
  disabled?: boolean;

  /** Whether to show focus ring (Storybook only) */
  hasFocus?: boolean;

  /** Click callback */
  onClick?: (page: number) => void;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Equivalent |
|---|---|
| `Density` VARIANT (`Default`\|`Compact`) | `density` |
| `State` VARIANT (`Default`\|`Active`\|`Hover`\|`Focused`\|`Disabled`) | CSS pseudo-states + `isActive` + `disabled` |
| `label#1145:98` TEXT | `label` |
| `hasFocus#1145:105` BOOLEAN | Storybook only — `:focus-visible` in production |

**State mapping:**
- `State=Default` → idle, no class
- `State=Hover` → `:hover`
- `State=Active` → `isActive=true` — filled purple, white text
- `State=Focused` → `:focus-visible` — focus ring visible
- `State=Disabled` → `disabled=true` — 40% opacity, `not-allowed`

---

## 6. Size Specification

| Dimension | Default | Compact |
|---|---|---|
| Width | 32px | 28px |
| Height | 32px | 28px |
| Font | Body/XS 12px | Body/XS 12px |
| Corner radius | 6px | 6px |
| Focus ring offset | -2px | -2px |
| Focus ring radius | 8px | 8px |

---

## 9. Storybook Stories

```typescript
export const Default: Story = { args: { label: '1', density: 'default' } };
export const Active: Story = { args: { label: '25', density: 'default', isActive: true } };
export const Disabled: Story = { args: { label: '1', density: 'default', disabled: true } };
export const Focused: Story = { args: { label: '1', density: 'default', hasFocus: true } };
export const Compact: Story = { args: { label: '1', density: 'compact' } };
export const CompactActive: Story = { args: { label: '25', density: 'compact', isActive: true } };
```

---
---

# SKILL FILE UPDATE NOTES

The following skill files require updating after this session:

## `00-project-constitution.md` — Component Status Tracker updates

Update the Data List page component tracker:
- `Search Input` — hasScope + hasAdvancedSearch added, defaults corrected to `false`
- `_Internal/Table/Header-Bar` — Disabled variant added
- `Pagination` — Disabled variants added (Default + Compact)
- `Table/Data-Table-v2` — showHeader + showFilterBar + showPagination booleans added, outer border fixed
- All page components — Storybook brief: ✅

## `10-token-reference_skill.md` — Changelog entry

```
2026-07-04
- Search Input: added hasScope (BOOLEAN, default false) and hasAdvancedSearch (BOOLEAN, default false) 
  boolean properties. scope-select (Select instance, md) prepended. advanced-search-link (Hyperlink, md, 
  hasLeadingIcon=true) appended. Default variant width updated to 567px (FIXED). Both properties 
  default to false — opt-in only.
- _Internal/Table/Header-Bar: State=Disabled variant added (clone of Default, opacity=0.40 hardcoded — 
  bind to visibility/disabled token in next pass).
- Pagination: Density=Default/Compact, State=Disabled variants added (clone of FirstPage, opacity=0.40 
  hardcoded — bind to visibility/disabled token in next pass).
- Table/Data-Table-v2: showHeader, showFilterBar, showPagination boolean properties added. Outer border 
  fixed (border/default, 1px, OUTSIDE, cornerRadius=4). COMPONENT_SET clipsContent=false.
- Data List page: cleaned to 11 sections. 12 debris nodes deleted. All components in named sections.
- Full audit completed: 23 blockers, 40 warnings. Priority fixes identified.
```

## `07-figma-execution_skill.md` — New learnings

Add the following entry:

```
OUTSIDE stroke on COMPONENT inside COMPONENT_SET:
OUTSIDE strokes on a COMPONENT variant are clipped by the parent COMPONENT_SET when 
clipsContent=true on the COMPONENT_SET. Fix: set COMPONENT_SET clipsContent=false.
The COMPONENT itself needs clipsContent=false too.
Plugin screenshot tools crop to the node's own bounding box — OUTSIDE strokes that extend 
beyond this boundary will not appear in screenshots even though they render correctly on 
canvas. Verify OUTSIDE strokes by reading node properties directly, not screenshots.
editComponentProperty(key, { defaultValue }) is the correct API to update an existing 
property's default value. addComponentProperty creates a duplicate if the key already exists.
```

