# Storybook Brief — Hyperlink
**System:** Venus 2.1 RF
**Version:** 2.1.1
**Figma node:** `644:27354` — 🔘 Actions page
**Status:** Pass — all audit blockers resolved 2026-05-28
**Author:** Design Systems (Venus 2.1 RF)

---

## 1. What This Component Is

`Hyperlink` is the system's standard inline text link for use inside CMS product interfaces. It is an `<a>` element — not a button — and must only be used for navigation: moving the user to a new URL, a new page section, or a new application state via route change.

It is **not** a button styled as a link. If the action does not navigate, use `Button` variant `ghost` or `tertiary` instead.

**Three sizes** match surrounding text scale so links sit flush in body copy, labels, or hero text without size mismatch. **Five states** cover the full interactive lifecycle including the browser-managed Visited state.

---

## 2. Props Interface

```typescript
export interface HyperlinkProps {
  /**
   * The visible link text.
   * Maps to Figma TEXT property: label
   */
  children: string;

  /**
   * The URL the link navigates to.
   * Required — a Hyperlink without an href is not a link.
   */
  href: string;

  /**
   * Size — matches surrounding text scale.
   * md = 14px Body/MD  (dense tables, sidebars, metadata)
   * lg = 16px Body/LG  (main body copy — system default)
   * xl = 18px Body/XL  (hero sections, onboarding, editorial)
   * @default 'lg'
   */
  size?: 'md' | 'lg' | 'xl';

  /**
   * Opens the link in a new tab.
   * Automatically adds rel="noopener noreferrer".
   * Automatically appends a sr-only "(opens in new tab)" span.
   * @default false
   */
  external?: boolean;

  /**
   * Optional leading icon (left of label).
   * Accepts a React node — use an icon from the Venus icon library.
   * Common use: ← Back, ↑ Return to top, directional navigation.
   * Maps to Figma BOOLEAN: hasLeadingIcon + INSTANCE_SWAP: selectLeadingIcon
   */
  leadingIcon?: React.ReactNode;

  /**
   * Optional trailing icon (right of label).
   * Common use: → Continue, ↗ External link (use ArrowSquareOut when available).
   * Maps to Figma BOOLEAN: hasTrailingIcon + INSTANCE_SWAP: selectTrailingIcon
   * Note: if external=true, consider always showing a trailing icon.
   */
  trailingIcon?: React.ReactNode;

  /**
   * Prevents navigation and removes the element from tab order.
   * <a> does not support the HTML disabled attribute — this is implemented
   * via aria-disabled + tabIndex=-1 + pointer-events:none.
   * Use sparingly: prefer hiding the link or showing a tooltip.
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional class names for the root <a> element.
   */
  className?: string;

  /**
   * Click handler. Fired before navigation.
   * Use for analytics, route interception, or SPA navigation.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
```

---

## 3. Sizes

| Size | Font | Line height | Vertical padding | Icon size | Use context |
|---|---|---|---|---|---|
| `md` | 14px Regular | 150% | 4px | 16px | Table cells, sidebar labels, metadata, dense UI |
| `lg` | 16px Regular | 150% | 6px | 20px | **System default.** Main body copy, dialog text |
| `xl` | 18px Regular | 160% | 8px | 24px | Hero sections, onboarding flows, editorial copy |

No horizontal padding. No fixed height — wraps content. Do not use in form rows alongside fixed-height inputs; use `Button` variant `ghost` instead.

---

## 4. States

All states are CSS-internal except `disabled`. Do not pass state as a prop.

| State | Trigger | Visual change | Token | Engineering |
|---|---|---|---|---|
| Default | At rest | No underline, brand purple | `text/link` | (base styles) |
| Hover | `:hover` | Underline appears, color darkens | `text/link/hover` | CSS `:hover` |
| Active | `:active` | Underline, color deepens further | `text/link/active` | CSS `:active` |
| Visited | Browser `:visited` | Color shifts to deep violet | `text/link/visited` | CSS `:visited` — color only |
| Disabled | `disabled={true}` prop | 40% opacity, no pointer events | `visibility/disabled` + `text/disabled` | `aria-disabled` + `tabIndex=-1` |

