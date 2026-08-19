import AuthProvider from "@/components/AuthProvider";

export const metadata = { title: "Internal — Monkstagram Studio" };

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="bg-shadow-heavy">
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <span className="text-xs rounded-full border border-amethyst/40 text-amethyst px-3 py-1">
            Internal — Contentstack designers only
          </span>
        </div>
        {children}
      </div>
    </AuthProvider>
  );
}
