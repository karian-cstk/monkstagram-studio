# Simple Accordion — Storybook Engineering Brief
**Venus 2.1 RF | Component: Simple Accordion | Node: 1449:97634**
**Status: Active v1.0.0 | Page: 📐 Layout | Last updated: 2026-07-16**

---

## 1. Purpose

`SimpleAccordion` is a collapsible slot container. It provides a bordered box with a clickable trigger bar that reveals or hides its body content. It is intentionally data-agnostic — it does not manage, sort, filter, or understand its content. Everything inside the body and footer slots is the consumer's responsibility.

The primary use case is inside `NavPanel` body slots — grouping navigation items into labelled, collapsible sections. However it is general-purpose and equally suited for settings panels, form field group collapsing, detail sidebars, and any context where a titled disclosure container is needed.

**Use when:**
- Content can be meaningfully grouped under a label and optionally hidden to reduce cognitive load
- Users need to focus on one section at a time (nav trees, settings categories, form groups)
- Actions on the section header (rename, delete, configure) need an affordance via `hasHeaderActions`
- A footer row of persistent actions (edit/delete/add) belongs to the section

**Do not use when:**
- Content is a flat list with no logical grouping — use `Nav/Item` directly
- You need tab-based switching — use `Tabs`
- Content is a single action or setting — use a row, not an accordion
- You need multiple accordions that enforce only one open at a time — that group behaviour is a pattern composed by the consumer, not built into this component

---

## 2. Anatomy

```
Simple Accordion (COMPONENT_SET)
└── root (COMPONENT) — VERTICAL auto-layout, HUG height, FILL width
    │   Fill: surface/raised  Border: border/default 1px OUTSIDE  Radius: radius/4
    │
    ├── trigger (FRAME) — HORIZONTAL, 40px FIXED height, FILL width
    │   ├── leading-icon (_Internal/Icon-Wrapper 16px) — visible: hasLeadingIcon
    │   ├── label (TEXT, Inter Medium 14px, text/default) — FILL width
    │   ├── header-actions (FRAME) — visible: hasHeaderActions
    │   │   ├── btn/action-1 (Icon Button Ghost md)
    │   │   └── btn/action-2 (Icon Button Ghost md)
    │   ├── separator-v (FRAME, 1×16px, text/subtle) — visible: hasHeaderActions
    │   └── btn/chevron (Icon Button Ghost md) — ALWAYS PRESENT, interactive
    │       isExpanded=true  → Caret/up   Size=20px
    │       isExpanded=false → Caret/down Size=20px
    │
    ├── focus-ring (FRAME, ABSOLUTE) — visible: hasFocus
    │
    ├── separator-top (Separator atom) — visible: isExpanded=true
    │
    ├── body (FRAME) — surface/sunken, HUG height, visible: isExpanded=true
    │   └── [consumer content via SLOT]
    │
    ├── separator-footer (Separator atom) — visible: hasFooter=true
    │
    └── footer (FRAME) — surface/sunken, HUG height, visible: hasFooter=true
        └── [consumer content via SLOT]
```

### Layer → DOM Mapping

| Figma layer | DOM element | Role |
|---|---|---|
| root | `<div class="simple-accordion">` | Container. Carries border, radius, surface fill. HUG height. |
| `trigger` | `<button class="accordion-trigger">` | Interactive row. Entire trigger is clickable (not just the chevron). |
| `leading-icon` | `<span aria-hidden="true">` | Optional decorative section icon. |
| `label` | `<span class="accordion-label">` | Section title text. |
| `header-actions` | `<div class="accordion-header-actions">` | 2 Icon Button Ghost md for section-level actions (rename, delete etc). |
| `separator-v` | `<div class="separator-v" aria-hidden="true">` | 1px vertical divider between header-actions and chevron. |
| `btn/chevron` | `<button aria-label="Collapse section">` | Expand/collapse toggle. Icon Button Ghost md. |
| `focus-ring` | `outline` via CSS | Keyboard focus indicator. Never a real DOM element. |
| `separator-top` | `<hr aria-hidden="true">` | 1px horizontal rule between trigger and body. |
| `body` | `<div class="accordion-body">` | Main content slot. `surface/sunken`. HUG height. |
| `separator-footer` | `<hr aria-hidden="true">` | 1px horizontal rule between body and footer. |
| `footer` | `<div class="accordion-footer">` | Footer content slot. `surface/sunken`. HUG height. Edit/delete actions live here. |

