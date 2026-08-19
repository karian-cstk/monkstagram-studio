# Venus 2.1 RF — CSS Token Brief
**Design system:** Venus 2.1 RF
**Source:** Figma file `M6u9MVznfNDO20b0DAC1cu`
**Total tokens:** 437 across 5 collections
**Last updated:** 2026-05-28
**Status:** Phase 1 gate passed. Venus_Components partially built (Toggle Switch).

---

## Architecture — Four Layers

Tokens are structured in a strict four-layer hierarchy. Each layer may only reference the layer directly below it. Never skip layers.

```
Layer 1 — Primitives       Raw values. Never applied to components directly.
    ↓ aliases
Layer 2 — Semantics        Intent tokens. Theme-switched via data-theme.
    ↓ aliases
Layer 3 — Typography       Type composites. Breakpoint-switched via class/media.
Layer 3 — Icons            Icon colour modes. Component-level context sizing.
    ↓ aliases
Layer 4 — Components       Component-specific tokens. Venus_Components — Toggle Switch built.
```

**CSS implementation strategy:**

```
_Primitives     →   :root { --primitive-*: <raw value> }       Single block, no theme
Venus_Semantics →   :root[data-theme="light"] / [data-theme="dark"]
Venus_Typography →  Fixed tokens in :root, responsive tokens in breakpoint overrides
Venus_Icons     →   :root { --icon-* }  +  component-level mode overrides
Venus_Components →  :root { --toggle-* }  component geometry + semantic aliases
```

---

## Naming Convention — Figma → CSS

Figma token path: `gray/900` → CSS variable: `--color-gray-900`
Figma token path: `action/primary` → CSS variable: `--action-primary`
Figma token path: `surface/default` → CSS variable: `--surface-default`
Figma token path: `icon/size/md` → CSS variable: `--icon-size-md`
Figma token path: `toggle/track/height` → CSS variable: `--toggle-track-height`

**Rules:**
- Forward slashes `/` → hyphens `-`
- No prefix on primitives other than category (`--color-`, `--space-`, `--radius-`, etc.)
- No prefix on semantics — they are the design language (`--surface-default`, not `--semantic-surface-default`)
- No `var(--primitive-*)` anywhere in component CSS — always reference semantic tokens

---

## Layer 1 — Primitives

> These are raw values. They belong only in `:root`. Components and semantics reference these via CSS variable chains — never as hardcoded hex values.

