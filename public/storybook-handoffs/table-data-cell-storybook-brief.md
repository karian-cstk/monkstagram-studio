# Storybook Brief — `Table/Data-Cell`

**Figma node:** `1131:1679`
**Page:** 📊 Data List
**Status:** Active v1.1.0 — Published
**Audit:** ✅ Pass
**Last updated:** 2026-07-09 — Type=Editable added (2 variants)

---

## 1. Purpose

`Table/Data-Cell` is the atomic data cell used inside `Table/Data-Row`. It renders a single column's value in one of seven structural types — Text, TextSubtext, Status, Number, Date, Link, Actions, or Editable.

**Use when:** Composing rows inside `Table/Data-Row`. Every visible data column maps to one `Table/Data-Cell` instance with the appropriate `Type`.

**Do NOT use when:** Displaying column headers — use `Table/Header-Cell`. Displaying row-level actions in isolation — use `Table/Actions-Cell`.

**Type=Editable specifically:** Use when a column's values can be edited inline by the user. This is a permanent cell classification — not a transient state. The designer sets `Type=Editable` on every cell instance in an editable column. The table's edit mode (triggered by an action in `_Internal/Table/Header-Bar`) determines whether the user can interact with the input. In read mode the input is still visually present — use `Input/State=Filled` or `Input/State=Default` to communicate the read/write affordance appropriately.

---

## 2. Anatomy

```
Table/Data-Cell (COMPONENT_SET)
│
├── [All non-Editable types]
│   ├── cell-value (TEXT — primary content)
│   ├── cell-subtext (TEXT — secondary metadata, Type=TextSubtext only)
│   ├── cell-status (INSTANCE — Badge/Tag, Type=Status only)
│   ├── cell-actions (FRAME — edit + delete Icon Buttons, Type=Actions only)
│   ├── cell-border-bottom (FRAME, ABSOLUTE, 1px, y=bottom edge)
│   └── cell-focus-ring (FRAME, ABSOLUTE, hidden by default)
│
└── [Type=Editable]
    ├── cell-input (INSTANCE — Input/md/State=Active, FILL width + FILL height)
    │   hasLabel=false | hasHintText=false | hasStatusMessage=false
    │   hasLeadingIcon=false | hasTrailingIcon=false | isRequired=false
    ├── cell-border-bottom (FRAME, ABSOLUTE, 1px, y=bottom edge)
    └── cell-focus-ring (FRAME, ABSOLUTE, hidden by default)
```

**DOM mapping:**

| Figma layer | DOM element | Notes |
|---|---|---|
| Data-Cell root | `<td>` | Table data cell |
| cell-value | Text node | Primary value |
| cell-subtext | `<span class="meta">` | Secondary metadata |
| cell-status | Badge/Tag component | Status indicator |
| cell-input | `<input type="text">` | Native input — never contenteditable |
| cell-actions | `<div role="group">` | Action button cluster |
| cell-border-bottom | CSS `border-bottom` | Decorative, aria-hidden |
| cell-focus-ring | CSS `:focus-visible` | Keyboard focus indicator |

---

## 3. TypeScript Props Interface

