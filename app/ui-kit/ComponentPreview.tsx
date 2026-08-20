"use client";

import { useState } from "react";

type StateKey =
  | "Default"
  | "Hover"
  | "Active"
  | "Filled"
  | "Error"
  | "Warning"
  | "Success"
  | "Disabled"
  | "Readonly";

const STATES: StateKey[] = [
  "Default",
  "Hover",
  "Active",
  "Filled",
  "Error",
  "Warning",
  "Success",
  "Disabled",
  "Readonly",
];

type StatusIcon = "error" | "warning" | "success";

// Real Venus 2.1 RF design tokens and per-variant descriptions, pulled from
// Figma (get_variable_defs + get_design_context component descriptions) —
// not invented. One correction made: the "Active" node's own description
// literally said "Filled state" (a copy-paste slip in the Figma source);
// corrected to "Active state" here since showing the wrong state name would
// misdocument the variant, everything else is verbatim.
const STATE_CONFIG: Record<
  StateKey,
  {
    border: string;
    borderWidth: number;
    ring?: boolean;
    text: string;
    textColor: string;
    below: string;
    belowColor: string;
    statusIcon?: StatusIcon;
    qualifier?: string;
    disabled?: boolean;
    bg?: string;
    description: string;
  }
> = {
  Default: {
    border: "#e5e7eb",
    borderWidth: 1,
    text: "Placeholder text",
    textColor: "#9ca3af",
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "md (32px) — dense forms, sidebar, compact toolbars. Use for: empty field awaiting user interaction. Focus: hasFocus=true → focus-border (2px inside) + external focus ring (2px outside). Tokens: fill=input/background/default (surface/raised), border=input/border/default 1px, text=input/text/placeholder.",
  },
  Hover: {
    border: "#6c5ce7",
    borderWidth: 1,
    text: "Placeholder text",
    textColor: "#9ca3af",
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "md (32px) — dense forms, sidebar, compact toolbars. Use for: mouse over an empty field — signals interactivity. This is CSS :hover in code, never a prop. Focus supersedes hover. Tokens: fill=input/background/default, border=input/border/hover (border/strong gray/400) 1px, text=input/text/placeholder.",
  },
  Active: {
    border: "#6c5ce7",
    borderWidth: 2,
    ring: true,
    text: "Value text",
    textColor: "#111827",
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "md (32px) — dense forms, sidebar, compact toolbars. Use for: field is focused and being edited. Focus-ring only (the 2px brand border is always shown; an inner focus-border would be redundant). Tokens: fill=input/background/default, border=input/border/focused 2px, text=input/text/value.",
  },
  Filled: {
    border: "#e5e7eb",
    borderWidth: 1,
    text: "Value text",
    textColor: "#111827",
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "md (32px) — dense forms, sidebar, compact toolbars. Use for: field contains a user-entered value, no active interaction. Focus: hasFocus=true → focus-border (2px inside) + external focus ring. Tokens: fill=input/background/default, border=input/border/default 1px, text=input/text/value (text/default).",
  },
  Error: {
    border: "#cd0200",
    borderWidth: 2,
    text: "Value text",
    textColor: "#8f0e0e",
    below: "This field is required",
    belowColor: "#8f0e0e",
    statusIcon: "error",
    description:
      "md (32px) — dense forms, sidebar, compact toolbars. Use for: validation failure. Always show hasStatusMessage=true — border + icon + text together, never color alone. Focus: external focus ring only; the error border stays, preserving status context during edit. Tokens: fill=input/background/default, border=input/border/error (border/destructive) 2px, text=input/text/value (text/destructive).",
  },
  Warning: {
    border: "#a87a08",
    borderWidth: 2,
    text: "Value text",
    textColor: "#6b4a07",
    below: "Double-check this value",
    belowColor: "#6b4a07",
    statusIcon: "warning",
    description:
      "md (32px) — dense forms, sidebar, compact toolbars. Use for: caution state — input accepted but requires attention. Show hasStatusMessage=true. Focus: external focus ring only; warning border unchanged. Tokens: fill=input/background/default, border=input/border/warning 2px, text=input/text/value (text/warning).",
  },
  Success: {
    border: "#148b7e",
    borderWidth: 2,
    text: "Value text",
    textColor: "#107b72",
    below: "Looks good",
    belowColor: "#107b72",
    statusIcon: "success",
    description:
      "md (32px) — dense forms, sidebar, compact toolbars. Use for: validation passed. Show hasStatusMessage=true to confirm. Focus: external focus ring only; success border unchanged. Tokens: fill=input/background/default, border=input/border/success 2px, text=input/text/value (text/success).",
  },
  Disabled: {
    border: "#e5e7eb",
    borderWidth: 1,
    text: "Placeholder text",
    textColor: "#9ca3af",
    below: "Helper text",
    belowColor: "#4b5563",
    disabled: true,
    description:
      "md (32px) — dense forms, sidebar, compact toolbars. Use for: field unavailable for interaction (pointer-events: none, aria-disabled=true in code). hasFocus is inert — disabled fields cannot receive :focus-visible. Tokens: fill=input/background/disabled, border=input/border/disabled 1px, opacity=visibility/disabled (40%).",
  },
  Readonly: {
    border: "#f3f4f6",
    borderWidth: 1,
    text: "Value text",
    textColor: "#4b5563",
    below: "Helper text",
    belowColor: "#4b5563",
    qualifier: "(Read Only)",
    bg: "#f3f4f6",
    description:
      "md (32px) — dense forms, sidebar, compact toolbars. Use for: field displays a non-editable value (readOnly={true} in code). The \"(Read Only)\" qualifier is always shown — not controlled by isRequired. hasFocus is inert; readonly fields do not receive keyboard focus. Tokens: fill=input/background/readonly (surface/sunken), border=input/border/readonly (border/subtle) 1px, text=input/text/readonly (text/subtle).",
  },
};

