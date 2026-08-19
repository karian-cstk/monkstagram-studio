---
brief_schema: venus-storybook-handover/v2
component_name: "Hyperlink"
component_kebab_case: "hyperlink"
mode: "NEW"
target_component: "N/A"
phase_number: N/A
phase_of_total: N/A
prior_phase_brief: "N/A"
prior_phase_status_required: "N/A"
handover_status: "READY_FOR_REVIEW"
unresolved_question_count: 0
figma_node_url: "https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=644-27354"
figma_file_key: "M6u9MVznfNDO20b0DAC1cu"
figma_node_id: "644:27354"
figma_branch_or_version: "main"
figma_verified_at: "2026-08-11T00:00:00Z"
target_repository: "contentstack/venus-components"
target_package: "@contentstack/venus-ui"
target_storybook_title: "Actions/Hyperlink"
brief_owner: "George Karian"
required_approvers: ["George Karian"]
approval_date: "PENDING"
---

<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        Hyperlink
  REACT_COMPONENT:       Hyperlink
  STORYBOOK_TITLE:       Actions/Hyperlink
  FIGMA_NODE_ID:         644:27354
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           🔘 Actions
  CSS_CLASS_PREFIX:      hyperlink
  FILE_NAME:             Hyperlink.tsx
  STORY_FILE_NAME:       Hyperlink.stories.tsx
  CSS_FILE_NAME:         Hyperlink.module.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-08-11
  STATUS:                Active
  ═══════════════════════════════════════════════════════════════════
-->

# Hyperlink — Storybook Engineering Handover

---

## ⚠️ Absolute Requirements

| # | Requirement | Why non-negotiable |
|---|---|---|
| 1 | Must render as `<a href>` — never `<button>` or `<div>` | Links navigate; buttons act. Using `<button>` for navigation is a semantic error that breaks AT, browser history, middle-click, right-click-open-in-tab, and Ctrl+Click behaviour. |
| 2 | No underline at rest — underline appears on `:hover` and `:active` only | Confirmed in CSET description and live Figma: Default and Visited states have `textDecoration: NONE`; Hover state has `UNDERLINE`. |
| 3 | Underline must be continuous — `text-decoration-skip-ink: none` | CSET description specifies "skip-ink disabled — continuous line, no descender gaps". Standard browser behaviour gaps the underline under descenders (g, p, y). This component overrides that. |
| 4 | **Visited colour is `#551A8B`** — do not change to brand purple | `text/link/visited` = `purple/visited #551A8B` is the WHATWG browser-standard visited link colour, intentionally outside the Venus brand scale. Managed via CSS `:visited` pseudo-class. |
| 5 | Disabled must use `aria-disabled="true"` + `tabIndex={-1}` — NOT `href="#"` or removing from DOM | `<a>` has no native `disabled`. `aria-disabled` communicates state; `tabIndex={-1}` removes from tab order (correct for disabled links — unlike disabled radio buttons). |
| 6 | External links (`target="_blank"`) must include `rel="noopener noreferrer"` AND a visually hidden `(opens in new tab)` span | Security requirement (noopener). Accessibility requirement: screen readers must announce that the link opens a new context. |
| 7 | No horizontal padding — width is entirely content-driven | CSET confirmed: `paddingLeft=0, paddingRight=0` on all 20 variants. The link is inline with surrounding text. |
| 8 | `text/link` colours must never be used for non-link text | `text/link` (`purple/500`) and `text/link/visited` (`#551A8B`) are scoped to hyperlinks only. Using them on static text creates false affordance. |

---

## 0. Evidence and source contract

### Evidence inspected

| Source | Exact reference | Version/date | What it establishes |
|---|---|---|---|
| Figma design context (live read) | Node `644:27354`, 🔘 Actions | 2026-08-11 | All 20 variants, exact dimensions, children, token bindings, text decoration |
| Figma CSET description | `644:27354` description | 2026-08-11 | Complete token map, underline spec, visited colour rationale, external link guidance, icon sizes, manual wiring step |
| `_Internal/Icon-Wrapper` brief | Node `214:152884` | 2026-08-11 | Upstream dependency HANDOFF_COMPLETE ✅ |
| `venus-21-rf-master.md` | Disabled opacity, focus ring | Project knowledge | 0.40 opacity, `border/focus` spec |

### Source precedence

CSET description (design-authored) + live Figma read are jointly authoritative. All code decisions per market standards.

---

## 1. Outcome and scope

**Definition:** A product hyperlink for navigation within or to external URLs in Contentstack CMS interfaces, with optional leading and trailing icons and four sizes to match surrounding text scale.

