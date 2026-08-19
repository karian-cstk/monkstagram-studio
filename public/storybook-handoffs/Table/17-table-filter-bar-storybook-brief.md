# Table/Filter-Bar — Storybook Engineering Brief

```yaml
component_name: TableFilterBar
figma_node_id: "1272:30097"
figma_page: "📊 Data List"
version: "1.0.0"
status: Active
mode: NEW
build_order: 17
depends_on: [IconButton, Hyperlink]
used_by: [TableDataTableV2]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

The active-filters summary bar shown below the header bar when filters are applied (e.g. "3 filters applied · Show all · Clear all" seen in the reference screenshot this session).

## 2. Anatomy

```
Filter-Bar (variants: Layout × State)
├─ filter-bar-toggle (Icon Button — expand/collapse chip list)
├─ filter-bar-divider-v (FRAME)
├─ filter-bar-count-label (TEXT — "3")
├─ filter-bar-summary (TEXT — "filters applied")
├─ filter-bar-sep (TEXT — "·")
├─ filter-bar-show-all (Hyperlink)
├─ filter-bar-pipe (TEXT — "|")
├─ filter-bar-clear-all (Hyperlink)
├─ filter-bar-accent (FRAME — left accent bar, matches the purple accent seen in the reference screenshot)
└─ filter-bar-chips (SLOT, accepts Tag/Chip instances — the actual filter pills, shown when State=Expanded)
```

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `activeFilterCount` | TEXT | `"3"` | `filterCount: number` |
| `filter-bar-chips` | SLOT | — | `children?: ReactNode` (Tag/Chip elements, only rendered when expanded) |
| `Layout` | VARIANT | `Multi-line` | `layout: 'single-line' \| 'multi-line'` |
| `State` | VARIANT | `Collapsed` | `expanded?: boolean` (3 variants: Default, Collapsed, Expanded — `Default` vs `Collapsed` distinction needs live confirmation, see §6) |

## 4. React Implementation Sketch

```tsx
export interface TableFilterBarProps {
  filterCount: number;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onShowAll?: () => void;
  onClearAll?: () => void;
  layout?: 'single-line' | 'multi-line';
  children?: React.ReactNode; // filter chips, shown when expanded
}

export function TableFilterBar({ filterCount, expanded, onToggleExpand, onShowAll, onClearAll, layout = 'multi-line', children }: TableFilterBarProps) {
  if (filterCount === 0) return null;
  return (
    <div className={cx('table-filter-bar', `layout-${layout}`)}>
      <div className="filter-bar-summary-row">
        <IconButton icon={expanded ? ChevronUpIcon : ChevronDownIcon} aria-label={expanded ? 'Collapse filters' : 'Expand filters'} onClick={onToggleExpand} type="Ghost" size="xs" />
        <span className="filter-bar-count">{filterCount}</span>
        <span>filters applied</span>
        <span aria-hidden>·</span>
        <Hyperlink onClick={onShowAll}>Show all</Hyperlink>
        <span aria-hidden>|</span>
        <Hyperlink onClick={onClearAll}>Clear all</Hyperlink>
      </div>
      {expanded && <div className="filter-bar-chips">{children}</div>}
    </div>
  );
}
```

## 5. Accessibility

- The toggle button's `aria-label` must flip between "Expand"/"Collapse filters" and reflect `aria-expanded` — not shown above, add `aria-expanded={expanded}` on the toggle button.
- Filter count should be announced meaningfully — consider `aria-live="polite"` on the count region if filters can change without a full page reload, so screen reader users hear the updated count.

## 6. Storybook Stories

| Story | Args |
|---|---|
| `Collapsed` | expanded=false |
| `Expanded` | expanded=true, with 3 filter chips |
| `SingleLine` / `MultiLine` | layout variants |
| `ZeroFilters` | filterCount=0 — verify component renders nothing |

## 7. Do / Don't

| Do | Don't |
|---|---|
| Return `null` when there are zero active filters | Don't render an empty filter bar shell |

## 8. Decision Log

| Question | Resolution |
|---|---|
| Distinction between `State=Default` and `State=Collapsed` | Not fully disambiguated this session — both may represent the same "not expanded" concept with `Default` as an unused/legacy variant, or there may be a real third state. Modeled as a simple boolean `expanded` in code; revisit if a genuine 3-state need is confirmed. |