```css
/* ============================================================
   VENUS 2.1 RF — PRIMITIVE TOKENS
   Source: _Primitives collection (Figma)
   Mode: Single (Default)
   Usage: Referenced by semantic tokens only. Never in components.
   ============================================================ */

:root {

  /* ── COLOR / GRAY ─────────────────────────────────────────── */
  --color-gray-0:    #FFFFFF;   /* Pure white */
  --color-gray-25:   #FCFCFD;   /* Near-white (retained for compat) */
  --color-gray-50:   #F9FAFB;   /* Light surface */
  --color-gray-100:  #F3F4F6;   /* Content area bg */
  --color-gray-200:  #E5E7EB;   /* Subtle border */
  --color-gray-300:  #D1D5DB;   /* Default border */
  --color-gray-400:  #9CA3AF;   /* Placeholder, disabled */
  --color-gray-500:  #6B7280;   /* Secondary text */
  --color-gray-550:  #565972;   /* Purple-tinted mid (retained) */
  --color-gray-600:  #4B5563;   /* Tertiary text */
  --color-gray-700:  #374151;   /* Strong body text */
  --color-gray-750:  #2D3748;   /* Dark surface label (retained) */
  --color-gray-800:  #1F2937;   /* Dark mode surface */
  --color-gray-900:  #111827;   /* Dark mode background */
  --color-gray-950:  #030712;   /* Near-black */
  --color-gray-1000: #000000;   /* Pure black */

  /* ── COLOR / PURPLE ───────────────────────────────────────── */
  --color-purple-50:  #F9F8FF;
  --color-purple-100: #EDE9FE;
  --color-purple-200: #DDD6FE;
  --color-purple-300: #C4B5FD;
  --color-purple-350: #B6AEF3;  /* Tulip Purple — focus ring light mode */
  --color-purple-400: #9F93FA;  /* Dark mode primary action */
  --color-purple-500: #6C5CE7;  /* PRIMARY BRAND */
  --color-purple-600: #5D50BF;  /* Primary hover */
  --color-purple-700: #4C42A0;  /* Primary active/pressed */
  --color-purple-800: #3B3380;
  --color-purple-900: #2D2666;
  --color-purple-950: #1A1428;
  /* Named non-scale stop — browser-standard visited link colour.
     Outside the Venus brand purple ramp intentionally.
     Aliased by text/link/visited Light mode only. Do not modify. */
  --color-purple-visited: #551A8B;

  /* ── COLOR / RED ──────────────────────────────────────────── */
  /* Material Design 2 canonical red. No orange, no magenta. */
  --color-red-50:  #FFEBEE;
  --color-red-100: #FFCDD2;
  --color-red-200: #EF9A9A;
  --color-red-300: #E57373;
  --color-red-400: #EF5350;
  --color-red-500: #F44336;
  --color-red-600: #E53935;   /* Destructive default */
  --color-red-700: #D32F2F;   /* Destructive hover */
  --color-red-800: #C62828;   /* Destructive pressed — blood red */
  --color-red-900: #B71C1C;
  --color-red-950: #7F0000;

  /* ── COLOR / GREEN ────────────────────────────────────────── */
  --color-green-50:  #F5FFFC;
  --color-green-100: #D1FAF0;
  --color-green-200: #A7F3E1;
  --color-green-300: #6EE7CC;
  --color-green-400: #34D399;
  --color-green-500: #2EC5B6;
  --color-green-600: #17A898;
  --color-green-700: #148B7E;
  --color-green-800: #0E6B61;
  --color-green-900: #107B72;
  --color-green-950: #064E45;

  /* ── COLOR / YELLOW ───────────────────────────────────────── */
  --color-yellow-50:  #FFF8EB;
  --color-yellow-100: #FEF3C7;
  --color-yellow-200: #FDE68A;
  --color-yellow-300: #FCD34D;
  --color-yellow-400: #FBBF24;
  --color-yellow-450: #FFAE0A;  /* Warning icon light mode (retained) */
  --color-yellow-500: #F8B80E;
  --color-yellow-600: #D49A0B;
  --color-yellow-700: #A87A08;
  --color-yellow-800: #7D5B05;
  --color-yellow-900: #6B4A07;
  --color-yellow-950: #3D2900;

  /* ── COLOR / BLUE ─────────────────────────────────────────── */
  --color-blue-50:  #E2F7FB;
  --color-blue-100: #BFEBF5;
  --color-blue-200: #93D8EE;
  --color-blue-300: #60C0E4;
  --color-blue-400: #60A5FA;
  --color-blue-500: #2A8FDD;
  --color-blue-600: #1E73B8;
  --color-blue-700: #165993;
  --color-blue-800: #0E4070;
  --color-blue-900: #083D7D;
  --color-blue-950: #041E3F;

  /* ── COLOR / EXTENDED PALETTE ─────────────────────────────── */
  /* Cyan — data viz, tagging */
  --color-cyan-50:  #ECFEFF;
  --color-cyan-500: #06B6D4;
  --color-cyan-950: #083344;

  /* Teal */
  --color-teal-50:  #F0FDFA;
  --color-teal-500: #14B8A6;
  --color-teal-950: #042F2E;

  /* Pink */
  --color-pink-50:  #FDF2F8;
  --color-pink-500: #EC4899;
  --color-pink-950: #500724;

  /* Orange */
  --color-orange-50:  #FFF7ED;
  --color-orange-500: #F97316;
  --color-orange-950: #431407;

  /* ── COLOR / SPECIAL ──────────────────────────────────────── */
  --color-transparent:            transparent;
  --color-ai-magic-border-step1:  #6C5CE7;   /* = purple/500 */
  --color-ai-magic-border-step2:  #9F93FA;   /* = purple/400 */
  --color-ai-magic-border-step3:  #C4B5FD;   /* = purple/300 */

  /* ── COLOR / PRE-BAKED ALPHA ──────────────────────────────── */
  /* These bake colour + opacity into a single value.            */
  /* Use only for fills — not for border-color.                  */
  --color-gray-900-a8:   rgba(17, 24, 39, 0.08);    /* Hover tint */
  --color-gray-900-a12:  rgba(17, 24, 39, 0.12);    /* Selected tint */
  --color-gray-900-a16:  rgba(17, 24, 39, 0.16);    /* Active tint */
  --color-gray-900-a32:  rgba(17, 24, 39, 0.32);    /* Subtle scrim */
  --color-gray-900-a64:  rgba(17, 24, 39, 0.64);    /* Default scrim */
  --color-gray-900-a80:  rgba(17, 24, 39, 0.80);    /* Heavy scrim */
  --color-gray-950-a48:  rgba(3,   7,  18, 0.48);   /* Subtle scrim dark */
  --color-gray-950-a80:  rgba(3,   7,  18, 0.80);   /* Default scrim dark */
  --color-gray-950-a92:  rgba(3,   7,  18, 0.92);   /* Heavy scrim dark */
  --color-purple-500-a8:  rgba(108, 92, 231, 0.08); /* Ghost hover tint */
  --color-purple-500-a12: rgba(108, 92, 231, 0.12); /* Selected brand tint */
  --color-purple-500-a16: rgba(108, 92, 231, 0.16); /* Active brand tint */

  /* ── SPACING ──────────────────────────────────────────────── */
  --space-0:   0px;
  --space-2:   2px;
  --space-4:   4px;
  --space-8:   8px;
  --space-12:  12px;
  --space-16:  16px;
  --space-20:  20px;
  --space-24:  24px;
  --space-28:  28px;
  --space-32:  32px;
  --space-40:  40px;
  --space-48:  48px;
  --space-56:  56px;
  --space-60:  60px;
  --space-64:  64px;
  --space-80:  80px;
  --space-96:  96px;
  --space-128: 128px;

  /* ── BORDER RADIUS ────────────────────────────────────────── */
  --radius-0:    0px;
  --radius-2:    2px;
  --radius-4:    4px;
  --radius-6:    6px;
  --radius-8:    8px;
  --radius-12:   12px;
  --radius-16:   16px;
  --radius-full: 9999px;

  /* ── BORDER WIDTH ─────────────────────────────────────────── */
  --border-width-0: 0px;
  --border-width-1: 1px;
  --border-width-2: 2px;
  --border-width-4: 4px;

  /* ── OPACITY ──────────────────────────────────────────────── */
  /* As decimal fractions for CSS — Figma primitives store as 0–100 integers */
  --opacity-0:   0;
  --opacity-4:   0.04;
  --opacity-8:   0.08;
  --opacity-12:  0.12;
  --opacity-16:  0.16;
  --opacity-20:  0.20;
  --opacity-24:  0.24;
  --opacity-32:  0.32;   /* visibility/divider, visibility/loading */
  --opacity-40:  0.40;   /* visibility/disabled */
  --opacity-48:  0.48;   /* visibility/placeholder */
  --opacity-60:  0.60;   /* visibility/inactive */
  --opacity-64:  0.64;
  --opacity-80:  0.80;
  --opacity-92:  0.92;
  --opacity-100: 1;

  /* ── FONT FAMILY ──────────────────────────────────────────── */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono:    'JetBrains Mono', 'Fira Code', Consolas, monospace;

  /* ── FONT SIZE ────────────────────────────────────────────── */
  --font-size-11: 11px;
  --font-size-12: 12px;
  --font-size-13: 13px;
  --font-size-14: 14px;
  --font-size-16: 16px;
  --font-size-18: 18px;
  --font-size-20: 20px;
  --font-size-24: 24px;
  --font-size-28: 28px;
  --font-size-32: 32px;
  --font-size-40: 40px;
  --font-size-48: 48px;

  /* ── FONT WEIGHT ──────────────────────────────────────────── */
  --font-weight-regular:  400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;

  /* ── LINE HEIGHT ──────────────────────────────────────────── */
  --line-height-100: 1;
  --line-height-110: 1.1;
  --line-height-115: 1.15;
  --line-height-120: 1.2;
  --line-height-125: 1.25;
  --line-height-130: 1.3;
  --line-height-140: 1.4;
  --line-height-150: 1.5;
  --line-height-160: 1.6;

  /* ── LETTER SPACING ───────────────────────────────────────── */
  --letter-spacing-neg2: -0.02em;
  --letter-spacing-neg1: -0.01em;
  --letter-spacing-0:     0em;
  --letter-spacing-1:     0.01em;
  --letter-spacing-2:     0.02em;

  /* ── ELEVATION / SHADOW PRIMITIVES ───────────────────────── */
  --elevation-offset-x-0:  0px;
  --elevation-offset-y-0:  0px;
  --elevation-offset-y-1:  1px;
  --elevation-offset-y-2:  2px;
  --elevation-offset-y-4:  4px;
  --elevation-offset-y-8:  8px;
  --elevation-offset-y-16: 16px;
  --elevation-offset-y-24: 24px;
  --elevation-blur-1:  2px;
  --elevation-blur-2:  4px;
  --elevation-blur-3:  10px;
  --elevation-blur-4:  20px;
  --elevation-blur-5:  40px;
  --elevation-spread-0:  0px;
  --elevation-spread-1: -1px;
  --elevation-spread-2:  1px;
  --elevation-spread-4:  4px;
  --shadow-opacity-ambient:      0.08;
  --shadow-opacity-key:          0.12;
  --shadow-opacity-heavy:        0.20;
  --shadow-opacity-ai-glow:      0.40;
  --shadow-opacity-magic-border: 0.60;

  /* ── Z-INDEX ──────────────────────────────────────────────── */
  --z-index-below:    -1;
  --z-index-base:      0;
  --z-index-raised:    1;
  --z-index-dropdown:  100;
  --z-index-sticky:    200;
  --z-index-overlay:   300;
  --z-index-modal:     400;
  --z-index-toast:     500;
  --z-index-tooltip:   600;
  --z-index-max:       999;

  /* ── DURATION ─────────────────────────────────────────────── */
  --duration-instant:    0ms;
  --duration-fast:       100ms;
  --duration-base:       200ms;
  --duration-moderate:   300ms;
  --duration-slow:       400ms;
  --duration-deliberate: 600ms;

  /* ── EASING ───────────────────────────────────────────────── */
  --easing-linear:  linear;
  --easing-in:      cubic-bezier(0.4, 0, 1, 1);
  --easing-out:     cubic-bezier(0, 0, 0.2, 1);
  --easing-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
  --easing-spring:  cubic-bezier(0.175, 0.885, 0.32, 1.275);

} /* end :root primitives */
```