**User need:** Content editors need clearly identifiable, accessible navigation links within the CMS that match the text scale of their surrounding context — from compact (sm, 12px) in dense panels to large (xl, 18px) in empty states or hero sections.

### Use cases

| ID | Use case | Context | Success outcome |
|---|---|---|---|
| UC-01 | Inline navigation link | Body text in a form description or info panel | Renders at the right text size, no underline at rest, correct colour |
| UC-02 | External link | Link to documentation or external resource | `target="_blank"`, sr-only "(opens in new tab)", trailing icon (ArrowSquareOut) |
| UC-03 | Link with leading icon | Navigation with directional cue (CaretRight) | Icon aligned left of text, 4px gap, correct icon size for the size variant |
| UC-04 | Visited link | User has already followed this link | `:visited` pseudo-class applies `#551A8B` — no React state needed |

### Scope

| In scope | Out of scope |
|---|---|
| 4 sizes: sm (12px) / md (14px) / lg (16px) / xl (18px) | Use inside form rows (use Button instead) |
| 5 states: Default / Hover / Active / Visited / Disabled | Standalone navigation menus |
| `hasLeadingIcon` and `hasTrailingIcon` booleans with instance swap | Visited state as a React prop |
| External link support (`target`, `rel`) | Router-level active/current state |

### Responsibility boundary

| Hyperlink owns | Consumer owns |
|---|---|
| Visual state (colour, underline, opacity) | `href` value and routing |
| `aria-disabled` + `tabIndex` when disabled | External link detection |
| Focus ring on `:focus-visible` | Providing accessible label when link text is ambiguous ("click here") |
| sr-only "(opens in new tab)" text | Wrapping in paragraph or inline context |

---

## 2. Existing baseline and change contract

`N/A — new component.`

---

## 3. Composition and reuse

| Concern | Decision/evidence |
|---|---|
| Architecture | Standalone `<a>` with optional `IconWrapper` children |
| Existing components to reuse | `IconWrapper` (`214:152884`) — HANDOFF_COMPLETE ✅ |
| Code Connect mappings | None currently |
| Hooks/utilities/providers | None |
| Existing tokens | Venus_Semantics `text/link*` + `text/link/visited` (Hyperlink-specific) |
| Genuinely new surface | `Hyperlink.tsx`, `Hyperlink.module.css`, `Hyperlink.stories.tsx` |
| Prohibited reimplementation | Do not use `<button>` for links. Do not re-implement `:visited` via React state. |

### Dependency tree

| Direction | Component | Must exist before build | Breaking if changed |
|---|---|---|---|
| Upstream | `IconWrapper` (`214:152884`) | **Yes** — ✅ HANDOFF_COMPLETE | `size` prop rename breaks icon sizing |
| Downstream | Any inline link in product UI | N/A | `href`, `size` prop changes are breaking |

---

## 4. Anatomy

`REQUIRED` = always rendered · `OPTIONAL` = prop-controlled · `INTERNAL` = never a prop

| element_key | Layer name | Visibility | Condition | RTL mirrors | Figma ref | Semantic/testing |
|---|---|---|---|---|---|---|
| `root` | `hyperlink` | REQUIRED | Always | no | Variant frame | `<a>`, `data-testid="hyperlink"` |
| `leading-icon` | `leading-icon` | OPTIONAL | `hasLeadingIcon=true` | yes — swaps to trailing in RTL | INSTANCE of `_Internal/Icon-Wrapper` | `aria-hidden` (inherited from wrapper) |
| `label` | `label` | REQUIRED | Always | no | TEXT, HUG×HUG | Link text content; accessible name of the link |
| `trailing-icon` | `trailing-icon` | OPTIONAL | `hasTrailingIcon=true` | yes — swaps to leading in RTL | INSTANCE of `_Internal/Icon-Wrapper` | `aria-hidden` (inherited from wrapper) |
| `sr-text` | (no Figma equivalent) | OPTIONAL | `target="_blank"` | no | — | `<span className="sr-only">(opens in new tab)</span>` — always present when external |
| `focus-ring` | `focus-ring` | INTERNAL | `:focus-visible` / `hasFocus=true` (Storybook) | no | FRAME, ABSOLUTE, size+4px | `aria-hidden="true"` |

---

## 5. Public React API

### Props

