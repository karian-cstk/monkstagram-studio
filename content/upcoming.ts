export type UpcomingItem = {
  title: string;
  status: "Exploring" | "In progress" | "Planned";
  eta: string;
  description: string;
};

// PLACEHOLDER DATA — replace with the real roadmap.
export const upcoming: UpcomingItem[] = [
  {
    title: "Dark-mode-native color tokens",
    status: "In progress",
    eta: "Q4 2026",
    description:
      "Rebuilding the token layer so dark isn't an inversion of light — it's the default surface.",
  },
  {
    title: "Motion guidelines for Venus 2.1",
    status: "Exploring",
    eta: "TBD",
    description:
      "A shared vocabulary for when and how components move, so motion stops being decided per-team.",
  },
  {
    title: "Command palette, generally available",
    status: "Planned",
    eta: "Q1 2027",
    description:
      "Graduating the Cmd+K launcher out of beta once it ships in three more product surfaces.",
  },
];