---

## Layer 2 — Semantic Tokens

> These are the tokens components actually use. Light and Dark values are separated via `data-theme`. All values alias primitive tokens — no raw hex values anywhere in this layer.

```css
/* ============================================================
   VENUS 2.1 RF — SEMANTIC TOKENS
   Source: Venus_Semantics collection (Figma)
   Total: 92 tokens (76 color + 16 float/visibility/layout)
   Usage: Apply these to components. Never use primitives directly.
   ============================================================ */

/* ── LIGHT MODE ─────────────────────────────────────────────── */
:root,
:root[data-theme="light"] {

  /* SURFACE */
  --surface-default:               var(--color-gray-50);      /* Page background */
  --surface-raised:                var(--color-gray-0);       /* Cards, panels */
  --surface-overlay:               var(--color-gray-0);       /* Modals, popovers */
  --surface-sunken:                var(--color-gray-100);     /* Inputs, sidebars */
  --surface-brand:                 var(--color-purple-500);   /* Brand surface */
  --surface-selected:              var(--color-purple-50);    /* Selected rows */
  --surface-disabled:              var(--color-gray-100);     /* Non-interactive */
  --surface-inverse:               var(--color-gray-900);     /* Inverted surface */
  --surface-interactive-default:   var(--color-gray-0);
  --surface-interactive-hover:     var(--color-gray-100);
  --surface-interactive-active:    var(--color-gray-200);
  --surface-interactive-destructive:       var(--color-red-600);
  --surface-interactive-destructive-hover: var(--color-red-700);

  /* SURFACE / CONTROL
     Used by Toggle Switch, Checkbox, Radio — the track/background of control elements */
  --surface-control-inactive:       var(--color-gray-500);   /* Track off state — #6B7280 */
  --surface-control-inactive-hover: var(--color-gray-600);   /* Track off hover — #4B5563 */
  --surface-control-thumb:          var(--color-gray-0);     /* Thumb/knob — always white */

  /* TEXT */
  --text-default:      var(--color-gray-900);
  --text-subtle:       var(--color-gray-600);
  --text-subtle-hover: var(--color-purple-500);  /* Subtle text on hover — brand purple */
  --text-muted:        var(--color-gray-500);
  --text-placeholder:  var(--color-gray-400);
  --text-disabled:     var(--color-gray-400);
  --text-inverse:      var(--color-gray-0);
  --text-on-brand:     var(--color-gray-0);      /* Always white — mode-invariant */
  --text-brand:        var(--color-purple-600);
  --text-link:         var(--color-purple-500);  /* #6C5CE7 */
  --text-link-hover:   var(--color-purple-600);  /* #5D50BF */
  --text-link-active:  var(--color-purple-700);  /* #4C42A0 — CSS :active */
  --text-link-visited: var(--color-purple-visited); /* #551A8B — WHATWG standard, CSS :visited */
  --text-destructive:  var(--color-red-700);
  --text-success:      var(--color-green-900);
  --text-warning:      var(--color-yellow-900);
  --text-info:         var(--color-blue-900);
  --text-label:        var(--color-gray-700);

  /* BORDER */
  --border-default:     var(--color-gray-200);
  --border-subtle:      var(--color-gray-100);
  --border-strong:      var(--color-gray-400);
  --border-inverse:     var(--color-gray-0);      /* On brand/dark surfaces — always white */
  --border-focus:       var(--color-purple-350);  /* #B6AEF3 — Tulip Purple */
  --border-brand:       var(--color-purple-500);
  --border-disabled:    var(--color-gray-200);
  --border-destructive: var(--color-red-600);
  --border-success:     var(--color-green-500);
  --border-warning:     var(--color-yellow-500);
  --border-info:        var(--color-blue-500);

  /* DIVIDER
     For decorative separators on brand/inverted surfaces (e.g. Split Action Button).
     Pair with visibility/divider (0.32) for correct visual weight.
     Do NOT use border/inverse as a fill — its scope is STROKE_COLOR only. */
  --divider-default: var(--color-gray-0);  /* #FFFFFF — mode-invariant */

  /* ACTION */
  --action-primary:             var(--color-purple-500);
  --action-primary-hover:       var(--color-purple-600);
  --action-primary-active:      var(--color-purple-700);
  --action-secondary:           var(--color-purple-50);
  --action-secondary-hover:     var(--color-purple-100);
  --action-secondary-active:    var(--color-purple-200);
  --action-destructive:         var(--color-red-600);
  --action-destructive-hover:   var(--color-red-700);
  --action-destructive-active:  var(--color-red-800);
  --action-ghost:               transparent;
  --action-ghost-hover:         var(--color-purple-500-a8);
  --action-ghost-pressed:       var(--color-purple-200);
  --action-tertiary-pressed:    var(--color-purple-100);

  /* FOCUS */
  --focus-ring-color:  var(--color-purple-350);
  --focus-ring-width:  2px;
  --focus-ring-offset: 2px;

  /* OVERLAY / SCRIM */
  --overlay-scrim-default: var(--color-gray-900-a64);
  --overlay-scrim-subtle:  var(--color-gray-900-a32);
  --overlay-scrim-heavy:   var(--color-gray-900-a80);

  /* FEEDBACK */
  --feedback-error-surface:   var(--color-red-50);
  --feedback-error-border:    var(--color-red-300);
  --feedback-success-surface: var(--color-green-50);
  --feedback-success-border:  var(--color-green-300);
  --feedback-warning-surface: var(--color-yellow-50);
  --feedback-warning-border:  var(--color-yellow-300);
  --feedback-info-surface:    var(--color-blue-50);
  --feedback-info-border:     var(--color-blue-300);

  /* ICON */
  --icon-default:   var(--color-gray-700);
  --icon-subtle:    var(--color-gray-500);
  --icon-brand:     var(--color-purple-500);
  --icon-disabled:  var(--color-gray-400);
  --icon-inverse:   var(--color-gray-0);

  /* VISIBILITY / OPACITY
     Applied as CSS opacity values (0–1 range).
     Mode-invariant — identical in Light and Dark. */
  --visibility-disabled:    0.40;   /* Disabled components */
  --visibility-divider:     0.32;   /* Decorative divider on brand surfaces */
  --visibility-loading:     0.32;   /* Content behind spinner */
  --visibility-inactive:    0.60;   /* Deemphasised sections */
  --visibility-placeholder: 0.48;   /* Skeleton content */
  --visibility-hidden:      0;
  --visibility-visible:     1;

  /* ELEVATION — Composed box-shadow values */
  --elevation-1:
    0px 1px 3px   rgba(0,0,0,0.20),
    0px 2px 2px   rgba(0,0,0,0.14),
    0px 0px 2px   rgba(0,0,0,0.12);

  --elevation-2:
    0px 2px 4px -1px rgba(0,0,0,0.20),
    0px 5px 5px      rgba(0,0,0,0.14),
    0px 1px 10px     rgba(0,0,0,0.12);

  --elevation-3:
    0px 3px 14px  rgba(0,0,0,0.20),
    0px 4px 15px  rgba(0,0,0,0.14),
    0px 8px 10px  rgba(0,0,0,0.12);

  --elevation-4:
    0px  6px 30px rgba(0,0,0,0.20),
    0px  8px 10px rgba(0,0,0,0.14),
    0px 16px 24px rgba(0,0,0,0.12);

  --elevation-5:
    0px  9px 46px rgba(0,0,0,0.20),
    0px 11px 15px rgba(0,0,0,0.14),
    0px 24px 38px rgba(0,0,0,0.12);

  /* LAYOUT */
  --layout-padding-3xs: 2px;
  --layout-padding-2xs: 4px;
  --layout-padding-xs:  8px;
  --layout-padding-sm:  12px;
  --layout-padding-md:  16px;
  --layout-padding-lg:  24px;
  --layout-padding-xl:  32px;
  --layout-padding-2xl: 48px;
  --layout-gap-3xs: 2px;
  --layout-gap-2xs: 4px;
  --layout-gap-xs:  8px;
  --layout-gap-sm:  12px;
  --layout-gap-md:  16px;
  --layout-gap-lg:  24px;
  --layout-gap-xl:  32px;

} /* end light mode */


/* ── DARK MODE ──────────────────────────────────────────────── */
:root[data-theme="dark"] {

  /* SURFACE */
  --surface-default:               var(--color-gray-900);
  --surface-raised:                var(--color-gray-800);
  --surface-overlay:               var(--color-gray-800);
  --surface-sunken:                var(--color-gray-950);
  --surface-brand:                 var(--color-purple-600);
  --surface-selected:              var(--color-purple-900);
  --surface-disabled:              var(--color-gray-800);
  --surface-inverse:               var(--color-gray-50);
  --surface-interactive-default:   var(--color-gray-800);
  --surface-interactive-hover:     var(--color-gray-750);
  --surface-interactive-active:    var(--color-gray-700);
  --surface-interactive-destructive:       var(--color-red-600);
  --surface-interactive-destructive-hover: var(--color-red-700);

  /* SURFACE / CONTROL */
  --surface-control-inactive:       var(--color-gray-500);   /* Same as light — #6B7280 */
  --surface-control-inactive-hover: var(--color-gray-400);   /* Lighter in dark — #9CA3AF */
  --surface-control-thumb:          var(--color-gray-0);     /* Always white */

  /* TEXT */
  --text-default:      var(--color-gray-50);
  --text-subtle:       var(--color-gray-400);
  --text-subtle-hover: var(--color-purple-400);  /* Brand purple dark mode */
  --text-muted:        var(--color-gray-500);
  --text-placeholder:  var(--color-gray-600);
  --text-disabled:     var(--color-gray-600);
  --text-inverse:      var(--color-gray-900);
  --text-on-brand:     var(--color-gray-0);      /* Always white */
  --text-brand:        var(--color-purple-400);
  --text-link:         var(--color-purple-400);
  --text-link-hover:   var(--color-purple-300);
  --text-link-active:  var(--color-purple-200);  /* #DDD6FE */
  --text-link-visited: var(--color-purple-300);  /* #C4B5FD — dark mode visited */
  --text-destructive:  var(--color-red-400);
  --text-success:      var(--color-green-400);
  --text-warning:      var(--color-yellow-400);
  --text-info:         var(--color-blue-400);
  --text-label:        var(--color-gray-300);

  /* BORDER */
  --border-default:     var(--color-gray-700);
  --border-subtle:      var(--color-gray-800);
  --border-strong:      var(--color-gray-500);
  --border-inverse:     var(--color-gray-0);     /* Mode-invariant — always white */
  --border-focus:       var(--color-purple-400);
  --border-brand:       var(--color-purple-400);
  --border-disabled:    var(--color-gray-700);
  --border-destructive: var(--color-red-400);
  --border-success:     var(--color-green-400);
  --border-warning:     var(--color-yellow-400);
  --border-info:        var(--color-blue-400);

  /* DIVIDER — mode-invariant, identical to light */
  --divider-default: var(--color-gray-0);

  /* ACTION */
  --action-primary:             var(--color-purple-400);
  --action-primary-hover:       var(--color-purple-300);
  --action-primary-active:      var(--color-purple-200);
  --action-secondary:           var(--color-purple-900);
  --action-secondary-hover:     var(--color-purple-800);
  --action-secondary-active:    var(--color-purple-700);
  --action-destructive:         var(--color-red-400);
  --action-destructive-hover:   var(--color-red-300);
  --action-destructive-active:  var(--color-red-200);
  --action-ghost:               transparent;
  --action-ghost-hover:         var(--color-purple-500-a8);
  --action-ghost-pressed:       var(--color-purple-700);
  --action-tertiary-pressed:    var(--color-purple-800);

  /* FOCUS */
  --focus-ring-color:  var(--color-purple-400);
  --focus-ring-width:  2px;
  --focus-ring-offset: 2px;

  /* OVERLAY / SCRIM */
  --overlay-scrim-default: var(--color-gray-950-a80);
  --overlay-scrim-subtle:  var(--color-gray-950-a48);
  --overlay-scrim-heavy:   var(--color-gray-950-a92);

  /* FEEDBACK */
  --feedback-error-surface:   var(--color-red-950);
  --feedback-error-border:    var(--color-red-700);
  --feedback-success-surface: var(--color-green-950);
  --feedback-success-border:  var(--color-green-700);
  --feedback-warning-surface: var(--color-yellow-950);
  --feedback-warning-border:  var(--color-yellow-700);
  --feedback-info-surface:    var(--color-blue-950);
  --feedback-info-border:     var(--color-blue-700);

  /* ICON */
  --icon-default:   var(--color-gray-300);
  --icon-subtle:    var(--color-gray-500);
  --icon-brand:     var(--color-purple-400);
  --icon-disabled:  var(--color-gray-600);
  --icon-inverse:   var(--color-gray-900);

  /* visibility — mode-invariant, same as light — no overrides needed */

  /* ELEVATION — slightly stronger in dark mode */
  --elevation-1:
    0px 1px 3px   rgba(0,0,0,0.36),
    0px 2px 2px   rgba(0,0,0,0.26),
    0px 0px 2px   rgba(0,0,0,0.22);

  --elevation-2:
    0px 2px 4px -1px rgba(0,0,0,0.36),
    0px 5px 5px      rgba(0,0,0,0.26),
    0px 1px 10px     rgba(0,0,0,0.22);

  --elevation-3:
    0px 3px 14px rgba(0,0,0,0.36),
    0px 4px 15px rgba(0,0,0,0.26),
    0px 8px 10px rgba(0,0,0,0.22);

  --elevation-4:
    0px  6px 30px rgba(0,0,0,0.36),
    0px  8px 10px rgba(0,0,0,0.26),
    0px 16px 24px rgba(0,0,0,0.22);

  --elevation-5:
    0px  9px 46px rgba(0,0,0,0.36),
    0px 11px 15px rgba(0,0,0,0.26),
    0px 24px 38px rgba(0,0,0,0.22);

} /* end dark mode */
```