| Prop | TypeScript type | Required | Default | Behavior | Storybook control |
|---|---|---|---|---|---|
| `label` | `string` | Yes | `'Hyperlink'` | Link text content — also the accessible name | text |
| `href` | `string` | Yes | `'#'` | Navigation target | text |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No | `'md'` | Font size, icon size, vertical padding | select |
| `target` | `'_blank' \| '_self' \| '_parent' \| '_top'` | No | `'_self'` | Link target. `'_blank'` automatically adds `rel="noopener noreferrer"` and sr-only "(opens in new tab)" text | select |
| `rel` | `string` | No | — | Forwarded to `<a>`. Overrides automatic `rel` if provided. | text |
| `disabled` | `boolean` | No | `false` | `aria-disabled="true"` + `tabIndex={-1}` + `pointer-events: none` + 0.40 opacity | boolean |
| `hasLeadingIcon` | `boolean` | No | `false` | Shows leading `IconWrapper` before label | boolean |
| `hasTrailingIcon` | `boolean` | No | `false` | Shows trailing `IconWrapper` after label | boolean |
| `leadingIcon` | `React.ReactNode` | No | — | Icon element for leading position. Required when `hasLeadingIcon=true`. | — |
| `trailingIcon` | `React.ReactNode` | No | — | Icon element for trailing position. Required when `hasTrailingIcon=true`. | — |
| `hasFocus` | `boolean` | No | `false` | **Storybook demo only.** Shows focus ring. Never pass in production. | boolean |
| `className` | `string` | No | `''` | Forwarded to root `<a>` | — |
| `onClick` | `React.MouseEventHandler<HTMLAnchorElement>` | No | — | Click handler. Not called when disabled. | — |

### Callbacks

| Callback | Trigger | Signature | Must not fire when |
|---|---|---|---|
| `onClick` | Click or Enter | `React.MouseEventHandler<HTMLAnchorElement>` | `disabled === true` |

### API mechanics

| Concern | Contract |
|---|---|
| `href` when disabled | Set `href` to `undefined` (not `#`) when `disabled=true` — prevents following the link if JS is disabled |
| `target="_blank"` | Automatically adds `rel="noopener noreferrer"` and sr-only "(opens in new tab)" — consumer does not need to add these manually |
| `rel` override | If `rel` is explicitly provided, it overrides the automatic rel. Consumers are responsible for security in this case. |
| Ref forwarding | `React.forwardRef` to root `<a>` |
| `data-*` / `aria-*` | Forwarded via `...rest` to root `<a>` |
| Visited state | CSS `:visited` pseudo-class applied automatically by the browser. No React state or prop needed. |

### TypeScript interface

```typescript
/**
 * Product hyperlink for navigation within Contentstack CMS interfaces.
 * Renders as <a> — use for navigation only. Use Button for actions.
 *
 * @see https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu/Venus-2.1-RF?node-id=644-27354
 */
export interface HyperlinkProps {
  /** Link text. Also the accessible name of the link. */
  label: string;
  /** Navigation target URL. */
  href: string;
  /** Size variant — matches surrounding text scale. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Link target. '_blank' automatically adds rel="noopener noreferrer"
   * and sr-only "(opens in new tab)" text.
   * @default '_self'
   */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** Custom rel. Overrides automatic noopener noreferrer when target="_blank". */
  rel?: string;
  /** Disables the link. Uses aria-disabled + tabIndex=-1. @default false */
  disabled?: boolean;
  /** Show leading icon. @default false */
  hasLeadingIcon?: boolean;
  /** Show trailing icon. @default false */
  hasTrailingIcon?: boolean;
  /** Leading icon element. Required when hasLeadingIcon is true. */
  leadingIcon?: React.ReactNode;
  /** Trailing icon element. Required when hasTrailingIcon is true. */
  trailingIcon?: React.ReactNode;
  /**
   * Storybook demo only — shows focus ring.
   * In production, ring is driven by :focus-visible. Never pass at runtime.
   * @default false
   */
  hasFocus?: boolean;
  /** Click handler. Not called when disabled. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Additional class forwarded to root <a>. */
  className?: string;
}
```

### JSX base component