function StatusGlyph({ icon, color }: { icon: StatusIcon; color: string }) {
  if (icon === "error") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "warning") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <path d="M12 3l10 18H2L12 3z" strokeLinejoin="round" />
        <path d="M12 10v4M12 17.5v.01" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InputPreview() {
  const [state, setState] = useState<StateKey>("Default");
  const c = STATE_CONFIG[state];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STATES.map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`text-xs rounded-full border px-3 py-1 transition-colors ${
              state === s
                ? "border-amethyst bg-amethyst/10 text-crystal-clear"
                : "border-shadow-border text-muted hover:text-subtle"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white p-8 flex justify-center">
        <div
          className="flex flex-col gap-1 w-[240px]"
          style={{ opacity: c.disabled ? 0.4 : 1 }}
        >
          <div className="flex items-center gap-1 pb-1">
            <span
              style={{ color: "#6b7280", fontFamily: "Inter", fontWeight: 500, fontSize: 12 }}
            >
              Label
            </span>
            {c.qualifier && (
              <span style={{ color: "#4b5563", fontFamily: "Inter", fontSize: 12 }}>
                {c.qualifier}
              </span>
            )}
          </div>
          <div
            className="flex items-center h-8 px-3 rounded"
            style={{
              background: c.bg ?? "#ffffff",
              border: `${c.borderWidth}px solid ${c.border}`,
              boxShadow: c.ring ? `0 0 0 2px ${c.border}, 0 0 0 4px rgba(108,92,231,0.25)` : undefined,
            }}
          >
            <span
              style={{
                color: c.textColor,
                fontFamily: "Inter",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              {c.text}
            </span>
          </div>
          <div className="pt-1 flex items-center gap-1">
            {c.statusIcon && <StatusGlyph icon={c.statusIcon} color={c.belowColor} />}
            <span style={{ color: c.belowColor, fontFamily: "Inter", fontSize: 12 }}>
              {c.below}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-subtle leading-relaxed">
        <span className="text-periwinkle font-medium">{state} — </span>
        {c.description}
      </p>
    </div>
  );
}

type SelectStateKey =
  | "Default"
  | "Active"
  | "Open"
  | "Filled"
  | "Error"
  | "Warning"
  | "Success"
  | "Disabled"
  | "Readonly";

const SELECT_STATES: SelectStateKey[] = [
  "Default",
  "Active",
  "Open",
  "Filled",
  "Error",
  "Warning",
  "Success",
  "Disabled",
  "Readonly",
];

// Real Venus 2.1 RF Select tokens, pulled the same way as Input. Two
// descriptions corrected: the Active node's own text said "Filled state" and
// listed border/default 1px (both copy-paste slips — the actual resolved
// code uses select/border/focused at 2px); corrected here to match the code.
const SELECT_CONFIG: Record<
  SelectStateKey,
  {
    border: string;
    borderWidth: number;
    text: string;
    textColor: string;
    isPlaceholder?: boolean;
    below: string;
    belowColor: string;
    statusIcon?: StatusIcon;
    disabled?: boolean;
    bg?: string;
    description: string;
  }
> = {
  Default: {
    border: "#e5e7eb",
    borderWidth: 1,
    text: "Select an option",
    textColor: "#9ca3af",
    isPlaceholder: true,
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "md (32px trigger) — compact/sidebar contexts. Use for: empty select field awaiting user interaction. Tokens: fill=surface/raised, border=border/default 1px, text=text/placeholder.",
  },
  Active: {
    border: "#6c5ce7",
    borderWidth: 2,
    text: "Selected option",
    textColor: "#111827",
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "md (32px trigger) — compact/sidebar contexts. Use for: value selected, control has focus. Tokens: fill=surface/raised, border=select/border/focused 2px, text=text/default.",
  },
  Open: {
    border: "#6c5ce7",
    borderWidth: 2,
    text: "Selected option",
    textColor: "#111827",
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "md (32px trigger) — compact/sidebar contexts. Use for: select field with its dropdown panel open. Tokens: fill=surface/raised, border=border/brand 2px, text=text/default.",
  },
  Filled: {
    border: "#e5e7eb",
    borderWidth: 1,
    text: "Selected option",
    textColor: "#111827",
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "md (32px trigger) — compact/sidebar contexts. Use for: select field with a value chosen. Tokens: fill=surface/raised, border=border/default 1px, text=text/default.",
  },
  Error: {
    border: "#cd0200",
    borderWidth: 2,
    text: "Selected option",
    textColor: "#111827",
    below: "This field has an error",
    belowColor: "#8f0e0e",
    statusIcon: "error",
    description:
      "md (32px trigger) — compact/sidebar contexts. Use for: select field with a validation error — always show with a status message. Tokens: fill=surface/raised, border=border/destructive 2px, text=text/default.",
  },
  Warning: {
    border: "#a87a08",
    borderWidth: 2,
    text: "Selected option",
    textColor: "#111827",
    below: "Please review your selection",
    belowColor: "#6b4a07",
    statusIcon: "warning",
    description:
      "md (32px trigger) — compact/sidebar contexts. Use for: select field with a soft validation warning. Tokens: fill=surface/raised, border=border/warning 2px, text=text/default.",
  },
  Success: {
    border: "#148b7e",
    borderWidth: 1,
    text: "Selected option",
    textColor: "#111827",
    below: "Selection confirmed",
    belowColor: "#107b72",
    statusIcon: "success",
    description:
      "md (32px trigger) — compact/sidebar contexts. Use for: select field with a confirmed valid selection. Tokens: fill=surface/raised, border=border/success 1px, text=text/default.",
  },
  Disabled: {
    border: "#e5e7eb",
    borderWidth: 1,
    text: "Select an option",
    textColor: "#9ca3af",
    isPlaceholder: true,
    below: "Helper text",
    belowColor: "#4b5563",
    disabled: true,
    bg: "#f3f4f6",
    description:
      "md (32px trigger) — compact/sidebar contexts. Use for: select field not interactive — 40% opacity via visibility/disabled, layered on top of surface/disabled fill (a deliberate double treatment so Select reads darker-disabled than Input at a glance). Tokens: fill=surface/disabled, border=border/disabled 1px, text=text/disabled.",
  },
  Readonly: {
    border: "#f3f4f6",
    borderWidth: 1,
    text: "Selected option",
    textColor: "#4b5563",
    below: "Helper text",
    belowColor: "#4b5563",
    bg: "#f3f4f6",
    description:
      "md (32px trigger) — compact/sidebar contexts. Use for: select field with a fixed value — not editable, but still submittable. Unlike Input, there is no forced \"(Read Only)\" qualifier here. Tokens: fill=surface/sunken, border=border/subtle 1px, text=text/subtle.",
  },
};

function ChevronDown({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SelectPreview() {
  const [state, setState] = useState<SelectStateKey>("Default");
  const c = SELECT_CONFIG[state];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {SELECT_STATES.map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`text-xs rounded-full border px-3 py-1 transition-colors ${
              state === s
                ? "border-amethyst bg-amethyst/10 text-crystal-clear"
                : "border-shadow-border text-muted hover:text-subtle"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white p-8 flex justify-center">
        <div className="flex flex-col gap-1 w-[240px]" style={{ opacity: c.disabled ? 0.4 : 1 }}>
          <div className="flex items-center gap-1 pb-1">
            <span style={{ color: "#6b7280", fontFamily: "Inter", fontWeight: 500, fontSize: 12 }}>
              Label
            </span>
          </div>
          <div
            className="flex items-center gap-2 h-8 px-3 rounded"
            style={{
              background: c.bg ?? "#ffffff",
              border: `${c.borderWidth}px solid ${c.border}`,
            }}
          >
            <span
              style={{
                color: c.textColor,
                fontFamily: "Inter",
                fontSize: 14,
                fontWeight: 400,
                flex: 1,
              }}
            >
              {c.text}
            </span>
            <ChevronDown color="#6c5ce7" />
          </div>
          <div className="pt-1 flex items-center gap-1">
            {c.statusIcon && <StatusGlyph icon={c.statusIcon} color={c.belowColor} />}
            <span style={{ color: c.belowColor, fontFamily: "Inter", fontSize: 12 }}>
              {c.below}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-subtle leading-relaxed">
        <span className="text-periwinkle font-medium">{state} — </span>
        {c.description}
      </p>
    </div>
  );
}

