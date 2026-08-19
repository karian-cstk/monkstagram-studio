export type UIKitComponent = {
  name: string;
  category: string;
  status: "Stable" | "Beta" | "Deprecated";
  description: string;
  rationale: string;
};

export const uiKitComponents: UIKitComponent[] = [
  {
    name: "Button",
    category: "Actions",
    status: "Stable",
    description: "Primary, secondary, and ghost variants with icon slots.",
    rationale:
      "One button component with variants, not five components, so behavior (focus, loading, disabled) stays consistent everywhere it's used.",
  },
  {
    name: "Data Table",
    category: "Data Display",
    status: "Stable",
    description: "Sortable, filterable table with density modes and row actions.",
    rationale:
      "Enterprise SaaS users scan dense tables for hours; density modes exist because one spacing scale can't serve both a marketing dashboard and an ops console.",
  },
  {
    name: "Command Palette",
    category: "Navigation",
    status: "Beta",
    description: "Keyboard-first search and action launcher (Cmd+K).",
    rationale:
      "Power users asked to navigate without leaving the keyboard; this is the AI-consultant entry point pattern reused across the product.",
  },
  {
    name: "Toast",
    category: "Feedback",
    status: "Stable",
    description: "Transient status messages with action links.",
    rationale:
      "Confirms what happened in the interface's voice, never apologizes, and matches the verb used on the triggering control.",
  },
];
