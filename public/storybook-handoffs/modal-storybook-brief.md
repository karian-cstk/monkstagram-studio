# Modal — Storybook Engineering Brief
**Venus 2.1 RF | Component: Modal | Node: 1210:67773**
**Status: Active v1.0.0 | Page: 💬 Feedback | Last updated: 2026-07-06**

---

## 1. Purpose

`Modal` is a blocking overlay dialog. It appears above all page content, traps focus inside itself, and requires explicit user action before the user can return to the page. Use it for decisions, confirmations, forms, and content selection that must be resolved before work continues.

**Use when:**
- A destructive or irreversible action needs explicit confirmation (delete, publish, overwrite)
- A short form needs to be completed before proceeding (invite, rename, configure)
- The user needs to select from a list or table before continuing (select content type, assign user)
- A task is self-contained enough to be completed without leaving the current page context

**Do not use when:**
- The interaction is non-blocking — use Toast or Inline Alert instead
- The content is too complex or lengthy for a single dialog — use a dedicated page instead
- The user is mid-flow and the interruption would cause disorientation
- You need to show a notification — use Toast

**Alternatives:**
- `Toast` — transient, non-blocking, no user action required
- `Inline Alert` — contextual to a specific section, persistent, layout-bound
- Dedicated page — when content is too complex for a dialog

---

## 2. Anatomy

```
[modal-root] ← COMPONENT, VERTICAL auto-layout, FIXED width (default 560px), HUG height
  ├── [modal-header] ← HORIZONTAL auto-layout, pad t:24 b:20 l:24 r:24, gap:12
  │     ├── [modal-header-content] ← VERTICAL auto-layout, FILL width, gap:4
  │     │     ├── [modal-title]    ← TEXT, Heading/SM 16px Semi Bold, text/default
  │     │     └── [modal-subtitle] ← TEXT, Body/SM 13px Regular, text/subtle
  │     │                            hidden by default (hasSubtitle=false)
  │     └── [modal-close] ← _Internal/Icon-Action instance, Close-Noborder icon
  │                          FIXED size, top-aligned, controlled by hasDismiss
  ├── [modal-body] ← VERTICAL auto-layout, pad b:24 l:24 r:24, clipsContent=false
  │     └── [body] ← SLOT frame, dashed border, clipsContent=false
  │                   accepts any content — forms, tables, messages, lists
  ├── [modal-separator] ← Separator component, FILL width, 1px border/default
  │                        controlled by hasFooter — hides with footer
  └── [modal-footer] ← HORIZONTAL auto-layout, pad t:16 b:16 l:24 r:24, gap:8
                        primaryAxisAlignItems=MAX (right-aligned)
        ├── [modal-action-cancel]    ← Button/Ghost/md instance
        ├── [modal-action-secondary] ← Button/Secondary/md instance (hidden by default)
        └── [modal-action-primary]   ← Button/Primary/md instance
```

| Layer | DOM equivalent | Role |
|---|---|---|
| `modal-root` | `<div role="dialog">` | Root container. White surface, radius/8, Elevation/Level 4 shadow. Fluid width — drag to resize. |
| `modal-header` | `<header>` | Title zone. No background band — spacing only separates it from body. |
| `modal-header-content` | `<div>` | Title + optional subtitle stacked vertically, gap:4. |
| `modal-title` | `<h2>` | Required. Heading/SM 16px Semi Bold. |
| `modal-subtitle` | `<p>` | Optional. Body/SM 13px Regular, text/subtle. Describes intent or adds context. |
| `modal-close` | `<button aria-label="Close">` | `_Internal/Icon-Action` with `Close-Noborder` icon. Top-aligned to title. Controlled by `hasDismiss`. |
| `modal-body` | `<div>` | Scroll container. `clipsContent=false` — slot content with OUTSIDE strokes renders correctly. |
| `body` | `<div>` slot | **The slot.** Freeform content zone. Dashed border when empty. Accepts any component or content. |
| `modal-separator` | `<hr>` | Separator component. 1px `border/default`. Hides with footer via `hasFooter`. |
| `modal-footer` | `<footer>` | Action row. Right-aligned. Cancel → Secondary (optional) → Primary. |
| `modal-action-cancel` | `<button>` | Always leftmost. Ghost style. Negative action. |
| `modal-action-secondary` | `<button>` | Middle. Secondary style. Optional second action. Hidden by default. |
| `modal-action-primary` | `<button>` | Always rightmost. Primary style. Confirming action. |