---

## Layer 3A — Typography Tokens

> Fixed tokens (body, labels, code) live in `:root`. Responsive heading tokens use breakpoint overrides.

```css
/* ============================================================
   VENUS 2.1 RF — TYPOGRAPHY TOKENS
   Source: Venus_Typography collection (Figma)
   Modes: Mobile (default), Tablet (768px+), Desktop (1024px+),
          Large Display (1440px+)
   ============================================================ */

/* ── FIXED: Body ────────────────────────────────────────────── */
:root {
  --body-xl-size:           var(--font-size-18);
  --body-xl-weight:         var(--font-weight-regular);
  --body-xl-line-height:    var(--line-height-160);
  --body-xl-letter-spacing: var(--letter-spacing-0);

  --body-lg-size:           var(--font-size-16);
  --body-lg-weight:         var(--font-weight-regular);
  --body-lg-line-height:    var(--line-height-150);

  --body-md-size:           var(--font-size-14);
  --body-md-weight:         var(--font-weight-regular);
  --body-md-line-height:    var(--line-height-150);

  --body-sm-size:           var(--font-size-13);
  --body-sm-weight:         var(--font-weight-regular);
  --body-sm-line-height:    var(--line-height-140);

  --body-xs-size:           var(--font-size-12);
  --body-xs-weight:         var(--font-weight-regular);
  --body-xs-line-height:    var(--line-height-140);

  --body-xxs-size:           var(--font-size-11);
  --body-xxs-weight:         var(--font-weight-medium);
  --body-xxs-line-height:    var(--line-height-130);
  --body-xxs-letter-spacing: var(--letter-spacing-2);

  /* ── FIXED: Labels ────────────────────────────────────────── */
  --label-xl-size:           var(--font-size-14);
  --label-xl-weight:         var(--font-weight-medium);
  --label-xl-line-height:    var(--line-height-130);

  --label-lg-size:           var(--font-size-13);
  --label-lg-weight:         var(--font-weight-medium);
  --label-lg-line-height:    var(--line-height-130);

  --label-md-size:           var(--font-size-12);
  --label-md-weight:         var(--font-weight-medium);
  --label-md-line-height:    var(--line-height-120);

  --label-sm-size:           var(--font-size-11);
  --label-sm-weight:         var(--font-weight-medium);
  --label-sm-line-height:    var(--line-height-120);
  --label-sm-letter-spacing: var(--letter-spacing-1);

  --label-xs-size:           var(--font-size-11);
  --label-xs-weight:         var(--font-weight-semibold);
  --label-xs-line-height:    var(--line-height-120);
  --label-xs-letter-spacing: var(--letter-spacing-2);

  /* ── FIXED: Button text ───────────────────────────────────── */
  --button-md-size:        var(--font-size-14);
  --button-md-weight:      var(--font-weight-medium);
  --button-md-line-height: var(--line-height-140);

  --button-lg-size:        var(--font-size-16);
  --button-lg-weight:      var(--font-weight-medium);
  --button-lg-line-height: var(--line-height-150);

  --button-xl-size:        var(--font-size-18);
  --button-xl-weight:      var(--font-weight-medium);
  --button-xl-line-height: var(--line-height-150);

  /* ── FIXED: Code ──────────────────────────────────────────── */
  --code-md-size:        var(--font-size-14);
  --code-md-weight:      var(--font-weight-regular);
  --code-md-line-height: var(--line-height-150);

  --code-sm-size:        var(--font-size-12);
  --code-sm-weight:      var(--font-weight-regular);
  --code-sm-line-height: var(--line-height-140);

  /* ── RESPONSIVE: Headings — Mobile first (default) ─────────── */
  --heading-hero-size:           var(--font-size-28);
  --heading-hero-weight:         var(--font-weight-semibold);
  --heading-hero-line-height:    var(--line-height-120);
  --heading-hero-letter-spacing: var(--letter-spacing-neg1);

  --heading-xl-size:           var(--font-size-24);
  --heading-xl-weight:         var(--font-weight-semibold);
  --heading-xl-line-height:    var(--line-height-125);
  --heading-xl-letter-spacing: var(--letter-spacing-neg1);

  --heading-lg-size:        var(--font-size-20);
  --heading-lg-weight:      var(--font-weight-semibold);
  --heading-lg-line-height: var(--line-height-130);

  --heading-md-size:        var(--font-size-18);
  --heading-md-weight:      var(--font-weight-semibold);
  --heading-md-line-height: var(--line-height-130);

  --heading-sm-size:        var(--font-size-16);
  --heading-sm-weight:      var(--font-weight-semibold);
  --heading-sm-line-height: var(--line-height-140);

  --heading-xs-size:        var(--font-size-14);
  --heading-xs-weight:      var(--font-weight-semibold);
  --heading-xs-line-height: var(--line-height-140);
}

/* ── Tablet (768px+) ────────────────────────────────────────── */
@media (min-width: 768px) {
  :root {
    --heading-hero-size:        var(--font-size-32);
    --heading-hero-line-height: var(--line-height-115);

    --heading-xl-size:        var(--font-size-28);
    --heading-xl-line-height: var(--line-height-120);

    --heading-lg-size:        var(--font-size-24);
    --heading-lg-line-height: var(--line-height-125);

    --heading-md-size:        var(--font-size-20);
    --heading-md-line-height: var(--line-height-125);

    --heading-sm-size:        var(--font-size-18);
    --heading-sm-line-height: var(--line-height-130);

    --heading-xs-size:        var(--font-size-16);
    --heading-xs-line-height: var(--line-height-140);
  }
}

/* ── Desktop (1024px+) ──────────────────────────────────────── */
@media (min-width: 1024px) {
  :root {
    --heading-hero-size:           var(--font-size-40);
    --heading-hero-weight:         var(--font-weight-bold);
    --heading-hero-line-height:    var(--line-height-110);
    --heading-hero-letter-spacing: var(--letter-spacing-neg2);

    --heading-xl-size:        var(--font-size-32);
    --heading-xl-line-height: var(--line-height-115);

    --heading-lg-size:        var(--font-size-28);
    --heading-lg-line-height: var(--line-height-120);

    --heading-md-size:        var(--font-size-24);
    --heading-md-line-height: var(--line-height-125);

    --heading-sm-size:        var(--font-size-20);
    --heading-sm-line-height: var(--line-height-130);

    --heading-xs-size:        var(--font-size-18);
    --heading-xs-line-height: var(--line-height-130);
  }
}

/* ── Large Display (1440px+) ────────────────────────────────── */
@media (min-width: 1440px) {
  :root {
    --heading-hero-size:        var(--font-size-48);
    --heading-hero-line-height: var(--line-height-100);

    --heading-xl-size:           var(--font-size-40);
    --heading-xl-weight:         var(--font-weight-bold);
    --heading-xl-line-height:    var(--line-height-110);
    --heading-xl-letter-spacing: var(--letter-spacing-neg2);

    --heading-lg-size:        var(--font-size-32);
    --heading-lg-line-height: var(--line-height-115);

    --heading-md-size:        var(--font-size-28);
    --heading-md-line-height: var(--line-height-120);

    --heading-sm-size:        var(--font-size-24);
    --heading-sm-line-height: var(--line-height-125);

    --heading-xs-size:        var(--font-size-20);
    --heading-xs-line-height: var(--line-height-130);
  }
}
```

