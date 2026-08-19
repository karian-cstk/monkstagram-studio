---
brief_schema: venus-storybook-handover/v2
component_name: "Checkbox"
component_kebab_case: "checkbox"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=652-30460"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "652:30460"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Actions/Checkbox"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  COMPONENT_NAME:        Checkbox
  REACT_COMPONENT:       Checkbox
  STORYBOOK_TITLE:       Actions/Checkbox
  FIGMA_NODE_ID:         652:30460
  CSS_CLASS_PREFIX:      checkbox
  FILE_NAME:             Checkbox.tsx
  STORY_FILE_NAME:       Checkbox.stories.tsx
  CSS_FILE_NAME:         Checkbox.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
-->

# Checkbox — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | Must render as `<input type="checkbox">` — never `<div role="checkbox">` | Native checkbox provides free form participation, keyboard behaviour, and AT semantics |
| 2 | `aria-checked="mixed"` for Indeterminate state — not `true` or `false` | `mixed` is the only correct ARIA value for an indeterminate checkbox. `true`/`false` are semantically wrong. |
| 3 | Checkmark (Checked) and dash (Indeterminate) are structurally distinct elements — conditionally rendered, not toggled via opacity | Figma: Checked has `checkmark-icon` VECTOR (11×8px sm / 13×10px md); Indeterminate has `dash-icon` RECTANGLE (8×2px sm / 10×2px md). Different elements, not the same element hidden. |
| 4 | `disabled` uses native `disabled` attribute on `<input>` + 0.40 opacity on root | Same pattern as Radio. Native `disabled` is correct for `<input>` elements. |
| 5 | Checkboxes are independent — no `name` grouping requirement | Unlike radio buttons, checkboxes within a group are each independent. `name` may be provided for form submission but does not enforce mutual exclusivity. |
| 6 | Vertical alignment: checkbox control top-aligns to the first line of label text | Figma CSET description: "checkbox control top-aligns to label text (not centred to full block)". Use `align-items: flex-start` on root. |
| 7 | Subtext is Body/SM (13px) — same for both sm and md sizes | Confirmed from live Figma: subtext font size is consistent across sizes. |
| 8 | Opacity on root = `visibility/disabled` = **0.40** — not 0.5 | Confirmed `VariableID:564:3246` on root in all Disabled variants. |

---

## 0. Evidence and source contract

| Source | Reference | Date | Establishes |
|---|---|---|---|
| Figma live read | Node `652:30460`, 🔘 Actions | 2026-08-11 | All 24 variants, exact dimensions, children, token bindings |
| Figma CSET description | `652:30460` | 2026-08-11 | ARIA, keyboard, token layer, vertical alignment rule |
| `_Internal/Icon-Wrapper` brief | `214:152884` | 2026-08-11 | Leading icon dep HANDOFF_COMPLETE ✅ |

---

## 1. Outcome and scope

**Definition:** A binary selection control allowing independent on/off toggling of one option, with support for an indeterminate state for partial group selection.

**User need:** Contentstack editors need to select multiple independent options (e.g. field visibility, permission flags) where each choice is independent of the others.

### Scope

| In scope | Out of scope |
|---|---|
| sm (16px control) and md (20px control) | xl, lg sizes |
| Selection: Unchecked / Checked / Indeterminate | Four-state checkboxes |
| State: Default / Hover / Focused / Disabled | ReadOnly state |
| `hasLeadingIcon`, `hasLabel`, `hasSubtext` booleans | External Hint Text sibling |

### Responsibility boundary

| Checkbox owns | CheckboxGroup (parent) owns |
|---|---|
| `role="checkbox"`, `aria-checked` (true/false/mixed) | `role="group"` container with `aria-labelledby` |
| Visual indicator (checkmark, dash) | Group-level disabled or required state |
| Focus ring, `disabled` attribute | Managing indeterminate state across child checkboxes |

---

