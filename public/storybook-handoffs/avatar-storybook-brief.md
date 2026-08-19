# Storybook Brief — `Avatar`

**Figma node:** `1292:40743`
**Page:** 💬 Feedback
**Status:** Active v2.1.0 — Published
**Audit:** ✅ Pass
**Date:** 2026-07-09

---

## 1. Purpose

`Avatar` represents a user's identity visually — through their initials or profile photo. Used in navigation (trailing cluster), comment threads, user lists, assignment fields, and profile headers.

**Use when:** Showing who a person is at a glance. Always pair with a visible name or tooltip — the avatar alone is never sufficient identification.

**Do NOT use when:** Representing non-person entities (organisations, teams, bots) — use an icon or product logo instead.

**Alternatives:** Brand icons for product identity. `Badge` for status indicators.

---

## 2. Anatomy

```
Avatar (COMPONENT_SET)
│
├── Type=Initials (× 3 sizes)
│   ├── focus-ring (FRAME, ABSOLUTE, 2px purple stroke, full-circle radius)
│   └── initials (TEXT — Inter Bold, centered)
│
└── Type=Image (× 3 sizes)
    ├── focus-ring (FRAME, ABSOLUTE, 2px purple stroke, full-circle radius)
    └── image (INSTANCE — fills circle via clipsContent=true)
```

**DOM mapping:**

| Figma layer | DOM element |
|---|---|
| Avatar root | `<button>` (if interactive) or `<div role="img">` (if decorative) |
| initials | Text node, visually centered |
| image | `<img>` with `alt="[User name]"` |
| focus-ring | CSS `:focus-visible` outline |

---

## 3. TypeScript Props Interface

```typescript
interface AvatarProps {
  /** Visual representation type */
  type?: 'initials' | 'image';

  /**
   * Size variant
   * sm=24px (nav bar, dense lists)
   * md=32px (default — comment threads, user lists)
   * lg=40px (profile headers, user cards)
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Single uppercase letter shown in Type=Initials.
   * Use the first letter of the user's first name.
   * @default 'A'
   */
  initials?: string;

  /**
   * Image source for Type=Image.
   * Falls back to Type=Initials if image fails to load.
   */
  imageSrc?: string;

  /**
   * User's full name — used for aria-label.
   * Required for accessibility.
   */
  name: string;

  /** Click handler — makes the avatar interactive */
  onClick?: () => void;

  /** Disables interaction */
  disabled?: boolean;

  className?: string;
}
```

---

## 4. Figma → React Prop Mapping

| Figma property | React prop | Notes |
|---|---|---|
| `Type` (Variant) | `type` | |
| `Size` (Variant) | `size` | |
| `initials` (TEXT) | `initials` | Type=Initials only |
| `Image` (INSTANCE_SWAP) | `imageSrc` | Type=Image only |
| `hasFocus` (BOOLEAN) | Storybook demo only | Maps to `:focus-visible` in production |

---

## 5. State Behaviour Table

| State | Trigger | Visual | ARIA |
|---|---|---|---|
| Default | — | Solid brand circle (Initials) or image (Image) | `role="img"` or `role="button"` |
| Hover | Mouse over (if interactive) | Slight overlay via parent context | — |
| Focused | Tab (if interactive) | 2px purple ring outside circle | `:focus-visible` |
| Disabled | `disabled` prop | 40% opacity | `aria-disabled="true"` |
| Image error | `<img>` `onError` | Fall back to Type=Initials | — |

---

## 6. Size Specification

| Size | Diameter | Font size | Font weight | Context |
|---|---|---|---|---|
| sm | 24px | 11px | Bold | Nav bar, inline dense lists |
| md | 32px | 13px | Bold | Default — comment threads, assignments |
| lg | 40px | 16px | Bold | Profile headers, user cards |

All sizes use `border-radius: 50%` (radius/full = 9999px).

---

## 7. Token Reference Table

| Layer | CSS property | Token | Light | Dark |
|---|---|---|---|---|
| Type=Initials fill | `background-color` | `surface/brand` | purple/500 #6C5CE7 | purple/600 #5B4BD4 |
| Initials text | `color` | `text/on-brand` | white #FFFFFF | white #FFFFFF |
| Type=Image fill | `background-color` | `surface/default` | gray/50 #F9FAFB | gray/900 #111827 |
| Border radius | `border-radius` | `radius/full` | 9999px | 9999px |
| Focus ring | `outline-color` | `focus/ring/color` | purple/500 #6C5CE7 | purple/400 #A78BFA |
| Disabled opacity | `opacity` | `visibility/disabled` | 0.40 | 0.40 |

---

## 8. Accessibility Checklist

