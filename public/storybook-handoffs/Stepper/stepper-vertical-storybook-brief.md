<!--
  VENUS 2.1 RF — STORYBOOK BRIEF
  ═══════════════════════════════════════════════════════════════════
  COMPONENT_NAME:        Stepper/Vertical
  REACT_COMPONENT:       StepperVertical
  STORYBOOK_TITLE:       Navigation/StepperVertical
  FIGMA_NODE_ID:         1687:51666
  FIGMA_FILE_KEY:        M6u9MVznfNDO20b0DAC1cu
  SOURCE_PAGE:           🧭 Navigation
  ATOM_NODE_ID:          1689:51842 (_Internal/Stepper/Step)
  CSS_CLASS_PREFIX:      stepper stepper--vertical
  FILE_NAME:             StepperVertical.tsx
  STORY_FILE_NAME:       StepperVertical.stories.tsx
  CSS_FILE_NAME:         StepperVertical.css
  DESIGN_SYSTEM_VERSION: Venus 2.1 RF
  BRIEF_DATE:            2026-07-22
  STATUS:                Active
  DOCUMENTATION_LINK:    https://www.figma.com/design/M6u9MVznfNDO20b0DAC1cu?node-id=1706%3A53362
  ═══════════════════════════════════════════════════════════════════
-->

# ⚠️ INSTRUCTION TO CODING SKILL — READ THIS BEFORE WRITING ANY CODE

**You MUST read the Figma component descriptions before implementing this component.**

1. Open Figma file `M6u9MVznfNDO20b0DAC1cu`
2. Go to node `1687:51666` (Stepper/Vertical) — read the full description in the right panel
3. Go to node `1689:51842` (_Internal/Stepper/Step CSET) — read the full CSET description
4. Read each of the 20 variant descriptions inside the CSET
5. Open the documentation link in the component description (or `1706:53362`) — read all 9 sections

The descriptions contain the complete architecture, all token bindings, all sizing rules, and the TypeScript interfaces. This brief is comprehensive but the Figma descriptions are the live source of truth. If any conflict exists, the Figma description wins.

---

# Stepper/Vertical — Storybook Brief

## Section 1 — Purpose

`StepperVertical` is a multi-step progress indicator that renders steps in a vertical column. Labels sit to the LEFT of the indicator, right-aligned (toward the indicator). The indicator column sits on the RIGHT. A single continuous 1px divider line runs down the indicator column behind all steps.

**Use for:** sidebar settings panels, configuration drawers, onboarding side rails, any context where horizontal space is limited or there are many steps (vertical has no practical step-count ceiling — it scrolls).

**Key differences from StepperHorizontal:**
- Steps stack vertically (column)
- Labels are to the LEFT of indicators (right-aligned text)
- Component has a FIXED width, AUTO height (grows with steps)
- No step-count limit — scrollable
- Minimum useful width: ~160px (below this, truncation is too aggressive)
- Default width: 280px

---

## Section 2 — Anatomy

### Component hierarchy (Figma → DOM)

```
Stepper/Vertical (COMPONENT, node 1687:51666)
  ├── stepper-divider-line       → <div class="stepper__divider" aria-hidden="true" />
  │     ABSOLUTE. CENTER+STRETCH constraints.
  │     1px vertical line. Full component height.
  │     border/default fill (#E5E7EB).
  │     x position = indicator horizontal centre (designer-set, do not reset).
  │     The indicator column is on the RIGHT side of the component.
  │     Line sits behind steps. Steps' white fills cover it where they overlap.
  │
  └── steps (SLOT frame)        → <ol class="stepper__steps" role="list">
        VERTICAL auto-layout. FILL width. AUTO height.
        counterAxisAlignItems = CENTER.
        itemSpacing = 0.
        Z-index: 1 (in front of divider line).
```

### Step atom — Vertical orientation specifics

The atom `_Internal/Stepper/Step` with `Orientation=Vertical` has a fundamentally different layout from the horizontal variant:

```
Root (HORIZONTAL layout, AUTO width, FIXED 80px height)
  ├── step-active-card (FRAME)
  │     Active state: surface/raised + border/brand 1.5px OUTSIDE + radius/8
  │     FULL width of the step (FILL). FILL height.
  │     Layout: HORIZONTAL, padding space/12 V space/16 H, gap space/8
  │
  │   ├── step-label-group (FRAME, VERTICAL, FILL width, gap space/2)
  │   │     textAlignHorizontal = RIGHT    ← key difference from horizontal
  │   │     counterAxisAlignItems = MAX    ← right-aligns group within parent
  │   │     Sits on the LEFT side.
  │   │     ├── step-title (TEXT, FILL width, TRUNCATE+ENDING)
  │   │     └── step-description (TEXT, FILL width, TRUNCATE+ENDING, visible=false default)
  │   │
  │   └── step-indicator-wrap (FRAME, NONE layout, 32×32px)
  │         Sits on the RIGHT side.
  │         Contains: step-indicator + optional step-notif-dot
  │
  └── step-focus-ring (FRAME, ABSOLUTE)
        x=-2, y=-2. Width=root+4, Height=root+4.
        STRETCH constraints. focus/ring/color stroke. 2px OUTSIDE.
        radius/2. visible=false. Wired to hasFocus.
```

**Critical layout note:** In the vertical orientation, the layout order is `label GROUP → indicator` (left to right). This is the OPPOSITE of what most horizontal steppers do. The rationale: the divider line runs down the indicator column (RIGHT side). Labels extend to the LEFT, away from the line. This creates a clean column-based visual — divider line, indicator dots, label text extending left.

---

## Section 3 — TypeScript Props Interface

```typescript
// StepperVertical.types.ts

/** Step state — maps to Figma variant property: State */
export type StepState = 'default' | 'active' | 'completed' | 'disabled' | 'error';

/** Step indicator type — maps to Figma variant property: Type */
export type StepType = 'icon' | 'counter';

/** Individual step data */
export interface StepData {
  /** Step label — single line, truncates with ellipsis. Maps to Figma text: title */
  title: string;
  /** Optional secondary description. Single line, truncates. Maps to Figma: description */
  description?: string;
  /** Step state. Maps to Figma variant: State */
  state?: StepState;
  /** Step number (counter type only). Maps to Figma text: stepNumber */
  stepNumber?: number;
  /** Full accessible label. Format: "Step N: [title] ([state])".
   *  Maps to Figma text: accessibleLabel */
  accessibleLabel?: string;
  /** Callback when step is clicked (non-linear mode only) */
  onClick?: () => void;
}

export interface StepperVerticalProps {
  // ─── CONTENT ──────────────────────────────────────────────────────
  /** Array of step definitions. No practical maximum — component scrolls.
   *  Maps to Figma SLOT: steps. Min: 2. */
  steps: StepData[];

  // ─── INDICATOR TYPE ───────────────────────────────────────────────
  /** Indicator style: icon or counter. Applied uniformly.
   *  Maps to Figma variant: Type. Default: 'counter' */
  type?: StepType;

  // ─── BEHAVIOUR ───────────────────────────────────────────────────
  /** When false (linear, default): only completed + active steps are interactive.
   *  When true: all steps independently clickable. Maps to: isNonLinear */
  isNonLinear?: boolean;

  /** 0-based index of the active step. Steps before = completed. Steps after = default.
   *  Override per-step via steps[n].state. */
  currentStep?: number;

  // ─── CALLBACKS ───────────────────────────────────────────────────
  onStepClick?: (index: number) => void;

  // ─── LAYOUT ──────────────────────────────────────────────────────
  /** Component width. Default: 280px (`17.5rem`). Min recommended: 160px.
   *  Height is always AUTO — grows with the number of steps. */
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}
```

---

## Section 4 — Figma → React Prop Mapping