---

## 3. TypeScript Props Interface

```typescript
interface SimpleAccordionProps {
  /**
   * Panel state.
   * - 'default': resting state
   * - 'hover': trigger hovered (CSS :hover — never pass as prop in production)
   * - 'focused': keyboard focused (CSS :focus-visible — never pass as prop in production)
   * - 'disabled': non-interactive, 40% opacity
   * @default 'default'
   */
  state?: 'default' | 'hover' | 'focused' | 'disabled';

  /**
   * Whether the accordion is open.
   * Controls: separator-top, body, separator-footer, footer visibility.
   * Controls: btn/chevron icon — Caret/up (true) / Caret/down (false).
   * In production this is a controlled prop — own the state in the parent.
   * @default true
   */
  isExpanded?: boolean;

  /** Section label text in the trigger bar. */
  label?: string;

  /**
   * Show a leading icon left of the label.
   * Pass the icon as `leadingIcon` prop.
   * @default false
   */
  hasLeadingIcon?: boolean;

  /**
   * Icon element for the leading icon slot.
   * Only rendered when hasLeadingIcon=true.
   */
  leadingIcon?: React.ReactNode;

  /**
   * Show two Icon Button Ghost md slots in the trigger header.
   * Used for section-level actions: rename, delete, configure, etc.
   * A 1px vertical separator appears between these buttons and the chevron.
   * @default false
   */
  hasHeaderActions?: boolean;

  /**
   * Icon element for the first header action button.
   * Only rendered when hasHeaderActions=true.
   */
  headerAction1Icon?: React.ReactNode;

  /**
   * Accessible label for the first header action button.
   * Required when hasHeaderActions=true.
   */
  headerAction1Label?: string;

  /** Click handler for header action 1. */
  onHeaderAction1?: (e: React.MouseEvent) => void;

  /** Icon element for the second header action button. */
  headerAction2Icon?: React.ReactNode;

  /** Accessible label for the second header action button. */
  headerAction2Label?: string;

  /** Click handler for header action 2. */
  onHeaderAction2?: (e: React.MouseEvent) => void;

  /**
   * Main body content.
   * Injected into the body slot. Visible when isExpanded=true.
   * This component is data-agnostic — inject Nav/Item, form fields,
   * settings rows, or any content.
   */
  children?: React.ReactNode;

  /**
   * Show the footer slot.
   * Renders a surface/sunken footer zone below the body.
   * Use for section-level persistent actions: edit, delete, add item.
   * @default false
   */
  hasFooter?: boolean;

  /**
   * Footer slot content.
   * Only rendered when hasFooter=true.
   * Typically 1–2 Button Tertiary md or Icon Button Ghost md instances.
   */
  footer?: React.ReactNode;

  /**
   * Callback fired when the chevron button or trigger is clicked.
   * Receives the new expanded state.
   * The component is controlled — always pass isExpanded from parent.
   */
  onToggle?: (isExpanded: boolean) => void;

  /** Disabled state — non-interactive, 40% opacity on entire component. */
  disabled?: boolean;

  /** Additional CSS class names. */
  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma Property | Figma Type | React Prop | Notes |
|---|---|---|---|
| `State` | VARIANT | `state` / `disabled` | `State=Disabled` → `disabled=true`. Hover/Focused are CSS pseudo-classes in production. |
| `isExpanded` | VARIANT | `isExpanded` | Controls chevron icon (Caret/up vs Caret/down) + body/footer visibility. |
| `label` | TEXT | `label` | Section title text. |
| `hasLeadingIcon` | BOOLEAN | `hasLeadingIcon` | Shows leading-icon slot. |
| `hasHeaderActions` | BOOLEAN | `hasHeaderActions` | Shows 2× Icon Button + vertical separator. |
| `hasFooter` | BOOLEAN | `hasFooter` | Shows separator-footer + footer slot. |
| `hasFocus` | BOOLEAN | — | Storybook/demo only. In production: CSS `:focus-visible` on trigger. |
| `body` | SLOT | `children` | Main body content slot. |
| `footer` | SLOT | `footer` | Footer content slot. |
| `btn/chevron` | Instance | — | Icon Button Ghost md. Caret/up when expanded, Caret/down when collapsed. Managed internally — not a prop. |
| `State=Hover` | VARIANT | — | CSS `:hover` on trigger. NEVER a prop. |
| `State=Focused` | VARIANT | — | CSS `:focus-visible` on trigger. NEVER a prop. |

---

## 5. State Behaviour

### 5.1 Component States

| State | Trigger | Visual change | Token |
|---|---|---|---|
| Default | — | surface/raised container, transparent trigger | `surface/raised`, `border/default` |
| Hover | `mouseenter` trigger | Trigger fill changes | `action/ghost/hover` |
| Focused | `Tab` / `:focus-visible` | 2px focus ring visible around root | `border/focus` (#6C5CE7) |
| Disabled | `disabled` prop | Full component at 40% opacity | `visibility/disabled` (0.40) |

### 5.2 Expand/Collapse State

| isExpanded | btn/chevron icon | separator-top | body | separator-footer | footer |
|---|---|---|---|---|---|
| `true` | Caret/up (∧) | Visible | Visible | Visible if hasFooter | Visible if hasFooter |
| `false` | Caret/down (∨) | Hidden | Hidden | Hidden | Hidden |

**The chevron is `btn/chevron` — an Icon Button Ghost md — not a decorative icon.** It must be keyboard focusable, receive focus before the body content, and have an accessible label that communicates the action and current state.

**Important:** The entire trigger bar (`<button class="accordion-trigger">`) is the clickable hit target, not just the chevron. The chevron visually indicates the state — the whole trigger row activates the toggle.

### 5.3 Header Actions Behaviour

When `hasHeaderActions=true`:
- Two Icon Button Ghost md instances appear in the trigger to the left of the chevron
- A 1px vertical separator (`separator-v`, `text/subtle`) divides the actions from the chevron
- The header actions are **independent interactions** — clicking them does not toggle expand/collapse
- Header actions must `stopPropagation` on their click events to prevent the trigger's toggle from firing

```typescript
const handleHeaderAction1 = (e: React.MouseEvent) => {
  e.stopPropagation(); // ← critical — prevents accordion toggle
  onHeaderAction1?.(e);
};
```

### 5.4 Footer Behaviour

The footer slot (`hasFooter=true`) is only shown when the accordion is expanded (`isExpanded=true`). When collapsed, the footer is hidden regardless of `hasFooter`.

In code:
```typescript
const showFooter = hasFooter && isExpanded;
```

Footer content is typically 1–2 Button Tertiary md or Icon Button Ghost md instances for section-level persistent actions (Add item, Edit section, Delete section).

---

## 6. Size Specification

| Property | Value | Token |
|---|---|---|
| Trigger height | 40px fixed | lg system default |
| Trigger padding left | 12px | `space/12` |
| Trigger padding right | 4px | `space/4` |
| Trigger item spacing | 8px | `space/8` |
| Leading icon size | 16px | icon/size/sm |
| btn/action-1, btn/action-2 | 32×32px (Ghost md) | — |
| separator-v | 1×16px | `text/subtle` fill |
| btn/chevron | 32×32px (Ghost md) | — |
| Chevron icon | Caret/up or Caret/down, Size=20px | — |
| Body slot authored height | 80px (empty state) | — |
| Footer slot authored height | 44px (empty state) | — |
| Container border | 1px `border/default` OUTSIDE | — |
| Container radius | 4px | `radius/4` |
| Focus ring | 2px `border/focus` OUTSIDE, radius=6px | — |
| Disabled opacity | 0.40 | `visibility/disabled` |

---

## 7. Token Reference

| Layer | Property | Token | Light value | Dark value |
|---|---|---|---|---|
| Container fill | background | `surface/raised` | white #FFFFFF | gray/800 #1F2937 |
| Container border | stroke | `border/default` | gray/200 #E5E7EB | gray/700 #374151 |
| Container radius | cornerRadius | `radius/4` | 4px | — |
| Disabled container border | stroke | `border/disabled` | gray/300 | gray/600 |
| Trigger hover fill | background | `action/ghost/hover` | purple/50+8% #EDE9FE | — |
| label text | fill | `text/default` | gray/900 #111827 | gray/50 #F9FAFB |
| label disabled | fill | `text/disabled` | gray/400 #9CA3AF | gray/600 |
| separator-v | fill | `text/subtle` | gray/600 #4B5563 | gray/400 |
| separator-top / separator-footer | fill | `border/subtle` | gray/100 #F3F4F6 | gray/800 |
| body fill | background | `surface/sunken` | gray/100 #F3F4F6 | gray/900 |
| footer fill | background | `surface/sunken` | gray/100 #F3F4F6 | gray/900 |
| focus ring | stroke | `border/focus` | purple/500 #6C5CE7 | purple/400 |
| disabled opacity | opacity | `visibility/disabled` | 0.40 | 0.40 |

---

## 8. Accessibility

### ARIA Structure

```html
<div
  class="simple-accordion"
  data-state="expanded|collapsed"
  data-disabled="true|false"