## 2. Existing baseline

`N/A — new component.`

---

## 3. Composition and reuse

| Concern | Decision |
|---|---|
| Architecture | `<input type="checkbox">` inside `<label>`. Custom visual overlaid via CSS. |
| Upstream dependency | `IconWrapper` (`214:152884`) — HANDOFF_COMPLETE ✅ (for `hasLeadingIcon`) |
| Prohibited | `<div role="checkbox">` — native input required for forms |

### Dependency tree

| Direction | Component | Must exist before build |
|---|---|---|
| Upstream | `IconWrapper` | Yes — ✅ HANDOFF_COMPLETE |
| Downstream | CheckboxGroup pattern | N/A |

---

## 4. Anatomy

| element_key | Layer name | Visibility | Condition | RTL | Semantic |
|---|---|---|---|---|---|
| `root` | `checkbox` | REQUIRED | Always | no | `<label>`, `data-testid="checkbox"`, `align-items: flex-start` |
| `input` | (hidden) | REQUIRED | Always | no | `<input type="checkbox">`, visually hidden |
| `box-container` | `box-container` | REQUIRED | Always | no | sm: 16×16 / md: 20×20 |
| `focus-ring` | `focus-ring` | INTERNAL | `:focus-visible` / `hasFocus=true` | no | `aria-hidden`, inset −2px, circular |
| `checkbox-control` | `checkbox-control` | REQUIRED | Always | no | Custom square indicator |
| `checkmark-icon` | `checkmark-icon` | OPTIONAL | `checked=true` only | no | VECTOR, sm: 11×8px / md: 13×10px, `aria-hidden` |
| `dash-icon` | `dash-icon` | OPTIONAL | `indeterminate=true` only | no | RECTANGLE, sm: 8×2px / md: 10×2px, `aria-hidden` |
| `leading-icon` | `leading-icon` | OPTIONAL | `hasLeadingIcon=true` | no | `IconWrapper`, 16px (sm) / 20px (md) |
| `label` | `label` | OPTIONAL | `hasLabel=true` | no | Label text |
| `subtext` | `subtext` | OPTIONAL | `hasSubtext=true` | no | Body/SM (13px), both sizes |

---

## 5. Public React API

### TypeScript interface

```typescript
/**
 * Binary selection control with indeterminate state support.
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=652-30460
 */
export interface CheckboxProps {
  /** Visible label text. */
  label: string;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial state for uncontrolled mode. @default false */
  defaultChecked?: boolean;
  /** Indeterminate state. Overrides checked visually; sets aria-checked="mixed". @default false */
  indeterminate?: boolean;
  /** Called with new checked state when toggled. Not called when disabled. */
  onChange?: (checked: boolean) => void;
  /** Size variant. @default 'sm' */
  size?: 'sm' | 'md';
  /** Disables the checkbox. Native disabled + 0.40 opacity. @default false */
  disabled?: boolean;
  /** Show label. @default true */
  hasLabel?: boolean;
  /** Show subtext below label. @default false */
  hasSubtext?: boolean;
  /** Supporting description. Required when hasSubtext=true. */
  subtext?: string;
  /** Show leading icon before label. @default false */
  hasLeadingIcon?: boolean;
  /** Icon element. Required when hasLeadingIcon=true. */
  leadingIcon?: React.ReactNode;
  /** Storybook demo only — shows focus ring. @default false */
  hasFocus?: boolean;
  /** Form field name. */
  name?: string;
  /** Form field value. */
  value?: string;
  id?: string;
  className?: string;
}
```

### JSX base component