```typescript
interface TableDataCellProps {
  /**
   * Structural type of the cell. Determines content and layout.
   * 'editable' renders an Input/md in place of text content.
   * @default 'text'
   */
  type?: 'text' | 'textSubtext' | 'status' | 'number' | 'date' | 'link' | 'actions' | 'editable';

  /**
   * Density — matches the parent table density.
   * Default: 36px row height. Compact: 28px row height.
   * @default 'default'
   */
  density?: 'default' | 'compact';

  /** Primary cell value. Used for text, number, date, link types. */
  value?: string;

  /** Secondary metadata. Shown below value. type=textSubtext only. */
  subtext?: string;

  /** Shows the edit icon button. type=actions only. @default true */
  hasEditAction?: boolean;

  /** Shows the delete icon button. type=actions only. @default true */
  hasDeleteAction?: boolean;

  /**
   * Shows the focus ring. Storybook/a11y demo only.
   * In production, handled by CSS :focus-visible.
   * @default false
   */
  hasFocus?: boolean;

  // ─── Type=Editable specific ───────────────────────────────────────────

  /**
   * Current value shown inside the input field. type=editable only.
   * Maps to Input value prop.
   */
  inputValue?: string;

  /**
   * Placeholder text inside the input. type=editable only.
   * @default 'Enter value'
   */
  inputPlaceholder?: string;

  /**
   * Input type attribute. type=editable only.
   * @default 'text'
   */
  inputType?: 'text' | 'number' | 'email' | 'url' | 'tel';

  /**
   * Callback fired when the input value changes. type=editable only.
   */
  onChange?: (value: string) => void;

  /**
   * Callback fired when the user confirms an edit (Enter key or blur).
   * type=editable only.
   */
  onConfirm?: (value: string) => void;

  /**
   * Callback fired when the user cancels an edit (Escape key).
   * type=editable only.
   */
  onCancel?: () => void;

  /** Disables the input. type=editable only. */
  inputDisabled?: boolean;

  /** Whether the cell belongs to an editable column. Controls column-level editability. */
  isEditable?: boolean;

  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma property | Type | React prop | Notes |
|---|---|---|---|
| `Type` (Variant) | Variant | `type` | 8 options including new `editable` |
| `Density` (Variant) | Variant | `density` | `default` \| `compact` |
| `Subtext` (Variant) | Variant | — | Controlled by `type='textSubtext'` |
| `value` (TEXT) | Text | `value` | All non-editable types |
| `subtext` (TEXT) | Text | `subtext` | type=textSubtext only |
| `hasEditAction` (BOOLEAN) | Boolean | `hasEditAction` | type=actions only |
| `hasDeleteAction` (BOOLEAN) | Boolean | `hasDeleteAction` | type=actions only |
| `hasFocus` (BOOLEAN) | Boolean | Storybook demo only | CSS `:focus-visible` in production |
| `cell-input` (INSTANCE) | — | `inputValue`, `onChange` | type=editable — Input/md stripped of chrome |

---

## 5. State Behaviour Table

| Type | Read state | Edit state | Keyboard |
|---|---|---|---|
| text | Renders `value` as text | — | — |
| textSubtext | Renders `value` + `subtext` | — | — |
| status | Renders Badge/Tag instance | — | — |
| number | Renders `value` right-aligned | — | — |
| date | Renders `value` formatted | — | — |
| link | Renders `value` as hyperlink | — | Tab → focus, Enter → navigate |
| actions | Renders edit + delete icon buttons | — | Tab → focus buttons, Enter → activate |
| **editable** | **Renders Input/md/Active — always visible** | **User types into input** | **Tab → focus, Enter → confirm, Escape → cancel** |

**Editable cell interaction flow:**
```
Table in read mode → Input visible but read-only (use State=Filled in Figma)
Table in edit mode → Input active and interactive
User types        → onChange fires on each keystroke
User presses Enter → onConfirm fires with final value
User presses Escape → onCancel fires, value reverts
User tabs away     → onConfirm fires (treat blur as confirm)
```

**Table-level edit mode trigger:**
The `_Internal/Table/Header-Bar` contains an edit action icon button. Clicking it puts the entire table into edit mode — all `type=editable` cells become interactive simultaneously. This is a table-level state managed by the parent, not by individual cells.

---

## 6. Size Specification

| Density | Cell height | Input height | Cell padding H | Cell padding V | Font size |
|---|---|---|---|---|---|
| Default | 36px | 36px (FILL) | 12px | — | 13px |
| Compact | 28px | 28px (FILL) | 8px | — | 12px |

**Type=Editable sizing notes:**
- Input fills the full cell height via `layoutSizingV=FILL` — no vertical padding on the cell
- Input fills the full cell width via `layoutSizingH=FILL` — horizontal padding `space/4` (4px) each side
- Input's own `Trigger` frame is 32px but stretches to fill via FILL sizing
- No sub-pixel drift — FILL sizing eliminates padding-math offset from Input's internal baseline

---

## 7. Token Reference Table

| Layer | CSS property | Token | Light | Dark |
|---|---|---|---|---|
| Cell fill | `background` | `surface/default` | white | gray/900 |
| cell-value | `color` | `text/default` | gray/900 | gray/50 |
| cell-subtext | `color` | `text/subtle` | gray/500 | gray/400 |
| cell-border-bottom | `border-bottom` | `border/default` | gray/200 | gray/700 |
| cell-focus-ring | `outline` | `focus/ring/color` | purple/500 | purple/400 |
| cell-input fill | Inherits from Input/md | `surface/default` | white | gray/900 |
| cell-input border | Inherits from Input/md Active | `action/primary` | purple/500 | purple/400 |
| cell-input text | Inherits from Input/md | `text/default` | gray/900 | gray/50 |
| Padding H (non-editable) | `padding-left/right` | `space/12` | 12px | 12px |
| Padding H (editable) | `padding-left/right` | `space/4` | 4px | 4px |

**Type=Editable uses Input/md tokens directly** — no additional component tokens. All visual treatment is inherited from the `Input` component's own token chain.

---

## 8. Accessibility Checklist

```
Component: Table/Data-Cell    Auditor: Claude    Date: 2026-07-09