---

## 3. The Slot — How It Works

### What the slot is

The `body` frame is a **Figma native SLOT property**. It is a freeform container that accepts any content a designer places inside it — without detaching the Modal component. This is the fundamental difference between Modal and every other overlay pattern: Modal owns the chrome (title, close, footer), and the slot owns the content.

```
Modal (component)
  ├── modal-header     ← Modal owns this always
  ├── modal-body
  │     └── [body]    ← YOU fill this with anything
  ├── modal-separator  ← Modal owns this always
  └── modal-footer     ← Modal owns this always
```

### How to use it in Figma

1. Place a Modal instance on your canvas
2. Double-click the instance to enter it
3. Click the dashed `body` frame
4. Drag any component instance into it, or create content directly inside it
5. The Modal height grows automatically to fit the content

### Three canonical slot compositions

The following three examples represent the full range of Modal usage across Contentstack. Every real modal in the product is a variation of one of these three patterns.

---

### SLOT EXAMPLE 1 — Message Modal (Confirmation / Destructive)

**When to use:** The user is about to take an irreversible action. The slot carries only a message — no form, no table. The smallest and most focused modal pattern.

**Figma composition:**
```
Modal instance (resize to 480px wide)
  hasTitle=true, title="Delete entry"
  hasSubtitle=false
  hasFooter=true
  cancelLabel="Cancel"
  actionLabel="Delete"

  [body slot] contains:
    └── Text node (Body/MD Regular, text/default)
        "You are about to permanently delete this entry.
         This action will move the entry to the trash immediately."
```

**React implementation:**
```tsx
<Modal
  title="Delete entry"
  onClose={handleClose}
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>Cancel</Button>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    </>
  }
>
  <p>
    You are about to permanently delete this entry.
    This action will move the entry to the trash immediately.
  </p>
</Modal>
```

**Key decisions:**
- Width: 480px — smallest recommended width, appropriate for short messages
- No subtitle — the message itself provides all context
- Primary action is destructive (`variant="destructive"`) — red filled button, not purple
- Cancel is always left, Delete is always right (Rule 11)
- No secondary action — binary choice only

---

### SLOT EXAMPLE 2 — Form Modal (Data Entry)

**When to use:** The user needs to complete a short form before proceeding. The slot holds form fields. The default and most common modal pattern.

**Figma composition:**
```
Modal instance (560px wide — default)
  hasTitle=true, title="Invite team member"
  hasSubtitle=true, subtitle="Add a new member to your workspace."
  hasFooter=true
  cancelLabel="Cancel"
  actionLabel="Send invite"

  [body slot] contains:
    └── VERTICAL auto-layout frame (gap:16, FILL width)
          ├── Input instance (Size=lg, label="Email address",
          │   placeholder="colleague@company.com")
          └── Select instance (Size=lg, label="Role")
```

**React implementation:**
```tsx
<Modal
  title="Invite team member"
  subtitle="Add a new member to your workspace. They'll receive an email invitation."
  onClose={handleClose}
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>Cancel</Button>
      <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
        Send invite
      </Button>
    </>
  }
>
  <form onSubmit={handleSubmit}>
    <FormField label="Email address">
      <Input
        type="email"
        placeholder="colleague@company.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
    </FormField>
    <FormField label="Role">
      <Select
        value={role}
        onChange={setRole}
        options={[
          { value: 'editor', label: 'Editor' },
          { value: 'viewer', label: 'Viewer' },
          { value: 'admin', label: 'Admin' },
        ]}
      />
    </FormField>
  </form>
</Modal>
```

**Key decisions:**
- Width: 560px — default width, appropriate for forms up to ~4 fields
- Subtitle adds context without cluttering the title — use when the title alone is ambiguous
- Primary action disabled until form is valid — never show a broken submit
- Three actions not needed — Cancel + Send invite is sufficient
- Body padding (24px) + form field internal padding creates correct visual breathing room

---

### SLOT EXAMPLE 3 — Table Modal (Content Selection)

**When to use:** The user needs to pick from a list or table before proceeding. The slot holds a Search Input + Data Table. The largest and most content-rich modal pattern.