```tsx
export const Checkbox = React.forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ label, checked, defaultChecked = false, indeterminate = false, onChange,
     size = 'sm', disabled = false, hasLabel = true, hasSubtext = false, subtext,
     hasLeadingIcon = false, leadingIcon, hasFocus = false, name, value, id, className, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const iconSize = size === 'sm' ? 16 : 20;

    // Set indeterminate on the native input (cannot be done via HTML attribute)
    React.useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <label ref={ref} htmlFor={inputId} data-testid="checkbox"
        className={[styles.checkbox, styles[`checkbox--${size}`],
          disabled ? styles['checkbox--disabled'] : '',
          hasFocus ? styles['checkbox--focused'] : '', className].filter(Boolean).join(' ')}
        style={disabled ? { opacity: 'var(--venus-visibility-disabled)' } : undefined}>
        <input ref={inputRef} type="checkbox" id={inputId} name={name} value={value}
          checked={checked} defaultChecked={defaultChecked} disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : undefined}
          onChange={(e) => !indeterminate && onChange?.(e.target.checked)}
          className={styles['checkbox__input']} {...rest} />
        <span className={styles['checkbox__box-container']} data-testid="checkbox-box-container">
          <span className={styles['checkbox__focus-ring']} aria-hidden="true" />
          <span className={styles['checkbox__control']} data-testid="checkbox-control">
            {(checked || indeterminate) && (
              indeterminate
                ? <span className={styles['checkbox__dash-icon']} aria-hidden="true" />
                : <svg className={styles['checkbox__checkmark']} aria-hidden="true"
                    viewBox="0 0 11 8" fill="none">
                    <path d="M1 4L4 7L10 1" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
            )}
          </span>
        </span>
        <span className={styles['checkbox__content']}>
          {hasLabel && (
            <span className={styles['checkbox__label-row']}>
              {hasLeadingIcon && leadingIcon && <IconWrapper size={iconSize} icon={leadingIcon} />}
              <span className={styles['checkbox__label']}>{label}</span>
            </span>
          )}
          {hasSubtext && subtext && <span className={styles['checkbox__subtext']}>{subtext}</span>}
        </span>
      </label>
    );
  }
);
```

**Key CSS:**
```css
.checkbox { display: inline-flex; align-items: flex-start; gap: var(--venus-space-8, 8px); padding: var(--venus-space-8, 8px); cursor: pointer; }
.checkbox--sm .checkbox__box-container { width: 16px; height: 16px; }
.checkbox--md .checkbox__box-container { width: 20px; height: 20px; }
.checkbox__input { position: absolute; opacity: 0; width: 0; height: 0; }
.checkbox__box-container { position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.checkbox__focus-ring { display: none; position: absolute; inset: -2px; border: 2px solid var(--venus-border-focus); border-radius: 4px; pointer-events: none; }
.checkbox--focused .checkbox__focus-ring,
.checkbox:has(.checkbox__input:focus-visible) .checkbox__focus-ring { display: block; }
.checkbox__control { position: absolute; inset: 0; border-radius: 4px; display: flex; align-items: center; justify-content: center;
  background: var(--venus-surface-raised); border: 1.5px solid var(--venus-border-default); }
.checkbox:has(.checkbox__input:checked) .checkbox__control,
.checkbox:has(.checkbox__input:indeterminate) .checkbox__control { background: var(--venus-action-primary); border-color: transparent; }
.checkbox:hover:not(.checkbox--disabled) .checkbox__control { border-color: var(--venus-border-brand); }
.checkbox__checkmark { width: 100%; height: 100%; color: var(--venus-text-on-brand); }
.checkbox--sm .checkbox__dash-icon { width: 8px; height: 2px; background: var(--venus-text-on-brand); border-radius: 1px; }
.checkbox--md .checkbox__dash-icon { width: 10px; height: 2px; background: var(--venus-text-on-brand); border-radius: 1px; }
.checkbox__label { font-size: 14px; color: var(--venus-text-default); font-weight: 400; }
.checkbox--md .checkbox__label { font-size: 16px; }
.checkbox__subtext { font-size: 13px; color: var(--venus-text-subtle); font-weight: 400; }
.checkbox--disabled { pointer-events: none; cursor: not-allowed; }
```

