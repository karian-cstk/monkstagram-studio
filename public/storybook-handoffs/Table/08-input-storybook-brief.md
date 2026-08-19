# Input — Storybook Engineering Brief

```yaml
component_name: Input
figma_node_id: "702:58081"
figma_page: "📝 Inputs"
version: "1.0.0"
status: Active
mode: NEW
build_order: 8
depends_on: [IconWrapper]
used_by: [TableHeaderBar]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 1
```

## 1. Purpose

Standard text input field. Used in the table system specifically for the header bar's search field.

## 2. Anatomy

```
Input (variants: State × Size)
├─ Label Row
│  ├─ label-text (TEXT, visible when hasLabel)
│  ├─ qualifier-text (TEXT, e.g. "(optional)")
│  └─ Label Icon (INSTANCE, visible when hasLabelIcon)
├─ Trigger
│  ├─ Leading Icon (INSTANCE, visible when hasLeadingIcon)
│  ├─ input-text (TEXT — the value/placeholder)
│  ├─ Trailing Icon (INSTANCE, visible when hasTrailingIcon)
│  ├─ focus-ring (FRAME)
│  └─ focus-border (FRAME)
└─ Below Field
   ├─ Hint Text (visible when hasHintText)
   └─ Status Message (visible when hasStatusMessage)
```

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `State` | VARIANT | `Default` | derived from focus/value/disabled/validity — 9 states: Active, Default, Disabled, Error, Filled, Hover, Readonly, Success, Warning |
| `Size` | VARIANT | `md` | `size: 'md' \| 'lg' \| 'xl'` (no `sm` — matches system-wide 3-size rule) |
| `label` / `hasLabel` | TEXT / BOOL | `"Label"` / `true` | `label?: string` |
| `placeholder` | TEXT | `"Placeholder text"` | `placeholder?: string` |
| `value` | TEXT | `"Value text"` | `value: string` (controlled) |
| `isRequired` | BOOLEAN | `false` | `required?: boolean` |
| `hintText` / `hasHintText` | TEXT / BOOL | `"Helper text"` / `true` | `hint?: string` |
| `statusMessage` / `hasStatusMessage` | TEXT / BOOL | error text / `false` | `errorMessage?: string` (drives `State=Error` when present) |
| `hasLeadingIcon` / `hasTrailingIcon` | BOOLEAN | `false`/`false` | `leadingIcon?` / `trailingIcon?: ComponentType` |
| `hasFocus` | BOOLEAN | `false` | native `:focus-visible` |

## 4. Token Reference

`NEEDS_CLARIFICATION`: individual state-to-token bindings (Error red border, Success green border, Warning amber, focus ring color) were not extracted live this session for this specific component — Input was identified structurally but not deep-token-audited. Before implementation, verify each `State` variant's border/background token directly rather than assuming reuse of the generic `border/{intent}` family confirmed elsewhere — while likely correct, it wasn't directly confirmed for this component.

## 5. React Implementation Sketch

```tsx
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'md' | 'lg' | 'xl';
  label?: string;
  required?: boolean;
  hint?: string;
  errorMessage?: string;
  successMessage?: string;
  leadingIcon?: React.ComponentType;
  trailingIcon?: React.ComponentType;
}

export function Input({
  size = 'md', label, required, hint, errorMessage, successMessage, leadingIcon: Leading, trailingIcon: Trailing, id, ...inputProps
}: InputProps) {
  const inputId = id ?? useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  return (
    <div className={cx('input-root', `input--${size}`, errorMessage && 'input--error', successMessage && 'input--success')}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}{required && <span aria-hidden> *</span>}
        </label>
      )}
      <div className="input-trigger">
        {Leading && <Leading aria-hidden />}
        <input
          id={inputId}
          aria-describedby={cx(hint && hintId, errorMessage && errorId)}
          aria-invalid={!!errorMessage}
          aria-required={required}
          {...inputProps}
        />
        {Trailing && <Trailing aria-hidden />}
      </div>
      {hint && !errorMessage && <span id={hintId} className="input-hint">{hint}</span>}
      {errorMessage && <span id={errorId} role="alert" className="input-error">{errorMessage}</span>}
    </div>
  );
}
```

## 6. Accessibility

- `aria-describedby` must reference hint/error text so screen readers announce it when the field receives focus.
- `role="alert"` on the error message ensures it's announced immediately when it appears (e.g. after failed validation), not just when focus moves there.
- `aria-invalid` reflects error state to assistive tech.

## 7. Storybook Stories

| Story | Args |
|---|---|
| `AllSizes` | 3 sizes |
| `AllStates` | 9 states |
| `WithIcons` | leading + trailing |
| `ErrorState` | errorMessage set, a11y test asserts `role="alert"` announces |
| `Required` | required=true |

## 8. Do / Don't

| Do | Don't |
|---|---|
| Wire `aria-describedby` to hint/error text | Don't rely on visual proximity alone to associate hint text with the field |

## 9. Decision Log

| Question | Resolution |
|---|---|
| Exact state-to-token bindings for Error/Success/Warning/Active/Readonly | `NEEDS_CLARIFICATION` — structural extraction only this session, verify tokens live before implementation. |
