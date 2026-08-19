export type LedgerEntry = {
  date: string;
  decision: string;
  rationale: string;
  aiRole: string;
};

export const ledger: LedgerEntry[] = [
  {
    date: "2026-08-04",
    decision: "Adopted semantic token layer for Venus 2.1 RF",
    rationale:
      "Hardcoded style props meant every new variant risked drifting from the system. Tokens make the intended relationship explicit and enforceable.",
    aiRole:
      "Claude audited 40+ components for hardcoded values and proposed a token map, reviewed and adjusted by the design systems architect before rollout.",
  },
  {
    date: "2026-07-19",
    decision: "Made focus rings non-optional on form components",
    rationale:
      "Accessibility audits kept finding missing focus states shipped as one-off fixes. Removing the opt-in removes the failure mode entirely.",
    aiRole:
      "An automated WCAG audit skill flagged every non-compliant instance across the codebase in one pass instead of a manual page-by-page review.",
  },
  {
    date: "2026-06-30",
    decision: "Added density modes to the enterprise data table",
    rationale:
      "Session recordings showed ops teams scanning far more rows per session than the default spacing assumed.",
    aiRole:
      "Usage data was synthesized into a short brief that reframed the request from 'more compact' to 'let people choose their own density.'",
  },
];
