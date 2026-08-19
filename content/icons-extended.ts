export type IconEntry = {
  name: string;
  slug: string;
  category: string;
  path: string; // public path, e.g. "/icons/actions/tag.svg"
};

// Populated by the background export job covering the large icon categories
// (Flags, Actions, Set-2,3, Text Editor, Files and Documents, Arrows — 686
// icons total). Empty until that job lands its first batch.
export const iconsExtended: IconEntry[] = [];