| Figma concept | Figma type | React prop | Notes |
|---|---|---|---|
| `steps` SLOT | SLOT | `steps: StepData[]` | Vertical step instances in column |
| `isNonLinear` | BOOLEAN (false) | `isNonLinear?: boolean` | All steps clickable when true |
| `Type=Icon` / `Type=Counter` | VARIANT | `type?: StepType` | Applied to all steps |
| `State=*` | VARIANT | `steps[n].state` (+ `currentStep`) | Derive from currentStep or override |
| `title` | TEXT | `steps[n].title` | Single line, truncates RIGHT |
| `description` | TEXT | `steps[n].description` | Optional; hidden when absent |
| `hasDescription` | BOOLEAN (true) | auto-derived | True when description string provided |
| `stepNumber` | TEXT | `steps[n].stepNumber` | Counter type only; auto-increments |
| `accessibleLabel` | TEXT | `steps[n].accessibleLabel` | Auto-generated if not provided |
| `hasFocus` | BOOLEAN (false) | → CSS `:focus-visible` | Never a real prop |
| `stepper-divider-line` | ABSOLUTE frame | → CSS `::before` pseudo | Vertical 1px line |
| `Orientation=Vertical` | VARIANT (atom) | Auto-selected | Consumer never sets this |

---

## Section 5 — State Behaviour

### Step states — identical to Horizontal with one key difference

All states are the same as `StepperHorizontal` (see that brief for contrast ratios and detailed state descriptions). The only structural difference is the layout:

**Default/Completed/Error/Disabled:**
- Label to the LEFT (right-aligned text)
- Indicator to the RIGHT
- Both vertically centred within the 80px fixed step height

**Active state:**
- Full-width active card covers the step
- Label to the LEFT of indicator inside the card
- Label text: right-aligned (consistent with non-active)
- Active card: `border/brand` 1.5px OUTSIDE, `surface/raised`, `radius/8`
- The divider line runs behind the card (white fill covers it — gap-stopped)

### Text truncation — vertical specific

In the vertical orientation, labels truncate in a RIGHT-to-LEFT direction because text is right-aligned. The ellipsis appears at the START of the visual line (left side) while the right edge (near the indicator) remains visible.

**Decision rationale:** Labels in the vertical stepper read right-to-left toward the indicator. Truncating at the start (far from the indicator) preserves the most critical characters — the ones closest to the indicator that establish step identity. This is the opposite of horizontal truncation and was an explicit design decision made 2026-07-22.

Wait — actually the `textTruncation=ENDING` setting means ellipsis is at the END of the text string. Since text is right-aligned and fills from right to left, "ENDING" truncation means the leftmost characters are cut. The last characters (rightmost) remain visible. This keeps the most recently typed or most specific part of the label visible near the indicator.

In CSS: `text-overflow: ellipsis` on a `text-align: right` element → ellipsis appears at the LEFT edge, readable text at the RIGHT edge, near the indicator. This is intentional.

---

## Section 6 — Size Specification

| Element | Dimension | Notes |
|---|---|---|
| Component width | 280px (`17.5rem`) default | FIXED. Resizable. Min: 160px. |
| Component height | AUTO | Grows with number of steps |
| Step height | 80px (`5rem`) FIXED | Each step is always exactly 80px |
| Step indicator | 32×32px (`2rem`) | Right side of step |
| Active card padding V | `space/12` = 12px (`0.75rem`) | Same as horizontal |
| Active card padding H | `space/16` = 16px (`1rem`) | Same as horizontal |
| Label-to-indicator gap | `space/8` = 8px (`0.5rem`) | Gap between label and indicator within active card |
| Label title-to-description gap | `space/2` = 2px (`0.125rem`) | Within label group |
| Focus ring offset | 2px | Outside step boundary |
| Focus ring stroke | 2px | `focus/ring/color` |
| Divider line | 1px width, auto height | Vertical, tracks indicator column |
| Minimum useful width | ~160px | Below this, text truncates to 2–3 chars |

**rem vs px guidance (vertical-specific):**
- Step height: `height: 5rem` — scales with browser text size
- Component width: `width: 17.5rem` — scales (or override with explicit px in fixed-width contexts)
- Indicator size: `2rem` — always rem
- Divider line width: `1px` — always px (sub-pixel rendering)
- All padding/gap: `rem` (matches horizontal brief)

---

## Section 7 — Token Reference

All tokens identical to Stepper/Horizontal. The only difference is layout-related — no new tokens.

### Complete token list