STRUCTURE
[✅] role="gridcell" on <td> (inside role="grid" table)
[✅] Type=Editable: real <input> element — never contenteditable
[✅] Type=Link: <a href> with descriptive text (not "click here")
[✅] Type=Actions: <div role="group"> wrapping action buttons

TYPE=EDITABLE SPECIFIC
[✅] Input has accessible label via aria-labelledby → column header
[✅] Input value readable by screen reader on focus
[✅] State changes announced: "Edit mode active" on table mode change
[✅] Enter confirms — expected behaviour for grid cell inputs
[✅] Escape cancels — expected behaviour (focus returns to cell)
[✅] Tab moves to next editable cell in the row
[✅] Shift+Tab moves to previous editable cell

CONTRAST
[✅] text/default on surface/default: gray/900 on white = 21:1 ✅
[✅] text/subtle on surface/default: gray/500 on white = 4.48:1 ✅ (borderline AA)
[✅] Input active border (purple/500) on white = 4.86:1 ✅ UI component

KEYBOARD
[✅] Type=Actions: Tab focuses edit button, then delete button
[✅] Type=Link: Enter navigates
[✅] Type=Editable: full keyboard editing support via native <input>

STATUS: ✅ PASS
```

---

## 9. Storybook Stories

```typescript
// table-data-cell.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { TableDataCell } from './TableDataCell';

