export type UIKitComponent = {
  slug: string;
  name: string;
  category: string;
  status: "Stable" | "Beta" | "Deprecated";
  description: string;
  rationale: string;
  variants: string[];
  handoffFile: string;
};

// Real components scouted from the Venus 2.1 RF Figma file. The four
// mocked-up placeholders (Button, Data Table, Command Palette, Toast) that
// used to live here have been removed — none of them came from the actual
// file.
export const uiKitComponents: UIKitComponent[] = [];