**Figma composition:**
```
Modal instance (resize to 720px wide)
  hasTitle=true, title="Select content type"
  hasSubtitle=true, subtitle="29 content types available. Select one to continue."
  hasFooter=true
  hasAction2=false
  cancelLabel="Cancel"
  actionLabel="Proceed"

  [body slot] contains:
    └── VERTICAL auto-layout frame (gap:12, FILL width)
          ├── Search Input instance (Size=default, FILL width)
          └── Table/Data-Table-v2 instance (Density=Compact, FILL width)
                showHeader=false
                showFilterBar=false
                showPagination=false
```

**React implementation:**
```tsx
<Modal
  title="Select content type"
  subtitle={`${contentTypes.length} content types available. Select one to continue.`}
  onClose={handleClose}
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>Cancel</Button>
      <Button
        variant="primary"
        onClick={handleProceed}
        disabled={!selectedType}
      >
        Proceed
      </Button>
    </>
  }
>
  <SearchInput
    placeholder="Search content types"
    value={search}
    onChange={setSearch}
  />
  <DataTable
    density="compact"
    showHeader={false}
    showFilterBar={false}
    showPagination={false}
    columns={[
      { key: 'title', label: 'Title', sortable: true },
      { key: 'modifiedAt', label: 'Modified' },
      { key: 'description', label: 'Description' },
    ]}
    data={filteredTypes}
    selectedRow={selectedType}
    onRowSelect={setSelectedType}
  />
</Modal>
```

**Key decisions:**
- Width: 720px — largest recommended width, needed for readable table columns
- `clipsContent=false` on `modal-body` and `body` slot — required for table's OUTSIDE stroke to render correctly. Never set `overflow: hidden` on the modal body in CSS.
- Table has `showHeader`, `showFilterBar`, `showPagination` all false — the slot composition provides its own search, and the table is embedded not standalone
- Primary action disabled until a row is selected
- `isScrollable` not needed here — the table handles its own scrolling internally

### Critical implementation rule — clipsContent

```css
/* CORRECT */
.modal-body {
  overflow: visible; /* NOT hidden — table borders will be clipped */
}

/* WRONG */
.modal-body {
  overflow: hidden; /* Clips OUTSIDE strokes on any bordered component in the slot */
}
```

The Figma component has `clipsContent=false` on both `modal-body` and the `body` slot for exactly this reason. Mirror this in CSS.

---

## 4. TypeScript Props Interface

```typescript
export interface ModalProps {
  /** Modal heading — always required. Heading/SM 16px Semi Bold. */
  title: string;

  /**
   * Optional subtitle below the title. Body/SM Regular, text/subtle.
   * Use when the title alone does not provide sufficient context.
   * Default: not shown.
   */
  subtitle?: string;

  /**
   * Modal body content — the slot.
   * Accepts any React node: text, forms, tables, lists, or composed components.
   * The modal height grows to fit the content automatically.
   */
  children: React.ReactNode;

  /**
   * Called when the user closes the modal — via the dismiss button,
   * Escape key, or scrim click.
   */
  onClose: () => void;

  /**
   * Show or hide the dismiss (×) button in the top-right corner.
   * Default: true. Set false only for mandatory confirmations with no escape.
   */
  hasDismiss?: boolean;

  /**
   * Footer action buttons.
   * Always pass Cancel + Primary at minimum.
   * Optionally pass a secondary action in the middle.
   * RULE: negative action left, positive action right. Always.
   */
  footer?: React.ReactNode;

  /**
   * Hide the footer entirely (separator + actions).
   * Use only for read-only content modals with no actions.
   * Default: true (footer shown).
   */
  hasFooter?: boolean;

  /**
   * Width of the modal in pixels.
   * Recommended values: 480 (confirmation), 560 (form), 720 (content/table).
   * The component is fluid — any width is valid.
   * Default: 560.
   */
  width?: number;

  /**
   * When true, the modal body scrolls when content exceeds the modal height.
   * Use for long forms or tall tables. Recommended max-heights:
   *   480px wide → 320px body, 560px wide → 400px body, 720px wide → 480px body
   * Default: false.
   */
  isScrollable?: boolean;

  /** Additional CSS class names */
  className?: string;
}
```

---

## 5. Figma → React Prop Mapping