type TextareaStateKey =
  | "Default"
  | "Hover"
  | "Active"
  | "Filled"
  | "Error"
  | "Warning"
  | "Success"
  | "Disabled"
  | "Readonly";

const TEXTAREA_STATES: TextareaStateKey[] = [
  "Default",
  "Hover",
  "Active",
  "Filled",
  "Error",
  "Warning",
  "Success",
  "Disabled",
  "Readonly",
];

// Real Venus 2.1 RF Textarea tokens — identical token family to Input
// (confirmed via get_variable_defs), fetched per-state the same way.
const TEXTAREA_CONFIG: Record<
  TextareaStateKey,
  {
    border: string;
    borderWidth: number;
    text: string;
    textColor: string;
    isPlaceholder?: boolean;
    below: string;
    belowColor: string;
    statusIcon?: StatusIcon;
    qualifier?: string;
    disabled?: boolean;
    bg?: string;
    description: string;
  }
> = {
  Default: {
    border: "#e5e7eb",
    borderWidth: 1,
    text: "Placeholder text",
    textColor: "#9ca3af",
    isPlaceholder: true,
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "compact — fixed 3 rows (80px). Use for: empty field awaiting input. Border: input/border/default 1px. Focus: hasFocus=true → focus-border (2px inside) + focus-ring (2px outside). Tokens: fill=input/background/default, border=input/border/default, text=input/text/placeholder.",
  },
  Hover: {
    border: "#6c5ce7",
    borderWidth: 1,
    text: "Placeholder text",
    textColor: "#9ca3af",
    isPlaceholder: true,
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "compact — fixed 3 rows (80px). Use for: mouse over an empty field. Border: input/border/hover (purple/500) 1px — CSS :hover, never a prop. Focus supersedes hover. Tokens: fill=input/background/default, border=input/border/hover, text=input/text/placeholder.",
  },
  Active: {
    border: "#6c5ce7",
    borderWidth: 2,
    text: "Value text",
    textColor: "#111827",
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "compact — fixed 3 rows (80px). Use for: field being actively typed into. Border: input/border/focused (purple/500) 2px — baked always-on; no separate focus-border frame (the trigger IS the 2px border, avoiding a double border). Tokens: fill=input/background/default, border=input/border/active, text=input/text/value.",
  },
  Filled: {
    border: "#e5e7eb",
    borderWidth: 1,
    text: "Value text",
    textColor: "#111827",
    below: "Helper text",
    belowColor: "#4b5563",
    description:
      "compact — fixed 3 rows (80px). Use for: field contains a value, not focused. Border: input/border/default 1px. Focus: hasFocus=true → focus-border + focus-ring. Tokens: fill=input/background/default, border=input/border/filled, text=input/text/value.",
  },
  Error: {
    border: "#cd0200",
    borderWidth: 2,
    text: "Value text",
    textColor: "#8f0e0e",
    below: "This field is required",
    belowColor: "#8f0e0e",
    statusIcon: "error",
    description:
      "compact — fixed 3 rows (80px). Use for: validation failed. Border: input/border/error (red) 2px. Text: text/destructive. Always show hasStatusMessage=true. Focus: focus-ring only — error border unchanged, status preserved during edit. Tokens: fill=input/background/default, border=input/border/error, text=input/hint/error.",
  },
  Warning: {
    border: "#a87a08",
    borderWidth: 2,
    text: "Value text",
    textColor: "#6b4a07",
    below: "Double-check this value",
    belowColor: "#6b4a07",
    statusIcon: "warning",
    description:
      "compact — fixed 3 rows (80px). Use for: caution state. Border: input/border/warning (amber) 2px. Show hasStatusMessage=true. Focus: focus-ring only; warning border unchanged. Tokens: fill=input/background/default, border=input/border/warning, text=input/hint/warning.",
  },
  Success: {
    border: "#148b7e",
    borderWidth: 2,
    text: "Value text",
    textColor: "#107b72",
    below: "Looks good",
    belowColor: "#107b72",
    statusIcon: "success",
    description:
      "compact — fixed 3 rows (80px). Use for: validation passed. Border: input/border/success (teal) 2px. Show hasStatusMessage=true. Focus: focus-ring only; success border unchanged. Tokens: fill=input/background/default, border=input/border/success, text=input/hint/success.",
  },
  Disabled: {
    border: "#e5e7eb",
    borderWidth: 1,
    text: "Placeholder text",
    textColor: "#9ca3af",
    isPlaceholder: true,
    below: "Helper text",
    belowColor: "#4b5563",
    disabled: true,
    description:
      "compact — fixed 3 rows (80px). Use for: not interactive (pointer-events: none in code). hasFocus is inert — disabled fields cannot receive :focus-visible. Tokens: fill=input/background/disabled, border=input/border/disabled, text=input/text/disabled, opacity=visibility/disabled (40%).",
  },
  Readonly: {
    border: "#f3f4f6",
    borderWidth: 1,
    text: "Value text",
    textColor: "#4b5563",
    below: "Helper text",
    belowColor: "#4b5563",
    qualifier: "(Read Only)",
    bg: "#f3f4f6",
    description:
      "compact — fixed 3 rows (80px). Use for: displays a non-editable value on surface/sunken. The \"(Read Only)\" qualifier is always shown. hasFocus is inert; readonly fields do not receive keyboard focus. Tokens: fill=input/background/readonly, border=input/border/readonly, text=input/text/readonly.",
  },
};