---

## Layer 3B — Icon Tokens

```css
/* ============================================================
   VENUS 2.1 RF — ICON TOKENS
   Source: Venus_Icons collection (Figma)
   Note: All float tokens set across all 8 modes (mode-invariant).
   ============================================================ */

:root {

  /* ── ICON SIZES ───────────────────────────────────────────── */
  --icon-size-xs:  12px;
  --icon-size-sm:  16px;
  --icon-size-md:  20px;
  --icon-size-lg:  24px;
  --icon-size-xl:  32px;
  --icon-size-2xl: 40px;
  --icon-size-3xl: 48px;

  /* ── ICON WRAPPER / TOUCH TARGETS ────────────────────────── */
  --icon-wrapper-xs: 24px;
  --icon-wrapper-sm: 32px;
  --icon-wrapper-md: 40px;
  --icon-wrapper-lg: 48px;

  /* ── ICON CONTEXT — Component-bound sizes ─────────────────── */
  --icon-context-button-md: 16px;
  --icon-context-button-lg: 20px;
  --icon-context-button-xl: 28px;   /* Intentionally larger than lg for xl visual balance */

  --icon-context-input-md:  16px;
  --icon-context-input-lg:  20px;
  --icon-context-input-xl:  24px;

  --icon-context-badge:                12px;
  --icon-context-alert-inline:         20px;
  --icon-context-alert-banner:         24px;
  --icon-context-toast:                20px;
  --icon-context-navigation-primary:   24px;
  --icon-context-navigation-secondary: 20px;
  --icon-context-card-feature:         32px;
  --icon-context-empty-state:          40px;
  --icon-context-hero:                 48px;
  --icon-context-table-row:            16px;
  --icon-context-table-header:         16px;
}

/* ── ICON COLOUR MODES ────────────────────────────────────────
   Icons use currentColor — set color on wrapper, SVG inherits.
   In Figma: 8 named modes on Venus_Icons collection.
   In CSS: data-icon-mode attribute or class on parent.
   ──────────────────────────────────────────────────────────── */

[data-icon-mode="default"],
.icon-mode-default  { color: var(--icon-brand); }     /* Brand purple */

[data-icon-mode="inverted"],
.icon-mode-inverted { color: var(--icon-inverse); }   /* White on dark/brand surfaces */

[data-icon-mode="neutral"],
.icon-mode-neutral  { color: var(--icon-default); }   /* Dark gray — non-brand surfaces */

[data-icon-mode="disabled"],
.icon-mode-disabled { color: var(--icon-disabled); }  /* Muted gray */

[data-icon-mode="error"],
.icon-mode-error    { color: var(--text-destructive); }

[data-icon-mode="success"],
.icon-mode-success  { color: var(--text-success); }

[data-icon-mode="warning"],
.icon-mode-warning  { color: var(--color-yellow-450); } /* #FFAE0A */

[data-icon-mode="info"],
.icon-mode-info     { color: var(--color-blue-400); }   /* #60A5FA */
```

