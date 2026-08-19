# Table/Header-Cell — Storybook Engineering Brief

```yaml
component_name: TableHeaderCell
figma_node_id: "1146:121332"
figma_page: "📊 Data List"
version: "1.0.0"
status: Active — documentation gap noted (empty CSET-level description in Figma, flagged in tracker)
mode: NEW
build_order: 11
depends_on: [IconWrapper, IconButton, Checkbox, BadgeCounter]
used_by: [TableHeaderRow, TableEntryListV2]
handover_status: NEEDS_CLARIFICATION
unresolved_question_count: 1
```

## 1. Purpose

A single column header cell: label, optional sort control, optional filter icon, optional badge, optional select-all checkbox (for the dedicated checkbox-alignment column).

## 2. Anatomy

```
Header-Cell (variants: Alignment × Sort)
├─ header-label (TEXT) — OR header-checkbox (INSTANCE of Checkbox) when Alignment=Checkbox
├─ header-badge (INSTANCE of Badge/Counter, INSTANCE_SWAP-bindable)
├─ header-sort-icon (INSTANCE, visible + rotated per Sort=Ascending/Descending/None)
├─ header-filter-icon (INSTANCE, visible when column is filterable)
├─ header-focus-ring (FRAME)
├─ header-border-bottom (FRAME)
└─ header-cell-divider (FRAME — vertical rule between columns)
```

`Alignment=Checkbox` variant is architecturally distinct from text-label variants — it replaces `header-label` entirely with a real `Checkbox` instance (confirmed live this session: a real instance with `hasLabel=false`, not a raw shape — unlike the debt found and fixed in Data-Row this session).

## 3. Props

| Figma property | Type | React prop |
|---|---|---|
| `Alignment` | VARIANT (`Left`, `Right`, `Checkbox`) | `align: 'left' \| 'right' \| 'checkbox'` |
| `Sort` | VARIANT (`None`, `Ascending`, `Descending`) | `sortDirection?: 'asc' \| 'desc' \| null` |
| label text | TEXT | `label: string` (ignored when `align='checkbox'`) |
| badge | INSTANCE_SWAP | `badge?: { count: number; intent?: BadgeIntent }` |
| filter icon visibility | derived | `filterable?: boolean` |
| checkbox (select-all) | — | `onSelectAll?: (checked: boolean) => void`, `selectAllState?: boolean \| 'indeterminate'` — only when `align='checkbox'` |

## 4. React Implementation Sketch

```tsx
export interface TableHeaderCellProps {
  align?: 'left' | 'right' | 'checkbox';
  label?: string;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  filterable?: boolean;
  onFilter?: () => void;
  badge?: { count: number; intent?: BadgeIntent };
  selectAllState?: boolean | 'indeterminate';
  onSelectAll?: (checked: boolean) => void;
}

export function TableHeaderCell({
  align = 'left', label, sortDirection, onSort, filterable, onFilter, badge, selectAllState, onSelectAll,
}: TableHeaderCellProps) {
  return (
    <th className={cx('table-header-cell', `align-${align}`)} aria-sort={
      sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : sortDirection === null && onSort ? 'none' : undefined
    }>
      {align === 'checkbox' ? (
        <Checkbox
          checked={selectAllState ?? false}
          onCheckedChange={onSelectAll!}
          hideLabel
          label="Select all rows"
        />
      ) : (
        <span className="header-label">{label}</span>
      )}
      {badge && <BadgeCounter count={badge.count} intent={badge.intent} />}
      {onSort && (
        <IconButton
          icon={sortDirection === 'asc' ? SortAscIcon : sortDirection === 'desc' ? SortDescIcon : SortNeutralIcon}
          aria-label={`Sort by ${label}`}
          type="Ghost"
          size="xs"
          onClick={onSort}
        />
      )}
      {filterable && <IconButton icon={FilterIcon} aria-label={`Filter ${label}`} type="Ghost" size="xs" onClick={onFilter} />}
    </th>
  );
}
```

## 5. Accessibility

- `<th scope="col">` (add `scope="col"` — not shown above, required) with `aria-sort` reflecting current sort state is the standard, correct pattern for sortable table headers.
- Select-all checkbox needs a real accessible label ("Select all rows") — the visual column has no text, so this cannot be inferred from surrounding content.

## 6. Storybook Stories

| Story | Args |
|---|---|
| `TextColumn` | label + sort |
| `CheckboxColumn` | align='checkbox' |
| `WithBadge` | badge set |
| `Filterable` | filterable=true |
| `SortStates` | 3 stories: none/asc/desc |

## 7. Do / Don't

| Do | Don't |
|---|---|
| Use `aria-sort` on the `<th>` itself | Don't only indicate sort direction with a rotated icon |

## 8. Decision Log

| Question | Resolution |
|---|---|
| CSET-level Figma description is empty (tracker-flagged gap, predates this session) | `NEEDS_CLARIFICATION` — this brief reconstructs behavior from live structure + property definitions since no authored documentation exists to cross-check against. Recommend backfilling the Figma component description once this brief is reviewed, so future sessions aren't reconstructing from scratch again. |