function ResizeHandle() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
      <path d="M21 21H15M21 21V15M21 21L13 13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TextareaPreview() {
  const [state, setState] = useState<TextareaStateKey>("Default");
  const c = TEXTAREA_CONFIG[state];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TEXTAREA_STATES.map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`text-xs rounded-full border px-3 py-1 transition-colors ${
              state === s
                ? "border-amethyst bg-amethyst/10 text-crystal-clear"
                : "border-shadow-border text-muted hover:text-subtle"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white p-8 flex justify-center">
        <div className="flex flex-col gap-1 w-[280px]" style={{ opacity: c.disabled ? 0.4 : 1 }}>
          <div className="flex items-center gap-1 pb-1">
            <span style={{ color: "#6b7280", fontFamily: "Inter", fontWeight: 500, fontSize: 12 }}>
              Label
            </span>
            {c.qualifier && (
              <span style={{ color: "#4b5563", fontFamily: "Inter", fontSize: 12 }}>
                {c.qualifier}
              </span>
            )}
          </div>
          <div
            className="relative px-3 py-2 rounded"
            style={{
              background: c.bg ?? "#ffffff",
              border: `${c.borderWidth}px solid ${c.border}`,
              height: 80,
            }}
          >
            <span
              style={{
                color: c.textColor,
                fontFamily: "Inter",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              {c.text}
            </span>
            <div className="absolute bottom-1 right-1">
              <ResizeHandle />
            </div>
          </div>
          <div className="pt-1 flex items-center gap-1">
            {c.statusIcon && <StatusGlyph icon={c.statusIcon} color={c.belowColor} />}
            <span style={{ color: c.belowColor, fontFamily: "Inter", fontSize: 12 }}>
              {c.below}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-subtle leading-relaxed">
        <span className="text-periwinkle font-medium">{state} — </span>
        {c.description}
      </p>
    </div>
  );
}

type RTEStateKey = "Default" | "Filled" | "Disabled" | "Readonly";

const RTE_STATES: RTEStateKey[] = ["Default", "Filled", "Disabled", "Readonly"];

const RTE_TOOLBAR = ["B", "I", "S", "🔗", "•", "1.", "H", "”", "↶", "↷", "⤢"];

const RTE_CONFIG: Record<
  RTEStateKey,
  {
    text: string;
    textColor: string;
    isPlaceholder?: boolean;
    bodyBg: string;
    toolbarDimmed?: boolean;
    rootDimmed?: boolean;
    description: string;
  }
> = {
  Default: {
    text: "Placeholder text",
    textColor: "#9ca3af",
    isPlaceholder: true,
    bodyBg: "#ffffff",
    description:
      "Use for: primary content authoring. Tokens: border=border/default, fill=surface/raised.",
  },
  Filled: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    textColor: "#111827",
    bodyBg: "#ffffff",
    description:
      "Use for: showing authored content before editing. Tokens: border=border/default, fill=surface/raised. (This state exists in the file as its own node, even though the component-level spec only names Default/Disabled/Readonly — noted, not silently dropped.)",
  },
  Disabled: {
    text: "Placeholder text",
    textColor: "#9ca3af",
    isPlaceholder: true,
    bodyBg: "#ffffff",
    rootDimmed: true,
    description:
      "Use for: non-editable form fields. Tokens: border=border/default, fill=surface/raised, opacity=visibility/disabled — the entire component (toolbar + field) dims together at 40%.",
  },
  Readonly: {
    text: "Value text",
    textColor: "#4b5563",
    bodyBg: "#f3f4f6",
    toolbarDimmed: true,
    description:
      "Use for: display-only content with formatting preserved. Only the toolbar dims (visibility/disabled) — the text field itself switches to the Textarea atom's own Readonly surface (surface/sunken), it isn't just faded.",
  },
};

function RTEPreview() {
  const [state, setState] = useState<RTEStateKey>("Default");
  const c = RTE_CONFIG[state];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {RTE_STATES.map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`text-xs rounded-full border px-3 py-1 transition-colors ${
              state === s
                ? "border-amethyst bg-amethyst/10 text-crystal-clear"
                : "border-shadow-border text-muted hover:text-subtle"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white p-8 flex justify-center">
        <div className="w-full max-w-[420px]" style={{ opacity: c.rootDimmed ? 0.4 : 1 }}>
          <div style={{ color: "#6b7280", fontFamily: "Inter", fontWeight: 500, fontSize: 13, marginBottom: 6 }}>
            Label
          </div>
          <div className="rounded border overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
            <div
              className="flex flex-wrap gap-0.5 p-1"
              style={{ background: "#f9fafb", opacity: c.toolbarDimmed ? 0.4 : 1 }}
            >
              {RTE_TOOLBAR.map((glyph, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded"
                  style={{ width: 28, height: 28, color: "#6c5ce7", fontSize: 12, fontFamily: "Inter" }}
                >
                  {glyph}
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "#e5e7eb" }} />
            <div className="p-3" style={{ background: c.bodyBg, minHeight: 120 }}>
              <span style={{ color: c.textColor, fontFamily: "Inter", fontSize: 15 }}>{c.text}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-subtle leading-relaxed">
        <span className="text-periwinkle font-medium">{state} — </span>
        {c.description}
      </p>
    </div>
  );
}