---

## Layer 4 — Component Tokens (Venus_Components)

> `Venus_Components` is partially built. Toggle Switch tokens are complete and live. All tokens alias `Venus_Semantics` only — never `_Primitives` directly.

```css
/* ============================================================
   VENUS 2.1 RF — COMPONENT TOKENS
   Source: Venus_Components collection (Figma)
   Modes: Light, Dark
   Status: Toggle Switch complete. More components pending.
   ============================================================ */

/* ── TOGGLE SWITCH ─────────────────────────────────────────── */
/*
   Two sizes:
     lg (default) — track 36×20px, thumb 20px, wrapper 44×28px, component height 40px
     md            — track 28×16px, thumb 16px, wrapper 36×24px, component height 32px

   Colour tokens alias Venus_Semantics and switch automatically
   via data-theme — no separate dark mode block needed here.
*/

:root {

  /* COLOUR — aliases Venus_Semantics (theme-invariant declarations) */
  --toggle-track-off-default:  var(--surface-control-inactive);        /* Gray track — off state */
  --toggle-track-off-hover:    var(--surface-control-inactive-hover);   /* Darker on hover */
  --toggle-track-on-default:   var(--action-primary);                   /* Brand purple — on */
  --toggle-track-on-hover:     var(--action-primary-hover);             /* Darker purple on hover */
  --toggle-thumb-default:      var(--surface-control-thumb);            /* Always white */
  --toggle-label-default:      var(--text-default);                     /* Standard body text */
  --toggle-label-hover:        var(--text-brand);                       /* Brand purple on hover */
  --toggle-border-focus:       var(--border-focus);                     /* Tulip purple focus ring */

  /* GEOMETRY — lg size (default) */
  --toggle-track-height:             20px;
  --toggle-track-width:              36px;
  --toggle-thumb-size:               20px;  /* Thumb = track height (pill, sits flush) */
  --toggle-wrapper-height:           28px;
  --toggle-wrapper-width:            44px;
  --toggle-component-height:         40px;  /* Full touch target height */
  --toggle-component-gap:            8px;   /* Gap between track wrapper and label */
  --toggle-component-padding-h:      8px;
  --toggle-component-padding-v:      8px;
  --toggle-focus-ring-width:         2px;
  --toggle-focus-ring-offset:        2px;

  /* GEOMETRY — md size */
  --toggle-md-track-height:          16px;
  --toggle-md-track-width:           28px;
  --toggle-md-thumb-size:            16px;
  --toggle-md-wrapper-height:        24px;
  --toggle-md-wrapper-width:         36px;
  --toggle-md-component-height:      32px;
  --toggle-md-focus-ring-width:      2px;
  /* Note: toggle/md/focus/ring/height stored as 28px in Figma — this is the
     visual focus ring height around the wrapper, not the ring stroke width.
     Maps to height of the :focus-visible outline box. */
  --toggle-md-focus-ring-box-height: 28px;

}
```