**Underline behaviour:** present on Hover and Active only — this is the WCAG 1.4.1 non-colour distinction. `text-decoration-skip-ink: none` — continuous underline, no descender gaps.

**Visited:** the `:visited` pseudo-class is security-restricted by browsers. Only `color` can be changed via CSS — no layout, content, icon, or other property changes are possible. The Visited token (`text/link/visited`) resolves to `#551A8B` (Light) / `purple/300` (Dark) — the WHATWG standard visited colour. Do not override this to match brand purple.

---

## 5. Anatomy & DOM Mapping

```
<a>                           root — role inferred, href required
  [leadingIcon]               <span aria-hidden="true"> — optional
  {children}                  text node
  [trailingIcon]              <span aria-hidden="true"> — optional
  [sr-only external notice]   <span class="sr-only"> — when external=true
  [focus-ring]                CSS outline — not a DOM element, CSS :focus-visible
```

| Figma layer | DOM | Notes |
|---|---|---|
| `leading-icon` | `<span aria-hidden="true">{icon}</span>` | Hidden from AT — decorative |
| `label` | text node | The visible link text |
| `trailing-icon` | `<span aria-hidden="true">{icon}</span>` | Hidden from AT — decorative |
| `focus-ring` | CSS `outline` | Not a real DOM element — implemented via `:focus-visible` outline |

---

## 6. CSS Implementation

```css
/* Base */
.hyperlink {
  display: inline-flex;
  align-items: center;
  gap: 4px;                           /* space/4 — icon-to-label gap, all sizes */
  color: var(--text-link);
  text-decoration: none;
  border-radius: var(--radius-4);     /* md/lg: 4px */
  cursor: pointer;
  font-family: var(--font-family-primary);
  font-weight: 400;                   /* Regular — not Medium, links are not labels */
}

/* Sizes */
.hyperlink--md {
  font-size: var(--body-md-size);     /* 14px */
  line-height: var(--body-md-line-height); /* 150% */
  padding-block: 4px;
}
.hyperlink--lg {
  font-size: var(--body-lg-size);     /* 16px */
  line-height: var(--body-lg-line-height); /* 150% */
  padding-block: 6px;
}
.hyperlink--xl {
  font-size: var(--body-xl-size);     /* 18px */
  line-height: var(--body-xl-line-height); /* 160% */
  padding-block: 8px;
  border-radius: var(--radius-8);     /* xl: 8px */
}

/* Hover */
.hyperlink:hover {
  color: var(--text-link-hover);
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-underline-offset: 2px;
}

/* Active / Pressed */
.hyperlink:active {
  color: var(--text-link-active);
  text-decoration: underline;
  text-decoration-skip-ink: none;
}

/* Visited */
.hyperlink:visited {
  color: var(--text-link-visited);
  /* Only color can be changed here — browser security restriction */
}

/* Focus */
.hyperlink:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}

/* Disabled */
.hyperlink[aria-disabled="true"] {
  opacity: var(--visibility-disabled);  /* 0.4 */
  pointer-events: none;
  cursor: default;
  color: var(--text-disabled);
}

/* Icon wrappers */
.hyperlink__icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
.hyperlink--md .hyperlink__icon { width: 16px; height: 16px; }
.hyperlink--lg .hyperlink__icon { width: 20px; height: 20px; }
.hyperlink--xl .hyperlink__icon { width: 24px; height: 24px; }
```

### CSS Token → Custom Property mapping

| Token | CSS variable | Resolved (Light) |
|---|---|---|
| `text/link` | `--text-link` | `#6C5CE7` |
| `text/link/hover` | `--text-link-hover` | `#5D50BF` |
| `text/link/active` | `--text-link-active` | `#4C42A0` |
| `text/link/visited` | `--text-link-visited` | `#551A8B` |
| `text/disabled` | `--text-disabled` | `#9CA3AF` |
| `focus/ring/color` | `--focus-ring-color` | `#B6AEF3` |
| `visibility/disabled` | `--visibility-disabled` | `0.4` |

---

## 7. React Implementation Reference

