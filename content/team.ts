export type TeamMember = {
  id: string;
  name: string;
  role: string;
  product: string;
  description: string;
  photoUrl: string | null; // null = show placeholder monogram
};

// PLACEHOLDER DATA — replace with real team members, roles, products, and photo URLs.
export const team: TeamMember[] = [
  {
    id: "member-1",
    name: "Name Surname",
    role: "Role / Title",
    product: "Product or system they own",
    description:
      "One or two lines on what they're known for and what they're currently focused on.",
    photoUrl: null,
  },
  {
    id: "member-2",
    name: "Name Surname",
    role: "Role / Title",
    product: "Product or system they own",
    description:
      "One or two lines on what they're known for and what they're currently focused on.",
    photoUrl: null,
  },
  {
    id: "member-3",
    name: "Name Surname",
    role: "Role / Title",
    product: "Product or system they own",
    description:
      "One or two lines on what they're known for and what they're currently focused on.",
    photoUrl: null,
  },
  {
    id: "member-4",
    name: "Name Surname",
    role: "Role / Title",
    product: "Product or system they own",
    description:
      "One or two lines on what they're known for and what they're currently focused on.",
    photoUrl: null,
  },
];
