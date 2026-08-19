# Table/Data-Row — Storybook Engineering Brief

```yaml
component_name: TableDataRow
figma_node_id: "1146:62610"
figma_page: "📊 Data List"
version: "1.1.0"
status: Active
mode: NEW
build_order: 15
depends_on: [Checkbox, Radio, TableDataCell]
used_by: [TableEntryListV2]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

A single data row. Hosts an optional 48px selection column (Checkbox for multi-select, Radio for single-select) and a flexible cell slot. The most extensively engineered component in this brief set — built, audited, and documented across this session.

## 2. Anatomy

```
Data-Row (variants: Density × State)
├─ row-checkbox-cell (48px, visible when hasSelection)
│  └─ selection control (real Checkbox or Radio instance, Size=sm, hasLabel=false, centered)
├─ cells (SLOT — accepts Table/Data-Cell instances)
├─ row-border-bottom (FRAME)
└─ row-focus-ring (FRAME, ABSOLUTE positioned, hasFocus-driven)
```

12 variants: `Density` (Default 36px / Compact 28px) × `State` (Default, Hover, Selected, **Selected-Hover**, Focused, Disabled).

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `hasSelection` | BOOLEAN | `true` | `showSelectionColumn?: boolean` (renamed from `hasCheckbox` this session) |
| `selectionControl` | INSTANCE_SWAP | Checkbox | `selectionMode: 'checkbox' \| 'radio'` |
| `hasFocus` | BOOLEAN | `false` | native `:focus-visible` on the row, but see §6 — genuinely wired this session, not cosmetic |
| `cells` | SLOT | — | `children: ReactNode` |
| selected/checked visual | — | `selected?: boolean` | drives selection control's own checked state |

## 4. Critical implementation notes carried over from Figma platform constraints

**These do not apply to React** — they were Figma Plugin API limitations discovered while building this component, listed here only so the code implementation isn't accidentally modeled to replicate a Figma-specific bug:

- In Figma, a single Instance-Swap property couldn't hold different baked defaults per row-state variant (a confirmed Figma platform limitation, not a design intent) — **in React this is trivial**: `selected` and `selectionMode` are just independent props; there's no equivalent constraint.
- Disabled rows use a single opacity cascade in Figma (0.40) rather than per-child disabled styling to avoid double-dimming — **in React**, apply `opacity: 0.4` at the row level via CSS, and set the nested Checkbox/Radio's own `disabled` prop to `false`/inert visually only through the cascade, not by ALSO passing `disabled={true}` to the nested control (which in Figma would have compounded 0.4×0.4; in CSS the risk is instead double-graying via two independent opacity or `filter` rules — same principle, avoid stacking).
- Focused rows show ONE ring (row-level) — the nested Checkbox/Radio does NOT also show its own focus ring simultaneously, avoiding a nested double-ring artifact. In React: the row is the actual keyboard-focusable element (`tabIndex={0}` + `role="row"` semantics or a real interactive row pattern); the nested control should not independently receive `:focus-visible` styling when the ROW is what's focused — model this with a single source of truth for "is this row focused," not two independent focus states.

## 5. Token Reference

| State | Row background | Notes |
|---|---|---|
| Default | transparent | — |
| Hover | `surface/interactive/hover` | — |
| Selected | `surface/selected` | Confirmed this session: token is correctly wired but renders very subtly/near-white by design-value, not a bug — flagged to design as a possible future token-value change, not yet resolved. Implement exactly as the token resolves; don't compensate by hardcoding a stronger color in code. |
| Selected-Hover | `surface/selected` (base) + `surface/hover-overlay` (absolute overlay, ~16% opacity) | New this session — closes an enterprise-standards requirement for a combined state distinct from Selected alone. |
| Focused | transparent + `border/focus` 2px ring, row-level only | — |
| Disabled | `visibility/disabled` 0.40 opacity, cascading | — |

## 6. React Implementation Sketch

```tsx
export interface TableDataRowProps {
  showSelectionColumn?: boolean;
  selectionMode?: 'checkbox' | 'radio';
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  disabled?: boolean;
  density?: 'Default' | 'Compact';
  children: React.ReactNode; // TableDataCell elements
  rowId: string; // for radio grouping when selectionMode='radio'
  groupName?: string; // radio group name, required when selectionMode='radio'
}

export function TableDataRow({
  showSelectionColumn = true, selectionMode = 'checkbox', selected, onSelectChange,
  disabled, density = 'Default', children, rowId, groupName,
}: TableDataRowProps) {
  return (
    <tr
      className={cx('table-data-row', `density-${density.toLowerCase()}`, selected && 'is-selected', disabled && 'is-disabled')}
      aria-selected={selected}
    >
      {showSelectionColumn && (
        <td className="row-selection-cell">
          {selectionMode === 'checkbox' ? (
            <Checkbox checked={!!selected} onCheckedChange={onSelectChange!} hideLabel label={`Select row ${rowId}`} disabled={disabled} size="sm" />
          ) : (
            <Radio checked={!!selected} onCheckedChange={onSelectChange!} name={groupName!} value={rowId} hideLabel label={`Select row ${rowId}`} disabled={disabled} size="sm" />
          )}
        </td>
      )}
      {children}
    </tr>
  );
}
```

## 7. Accessibility

- `aria-selected` on the `<tr>` reflects selection state to assistive tech independent of the visual checkbox/radio.
- Keyboard: Tab moves between rows; Space toggles selection (checkbox mode) or selects (radio mode); Ctrl+A selects all (checkbox mode only, handled at the table level); Escape cancels an in-progress multi-select drag (if implemented).
- Selection control needs a per-row accessible label ("Select row {rowId}" at minimum; prefer a domain-specific label like "Select Homepage Hero Banner" if row content is available to the row component).

## 8. Storybook Stories

| Story | Args |
|---|---|
| `CheckboxMode` | selectionMode='checkbox', multiple rows, multi-select interaction test |
| `RadioMode` | selectionMode='radio', shared groupName, single-select interaction test |
| `Selected` / `SelectedHover` | visual states |
| `Focused` | keyboard focus interaction test, asserts single ring only |
| `Disabled` | disabled=true |
| `Compact` | density='Compact' |
| `NoSelectionColumn` | showSelectionColumn=false |

## 9. Do / Don't

| Do | Don't |
|---|---|
| Give every row a stable `rowId` for radio grouping and accessible labels | Don't reuse array index as `rowId` — breaks on reorder/filter |
| Keep row-level and control-level focus as one source of truth | Don't let the nested Checkbox/Radio manage independent focus-visible styling when the row itself is the focus target |

## 10. Decision Log

| Question / Alternative considered | Resolution / Trade-off |
|---|---|
| Separate `Table/Entry-Picker` component vs. fixing Data-Row directly | Fixed Data-Row directly — avoids duplicate maintenance of near-identical row logic. |
| Bake per-row-state Checked default via a single shared swap property | Not possible in Figma (platform constraint, see §4) — resolved by making `selected` and `selectionMode` fully independent props in code, which has no equivalent limitation. |
| Add `Selected-Disabled` combined state | Deferred — not named as a required combined state in enterprise-standards (only `Selected-Hover` is); revisit if a real product need surfaces. |
| `surface/selected` renders very pale | Flagged to design, not resolved — a shared token change affecting every consumer, not scoped to this component alone. |