>
  <!-- Trigger — the ENTIRE trigger bar is a button -->
  <button
    class="accordion-trigger"
    aria-expanded="true|false"
    aria-controls="accordion-body-{id}"
    aria-disabled="true"  <!-- only when disabled -->
    disabled              <!-- only when disabled -->
  >
    <!-- Leading icon — decorative, hidden from screen readers -->
    <span aria-hidden="true" class="leading-icon"><!-- icon --></span>

    <!-- Label -->
    <span class="accordion-label">Section title</span>

    <!-- Header actions — independent buttons, stopPropagation required -->
    <div class="header-actions" aria-label="Section actions">
      <button aria-label="Rename section" onClick={stopPropagation + handler}>
        <!-- icon -->
      </button>
      <button aria-label="Delete section" onClick={stopPropagation + handler}>
        <!-- icon -->
      </button>
    </div>

    <!-- Vertical separator — decorative -->
    <div aria-hidden="true" class="separator-v" />

    <!-- Chevron — communicates current state -->
    <span aria-hidden="true" class="chevron">
      <!-- Caret/up when expanded, Caret/down when collapsed -->
    </span>
  </button>

  <!-- Body — controlled by aria-expanded on the trigger -->
  <div
    id="accordion-body-{id}"
    role="region"
    aria-labelledby="accordion-trigger-{id}"
    hidden={!isExpanded}
  >
    <!-- body slot content -->
  </div>

  <!-- Footer — also hidden when collapsed -->
  {hasFooter && isExpanded && (
    <div class="accordion-footer">
      <!-- footer slot content -->
    </div>
  )}