```tsx
export const Hyperlink = ({
  children,
  href,
  size = 'lg',
  external = false,
  leadingIcon,
  trailingIcon,
  disabled = false,
  className,
  onClick,
}: HyperlinkProps) => {
  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn('hyperlink', `hyperlink--${size}`, className)}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
    >
      {leadingIcon && (
        <span className="hyperlink__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}

      {children}

      {trailingIcon && (
        <span className="hyperlink__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}

      {external && (
        <span className="sr-only"> (opens in new tab)</span>
      )}
    </a>
  );
};
```

**Notes:**
- Do not use `href="#"` or `href="javascript:void(0)"` — if it navigates nowhere, it is not a link.
- When `disabled=true`, remove `href` entirely in addition to setting `aria-disabled` — some AT will still follow `href` even with `aria-disabled`.
- Icons are wrapped in `aria-hidden` spans — they are decorative. The link text alone must be descriptive enough for AT.

---

## 8. Accessibility Spec

```html
<!-- Standard link -->
<a href="/dashboard" class="hyperlink hyperlink--lg">
  Go to dashboard
</a>

<!-- External link -->
<a
  href="https://docs.example.com"
  target="_blank"
  rel="noopener noreferrer"
  class="hyperlink hyperlink--lg"
>
  Read the docs
  <span class="hyperlink__icon" aria-hidden="true"><ArrowSquareOutIcon /></span>
  <span class="sr-only"> (opens in new tab)</span>
</a>

<!-- With leading icon -->
<a href="/back" class="hyperlink hyperlink--lg">
  <span class="hyperlink__icon" aria-hidden="true"><ArrowLeftIcon /></span>
  Back to projects
</a>

<!-- Disabled -->
<a
  aria-disabled="true"
  tabindex="-1"
  class="hyperlink hyperlink--lg"
>
  Unavailable link
</a>
```

**WCAG conformance:**
- 1.4.1 Use of Colour — underline on hover/active provides non-colour distinction ✓
- 1.4.3 Contrast — `text/link` on white: **4.86:1** (AA pass) ✓
- 2.4.4 Link Purpose — link text must be self-describing; do not use "click here" ✓
- 2.4.7 Focus Visible — `:focus-visible` outline always present ✓
- 4.1.2 Name, Role, Value — `<a>` with `href` has implicit link role ✓