| Figma Property | Type | React Prop | Notes |
|---|---|---|---|
| `title` | TEXT | `title` | Required |
| `hasSubtitle` | BOOLEAN | Presence of `subtitle` prop | `subtitle` undefined → subtitle hidden |
| `subtitle` | TEXT | `subtitle` | Optional |
| `hasDismiss` | BOOLEAN | `hasDismiss` | Default true |
| `hasFooter` | BOOLEAN | `hasFooter` | Default true. Also hides separator. |
| `hasAction2` | BOOLEAN | Presence of middle button in `footer` | Middle button is optional slot content |
| `hasSplitAction` | BOOLEAN | Swap primary Button for Split Action Button | Rare — document use case when needed |
| `isScrollable` | BOOLEAN | `isScrollable` | Adds max-height + overflow-y scroll to body |
| `cancelLabel` | TEXT | Text child of cancel Button | |
| `actionLabel` | TEXT | Text child of primary Button | |
| `action2Label` | TEXT | Text child of secondary Button | |
| `body` | SLOT | `children` | The modal body. Any React content. |

---

## 6. State Behaviour

| State | Trigger | Visual | ARIA |
|---|---|---|---|
| Open | Programmatic | Modal renders with scrim. Focus moves to first interactive element. | `aria-modal="true"`, `role="dialog"` announced |
| Dismiss via X | Click close button | `onClose()` called | Focus returns to trigger element |
| Dismiss via Escape | Keydown Escape | `onClose()` called | Focus returns to trigger element |
| Dismiss via scrim | Click outside modal | `onClose()` called (unless `hasDismiss=false`) | Focus returns to trigger element |
| Primary action | Click confirm button | `onConfirm()` called, modal closes | — |
| Scrollable body | `isScrollable=true` + content overflow | Body scrolls, header + footer stay fixed | `aria-label` on scrollable region |

---

## 7. Size Specification

| Width | Use case | Body max-height (isScrollable) |
|---|---|---|
| 480px | Confirmation, destructive action, short message | 320px |
| 560px | Form (default), settings, invite, rename | 400px |
| 720px | Content selection, embedded table, rich content | 480px |

| Property | Value | Token |
|---|---|---|
| Corner radius | 8px | `radius/8` |
| Shadow | Elevation/Level 4 — Modal | Effect style |
| Header padding | t:24 b:20 l:24 r:24 | `space/24`, `space/20` |
| Header gap | 12px | `space/12` |
| Title/subtitle gap | 4px | `space/4` |
| Body padding | b:24 l:24 r:24 | `space/24` |
| Slot padding | t:32 b:32 l:16 r:16 | `space/32`, `space/16` |
| Footer padding | t:16 b:16 l:24 r:24 | `space/16`, `space/24` |
| Footer gap | 8px | `space/8` |
| Separator | 1px | `border/default` |
| Body fill | White | `surface/overlay` |

---

## 8. Token Reference

| Layer | CSS Property | Token | Notes |
|---|---|---|---|
| `modal-root` | `background` | `surface/overlay` | White in Light, elevated surface in Dark |
| `modal-root` | `border-radius` | `radius/8` | API limitation on COMPONENT node — raw value 8 correct |
| `modal-root` | `box-shadow` | Elevation/Level 4 — Modal | Effect style |
| `modal-title` | `color` | `text/default` | Heading/SM 16px Semi Bold |
| `modal-subtitle` | `color` | `text/subtle` | Body/SM 13px Regular |
| `modal-separator` | `border-color` | `border/default` | 1px horizontal rule |
| `body` slot | `border-color` | `border/default` | Dashed, 1px — visual affordance for empty slot |

---

## 9. Accessibility

```html
<!-- Modal root -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-subtitle"
  tabindex="-1"
>
  <header>
    <h2 id="modal-title">Delete entry</h2>
    <p id="modal-subtitle">This action cannot be undone.</p>
    <button aria-label="Close dialog">×</button>
  </header>
  <div class="modal-body">
    <!-- slot content -->
  </div>
  <footer>
    <button>Cancel</button>
    <button>Delete</button>
  </footer>
</div>

<!-- Scrim -->
<div aria-hidden="true" class="modal-scrim"></div>
```

### Focus trap (required in code)

```typescript
// On modal open
useEffect(() => {
  const focusable = modalRef.current.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0] as HTMLElement;
  const last = focusable[focusable.length - 1] as HTMLElement;

  first?.focus();

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  document.addEventListener('keydown', handleTab);
  document.addEventListener('keydown', handleEscape);
  return () => {
    document.removeEventListener('keydown', handleTab);
    document.removeEventListener('keydown', handleEscape);
  };
}, []);
```

### Scroll lock