---

## 6. Figma → React mapping

| Figma property | React prop | Mapping |
|---|---|---|
| `Selection=Checked` | `checked=true` | direct |
| `Selection=Indeterminate` | `indeterminate=true` | direct; sets `input.indeterminate` via ref |
| `Selection=Unchecked` | `checked=false` | default |
| `Size` | `size` | direct |
| `State=Disabled` | `disabled=true` | native `disabled` + 0.40 opacity |
| `State=Hover` | `:hover` | CSS pseudo — never a prop |
| `State=Focused` | `:focus-visible` / `hasFocus` (Storybook only) | CSS pseudo |
| `label#652:2510` | `label` | direct |
| `hasLabel#652:2410` | `hasLabel` | direct |
| `hasSubtext#652:2435` | `hasSubtext` | direct |
| `hasLeadingIcon#1529:262` | `hasLeadingIcon` | direct |
| `hasFocus#664:2673` | `hasFocus` | Storybook demo only |

---

## 7. Variants, states, and precedence

### Size contract

| Size | Control | Height (content-driven) | Label font | Default? |
|---|---|---|---|---|
| `sm` | 16×16px | ~37px | 14px (Body/MD) | **Yes** |
| `md` | 20×20px | ~40px | 16px (Body/LG) | No |

### Variant cross-matrix (all 24 valid)

| | Default | Hover | Focused | Disabled |
|---|---|---|---|---|
| Unchecked sm | ✓ `652:30204` | ✓ | ✓ | ✓ |
| Checked sm | ✓ | ✓ | ✓ | ✓ |
| Indeterminate sm | ✓ `652:30288` | ✓ | ✓ | ✓ |
| Unchecked md | ✓ | ✓ | ✓ | ✓ |
| Checked md | ✓ | ✓ | ✓ `652:30394` | ✓ |
| Indeterminate md | ✓ | ✓ | ✓ | ✓ `664:33190` |

### State table

| State | Trigger | CSS | `aria-checked` | Required story |
|---|---|---|---|---|
| Unchecked/Default | `checked=false` | — | `false` | `Unchecked` |
| Checked/Default | `checked=true` | `:has(input:checked)` | `true` | `Checked` |
| Indeterminate | `indeterminate=true` | `:has(input:indeterminate)` | `"mixed"` | `Indeterminate` |
| Hover | Pointer enter | `:hover` | — | `Hovered` |
| Focused | `:focus-visible` | CSS ring | — | `Focused` |
| Disabled | `disabled=true` | native + opacity | — | `Disabled` |

---

## 8. Functional behavior

| Rule | Given | When | Then |
|---|---|---|---|
| BR-01 | `disabled=true` | User clicks | `onChange` not fired |
| BR-02 | `indeterminate=true` | Component renders | `input.indeterminate = true` set via ref; `aria-checked="mixed"` |
| BR-03 | `indeterminate=true` | User clicks | Component transitions to `checked=true`; `indeterminate` cleared |

---

## 9. Interactions and focus

**Focus ring:** 2px `border/focus`, inset −2px, `border-radius: 4px` (matches control radius). Triggers on `:focus-visible`.

**Keyboard:** Space toggles. Tab moves focus. No arrow-key group navigation (checkboxes are independent).

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `aria-checked="mixed"` for indeterminate | Use `aria-checked="false"` for indeterminate |
| Set `input.indeterminate = true` via ref | Try to set indeterminate via HTML attribute |
| Use `align-items: flex-start` | Use `align-items: center` — misaligns tall label blocks |
| Conditionally render checkmark OR dash | Show both, toggling opacity |

---

## 13. Tokens