**Note on focus ring contrast:** `focus/ring/color` (#B6AEF3) achieves 2.03:1 on white — below the WCAG 2.4.11 AA target of 3:1. This is an open system-wide decision deferred by design. Engineers should be aware this may require remediation in a future token pass if WCAG 2.2 compliance is formally audited.

---

## 9. Visited State — Implementation Notes

The `:visited` pseudo-class is subject to browser privacy restrictions. Only these CSS properties can be applied inside `:visited`:

- `color`
- `background-color`
- `border-color`
- `outline-color`
- `column-rule-color`
- `fill` / `stroke` (SVG)

**Cannot** be changed via `:visited`: font-size, text-decoration, content, opacity, visibility, transform, display, or any layout property.

This means the icon colour inside a visited link **cannot** be updated to match — icons will retain their default brand purple. This is acceptable and consistent with browser-standard behaviour.

Do not attempt workarounds (e.g. nested spans with computed styles). They are detectable by browsers and treated as security violations.

---

## 10. What This Component Does NOT Own

- **Tooltips** — if the link needs a tooltip (e.g. to explain why it is disabled), wrap in a `Tooltip` component
- **Router integration** — `Hyperlink` renders a native `<a>`. SPA route handling (React Router, Next.js `<Link>`) should wrap or replace the `href` prop at the application level
- **Truncation** — if used in a constrained-width container, apply `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` at the consumer level
- **Colour theming beyond token values** — do not pass custom colour props; all colour is token-governed

---

## 11. Stories to Write

### 11.1 Default

```tsx
export const Default: Story = {
  args: {
    children: 'Go to dashboard',
    href: '/dashboard',
    size: 'lg',
    disabled: false,
    external: false,
  },
};
```

### 11.2 All Sizes

```tsx
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Hyperlink href="#" size="md">Small link — 14px</Hyperlink>
      <Hyperlink href="#" size="lg">Default link — 16px</Hyperlink>
      <Hyperlink href="#" size="xl">Large link — 18px</Hyperlink>
    </div>
  ),
};
```

### 11.3 With Trailing Icon

```tsx
export const WithTrailingIcon: Story = {
  args: {
    ...Default.args,
    trailingIcon: <CaretRightIcon />,
  },
};
```

### 11.4 With Leading Icon

```tsx
export const WithLeadingIcon: Story = {
  args: {
    children: 'Back to projects',
    href: '/projects',
    size: 'lg',
    leadingIcon: <ArrowLeftIcon />,
  },
};
```

### 11.5 External Link

```tsx
export const External: Story = {
  args: {
    children: 'Read the docs',
    href: 'https://docs.example.com',
    size: 'lg',
    external: true,
    trailingIcon: <ArrowSquareOutIcon />,
  },
  // Verify: opens in new tab, sr-only text present in DOM, rel=noopener
};
```

### 11.6 Disabled

```tsx
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  // Verify: aria-disabled=true, tabIndex=-1, href absent, pointer-events:none
};
```

### 11.7 Inline in Body Copy

```tsx
export const InlineInBodyCopy: Story = {
  render: () => (
    <p style={{ fontSize: '16px', lineHeight: '1.5', maxWidth: '480px' }}>
      You can manage your billing preferences in the{' '}
      <Hyperlink href="/settings/billing" size="lg">
        billing settings
      </Hyperlink>{' '}
      page. For questions, visit our{' '}
      <Hyperlink href="https://help.example.com" size="lg" external trailingIcon={<ArrowSquareOutIcon />}>
        help centre
      </Hyperlink>
      .
    </p>
  ),
  // Verifies: links sit flush in surrounding body text, correct size alignment
};
```

### 11.8 All States (Interactive Showcase)

```tsx
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Hyperlink href="#">Default state</Hyperlink>
      {/* Hover and Active are CSS — cannot be forced via props.
          Use Storybook's interaction panel to hover/click in the preview. */}
      <Hyperlink href="#" className="force-visited">Visited state (apply :visited class for demo)</Hyperlink>
      <Hyperlink href="#" disabled>Disabled state</Hyperlink>
    </div>
  ),
};
```

### 11.9 Dark Mode

Set `data-theme="dark"` on the story decorator container. All tokens resolve from `Venus_Semantics` — both modes are complete. Verify:
- `text/link` → `purple/400` (#9F93FA) — contrast on dark surface: **5.61:1** ✓
- `text/link/hover` → `purple/300` (#C4B5FD) — contrast: **7.95:1** ✓
- `text/link/visited` → `purple/300` (#C4B5FD)

---

## 12. Acceptance Criteria

Before this component is marked ready for production:

- [ ] `<a>` element used — not `<button>` or `<div>`
- [ ] `href` is required in TypeScript interface — no `href?: string`
- [ ] `disabled` removes `href` from DOM (not just `pointer-events: none`)
- [ ] `disabled` sets `aria-disabled="true"` and `tabIndex={-1}`
- [ ] `external` adds `target="_blank" rel="noopener noreferrer"`
- [ ] `external` appends `<span class="sr-only"> (opens in new tab)</span>`
- [ ] Leading and trailing icons are wrapped in `aria-hidden="true"` spans
- [ ] Underline present on `:hover` and `:active`, absent on default/visited/disabled
- [ ] `text-decoration-skip-ink: none` on hover/active (continuous underline)
- [ ] `text-underline-offset: 2px` on hover
- [ ] `:focus-visible` outline: 2px `--focus-ring-color`, 2px offset
- [ ] All three sizes render at correct font sizes (14/16/18px)
- [ ] `text/link/visited` resolves to `#551A8B` in Light mode — not brand purple
- [ ] Disabled opacity uses CSS `var(--visibility-disabled)` — not hardcoded `0.4`
- [ ] Component passes axe-core in Default, WithLeadingIcon, WithTrailingIcon, External, and Disabled stories
- [ ] Snapshot tests pass for all 9 stories

---

*Venus 2.1 RF — Design Systems. Questions: open a ticket tagged `venus-ds` or ping #design-systems.*