</div>
```

### Why the whole trigger is a button

The entire 40px trigger bar is a single `<button>`. This is intentional:

1. **Larger hit target** — 40px × full width vs 32×32px chevron only
2. **Expected pattern** — all major design systems (Atlassian, Carbon, Material) use full-row triggers for accordion sections
3. **Simpler keyboard model** — one `Tab` stop for the toggle, separate `Tab` stops for header actions

The chevron is `aria-hidden="true"` — the accessible name comes from the label text via `aria-expanded` on the parent button, not from the chevron icon.

### Keyboard Navigation

| Key | Context | Behaviour |
|---|---|---|
| `Tab` | Panel visible | Moves focus: trigger → header actions (if visible) → body content |
| `Enter` / `Space` | Trigger focused | Toggles expanded/collapsed |
| `Enter` / `Space` | Header action focused | Fires that action (does NOT toggle accordion) |
| `Tab` | Inside body | Moves through body content normally |

### Contrast

| Pair | Ratio | Passes |
|---|---|---|
| `text/default` on `surface/raised` | 17:1 | ✅ AAA |
| `text/subtle` (separator-v) on `surface/raised` | 7.5:1 | ✅ AAA |
| `text/disabled` on `surface/raised` (40% opacity) | 1.6:1 | ✅ Exempt — disabled |
| `border/default` on white | 3.1:1 | ✅ UI component AA |

### Touch Targets

| Element | Size | WCAG 2.5.5 |
|---|---|---|
| trigger bar | 40px × full width | ✅ Exceeds minimum |
| btn/action-1, btn/action-2 | 32×32px | ✅ Exceeds 24px minimum |
| btn/chevron | 32×32px | ✅ Exceeds 24px minimum |

---

## 9. Implementation Notes

### CSS Custom Properties

```css
/* Layout */
--accordion-trigger-height:    40px;
--accordion-padding-left:      var(--space-12, 12px);
--accordion-padding-right:     var(--space-4,  4px);
--accordion-gap:               var(--space-8,  8px);
--accordion-radius:            var(--radius-4, 4px);
--accordion-focus-ring-radius: 6px; /* radius/4 + 2 */

