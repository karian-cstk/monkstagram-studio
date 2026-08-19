# Badge/Counter — Storybook Engineering Brief

```yaml
component_name: BadgeCounter
figma_node_id: "1272:31033"
figma_page: "Feedback"
version: "1.0.0"
status: Active
mode: NEW
build_order: 4
depends_on: []
used_by: [TableHeaderCell, Accordion]
handover_status: READY_FOR_REVIEW
unresolved_question_count: 0
```

## 1. Purpose

Small numeric counter pill — descendant counts, unread counts, filter counts. Purely presentational (no interaction).

## 2. Anatomy

Single-layer circular/pill container with one centered text node. No nested instances.

## 3. Props

| Figma property | Type | Default | React prop |
|---|---|---|---|
| `label` | TEXT | `"9"` | `count: number \| string` |
| `intent` | VARIANT | `neutral` | `intent: 'neutral' \| 'brand' \| 'brand-secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` |

7 intent variants total.

## 4. Token Reference

| Intent | Background | Text |
|---|---|---|
| neutral | `surface/neutral` (gray) | `text/inverse` or `text/default` — verify contrast per intent at implementation time |
| brand | `action/primary` | `text/inverse` |
| error / warning / success / info | matching semantic `surface/{intent}` tokens | `text/inverse` |

`NEEDS_CLARIFICATION`: exact bound variable IDs for the 6 non-neutral intents were not individually extracted this session (only neutral's usage was directly observed, via Accordion/Table-Header-Cell integration). Before implementation, pull each intent variant's live fill token directly rather than assuming a 1:1 naming match to the semantic scale.

## 5. React Implementation Sketch

```tsx
export type BadgeIntent = 'neutral' | 'brand' | 'brand-secondary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeCounterProps {
  count: number | string;
  intent?: BadgeIntent;
  max?: number; // e.g. cap display at "99+"
}

export function BadgeCounter({ count, intent = 'neutral', max }: BadgeCounterProps) {
  const display = typeof count === 'number' && max && count > max ? `${max}+` : count;
  return (
    <span className={`badge-counter badge-counter--${intent}`} role="status" aria-label={`Count: ${count}`}>
      {display}
    </span>
  );
}
```

## 6. Accessibility

- Purely visual counter — pair with `aria-label` or visually-hidden text describing what's being counted (e.g. "9 unread items"), since "9" alone is meaningless to a screen reader without context. The component itself can only supply a generic label; the CONSUMER (e.g. Accordion, Table/Header-Cell) should override with domain-specific text.

## 7. Storybook Stories

| Story | Args |
|---|---|
| `AllIntents` | 7 badges side by side |
| `LongNumber` | count=150, max=99 → shows "99+" |
| `SingleDigit` | count=3 |

## 8. Do / Don't

| Do | Don't |
|---|---|
| Let the consuming component supply a meaningful `aria-label` | Don't ship the raw number as the only accessible content without context |

## 9. Decision Log

| Question | Resolution |
|---|---|
| Exact tokens for 6 non-neutral intents | `NEEDS_CLARIFICATION` — verify live before implementation, only `neutral` was confirmed this session. |