| Layer | Property | Token | Resolved (Light) |
|---|---|---|---|
| step-indicator (Default) | Fill | `surface/raised` | #FFFFFF |
| step-indicator (Default) | Stroke | `border/default` | #E5E7EB, 1px |
| step-indicator (Active) | Fill | `surface/brand/inactive` | #EDE9FE |
| step-indicator (Active) | Stroke | `border/brand` | #A78BFA, 1.5px |
| step-indicator (Completed) | Fill | `action/primary` | #6C5CE7 |
| step-active-card | Fill | `surface/raised` | #FFFFFF |
| step-active-card | Stroke | `border/brand` | #A78BFA, 1.5px OUTSIDE |
| step-active-card | Radius | `radius/8` | 8px (`0.5rem`) |
| stepper-divider-line | Fill | `border/default` | #E5E7EB, 1px |
| step-focus-ring | Stroke | `focus/ring/color` | #6C5CE7, 2px OUTSIDE |
| step-focus-ring | Radius | `radius/2` | 2px (`0.125rem`) |
| step-title (Default/Completed/Error) | Text fill | `text/default` | #111827 |
| step-title (Active) | Text fill | `text/brand` | #6C5CE7 |
| step-title (Disabled) | Text fill | `text/disabled` | #9CA3AF |
| step-description | Text fill | `text/subtle` | #6B7280 |
| step-description (Error) | Text fill | `text/destructive` | #CD0200 |
| Root (Disabled) | Opacity | `visibility/disabled` | 0.40 |
| step-title | Text style | Body/SM / Body/SM Semi Bold | 13px Regular / Semi Bold |
| step-description | Text style | Body/XXS | 11px Medium |
| step-number | Text style | Label/LG | 13px Medium |

### CSS Custom Properties (vertical-specific additions)

```css
.stepper--vertical {
  --stepper-step-height: 5rem;          /* 80px FIXED per step */
  --stepper-width:       17.5rem;       /* 280px default */
  --stepper-min-width:   10rem;         /* 160px absolute minimum */

  /* Divider line — vertical, on right side */
  --stepper-divider-width: 1px;
  /* x position = component-width - indicator-half = designer-set */
  /* Do not hardcode this offset — it shifts as the component width changes */
}
```

---

## Section 8 — Accessibility

### ARIA structure (vertical — same semantic pattern as horizontal)

```html
<nav aria-label="Progress" class="stepper stepper--vertical">
  <ol class="stepper__steps" role="list">

    <li class="stepper__step stepper__step--completed" role="listitem">
      <button
        class="stepper__step-button"
        aria-label="Step 1: Configure source (completed)"
        type="button"
      >
        <span class="stepper__label-group">
          <span class="stepper__step-title">Configure source</span>
          <span class="stepper__step-description">Connect to data</span>
        </span>
        <span class="stepper__indicator" aria-hidden="true">
          <!-- checkmark icon -->
        </span>
      </button>
    </li>

    <li class="stepper__step stepper__step--active" role="listitem" aria-current="step">
      <div
        class="stepper__step-content stepper__card"
        aria-label="Step 2: Map fields (current)"
      >
        <!-- label LEFT, indicator RIGHT -->
      </div>
    </li>

  </ol>
</nav>
```

**Column order in DOM:** Label group comes BEFORE indicator in the DOM (left to right). This matches the visual order. Screen readers announce in DOM order: label → indicator (indicator is aria-hidden). This is correct — the indicator is decorative; the text label carries the meaning.

### Keyboard map (same as horizontal)

| Key | Action |
|---|---|
| `Tab` | Move focus into stepper |
| `ArrowDown` | Move focus to next step (vertical variant) |
| `ArrowUp` | Move focus to previous step |
| `ArrowRight` | Same as ArrowDown (optional enhancement) |
| `ArrowLeft` | Same as ArrowUp (optional enhancement) |
| `Home` | Focus first step |
| `End` | Focus last step |
| `Enter` / `Space` | Activate focused step (non-linear mode only) |
| `Escape` | Release focus |

**Note:** Vertical steppers should prefer `ArrowDown`/`ArrowUp` over `ArrowRight`/`ArrowLeft` since the orientation is vertical. Support both for flexibility.