/* Colours */
--accordion-surface:           var(--surface-raised,  white);
--accordion-border:            var(--border-default,  #E5E7EB);
--accordion-border-disabled:   var(--border-disabled, #D1D5DB);
--accordion-trigger-hover:     var(--action-ghost-hover);
--accordion-body-surface:      var(--surface-sunken,  #F3F4F6);
--accordion-separator-v:       var(--text-subtle,     #4B5563);
```

### Base CSS

```css
.simple-accordion {
  display: flex;
  flex-direction: column;
  background: var(--accordion-surface);
  border: 1px solid var(--accordion-border);
  border-radius: var(--accordion-radius);
  width: 100%;
  position: relative;
  overflow: visible; /* focus ring protrudes outside */
}

.simple-accordion[data-disabled="true"] {
  opacity: var(--visibility-disabled, 0.40);
  pointer-events: none;
}

.accordion-trigger {
  display: flex;
  align-items: center;
  gap: var(--accordion-gap);
  height: var(--accordion-trigger-height);
  padding-left: var(--accordion-padding-left);
  padding-right: var(--accordion-padding-right);
  width: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  position: relative;
}

.accordion-trigger:hover {
  background: var(--accordion-trigger-hover);
}

.accordion-trigger:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 4px;
  border-radius: var(--accordion-focus-ring-radius);
}

.accordion-label {
  flex: 1 0 0;
  font-family: var(--font-family-primary, 'Inter');
  font-weight: 500;
  font-size: 14px;
  color: var(--text-default);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.accordion-separator-v {
  width: 1px;
  height: 16px;
  background: var(--accordion-separator-v);
  flex-shrink: 0;
}

.accordion-body {
  background: var(--accordion-body-surface);
}

.accordion-footer {
  background: var(--accordion-body-surface);
}
```

### Header Actions — stopPropagation is mandatory

```tsx
const SimpleAccordion = ({
  hasHeaderActions,
  headerAction1Icon,
  headerAction1Label,
  onHeaderAction1,
  headerAction2Icon,
  headerAction2Label,
  onHeaderAction2,
  onToggle,
  isExpanded,
  ...
}) => {
  const handleTriggerClick = () => {
    onToggle?.(!isExpanded);
  };

  const handleAction1 = (e: React.MouseEvent) => {
    e.stopPropagation(); // ← MANDATORY — prevents accordion toggle
    onHeaderAction1?.(e);
  };

  const handleAction2 = (e: React.MouseEvent) => {
    e.stopPropagation(); // ← MANDATORY
    onHeaderAction2?.(e);
  };

  return (
    <div className="simple-accordion">
      <button className="accordion-trigger" onClick={handleTriggerClick} aria-expanded={isExpanded}>
        {/* ... label ... */}
        {hasHeaderActions && (
          <div className="header-actions" onClick={e => e.stopPropagation()}>
            <IconButton icon={headerAction1Icon} accessibleLabel={headerAction1Label} onClick={handleAction1} />
            <IconButton icon={headerAction2Icon} accessibleLabel={headerAction2Label} onClick={handleAction2} />
          </div>
        )}
        <div className="accordion-separator-v" aria-hidden="true" />
        <span aria-hidden="true" className="chevron">
          {isExpanded ? <CaretUpIcon /> : <CaretDownIcon />}
        </span>
      </button>
      {isExpanded && (
        <>
          <hr aria-hidden="true" />
          <div className="accordion-body">{children}</div>
        </>
      )}
      {hasFooter && isExpanded && (
        <>
          <hr aria-hidden="true" />
          <div className="accordion-footer">{footer}</div>
        </>
      )}
    </div>
  );
};
```

### Animation

```css
/* Smooth expand/collapse */
.accordion-body {
  overflow: hidden;
  transition: height 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Chevron icon rotation alternative to icon swap */
.chevron-icon {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.simple-accordion[data-expanded="true"] .chevron-icon {
  transform: rotate(180deg); /* CaretDown rotates to CaretUp */
}

@media (prefers-reduced-motion: reduce) {
  .accordion-body,
  .chevron-icon {
    transition: none;
  }
}
```

**Note:** In Figma, two separate icon variants (Caret/up and Caret/down) represent the expand/collapse state. In code, a single icon rotated 180° via CSS is simpler and smoother than swapping icons. Both approaches are valid.

### Dark Mode

Toggle `data-theme="dark"` on `<html>`. All Venus semantic tokens resolve automatically. The `surface/sunken` body zone shifts from light gray to near-black, maintaining visual contrast.

### Controlled vs Uncontrolled

The component is **controlled** — `isExpanded` is a prop, not internal state. The consumer owns the expanded/collapsed state. This enables:

```tsx
// Accordion group — only one open at a time
const [openIndex, setOpenIndex] = useState(0);

{sections.map((section, i) => (
  <SimpleAccordion
    key={i}
    label={section.label}
    isExpanded={openIndex === i}
    onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
  >
    {section.content}
  </SimpleAccordion>
))}
```

---

## 10. Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { SimpleAccordion } from './SimpleAccordion';
import { NavItem } from '../NavItem';
import { PencilIcon, TrashIcon, PlusIcon, FolderIcon } from '@contentstack/icons';

const meta: Meta<typeof SimpleAccordion> = {
  title: 'Layout/SimpleAccordion',
  component: SimpleAccordion,
  tags: ['autodocs'],
  argTypes: {
    state:            { control: 'radio', options: ['default', 'hover', 'focused', 'disabled'] },
    isExpanded:       { control: 'boolean' },
    hasLeadingIcon:   { control: 'boolean' },
    hasHeaderActions: { control: 'boolean' },
    hasFooter:        { control: 'boolean' },
    disabled:         { control: 'boolean' },
    label:            { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof SimpleAccordion>;

// Sample content
const SampleNavItems = () => (
  <>
    <NavItem icon={<FolderIcon />} label="All Entries" />
    <NavItem icon={<FolderIcon />} label="Published" />
    <NavItem icon={<FolderIcon />} label="Drafts" isActive />
    <NavItem icon={<FolderIcon />} label="Archived" />
  </>
);

// 1. Default — expanded, no optional features
export const Default: Story = {
  args: {
    label: 'Content Types',
    isExpanded: true,
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <SimpleAccordion {...args}>
        <SampleNavItems />
      </SimpleAccordion>
    </div>
  ),
};

// 2. Collapsed
export const Collapsed: Story = {
  args: {
    label: 'Content Types',
    isExpanded: false,
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <SimpleAccordion {...args}>
        <SampleNavItems />
      </SimpleAccordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Collapsed state — only the trigger is visible. Caret/down indicates the section can be expanded.',
      },
    },
  },
};

// 3. WithHeaderActions
export const WithHeaderActions: Story = {
  args: {
    label: 'Content Types',
    isExpanded: true,
    hasHeaderActions: true,
    headerAction1Icon: <PencilIcon />,
    headerAction1Label: 'Rename section',
    headerAction2Icon: <TrashIcon />,
    headerAction2Label: 'Delete section',
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <SimpleAccordion {...args} onHeaderAction1={() => alert('Rename')} onHeaderAction2={() => alert('Delete')}>
        <SampleNavItems />
      </SimpleAccordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header actions — two Icon Button Ghost md instances appear in the trigger. Clicking them fires their respective handlers WITHOUT toggling the accordion. stopPropagation is handled internally.',
      },
    },
  },
};

// 4. WithFooter
export const WithFooter: Story = {
  args: {
    label: 'Content Types',
    isExpanded: true,
    hasFooter: true,
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <SimpleAccordion
        {...args}
        footer={
          <div style={{ display: 'flex', gap: 4, padding: '8px 12px' }}>
            <button style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 13 }}>
              <PlusIcon /> Add content type
            </button>
          </div>
        }
      >
        <SampleNavItems />
      </SimpleAccordion>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Footer slot — surface/sunken zone below the body. Use for section-level actions: add item, manage section, etc. Footer is only visible when isExpanded=true.',
      },
    },
  },
};

// 5. WithLeadingIcon
export const WithLeadingIcon: Story = {
  args: {
    label: 'Content Types',
    isExpanded: true,
    hasLeadingIcon: true,
    leadingIcon: <FolderIcon />,
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <SimpleAccordion {...args}>
        <SampleNavItems />
      </SimpleAccordion>
    </div>
  ),
};

// 6. FullFeatured — all props enabled
export const FullFeatured: Story = {
  args: {
    label: 'Content Types',
    isExpanded: true,
    hasLeadingIcon: true,
    leadingIcon: <FolderIcon />,
    hasHeaderActions: true,
    headerAction1Icon: <PencilIcon />,
    headerAction1Label: 'Rename',
    headerAction2Icon: <TrashIcon />,
    headerAction2Label: 'Delete',
    hasFooter: true,
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <SimpleAccordion
        {...args}
        footer={
          <div style={{ padding: '8px 12px' }}>
            <button style={{ fontSize: 13, display: 'flex', gap: 4 }}>
              <PlusIcon /> Add
            </button>
          </div>
        }
      >
        <SampleNavItems />
      </SimpleAccordion>
    </div>
  ),
};

// 7. AllStates
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
      <SimpleAccordion label="Default (expanded)" isExpanded><SampleNavItems /></SimpleAccordion>
      <SimpleAccordion label="Hover (expanded)" state="hover" isExpanded><SampleNavItems /></SimpleAccordion>
      <SimpleAccordion label="Focused (expanded)" state="focused" isExpanded hasFocus><SampleNavItems /></SimpleAccordion>
      <SimpleAccordion label="Disabled (expanded)" disabled isExpanded><SampleNavItems /></SimpleAccordion>
      <SimpleAccordion label="Default (collapsed)" isExpanded={false} />
      <SimpleAccordion label="Disabled (collapsed)" disabled isExpanded={false} />
    </div>
  ),
};

// 8. ControlledGroup — only one open at a time
export const ControlledGroup: Story = {
  render: () => {
    const [openIndex, setOpenIndex] = React.useState(0);
    const sections = [
      { label: 'Content Types', items: ['Article', 'Blog Post', 'Page'] },
      { label: 'Assets', items: ['Images', 'Videos', 'Documents'] },
      { label: 'Users', items: ['Admins', 'Editors', 'Viewers'] },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
        {sections.map((section, i) => (
          <SimpleAccordion
            key={i}
            label={section.label}
            isExpanded={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          >
            {section.items.map(item => (
              <div key={item} style={{ padding: '8px 12px', fontSize: 13 }}>{item}</div>
            ))}
          </SimpleAccordion>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled group — only one accordion open at a time. State is owned by the parent. SimpleAccordion itself is stateless.',
      },
    },
  },
};

// 9. InNavPanel — realistic usage inside NavPanel body slot
export const InNavPanel: Story = {
  render: () => (
    <div style={{ width: 220, background: 'var(--surface-raised)', border: '1px solid var(--border-default)', borderRadius: 4, overflow: 'hidden' }}>
      <SimpleAccordion label="Entries" isExpanded hasLeadingIcon leadingIcon={<FolderIcon />}>
        <NavItem label="All Entries" />
        <NavItem label="Published" />
        <NavItem label="Drafts" isActive />
      </SimpleAccordion>
      <SimpleAccordion label="Assets" isExpanded={false} hasLeadingIcon leadingIcon={<FolderIcon />} />
      <SimpleAccordion label="Users" isExpanded={false} hasLeadingIcon leadingIcon={<FolderIcon />} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SimpleAccordion stacked inside a NavPanel body slot. The most common production usage pattern.',
      },
    },
  },
};

// 10. DarkMode
export const DarkMode: Story = {
  args: {
    label: 'Content Types',
    isExpanded: true,
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <SimpleAccordion {...args}><SampleNavItems /></SimpleAccordion>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
    docs: {
      description: {
        story: 'Dark mode — surface/sunken shifts to near-black, maintaining contrast.',
      },
    },
  },
};
```

---

## 11. Do / Don't

**✅ Do — Own the expanded state in the parent**
SimpleAccordion is controlled. Always wire `isExpanded` and `onToggle`.
```tsx
const [isOpen, setIsOpen] = useState(true);
<SimpleAccordion isExpanded={isOpen} onToggle={setIsOpen} label="Entries">
  {/* content */}
</SimpleAccordion>
```
**❌ Don't — Expect the accordion to manage its own state**
```tsx
<SimpleAccordion label="Entries"> {/* ❌ No isExpanded — always renders as default */}
```

---

**✅ Do — stopPropagation on header actions**
Header action clicks must not bubble up to the trigger's toggle handler.
```tsx
const handleRename = (e: React.MouseEvent) => {
  e.stopPropagation(); // ← required
  // rename logic
};
```
**❌ Don't — Let header action clicks toggle the accordion**
```tsx
const handleRename = () => { /* no stopPropagation */ }; // ❌ toggles accordion
```

---

**✅ Do — Use for structural grouping, not data management**
The accordion groups content — it doesn't sort, filter, or understand it.
```tsx
<SimpleAccordion label="Entries">
  <NavItem label="All Entries" />
  <NavItem label="Drafts" />
</SimpleAccordion>
```
**❌ Don't — Embed complex logic inside the accordion component itself**
The accordion is a slot container. Business logic belongs in the consumer.

---

**✅ Do — Hide footer when collapsed**
Footer is always hidden when `isExpanded=false`, regardless of `hasFooter`.
```tsx
const showFooter = hasFooter && isExpanded; // ← correct
```
**❌ Don't — Show the footer when the accordion is collapsed**
A footer without a body is structurally nonsensical and visually broken.

---

**✅ Do — Provide accessible labels for all header actions**
Every icon button needs an accessible label describing the action.
```tsx
<SimpleAccordion hasHeaderActions headerAction1Label="Rename section" headerAction2Label="Delete section" />
```
**❌ Don't — Leave accessibleLabel empty on header actions**
```tsx
<SimpleAccordion hasHeaderActions headerAction1Label="" /> {/* ❌ Screen reader says nothing */}
```

---

## 12. Related Components

| Component | Relationship | When to use instead |
|---|---|---|
| `Nav/Item` | Child — goes inside the body slot | Use directly (without accordion) when navigation items don't need grouping |
| `NavPanel` | Parent container — accordion lives in its body slot | NavPanel provides the panel chrome; SimpleAccordion provides the section grouping within it |
| `Tabs` | Alternative disclosure pattern | Use Tabs when the user needs to switch between distinct content views, not collapse/hide sections |
| `Section Label` | Alternative grouping element | Use Section Label (atom) for non-collapsible section headers — when collapse behaviour is not needed |
| `Button Tertiary md` | Footer slot content | Standard choice for footer actions: "Add entry", "Manage section" |
| `Icon Button Ghost md` | Header actions slot content | Standard for header-actions: rename (PencilIcon), delete (TrashIcon), configure (GearIcon) |