---

## Usage Guidelines

### In components — use semantic tokens
```css
/* ✅ Correct */
.card           { background: var(--surface-raised); }
.label          { color: var(--text-label); }
.input          { border-color: var(--border-default); }
.input:focus    { outline-color: var(--focus-ring-color); }
.link           { color: var(--text-link); }
.link:hover     { color: var(--text-link-hover); text-decoration: underline; }
.link:active    { color: var(--text-link-active); }
.link:visited   { color: var(--text-link-visited); }
.divider        { background: var(--divider-default); opacity: var(--visibility-divider); }

/* ❌ Wrong — never use primitives in components */
.card           { background: var(--color-gray-0); }
.label          { color: var(--color-gray-700); }
```

### Theme switching — data-theme attribute
```html
<!-- Light (default) -->
<html data-theme="light">

<!-- Dark -->
<html data-theme="dark">

<!-- System preference -->
<script>
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
</script>
```

### Responsive heading usage
```css
.page-title {
  font-size:      var(--heading-hero-size);         /* 28 → 32 → 40 → 48px */
  font-weight:    var(--heading-hero-weight);        /* 600 → 600 → 700 → 700 */
  line-height:    var(--heading-hero-line-height);
  letter-spacing: var(--heading-hero-letter-spacing);
}
```

