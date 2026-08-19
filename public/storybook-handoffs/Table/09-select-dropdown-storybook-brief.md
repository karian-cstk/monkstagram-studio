# Select — Storybook Engineering Brief

```yaml
component_name: Select
figma_node_id: "682:46343"
figma_page: "📝 Inputs"
version: "1.0.0"
status: Active
mode: NEW
build_order: 9
depends_on: [IconWrapper]
used_by: [TableHeaderBar, TablePagination]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 1
```

## 1. Purpose

Dropdown selection field. Used for the header bar's search-scope selector and the pagination row's per-page count selector.

## 2. Anatomy

Same overall shape as Input (§2 of that brief: Label Row / Trigger / Below Field), with the Trigger's trailing icon fixed to a chevron (`selectChevron`, rotates via `isOpen`) rather than an arbitrary configurable icon, and a leading-icon swap (`selectLeadingIcon`) with 14 preferred icon options configured in Figma.

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `isOpen` | BOOLEAN | `false` | derived from open/closed popover state, not a direct prop — drives `State=Open` and chevron rotation |
| `hasLeadingIcon` | BOOLEAN | `false` | `leadingIcon?: ComponentType` |
| `hasLabel` / `label` | BOOL/TEXT | `true` / `"Label"` | `label?: string` |
| `isRequired` | BOOLEAN | `false` | `required?: boolean` |
| `placeholder` | TEXT | `"Select an option"` | `placeholder?: string` |
| `hasHintText` / `hintText` | BOOL/TEXT | `true` / `"Helper text"` | `hint?: string` |
| `hasStatusMessage` / `statusMessage` | BOOL/TEXT | `false` / — | `errorMessage?: string` |
| `State` | VARIANT | `Default` | 9 states: Default, Filled, Open, Error, Warning, Success, Disabled, Readonly, Active — derived |
| `Size` | VARIANT | `md` | `size: 'md' \| 'lg' \| 'xl'` |
| `hasFocus` | BOOLEAN | `false` | native `:focus-visible` on the trigger button |

## 4. React Implementation Sketch

This is a listbox pattern — do not implement with a native `<select>` if custom option rendering (icons, multi-line options) is required; use a proper ARIA combobox/listbox with a floating-UI positioning library.

```tsx
export interface SelectOption { value: string; label: string; icon?: React.ComponentType; }

export interface SelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  size?: 'md' | 'lg' | 'xl';
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

export function Select({ options, value, onChange, size = 'md', label, placeholder, hint, errorMessage, required, disabled }: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const listboxId = useId();
  const triggerId = useId();
  return (
    <div className={cx('select-root', `select--${size}`)}>
      {label && <label id={`${triggerId}-label`} className="select-label">{label}{required && ' *'}</label>}
      <button
        type="button"
        id={triggerId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={`${triggerId}-label ${triggerId}`}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="select-trigger"
      >
        <span>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cx('select-chevron', open && 'select-chevron--open')} aria-hidden />
      </button>
      {open && (
        <ul id={listboxId} role="listbox" aria-labelledby={`${triggerId}-label`} className="select-listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.icon && <opt.icon aria-hidden />}
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      {hint && !errorMessage && <span className="select-hint">{hint}</span>}
      {errorMessage && <span role="alert" className="select-error">{errorMessage}</span>}
    </div>
  );
}
```

## 5. Accessibility

- Full ARIA combobox pattern required: `role="combobox"` on trigger, `role="listbox"`/`role="option"` on the popover, `aria-expanded`, `aria-activedescendant` for keyboard-navigated highlight (not shown above for brevity — required for a complete implementation).
- Keyboard: Arrow keys move highlighted option, Enter selects, Escape closes without changing value, Home/End jump to first/last option.
- Close on outside click and on Escape.

## 6. Storybook Stories

| Story | Args |
|---|---|
| `AllSizes` | 3 sizes |
| `WithIcons` | options with leading icons |
| `KeyboardNav` | interaction test: arrow keys + Enter |
| `ErrorState` | errorMessage set |
| `Disabled` | disabled=true |

## 7. Do / Don't

| Do | Don't |
|---|---|
| Implement full keyboard listbox navigation | Don't ship a dropdown that only responds to mouse clicks |

## 8. Decision Log

| Question | Resolution |
|---|---|
| Exact positioning/collision-avoidance behavior of the open popover | `NEEDS_CLARIFICATION` — Figma shows only static open/closed states, not scroll/collision behavior. Recommend a floating-UI-based implementation (flip/shift middleware) as the safe default; confirm with design if a simpler fixed-position dropdown is acceptable instead. |