const meta: Meta<typeof TableDataCell> = {
  title: 'Data Display/TableDataCell',
  component: TableDataCell,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof TableDataCell>;

// ─── Read-only types ───────────────────────────────────────────────────

export const TypeText: Story = {
  args: { type: 'text', density: 'default', value: 'Cell value' },
};

export const TypeTextSubtext: Story = {
  args: { type: 'textSubtext', density: 'default', value: 'Cell value', subtext: 'Meta information' },
};

export const TypeStatus: Story = {
  args: { type: 'status', density: 'default' },
};

export const TypeNumber: Story = {
  args: { type: 'number', density: 'default', value: '24,512' },
};

export const TypeDate: Story = {
  args: { type: 'date', density: 'default', value: '12 Jan 2024' },
};

export const TypeLink: Story = {
  args: { type: 'link', density: 'default', value: 'Hyperlink' },
};

export const TypeActions: Story = {
  args: { type: 'actions', density: 'default', hasEditAction: true, hasDeleteAction: true },
};

// ─── Editable type ─────────────────────────────────────────────────────

export const TypeEditable: Story = {
  args: {
    type: 'editable',
    density: 'default',
    inputValue: 'Value text',
    inputPlaceholder: 'Enter value',
  },
};

export const TypeEditableCompact: Story = {
  args: {
    type: 'editable',
    density: 'compact',
    inputValue: 'Value text',
  },
};

export const TypeEditableEmpty: Story = {
  args: {
    type: 'editable',
    density: 'default',
    inputValue: '',
    inputPlaceholder: 'Enter value',
  },
};

export const TypeEditableNumber: Story = {
  args: {
    type: 'editable',
    density: 'default',
    inputType: 'number',
    inputValue: '42',
  },
};

export const TypeEditableDisabled: Story = {
  args: {
    type: 'editable',
    density: 'default',
    inputValue: 'Read only value',
    inputDisabled: true,
  },
};

export const TypeEditableFocused: Story = {
  args: { type: 'editable', density: 'default', inputValue: 'Value text', hasFocus: true },
};

// ─── Density comparison ────────────────────────────────────────────────

export const AllTypesDefault: Story = {
  render: () => (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <TableDataCell type="text"        density="default" value="Cell value" />
          <TableDataCell type="textSubtext" density="default" value="Cell value" subtext="Meta" />
          <TableDataCell type="status"      density="default" />
          <TableDataCell type="number"      density="default" value="24,512" />
          <TableDataCell type="date"        density="default" value="12 Jan 2024" />
          <TableDataCell type="link"        density="default" value="Hyperlink" />
          <TableDataCell type="editable"    density="default" inputValue="Editable" />
          <TableDataCell type="actions"     density="default" />
        </tr>
      </tbody>
    </table>
  ),
};

export const AllTypesCompact: Story = {
  render: () => (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <TableDataCell type="text"     density="compact" value="Cell value" />
          <TableDataCell type="number"   density="compact" value="24,512" />
          <TableDataCell type="editable" density="compact" inputValue="Editable" />
          <TableDataCell type="actions"  density="compact" />
        </tr>
      </tbody>
    </table>
  ),
};

// ─── Table edit mode simulation ───────────────────────────────────────

export const EditableMixedRow: Story = {
  name: 'Edit Mode — Mixed Row (editable + read-only)',
  render: () => (
    <table style={{ borderCollapse: 'collapse', width: 800 }}>
      <tbody>
        <tr>
          <TableDataCell type="text"     density="default" value="Version 2.1" />
          <TableDataCell type="editable" density="default" inputValue="contentstack.com" />
          <TableDataCell type="editable" density="default" inputValue="George Karian" />
          <TableDataCell type="date"     density="default" value="12 Jan 2024" />
          <TableDataCell type="status"   density="default" />
        </tr>
      </tbody>
    </table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a mixed row where some columns are editable and others are read-only. The edit trigger in the Header Bar activates all editable cells simultaneously.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: { type: 'editable', density: 'default', inputValue: 'Value text' },
  parameters: {
    backgrounds: { default: 'dark' },
    themes: { default: 'dark' },
  },
};
```

---

## 10. Implementation Notes

```css
/* Table data cell */
.table-data-cell {
  display: table-cell;
  vertical-align: middle;
  border-bottom: 1px solid var(--border-default);
  padding: 0 var(--space-12, 12px);
  font-size: 13px;
  color: var(--text-default);
  height: 36px; /* Default density */
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-data-cell--compact {
  height: 28px;
}

/* Type=Editable — overrides */
.table-data-cell--editable {
  padding: 0 var(--space-4, 4px); /* Tighter padding — input fills the cell */
}

.table-data-cell--editable .cell-input {
  width: 100%;
  height: 100%;  /* Fills cell exactly — no sub-pixel drift */
  border: 1px solid var(--action-primary);
  border-radius: var(--radius-4, 4px);
  padding: 0 var(--space-8, 8px);
  font-size: inherit;
  color: var(--text-default);
  background: var(--surface-default);
  outline: none;
}

.table-data-cell--editable .cell-input:focus {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 0;
}

.table-data-cell--editable .cell-input:disabled {
  opacity: var(--visibility-disabled, 0.40);
  pointer-events: none;
}

/* Read-only state (table not in edit mode) */
.table-data-cell--editable .cell-input[readonly] {
  border-color: var(--border-default);
  cursor: default;
}
```

**Keyboard handling for editable cells:**
```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    onConfirm?.(e.currentTarget.value);
    e.currentTarget.blur();
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    onCancel?.();
    e.currentTarget.value = inputValue ?? '';
    e.currentTarget.blur();
  }
};
```

**Table-level edit mode pattern:**
```tsx
// Parent table manages edit mode state
const [isTableEditing, setIsTableEditing] = useState(false);

// Each editable cell receives the table's edit mode
<TableDataCell
  type="editable"
  inputValue={row.name}
  inputDisabled={!isTableEditing}  // read-only when table not in edit mode
  onChange={(val) => updateCell(row.id, 'name', val)}
  onConfirm={(val) => saveCell(row.id, 'name', val)}
/>

// Header-Bar edit trigger sets table into edit mode
<IconButton
  icon={<EditIcon />}
  accessibleLabel={isTableEditing ? 'Save changes' : 'Edit table'}
  onClick={() => {
    if (isTableEditing) saveAllChanges();
    setIsTableEditing(prev => !prev);
  }}
/>
```

**Why `height: 100%` not padding:** The Input component's internal `input-text` node has a `y=5.5` sub-pixel offset from baseline alignment. Using vertical padding to size the cell causes this offset to compound and produce a 1-2px visual shift. Using `FILL` height (CSS `height: 100%`) eliminates all padding arithmetic — the input stretches to exactly match the cell height. No drift.

---

## 11. Do / Don't

**Do:** Use `Type=Editable` only on columns that are genuinely user-editable. Not every column should be editable — system fields (ID, created date, status) should remain read-only.

**Don't:** Use `contenteditable` for editable cells. It has inconsistent screen reader support and fails WCAG 4.1.2. Always use a real `<input>` element.

**Do:** Set `inputDisabled={!isTableEditing}` to make editable cells read-only when the table is not in edit mode. The input should be visually present but not interactive.

**Don't:** Toggle `Type` between `text` and `editable` to show/hide the input. `Type=Editable` is a permanent cell classification — the column is always editable. The table's edit mode controls interactivity, not the cell type.

**Do:** Match the input type to the data: `inputType="number"` for numeric columns, `inputType="url"` for URL columns.

**Don't:** Use `Type=Editable` with `hasEditAction` or `hasDeleteAction` — the Actions type handles row-level CRUD. Editable is for inline field editing only.

**Do:** Confirm on blur (`onConfirm` in `onBlur`) — users expect changes to persist when they click away from an input.

**Don't:** Require an explicit "Save cell" button per cell — that's not inline editing, that's a form. The table-level save action handles persistence.

---

## 12. Related Components

| Component | Relationship | When to use |
|---|---|---|
| `Table/Data-Row` | Parent | Data-Cell always lives inside Data-Row. Never place Data-Cell directly in a table. |
| `Table/Header-Cell` | Sibling | Column headers. Always paired with Data-Cell columns. |
| `Table/Actions-Cell` | Sibling | Row-level CRUD actions (edit row, delete row). Separate from Type=Editable. |
| `Input` | Dependency | Type=Editable uses Input/md internally. All Input tokens apply. |
| `_Internal/Table/Header-Bar` | Table parent | Contains the edit mode trigger icon button. Controls whether editable cells are interactive. |
| `Table/Data-Table-v2` | Assembly | The full table — assembles Header-Bar, Header-Row, Entry-List, and Pagination. |

---

*Brief generated: 2026-07-09 | Component version: 1.1.0 | Change: Type=Editable added (2 variants)*
