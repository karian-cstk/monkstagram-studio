# Radio — Storybook Engineering Brief

```yaml
component_name: Radio
figma_node_id: "660:33013"
figma_page: "🔘 Actions"
version: "1.0.0"
status: Active
mode: NEW
build_order: 3
depends_on: [IconWrapper]
used_by: [TableDataRow]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

Single-select control. Structurally a mirror of Checkbox (§2 Checkbox brief) with two key differences: `Selection` options are `Selected`/`Unselected` (no indeterminate — a radio has no third state), and the visible control is a circle, not a rounded square.

## 2. Anatomy

Identical tree shape to Checkbox: `box-container` (circular `checkbox-control` equivalent, called the same internally) + `content` (label-row, subtext). See Checkbox brief §2 for the full tree — only the glyph/shape differs.

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `Selection` | VARIANT | `Unselected` | `checked: boolean` (radios have no indeterminate) |
| `State` | VARIANT | `Default` | derived, not a prop |
| `Size` | VARIANT | `sm` | `size: 'sm' \| 'md'` |
| `label` | TEXT | `"Radio label"` | `label` |
| `hasLabel` | BOOLEAN | `false` (confirmed different default from Checkbox — verify against live Figma before assuming true) | `hideLabel?: boolean` |
| `hasSubtext` | BOOLEAN | `false` | `subtext?: string` |
| `isDisabled` | BOOLEAN | `false` | `disabled: boolean` |
| `hasFocus` | BOOLEAN | `false` | native `:focus-visible`, not a prop |

## 4. Token Reference

Identical token set to Checkbox (§4 of that brief): `border/default` unselected, `action/primary` selected fill, `border/focus` ring, `visibility/disabled` cascading opacity.

## 5. React Implementation Sketch

```tsx
export interface RadioProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  name: string; // native radio grouping requires a shared name
  value: string;
  size?: 'sm' | 'md';
  label?: string;
  hideLabel?: boolean;
  subtext?: string;
  disabled?: boolean;
}

export function Radio({ checked, onCheckedChange, name, value, size = 'sm', label, hideLabel, subtext, disabled }: RadioProps) {
  const px = size === 'sm' ? 16 : 20;
  return (
    <label className={cx('radio-root', disabled && 'is-disabled')}>
      <span className="radio-circle" style={{ width: px, height: px }} data-state={checked ? 'selected' : 'unselected'}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onCheckedChange(true)}
          disabled={disabled}
          className="radio-native-input"
        />
      </span>
      {!hideLabel && label && (
        <span className="radio-content">
          <span className="radio-label">{label}</span>
          {subtext && <span className="radio-subtext">{subtext}</span>}
        </span>
      )}
    </label>
  );
}
```

## 6. Accessibility

- Native `<input type="radio">` grouped by shared `name` — required for arrow-key navigation between options and correct screen reader group announcement ("1 of 3", etc.). Do not reimplement grouping in JS.
- Space selects the focused radio; Arrow keys move between radios in the same `name` group — both free from the native element.

## 7. Storybook Stories

| Story | Args |
|---|---|
| `Default` | Unselected, sm |
| `Selected` | checked=true |
| `Group` | 3 radios sharing one `name`, demonstrating arrow-key navigation |
| `WithSubtext` | subtext set |
| `Disabled` | disabled=true, both states |

## 8. Do / Don't

| Do | Don't |
|---|---|
| Always share `name` across radios in the same logical group | Don't render radios without a `name` — breaks keyboard grouping entirely |

## 9. Decision Log

| Question | Resolution |
|---|---|
| Radio's `hasLabel` default value | Recorded as `false` from live property read this session, differing from Checkbox's `true` default — flagging as a genuine cross-atom discrepancy rather than assuming it's a typo. Confirm with design before treating as intentional. |