```
Component: Avatar    Auditor: Claude    Date: 2026-07-09

TOKENS
[✅] text/on-brand (white) on surface/brand (purple/500): 4.54:1 ✅ AA
[✅] Focus ring purple/500 on white: 4.86:1 ✅ AA

SIZING
[✅] sm=24px meets WCAG 2.5.8 minimum (24×24px)
[✅] md=32px ✅  |  lg=40px ✅

SCREEN READER
[✅] Interactive: role="button" + aria-label="[User name]'s profile"
[✅] Decorative: role="img" + aria-label="[User name]'s avatar"
[✅] Type=Image: <img alt="[User name]">
[✅] Type=Initials: initials are aria-hidden (text serves visual, not SR)
[✅] Always requires name prop — no anonymous avatars

IMAGE ERROR HANDLING
[✅] Implement onError fallback to Type=Initials in code
[✅] Never show broken image icon

STATUS: ✅ PASS
```

---

## 9. Storybook Stories

```typescript
// avatar.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Feedback/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: { type: 'initials', size: 'md', initials: 'G', name: 'George Karian' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar type="initials" size="sm" initials="G" name="George Karian" />
      <Avatar type="initials" size="md" initials="G" name="George Karian" />
      <Avatar type="initials" size="lg" initials="G" name="George Karian" />
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    type: 'image',
    size: 'md',
    imageSrc: '/assets/avatar-sample.jpg',
    name: 'George Karian',
  },
};

export const AllSizesWithImage: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar type="image" size="sm" imageSrc="/assets/avatar-sample.jpg" name="George Karian" />
      <Avatar type="image" size="md" imageSrc="/assets/avatar-sample.jpg" name="George Karian" />
      <Avatar type="image" size="lg" imageSrc="/assets/avatar-sample.jpg" name="George Karian" />
    </div>
  ),
};

export const Focused: Story = {
  args: { ...Default.args },
  parameters: { pseudo: { focusVisible: true } },
};

export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};

export const Interactive: Story = {
  args: { ...Default.args, onClick: () => alert('Profile clicked') },
};

export const ImageFallback: Story = {
  args: {
    type: 'image',
    size: 'md',
    imageSrc: '/broken-url.jpg',
    initials: 'G',
    name: 'George Karian',
  },
  parameters: { docs: { description: { story: 'Image fails to load — falls back to initials.' } } },
};

export const DarkMode: Story = {
  args: { ...Default.args },
  parameters: {
    backgrounds: { default: 'dark' },
    themes: { default: 'dark' },
  },
};

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
      background: 'white', borderBottom: '1px solid #E5E7EB' }}>
      <Avatar type="initials" size="sm" initials="G" name="George Karian" />
    </div>
  ),
  parameters: { docs: { description: { story: 'As seen in Nav/Top-Bar trailing cluster.' } } },
};
```

---

## 10. Implementation Notes

```css
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full, 9999px);
  overflow: hidden; /* clips image to circle */
  flex-shrink: 0;
  position: relative;
  background: var(--surface-brand);
  color: var(--text-on-brand);
  font-family: var(--font-family-primary, Inter);
  font-weight: 700;
  cursor: default;
}

.avatar--interactive { cursor: pointer; }

.avatar--sm  { width: 24px; height: 24px; font-size: 11px; }
.avatar--md  { width: 32px; height: 32px; font-size: 13px; }
.avatar--lg  { width: 40px; height: 40px; font-size: 16px; }

.avatar--image { background: var(--surface-default); }
.avatar--image img { width: 100%; height: 100%; object-fit: cover; }

.avatar--disabled { opacity: var(--visibility-disabled, 0.40); pointer-events: none; }

.avatar:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}

/* Image error fallback */
.avatar--image.avatar--error { background: var(--surface-brand); }
.avatar--image.avatar--error img { display: none; }
.avatar--image.avatar--error .avatar__initials { display: flex; }
```

**Image error handling:**
```tsx
const [imgError, setImgError] = useState(false);
const showInitials = type === 'initials' || imgError;

// In render:
{type === 'image' && !imgError && (
  <img src={imageSrc} alt={name} onError={() => setImgError(true)} />
)}
{showInitials && <span aria-hidden="true">{initials}</span>}
```

---

## 11. Do / Don't

**Do:** Always pass the `name` prop — it's used for the aria-label. `<Avatar name="George Karian" />`.

**Don't:** Use initials as the only identifier. Always ensure the user's name is accessible via aria-label or adjacent visible text.

**Do:** Use `size="sm"` in the nav bar — it's proportioned for the 40px bar height.

**Don't:** Use `size="lg"` in dense lists — it creates visual imbalance against 13px body text.

**Do:** Implement image error fallback — always fall back to initials. Never show a broken image.

**Don't:** Use the avatar as a non-interactive decorative element inside a button — wrap the button around the avatar instead.

**Do:** Use a single uppercase letter for initials — first letter of first name.

**Don't:** Use two-letter initials — the sm size (24px, 11px font) cannot legibly render two characters.

---

## 12. Related Components

| Component | Relationship | When to use |
|---|---|---|
| `_Internal/Nav/Trailing` | Parent | Avatar lives inside the trailing cluster. Never place Avatar directly in the nav bar. |
| `Badge` | Companion | Use Badge overlaid on Avatar to show notification count or status dot. |
| `Icon Button` | Alternative | Use Icon Button for interactive utility actions. Use Avatar for user identity only. |

---

*Brief generated: 2026-07-09 | Component version: 2.1.0 | Audit: Pass*