```tsx
import React from 'react';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import type { HyperlinkProps } from './Hyperlink';
import styles from './Hyperlink.module.css';

const iconSizeMap = { sm: 12, md: 16, lg: 20, xl: 24 } as const;

export const Hyperlink = React.forwardRef<HTMLAnchorElement, HyperlinkProps>(
  (
    {
      label,
      href,
      size = 'md',
      target = '_self',
      rel: relProp,
      disabled = false,
      hasLeadingIcon = false,
      hasTrailingIcon = false,
      leadingIcon,
      trailingIcon,
      hasFocus = false,
      onClick,
      className,
      ...rest
    },
    ref
  ) => {
    const isExternal = target === '_blank';
    const resolvedRel = relProp ?? (isExternal ? 'noopener noreferrer' : undefined);
    const iconSize = iconSizeMap[size];

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) { e.preventDefault(); return; }
      onClick?.(e);
    };

    return (
      <a
        ref={ref}
        href={disabled ? undefined : href}
        target={target}
        rel={resolvedRel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        data-testid="hyperlink"
        className={[
          styles['hyperlink'],
          styles[`hyperlink--${size}`],
          disabled ? styles['hyperlink--disabled'] : '',
          hasFocus ? styles['hyperlink--focused'] : '',
          className,
        ].filter(Boolean).join(' ')}
        style={disabled ? { opacity: 'var(--venus-visibility-disabled)' } : undefined}
        onClick={handleClick}
        {...rest}
      >
        {/* Focus ring — INTERNAL */}
        <span className={styles['hyperlink__focus-ring']} aria-hidden="true" />

        {hasLeadingIcon && leadingIcon && (
          <IconWrapper size={iconSize} icon={leadingIcon} />
        )}

        <span className={styles['hyperlink__label']}>{label}</span>

        {hasTrailingIcon && trailingIcon && (
          <IconWrapper size={iconSize} icon={trailingIcon} />
        )}

        {/* Screen-reader only text for external links */}
        {isExternal && (
          <span className="sr-only"> (opens in new tab)</span>
        )}
      </a>
    );
  }
);

Hyperlink.displayName = 'Hyperlink';
```

**Hyperlink.module.css:**

```css
/* ── Root ──────────────────────────────── */
.hyperlink {
  display: inline-flex;
  align-items: center;
  gap: var(--venus-space-4, 4px);
  padding-inline: 0;              /* Absolute Requirement #7 — no horizontal padding */
  text-decoration: none;          /* No underline at rest — Absolute Requirement #2 */
  cursor: pointer;
  color: var(--venus-text-link);  /* text/link = purple/500 */
  border-radius: var(--venus-radius-2, 2px);
  position: relative;
  font-family: var(--venus-font-inter);
  font-weight: 400;
}

/* ── Size variants ──────────────────────── */
.hyperlink--sm { font-size: 12px; line-height: 130%; padding-block: var(--venus-space-2, 2px); }
.hyperlink--md { font-size: 14px; line-height: 130%; padding-block: var(--venus-space-4, 4px); }
.hyperlink--lg { font-size: 16px; line-height: 130%; padding-block: var(--venus-space-6, 6px); }
.hyperlink--xl { font-size: 18px; line-height: 130%; padding-block: var(--venus-space-8, 8px); }

/* ── Hover — underline appears, colour darkens ─── */
.hyperlink:hover:not(.hyperlink--disabled) {
  color: var(--venus-text-link-hover);   /* text/link/hover = purple/600 */
  text-decoration: underline;
  text-decoration-skip-ink: none;        /* Absolute Requirement #3 — continuous underline */
  text-underline-offset: 2px;
}

/* ── Active ──────────────────────────────── */
.hyperlink:active:not(.hyperlink--disabled) {
  color: var(--venus-text-link-active);  /* text/link/active = purple/700 Light */
  text-decoration: underline;
  text-decoration-skip-ink: none;
  text-underline-offset: 2px;
}

/* ── Visited — Absolute Requirement #4 ─── */
.hyperlink:visited:not(.hyperlink--disabled) {
  color: var(--venus-text-link-visited); /* text/link/visited = #551A8B */
}

/* ── Disabled ────────────────────────────── */
.hyperlink--disabled {
  color: var(--venus-text-disabled);
  pointer-events: none;
  cursor: not-allowed;
  /* opacity applied inline via style prop — visibility/disabled = 0.40 */
}

/* ── Focus ring — INTERNAL ─────────────── */
.hyperlink__focus-ring {
  display: none;
  position: absolute;
  inset: -2px;
  border: 2px solid var(--venus-border-focus);
  border-radius: calc(var(--venus-radius-2, 2px) + 2px);
  pointer-events: none;
}

.hyperlink--focused .hyperlink__focus-ring,
.hyperlink:focus-visible .hyperlink__focus-ring {
  display: block;
}

/* ── Screen-reader only utility ─────────── */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

### Invalid combinations

| Combination | Valid | Required result |
|---|---|---|
| `hasLeadingIcon=true` AND `leadingIcon` is undefined | No | Skip render; warn in dev |
| `hasTrailingIcon=true` AND `trailingIcon` is undefined | No | Skip render; warn in dev |
| `disabled=true` AND `href` is provided | Allowed — href is cleared in render | `href` set to `undefined` when disabled to prevent navigation if JS fails |
| `target="_blank"` without an accessible label | Valid — sr-only "(opens in new tab)" is automatic | No consumer action needed for external link announcement |

---

## 6. Figma property to React mapping

| Figma property | Figma values | React prop | Mapping rule | React default |
|---|---|---|---|---|
| `Size` (VARIANT) | `sm \| md \| lg \| xl` | `size` | direct | `'md'` |
| `State=Disabled` (VARIANT) | `Disabled` | `disabled: boolean` | direct | `false` |
| `State=Hover` | `Hover` | CSS `:hover` — never a prop | pseudo-class | — |
| `State=Active` | `Active` | CSS `:active` — never a prop | pseudo-class | — |
| `State=Visited` | `Visited` | CSS `:visited` — never a prop | pseudo-class | — |
| `label#644:2248` (TEXT) | Any string | `label: string` | direct | `'Hyperlink'` |
| `hasLeadingIcon#665:2698` (BOOLEAN) | `true \| false` | `hasLeadingIcon` | direct | `false` |
| `hasTrailingIcon#644:2264` (BOOLEAN) | `true \| false` | `hasTrailingIcon` | direct | `false` |
| `hasFocus#644:2280` (BOOLEAN) | `true \| false` | `hasFocus` | Storybook demo only | `false` |
| `selectLeadingIcon#665:2714` (INSTANCE_SWAP) | Any icon | `leadingIcon: React.ReactNode` | Consumer passes icon component | CaretRight default |
| `selectTrailingIcon#644:2296` (INSTANCE_SWAP) | Any icon | `trailingIcon: React.ReactNode` | Consumer passes icon component | CaretRight default (ArrowSquareOut for external) |