### Contrast ratios

All identical to Stepper/Horizontal (see that brief, Section 8). No new color pairs in vertical orientation.

### Touch target

Step height: 80px (`5rem`) × step width: 100% of container — well above the 24×24px minimum.

---

## Section 9 — Storybook Stories

```typescript
// StepperVertical.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { StepperVertical } from './StepperVertical';

const meta: Meta<typeof StepperVertical> = {
  title: 'Navigation/StepperVertical',
  component: StepperVertical,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A vertical multi-step progress indicator. Fixed width, auto height. Labels on the left (right-aligned), indicators on the right. Use in sidebars, drawers, and narrow containers.',
      },
    },
  },
  argTypes: {
    type:        { control: 'radio',   options: ['counter', 'icon'] },
    isNonLinear: { control: 'boolean' },
    currentStep: { control: 'number' },
    width:       { control: 'number' },
    onStepClick: { action: 'stepClicked' },
  },
};
export default meta;
type Story = StoryObj<typeof StepperVertical>;

const defaultSteps = [
  { title: 'Configure source', description: 'Connect to data' },
  { title: 'Map fields',       description: 'Match columns' },
  { title: 'Review',           description: 'Check everything' },
  { title: 'Publish',          description: 'Go live' },
];

export const Default: Story = {
  args: { steps: defaultSteps, type: 'counter', currentStep: 1 },
};

export const IconType: Story = {
  args: { steps: defaultSteps, type: 'icon', currentStep: 1 },
};

export const AllStates: Story = {
  args: {
    steps: [
      { title: 'Completed',  state: 'completed' },
      { title: 'Active',     state: 'active' },
      { title: 'Default',    state: 'default' },
      { title: 'Error',      description: 'Validation failed', state: 'error' },
      { title: 'Disabled',   state: 'disabled' },
    ],
    type: 'icon',
  },
};

export const ManySteps: Story = {
  // No practical step limit — tests scrolling
  args: {
    steps: Array.from({ length: 10 }, (_, i) => ({
      title: `Step ${i + 1}`,
      description: i < 3 ? 'Complete' : i === 3 ? 'In progress' : 'Pending',
      state: (i < 3 ? 'completed' : i === 3 ? 'active' : 'default') as any,
    })),
    type: 'counter',
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical stepper has no step-count limit. Component height grows with content. Use in scrollable containers.',
      },
    },
  },
};

export const LongLabels: Story = {
  args: {
    steps: [
      { title: 'Configure data source connection',        description: 'Connect to external data provider' },
      { title: 'Map and transform all field definitions', description: 'Match columns to destination schema' },
      { title: 'Review all entries before submitting',    description: 'Check every row carefully' },
      { title: 'Publish and deploy to production env',   description: 'Something went wrong', state: 'error' as const },
    ],
    type: 'counter',
    currentStep: 1,
    width: 280,
  },
  parameters: {
    docs: {
      description: {
        story: 'Long labels truncate with ellipsis at the LEFT edge (text is right-aligned). The rightmost characters — closest to the indicator — remain visible.',
      },
    },
  },
};

export const NarrowContainer: Story = {
  args: {
    steps: defaultSteps,
    type: 'counter',
    currentStep: 1,
    width: 200,
  },
  parameters: {
    docs: {
      description: {
        story: '200px width — minimum practical width. Below 160px, truncation is too aggressive. Labels still display correctly; longer titles truncate.',
      },
    },
  },
};

export const NonLinear: Story = {
  args: {
    steps: defaultSteps,
    type: 'counter',
    currentStep: 1,
    isNonLinear: true,
    onStepClick: (i) => console.log('Clicked step', i),
  },
};

export const InSidebar: Story = {
  // Real-world context: vertical stepper inside a 280px sidebar panel
  decorators: [
    (Story) => (
      <div style={{
        width: '280px',
        height: '600px',
        background: 'var(--surface-raised, #fff)',
        border: '1px solid var(--border-default, #E5E7EB)',
        borderRadius: '8px',
        padding: '24px 0',
        overflow: 'auto',
      }}>
        <Story />
      </div>
    ),
  ],
  args: { steps: defaultSteps, type: 'counter', currentStep: 1 },
  parameters: {
    docs: {
      description: {
        story: 'Vertical stepper in a 280px sidebar. This is the primary use case.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    steps: [
      { title: 'Configure', state: 'completed' },
      { title: 'Map fields', state: 'completed' },
      { title: 'Review', state: 'active' },
      { title: 'Publish', description: 'API connection failed', state: 'error' },
    ],
    type: 'icon',
  },
};

export const Focused: Story = {
  args: { steps: defaultSteps, type: 'counter', currentStep: 1 },
  play: async ({ canvasElement }) => {
    const steps = canvasElement.querySelectorAll('[role="listitem"]');
    (steps[1] as HTMLElement)?.focus();
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus ring: 2px `focus/ring/color` (#6C5CE7), 2px offset, radius/2 corners. Wraps the full step row.',
      },
    },
  },
};

export const DarkMode: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  args: { steps: defaultSteps, type: 'counter', currentStep: 1 },
};
```

