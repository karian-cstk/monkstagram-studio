export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "2.1.0",
    date: "2026-08-04",
    title: "Venus 2.1 RF: token-driven variant architecture",
    summary:
      "Migrated component variants from hardcoded style props to a semantic token layer, cutting override drift across 40+ components and giving every state (hover, focus, disabled) a single source of truth.",
    tags: ["design-system", "tokens", "breaking"],
  },
  {
    version: "2.0.4",
    date: "2026-07-19",
    title: "Accessible focus states across form components",
    summary:
      "Every input, select, and button now ships a visible 2px Amethyst focus ring by default, meeting WCAG 2.2 AA without a per-component opt-in.",
    tags: ["accessibility", "components"],
  },
  {
    version: "2.0.3",
    date: "2026-06-30",
    title: "Data table density modes",
    summary:
      "Added compact, standard, and comfortable density modes to the enterprise data table, informed by usage data showing ops teams scan 3x more rows per session than marketing users.",
    tags: ["enterprise", "data-table"],
  },
];