### Divider pattern (Split Action Button)
```css
/* Decorative separator on brand/inverted surfaces */
.split-button__divider {
  width: 1px;
  align-self: stretch;
  flex-shrink: 0;
  background-color: var(--divider-default);   /* #FFFFFF */
  opacity: var(--visibility-divider);         /* 0.32 */
  pointer-events: none;
}

/* On secondary/ghost variants — use a visible gray divider instead */
.split-button--secondary .split-button__divider,
.split-button--ghost     .split-button__divider {
  background-color: var(--border-default);
  opacity: 1;
}
```

### Toggle Switch implementation
```css
/* lg (default) */
.toggle__track {
  width:  var(--toggle-track-width);   /* 36px */
  height: var(--toggle-track-height);  /* 20px */
  border-radius: var(--radius-full);
  background: var(--toggle-track-off-default);
  transition: background var(--duration-fast) var(--easing-in-out);
}
.toggle__track--on    { background: var(--toggle-track-on-default); }
.toggle__track:hover  { background: var(--toggle-track-off-hover); }
.toggle__track--on:hover { background: var(--toggle-track-on-hover); }

.toggle__thumb {
  width:  var(--toggle-thumb-size);   /* 20px */
  height: var(--toggle-thumb-size);
  border-radius: var(--radius-full);
  background: var(--toggle-thumb-default);  /* Always white */
}

.toggle:focus-visible .toggle__wrapper {
  outline: var(--toggle-focus-ring-width) solid var(--toggle-border-focus);
  outline-offset: var(--toggle-focus-ring-offset);
}

/* md size override */
.toggle--md .toggle__track {
  width:  var(--toggle-md-track-width);
  height: var(--toggle-md-track-height);
}
.toggle--md .toggle__thumb {
  width:  var(--toggle-md-thumb-size);
  height: var(--toggle-md-thumb-size);
}
```

---

## Style Dictionary Integration

```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: '',
      buildPath: 'dist/',
      files: [
        {
          destination: 'primitives.css',
          format: 'css/variables',
          filter: token => token.attributes.category === 'primitive',
          options: { selector: ':root' }
        },
        {
          destination: 'semantics-light.css',
          format: 'css/variables',
          filter: token => token.attributes.mode === 'light',
          options: { selector: ':root[data-theme="light"]' }
        },
        {
          destination: 'semantics-dark.css',
          format: 'css/variables',
          filter: token => token.attributes.mode === 'dark',
          options: { selector: ':root[data-theme="dark"]' }
        },
        {
          destination: 'components.css',
          format: 'css/variables',
          filter: token => token.attributes.category === 'component',
          options: { selector: ':root' }
        }
      ]
    }
  }
};
```

---

## File Structure

```
src/
  tokens/
    primitives.css          ← Layer 1: all primitive tokens
    semantics.css           ← Layer 2: light + dark semantic tokens
    typography.css          ← Layer 3A: fixed + responsive type tokens
    icons.css               ← Layer 3B: icon sizes, context sizes, colour modes
    components.css          ← Layer 4: Toggle Switch + future component tokens
    index.css               ← imports all layers in order

/* tokens/index.css */
@import './primitives.css';
@import './semantics.css';
@import './typography.css';
@import './icons.css';
@import './components.css';
```

---

## Acceptance Criteria

**Primitives**
- [ ] `--color-purple-visited: #551A8B` present — browser-standard visited link colour
- [ ] `--color-purple-500-a8`, `--color-purple-500-a12`, `--color-purple-500-a16` all present
- [ ] All alpha colour variants use `rgba()` — better browser support than hex with alpha
- [ ] No primitive referenced directly in any component CSS

**Semantics**
- [ ] `--text-link-active` resolves to `purple/700` light (#4C42A0) / `purple/200` dark (#DDD6FE)
- [ ] `--text-link-visited` resolves to `#551A8B` light / `purple/300` (#C4B5FD) dark
- [ ] `--text-subtle-hover` resolves to `purple/500` light / `purple/400` dark
- [ ] `--surface-control-inactive` resolves to `gray/500` (#6B7280) both modes
- [ ] `--surface-control-inactive-hover` resolves to `gray/600` light / `gray/400` dark
- [ ] `--surface-control-thumb` resolves to `gray/0` (#FFFFFF) both modes
- [ ] `--divider-default` resolves to `#FFFFFF` in BOTH themes — mode-invariant
- [ ] `--visibility-divider` = `0.32`
- [ ] `--border-inverse` resolves to `#FFFFFF` in BOTH themes
- [ ] `--text-on-brand` resolves to `#FFFFFF` in BOTH themes
- [ ] All semantic tokens switch correctly between `data-theme="light"` and `data-theme="dark"`

**Typography**
- [ ] Heading tokens update at 768px, 1024px, 1440px breakpoints
- [ ] Body, label, code tokens are fixed (do not change at breakpoints)
- [ ] `--heading-hero-weight` is 600 at Mobile/Tablet, 700 at Desktop/Large Display

**Icons**
- [ ] `--icon-context-button-xl` is `28px` — not 24px
- [ ] All 8 icon modes available: default, inverted, neutral, disabled, error, success, warning, info
- [ ] Icon colour resolves via `currentColor`

**Components — Toggle Switch**
- [ ] lg track: 36×20px, thumb: 20px, component height: 40px
- [ ] md track: 28×16px, thumb: 16px, component height: 32px
- [ ] `--toggle-track-on-default` references `--action-primary` (not a hardcoded hex)
- [ ] `--toggle-thumb-default` is always white in both themes
- [ ] Focus ring tokens present: `--toggle-focus-ring-width: 2px`, `--toggle-focus-ring-offset: 2px`