```typescript
useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = ''; };
}, []);
```

### Contrast
- `text/default` on `surface/overlay` — exceeds 15:1 — ✅ AAA
- `text/subtle` on `surface/overlay` — exceeds 7:1 — ✅ AAA

### Touch targets
- Close button: `_Internal/Icon-Action` md = 32×32px ✅
- Action buttons: Button/md = 32px height ✅

---

## 10. Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { DataTable } from '../DataTable';
import { SearchInput } from '../SearchInput';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Modal>;

const ModalFooter = ({ onClose, onConfirm, confirmLabel = 'Confirm', confirmDisabled = false }) => (
  <>
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="primary" onClick={onConfirm} disabled={confirmDisabled}>{confirmLabel}</Button>
  </>
);

// 1. Message modal — confirmation
export const MessageModal: Story = {
  render: () => (
    <Modal
      title="Delete entry"
      onClose={() => {}}
      footer={<ModalFooter onClose={() => {}} onConfirm={() => {}} confirmLabel="Delete" />}
      width={480}
    >
      <p>You are about to permanently delete this entry. This action will move the entry to the trash immediately.</p>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Confirmation modal — 480px, message only, no subtitle. Primary action is destructive. Cancel left, Delete right.',
      },
    },
  },
};

// 2. Form modal
export const FormModal: Story = {
  render: () => (
    <Modal
      title="Invite team member"
      subtitle="Add a new member to your workspace. They'll receive an email invitation."
      onClose={() => {}}
      footer={<ModalFooter onClose={() => {}} onConfirm={() => {}} confirmLabel="Send invite" />}
      width={560}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Email address" placeholder="colleague@company.com" size="lg" />
        <Select label="Role" size="lg" options={['Editor', 'Viewer', 'Admin']} />
      </div>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Form modal — 560px (default width), with subtitle. Body slot contains Input + Select. Primary disabled until form is valid.',
      },
    },
  },
};

// 3. Table modal — content selection
export const TableModal: Story = {
  render: () => (
    <Modal
      title="Select content type"
      subtitle="29 content types available. Select one to continue."
      onClose={() => {}}
      footer={<ModalFooter onClose={() => {}} onConfirm={() => {}} confirmLabel="Proceed" confirmDisabled />}
      width={720}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SearchInput placeholder="Search content types" />
        <DataTable
          density="compact"
          showHeader={false}
          showFilterBar={false}
          showPagination={false}
          columns={[
            { key: 'title', label: 'Title', sortable: true },
            { key: 'modifiedAt', label: 'Modified' },
            { key: 'description', label: 'Description' },
          ]}
          data={[
            { title: 'RTE embed 2.0 demo', modifiedAt: 'Jun 18 2026', description: '—' },
            { title: 'RTe embeds', modifiedAt: 'Jun 16 2026', description: '—' },
            { title: 'Tabs Test - Ashwini', modifiedAt: 'May 21 2026', description: '—' },
            { title: 'URL formatting demo', modifiedAt: 'May 18 2026', description: '—' },
          ]}
        />
      </div>
    </Modal>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Table modal — 720px, with subtitle. Body slot contains SearchInput + DataTable (no header/filter/pagination). Primary disabled until row selected.',
      },
    },
  },
};

// 4. No footer
export const NoFooter: Story = {
  args: {
    title: 'Keyboard shortcuts',
    hasFooter: false,
    children: <p>Content with no action required.</p>,
    onClose: () => {},
  },
};

// 5. No dismiss
export const NoDismiss: Story = {
  args: {
    title: 'Session expired',
    hasDismiss: false,
    children: <p>Your session has expired. Please log in again to continue.</p>,
    onClose: () => {},
    footer: <Button variant="primary" onClick={() => {}}>Log in</Button>,
  },
};

// 6. Scrollable body
export const ScrollableBody: Story = {
  args: {
    title: 'Terms of service',
    subtitle: 'Please read before continuing.',
    isScrollable: true,
    onClose: () => {},
    children: (
      <div style={{ height: 600 }}>
        <p>Long content that requires scrolling...</p>
      </div>
    ),
    footer: <ModalFooter onClose={() => {}} onConfirm={() => {}} confirmLabel="Accept" />,
  },
};

