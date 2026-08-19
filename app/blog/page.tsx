import { blogPosts } from "@/content/blog";

export const metadata = { title: "Blogs — Monkstagram Studio" };

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="ledger-line text-sm text-amethyst-accessible tracking-widest uppercase mb-4">
        Blogs
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
        Longer thoughts, from the team.
      </h1>
      <p className="mt-4 max-w-2xl text-subtle">
        Write-ups on the decisions behind the system — the ones too long for
        a ledger entry.
      </p>

      <ul className="mt-12 space-y-8">
        {blogPosts.map((post) => (
          <li
            key={post.title}
            className="border-t border-shadow-border pt-8 first:border-t-0 first:pt-0"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="ledger-line text-xs text-muted mt-2">
              {post.date} &middot; {post.author}
            </p>
            <p className="mt-3 text-subtle leading-relaxed">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