| element_key | Property | Token | CSS var | VariableID |
|---|---|---|---|---|
| `checkbox-control` | `background` (unchecked) | `surface/raised` | `--venus-surface-raised` | `563:3180` |
| `checkbox-control` | `border` (unchecked default) | `border/default` | `--venus-border-default` | `564:3209` |
| `checkbox-control` | `background` (checked/indeterminate) | `action/primary` | `--venus-action-primary` | `564:3217` |
| `checkmark-icon` / `dash-icon` | `color` / `background` | `text/on-brand` | `--venus-text-on-brand` | `564:3198` |
| `label` | `color` | `text/default` | `--venus-text-default` | `564:3192` |
| `subtext` | `color` | `text/subtle` | `--venus-text-subtle` | `564:3193` |
| `focus-ring` | `border-color` | `border/focus` | `--venus-border-focus` | `564:3227` |
| `root` (disabled) | `opacity` | `visibility/disabled` | `--venus-visibility-disabled` | `564:3246` |
| `root` padding/gap | all | `space/8` | `--venus-space-8` | `546:3061` |

### Typography

| element | Size | Font | Weight |
|---|---|---|---|
| `label` (sm) | 14px (Body/MD) | Inter | 400 |
| `label` (md) | 16px (Body/LG) | Inter | 400 |
| `subtext` | 13px (Body/SM) — both sizes | Inter | 400 |

---

## 14. Accessibility

| Concern | Requirement |
|---|---|
| Root element | `<label htmlFor>` wrapping `<input type="checkbox">` |
| `aria-checked` | `"true"` / `"false"` / `"mixed"` — `mixed` for indeterminate |
| `disabled` | Native `disabled` on input + 0.40 opacity on root |
| Focus ring | 2px, inset −2px, `border-radius: 4px` |
| Group | No mandatory group. When used in a CheckboxGroup, parent provides `role="group"` with `aria-labelledby`. |
| Keyboard | Space toggles; Tab moves focus. Independent of other checkboxes. |

---

## 15. Storybook contract

All stories: CSF3, light + dark, `layout: 'centered'`.

| Export | Args | Key assertion |
|---|---|---|
| `Unchecked` | `{ checked: false }` | `aria-checked="false"`, empty control |
| `Checked` | `{ checked: true }` | `aria-checked="true"`, checkmark present |
| `Indeterminate` | `{ indeterminate: true }` | `aria-checked="mixed"`, dash present |
| `Disabled` | `{ disabled: true }` | native `disabled`, opacity 0.40 |
| `WithSubtext` | `{ hasSubtext: true, subtext: '...' }` | Subtext at 13px below label |
| `WithLeadingIcon` | `{ hasLeadingIcon: true, leadingIcon: <Icon/> }` | Icon before label |
| `SizeMd` | `{ size: 'md' }` | 20px control, 16px label |
| `Focused` | `{ hasFocus: true }` | Focus ring visible, `border-radius: 4px` |
| `Group` | 3 checkboxes, one indeterminate | Parent-managed indeterminate state |

---

## 16. Test contract

| Assertion | Test |
|---|---|
| `checked` | `aria-checked` mirrors `checked` prop |
| `indeterminate` | `input.indeterminate === true`; `aria-checked="mixed"` |
| `disabled` | `input.disabled === true`; opacity 0.40; `onChange` not fired |
| `checkmark` | Present when `checked=true`, absent when not |
| `dash-icon` | Present when `indeterminate=true`, absent when not |

---

## 17. Decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | `<input type="checkbox">` not `<div role="checkbox">` | Native form participation, free keyboard behaviour, correct semantics |
| DEC-02 | Indeterminate set via `inputRef.current.indeterminate = true` | HTML spec: `indeterminate` is a DOM property, not an HTML attribute. Cannot be set via JSX. |
| DEC-03 | Conditionally render checkmark/dash elements | Figma shows structurally distinct elements per state — not the same element hidden. Matches design intent. |

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Sign-off

| Role | Name | Status |
|---|---|---|
| Design | George Karian | PENDING |
| Engineering | Narendra | PENDING |
