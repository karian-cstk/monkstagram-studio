# Table/Actions-Cell — Storybook Engineering Brief

```yaml
component_name: TableActionsCell
figma_node_id: "1146:62438"
figma_page: "📊 Data List"
version: "1.0.0"
status: Active
mode: NEW
build_order: 13
depends_on: [IconButton]
used_by: [TableEntryListV2]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

Dedicated cell type for the row-level actions column (edit/delete icon buttons). Kept as a separate component from Table/Data-Cell's `Actions` type reference — this is the real implementation.

## 2. Anatomy

```
Actions-Cell (variants: Density × hasEditAction × hasDeleteAction)
├─ edit-action (INSTANCE of Icon Button, visible when hasEditAction)
├─ delete-action (INSTANCE of Icon Button, visible when hasDeleteAction)
└─ cell-focus-ring / cell-border-bottom (FRAME, matching Data-Cell's shell)
```

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `hasEditAction` | BOOLEAN | `true` | `onEdit?: () => void` (presence of the handler determines visibility, cleaner than a separate boolean in code) |
| `hasDeleteAction` | BOOLEAN | `true` | `onDelete?: () => void` |
| `hasFocus` | BOOLEAN | `false` | native `:focus-visible`, per-button not per-cell (each action button manages its own focus independently — matches the row-level "independent click targets" pattern confirmed for List/CascadingItem this session) |
| `Density` | VARIANT | `Default` | `density: 'Default' \| 'Compact'` |

## 4. React Implementation Sketch

```tsx
export interface TableActionsCellProps {
  onEdit?: () => void;
  onDelete?: () => void;
  density?: 'Default' | 'Compact';
  rowLabel: string; // required for building accessible names, e.g. "Edit Homepage Hero Banner"
}

export function TableActionsCell({ onEdit, onDelete, density = 'Default', rowLabel }: TableActionsCellProps) {
  return (
    <td className={cx('table-actions-cell', `density-${density.toLowerCase()}`)}>
      {onEdit && <IconButton icon={EditIcon} aria-label={`Edit ${rowLabel}`} type="Ghost" size="xs" onClick={onEdit} />}
      {onDelete && <IconButton icon={DeleteIcon} aria-label={`Delete ${rowLabel}`} type="Ghost" size="xs" onClick={onDelete} />}
    </td>
  );
}
```

## 5. Accessibility

- Each action button needs a ROW-SPECIFIC accessible name ("Edit Homepage Hero Banner", not just "Edit") — a table full of identically-labeled "Edit" buttons is a common, real accessibility failure; require `rowLabel` as a mandatory prop specifically to prevent this.
- Focus/hover is scoped per-button, matching the confirmed system pattern (row-level state doesn't force both buttons to highlight together).

## 6. Storybook Stories

| Story | Args |
|---|---|
| `BothActions` | edit + delete |
| `EditOnly` / `DeleteOnly` | one handler omitted |
| `Compact` | density=Compact |
| `AccessibleNaming` | a11y test asserting each button's computed name includes `rowLabel` |

## 7. Do / Don't

| Do | Don't |
|---|---|
| Require `rowLabel` to build specific accessible names | Don't ship generic "Edit"/"Delete" labels across every row |

## 8. Decision Log

None outstanding.