### Unmapped design properties

`N/A — all properties mapped.`

> **Note:** CSET description flags a manual Figma UI step required for `selectLeadingIcon` wiring across variants. This is a Figma build concern only — does not affect the React implementation.

### Unmapped code properties

`N/A — new component.`

---

## 7. Variants, states, and precedence

### Size contract

| Size | Font size | V padding | Icon size | Component height (label only) |
|---|---|---|---|---|
| `sm` | 12px (Body/XS) | 2px | 12px | 21px |
| `md` | 14px (Body/MD) | 4px | 16px | **29px** (default) |
| `lg` | 16px (Body/LG) | 6px | 20px | 36px |
| `xl` | 18px (Body/XL) | 8px | 24px | 45px |

Width is content-driven (HUG). No horizontal padding on any size.

### Variant cross-matrix

| | Default | Hover | Active | Visited | Disabled |
|---|---|---|---|---|---|
| **sm** | ✓ | ✓ | ✓ | ✓ | ✓ `1492:43391` |
| **md** | ✓ `644:27204` | ✓ `644:27211` | ✓ | ✓ `644:27229` | ✓ |
| **lg** | ✓ | ✓ | ✓ | ✓ `644:27274` | ✓ |
| **xl** | ✓ | ✓ | ✓ | ✓ | ✓ `644:27328` |

### State table