---

## Section 10 — Implementation Notes

### 1. Divider line — vertical, right side, dynamic position (critical)

The `stepper-divider-line` in Figma is ABSOLUTE with `CENTER+STRETCH` constraints. `CENTER` horizontal means the line tracks the horizontal centre of the parent frame as it resizes. `STRETCH` vertical means it fills the full height.

**But the indicator is NOT at the geometric centre.** The vertical stepper places the indicator on the RIGHT side of each step. The indicator centre from the left edge = `component-width - 16` (right edge minus half of 32px indicator).

**In Figma:** The designer manually positioned the divider line at the correct x to thread through indicator centres. `CENTER` constraint means "keep this distance from the horizontal centre" — which, as the component resizes, keeps the ratio but not necessarily the pixel value.

**In CSS:** Use `right: calc(var(--stepper-indicator-size) / 2)` to position relative to the right edge:

```css
.stepper--vertical {
  position: relative;
}

.stepper--vertical .stepper__divider {
  position: absolute;
  right: calc(var(--stepper-indicator-size) / 2); /* 1rem = 16px from right */
  transform: translateX(50%);                      /* centre the 1px line */
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--stepper-divider-color);
  pointer-events: none;
  z-index: 0;
}
```

This approach adapts correctly as the container width changes — the divider always tracks the indicator centre regardless of how wide the component is.

### 2. Label LEFT, indicator RIGHT — layout structure

This is the opposite of most stepper implementations. In every HTML tutorial, indicators come first. In Venus vertical stepper, labels come first (in both DOM and visual order).

**Why:** The divider line runs down the RIGHT side. The indicator dots sit on the RIGHT. Labels extend LEFT, away from the line. This creates a clean two-column layout — labels on the left, connector + dots on the right — that is highly legible at any container width.

```css
.stepper--vertical .stepper__step-content {
  display: flex;
  flex-direction: row;        /* label LEFT, indicator RIGHT */
  align-items: center;
  height: var(--stepper-step-height); /* 5rem = 80px */
  width: 100%;
  position: relative;
  z-index: 1;
}

.stepper--vertical .stepper__label-group {
  flex: 1;                    /* FILL — takes all remaining space left of indicator */
  min-width: 0;               /* enables truncation */
  text-align: right;          /* right-aligned text */
  padding-right: var(--space-8); /* 0.5rem gap before indicator */
}

.stepper--vertical .stepper__indicator {
  flex-shrink: 0;
  width: var(--stepper-indicator-size);  /* 2rem = 32px */
  height: var(--stepper-indicator-size);
}
```

### 3. Text truncation — right-aligned (vertical-specific behaviour)

```css
.stepper--vertical .stepper__step-title,
.stepper--vertical .stepper__step-description {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  direction: ltr; /* left-to-right reading direction preserved */
}
```

**The ellipsis appears at the LEFT edge** of the text — the far end from the indicator. The rightmost characters (closest to the indicator) remain visible. This is intentional: the characters that establish step identity are nearest the indicator, and they're preserved.

**Example:** "Configure data source connection" in a narrow column shows: "…source connection" — the end of the string, nearest the indicator, is visible.

