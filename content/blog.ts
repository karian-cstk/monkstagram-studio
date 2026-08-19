export type BlogPost = {
  title: string;
  date: string;
  author: string;
  excerpt: string;
};

// PLACEHOLDER DATA — replace with real posts.
export const blogPosts: BlogPost[] = [
  {
    title: "Why we killed five button variants",
    date: "2026-07-28",
    author: "Name Surname",
    excerpt:
      "A token-driven variant system meant deleting more components than we built.",
  },
  {
    title: "Designing the AI consultant's refusals",
    date: "2026-06-12",
    author: "Name Surname",
    excerpt:
      "What the assistant won't do turned out to matter more than what it will.",
  },
  {
    title: "Density modes are a research finding, not a feature",
    date: "2026-05-03",
    author: "Name Surname",
    excerpt:
      "Ops teams scan 3x more rows per session than marketing users. That number shaped the whole data table.",
  },
];