| State | Trigger | CSS mechanism | Text colour | Underline | Required story |
|---|---|---|---|---|---|
| Default | Initial render | — | `text/link` (purple/500) | None | `Default` |
| Hover | Pointer enter | `:hover` | `text/link/hover` (purple/600) | `underline`, skip-ink=none | `Hovered` |
| Active | Pointer down | `:active` | `text/link/active` (purple/700) | `underline`, skip-ink=none | `Active` |
| Visited | Browser records visit | `:visited` — never a prop | `text/link/visited` (#551A8B) | None | `Visited` |
| Disabled | `disabled=true` | `aria-disabled + tabIndex=-1 + pointer-events:none` | `text/disabled` | None | `Disabled` |
| Focused | `:focus-visible` | Focus ring `display: block` | Default colour | None added | `Focused` |

### State precedence

| Higher | Lower | Result |
|---|---|---|
| Disabled | All interaction states | Interaction blocked via `pointer-events: none` |
| Active | Hover | Active colour + underline override hover colour |

---

## 8. Functional behavior and validation

| Rule ID | Given | When | Then | Failure mode |
|---|---|---|---|---|
| BR-01 | `disabled=true` | User clicks | Navigation prevented; `onClick` not fired | Disabled link navigates |
| BR-02 | `target="_blank"` | Component renders | `rel="noopener noreferrer"` present, sr-only "(opens in new tab)" visible to AT | Opens without noopener — security risk |
| BR-03 | `href` is a valid URL | User clicks enabled link | Browser navigates normally | — |
| BR-04 | `hasLeadingIcon=true` AND `leadingIcon` undefined | Component renders | No icon rendered; warn in dev | Layout space for missing icon |

---

## 9. Interactions and focus

| ID | element_key | Action | Result | Keyboard |
|---|---|---|---|---|
| INT-01 | `root` | Click | Navigate to `href` (if not disabled) | Enter |
| INT-02 | `root` | Click when disabled | Prevented | Enter blocked |
| INT-03 | `root` | Tab | Focus enters component | Tab / Shift+Tab |

**Focus ring contract:**

| Property | Value |
|---|---|
| CSS trigger (production) | `:focus-visible` on root `<a>` |
| CSS trigger (Storybook) | `.hyperlink--focused` via `hasFocus=true` |
| Element | `.hyperlink__focus-ring`, `aria-hidden`, `position: absolute`, `inset: -2px` |
| Border | `2px solid var(--venus-border-focus)` → `purple/500` Light / `purple/400` Dark |
| Border radius | `border-radius: calc(var(--venus-radius-2) + 2px)` — slightly rounded rectangle |

### Motion

`N/A — colour and underline transitions apply instantly per CSET. No animated transitions required.`

---

## 10. Dynamic positioning

`N/A — no dynamically repositioned elements.`

---

## 11. Responsive behavior

| Constraint | Rule |
|---|---|
| Width | Inline — grows with label text. No min or max width. |
| Height | Content-driven. No fixed height. |
| `display` | `inline-flex` — flows inline with surrounding text |
| Zoom/reflow | Scales with browser text zoom. Text reflows at WCAG 1.4.4 requirement. |

---

## 12. Content, localization, and edge cases

| Case | Required behavior | Story |
|---|---|---|
| Long label (full sentence) | Wraps to multiple lines; underline on each line when hover | `LongLabel` |
| External link (`target="_blank"`) | rel set, sr-only text present, optional ArrowSquareOut trailing icon | `ExternalLink` |
| Icon-only (empty label) | Invalid — link must have accessible name | N/A |
| RTL | `flex-direction: row-reverse` in RTL context — leading/trailing icons swap sides | `RTL` |
| Link text "Click here" or "Learn more" | Valid in context — consumer should supply `aria-label` for ambiguous text | N/A |

---

## 12a. Do / Don't

| ✅ Do | ❌ Don't | Rationale |
|---|---|---|
| Use `<a href>` for navigation | Use `<button>` for navigation | Links navigate; buttons act. Semantic error breaks browser behaviour. |
| Let CSS `:visited` handle visited state | Implement visited as a React prop | `:visited` is browser-managed and privacy-protected. React state can't replicate it correctly. |
| Use `size` to match surrounding text | Force a specific size without matching context | Hyperlink is an inline element — its size should match the text it lives with |
| Use `rel="noopener noreferrer"` on all `target="_blank"` links | Open `target="_blank"` without rel | Allows the new tab to access the opener window — security vulnerability |
| Always include sr-only "(opens in new tab)" for external links | Assume sighted behaviour communicates new-tab intent | Screen reader users cannot see the tab open; the announcement is the only signal |
| Use `disabled` + `aria-disabled` + `tabIndex=-1` | Remove from DOM or set `href="#"` | DOM removal prevents AT discovery; `href="#"` navigates to the page top |

---

## 13. Tokens, typography, and assets

**Token chain:** `_Primitives → Venus_Semantics → component layer`.

### Tokens

| State | Property | Token | CSS custom property | Figma VariableID |
|---|---|---|---|---|
| Default | `color` | `[VS] text/link` | `--venus-text-link` | `564:3200` |
| Hover | `color` | `[VS] text/link/hover` | `--venus-text-link-hover` | `564:3201` |
| Active | `color` | `[VS] text/link/active` | `--venus-text-link-active` | (described in CSET) |
| Visited | `color` | `text/link/visited` (#551A8B Light / purple/300 Dark) | `--venus-text-link-visited` | `644:27201` (Hyperlink-specific token) |
| Disabled | `color` | `[VS] text/disabled` | `--venus-text-disabled` | `564:3196` |
| Disabled | `opacity` (root) | `[VS] visibility/disabled` | `--venus-visibility-disabled` | `564:3246` |
| Focused | `border-color` (ring) | `[VS] border/focus` | `--venus-border-focus` | `564:3227` |

> **`text/link/visited` is a Hyperlink-specific token (`VariableID:644:27201`).** `#551A8B` is the WHATWG browser-standard visited link colour — intentionally outside the Venus brand purple scale. Do not adjust. Do not reuse for other purposes.

### Typography

| Size | Font | Weight | Size | Line height |
|---|---|---|---|---|
| `sm` | Inter | 400 | 12px (Body/XS `564:3301`) | 130% |
| `md` | Inter | 400 | 14px (Body/MD `564:3295`) | 130% |
| `lg` | Inter | 400 | 16px (Body/LG `564:3292`) | 130% |
| `xl` | Inter | 400 | 18px (Body/XL `564:3288`) | 130% |

All sizes use weight 400 (Regular) — not 500. This differentiates links from labels.

### Icon mode map

| State | Venus_Icons mode | Rationale |
|---|---|---|
| All non-disabled | `default` (brand purple) | Icons match link text colour |
| Disabled | `disabled` (gray) | Matches disabled text colour — icon colour changes with opacity on root |

---

## 14. Accessibility contract

### Semantics and naming

| Concern | Requirement |
|---|---|
| Root element | `<a href>` — native link |
| Accessible name | Implicit from `label` text content. For ambiguous labels ("click here"), consumer provides `aria-label` via `...rest`. |
| `aria-disabled` | `"true"` when `disabled=true` |
| External links | `rel="noopener noreferrer"` + sr-only "(opens in new tab)" span |
| Visited state | CSS `:visited` — no ARIA needed; browser communicates state natively |

### Keyboard

| Key | Result | Notes |
|---|---|---|
| Enter | Navigate to `href` | Standard `<a>` keyboard behaviour |
| Enter when disabled | Prevented | `onClick` handler blocks; `href` is undefined |
| Tab / Shift+Tab | Standard focus movement | tabIndex -1 when disabled |

### Announcements

| Event | Announcement |
|---|---|
| Focus | "Label text, link" |
| Focus (external) | "Label text (opens in new tab), link" |
| Focus (disabled) | "Label text, dimmed, link" |
| Focus (visited) | "Label text, visited, link" (browser-dependent) |

### Acceptance

| Area | Requirement |
|---|---|
| Contrast | `text/link` on white ≥ 4.5:1. `text/link/visited` (#551A8B) on white ≥ 4.5:1. |
| Focus visible | 2px `border/focus` ring, `inset: -2px`, rounded rectangle |
| Touch target | Vertical padding ensures minimum 24px touch height at all sizes (sm = 12+2+2+4+4=24px, others larger) |
| Link purpose | Link text must communicate destination from context (WCAG 2.4.4 Level AA) |

---

## 15. Storybook contract

### Environment

| Field | Requirement |
|---|---|
| Story format | CSF3 |
| Layout | `layout: 'centered'` |
| Globals | Light + Dark both required for every story |
| Decorators | Wrap in a `<p>` to simulate inline context |

### Controls

| Prop | Control | Options | Default |
|---|---|---|---|
| `label` | text | — | `'Hyperlink'` |
| `href` | text | — | `'https://contentstack.com'` |
| `size` | select | `'sm', 'md', 'lg', 'xl'` | `'md'` |
| `target` | select | `'_self', '_blank'` | `'_self'` |
| `disabled` | boolean | — | `false` |
| `hasLeadingIcon` | boolean | — | `false` |
| `hasTrailingIcon` | boolean | — | `false` |
| `hasFocus` | boolean | — | `false` |

### Required stories

| Export | Storybook ID | Args | Theme | Key assertion |
|---|---|---|---|---|
| `Default` | `actions-hyperlink--default` | `{ label: 'Learn more', href: '...' }` | light + dark | `text/link` colour, no underline |
| `Hovered` | `actions-hyperlink--hovered` | Default + hover decorator | light + dark | `text/link/hover` + underline + skip-ink none |
| `Active` | `actions-hyperlink--active` | Default + active decorator | light + dark | `text/link/active` colour |
| `Visited` | `actions-hyperlink--visited` | Default + visited decorator | light + dark | `#551A8B` colour |
| `Disabled` | `actions-hyperlink--disabled` | `{ disabled: true }` | light + dark | `aria-disabled="true"`, `tabIndex={-1}`, opacity 0.40 |
| `Focused` | `actions-hyperlink--focused` | `{ hasFocus: true }` | light + dark | Focus ring visible |
| `ExternalLink` | `actions-hyperlink--external-link` | `{ target: '_blank', hasTrailingIcon: true, trailingIcon: <ArrowSquareOut /> }` | light + dark | `rel="noopener noreferrer"`, sr-only text present in DOM |
| `WithLeadingIcon` | `actions-hyperlink--with-leading-icon` | `{ hasLeadingIcon: true, leadingIcon: <CaretRight /> }` | light + dark | Icon before label, 4px gap |
| `WithTrailingIcon` | `actions-hyperlink--with-trailing-icon` | `{ hasTrailingIcon: true, trailingIcon: <CaretRight /> }` | light + dark | Icon after label |
| `AllSizes` | `actions-hyperlink--all-sizes` | 4 Hyperlinks sm/md/lg/xl | light + dark | Each matches expected height |
| `SizeSm` | `actions-hyperlink--size-sm` | `{ size: 'sm' }` | light + dark | 12px font, 2px V padding |

---

## 16. Test and visual-verification contract

### Per-prop verification

| Prop | Default | Key assertion |
|---|---|---|
| `disabled` | `false` → interactive | `aria-disabled="true"`, `tabIndex={-1}`, click blocked, opacity 0.40 |
| `target="_blank"` | — | `rel` includes `noopener noreferrer`; sr-only "(opens in new tab)" in DOM |
| `size` | `'md'` → 14px | Computed font-size matches expected per size |
| `hasLeadingIcon` | `false` | `true` → IconWrapper present before label |

### Conditional element inventory

| element_key | Controlling condition | Presence test | Absence test |
|---|---|---|---|
| `leading-icon` | `hasLeadingIcon=true` AND `leadingIcon` defined | `getByTestId('icon-wrapper')` before label | Not found |
| `trailing-icon` | `hasTrailingIcon=true` AND `trailingIcon` defined | `getByTestId('icon-wrapper')` after label | Not found |
| `sr-text` | `target="_blank"` | `getByText('(opens in new tab)')` in DOM | Not found |
| `focus-ring` | `:focus-visible` / `hasFocus=true` | `display: block` | `display: none` |

### Interaction verification

| Interaction | Story | Drive | Assertion |
|---|---|---|---|
| Navigate | `Default` | `userEvent.click` | `href` is followed (mock navigation) |
| Blocked: disabled | `Disabled` | `userEvent.click` | Navigation not fired; `onClick` not called |
| Enter key | `Default` | `userEvent.keyboard('[Enter]')` | Navigation fired |

### Visual matrix

| Story | Theme | Figma reference | Key check |
|---|---|---|---|
| `Default` | light + dark | Node `644:27204` | `text/link` colour, no underline |
| `Hovered` | light + dark | Node `644:27211` | Underline visible, `skip-ink: none` |
| `Visited` | light + dark | Node `644:27229` | `#551A8B` (Light), `purple/300` (Dark) |
| `Disabled` | light + dark | Node `644:27328` (xl) | Opacity 0.40 |
| `ExternalLink` | light + dark | — | `rel` attribute, sr-only text |

---

## 17. Decisions

### Confirmed decisions

| ID | Decision | Rationale |
|---|---|---|
| DEC-01 | `<a href>` not `<button>` | Links navigate. Semantic correctness enables browser-native behaviour (history, middle-click, right-click menu). CSET description confirms this is an `<a>` element. |
| DEC-02 | `:visited` state is CSS-only — no React prop | `:visited` is browser-managed and intentionally privacy-protected (cannot be read by JavaScript to prevent fingerprinting). React state cannot replicate it correctly. |
| DEC-03 | `text/link/visited = #551A8B` is treated as fixed — not adjusted to brand purple | CSET description explicitly documents this as intentional: "WHATWG browser-standard visited link colour. Do not adjust to match brand purple." |
| DEC-04 | `aria-disabled` + `tabIndex=-1` for disabled links (not DOM removal) | Keeps the link discoverable via screen reader browse mode; `tabIndex=-1` removes it from tab sequence (correct — disabled links should not be tab-navigable). |
| DEC-05 | `target="_blank"` automatically adds `rel` and sr-only text | Both are always required for external links. Automating them prevents consumers from forgetting either. |
| DEC-06 | sm size included (12px, added 2026-07-17) | Live Figma confirms 20 variants (4 sizes × 5 states). Project constitution confirms sm was added 2026-07-17 for dense panel/compact contexts. |

### Rejected approaches

| ID | Approach | Why rejected | Chosen instead |
|---|---|---|---|
| REJ-01 | `<button>` with `role="link"` | Breaks browser navigation, history, right-click, middle-click | `<a href>` |
| REJ-02 | `href="#"` when disabled | Navigates to page top if JS fails | `href={undefined}` when disabled |
| REJ-03 | Visited as a React `isVisited` prop | `:visited` is privacy-protected — JS cannot read it | CSS `:visited` pseudo-class |

### Open questions

`NONE — all requirements are decision-complete.`

---

## 18. Definition of ready and sign-off

### Readiness evidence

- [x] Figma node `644:27354` live read 2026-08-11
- [x] All 20 variants (4 sizes × 5 states) in cross-matrix
- [x] Mode NEW, scope explicit
- [x] Absolute Requirements documented (8 items)
- [x] Upstream dependency `_Internal/Icon-Wrapper` confirmed HANDOFF_COMPLETE ✅
- [x] `text/link/visited` colour rationale documented
- [x] External link security and accessibility contracts complete
- [x] `unresolved_question_count: 0`

### Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Design | George Karian | PENDING | — |
| Engineering | Narendra | PENDING | — |
