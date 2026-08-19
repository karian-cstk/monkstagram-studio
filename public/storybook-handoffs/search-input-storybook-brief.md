# Search Input — Storybook Brief
**Component:** Search Input  
**Node:** `1050:2231`  
**Page:** 📊 Data List  
**Status:** Active v2.1.0  
**Date:** 2026-07-06

---

## 1. Purpose

Search Input is a composite atom combining an Input field with an optional Search button. It is the primary search control in data table toolbars, header bars, sidebar filters, and page-level search surfaces. It does not manage its own state — it delegates all interactive behaviour to its nested Input and Button atoms.

Two variants exist to serve two distinct contexts: `compact` for constrained surfaces (Header-Bar, dropdowns, sidebar), and `default` for primary page-level search where a visible "Search" CTA is appropriate.

---

## 2. Anatomy

```
[search-wrapper]               — auto-layout row, 32px height, HUG×HUG
  [search-input]               — Input/md instance (FILL width)
  [search-button]?             — Button/Secondary/md instance (HUG), Size=default only
```

**Compact:** Input only, trailing search icon baked into Input's trailingIcon slot.  
**Default:** Input (FILL) + Secondary Button md (HUG), 4px gap. "Search" label + leading search icon on Button.  
**Optional extensions:**  
- `hasScope`: prepends a Select/md (scope-select) to the left of the Input — for scoped search (e.g. "Search in: Entries / Assets")  
- `hasAdvancedSearch`: appends a Hyperlink/md (advanced-search-link) to the right — links to advanced search modal

---

## 3. TypeScript Props Interface

```typescript
interface SearchInputProps {
  /** Size variant */
  size?: 'compact' | 'default';
  /** Placeholder text for the input */
  placeholder?: string;
  /** Current search value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Search submit handler */
  onSearch?: (value: string) => void;
  /** Disabled state — propagates to Input and Button */
  isDisabled?: boolean;
  /** Show scope selector (Select/md) before input */
  hasScope?: boolean;
  /** Scope options when hasScope is true */
  scopeOptions?: { label: string; value: string }[];
  /** Selected scope value */
  scopeValue?: string;
  /** Scope change handler */
  onScopeChange?: (value: string) => void;
  /** Show advanced search link after input */
  hasAdvancedSearch?: boolean;
  /** Advanced search click handler */
  onAdvancedSearch?: () => void;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | React Prop | Notes |
|---|---|---|
| `Size` (VARIANT) | `size` | compact / default |
| `hasScope` (BOOLEAN) | `hasScope` | Default: false |
| `hasAdvancedSearch` (BOOLEAN) | `hasAdvancedSearch` | Default: false |
| — | `placeholder` | Override on nested Input instance |
| — | `value` | Controlled input value |
| — | `onChange` | Input change handler |
| — | `onSearch` | Button click / Enter key handler |
| — | `isDisabled` | Propagate to Input + Button |

---

## 5. State Behaviour

Search Input has no variant-level states. All interactive states are inherited from its atom children:

- **Input:** manages Default / Hover / Active / Filled / Disabled states internally
- **Button (default size only):** manages Default / Hover / Active / Disabled states internally
- **Search submission:** Enter key in Input field triggers `onSearch`. Button click triggers `onSearch`.
- **Disabled:** Set `isDisabled=true` — propagate to both Input (`State=Disabled`) and Button (`State=Disabled`).

---

## 6. Size Specification

| Variant | Height | Width | Input width | Button |
|---|---|---|---|---|
| compact | 32px | 240px (override per context) | FILL | None — icon only in Input trailing slot |
| default | 32px | 567px default (override) | FILL | Secondary/md HUG — "Search" + leading icon |

Both variants are 32px height. There is no lg or xl Search Input — md is the only density.

**Context defaults:**
- Header-Bar toolbar: compact, 240px
- Table/Filter-Bar: compact, 240–320px  
- Page-level search: default, 400–600px

---

## 7. Token Reference

No wrapper-level token bindings. All tokens inherited from atoms:

**Input (702:58081):**

| Layer | Token |
|---|---|
| Input surface | `surface/default` |
| Input border | `border/default` → `border/focus` (active) |
| Input text | `text/default` |
| Input placeholder | `text/placeholder` |
| Input focus ring | `focus/ring/color` |

**Button (633:12411) — default variant only:**

| Layer | Token |
|---|---|
| Button surface | `action/secondary/surface` |
| Button border | `action/primary` |
| Button text | `text/brand` |
| Button focus ring | `focus/ring/color` |

---

## 8. Accessibility

- Input: `type="search"`, `role="searchbox"`, `aria-label="Search"` (or contextual label)
- Button: `aria-label="Search"` — do not use icon-only without accessible label
- Keyboard: Enter in input field submits search (fires `onSearch`)
- Escape in input field: clear input value
- `hasScope` Select: `aria-label="Search scope"` — announces which scope is selected before search
- `hasAdvancedSearch` link: `aria-label="Advanced search"` — ensure it's a visible Hyperlink, not an icon-only trigger
- Touch targets: 32px height meets WCAG 2.5.5 minimum (24px) ✅
- Placeholder contrast: `text/placeholder` (gray/400) = 2.54:1 — below 4.5:1. This is a known Input atom issue, accepted as hint text exception per WCAG 1.4.3 placeholder exemption.

---

## 9. Storybook Stories

```typescript
// Compact
export const Compact: Story = {
  args: { size: 'compact', placeholder: 'Search...' }
};

