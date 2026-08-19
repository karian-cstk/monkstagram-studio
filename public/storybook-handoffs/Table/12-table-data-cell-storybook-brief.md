# Table/Data-Cell — Storybook Engineering Brief

```yaml
component_name: TableDataCell
figma_node_id: "1131:1679"
figma_page: "📊 Data List"
version: "1.1.0"
status: Active
mode: NEW
build_order: 12
depends_on: [IconWrapper, Hyperlink]
used_by: [TableDataRow]
handover_status: NEEDS_CLARIFICATION
unresolved_question_count: 1
```

## 1. Purpose

A single row/column data cell. The most polymorphic component in the table system — 9 distinct content types share one cell shell (padding, height, border, focus ring).

## 2. Anatomy

```
Data-Cell (variants: Type × Density × hasIcon)
├─ cell-content (structure varies by Type — see §3)
├─ cell-focus-ring (FRAME)
└─ cell-border-bottom (FRAME)
```

## 3. Props (by Type)

| Type | Content | React prop shape |
|---|---|---|
| `Text` | plain text | `value: string` |
| `TextSubtext` | primary + secondary line | `value: string; subtext?: string` |
| `Status` | colored status pill | `status: { label: string; intent: StatusIntent }` |
| `Number` | right-aligned numeric | `value: number; format?: Intl.NumberFormatOptions` |
| `Date` | formatted date | `value: Date \| string; format?: string` |
| `Link` | Hyperlink instance | `href: string; label: string` |
| `Actions` | inline action buttons | handled by the separate **Table/Actions-Cell** component (13), not this Type |
| `Editable` | inline-editable text | `value: string; onChange: (v: string) => void` |
| `TagSlot` | FILL slot (Tag/Chip) + overflow wrapper | `tags: TagData[]; overflowCount?: number; hasOverflow?: boolean` |

Cross-cutting props on every type: `hasIcon?: boolean; icon?: ComponentType` (trailing 16px icon, added in an earlier session per changelog), `density: 'Default' | 'Compact'`.

## 4. React Implementation Sketch

Implement as a discriminated union — one component, type-narrowed content:

```tsx
type DataCellProps =
  | { type: 'text'; value: string }
  | { type: 'textSubtext'; value: string; subtext?: string }
  | { type: 'status'; status: { label: string; intent: StatusIntent } }
  | { type: 'number'; value: number; format?: Intl.NumberFormatOptions }
  | { type: 'date'; value: Date | string; format?: string }
  | { type: 'link'; href: string; label: string }
  | { type: 'editable'; value: string; onChange: (v: string) => void }
  | { type: 'tagSlot'; tags: TagData[]; overflowCount?: number };

export function TableDataCell(props: DataCellProps & { density?: 'Default' | 'Compact'; icon?: React.ComponentType }) {
  return (
    <td className={cx('table-data-cell', `density-${(props.density ?? 'Default').toLowerCase()}`)}>
      <DataCellContent {...props} />
      {props.icon && <props.icon aria-hidden />}
    </td>
  );
}

function DataCellContent(props: DataCellProps) {
  switch (props.type) {
    case 'text': return <span>{props.value}</span>;
    case 'textSubtext': return <div><span className="cell-primary">{props.value}</span>{props.subtext && <span className="cell-subtext">{props.subtext}</span>}</div>;
    case 'status': return <StatusPill label={props.status.label} intent={props.status.intent} />;
    case 'number': return <span className="cell-number">{new Intl.NumberFormat(undefined, props.format).format(props.value)}</span>;
    case 'date': return <time dateTime={new Date(props.value).toISOString()}>{formatDate(props.value, props.format)}</time>;
    case 'link': return <Hyperlink href={props.href}>{props.label}</Hyperlink>;
    case 'editable': return <EditableCellText value={props.value} onChange={props.onChange} />;
    case 'tagSlot': return <TagSlotCell tags={props.tags} overflowCount={props.overflowCount} />;
  }
}
```

## 5. TagSlot deep-dive (two-wrapper architecture, per changelog)

- FILL slot accepts Tag/Chip instances directly.
- Overflow wrapper (FILL) shows "+ N more" — controlled by `hasOverflow`.
- When `hasOverflow=false`, the tag slot fills 100% of cell width.
- One Figma manual-link step was noted historically (`cell-slot-content` → SLOT property) — has no code equivalent; in React this is just `tags.slice(0, visibleCount)` + a computed overflow count, no special wiring needed.

## 6. Accessibility

- `Date` type: always render a real `<time dateTime="...">` with an ISO string, visible text can be locale-formatted separately.
- `Editable` type: must be keyboard-operable (Enter to commit, Escape to cancel) — this is a genuinely stateful sub-component, not just a styled `<input>`; needs its own focus-management story.
- `Status` pill: never convey status by color alone — pair with the text label (already part of the prop shape above, confirm the implementation doesn't drop it visually).

## 7. Storybook Stories

One story per Type (9 total) + `WithIcon`, `Compact`, `TagSlotOverflow` (tags exceeding visible count), `EditableInteraction` (interaction test: click → edit → Enter commits).

## 8. Do / Don't

| Do | Don't |
|---|---|
| Model this as a discriminated union in TypeScript | Don't ship one giant props object with every field optional and type-check nothing |

## 9. Decision Log

| Question | Resolution |
|---|---|
| Exact `Editable` type keyboard contract (Tab-in behavior, multi-line support) | `NEEDS_CLARIFICATION` — Figma shows only a static "editable-looking" visual state, not the actual edit-mode interaction sequence. Needs product/design input before implementation; do not infer a full inline-edit UX from a single static frame. |