### 4. Active state — full-width card vs active card in horizontal

In the horizontal stepper, the active card is INLINE (HUG width). In the vertical stepper, the active card FILLS THE FULL STEP WIDTH. This is because the vertical layout has a fixed width and the card should fill it entirely to create a clear visual banding effect for the current step.

```css
.stepper--vertical .stepper__step--active .stepper__card {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;                              /* FILL — full step width */
  height: var(--stepper-step-height);       /* 5rem = 80px */
  padding: var(--space-12) var(--space-16); /* 0.75rem 1rem */
  background: var(--surface-raised);
  border: 1.5px solid var(--border-brand);
  border-radius: var(--radius-8);           /* 0.5rem */
  box-sizing: border-box;
}
```

The divider line runs behind the card. The card's white fill covers it — the gap-stopped effect.

### 5. Focus ring — wraps full step row

The focus ring in the vertical variant wraps the entire 80px step row, not just the indicator:

```css
.stepper--vertical .stepper__step:focus-visible .stepper__focus-ring,
.stepper--vertical .stepper__step-button:focus-visible {
  outline: 2px solid var(--stepper-focus-color);  /* focus/ring/color */
  outline-offset: 2px;
  border-radius: var(--stepper-focus-radius);     /* radius/2 */
}
```

### 6. Animation — vertical (same duration as horizontal, different direction)

```css
/* Step becoming active: card slides in from the right */
.stepper--vertical .stepper__step--active .stepper__card {
  animation: stepActivateVertical 200ms ease forwards;
}

@keyframes stepActivateVertical {
  from { opacity: 0; transform: translateX(4px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* State transitions */
.stepper--vertical .stepper__step-indicator {
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    opacity 200ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .stepper--vertical .stepper__step-indicator,
  .stepper--vertical .stepper__card {
    transition: none;
    animation: none;
  }
}
```

**Slide direction rationale:** The active card in the vertical stepper slides in from the RIGHT (toward the indicator) because the label reads left-to-right toward the indicator. The animation reinforces the direction of reading.

### 7. Container width behaviour

The vertical stepper has a FIXED width — `17.5rem` (280px) by default. Unlike the horizontal stepper which fills its parent, the vertical stepper is a self-contained panel element.

```css
.stepper--vertical {
  width: var(--stepper-width, 17.5rem); /* 280px default */
  min-width: var(--stepper-min-width, 10rem); /* 160px minimum */
  height: auto; /* grows with steps */
}
```

If placed in a container narrower than `min-width`, it should overflow or scroll — do NOT compress below the minimum (truncation becomes unusable).

### 8. rem vs px decisions (vertical-specific)

| Property | Value | Unit | Rationale |
|---|---|---|---|
| Step height | 80px | `5rem` | Scales with browser text size |
| Component width | 280px | `17.5rem` | Scales in text-size-adjusted contexts |
| Min width | 160px | `10rem` | Structural minimum — scales |
| Indicator size | 32px | `2rem` | Typography-adjacent |
| Divider width | 1px | `px` | Sub-pixel rendering — always px |
| Divider offset from right | 16px | calc(`var(--stepper-indicator-size) / 2`) | Dynamic, derived from indicator |
| Padding V/H | 12px/16px | `0.75rem`/`1rem` | Typography-adjacent |
| All gap values | 2px/8px | `0.125rem`/`0.5rem` | Typography-adjacent |

---

## Section 11 — Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use for sidebar/drawer step flows | Force into a horizontal space that's too narrow |
| Keep step titles short (1–4 words right-aligned read well) | Write long titles — they truncate at the left edge, losing context |
| Use when there are more than 6 steps | Use horizontal when there are more than 6 steps |
| Use `right: calc(indicator-size / 2)` for divider positioning | Hardcode the divider x position — it must track as width changes |
| Let component height grow naturally (AUTO) | Set a fixed height that clips the steps |
| Place in a scrollable container when many steps expected | Clip the overflow with hidden — steps will be inaccessible |
| Right-align labels (they read toward the indicator) | Left-align labels — this breaks the visual column structure |
| Use `flex: 1; min-width: 0` on label group | Forget `min-width: 0` — truncation will not activate |
| Apply `opacity: 0.40` to the full step root for disabled | Change individual colors for disabled state |
| Test at 200px width to confirm truncation works | Assume truncation works without testing narrow containers |