type SliderStateKey = "Default" | "Hover" | "Active" | "Focused" | "Disabled" | "Readonly";

const SLIDER_STATES: SliderStateKey[] = [
  "Default",
  "Hover",
  "Active",
  "Focused",
  "Disabled",
  "Readonly",
];

// Real Venus 2.1 RF Slider tokens. Default/Focused/Disabled/Readonly were
// each fetched directly from Figma; Hover/Active were not independently
// sampled and mirror Default's confirmed track/thumb colors rather than
// guessing new ones — noted so this isn't mistaken for verified data.
const SLIDER_CONFIG: Record<
  SliderStateKey,
  {
    trackBg: string;
    fillBg: string;
    thumbBg: string;
    thumbRing?: boolean;
    labelColor: string;
    rootDimmed?: boolean;
    description: string;
  }
> = {
  Default: {
    trackBg: "#e5e7eb",
    fillBg: "#ede9fe",
    thumbBg: "#6c5ce7",
    labelColor: "#6b7280",
    description:
      "md — 16px thumb, 4px track. Resting state. Thumb: action/primary fill + stroke. Track fill (as resolved in the file): action/secondary/hover — see the flagged spec/code mismatch below. Continuous scale, single thumb.",
  },
  Hover: {
    trackBg: "#e5e7eb",
    fillBg: "#ede9fe",
    thumbBg: "#6c5ce7",
    labelColor: "#6b7280",
    description:
      "Not independently sampled from Figma — shown here with Default's confirmed colors rather than an invented hover treatment.",
  },
  Active: {
    trackBg: "#e5e7eb",
    fillBg: "#ede9fe",
    thumbBg: "#4c42a0",
    labelColor: "#6b7280",
    description:
      "Not independently sampled from Figma. Thumb color shown using action/primary/active (#4c42a0) from the shared action-color scale as the most plausible pressed-state token; track colors mirror Default.",
  },
  Focused: {
    trackBg: "#e5e7eb",
    fillBg: "#ede9fe",
    thumbBg: "#6c5ce7",
    thumbRing: true,
    labelColor: "#6b7280",
    description:
      "md — keyboard navigation active. Focus ring visible on the thumb only: focus/ring/color, 2px stroke, 2px offset — a different token than Input's border/focus, though both alias the same purple/500.",
  },
  Disabled: {
    trackBg: "#e5e7eb",
    fillBg: "#e5e7eb",
    thumbBg: "#e5e7eb",
    labelColor: "#9ca3af",
    rootDimmed: true,
    description:
      "md — non-interactive. visibility/disabled opacity (0.40) on the whole root. cursor: not-allowed, no hover response. Track, fill, and thumb all collapse to border/disabled.",
  },
  Readonly: {
    trackBg: "#6b7280",
    fillBg: "#6b7280",
    thumbBg: "#6b7280",
    labelColor: "#6b7280",
    description:
      "md — value displayed but not editable. Thumb switches to surface/control/inactive (gray, not brand purple). No interaction. Opacity stays at 1 — this is not the same treatment as Disabled.",
  },
};