// Default (with button)
export const Default: Story = {
  args: { size: 'default', placeholder: 'Search entries...', onSearch: (v) => console.log(v) }
};

// With scope
export const WithScope: Story = {
  args: {
    size: 'default',
    hasScope: true,
    scopeOptions: [
      { label: 'Entries', value: 'entries' },
      { label: 'Assets', value: 'assets' },
    ],
    scopeValue: 'entries',
    placeholder: 'Search...'
  }
};

// With advanced search
export const WithAdvancedSearch: Story = {
  args: {
    size: 'default',
    hasAdvancedSearch: true,
    onAdvancedSearch: () => {},
    placeholder: 'Search...'
  }
};

// Disabled
export const Disabled: Story = {
  args: { size: 'default', isDisabled: true, placeholder: 'Search...' }
};

// Compact in toolbar context
export const InToolbar: Story = {
  render: () => (
    <div style={{ background: 'var(--surface-default)', padding: 12, display: 'flex', gap: 8 }}>
      <SearchInput size="compact" placeholder="Search..." />
    </div>
  )
};
```

---

## 10. Implementation Notes

**No wrapper-level component properties in Figma:** Placeholder text and disabled state must be overridden directly on the nested Input and Button instances in Figma. In React, pass as props and propagate to children.

**Scope selector width:** When `hasScope=true`, the Select/md prepended to the left should be a fixed width (120–160px depending on option length). Do not let it FILL — it should be HUG or fixed.

**Advanced search link:** `hasAdvancedSearch` appends a `Hyperlink/md` with `hasLeadingIcon=true` (search-advanced icon). This is a Hyperlink component, not a Button — it navigates or opens a modal, it does not submit the form.

**Enter key handling:** The Input `onKeyDown` handler should intercept Enter and call `onSearch(value)`. The Button click handler should do the same. Both should produce identical outcomes.

**Icon in compact trailing slot:** The search icon in compact variant is baked into the Input's `trailingIcon` slot. In React, pass the search icon as `trailingIcon` to the Input component.

---

## 11. Do / Don't

**Do:**
- Use compact in toolbars, header bars, and sidebar filters (≤240px contexts)
- Use default when search is the primary action on a page
- Always provide a visible "Search" button for default variant — don't hide it
- Support Enter key submission in all variants

**Don't:**
- Don't use lg/xl Input inside Search Input — always md (32px)
- Don't add additional size variants — compact and default cover all use cases
- Don't use Search Input for filtering inside a dropdown — use a plain Input with search icon
- Don't omit `aria-label` on the Input — "Search" alone is insufficient in multi-search contexts

---

## 12. Related Components

| Component | Relationship |
|---|---|
| Input | Core atom — Search Input wraps Input/md |
| Button | Core atom — default variant appends Button/Secondary/md |
| Table/Filter-Bar | Common parent — contains Search Input compact |
| `_Internal/Table/Header-Bar` | Common parent — compact variant in toolbar |
| Select | Used in `hasScope` configuration |
| Hyperlink | Used in `hasAdvancedSearch` configuration |