// 7. Three actions
export const ThreeActions: Story = {
  args: {
    title: 'Save changes',
    subtitle: 'You have unsaved changes.',
    children: <p>Would you like to save your changes before leaving?</p>,
    onClose: () => {},
    footer: (
      <>
        <Button variant="ghost" onClick={() => {}}>Cancel</Button>
        <Button variant="secondary" onClick={() => {}}>Discard</Button>
        <Button variant="primary" onClick={() => {}}>Save</Button>
      </>
    ),
  },
};
```

---

## 11. Implementation Notes

### CSS

```css
.modal-scrim {
  position: fixed;
  inset: 0;
  background: var(--overlay-scrim);   /* overlay/scrim token */
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-root {
  position: relative;
  background: var(--surface-overlay);
  border-radius: var(--radius-8);
  box-shadow: var(--elevation-level-4-modal);
  width: 560px;                       /* default — override via width prop */
  max-width: calc(100vw - 48px);      /* safe area on small viewports */
  display: flex;
  flex-direction: column;
  overflow: visible;                  /* NEVER hidden — clips slot content borders */
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12);
  padding: var(--space-24) var(--space-24) var(--space-20);
}

.modal-header-content { flex: 1; display: flex; flex-direction: column; gap: var(--space-4); }

.modal-title   { font-size: var(--font-size-16); font-weight: var(--font-weight-semibold); color: var(--text-default); }
.modal-subtitle { font-size: var(--font-size-13); font-weight: var(--font-weight-regular); color: var(--text-subtle); }

.modal-body {
  padding: 0 var(--space-24) var(--space-24);
  overflow: visible;                  /* NEVER hidden */
}

.modal-body--scrollable {
  overflow-y: auto;
  max-height: 400px;                  /* adjust per width */
}

.modal-separator { height: 1px; background: var(--border-default); }

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-8);
  padding: var(--space-16) var(--space-24);
}
```

### z-index

```css
:root {
  --z-modal-scrim: 400;
  --z-modal:       401;
  --z-toast:       500;    /* Toast sits above modal */
}
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .modal-root { animation: none; transition: none; }
  .modal-scrim { animation: none; transition: none; }
}
```

---

## 12. Do / Don't

**✅ Do — Use the slot for any content**
```tsx
<Modal title="Configure settings" onClose={handleClose} footer={...}>
  <SettingsForm />   {/* Any component — the slot accepts it */}
</Modal>
```
**❌ Don't — Create separate modal variants for different content types**
There is one Modal component. Content type is determined by what goes in the slot, not by the component variant.

---

**✅ Do — Set overflow: visible on modal-body**
```css
.modal-body { overflow: visible; }
```
**❌ Don't — Set overflow: hidden on modal-body**
Any component using an OUTSIDE stroke (e.g. Data Table) placed in the slot will have its border clipped. This is the single most common Modal implementation mistake.

---

**✅ Do — Negative action left, positive right (Rule 11)**
```tsx
<>
  <Button variant="ghost">Cancel</Button>
  <Button variant="primary">Confirm</Button>
</>
```
**❌ Don't — Put the primary action on the left**
Violates Rule 11. Cancel → Confirm, always.

---

**✅ Do — Disable primary until user has made a valid selection or input**
```tsx
<Button variant="primary" disabled={!isValid}>Proceed</Button>
```
**❌ Don't — Show an enabled primary with no valid input to submit**
An enabled button that does nothing when clicked is more confusing than a clearly disabled one.

---

**✅ Do — Choose width based on content type**
- Message only → 480px
- Form → 560px
- Table / rich content → 720px

**❌ Don't — Use 720px for a simple confirmation**
Over-sized modals feel like pages. They signal more complexity than exists.

---

## 13. Related Components

| Component | Relationship | When to use instead |
|---|---|---|
| `Toast` | Non-blocking equivalent | When no user action is required — system notifications, confirmations |
| `Inline Alert` | Persistent, layout-bound | When the feedback is tied to a specific section of the page |
| `Table/Data-Table-v2` | Common slot content | For content selection patterns (see Slot Example 3) |
| `Input`, `Select` | Common slot content | For form patterns (see Slot Example 2) |
| `_Internal/Icon-Action` | Used internally | The dismiss button — do not replace with a custom implementation |
| `Separator` | Used internally | The footer divider — always the Separator component instance |
| `Button/Ghost/md` | Used internally | Cancel action — always Ghost, always leftmost |
| `Button/Secondary/md` | Used internally | Optional middle action |
| `Button/Primary/md` | Used internally | Confirm action — always Primary, always rightmost |