---

## Section 12 — Related Components

| Component | When to use instead |
|---|---|
| `Stepper/Horizontal` | Top-of-page wizard flows, modal headers, 2–6 steps |
| `Tab Bar` | Non-sequential sections user switches between |
| `Accordion` | Expandable content sections in a sidebar (not step-based) |
| `Progress Bar` | Continuous progress, not discrete steps |
| `Left Hand Side Bar` | Navigation between sections, not task steps |

---

## Appendix — Decisions Made During Build (2026-07-22)

These decisions were explicitly made during the Venus 2.1 RF Stepper build. Future changes require design review.

### Label position: LEFT of indicator (not right)

**Decision:** Labels on the left, indicators on the right.
**Rationale:** The divider line runs down the right side (indicator column). Placing labels on the left creates a clean column structure — labels on one side, dots on the other. It also means labels can expand freely to the left without interfering with the indicator zone.
**Alternatives considered:** Labels to the right of indicator (conventional), labels below indicator (matches horizontal but wastes vertical space).
**Accepted trade-off:** Non-conventional layout that requires explicit documentation. Worth it for the cleaner column structure in narrow sidebar contexts.

### Text alignment: RIGHT-aligned within label group

**Decision:** All step labels are right-aligned (`textAlignHorizontal=RIGHT`).
**Rationale:** Labels extend from the indicator toward the left. Right-alignment means the last character of the label sits closest to the indicator — visually anchoring label to dot. This creates a strong visual connection between label and indicator even at large distances.
**Trade-off:** Truncation causes ellipsis at the LEFT edge. Less conventional for Western left-to-right reading. Accepted because the rightmost characters (which establish step identity for long titles) remain visible near the indicator.

### Divider line: designer-maintained position

**Decision:** The divider line x position (threading through indicator centres) is manually set by the designer and is NOT reset programmatically.
**Rationale:** The correct x position depends on the visual judgement of where the indicator centres actually sit in the rendered component — sub-pixel offsets accumulate across auto-layout frames. Manual positioning gives the designer full control over the visual threading effect.
**Engineering implication:** In CSS, use `right: calc(indicator-size / 2)` to achieve the same dynamic positioning without a hardcoded value.

### Active card: FILL width (not HUG like horizontal)

**Decision:** Active card fills the full step width in vertical orientation.
**Rationale:** In a fixed-width panel, a full-width active card creates clear visual banding for the current step. The user's eye can immediately identify the active step even when scrolling. A HUG card (like horizontal) would be lost in a narrow column.
**Horizontal difference:** The horizontal active card is HUG because the label space is limited and the card should be proportional. The vertical active card is FILL because the full panel width is available and the banding effect is more important.

### Focus ring: wraps full 80px step row

**Decision:** Focus ring covers the entire step row (all 80px height), not just the indicator.
**Rationale:** The full step row is interactive (entire row is the clickable target). The focus indicator must match the interactive target size. Wrapping only the indicator would misrepresent the touch/click target to keyboard users.

### Step height: 80px fixed (vs 96px for horizontal)

**Decision:** Vertical steps are 80px tall, horizontal steps are 96px.
**Rationale:** Vertical steps stack in a column — taller steps in a sidebar take significant vertical space, especially with many steps. 80px gives sufficient touch target height while allowing more steps to be visible without scrolling. Horizontal steps are 96px because the full-width layout has more room and the label-below-indicator layout needs the height for the label group.

### Text style for step-title non-Active: `text/default` (not `text/subtle`)

**Decision:** Step titles in Default, Completed, and Error states use `text/default` (#111827) not `text/subtle`.
**Rationale:** Initial build used `text/subtle` (#6B7280) for non-active titles, creating insufficient visual hierarchy — the title and description were the same visual weight (both gray). Changing to `text/default` (near-black) creates a clear title/subtitle hierarchy: strong title, subtle description.
**Date changed:** 2026-07-22, during the component audit phase of this session.
