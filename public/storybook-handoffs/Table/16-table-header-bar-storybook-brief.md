# Table/Header-Bar — Storybook Engineering Brief

```yaml
component_name: TableHeaderBar
figma_node_id: "1050:7119"
figma_page: "📊 Data List"
figma_internal_name: "_Internal/Table/Header-Bar"
version: "1.0.0"
status: Active
mode: NEW
build_order: 16
depends_on: [Select, Input, Button, Hyperlink, IconButton]
used_by: [TableDataTableV2]
handover_status: NEEDS_CLARIFICATION
unresolved_question_count: 1
```

## 1. Purpose

The top toolbar of a full data table: search (with scope selector), and a row of toggleable toolbar actions (views, settings, filters, density, grid/list view toggle, extra options).

## 2. Anatomy

```
Header-Bar (variant: State)
├─ Search-Slot (INSTANCE)
│  ├─ scope-select (Select instance — search scope, e.g. "All fields")
│  ├─ Input (search text)
│  ├─ Search-Button (Button instance)
│  └─ advanced-search-link (Hyperlink instance)
└─ Table-Actions (FRAME)
   ├─ extra-options-slot (visible when hasExtraOptions)
   ├─ views-slot → views-btn (Icon Button, visible when hasViews)
   ├─ settings-slot → settings-btn (Icon Button, visible when hasSettings)
   ├─ filters-slot → filters-btn (Icon Button, visible when hasFilters)
   ├─ density-slot → density-btn (Icon Button, always — no boolean, confirm if this should be optional)
   └─ view-toggle-slot → view-toggle-btn (Icon Button, visible when hasViewToggle, gates grid/list toggle — see hasGridView)
```

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `hasSettings` | BOOLEAN | `true` | `onSettingsClick?: () => void` |
| `hasViews` | BOOLEAN | `true` | `onViewsClick?: () => void` |
| `hasFilters` | BOOLEAN | `true` | `onFiltersClick?: () => void` |
| `hasGridView` | BOOLEAN | `true` | gates whether the view-toggle button includes a grid option — `viewOptions?: ('list' \| 'grid')[]` |
| `hasViewToggle` | BOOLEAN | `true` | `onViewToggle?: (view: 'list' \| 'grid') => void` |
| `hasExtraOptions` | BOOLEAN | `false` | `extraActions?: ReactNode` (an open slot for consumer-specific buttons) |
| `State` | VARIANT | `Default` | `disabled?: boolean` (2 variants: Default, Disabled) |

## 4. React Implementation Sketch

```tsx
export interface TableHeaderBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchScope?: string;
  searchScopeOptions?: SelectOption[];
  onSearch: () => void;
  onAdvancedSearch?: () => void;
  onSettingsClick?: () => void;
  onViewsClick?: () => void;
  onFiltersClick?: () => void;
  onViewToggle?: (view: 'list' | 'grid') => void;
  viewOptions?: ('list' | 'grid')[];
  extraActions?: React.ReactNode;
  disabled?: boolean;
}

export function TableHeaderBar({
  searchValue, onSearchChange, searchScope, searchScopeOptions, onSearch, onAdvancedSearch,
  onSettingsClick, onViewsClick, onFiltersClick, onViewToggle, viewOptions = ['list', 'grid'], extraActions, disabled,
}: TableHeaderBarProps) {
  return (
    <div className={cx('table-header-bar', disabled && 'is-disabled')}>
      <div className="search-slot">
        {searchScopeOptions && <Select options={searchScopeOptions} value={searchScope ?? null} onChange={() => {}} size="md" />}
        <Input value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search..." />
        <Button variant="Primary" onClick={onSearch}>Search</Button>
        {onAdvancedSearch && <Hyperlink onClick={onAdvancedSearch}>Advanced search</Hyperlink>}
      </div>
      <div className="table-actions">
        {extraActions}
        {onViewsClick && <IconButton icon={ViewsIcon} aria-label="Views" onClick={onViewsClick} />}
        {onSettingsClick && <IconButton icon={SettingsIcon} aria-label="Table settings" onClick={onSettingsClick} />}
        {onFiltersClick && <IconButton icon={FilterIcon} aria-label="Filters" onClick={onFiltersClick} />}
        <IconButton icon={DensityIcon} aria-label="Row density" />
        {onViewToggle && viewOptions.map((v) => (
          <IconButton key={v} icon={v === 'grid' ? GridIcon : ListIcon} aria-label={`${v} view`} onClick={() => onViewToggle(v)} />
        ))}
      </div>
    </div>
  );
}
```

## 5. Accessibility

- Search field + button should form a real `<form onSubmit>` so Enter submits naturally, not rely on a click handler alone.
- Each toolbar Icon Button needs its own specific `aria-label` (not a shared generic one) — see Icon Button brief §6.

## 6. Storybook Stories

| Story | Args |
|---|---|
| `Default` | all actions visible |
| `MinimalToolbar` | only search, no optional actions |
| `WithAdvancedSearch` | onAdvancedSearch set |
| `Disabled` | disabled=true |

## 7. Do / Don't

| Do | Don't |
|---|---|
| Wrap search in a real `<form>` | Don't rely solely on button click for search submission |

## 8. Decision Log

| Question | Resolution |
|---|---|
| `density-slot`/`density-btn` has no gating boolean in Figma (always present, unlike the other 4 toolbar buttons) | `NEEDS_CLARIFICATION` — confirm whether density toggle should ever be hideable in code, or if its always-on status is intentional. Modeled as always-rendered in the sketch above pending confirmation. |