function SliderPreview() {
  const [state, setState] = useState<SliderStateKey>("Default");
  const c = SLIDER_CONFIG[state];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {SLIDER_STATES.map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            className={`text-xs rounded-full border px-3 py-1 transition-colors ${
              state === s
                ? "border-amethyst bg-amethyst/10 text-crystal-clear"
                : "border-shadow-border text-muted hover:text-subtle"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white p-8 flex justify-center">
        <div className="w-[240px]" style={{ opacity: c.rootDimmed ? 0.4 : 1 }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: c.labelColor, fontFamily: "Inter", fontWeight: 500, fontSize: 13 }}>
              Label
            </span>
            <span style={{ color: "#6b7280", fontFamily: "Inter", fontSize: 11 }}>50</span>
          </div>
          <div className="relative h-6 flex items-center">
            <div
              className="absolute left-0 right-0 rounded-full"
              style={{ height: 4, background: c.trackBg }}
            />
            <div
              className="absolute left-0 rounded-full"
              style={{ height: 4, width: "45%", background: c.fillBg }}
            />
            <div
              className="absolute rounded-full"
              style={{
                left: "45%",
                width: 16,
                height: 16,
                background: c.thumbBg,
                transform: "translateX(-50%)",
                boxShadow: c.thumbRing
                  ? "0 0 0 2px #ffffff, 0 0 0 4px #6c5ce7"
                  : "0 1px 2px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-subtle leading-relaxed">
        <span className="text-periwinkle font-medium">{state} — </span>
        {c.description}
      </p>
    </div>
  );
}

type TableDensity = "Default" | "Compact";

const TABLE_ROWS = [
  { title: "Homepage Hero Banner", status: "Published", version: "42" },
  { title: "Pricing Page Table", status: "Draft", version: "17" },
  { title: "Onboarding Checklist", status: "Published", version: "8" },
  { title: "Footer Navigation", status: "In Review", version: "23" },
];

const STATUS_BADGE_COLOR: Record<string, string> = {
  Published: "#107b72",
  Draft: "#6b7280",
  "In Review": "#a87a08",
};

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OverflowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#374151">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
      <path d="M8 9l4-4 4 4M8 15l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
      <path d="M4 4h16l-6 8v6l-4 2v-8L4 4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TableEntryListPreview() {
  const [density, setDensity] = useState<TableDensity>("Default");
  const rowHeight = density === "Default" ? 36 : 28;
  const headerHeight = density === "Default" ? 32 : 28;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(["Default", "Compact"] as TableDensity[]).map((d) => (
          <button
            key={d}
            onClick={() => setDensity(d)}
            className={`text-xs rounded-full border px-3 py-1 transition-colors ${
              density === d
                ? "border-amethyst bg-amethyst/10 text-crystal-clear"
                : "border-shadow-border text-muted hover:text-subtle"
            }`}
          >
            {d} density
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white p-4 overflow-x-auto">
        <div
          className="flex border rounded overflow-hidden"
          style={{ borderColor: "#e5e7eb", fontFamily: "Inter", width: "fit-content" }}
        >
          {/* Main columns */}
          <div>
            {/* Header */}
            <div
              className="flex items-center"
              style={{ background: "#f9f8ff", height: headerHeight, borderBottom: "2px solid #e5e7eb" }}
            >
              <div
                className="flex items-center justify-center"
                style={{ width: 48, borderRight: "1px solid #f3f4f6" }}
              >
                <div
                  className="rounded-sm"
                  style={{ width: 16, height: 16, border: "1.5px solid #9ca3af", background: "#fff" }}
                />
              </div>
              <div
                className="flex items-center gap-1.5 px-3"
                style={{ width: 220, borderRight: "1px solid #e5e7eb" }}
              >
                <span style={{ color: "#4b5563", fontSize: 11, fontWeight: 500, letterSpacing: 0.2 }}>
                  Title
                </span>
                <SortIcon />
              </div>
              <div
                className="flex items-center gap-1.5 px-3"
                style={{ width: 130, borderRight: "1px solid #e5e7eb" }}
              >
                <span style={{ color: "#4b5563", fontSize: 11, fontWeight: 500, letterSpacing: 0.2 }}>
                  Status
                </span>
                <FilterIcon />
              </div>
              <div className="flex items-center justify-end gap-1.5 px-3" style={{ width: 100 }}>
                <span style={{ color: "#4b5563", fontSize: 11, fontWeight: 500, letterSpacing: 0.2 }}>
                  Version
                </span>
                <SortIcon />
              </div>
            </div>
            {/* Rows */}
            {TABLE_ROWS.map((row, i) => (
              <div
                key={i}
                className="flex items-center"
                style={{ height: rowHeight, borderBottom: "1px solid #f3f4f6" }}
              >
                <div className="flex items-center justify-center" style={{ width: 48 }}>
                  <div
                    className="rounded-sm"
                    style={{ width: 16, height: 16, border: "1.5px solid #9ca3af", background: "#fff" }}
                  />
                </div>
                <div className="px-3 truncate" style={{ width: 220 }}>
                  <span style={{ color: "#111827", fontSize: 13 }}>{row.title}</span>
                </div>
                <div className="px-3" style={{ width: 130 }}>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5"
                    style={{
                      background: "#f9fafb",
                      border: `1px solid ${STATUS_BADGE_COLOR[row.status]}`,
                      color: "#4b5563",
                      fontSize: 12,
                    }}
                  >
                    {row.status}
                  </span>
                </div>
                <div className="px-3 text-right" style={{ width: 100 }}>
                  <span style={{ color: "#111827", fontSize: 13 }}>{row.version}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Frozen actions column */}
          <div style={{ boxShadow: "-6px 0 12px 0 rgba(0,0,0,0.1)" }}>
            <div
              className="flex items-center px-3"
              style={{ background: "#f9f8ff", height: headerHeight, borderBottom: "2px solid #e5e7eb" }}
            >
              <span style={{ color: "#4b5563", fontSize: 11, fontWeight: 500, letterSpacing: 0.2 }}>
                Actions
              </span>
            </div>
            {TABLE_ROWS.map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-1"
                style={{ height: rowHeight, borderBottom: "1px solid #f3f4f6", width: 80 }}
              >
                <EditIcon />
                <TrashIcon />
                <OverflowIcon />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-subtle leading-relaxed">
        <span className="text-periwinkle font-medium">{density} density — </span>
        {density === "Default"
          ? "36px data rows, 32px header. Standard density for most product surfaces."
          : "28px data rows and header — matches Table/Header-Row's Compact variant exactly, per the spec's own pairing rule."}
      </p>
    </div>
  );
}

export default function ComponentPreview({ slug }: { slug: string }) {
  switch (slug) {
    case "input":
      return <InputPreview />;
    case "select":
      return <SelectPreview />;
    case "textarea":
      return <TextareaPreview />;
    case "rich-text-editor":
      return <RTEPreview />;
    case "slider":
      return <SliderPreview />;
    case "table-entry-list-v2":
      return <TableEntryListPreview />;
    default:
      return null;
  }
}
